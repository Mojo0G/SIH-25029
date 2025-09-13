# ============================================================================
# COMPLETE CERTIFICATE PROCESSING PIPELINE - JSON FIELD MATCHING
# ============================================================================

import json
import re
import cv2
import pytesseract
import requests
import os

# ============================================================================
# STEP 1: OCR TEXT EXTRACTION
# ============================================================================

def grayscale(image):
    return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

def threshold(image):
    return cv2.adaptiveThreshold(
        image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 2
    )

def denoise(image):
    return cv2.medianBlur(image, 3)

def bilateralfilter(image):
    return cv2.bilateralFilter(image, 9, 75, 75)

def larger(image, scale=2):
    return cv2.resize(image, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)

def extractText(image):
    return pytesseract.image_to_string(image)

def cleanText(text):
    return " ".join(text.split())

def finaltext(image_path):
    """Extract OCR text from image"""
    print("🔄 Step 1: Extracting OCR text...")
    
    # Check if file exists
    if not os.path.exists(image_path):
        raise ValueError(f"Image not found at {image_path}")
    
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Cannot read image file: {image_path}")
    
    img = grayscale(img)
    img = threshold(img)
    img = larger(img)
    img = denoise(img)
    img = bilateralfilter(img)
    text = extractText(img)
    
    cleaned_text = cleanText(text)
    print(f"✅ OCR Text extracted ({len(cleaned_text)} characters)")
    return cleaned_text

# ============================================================================
# STEP 2: HUGGING FACE NER FOR NAMES AND INSTITUTIONS
# ============================================================================

API_URL = "https://api-inference.huggingface.co/models/dslim/bert-base-NER"
headers = {"Authorization": "Bearer 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"}

def data(payload):
    try:
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        return response.json()
    except Exception as e:
        print(f"❌ API request failed: {e}")
        return {"error": str(e)}

def extract_ner_fields(text):
    """Extract names and organizations using NER"""
    print("🔄 Step 2: Running Hugging Face NER...")
    
    keyword_outputs = data({"inputs": text})
    
    if isinstance(keyword_outputs, dict) and keyword_outputs.get("error"):
        print("❌ Hugging Face API error:", keyword_outputs["error"])
        return {}
    
    fields = {}
    if isinstance(keyword_outputs, list):
        persons = []
        orgs = []
        
        for ent in keyword_outputs:
            if not isinstance(ent, dict):
                continue
            
            label = ent.get("entity_group")
            word = ent.get("word", "").replace("##", "").strip()
            
            if label == "PER" and word:
                persons.append(word)
            elif label == "ORG" and word:
                orgs.append(word)
        
        # Get the longest person name (likely the student name)
        if persons:
            fields["studentName"] = max(persons, key=len)
        
        # Get the longest organization name (likely the institution)
        if orgs:
            fields["institutionName"] = max(orgs, key=len)
    
    print(f"✅ NER extraction complete ({len(fields)} fields found)")
    return fields

# ============================================================================
# STEP 3: REGEX EXTRACTION FOR SPECIFIC FIELDS
# ============================================================================

def extract_roll_number(text):
    """Extract roll/registration number"""
    patterns = [
        r"(?:Roll|Registration|Serial|Student|ID)\s*(?:No|Number)[:\-]?\s*([A-Z0-9]+)",
        r"([A-Z]{2,4}\d{4,8})",  # Pattern like IITD2021001
        r"(\d{4}[A-Z]{2,4}\d{3,6})",  # Pattern like 2021IITD001
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    return None

def extract_course(text):
    """Extract course/degree information"""
    patterns = [
        r"(?:Course|Program|Degree|Bachelor|B\.Tech|B\.E|B\.Sc|B\.Com|M\.Tech|M\.E|M\.Sc)[:\-]?\s*([A-Za-z\s\.&]+?)(?:\n|$|,|;)",
        r"(B\.Tech[A-Za-z\s\.]*)",
        r"(B\.E[A-Za-z\s\.]*)",
        r"(B\.Sc[A-Za-z\s\.]*)",
        r"(B\.Com[A-Za-z\s\.]*)",
        r"(Bachelor[A-Za-z\s\.]*)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            course = match.group(1).strip()
            # Clean up the course name
            course = re.sub(r'\s+', ' ', course)
            return course
    return None

def extract_cgpa(text):
    """Extract CGPA value"""
    patterns = [
        r"CGPA[:\-]?\s*([0-9]+\.?[0-9]*)",
        r"(?:Grade|GPA|Point)[:\-]?\s*([0-9]+\.?[0-9]*)",
        r"([0-9]+\.[0-9]+)\s*(?:out of|/)\s*10",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            cgpa_val = match.group(1)
            try:
                return float(cgpa_val)
            except ValueError:
                continue
    return None

def extract_student_name_regex(text):
    """Extract student name using regex patterns"""
    patterns = [
        r"(?:Student|Name|Mr\.|Ms\.)[:\-]?\s*([A-Za-z\s]+?)(?:\n|Roll|Registration|Course)",
        r"This is to certify that\s+([A-Za-z\s]+?)(?:has|have)",
        r"(?:awarded to|presented to)\s+([A-Za-z\s]+?)(?:for|who)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            # Clean up the name
            name = re.sub(r'\s+', ' ', name)
            if len(name) > 3:  # Reasonable name length
                return name
    return None

def extract_institution_regex(text):
    """Extract institution name using regex patterns"""
    patterns = [
        r"(Indian Institute of Technology[A-Za-z\s]*)",
        r"(Birla Institute of Technology[A-Za-z\s]*)",
        r"(National Institute of Technology[A-Za-z\s]*)",
        r"(Delhi University)",
        r"(University of[A-Za-z\s]*)",
        r"(?:Institute|University|College)[:\-]?\s*([A-Za-z\s,]+?)(?:\n|Estd|Founded)",
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            institution = match.group(1).strip()
            institution = re.sub(r'\s+', ' ', institution)
            return institution
    return None

# ============================================================================
# STEP 4: MAIN EXTRACTION FUNCTION
# ============================================================================

def extract_certificate_fields(image_path):
    """Extract all certificate fields to match JSON structure"""
    print("🔄 Step 3: Extracting certificate fields...")
    
    # Get OCR text
    text = finaltext(image_path)
    
    # Initialize extracted data structure
    extracted_data = {}
    
    # Get NER fields first
    ner_fields = extract_ner_fields(text)
    
    # Extract each field with fallbacks
    
    # 1. Student Name
    student_name = ner_fields.get("studentName") or extract_student_name_regex(text)
    if student_name:
        extracted_data["studentName"] = student_name
    
    # 2. Roll Number
    roll_number = extract_roll_number(text)
    if roll_number:
        extracted_data["rollNumber"] = roll_number
    
    # 3. Institution Name
    institution = ner_fields.get("institutionName") or extract_institution_regex(text)
    if institution:
        extracted_data["institutionName"] = institution
    
    # 4. Course
    course = extract_course(text)
    if course:
        extracted_data["course"] = course
    
    # 5. CGPA
    cgpa = extract_cgpa(text)
    if cgpa:
        extracted_data["cgpa"] = cgpa
    
    print(f"✅ Field extraction complete ({len(extracted_data)} fields found)")
    return extracted_data

# ============================================================================
# STEP 5: JSON VALIDATION FUNCTIONS (ADDED FOR API COMPATIBILITY)
# ============================================================================

def load_json_database():
    """Load JSON database from backend/data folder"""
    import os
    
    print("🔍 Looking for database file...")
    print(f"📁 Current working directory: {os.getcwd()}")
    print(f"📁 Script location: {os.path.dirname(__file__)}")
    
    # Updated paths based on your directory structure
    possible_paths = [
        # From ai/ directory to ../backend/data/Graduation.json
        "../backend/data/Graduation.json",
        os.path.join("..", "backend", "data", "Graduation.json"),
        
        # Absolute path from script location
        os.path.join(os.path.dirname(__file__), "..", "..", "backend", "data", "Graduation.json"),
        
        # From sih/ root directory
        os.path.join("backend", "data", "Graduation.json"),
        
        # Fallback paths
        "backend/data/Graduation.json",
        "Graduation.json"
    ]
    
    for json_path in possible_paths:
        print(f"🔍 Trying path: {json_path}")
        abs_path = os.path.abspath(json_path)
        print(f"🔍 Absolute path: {abs_path}")
        
        if os.path.exists(json_path):
            try:
                with open(json_path, 'r') as f:
                    data = json.load(f)
                    print(f"✅ JSON database loaded from: {json_path} ({len(data)} records)")
                    return data
            except Exception as e:
                print(f"❌ Error loading {json_path}: {e}")
                continue
        else:
            print(f"❌ File not found: {json_path}")
    
    print("❌ JSON database not found in any expected location")
    return None

def find_matching_record(extracted_data, json_data):
    """Find matching record by roll number or student name"""
    if not json_data:
        return None
        
    # Try to match by roll number first
    if "rollNumber" in extracted_data:
        for record in json_data:
            if record.get("rollNumber") == extracted_data["rollNumber"]:
                return record
    
    # Try to match by student name if no roll number match
    if "studentName" in extracted_data:
        extracted_name = extracted_data["studentName"].lower().strip()
        for record in json_data:
            db_name = record.get("studentName", "").lower().strip()
            if extracted_name in db_name or db_name in extracted_name:
                return record
    
    return None

def compare_fields(extracted_data, matching_record):
    """Compare extracted data with JSON record field by field"""
    field_comparisons = {}
    total_score = 0
    total_fields = 0
    
    # Define field mappings and comparison functions
    fields_to_compare = [
        ("studentName", str, "Student Name"),
        ("rollNumber", str, "Roll Number"), 
        ("institutionName", str, "Institution Name"),
        ("course", str, "Course"),
        ("cgpa", float, "CGPA")
    ]
    
    for field_name, field_type, display_name in fields_to_compare:
        extracted_val = extracted_data.get(field_name)
        json_val = matching_record.get(field_name)
        
        comparison = {
            "extracted": extracted_val,
            "json": json_val,
            "match": False,
            "score": 0.0
        }
        
        if extracted_val is not None and json_val is not None:
            total_fields += 1
            
            if field_type == str:
                # String comparison (case insensitive)
                ext_str = str(extracted_val).lower().strip()
                json_str = str(json_val).lower().strip()
                
                if ext_str == json_str:
                    comparison["match"] = True
                    comparison["score"] = 1.0
                    total_score += 1.0
                else:
                    # Partial match scoring
                    if ext_str in json_str or json_str in ext_str:
                        comparison["score"] = 0.7
                        total_score += 0.7
                    else:
                        comparison["score"] = 0.0
            
            elif field_type == float:
                # Numeric comparison
                try:
                    ext_num = float(extracted_val)
                    json_num = float(json_val)
                    
                    if abs(ext_num - json_num) < 0.1:  # Allow small difference
                        comparison["match"] = True
                        comparison["score"] = 1.0
                        total_score += 1.0
                    else:
                        comparison["score"] = 0.0
                except ValueError:
                    comparison["score"] = 0.0
        
        field_comparisons[display_name] = comparison
    
    overall_accuracy = (total_score / total_fields * 100) if total_fields > 0 else 0
    return field_comparisons, overall_accuracy

def validate_certificate_data(extracted_data, json_data=None):
    """Complete validation pipeline - ADDED FOR API COMPATIBILITY"""
    print("🚀 STARTING CERTIFICATE VALIDATION")
    print("=" * 70)
    
    try:
        # If no JSON data provided, try to load it
        if json_data is None:
            json_data = load_json_database()
        
        if not json_data:
            return {
                'status': 'error',
                'message': 'Database not found or empty',
                'accuracy': 0,
                'is_valid': False,
                'is_verified': False
            }
        
        # Find matching record
        print("🔍 Finding matching record...")
        matching_record = find_matching_record(extracted_data, json_data)
        
        if not matching_record:
            print("❌ NO MATCHING RECORD FOUND")
            return {
                'status': 'not_found',
                'message': 'No matching record found in database',
                'extracted_data': extracted_data,
                'accuracy': 0,
                'is_valid': False,
                'is_verified': False
            }
        
        print("✅ MATCHING RECORD FOUND!")
        print(f"📋 Record ID: {matching_record.get('id')}")
        
        # Compare fields
        print("🔄 Comparing fields...")
        field_comparisons, accuracy = compare_fields(extracted_data, matching_record)
        
        # Final results
        is_verified = matching_record.get('verifiedStatus', False)
        is_valid = accuracy >= 70 and is_verified
        
        print("=" * 70)
        print("🎯 FINAL VALIDATION RESULTS")
        print("=" * 70)
        print(f"Field Accuracy: {accuracy:.1f}%")
        print(f"Database Status: {'✅ Verified' if is_verified else '❌ Not Verified'}")
        print(f"Overall Result: {'✅ CERTIFICATE VALID' if is_valid else '❌ CERTIFICATE INVALID'}")
        print("=" * 70)
        
        return {
            'status': 'found',
            'extracted_data': extracted_data,
            'matching_record': matching_record,
            'field_comparisons': field_comparisons,
            'accuracy': accuracy,
            'is_valid': is_valid,
            'is_verified': is_verified,
            'total_records_searched': len(json_data)
        }
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return {
            'status': 'error',
            'message': str(e),
            'accuracy': 0,
            'is_valid': False,
            'is_verified': False
        }

# ============================================================================
# STANDALONE EXECUTION (FOR TESTING) - UNCHANGED
# ============================================================================

if __name__ == "__main__":
    print("🎓 CERTIFICATE VALIDATOR - JSON FIELD MATCHING")
    print("=" * 70)
    
    # Show available files
    print("📁 Current directory:", os.getcwd())
    print("\n📋 Available image files:")
    image_files = [f for f in os.listdir('.') if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    if image_files:
        for i, file in enumerate(image_files, 1):
            print(f"   {i}. {file}")
    else:
        print("   No image files found!")
    
    print("\n📋 Available JSON files:")
    json_files = [f for f in os.listdir('.') if f.lower().endswith('.json')]
    if json_files:
        for i, file in enumerate(json_files, 1):
            print(f"   {i}. {file}")
    else:
        print("   No JSON files found!")
    
    print("=" * 70)
    
    # Configure your files here for testing
    image_path = "certificate.png"      # CHANGE THIS TO YOUR IMAGE FILE
    json_file = "backend/data/Graduation.json"        # CHANGE THIS TO YOUR JSON FILE
    
    if os.path.exists(image_path) and os.path.exists(json_file):
        print(f"🎯 Processing: {image_path}")
        
        # Load JSON data
        with open(json_file, 'r') as f:
            json_data = json.load(f)
        
        # Extract fields
        extracted_data = extract_certificate_fields(image_path)
        
        # Validate
        result = validate_certificate_data(extracted_data, json_data)
        
        if result:
            print(f"\n💾 Validation completed!")
            print(f"📈 Extracted {len(result.get('extracted_data', {}))} fields")
            print(f"🎯 Final result: {'VALID' if result.get('is_valid') else 'INVALID'}")
        else:
            print("\n❌ Validation failed!")
    else:
        print(f"❌ Files not found:")
        print(f"   Image: {image_path} ({'✅' if os.path.exists(image_path) else '❌'})")
        print(f"   Database: {json_file} ({'✅' if os.path.exists(json_file) else '❌'})")

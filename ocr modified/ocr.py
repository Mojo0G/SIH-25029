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
        print(f"❌ File not found: {image_path}")
        print(f"📁 Current directory: {os.getcwd()}")
        print("📋 Available files:")
        for file in os.listdir('.'):
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                print(f"   - {file}")
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
    
    # Print OCR text for debugging
    print(f"\n📄 OCR TEXT PREVIEW:")
    print("-" * 50)
    print(text[:500] + "..." if len(text) > 500 else text)
    print("-" * 50)
    
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
# STEP 5: JSON VALIDATION
# ============================================================================

def load_json_data(json_file):
    """Load the true data from JSON file"""
    if not os.path.exists(json_file):
        print(f"❌ JSON file not found: {json_file}")
        print(f"📁 Current directory: {os.getcwd()}")
        print("📋 Available JSON files:")
        for file in os.listdir('.'):
            if file.lower().endswith('.json'):
                print(f"   - {file}")
        raise ValueError(f"JSON file not found: {json_file}")
    
    with open(json_file, 'r') as f:
        return json.load(f)

def find_matching_record(extracted_data, json_data):
    """Find matching record by roll number or student name"""
    
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

# ============================================================================
# STEP 6: MAIN PROCESSING FUNCTION
# ============================================================================

def validate_certificate(image_path, json_file="true_data.json"):
    """Complete pipeline to validate certificate"""
    
    print("🚀 STARTING CERTIFICATE VALIDATION")
    print("=" * 70)
    print(f"📁 Image: {image_path}")
    print(f"🗄️  Database: {json_file}")
    print("=" * 70)
    
    try:
        # Step 1: Extract fields from certificate
        extracted_data = extract_certificate_fields(image_path)
        
        print("\n📊 EXTRACTED DATA:")
        print("-" * 50)
        if not extracted_data:
            print("❌ No data extracted!")
            return None
        
        for key, value in extracted_data.items():
            print(f"{key}: {value}")
        
        # Step 2: Load JSON database
        print("\n🔄 Step 4: Loading database...")
        json_data = load_json_data(json_file)
        print(f"✅ Database loaded ({len(json_data)} records)")
        
        # Step 3: Find matching record
        print("\n🔍 Step 5: Finding matching record...")
        matching_record = find_matching_record(extracted_data, json_data)
        
        if not matching_record:
            print("❌ NO MATCHING RECORD FOUND")
            print(f"🔍 Searched for:")
            if "rollNumber" in extracted_data:
                print(f"   Roll Number: {extracted_data['rollNumber']}")
            if "studentName" in extracted_data:
                print(f"   Student Name: {extracted_data['studentName']}")
            return None
        
        print("✅ MATCHING RECORD FOUND!")
        print(f"📋 Record ID: {matching_record.get('id')}")
        
        # Step 4: Compare fields
        print("\n🔄 Step 6: Comparing fields...")
        field_comparisons, accuracy = compare_fields(extracted_data, matching_record)
        
        # Display detailed comparison
        print("\n" + "=" * 70)
        print("🔍 DETAILED FIELD COMPARISON")
        print("=" * 70)
        
        for field_name, comparison in field_comparisons.items():
            status = "✅" if comparison["match"] else "❌"
            score = comparison["score"]
            
            print(f"\n{field_name}:")
            print(f"  Extracted: {comparison['extracted']}")
            print(f"  Database:  {comparison['json']}")
            print(f"  Status:    {status} ({score*100:.0f}% match)")
        
        # Final results
        is_verified = matching_record.get('verifiedStatus', False)
        is_valid = accuracy >= 70 and is_verified
        
        print("\n" + "=" * 70)
        print("🎯 FINAL VALIDATION RESULTS")
        print("=" * 70)
        print(f"Field Accuracy: {accuracy:.1f}%")
        print(f"Database Status: {'✅ Verified' if is_verified else '❌ Not Verified'}")
        print(f"Overall Result: {'✅ CERTIFICATE VALID' if is_valid else '❌ CERTIFICATE INVALID'}")
        print("=" * 70)
        
        return {
            'extracted_data': extracted_data,
            'matching_record': matching_record,
            'field_comparisons': field_comparisons,
            'accuracy': accuracy,
            'is_valid': is_valid,
            'is_verified': is_verified
        }
        
    except Exception as e:
        print(f"❌ ERROR: {str(e)}")
        return None

# ============================================================================
# MAIN EXECUTION
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
    
    # Configure your files here
    image_path = "certificate.png"      # CHANGE THIS TO YOUR IMAGE FILE
    json_file = "true_data.json"        # CHANGE THIS TO YOUR JSON FILE
    
    print(f"🎯 Processing: {image_path}")
    
    # Run the validation
    result = validate_certificate(image_path, json_file)
    
    if result:
        print(f"\n💾 Validation completed!")
        print(f"📈 Extracted {len(result['extracted_data'])} fields")
        print(f"🎯 Final result: {'VALID' if result['is_valid'] else 'INVALID'}")
        
        # Save results to file
        with open('validation_results.json', 'w') as f:
            # Make result JSON serializable
            save_result = {
                'extracted_data': result['extracted_data'],
                'matching_record': result['matching_record'],
                'accuracy': result['accuracy'],
                'is_valid': result['is_valid'],
                'is_verified': result['is_verified']
            }
            json.dump(save_result, f, indent=2)
        print("💾 Results saved to 'validation_results.json'")
    else:
        print("\n❌ Validation failed!")
        print("\n💡 Tips:")
        print("   1. Make sure your certificate image is clear and readable")
        print("   2. Check that the file names match exactly") 
        print("   3. Ensure the certificate contains the required fields")
        print("   4. Verify your JSON database has matching records")
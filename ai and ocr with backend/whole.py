# ============================================================================
# COMPLETE CERTIFICATE VERIFICATION SYSTEM - OCR + ELA + API
# ============================================================================

import json
import re
import cv2
import pytesseract
import requests
import os
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
import base64
from datetime import datetime
import tempfile
import shutil

# ============================================================================
# CONFIGURATION
# ============================================================================

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH']=16*1024*1024
UPLOAD_FOLDER = 'uploads'
RESULTS_FOLDER = 'results'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Hugging Face API configuration
API_URL = "https://api-inference.huggingface.co/models/dslim/bert-base-NER"
headers = {"Authorization": "Bearer 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"}

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# ============================================================================
# OCR MODULE - ENHANCED
# ============================================================================

class CertificateOCR:
    
    @staticmethod
    def preprocess_image(image):
        """Enhanced image preprocessing for better OCR"""
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply adaptive threshold
        thresh = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY, 31, 2
        )
        
        # Resize image for better OCR
        scale = 2
        resized = cv2.resize(thresh, None, fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
        
        # Apply denoising
        denoised = cv2.medianBlur(resized, 3)
        
        # Apply bilateral filter
        filtered = cv2.bilateralFilter(denoised, 9, 75, 75)
        
        return filtered

    @staticmethod
    def extract_text(image_path):
        """Extract OCR text from image"""
        print("🔄 Starting OCR text extraction...")
        
        if not os.path.exists(image_path):
            raise ValueError(f"Image not found at {image_path}")
        
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Cannot read image file: {image_path}")
        
        processed_img = CertificateOCR.preprocess_image(img)
        text = pytesseract.image_to_string(processed_img)
        
        # Clean extracted text
        cleaned_text = " ".join(text.split())
        print(f"✅ OCR Text extracted ({len(cleaned_text)} characters)")
        return cleaned_text

    @staticmethod
    def extract_ner_fields(text):
        """Extract names and organizations using NER"""
        print("🔄 Running Hugging Face NER...")
        
        try:
            response = requests.post(API_URL, headers=headers, json={"inputs": text}, timeout=30)
            keyword_outputs = response.json()
        except Exception as e:
            print(f"❌ NER API request failed: {e}")
            return {}
        
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

    @staticmethod
    def extract_regex_fields(text):
        """Extract specific fields using regex patterns"""
        fields = {}
        
        # Roll/Registration Number
        roll_patterns = [
            r"(?:Roll|Registration|Serial|Student|ID)\s*(?:No|Number)[:\-]?\s*([A-Z0-9]+)",
            r"([A-Z]{2,4}\d{4,8})",
            r"(\d{4}[A-Z]{2,4}\d{3,6})",
        ]
        
        for pattern in roll_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["rollNumber"] = match.group(1)
                break
        
        # Course/Degree
        course_patterns = [
            r"(?:Course|Program|Degree|Bachelor|B\.Tech|B\.E|B\.Sc|B\.Com|M\.Tech|M\.E|M\.Sc)[:\-]?\s*([A-Za-z\s\.&]+?)(?:\n|$|,|;)",
            r"(B\.Tech[A-Za-z\s\.]*)",
            r"(B\.E[A-Za-z\s\.]*)",
            r"(Bachelor[A-Za-z\s\.]*)",
        ]
        
        for pattern in course_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                course = re.sub(r'\s+', ' ', match.group(1).strip())
                fields["course"] = course
                break
        
        # CGPA
        cgpa_patterns = [
            r"CGPA[:\-]?\s*([0-9]+\.?[0-9]*)",
            r"(?:Grade|GPA|Point)[:\-]?\s*([0-9]+\.?[0-9]*)",
            r"([0-9]+\.[0-9]+)\s*(?:out of|/)\s*10",
        ]
        
        for pattern in cgpa_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                try:
                    fields["cgpa"] = float(match.group(1))
                    break
                except ValueError:
                    continue
        
        # Student Name (regex fallback)
        if "studentName" not in fields:
            name_patterns = [
                r"(?:Student|Name|Mr\.|Ms\.)[:\-]?\s*([A-Za-z\s]+?)(?:\n|Roll|Registration|Course)",
                r"This is to certify that\s+([A-Za-z\s]+?)(?:has|have)",
                r"(?:awarded to|presented to)\s+([A-Za-z\s]+?)(?:for|who)",
            ]
            
            for pattern in name_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    name = re.sub(r'\s+', ' ', match.group(1).strip())
                    if len(name) > 3:
                        fields["studentName"] = name
                        break
        
        # Institution Name (regex fallback)
        if "institutionName" not in fields:
            inst_patterns = [
                r"(Indian Institute of Technology[A-Za-z\s]*)",
                r"(Birla Institute of Technology[A-Za-z\s]*)",
                r"(National Institute of Technology[A-Za-z\s]*)",
                r"(Delhi University)",
                r"(University of[A-Za-z\s]*)",
                r"(?:Institute|University|College)[:\-]?\s*([A-Za-z\s,]+?)(?:\n|Estd|Founded)",
            ]
            
            for pattern in inst_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    institution = re.sub(r'\s+', ' ', match.group(1).strip())
                    fields["institutionName"] = institution
                    break
        
        return fields

    @staticmethod
    def extract_all_fields(image_path):
        """Extract all certificate fields"""
        print("🔄 Starting field extraction...")
        
        # Get OCR text
        text = CertificateOCR.extract_text(image_path)
        
        # Get NER fields
        ner_fields = CertificateOCR.extract_ner_fields(text)
        
        # Get regex fields
        regex_fields = CertificateOCR.extract_regex_fields(text)
        
        # Combine fields (NER takes precedence for names/organizations)
        extracted_data = {**regex_fields, **ner_fields}
        
        print(f"✅ Field extraction complete ({len(extracted_data)} fields found)")
        return extracted_data, text

# ============================================================================
# ELA VERIFICATION MODULE - ENHANCED
# ============================================================================

class ELAVerifier:
    
    @staticmethod
    def detect_tampering_with_analysis(image_path, output_dir):
        """Enhanced ELA analysis with detailed output"""
        try:
            print("🔄 Starting ELA analysis...")
            
            # Load original image
            original_pil = Image.open(image_path)
            if original_pil.mode != 'RGB':
                original_pil = original_pil.convert('RGB')
            
            original_cv = cv2.imread(image_path)
            
            # Test multiple JPEG qualities
            qualities = [85, 75, 95]
            max_score = 0
            best_ela = None
            best_quality = 85
            
            temp_file = os.path.join(output_dir, 'temp_recompressed.jpg')
            
            for quality in qualities:
                # Recompress at different qualities
                original_pil.save(temp_file, 'JPEG', quality=quality)
                
                original = cv2.imread(image_path)
                recompressed = cv2.imread(temp_file)
                
                # Ensure same dimensions
                if original.shape != recompressed.shape:
                    recompressed = cv2.resize(recompressed, (original.shape[1], original.shape[0]))
                
                # Calculate ELA
                diff = cv2.absdiff(original, recompressed)
                enhanced_diff = diff * 15
                enhanced_diff = np.clip(enhanced_diff, 0, 255)
                gray_diff = cv2.cvtColor(enhanced_diff.astype(np.uint8), cv2.COLOR_BGR2GRAY)
                
                # Calculate metrics
                std_dev = np.std(gray_diff)
                mean_val = np.mean(gray_diff)
                max_val = np.max(gray_diff)
                high_error_pixels = np.sum(gray_diff > 30) / gray_diff.size
                very_high_error_pixels = np.sum(gray_diff > 100) / gray_diff.size
                
                # Composite score
                current_score = (std_dev * 0.4 + mean_val * 0.3 + max_val * 0.1 + 
                               high_error_pixels * 100 + very_high_error_pixels * 200)
                
                if current_score > max_score:
                    max_score = current_score
                    best_ela = gray_diff
                    best_quality = quality
            
            # Find suspicious regions
            boxes = []
            marked_image = original_cv.copy()
            
            if best_ela is not None:
                threshold_value = max(25, int(np.mean(best_ela) + 2 * np.std(best_ela)))
                _, mask = cv2.threshold(best_ela, threshold_value, 255, cv2.THRESH_BINARY)
                
                # Morphological operations
                kernel = np.ones((5, 5), np.uint8)
                mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
                mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
                
                # Find contours
                contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                
                for contour in contours:
                    x, y, w, h = cv2.boundingRect(contour)
                    
                    min_size = 20
                    if w > min_size and h > min_size:
                        region_ela = best_ela[y:y+h, x:x+w]
                        region_score = np.mean(region_ela) + np.std(region_ela)
                        
                        if region_score > 15:
                            boxes.append((x, y, w, h, region_score))
                
                # Sort by suspicion level
                boxes.sort(key=lambda box: box[4], reverse=True)
                
                # Draw bounding boxes
                for i, (x, y, w, h, region_score) in enumerate(boxes[:5]):
                    if region_score > 50:
                        color = (0, 0, 255)  # Red for high suspicion
                        thickness = 3
                        label = "HIGH RISK"
                    elif region_score > 25:
                        color = (0, 165, 255)  # Orange for medium suspicion
                        thickness = 2
                        label = "MEDIUM RISK"
                    else:
                        color = (0, 255, 255)  # Yellow for low suspicion
                        thickness = 2
                        label = "LOW RISK"
                    
                    cv2.rectangle(marked_image, (x, y), (x + w, y + h), color, thickness)
                    cv2.putText(marked_image, label, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
            
            # Clean up temp file
            if os.path.exists(temp_file):
                os.remove(temp_file)
            
            # Determine verdict
            threshold = 8.0
            if max_score > 25:
                verdict = "TAMPERED"
                risk_level = "HIGH"
            elif max_score > threshold:
                verdict = "TAMPERED"
                risk_level = "MEDIUM"
            else:
                verdict = "GENUINE"
                risk_level = "LOW"
            
            # Save analysis images
            base_name = os.path.splitext(os.path.basename(image_path))[0]
            ela_path = os.path.join(output_dir, f"{base_name}_ela_analysis.jpg")
            marked_path = os.path.join(output_dir, f"{base_name}_with_boxes.jpg")
            
            if best_ela is not None:
                cv2.imwrite(ela_path, best_ela)
            
            cv2.imwrite(marked_path, marked_image)
            
            print(f"✅ ELA analysis complete - Score: {max_score:.2f}, Verdict: {verdict}")
            
            return {
                "verdict": verdict,
                "score": max_score,
                "risk_level": risk_level,
                "quality_used": best_quality,
                "suspicious_regions": len(boxes),
                "ela_image_path": ela_path,
                "marked_image_path": marked_path,
                "boxes": [(x, y, w, h) for x, y, w, h, _ in boxes[:5]]
            }
            
        except Exception as e:
            print(f"❌ ELA analysis error: {str(e)}")
            return {
                "verdict": "ERROR",
                "score": 0,
                "risk_level": "UNKNOWN",
                "error": str(e)
            }

# ============================================================================
# DATABASE VALIDATION (OPTIONAL)
# ============================================================================

class DatabaseValidator:
    
    @staticmethod
    def load_database(json_file):
        """Load validation database"""
        if os.path.exists(json_file):
            with open(json_file, 'r') as f:
                return json.load(f)
        return []

    @staticmethod
    def validate_against_database(extracted_data, database):
        """Validate extracted data against database"""
        if not database:
            return {"status": "no_database", "message": "No validation database provided"}
        
        # Try to find matching record
        for record in database:
            if (extracted_data.get("rollNumber") == record.get("rollNumber") or
                extracted_data.get("studentName") == record.get("studentName")):
                
                # Calculate match score
                matches = 0
                total_fields = 0
                
                for field in ["studentName", "rollNumber", "institutionName", "course", "cgpa"]:
                    if field in extracted_data and field in record:
                        total_fields += 1
                        if str(extracted_data[field]).lower() == str(record[field]).lower():
                            matches += 1
                
                accuracy = (matches / total_fields * 100) if total_fields > 0 else 0
                is_verified = record.get('verifiedStatus', False)
                
                return {
                    "status": "found",
                    "accuracy": accuracy,
                    "is_verified": is_verified,
                    "matching_record": record
                }
        
        return {"status": "not_found", "message": "No matching record found in database"}

# ============================================================================
# API ENDPOINTS
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Certificate verification system is running"})

@app.route('/verify-certificate', methods=['POST'])
def verify_certificate():
    """Main endpoint to verify certificate"""
    try:
        # Check if file is uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only PNG, JPG, JPEG allowed"}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{filename}"
        filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
        file.save(filepath)
        
        # Create result directory for this analysis
        result_dir = os.path.join(RESULTS_FOLDER, timestamp)
        os.makedirs(result_dir, exist_ok=True)
        
        print(f"🔄 Processing file: {unique_filename}")
        
        # Step 1: OCR Extraction
        ocr_processor = CertificateOCR()
        extracted_data, raw_text = ocr_processor.extract_all_fields(filepath)
        
        # Step 2: ELA Verification
        ela_verifier = ELAVerifier()
        ela_results = ela_verifier.detect_tampering_with_analysis(filepath, result_dir)
        
        # Step 3: Database validation (if database file provided)
        database_results = None
        if 'database' in request.files:
            db_file = request.files['database']
            if db_file and db_file.filename.endswith('.json'):
                db_path = os.path.join(result_dir, 'database.json')
                db_file.save(db_path)
                database = DatabaseValidator.load_database(db_path)
                database_results = DatabaseValidator.validate_against_database(extracted_data, database)
        
        # Prepare response
        response_data = {
            "timestamp": timestamp,
            "filename": filename,
            "ocr_results": {
                "extracted_fields": extracted_data,
                "field_count": len(extracted_data),
                "raw_text_length": len(raw_text)
            },
            "ela_results": ela_results,
            "database_validation": database_results,
            "overall_verdict": {
                "authenticity": ela_results["verdict"],
                "data_extracted": len(extracted_data) > 0,
                "risk_assessment": ela_results["risk_level"]
            }
        }
        
        # Add image data if ELA analysis was successful
        if ela_results["verdict"] != "ERROR":
            try:
                # Encode images to base64 for frontend
                if os.path.exists(ela_results["ela_image_path"]):
                    response_data["images"] = {
                        "ela_analysis": encode_image_to_base64(ela_results["ela_image_path"]),
                        "marked_regions": encode_image_to_base64(ela_results["marked_image_path"])
                    }
            except Exception as img_error:
                print(f"⚠️ Image encoding error: {img_error}")
        
        # Save complete results
        results_file = os.path.join(result_dir, 'complete_results.json')
        with open(results_file, 'w') as f:
            # Create a copy without base64 images for file storage
            file_results = {k: v for k, v in response_data.items() if k != "images"}
            json.dump(file_results, f, indent=2, default=str)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        print(f"✅ Analysis complete for {filename}")
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"❌ Error processing request: {str(e)}")
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

@app.route('/get-result/<timestamp>', methods=['GET'])
def get_result(timestamp):
    """Get saved analysis results"""
    try:
        result_file = os.path.join(RESULTS_FOLDER, timestamp, 'complete_results.json')
        if not os.path.exists(result_file):
            return jsonify({"error": "Result not found"}), 404
        
        with open(result_file, 'r') as f:
            results = json.load(f)
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve results: {str(e)}"}), 500

@app.route('/get-image/<timestamp>/<image_type>', methods=['GET'])
def get_image(timestamp, image_type):
    """Get analysis images"""
    try:
        if image_type not in ['ela', 'marked']:
            return jsonify({"error": "Invalid image type"}), 400
        
        result_dir = os.path.join(RESULTS_FOLDER, timestamp)
        
        # Find the appropriate image file
        image_files = os.listdir(result_dir)
        target_file = None
        
        for file in image_files:
            if image_type == 'ela' and 'ela_analysis' in file:
                target_file = file
                break
            elif image_type == 'marked' and 'with_boxes' in file:
                target_file = file
                break
        
        if not target_file:
            return jsonify({"error": "Image not found"}), 404
        
        image_path = os.path.join(result_dir, target_file)
        return send_file(image_path, as_attachment=False)
        
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve image: {str(e)}"}), 500

@app.route('/cleanup/<timestamp>', methods=['DELETE'])
def cleanup_results(timestamp):
    """Clean up analysis results"""
    try:
        result_dir = os.path.join(RESULTS_FOLDER, timestamp)
        if os.path.exists(result_dir):
            shutil.rmtree(result_dir)
            return jsonify({"message": "Results cleaned up successfully"}), 200
        else:
            return jsonify({"error": "Results not found"}), 404
            
    except Exception as e:
        return jsonify({"error": f"Cleanup failed: {str(e)}"}), 500

# ============================================================================
# MAIN APPLICATION
# ============================================================================

if __name__ == '__main__':
    print("🚀 CERTIFICATE VERIFICATION SYSTEM")
    print("=" * 70)
    print("📱 API Endpoints:")
    print("   POST /verify-certificate - Main verification endpoint")
    print("   GET  /get-result/<timestamp> - Retrieve saved results")
    print("   GET  /get-image/<timestamp>/<type> - Get analysis images")
    print("   DELETE /cleanup/<timestamp> - Clean up results")
    print("   GET  /health - Health check")
    print("=" * 70)
    print("🔧 Requirements:")
    print("   - Upload 'image' file (PNG/JPG/JPEG)")
    print("   - Optional: Upload 'database' file (JSON)")
    print("=" * 70)
    
    # Run the Flask application
    app.run(debug=True, host='0.0.0.0', port=5001)
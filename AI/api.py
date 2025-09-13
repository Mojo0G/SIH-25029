import os, pytesseract
TESSERACT_PATH = "/opt/homebrew/bin/tesseract"  # Apple Silicon default path
pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH

import os
import tempfile
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import sys
from importlib.machinery import SourceFileLoader

# Add the AI directory to Python path to import elaverifier
sys.path.append(os.path.dirname(__file__))
from elaverifier import check_identity_card

# Load OCR module from folder with a space in its name ("ocr modified/ocr.py")
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))
OCR_FILE_PATH = os.path.join(PROJECT_ROOT, "ocr modified", "ocr.py")

print(f"🔍 Looking for OCR module at: {OCR_FILE_PATH}")
if not os.path.exists(OCR_FILE_PATH):
    print(f"❌ OCR file not found at: {OCR_FILE_PATH}")
    print(f"📁 Current directory: {os.getcwd()}")
    print(f"📁 Project root: {PROJECT_ROOT}")
else:
    print(f"✅ OCR file found at: {OCR_FILE_PATH}")

ocr_module = SourceFileLoader("ocr_module", OCR_FILE_PATH).load_module()

try:
    from ultralytics import YOLO
    ULTRA_AVAILABLE = True
except Exception:
    ULTRA_AVAILABLE = False

app = FastAPI(title="SIH-2025 AI Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _save_temp(file: UploadFile) -> str:
    """Save uploaded file with original filename (no UUID)"""
    temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    
    # Use original filename instead of UUID
    original_filename = file.filename or "upload.bin"
    temp_path = os.path.join(temp_dir, original_filename)
    
    # Handle duplicate filenames by appending a number
    counter = 1
    base_name, ext = os.path.splitext(original_filename)
    while os.path.exists(temp_path):
        temp_path = os.path.join(temp_dir, f"{base_name}_{counter}{ext}")
        counter += 1
    
    with open(temp_path, "wb") as f:
        f.write(file.file.read())
    
    print(f"✅ File saved as: {temp_path}")
    return temp_path

@app.get("/health")
def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "tesseract_available": os.path.exists(TESSERACT_PATH),
        "yolo_available": ULTRA_AVAILABLE,
        "ocr_module_available": os.path.exists(OCR_FILE_PATH)
    }

@app.get("/images/{filename}")
async def get_generated_image(filename: str):
    """Serve generated analysis images with proper headers"""
    try:
        # Look for images in the temp directory
        temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
        image_path = os.path.join(temp_dir, filename)
        
        if os.path.exists(image_path):
            print(f"✅ Serving image: {image_path}")
            return FileResponse(
                image_path, 
                media_type="image/jpeg",
                headers={
                    "Cache-Control": "no-cache",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET",
                    "Access-Control-Allow-Headers": "*"
                }
            )
        else:
            print(f"❌ Image not found: {image_path}")
            # List available files for debugging
            available_files = []
            if os.path.exists(temp_dir):
                available_files = [f for f in os.listdir(temp_dir) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
                print(f"📁 Available files: {available_files}")
            
            return JSONResponse(
                status_code=404, 
                content={
                    "error": f"Image not found: {filename}",
                    "available_files": available_files
                }
            )
    except Exception as e:
        print(f"❌ Error serving image {filename}: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.post("/ocr/extract")
async def ocr_extract(file: UploadFile = File(...)):
    """Extract text and fields from certificate image only"""
    temp_path = None
    try:
        print(f"🔄 OCR extraction for: {file.filename}")
        temp_path = _save_temp(file)
        
        # Extract raw text
        text = ocr_module.finaltext(temp_path)
        
        # Extract structured fields
        fields = ocr_module.extract_certificate_fields(temp_path)
        
        print(f"✅ OCR completed - {len(fields)} fields extracted")
        
        return {
            "success": True, 
            "filename": file.filename,
            "text": text, 
            "fields": fields,
            "field_count": len(fields)
        }
        
    except Exception as e:
        print(f"❌ OCR extraction error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                print(f"🗑️ Cleaned up: {temp_path}")
            except:
                pass

@app.post("/validate-certificate")
async def validate_certificate(file: UploadFile = File(...)):
    """OCR + Database Validation Only (No ELA)"""
    temp_path = None
    try:
        print(f"🔄 Certificate validation for: {file.filename}")
        temp_path = _save_temp(file)
        
        # Extract certificate fields
        print("🔄 Extracting certificate fields...")
        fields = ocr_module.extract_certificate_fields(temp_path)
        
        # Validate against database
        print("🔄 Validating against database...")
        validation_result = ocr_module.validate_certificate_data(fields)
        
        print(f"✅ Validation completed - Status: {validation_result.get('status')}")
        
        return {
            "success": True,
            "filename": file.filename,
            "extracted_fields": fields,
            "validation": validation_result
        }
        
    except Exception as e:
        print(f"❌ Certificate validation error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
    finally:
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                print(f"🗑️ Cleaned up: {temp_path}")
            except:
                pass

@app.post("/ai/verify")
async def ai_verify(file: UploadFile = File(...)):
    """Complete verification: Database + ELA (Database takes priority for verification)"""
    temp_path = None
    try:
        print(f"🚀 Starting COMPLETE AI verification for: {file.filename}")
        temp_path = _save_temp(file)
        
        # Use the filename from the uploaded file for image generation
        filename = file.filename or "upload.jpg"
        base_name = os.path.splitext(filename)[0]
        
        # Step 1: Extract certificate fields
        print("🔄 Step 1: Extracting certificate fields...")
        fields = ocr_module.extract_certificate_fields(temp_path)
        print(f"✅ Extracted {len(fields)} fields from certificate")
        
        # Step 2: Database Validation (Priority Check)
        print("🔄 Step 2: Checking database...")
        database_validation = ocr_module.validate_certificate_data(fields)
        database_found = database_validation.get("status") == "found"
        database_valid = database_validation.get("is_valid", False)
        database_accuracy = database_validation.get("accuracy", 0)
        
        if database_found:
            print(f"✅ Database match found - Valid: {database_valid}, Accuracy: {database_accuracy}%")
        else:
            print("❌ No database match found")
        
        # Step 3: ELA Analysis (ALWAYS RUN for security analysis)
        print("🔄 Step 3: Running ELA tampering detection...")
        ela = check_identity_card(temp_path, base_name)
        ela_genuine = ela and ela.get("verdict") == "GENUINE"
        
        print(f"✅ ELA analysis completed - Verdict: {ela.get('verdict')}, Score: {ela.get('score', 0):.2f}")
        
        # Step 4: Check for generated images (ALWAYS CHECK)
        temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
        generated_images = []
        
        # Expected image names based on ELA analysis
        noise_image = f"{base_name}_noise.jpg"
        tampered_image = f"{base_name}_tampered.jpg"
        
        noise_path = os.path.join(temp_dir, noise_image)
        tampered_path = os.path.join(temp_dir, tampered_image)
        
        if os.path.exists(noise_path):
            generated_images.append({
                "type": "noise",
                "filename": noise_image,
                "url": f"/images/{noise_image}",
                "description": "ELA analysis visualization"
            })
            print(f"✅ Noise image available: {noise_image}")
        
        if os.path.exists(tampered_path):
            generated_images.append({
                "type": "tampered", 
                "filename": tampered_image,
                "url": f"/images/{tampered_image}",
                "description": "Original image with marked suspicious regions"
            })
            print(f"✅ Tampered image available: {tampered_image}")
        
        # Step 5: Determine final verdict - DATABASE TAKES PRIORITY
        if database_found and database_valid:
            # Database says certificate is valid - TRUST DATABASE
            verdict = True
            verification_method = "database_verified"
            confidence_level = "high" if database_accuracy >= 90 else "medium"
            verification_note = f"Certificate verified through database (Accuracy: {database_accuracy}%)"
            
            if not ela_genuine:
                verification_note += f". Note: ELA detected potential tampering (Score: {ela.get('score', 0):.2f}), but database verification takes priority."
            
        elif database_found and not database_valid:
            # Database says certificate exists but is not valid
            verdict = False
            verification_method = "database_invalid"
            confidence_level = "high"
            verification_note = f"Certificate found in database but marked as invalid (Accuracy: {database_accuracy}%)"
            
        else:
            # No database match - rely on ELA only
            verdict = ela_genuine
            verification_method = "ela_only"
            confidence_level = "medium" if ela_genuine else "low"
            verification_note = f"No database match found. Verification based on ELA analysis: {ela.get('verdict')} (Score: {ela.get('score', 0):.2f})"
        
        # Final response
        response = {
            "success": True,
            "extracted_fields": fields,
            "ela": ela,
            "database_validation": database_validation,
            "verified": bool(verdict),  # TRUE if database says valid, regardless of ELA
            "fileName": filename,
            "verification_method": verification_method,
            "generated_images": generated_images,
            "analysis_summary": {
                "database_checked": True,
                "database_found": database_found,
                "database_valid": database_valid,
                "database_accuracy": database_accuracy,
                "ela_performed": True,
                "ela_genuine": ela_genuine,
                "ela_score": ela.get('score', 0),
                "logo_checked": False,
                "final_verdict": "VERIFIED" if verdict else "NOT VERIFIED",
                "images_generated": len(generated_images),
                "confidence_level": confidence_level,
                "verification_note": verification_note
            }
        }
        
        print(f"✅ COMPLETE AI verification finished!")
        print(f"   Database: {'Found & Valid' if database_found and database_valid else 'Found but Invalid' if database_found else 'Not Found'}")
        print(f"   ELA: {ela.get('verdict')} (Score: {ela.get('score', 0):.2f})")
        print(f"   Final Verdict: {'✅ VERIFIED' if verdict else '❌ NOT VERIFIED'}")
        print(f"   Method: {verification_method}")
        print(f"   Images: {len(generated_images)}")
        print(f"   Confidence: {confidence_level}")
        
        return response
        
    except Exception as e:
        print(f"❌ AI verification error: {e}")
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
    finally:
        # Clean up original temp file (keep generated images for serving)
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
                print(f"🗑️ Cleaned up original file: {temp_path}")
            except:
                pass

@app.get("/list-images")
async def list_generated_images():
    """Debug endpoint to list all generated images"""
    try:
        temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
        if not os.path.exists(temp_dir):
            return {"images": [], "total": 0, "temp_dir": temp_dir}
        
        images = []
        for filename in os.listdir(temp_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                file_path = os.path.join(temp_dir, filename)
                file_size = os.path.getsize(file_path)
                images.append({
                    "filename": filename,
                    "size": file_size,
                    "url": f"/images/{filename}",
                    "path": file_path
                })
        
        return {"images": images, "total": len(images), "temp_dir": temp_dir}
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.delete("/cleanup-images")
async def cleanup_generated_images():
    """Clean up all generated images (for testing)"""
    try:
        temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
        if not os.path.exists(temp_dir):
            return {"message": "No images to clean up", "temp_dir": temp_dir}
        
        cleaned_count = 0
        for filename in os.listdir(temp_dir):
            if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                file_path = os.path.join(temp_dir, filename)
                os.remove(file_path)
                cleaned_count += 1
        
        return {"message": f"Cleaned up {cleaned_count} images", "temp_dir": temp_dir}
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/debug/files/{filename}")
async def debug_files(filename: str):
    """Debug endpoint to check file generation"""
    temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
    base_name = os.path.splitext(filename)[0]
    
    files_info = {}
    expected_files = [
        f"{base_name}_noise.jpg",
        f"{base_name}_tampered.jpg"
    ]
    
    for expected_file in expected_files:
        file_path = os.path.join(temp_dir, expected_file)
        files_info[expected_file] = {
            "exists": os.path.exists(file_path),
            "path": file_path,
            "size": os.path.getsize(file_path) if os.path.exists(file_path) else 0
        }
    
    all_files = []
    if os.path.exists(temp_dir):
        all_files = [f for f in os.listdir(temp_dir)]
    
    return {
        "temp_directory": temp_dir,
        "expected_files": files_info,
        "all_files": all_files
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting DATABASE-PRIORITY Certificate Verification API...")
    print("=" * 60)
    print("📋 Verification Logic:")
    print("   1. OCR field extraction")
    print("   2. Database lookup (PRIMARY verification)")
    print("   3. ELA analysis (SECURITY analysis)")
    print("   4. VERDICT: Database valid = TRUE, regardless of ELA")
    print("=" * 60)
    print("🔧 Configuration:")
    print(f"   Tesseract: {TESSERACT_PATH}")
    print(f"   YOLO: {'Available' if ULTRA_AVAILABLE else 'DISABLED'}")
    print(f"   OCR Module: {'Available' if os.path.exists(OCR_FILE_PATH) else 'NOT FOUND'}")
    print(f"   Logo Detection: DISABLED")
    print(f"   File Naming: Original filename (no UUID)")
    print("=" * 60)
    print("📸 Generated Images:")
    print("   - filename_noise.jpg (ELA analysis) - ALWAYS")
    print("   - filename_tampered.jpg (marked regions) - ALWAYS")
    print("=" * 60)
    print("🎯 Verification Priority:")
    print("   1. Database Valid → ✅ VERIFIED (even if ELA says tampered)")
    print("   2. Database Invalid → ❌ NOT VERIFIED")
    print("   3. No Database Match → Use ELA verdict")
    print("=" * 60)
    print("🌐 API Endpoints:")
    print("   GET  /health - Health check")
    print("   POST /ocr/extract - OCR only")
    print("   POST /validate-certificate - OCR + Database")
    print("   POST /ai/verify - Complete verification (Database priority)")
    print("   GET  /images/{filename} - Serve generated images")
    print("   GET  /list-images - Debug: List all images")
    print("   GET  /debug/files/{filename} - Debug: Check specific files")
    print("   DELETE /cleanup-images - Debug: Clean up images")
    print("=" * 60)
    
    uvicorn.run("api:app", host="0.0.0.0", port=int(os.getenv("PY_API_PORT", "8000")), reload=False)

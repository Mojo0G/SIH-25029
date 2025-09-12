import os, pytesseract
tess_path = os.getenv("TESSERACT_PATH", r"C:\Program Files\Tesseract-OCR\tesseract.exe")
pytesseract.pytesseract.tesseract_cmd = tess_path

import os
import uuid
import tempfile
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
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
    temp_dir = os.path.join(tempfile.gettempdir(), "sih_uploads")
    os.makedirs(temp_dir, exist_ok=True)
    ext = os.path.splitext(file.filename or "upload.bin")[1]
    temp_path = os.path.join(temp_dir, f"{uuid.uuid4()}{ext}")
    with open(temp_path, "wb") as f:
        f.write(file.file.read())
    return temp_path


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ocr/extract")
async def ocr_extract(file: UploadFile = File(...)):
    try:
        temp_path = _save_temp(file)
        text = ocr_module.finaltext(temp_path)
        fields = ocr_module.extract_certificate_fields(temp_path)
        return {"success": True, "text": text, "fields": fields}
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


def _run_logo_check(image_path: str) -> Optional[dict]:
    model_path = os.path.join(os.path.dirname(__file__), "best.pt")
    if not ULTRA_AVAILABLE or not os.path.exists(model_path):
        return None
    try:
        model = YOLO(model_path)
        results = model(image_path, conf=0.25, verbose=False)
        result = results[0]
        has_logo = len(result.boxes) > 0
        return {"has_logo": has_logo}
    except Exception:
        return None


@app.post("/ai/verify")
async def ai_verify(file: UploadFile = File(...)):
    try:
        temp_path = _save_temp(file)

        ela = check_identity_card(temp_path)
        logo = _run_logo_check(temp_path)

        verdict = (ela and ela.get("verdict") == "GENUINE") and (logo is None or logo.get("has_logo", False))

        return {
            "success": True,
            "ela": ela,
            "logo": logo,
            "verified": bool(verdict),
        }
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=int(os.getenv("PY_API_PORT", "8000")), reload=False)



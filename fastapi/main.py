from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import io
from typing import List
from model import predict, compute_severity
from treatment_map import TREATMENT_MAP

app = FastAPI(title="PlantAI Prediction Service", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictResponse(BaseModel):
    disease: str
    confidence: float
    severity: str
    treatment_steps: List[str]


@app.get("/health")
def health():
    return {"status": "ok", "engine": "onnxruntime", "model": "mobilenet_v2_plant_disease"}


@app.post("/predict", response_model=PredictResponse)
async def predict_endpoint(image: UploadFile = File(...)):
    if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image type. Use JPG, PNG, or WebP.")

    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process image.")

    if img.width < 224 or img.height < 224:
        raise HTTPException(status_code=400, detail="Image too small. Minimum 224x224 pixels.")

    results = predict(img)
    top = results[0]

    disease = top["label"]
    confidence = round(top["score"], 4)
    severity = compute_severity(confidence, disease)
    treatment_steps = TREATMENT_MAP.get(disease, [
        "Isolate the affected plant from healthy crops immediately.",
        "Remove and safely dispose of all visibly infected plant parts.",
        "Apply a broad-spectrum fungicide or bactericide appropriate for your crop.",
        "Monitor surrounding plants daily for 2 weeks.",
        "Consult a local agronomist for region-specific treatment advice.",
    ])

    return PredictResponse(
        disease=disease,
        confidence=confidence,
        severity=severity,
        treatment_steps=treatment_steps,
    )

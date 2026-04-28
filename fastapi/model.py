"""
Lightweight ONNX-based plant disease classifier.
Uses onnxruntime (~50MB) instead of PyTorch (~500MB).
Total memory: ~150MB — well within Render free tier (512MB).
"""
import onnxruntime as ort
import numpy as np
from PIL import Image
import json
import os

_session = None
_labels = None
_config = None

MODEL_DIR = os.path.join(os.path.dirname(__file__), "onnx_model")


def _load_model():
    global _session, _labels, _config
    if _session is None:
        model_path = os.path.join(MODEL_DIR, "model.onnx")
        labels_path = os.path.join(MODEL_DIR, "labels.json")
        config_path = os.path.join(MODEL_DIR, "processor_config.json")

        print(f"[PlantAI] Loading ONNX model from {model_path}")
        _session = ort.InferenceSession(model_path)
        _labels = json.load(open(labels_path))
        _config = json.load(open(config_path))
        print(f"[PlantAI] Model loaded — {len(_labels)} classes")


def preprocess_image(img: Image.Image) -> np.ndarray:
    """Resize, normalize, and convert image to model input format."""
    _load_model()
    size = _config["image_size"]
    mean = np.array(_config["image_mean"], dtype=np.float32)
    std = np.array(_config["image_std"], dtype=np.float32)

    # Resize to 224x224
    img = img.convert("RGB").resize((size, size), Image.BILINEAR)

    # Normalize: (pixel / 255 - mean) / std
    arr = np.array(img, dtype=np.float32) / 255.0
    arr = (arr - mean) / std

    # HWC → CHW → NCHW
    arr = arr.transpose(2, 0, 1)[np.newaxis, ...]
    return arr


def predict(img: Image.Image) -> list[dict]:
    """Run prediction and return sorted list of {label, score}."""
    _load_model()
    input_tensor = preprocess_image(img)

    outputs = _session.run(None, {"pixel_values": input_tensor})
    logits = outputs[0][0]

    # Softmax
    exp_logits = np.exp(logits - np.max(logits))
    probs = exp_logits / exp_logits.sum()

    # Sort by confidence
    sorted_indices = np.argsort(probs)[::-1]
    results = []
    for idx in sorted_indices[:5]:
        results.append({
            "label": _labels[str(int(idx))],
            "score": float(probs[idx]),
        })

    return results


def compute_severity(confidence: float, disease: str) -> str:
    """Derive severity based on confidence and disease danger level."""
    disease_lower = disease.lower()

    critical_keywords = ["late blight", "mosaic virus", "crown gall", "fire blight", "bacterial wilt"]
    if any(k in disease_lower for k in critical_keywords):
        return "critical" if confidence >= 0.7 else "high"

    if "healthy" in disease_lower:
        return "low"

    if confidence >= 0.85:
        return "high"
    elif confidence >= 0.65:
        return "medium"
    return "low"

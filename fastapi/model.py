from transformers import pipeline
import os

_classifier = None


def get_classifier():
    global _classifier
    if _classifier is None:
        model_name = os.getenv(
            "HF_MODEL",
            "linkanjarad/mobilenet_v2_1.0_224-plant-disease-classification"
        )
        print(f"[PlantAI] Loading model: {model_name}")
        _classifier = pipeline(
            "image-classification",
            model=model_name,
        )
        print("[PlantAI] Model loaded successfully.")
    return _classifier


def compute_severity(confidence: float, disease: str) -> str:
    """
    Derive severity based on confidence and known disease danger level.
    High-confidence detections of dangerous diseases are rated higher.
    """
    disease_lower = disease.lower()

    # Critical diseases regardless of confidence
    critical_keywords = ["late blight", "mosaic virus", "crown gall", "fire blight", "bacterial wilt"]
    if any(k in disease_lower for k in critical_keywords):
        if confidence >= 0.7:
            return "critical"
        return "high"

    # Healthy plants
    if "healthy" in disease_lower:
        return "low"

    # Confidence-based fallback
    if confidence >= 0.85:
        return "high"
    elif confidence >= 0.65:
        return "medium"
    else:
        return "low"

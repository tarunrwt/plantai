"""
Export MobileNetV2 Plant Disease model to ONNX format.
Handles models with missing/broken preprocessor configs.
"""
import torch
import json
import os
from transformers import AutoModelForImageClassification

MODEL_NAME = "ozair23/mobilenet_v2_1.0_224-finetuned-plantdisease"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "fastapi", "onnx_model")

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print(f"[1/4] Downloading model: {MODEL_NAME}")
    model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)
    
    # Save label mapping
    labels = model.config.id2label
    print(f"[2/4] Found {len(labels)} classes")
    for i, (k, v) in enumerate(list(labels.items())[:5]):
        print(f"  {k}: {v}")
    print(f"  ... and {len(labels) - 5} more")
    
    labels_path = os.path.join(OUTPUT_DIR, "labels.json")
    with open(labels_path, "w") as f:
        json.dump(labels, f, indent=2)
    
    # Standard MobileNetV2 preprocessing (ImageNet defaults)
    processor_config = {
        "image_size": 224,
        "image_mean": [0.485, 0.456, 0.406],
        "image_std": [0.229, 0.224, 0.225],
    }
    config_path = os.path.join(OUTPUT_DIR, "processor_config.json")
    with open(config_path, "w") as f:
        json.dump(processor_config, f, indent=2)
    
    # Export to ONNX
    print("[3/4] Exporting to ONNX...")
    model.eval()
    dummy_input = torch.randn(1, 3, 224, 224)
    onnx_path = os.path.join(OUTPUT_DIR, "model.onnx")
    
    torch.onnx.export(
        model,
        dummy_input,
        onnx_path,
        input_names=["pixel_values"],
        output_names=["logits"],
        dynamic_axes={
            "pixel_values": {0: "batch_size"},
            "logits": {0: "batch_size"},
        },
        opset_version=14,
    )
    
    file_size_mb = os.path.getsize(onnx_path) / (1024 * 1024)
    print(f"  Saved ONNX model: {file_size_mb:.1f} MB")
    
    # Verify
    print("[4/4] Verifying ONNX model...")
    import onnxruntime as ort
    import numpy as np
    
    session = ort.InferenceSession(onnx_path)
    test_input = np.random.randn(1, 3, 224, 224).astype(np.float32)
    outputs = session.run(None, {"pixel_values": test_input})
    logits = outputs[0]
    predicted_idx = int(np.argmax(logits, axis=-1)[0])
    print(f"  ✅ ONNX model works! Prediction: {labels[str(predicted_idx)]}")
    print(f"\n  Done! Files in: {OUTPUT_DIR}")

if __name__ == "__main__":
    main()

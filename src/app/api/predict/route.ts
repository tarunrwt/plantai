import { NextRequest, NextResponse } from "next/server";
import { TREATMENT_MAP, computeSeverity, DEFAULT_TREATMENT } from "@/lib/treatment-map";

/**
 * POST /api/predict
 * 
 * Accepts a multipart form with an "image" field.
 * Calls HuggingFace Inference API (free, serverless) to classify the plant disease.
 * Falls back to Render FastAPI if HF is unavailable.
 * 
 * Architecture:
 *   Browser → Vercel /api/predict → HuggingFace Inference API
 *   (same-origin, no CORS, no self-hosted model, no OOM)
 */

const HF_MODEL = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-classification";
const HF_API_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
const RENDER_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://plantai-api.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert image to binary buffer for HuggingFace API
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // ── Strategy 1: HuggingFace Inference API (free, reliable) ──
    let predictions: Array<{ label: string; score: number }> | null = null;

    try {
      const hfHeaders: Record<string, string> = {
        "Content-Type": "application/octet-stream",
      };
      // Optional: Add HF token for higher rate limits
      const hfToken = process.env.HF_API_TOKEN;
      if (hfToken) {
        hfHeaders["Authorization"] = `Bearer ${hfToken}`;
      }

      const hfResp = await fetch(HF_API_URL, {
        method: "POST",
        headers: hfHeaders,
        body: imageBuffer,
        signal: AbortSignal.timeout(60_000),
      });

      if (hfResp.ok) {
        const data = await hfResp.json();
        if (Array.isArray(data) && data.length > 0 && data[0].label) {
          predictions = data;
        }
      } else {
        const errText = await hfResp.text();
        console.error(`[PlantAI] HF API error (${hfResp.status}):`, errText);
      }
    } catch (hfErr: any) {
      console.error("[PlantAI] HF API failed:", hfErr.message);
    }

    // ── Strategy 2: Fallback to Render FastAPI ──
    if (!predictions) {
      try {
        const renderForm = new FormData();
        renderForm.append("image", image, (image as File).name || "upload.png");

        const renderResp = await fetch(`${RENDER_URL}/predict`, {
          method: "POST",
          body: renderForm,
          signal: AbortSignal.timeout(120_000),
        });

        if (renderResp.ok) {
          const renderData = await renderResp.json();
          // Render returns the full response format already
          return NextResponse.json(renderData);
        }
        console.error(`[PlantAI] Render fallback error: ${renderResp.status}`);
      } catch (renderErr: any) {
        console.error("[PlantAI] Render fallback failed:", renderErr.message);
      }
    }

    // ── No predictions from either source ──
    if (!predictions) {
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }

    // ── Build response ──
    const top = predictions[0];
    const disease = top.label;
    const confidence = Math.round(top.score * 10000) / 10000;
    const severity = computeSeverity(confidence, disease);
    const treatment_steps = TREATMENT_MAP[disease] || DEFAULT_TREATMENT;

    return NextResponse.json({
      disease,
      confidence,
      severity,
      treatment_steps,
    });
  } catch (err: any) {
    console.error("[PlantAI] Predict route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

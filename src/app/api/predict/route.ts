import { NextRequest, NextResponse } from "next/server";

const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || "https://plantai-api.onrender.com";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof Blob)) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Forward to FastAPI backend (server-to-server = no CORS)
    const backendForm = new FormData();
    backendForm.append("image", image, (image as File).name || "upload.png");

    const response = await fetch(`${FASTAPI_URL}/predict`, {
      method: "POST",
      body: backendForm,
      signal: AbortSignal.timeout(120_000), // 2 min timeout for cold starts
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: `AI service error: ${detail}` },
        { status: response.status }
      );
    }

    const prediction = await response.json();
    return NextResponse.json(prediction);
  } catch (err: any) {
    if (err.name === "TimeoutError" || err.name === "AbortError") {
      return NextResponse.json(
        { error: "AI service is waking up. Please try again in 30 seconds." },
        { status: 504 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse, NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file");
    if (!audioFile || !(audioFile instanceof File)) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 });
    }

    // Only allow .wav
    if (!audioFile.name.toLowerCase().endsWith(".wav")) {
      return NextResponse.json({ error: "Only .wav files are supported." }, { status: 400 });
    }

    const backendFormData = new FormData();
    backendFormData.append("file", audioFile, audioFile.name);

    // Call Flask backend
    const flaskResponse = await fetch("http://localhost:5000/analyze-audio", {
      method: "POST",
      body: backendFormData,
    });

    const text = await flaskResponse.text();
    let flaskResult: any = null;
    try {
      flaskResult = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Malformed response from backend.", details: text },
        { status: 502 }
      );
    }

    if (!flaskResponse.ok) {
      return NextResponse.json(
        { error: flaskResult.error || flaskResult.message || "Audio analysis failed from backend." },
        { status: flaskResponse.status }
      );
    }

    // Already returns named features object
    return NextResponse.json(flaskResult);

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
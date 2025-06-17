import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { features } = await req.json();

    if (!features || !Array.isArray(features) || features.length !== 22) {
      return NextResponse.json(
        { error: "Invalid input: Expected an array of 22 features." },
        { status: 400 }
      );
    }

    // Forward to Flask backend
    const flaskResponse = await fetch("http://localhost:5000/predict-features", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ features }),
    });

    const text = await flaskResponse.text();
    let result: any = null;
    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Malformed response from backend.", details: text },
        { status: 502 }
      );
    }

    if (!flaskResponse.ok) {
      return NextResponse.json(
        { error: result.error || result.message || "Prediction failed from backend." },
        { status: flaskResponse.status }
      );
    }

    // Already returns named features object
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API error in /api/predict-parkinson:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
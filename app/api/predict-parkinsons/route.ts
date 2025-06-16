import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { features } = await req.json()

    if (!features || !Array.isArray(features) || features.length !== 22) {
      return NextResponse.json({ error: "Invalid input: Expected an array of 22 features." }, { status: 400 })
    }

    // Forward the request to the Flask backend in the correct format
    const flaskResponse = await fetch("http://localhost:5000/predict-features", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ features }), // <--- FIXED HERE
    })

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json()
      console.error("Flask backend error:", errorData)
      return NextResponse.json(
        { error: errorData.message || errorData.error || "Prediction failed from backend." },
        { status: flaskResponse.status },
      )
    }

    const result = await flaskResponse.json()

    // Map the backend result to what your frontend expects
    const mappedResult = {
      // Use the new 'result' field from backend instead of 'prediction'
      result: result.result, // "Healthy" or "Parkinson's Disease"
      probability: result.probability,
      message: result.message,
      features: Object.fromEntries(
        result.features_processed.map((value: number, index: number) => [
          [
            "MDVP:Fo(Hz)",
            "MDVP:Fhi(Hz)",
            "MDVP:Flo(Hz)",
            "MDVP:Jitter(%)",
            "MDVP:Jitter(Abs)",
            "MDVP:RAP",
            "MDVP:PPQ",
            "Jitter:DDP",
            "MDVP:Shimmer",
            "MDVP:Shimmer(dB)",
            "Shimmer:APQ3",
            "Shimmer:APQ5",
            "MDVP:APQ",
            "Shimmer:DDA",
            "NHR",
            "HNR",
            "RPDE",
            "DFA",
            "spread1",
            "spread2",
            "D2",
            "PPE",
          ][index],
          value,
        ]),
      ),
    }

    return NextResponse.json(mappedResult)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
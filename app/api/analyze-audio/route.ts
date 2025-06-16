import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get("file")

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided." }, { status: 400 })
    }

    // Forward the audio file to the Flask backend
    const flaskResponse = await fetch("http://localhost:5000/analyze_audio", {
      method: "POST",
      body: formData, // Directly forward the FormData
    })

    if (!flaskResponse.ok) {
      const errorData = await flaskResponse.json()
      console.error("Flask backend error:", errorData)
      return NextResponse.json(
        { error: errorData.message || "Audio analysis failed from backend." },
        { status: flaskResponse.status },
      )
    }

    const result = await flaskResponse.json()

    // The Flask backend already returns 'prediction' as "positive" or "negative",
    // 'probability', 'message', and 'features_used_for_prediction'.
    // We just need to map 'features_used_for_prediction' to 'features' for the frontend.
    const mappedResult = {
      prediction: result.prediction,
      probability: result.probability,
      message: result.message,
      features: Object.fromEntries(
        result.features_used_for_prediction.map((value: number, index: number) => [
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

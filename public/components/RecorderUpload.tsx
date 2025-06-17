"use client";
import React, { useRef, useState } from "react";
// You must: npm install mic-recorder-to-mp3
import MicRecorder from "mic-recorder-to-mp3";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export default function RecorderUpload() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start recording
  const start = async () => {
    setError(null);
    setResult(null);
    try {
      await Mp3Recorder.start();
      setIsRecording(true);
    } catch (e: any) {
      setError("Microphone access denied or unavailable.");
    }
  };

  // Stop recording and upload
  const stop = async () => {
    setIsRecording(false);
    try {
      const [buffer, blob] = await Mp3Recorder.stop().getMp3();
      const file = new File([blob], "audio.mp3", { type: "audio/mp3" });
      setAudioUrl(URL.createObjectURL(blob));
      await uploadFile(file);
    } catch (e: any) {
      setError("Failed to record audio. " + (e?.message || ""));
    }
  };

  // Handle file upload (.mp3 or .wav)
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = [".mp3", ".wav"];
    if (!allowedTypes.some(type => file.name.toLowerCase().endsWith(type))) {
      setError("Please upload an .mp3 or .wav file.");
      return;
    }
    setAudioUrl(URL.createObjectURL(file));
    await uploadFile(file);
  };

  // Upload the audio file to your API
  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setResult(null);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/analyze-audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setResult(data.prediction ? {
        // Flask backend returns 'prediction' for audio (positive/negative)
        result: data.prediction === "positive" ? "Parkinson's Disease" : "Healthy",
        probability: data.probability,
        message: data.message,
        features: data.features,
      } : data);
    } catch (e: any) {
      setError(e.message || "Upload error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 12 }}>
      <h2>Record or Upload MP3/WAV</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={isRecording ? stop : start} disabled={isLoading} style={{ minWidth: 120 }}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mp3,audio/wav"
          style={{ display: "none" }}
          onChange={onFileChange}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isRecording || isLoading}
        >
          Upload MP3/WAV
        </button>
      </div>
      {audioUrl && (
        <audio controls src={audioUrl} style={{ width: "100%" }} />
      )}
      {isLoading && <div>Analyzing...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <strong>AI Result:</strong> {result.result}
          <br />
          <strong>Probability:</strong> {(result.probability * 100).toFixed(2)}%
          <br />
          <strong>Message:</strong> {result.message}
          <details>
            <summary>Features</summary>
            <pre>{JSON.stringify(result.features, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
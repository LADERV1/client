import React, { useState } from "react";

export default function AudioUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/analyze-audio", {
      method: "POST",
      body: formData,
    });
    setResult(await res.json());
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept=".wav" onChange={handleFileChange} required />
      <button type="submit" disabled={loading || !file}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {result && (
        <div>
          <p>
            Prediction: <b>{result.result}</b>
          </p>
          <p>
            Confidence: <b>{(result.probability * 100).toFixed(2)}%</b>
          </p>
          <p>{result.message}</p>
        </div>
      )}
    </form>
  );
}
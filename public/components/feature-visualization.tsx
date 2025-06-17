"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, LineChart } from 'lucide-react'

interface FeatureVisualizationProps {
  features: Record<string, number>
  language: "en" | "fr"
}

// Add min/max ranges for feature normalization (these are example values, adjust as needed)
const BAR_FEATURE_RANGES: Record<string, [number, number]> = {
  "MDVP:Jitter(%)": [0, 0.02],
  "Jitter:DDP": [0, 0.02],
  "MDVP:Shimmer": [0, 0.1],
  "Shimmer:APQ3": [0, 0.07],
  "NHR": [0, 0.5],
  "HNR": [10, 40],
  "RPDE": [0, 1],
  "DFA": [0.5, 1],
  "PPE": [0, 0.6],
};

const getNormalizedValue = (name: string, value: number) => {
  const [min, max] = BAR_FEATURE_RANGES[name] || [0, 1];
  if (max === min) return 0;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

export default function FeatureVisualization({ features, language }: FeatureVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [viewMode, setViewMode] = useState<"bar" | "radar">("bar")

  const translations = {
    en: {
      highValues: "High values (>0.6)",
      highDesc: "May indicate Parkinson's",
      lowValues: "Low values (<0.6)",
      lowDesc: "Typically normal range",
      barView: "Bar Chart",
      radarView: "Radar Chart",
      featureGroups: {
        jitter: "Jitter (Frequency Variation)",
        shimmer: "Shimmer (Amplitude Variation)",
        noise: "Noise Measures",
        nonlinear: "Nonlinear Measures",
      },
    },
    fr: {
      highValues: "Valeurs élevées (>0,6)",
      highDesc: "Peut indiquer Parkinson",
      lowValues: "Valeurs basses (<0,6)",
      lowDesc: "Généralement normale",
      barView: "Graphique à Barres",
      radarView: "Graphique Radar",
      featureGroups: {
        jitter: "Jitter (Variation de Fréquence)",
        shimmer: "Shimmer (Variation d'Amplitude)",
        noise: "Mesures de Bruit",
        nonlinear: "Mesures Non Linéaires",
      },
    },
  }

  const t = translations[language]

  // Feature display names for better readability
  const featureDisplayNames = {
    en: {
      "MDVP:Jitter(%)": "Jitter %",
      "MDVP:Jitter(Abs)": "Jitter Abs",
      "Jitter:DDP": "Jitter DDP",
      "MDVP:Shimmer": "Shimmer",
      "Shimmer:APQ3": "Shimmer APQ3",
      "MDVP:Fo(Hz)": "Fund. Freq.",
      NHR: "Noise-Harm. Ratio",
      HNR: "Harm-Noise Ratio",
      RPDE: "RPDE",
      DFA: "DFA",
      PPE: "PPE",
    },
    fr: {
      "MDVP:Jitter(%)": "Jitter %",
      "MDVP:Jitter(Abs)": "Jitter Abs",
      "Jitter:DDP": "Jitter DDP",
      "MDVP:Shimmer": "Shimmer",
      "Shimmer:APQ3": "Shimmer APQ3",
      "MDVP:Fo(Hz)": "Fréq. Fond.",
      NHR: "Ratio Bruit-Harm.",
      HNR: "Ratio Harm-Bruit",
      RPDE: "RPDE",
      DFA: "DFA",
      PPE: "PPE",
    },
  }

  const displayNames = featureDisplayNames[language]

  // Get the most important features for Parkinson's detection
  const keyFeatures = [
    "MDVP:Jitter(%)",
    "Jitter:DDP",
    "MDVP:Shimmer",
    "Shimmer:APQ3",
    "NHR",
    "HNR",
    "RPDE",
    "DFA",
    "PPE",
  ]

  // Filter and sort features
  const filteredFeatures = keyFeatures
    .map(key => [key, features[key] ?? 0] as [string, number])
    .sort((a, b) => b[1] - a[1])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Always set canvas dimensions for crisp drawing
    canvas.width = 600
    canvas.height = 400

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (viewMode === "bar") {
      drawBarChart(ctx, canvas.width, canvas.height)
    } else {
      drawRadarChart(ctx, canvas.width, canvas.height)
    }
    // eslint-disable-next-line
  }, [features, viewMode, language])

  const drawBarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const barHeight = 30
    const barGap = 15
    const leftPadding = 120
    const topPadding = 20

    filteredFeatures.forEach((feature, index) => {
      const [name, value] = feature
      const displayName = displayNames[name as keyof typeof displayNames] || name
      const y = topPadding + index * (barHeight + barGap)
      const norm = getNormalizedValue(name, value);

      // Draw feature name
      ctx.fillStyle = "#64748b"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(displayName, leftPadding - 10, y + barHeight / 2 + 5)

      // Draw bar background
      ctx.fillStyle = "#e2e8f0"
      ctx.fillRect(leftPadding, y, width - leftPadding - 20, barHeight)

      // Draw bar value (using normalized value for width)
      const barWidth = (width - leftPadding - 20) * norm
      ctx.fillStyle = norm > 0.6 ? "#ef4444" : "#10b981"
      ctx.fillRect(leftPadding, y, barWidth, barHeight)

      // Draw value text (show the real value)
      ctx.fillStyle = "#1e293b"
      ctx.textAlign = "left"
      ctx.fillText(value.toFixed(4), leftPadding + barWidth + 5, y + barHeight / 2 + 5)
    })
  }

  const drawRadarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // keep your existing radar chart code here if you want
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="flex justify-end mb-4">
        <Tabs defaultValue="bar" onValueChange={(value) => setViewMode(value as "bar" | "radar")}>
          <TabsList className="grid grid-cols-2 w-[200px]">
            <TabsTrigger value="bar" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{t.barView}</span>
            </TabsTrigger>
            <TabsTrigger value="radar" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              <span>{t.radarView}</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <canvas ref={canvasRef} width={600} height={400} className="w-full h-auto" />

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Card className="p-3 bg-red-50 border-red-200">
          <div className="font-medium">{t.highValues}</div>
          <div className="text-muted-foreground">{t.highDesc}</div>
        </Card>
        <Card className="p-3 bg-green-50 border-green-200">
          <div className="font-medium">{t.lowValues}</div>
          <div className="text-muted-foreground">{t.lowDesc}</div>
        </Card>
      </div>
    </div>
  )
}
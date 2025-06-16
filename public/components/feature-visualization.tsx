"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, LineChart } from 'lucide-react'

interface FeatureVisualizationProps {
  features: Record<string, number>
  language: "en" | "fr"
}

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
  const filteredFeatures = Object.entries(features)
    .filter(([key]) => keyFeatures.includes(key))
    .sort((a, b) => b[1] - a[1])

  useEffect(() => {
    if (!canvasRef.current || !features) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (viewMode === "bar") {
      drawBarChart(ctx, canvas.width, canvas.height)
    } else {
      drawRadarChart(ctx, canvas.width, canvas.height)
    }
  }, [features, displayNames, viewMode])

  const drawBarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Set dimensions
    const barHeight = 30
    const barGap = 15
    const leftPadding = 120
    const topPadding = 20

    // Draw bars
    filteredFeatures.forEach((feature, index) => {
      const [name, value] = feature
      const displayName = displayNames[name as keyof typeof displayNames] || name
      const y = topPadding + index * (barHeight + barGap)

      // Draw feature name
      ctx.fillStyle = "#64748b"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(displayName, leftPadding - 10, y + barHeight / 2 + 5)

      // Draw bar background
      ctx.fillStyle = "#e2e8f0"
      ctx.fillRect(leftPadding, y, width - leftPadding - 20, barHeight)

      // Draw bar value
      const barWidth = (width - leftPadding - 20) * value
      ctx.fillStyle = value > 0.6 ? "#ef4444" : "#10b981"
      ctx.fillRect(leftPadding, y, barWidth, barHeight)

      // Draw value text
      ctx.fillStyle = "#1e293b"
      ctx.textAlign = "left"
      ctx.fillText(value.toFixed(2), leftPadding + barWidth + 5, y + barHeight / 2 + 5)
    })
  }

  const drawRadarChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(centerX, centerY) - 50

    // Draw radar background
    const levels = 5
    ctx.strokeStyle = "#e2e8f0"
    ctx.fillStyle = "rgba(226, 232, 240, 0.3)"

    for (let i = 1; i <= levels; i++) {
      ctx.beginPath()
      const levelRadius = (radius / levels) * i

      filteredFeatures.forEach((_, index) => {
        const angle = (Math.PI * 2 * index) / filteredFeatures.length
        const x = centerX + levelRadius * Math.cos(angle - Math.PI / 2)
        const y = centerY + levelRadius * Math.sin(angle - Math.PI / 2)

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.closePath()
      ctx.stroke()

      if (i === levels) {
        ctx.fill()
      }
    }

    // Draw axis lines
    ctx.strokeStyle = "#94a3b8"
    filteredFeatures.forEach((_, index) => {
      const angle = (Math.PI * 2 * index) / filteredFeatures.length
      const x = centerX + radius * Math.cos(angle - Math.PI / 2)
      const y = centerY + radius * Math.sin(angle - Math.PI / 2)

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.stroke()

      // Draw feature names
      const [name] = filteredFeatures[index]
      const displayName = displayNames[name as keyof typeof displayNames] || name

      const labelRadius = radius + 20
      const labelX = centerX + labelRadius * Math.cos(angle - Math.PI / 2)
      const labelY = centerY + labelRadius * Math.sin(angle - Math.PI / 2)

      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(displayName, labelX, labelY)
    })

    // Draw data points
    ctx.fillStyle = "rgba(239, 68, 68, 0.7)"
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2

    ctx.beginPath()
    filteredFeatures.forEach(([_, value], index) => {
      const angle = (Math.PI * 2 * index) / filteredFeatures.length
      const pointRadius = radius * value
      const x = centerX + pointRadius * Math.cos(angle - Math.PI / 2)
      const y = centerY + pointRadius * Math.sin(angle - Math.PI / 2)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw individual points
      ctx.fillStyle = value > 0.6 ? "#ef4444" : "#10b981"
      ctx.beginPath()
      ctx.arc(x, y, 5, 0, Math.PI * 2)
      ctx.fill()

      // Draw value text
      ctx.fillStyle = "#1e293b"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      const valueX = centerX + (pointRadius + 15) * Math.cos(angle - Math.PI / 2)
      const valueY = centerY + (pointRadius + 15) * Math.sin(angle - Math.PI / 2)
      ctx.fillText(value.toFixed(2), valueX, valueY)
    })

    // Connect the dots
    ctx.fillStyle = "rgba(239, 68, 68, 0.2)"
    ctx.strokeStyle = "#ef4444"
    ctx.lineWidth = 2

    ctx.beginPath()
    filteredFeatures.forEach(([_, value], index) => {
      const angle = (Math.PI * 2 * index) / filteredFeatures.length
      const pointRadius = radius * value
      const x = centerX + pointRadius * Math.cos(angle - Math.PI / 2)
      const y = centerY + pointRadius * Math.sin(angle - Math.PI / 2)

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.closePath()
    ctx.stroke()
    ctx.fill()
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

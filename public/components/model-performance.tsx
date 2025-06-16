"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from 'lucide-react'

interface ModelPerformanceProps {
  language: "en" | "fr"
}

export default function ModelPerformance({ language }: ModelPerformanceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTab, setActiveTab] = useState<"metrics" | "confusion" | "roc">("metrics")

  const translations = {
    en: {
      metrics: {
        accuracy: "Accuracy",
        precision: "Precision",
        recall: "Recall (Sensitivity)",
        f1: "F1 Score",
        auc: "AUC-ROC",
      },
      description: "Model trained on UCI Parkinson's dataset with 195 voice recordings",
      tabs: {
        metrics: "Performance Metrics",
        confusion: "Confusion Matrix",
        roc: "ROC Curve",
      },
      confusionMatrix: {
        title: "Confusion Matrix",
        description: "Visualization of model predictions vs. actual values",
        truePositive: "True Positive",
        falsePositive: "False Positive",
        trueNegative: "True Negative",
        falseNegative: "False Negative",
        actual: "Actual",
        predicted: "Predicted",
        positive: "Positive",
        negative: "Negative",
      },
      rocCurve: {
        title: "ROC Curve",
        description: "Receiver Operating Characteristic curve showing model performance",
        truePositiveRate: "True Positive Rate",
        falsePositiveRate: "False Positive Rate",
      },
    },
    fr: {
      metrics: {
        accuracy: "Précision",
        precision: "Précision",
        recall: "Rappel (Sensibilité)",
        f1: "Score F1",
        auc: "AUC-ROC",
      },
      description: "Modèle entraîné sur le jeu de données UCI Parkinson avec 195 enregistrements vocaux",
      tabs: {
        metrics: "Métriques de Performance",
        confusion: "Matrice de Confusion",
        roc: "Courbe ROC",
      },
      confusionMatrix: {
        title: "Matrice de Confusion",
        description: "Visualisation des prédictions du modèle par rapport aux valeurs réelles",
        truePositive: "Vrai Positif",
        falsePositive: "Faux Positif",
        trueNegative: "Vrai Négatif",
        falseNegative: "Faux Négatif",
        actual: "Réel",
        predicted: "Prédit",
        positive: "Positif",
        negative: "Négatif",
      },
      rocCurve: {
        title: "Courbe ROC",
        description: "Courbe ROC (Receiver Operating Characteristic) montrant la performance du modèle",
        truePositiveRate: "Taux de Vrais Positifs",
        falsePositiveRate: "Taux de Faux Positifs",
      },
    },
  }

  const t = translations[language]

  // Mock model performance metrics
  const metrics = {
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.94,
    f1: 0.91,
    auc: 0.95,
  }

  // Mock confusion matrix data
  const confusionMatrix = {
    truePositive: 47,
    falsePositive: 6,
    trueNegative: 48,
    falseNegative: 3,
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (activeTab === "metrics") {
      drawMetricsChart(ctx, canvas.width, canvas.height)
    } else if (activeTab === "confusion") {
      drawConfusionMatrix(ctx, canvas.width, canvas.height)
    } else if (activeTab === "roc") {
      drawROCCurve(ctx, canvas.width, canvas.height)
    }
  }, [activeTab, metrics, language])

  const drawMetricsChart = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Set dimensions
    const barHeight = 30
    const barGap = 15
    const leftPadding = 150
    const topPadding = 20

    // Draw metrics
    Object.entries(metrics).forEach(([key, value], index) => {
      const metricName = t.metrics[key as keyof typeof t.metrics] || key
      const y = topPadding + index * (barHeight + barGap)

      // Draw metric name
      ctx.fillStyle = "#64748b"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(metricName, leftPadding - 10, y + barHeight / 2 + 5)

      // Draw bar background
      ctx.fillStyle = "#e2e8f0"
      ctx.fillRect(leftPadding, y, width - leftPadding - 20, barHeight)

      // Draw bar value
      const barWidth = (width - leftPadding - 20) * value
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(leftPadding, y, barWidth, barHeight)

      // Draw value text
      ctx.fillStyle = "#1e293b"
      ctx.textAlign = "left"
      ctx.fillText((value * 100).toFixed(1) + "%", leftPadding + barWidth + 5, y + barHeight / 2 + 5)
    })

    // Draw description
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(t.description, width / 2, topPadding + Object.keys(metrics).length * (barHeight + barGap) + 20)
  }

  const drawConfusionMatrix = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const cellSize = 80
    const matrixSize = cellSize * 2
    const startX = centerX - matrixSize / 2
    const startY = centerY - matrixSize / 2

    // Draw matrix cells
    const cells = [
      { x: 0, y: 0, value: confusionMatrix.truePositive, label: t.confusionMatrix.truePositive, color: "#dcfce7" },
      { x: 1, y: 0, value: confusionMatrix.falsePositive, label: t.confusionMatrix.falsePositive, color: "#fee2e2" },
      { x: 0, y: 1, value: confusionMatrix.falseNegative, label: t.confusionMatrix.falseNegative, color: "#fee2e2" },
      { x: 1, y: 1, value: confusionMatrix.trueNegative, label: t.confusionMatrix.trueNegative, color: "#dcfce7" },
    ]

    cells.forEach((cell) => {
      const x = startX + cell.x * cellSize
      const y = startY + cell.y * cellSize

      // Draw cell background
      ctx.fillStyle = cell.color
      ctx.fillRect(x, y, cellSize, cellSize)

      // Draw cell border
      ctx.strokeStyle = "#cbd5e1"
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, cellSize, cellSize)

      // Draw value
      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(cell.value.toString(), x + cellSize / 2, y + cellSize / 2 - 10)

      // Draw label
      ctx.fillStyle = "#64748b"
      ctx.font = "10px sans-serif"
      ctx.fillText(cell.label, x + cellSize / 2, y + cellSize / 2 + 15)
    })

    // Draw axis labels
    ctx.fillStyle = "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // Predicted (x-axis)
    ctx.fillText(t.confusionMatrix.predicted, centerX, startY - 30)
    ctx.fillText(t.confusionMatrix.positive, startX + cellSize / 2, startY - 10)
    ctx.fillText(t.confusionMatrix.negative, startX + cellSize + cellSize / 2, startY - 10)

    // Actual (y-axis)
    ctx.textAlign = "right"
    ctx.fillText(t.confusionMatrix.actual, startX - 40, centerY)
    ctx.fillText(t.confusionMatrix.positive, startX - 10, startY + cellSize / 2)
    ctx.fillText(t.confusionMatrix.negative, startX - 10, startY + cellSize + cellSize / 2)
  }

  const drawROCCurve = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const padding = 40
    const graphWidth = width - padding * 2
    const graphHeight = height - padding * 2
    const startX = padding
    const startY = height - padding

    // Draw axes
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + graphWidth, startY)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX, startY - graphHeight)
    ctx.stroke()

    // Draw axis labels
    ctx.fillStyle = "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"

    // X-axis label
    ctx.fillText(t.rocCurve.falsePositiveRate, startX + graphWidth / 2, startY + 25)

    // Y-axis label
    ctx.save()
    ctx.translate(startX - 25, startY - graphHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText(t.rocCurve.truePositiveRate, 0, 0)
    ctx.restore()

    // Draw axis ticks and values
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // X-axis ticks
    for (let i = 0; i <= 10; i += 2) {
      const x = startX + (i / 10) * graphWidth
      ctx.beginPath()
      ctx.moveTo(x, startY)
      ctx.lineTo(x, startY + 5)
      ctx.stroke()
      ctx.fillText((i / 10).toString(), x, startY + 15)
    }

    // Y-axis ticks
    for (let i = 0; i <= 10; i += 2) {
      const y = startY - (i / 10) * graphHeight
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(startX - 5, y)
      ctx.stroke()
      ctx.textAlign = "right"
      ctx.fillText((i / 10).toString(), startX - 10, y)
    }

    // Draw diagonal reference line (random classifier)
    ctx.strokeStyle = "#94a3b8"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    ctx.lineTo(startX + graphWidth, startY - graphHeight)
    ctx.stroke()
    ctx.setLineDash([])

    // Draw ROC curve (using AUC value to approximate a curve)
    const auc = metrics.auc
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(startX, startY)

    // Generate curve points based on AUC
    // Higher AUC = curve closer to top-left corner
    for (let i = 0; i <= 100; i++) {
      const x = i / 100
      // This is a simple approximation of an ROC curve with given AUC
      const y = Math.pow(x, 1 / auc - 1)

      const plotX = startX + x * graphWidth
      const plotY = startY - y * graphHeight

      ctx.lineTo(plotX, plotY)
    }

    ctx.stroke()

    // Draw AUC value
    ctx.fillStyle = "#1e293b"
    ctx.font = "bold 14px sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(`AUC = ${auc.toFixed(2)}`, startX + graphWidth * 0.6, startY - graphHeight * 0.2)
  }

  return (
    <div className="w-full overflow-hidden">
      <Tabs defaultValue="metrics" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid grid-cols-3 mb-4">
          
          <TabsTrigger value="metrics" className="text-[10px] gap-0">
            <BarChart className="h-4 w-4" />
            <span>{t.tabs.metrics}</span>
          </TabsTrigger>
          <TabsTrigger value="confusion" className="text-[10px] flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>{t.tabs.confusion}</span>
          </TabsTrigger>
          <TabsTrigger value="roc" className="text-xs flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            <span>{t.tabs.roc}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto" />
        </TabsContent>

        <TabsContent value="confusion">
          <div className="space-y-2 mb-4">
            <h3 className="text-sm font-medium">{t.confusionMatrix.title}</h3>
            <p className="text-xs text-muted-foreground">{t.confusionMatrix.description}</p>
          </div>
          <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto" />
        </TabsContent>

        <TabsContent value="roc">
          <div className="space-y-2 mb-4">
            <h3 className="text-sm font-medium">{t.rocCurve.title}</h3>
            <p className="text-xs text-muted-foreground">{t.rocCurve.description}</p>
          </div>
          <canvas ref={canvasRef} width={600} height={300} className="w-full h-auto" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

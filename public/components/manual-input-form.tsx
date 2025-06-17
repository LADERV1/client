"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ManualInputFormProps {
  onSubmit: () => void
  onResult: (result: any) => void
  language: "en" | "fr"
}

const FEATURE_NAMES = [
  "MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)", "MDVP:Jitter(%)", "MDVP:Jitter(Abs)",
  "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer", "MDVP:Shimmer(dB)",
  "Shimmer:APQ3", "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR",
  "RPDE", "DFA", "spread1", "spread2", "D2", "PPE",
]

const featureMaxValues: Record<string, number> = {
  "MDVP:Fo(Hz)": 260, "MDVP:Fhi(Hz)": 600, "MDVP:Flo(Hz)": 200, "MDVP:Jitter(%)": 2.0, "MDVP:Jitter(Abs)": 0.0001,
  "MDVP:RAP": 0.02, "MDVP:PPQ": 0.02, "Jitter:DDP": 0.03, "MDVP:Shimmer": 0.2, "MDVP:Shimmer(dB)": 2.0,
  "Shimmer:APQ3": 0.03, "Shimmer:APQ5": 0.03, "MDVP:APQ": 0.05, "Shimmer:DDA": 0.1, "NHR": 0.5, "HNR": 30,
  "RPDE": 1.0, "DFA": 1.0, "spread1": 10, "spread2": 10, "D2": 3.0, "PPE": 1.0,
}

const presets = {
  healthy: {
    "MDVP:Fo(Hz)": 120.0, "MDVP:Fhi(Hz)": 157.3, "MDVP:Flo(Hz)": 114.2, "MDVP:Jitter(%)": 0.006,
    "MDVP:Jitter(Abs)": 0.00004, "MDVP:RAP": 0.003, "MDVP:PPQ": 0.003, "Jitter:DDP": 0.009, "MDVP:Shimmer": 0.029,
    "MDVP:Shimmer(dB)": 0.282, "Shimmer:APQ3": 0.015, "Shimmer:APQ5": 0.018, "MDVP:APQ": 0.021, "Shimmer:DDA": 0.045,
    "NHR": 0.014, "HNR": 21.9, "RPDE": 0.499, "DFA": 0.678, "spread1": 0.217, "spread2": 2.301, "D2": 1.743,
    "PPE": 0.119,
  },
  parkinsons: {
    "MDVP:Fo(Hz)": 174.2, "MDVP:Fhi(Hz)": 223.6, "MDVP:Flo(Hz)": 140.4, "MDVP:Jitter(%)": 0.0101,
    "MDVP:Jitter(Abs)": 0.00007, "MDVP:RAP": 0.00585, "MDVP:PPQ": 0.00642, "Jitter:DDP": 0.01755, "MDVP:Shimmer": 0.0619,
    "MDVP:Shimmer(dB)": 0.626, "Shimmer:APQ3": 0.0338, "Shimmer:APQ5": 0.0427, "MDVP:APQ": 0.0459, "Shimmer:DDA": 0.1014,
    "NHR": 0.0329, "HNR": 19.085, "RPDE": 0.6216, "DFA": 0.7385, "spread1": 0.3919, "spread2": 3.671, "D2": 2.497, "PPE": 0.3145,
  },
}

const featureDescriptions: Record<"en" | "fr", Record<string, string>> = {
  en: {
    "MDVP:Fo(Hz)": "Average vocal fundamental frequency",
    "MDVP:Fhi(Hz)": "Maximum vocal fundamental frequency",
    "MDVP:Flo(Hz)": "Minimum vocal fundamental frequency",
    "MDVP:Jitter(%)": "Percentage variation in fundamental frequency",
    "MDVP:Jitter(Abs)": "Absolute jitter in microseconds",
    "MDVP:RAP": "Relative amplitude perturbation",
    "MDVP:PPQ": "Five-point period perturbation quotient",
    "Jitter:DDP": "Average absolute difference of differences between cycles",
    "MDVP:Shimmer": "Percentage variation in amplitude",
    "MDVP:Shimmer(dB)": "Shimmer in decibels",
    "Shimmer:APQ3": "Three-point amplitude perturbation quotient",
    "Shimmer:APQ5": "Five-point amplitude perturbation quotient",
    "MDVP:APQ": "Amplitude perturbation quotient",
    "Shimmer:DDA": "Average absolute differences between consecutive differences",
    NHR: "Noise-to-harmonics ratio",
    HNR: "Harmonics-to-noise ratio",
    RPDE: "Recurrence period density entropy measure",
    DFA: "Signal fractal scaling exponent",
    spread1: "Nonlinear measure of fundamental frequency variation",
    spread2: "Nonlinear measure of fundamental frequency variation",
    D2: "Correlation dimension",
    PPE: "Pitch period entropy",
  },
  fr: {
    "MDVP:Fo(Hz)": "Fréquence fondamentale vocale moyenne",
    "MDVP:Fhi(Hz)": "Fréquence fondamentale vocale maximale",
    "MDVP:Flo(Hz)": "Fréquence fondamentale vocale minimale",
    "MDVP:Jitter(%)": "Variation en pourcentage de la fréquence fondamentale",
    "MDVP:Jitter(Abs)": "Jitter absolu en microsecondes",
    "MDVP:RAP": "Perturbation relative de l'amplitude",
    "MDVP:PPQ": "Quotient de perturbation de période à cinq points",
    "Jitter:DDP": "Différence absolue moyenne des différences entre cycles",
    "MDVP:Shimmer": "Variation en pourcentage de l'amplitude",
    "MDVP:Shimmer(dB)": "Shimmer en décibels",
    "Shimmer:APQ3": "Quotient de perturbation d'amplitude à trois points",
    "Shimmer:APQ5": "Quotient de perturbation d'amplitude à cinq points",
    "MDVP:APQ": "Quotient de perturbation d'amplitude",
    "Shimmer:DDA": "Différences absolues moyennes entre les différences consécutives",
    NHR: "Rapport bruit-harmoniques",
    HNR: "Rapport harmoniques-bruit",
    RPDE: "Mesure d'entropie de densité de période de récurrence",
    DFA: "Exposant d'échelle fractale du signal",
    spread1: "Mesure non linéaire de la variation de fréquence fondamentale",
    spread2: "Mesure non linéaire de la variation de fréquence fondamentale",
    D2: "Dimension de corrélation",
    PPE: "Entropie de période de hauteur",
  },
}

const tabLabels = {
  en: {
    frequency: "Frequency", jitter: "Jitter", shimmer: "Shimmer", noise: "Noise", nonlinear: "Nonlinear",
    analyze: "Analyze Features", reset: "Reset Values", presets: "Load Presets", hidePresets: "Hide Presets",
    healthyPreset: "Healthy Voice Sample", healthyDesc: "Normal vocal parameters",
    parkinsonsPreset: "Parkinson's Voice Sample", parkinsonsDesc: "Typical Parkinson's indicators",
  },
  fr: {
    frequency: "Fréquence", jitter: "Jitter", shimmer: "Shimmer", noise: "Mesures de Bruit", nonlinear: "Mesures Non Linéaires",
    analyze: "Analyser les Caractéristiques", reset: "Réinitialiser les Valeurs", presets: "Charger Préréglages", hidePresets: "Masquer Préréglages",
    healthyPreset: "Échantillon Vocal Sain", healthyDesc: "Paramètres vocaux normaux",
    parkinsonsPreset: "Échantillon Vocal Parkinson", parkinsonsDesc: "Indicateurs typiques de Parkinson",
  },
}

export default function ManualInputForm({ onSubmit, onResult, language }: ManualInputFormProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState("frequency")
  const [showPresets, setShowPresets] = useState(true)
  const [features, setFeatures] = useState(() =>
    Object.fromEntries(FEATURE_NAMES.map((name) => [name, 0.0]))
  )

  const t = tabLabels[language]
  const descriptions = featureDescriptions[language]

  const handleFeatureChange = (feature: string, value: number) => {
    setFeatures((prev) => ({ ...prev, [feature]: value }))
  }
  const handleSliderChange = (feature: string, value: number[]) => {
    handleFeatureChange(feature, value[0])
  }
  const handleReset = () => {
    setFeatures(Object.fromEntries(FEATURE_NAMES.map((key) => [key, 0.0])))
  }
  const loadPreset = (presetName: "healthy" | "parkinsons") => {
    setFeatures(presets[presetName])
  }

  const handleSubmit = async () => {
    onSubmit()
    try {
      const featuresArray = FEATURE_NAMES.map((name) => features[name])
      const response = await fetch("/api/predict-parkinsons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: featuresArray }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Prediction failed")
      }
      const result = await response.json()
      // Defensive mapping for robust integration!
      const mappedResult = {
        prediction:
          result.result === "Parkinson's Disease"
            ? "positive"
            : "negative",
        probability:
          typeof result.probability === "number" && !isNaN(result.probability)
            ? result.probability
            : null,
        message: result.message,
        features: (() => {
          if (result.features && typeof result.features === "object") {
            const obj: Record<string, number> = {}
            FEATURE_NAMES.forEach((name) => {
              obj[name] = result.features[name]
            })
            return obj
          }
          if (result.features && Array.isArray(result.features)) {
            const obj: Record<string, number> = {}
            FEATURE_NAMES.forEach((name, idx) => {
              obj[name] = result.features[idx]
            })
            return obj
          }
          return {}
        })(),
      }
      onResult(mappedResult)
    } catch (error) {
      console.error("Error:", error)
      alert(
        language === "en"
          ? `An error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`
          : `Une erreur s'est produite lors de l'analyse: ${error instanceof Error ? error.message : String(error)}`,
      )
      onResult(null)
    }
  }

  const renderFeatureInput = (name: string, label: string) => (
    <div key={name} className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm font-medium">{label}</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <HelpCircle className="h-4 w-4" />
                <span className="sr-only">Info</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{descriptions[name]}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-4">
        <Slider
          id={name}
          min={0}
          max={featureMaxValues[name]}
          step={0.01}
          value={[features[name]]}
          onValueChange={(value) => handleSliderChange(name, value)}
          className="flex-1"
        />
        <Input
          type="number"
          min={0}
          max={featureMaxValues[name]}
          step={0.01}
          value={features[name]}
          onChange={(e) => handleFeatureChange(name, Number.parseFloat(e.target.value) || 0)}
          className="w-20"
        />
      </div>
    </div>
  )

  const frequencyFeatures = ["MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)"]
  const jitterFeatures = ["MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP"]
  const shimmerFeatures = ["MDVP:Shimmer", "MDVP:Shimmer(dB)", "Shimmer:APQ3", "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA"]
  const noiseFeatures = ["NHR", "HNR"]
  const nonlinearFeatures = ["RPDE", "DFA", "spread1", "spread2", "D2", "PPE"]

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPresets((show) => !show)}
          className="text-xs h-8 flex items-center gap-1.5"
        >
          {showPresets ? t.hidePresets : t.presets}
        </Button>
      </div>

      {showPresets && (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 h-auto py-3 px-4 border border-green-200 bg-green-50/50 hover:bg-green-100 hover:text-green-800 transition-colors"
            onClick={() => loadPreset("healthy")}
          >
            <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#22C55E" strokeWidth="2" /><path d="M8 12L11 15L16 10" stroke="#22C55E" strokeWidth="2" /></svg>
            </div>
            <div className="text-left">
              <div className="text-[10.4px] font-medium">{t.healthyPreset}</div>
              <div className="text-[9px] text-muted-foreground">{t.healthyDesc}</div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-start gap-3 h-auto py-3 px-4 border border-red-200 bg-red-50/50 hover:bg-red-100 hover:text-red-800 transition-colors"
            onClick={() => loadPreset("parkinsons")}
          >
            <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2" /><path d="M12 8V12" stroke="#EF4444" strokeWidth="2" /><path d="M12 16H12.01" stroke="#EF4444" strokeWidth="2" /></svg>
            </div>
            <div className="text-left">
              <div className="text-[9.6px] font-medium text-sm">{t.parkinsonsPreset}</div>
              <div className="text-[8.9px] text-muted-foreground">{t.parkinsonsDesc}</div>
            </div>
          </Button>
        </div>
      )}

      <Tabs defaultValue="frequency" onValueChange={setActiveFeatureTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="frequency" className="text[13px]">{t.frequency}</TabsTrigger>
          <TabsTrigger value="jitter" className="text[13px]">{t.jitter}</TabsTrigger>
          <TabsTrigger value="shimmer" className="text[13px]">{t.shimmer}</TabsTrigger>
          <TabsTrigger value="noise" className="text[13px]">{t.noise}</TabsTrigger>
          <TabsTrigger value="nonlinear" className="text[13px]">{t.nonlinear}</TabsTrigger>
        </TabsList>
        <TabsContent value="frequency" className="space-y-4">
          {frequencyFeatures.map((feature) => renderFeatureInput(feature, feature))}
        </TabsContent>
        <TabsContent value="jitter" className="space-y-4">
          {jitterFeatures.map((feature) => renderFeatureInput(feature, feature))}
        </TabsContent>
        <TabsContent value="shimmer" className="space-y-4">
          {shimmerFeatures.map((feature) => renderFeatureInput(feature, feature))}
        </TabsContent>
        <TabsContent value="noise" className="space-y-4">
          {noiseFeatures.map((feature) => renderFeatureInput(feature, feature))}
        </TabsContent>
        <TabsContent value="nonlinear" className="space-y-4">
          {nonlinearFeatures.map((feature) => renderFeatureInput(feature, feature))}
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleReset}>{t.reset}</Button>
        <Button className="flex-1" onClick={handleSubmit}>{t.analyze}</Button>
      </div>
    </div>
  )
}
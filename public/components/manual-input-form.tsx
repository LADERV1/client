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

// Define FEATURE_NAMES here to ensure correct order for API call and feature visualization
const FEATURE_NAMES = [
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
]

export default function ManualInputForm({ onSubmit, onResult, language }: ManualInputFormProps) {
  const [activeFeatureTab, setActiveFeatureTab] = useState("frequency")

  const [features, setFeatures] = useState({
    // Frequency measures
    "MDVP:Fo(Hz)": 0.0,
    "MDVP:Fhi(Hz)": 0.0,
    "MDVP:Flo(Hz)": 0.0,
    // Jitter measures
    "MDVP:Jitter(%)": 0.0,
    "MDVP:Jitter(Abs)": 0.0,
    "MDVP:RAP": 0.0,
    "MDVP:PPQ": 0.0,
    "Jitter:DDP": 0.0,
    // Shimmer measures
    "MDVP:Shimmer": 0.0,
    "MDVP:Shimmer(dB)": 0.0,
    "Shimmer:APQ3": 0.0,
    "Shimmer:APQ5": 0.0,
    "MDVP:APQ": 0.0,
    "Shimmer:DDA": 0.0,
    // Noise measures
    NHR: 0.0,
    HNR: 0.0,
    // Nonlinear measures
    RPDE: 0.0,
    DFA: 0.0,
    spread1: 0.0,
    spread2: 0.0,
    D2: 0.0,
    PPE: 0.0,
  })

  const featureDescriptions = {
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

  // Add the featureMaxValues constant at the top of the component, after the translations
  const featureMaxValues = {
    "MDVP:Fo(Hz)": 260,
    "MDVP:Fhi(Hz)": 600,
    "MDVP:Flo(Hz)": 200,
    "MDVP:Jitter(%)": 2.0,
    "MDVP:Jitter(Abs)": 0.0001,
    "MDVP:RAP": 0.02,
    "MDVP:PPQ": 0.02,
    "Jitter:DDP": 0.03,
    "MDVP:Shimmer": 0.2,
    "MDVP:Shimmer(dB)": 2.0,
    "Shimmer:APQ3": 0.03,
    "Shimmer:APQ5": 0.03,
    "MDVP:APQ": 0.05,
    "Shimmer:DDA": 0.1,
    NHR: 0.5,
    HNR: 30,
    RPDE: 1.0,
    DFA: 1.0,
    spread1: 10,
    spread2: 10,
    D2: 3.0,
    PPE: 1.0,
  }

  // Add the presets section after the featureMaxValues constant
  const presets = {
    healthy: {
      "MDVP:Fo(Hz)": 120.0,
      "MDVP:Fhi(Hz)": 157.3,
      "MDVP:Flo(Hz)": 114.2,
      "MDVP:Jitter(%)": 0.006,
      "MDVP:Jitter(Abs)": 0.00004,
      "MDVP:RAP": 0.003,
      "MDVP:PPQ": 0.003,
      "Jitter:DDP": 0.009,
      "MDVP:Shimmer": 0.029,
      "MDVP:Shimmer(dB)": 0.282,
      "Shimmer:APQ3": 0.015,
      "Shimmer:APQ5": 0.018,
      "MDVP:APQ": 0.021,
      "Shimmer:DDA": 0.045,
      NHR: 0.014,
      HNR: 21.9,
      RPDE: 0.499,
      DFA: 0.678,
      spread1: 0.217,
      spread2: 2.301,
      D2: 1.743,
      PPE: 0.119,
    },
    parkinsons: {
      "MDVP:Fo(Hz)": 174.2,
      "MDVP:Fhi(Hz)": 223.6,
      "MDVP:Flo(Hz)": 140.4,
      "MDVP:Jitter(%)": 0.0101,
      "MDVP:Jitter(Abs)": 0.00007,
      "MDVP:RAP": 0.00585,
      "MDVP:PPQ": 0.00642,
      "Jitter:DDP": 0.01755,
      "MDVP:Shimmer": 0.0619,
      "MDVP:Shimmer(dB)": 0.626,
      "Shimmer:APQ3": 0.0338,
      "Shimmer:APQ5": 0.0427,
      "MDVP:APQ": 0.0459,
      "Shimmer:DDA": 0.1014,
      NHR: 0.0329,
      HNR: 19.085,
      DFA: 0.7385,
      RPDE: 0.6216,
      spread1: 0.3919,
      spread2: 3.671,
      D2: 2.497,
      PPE: 0.3145,
    },
  }

  // Add these translations to the tabLabels object
  const tabLabels = {
    en: {
      frequency: "Frequency",
      jitter: "Jitter",
      shimmer: "Shimmer",
      noise: "Noise ",
      nonlinear: "Nonlinear ",
      analyze: "Analyze Features",
      reset: "Reset Values",
      presets: "Load Presets",
      hidePresets: "Hide Presets",
      healthyPreset: "Healthy Voice Sample",
      healthyDesc: "Normal vocal parameters",
      parkinsonsPreset: "Parkinson's Voice Sample",
      parkinsonsDesc: "Typical Parkinson's indicators",
    },
    fr: {
      frequency: "Fréquence",
      jitter: "Jitter",
      shimmer: "Shimmer",
      noise: "Mesures de Bruit",
      nonlinear: "Mesures Non Linéaires",
      analyze: "Analyser les Caractéristiques",
      reset: "Réinitialiser les Valeurs",
      presets: "Charger Préréglages",
      hidePresets: "Masquer Préréglages",
      healthyPreset: "Échantillon Vocal Sain",
      healthyDesc: "Paramètres vocaux normaux",
      parkinsonsPreset: "Échantillon Vocal Parkinson",
      parkinsonsDesc: "Indicateurs typiques de Parkinson",
    },
  }

  // Add a state variable for showing/hiding presets
  const [showPresets, setShowPresets] = useState(true)

  const t = tabLabels[language]
  const descriptions = featureDescriptions[language]

  const handleFeatureChange = (feature: string, value: number) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: value,
    }))
  }

  const handleSliderChange = (feature: string, value: number[]) => {
    handleFeatureChange(feature, value[0])
  }

  const handleReset = () => {
    setFeatures(Object.fromEntries(Object.keys(features).map((key) => [key, 0.0])))
  }

  // Add a loadPreset function after the handleReset function
  const loadPreset = (presetName: "healthy" | "parkinsons") => {
    setFeatures(presets[presetName])
  }

  const handleSubmit = async () => {
    onSubmit()

    try {
      // Convert features object to an ordered array for the API
      const featuresArray = FEATURE_NAMES.map((name) => features[name as keyof typeof features])

      const response = await fetch("/api/predict-parkinsons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ features: featuresArray }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Prediction failed")
      }

      const result = await response.json()

      // Reformat the features array from the API response back into an object
      // for the FeatureVisualization component, which expects Record<string, number>
      const formattedFeatures: Record<string, number> = {}
      if (result.features && Array.isArray(result.features)) {
        FEATURE_NAMES.forEach((name, index) => {
          formattedFeatures[name] = result.features[index]
        })
      }

      // Map the API response to the PredictionResult interface expected by page.tsx
      const mappedResult = {
        prediction: result.prediction === 1 ? "positive" : "negative",
        probability: result.confidence, // page.tsx uses 'probability' as confidence
        message: result.message,
        features: formattedFeatures, // Provide features as an object
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

  // Then modify the renderFeatureInput function to use these max values
  const renderFeatureInput = (name: string, label: string, key: keyof typeof features) => {
    return (
      <div key={key} className="space-y-2"> {/* Added key prop here */}
        <div className="flex items-center justify-between">
          <Label htmlFor={key} className="text-sm font-medium">
            {label}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <HelpCircle className="h-4 w-4" />
                  <span className="sr-only">Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{descriptions[key]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center gap-4">
          <Slider
            id={key}
            min={0}
            max={featureMaxValues[key]}
            step={0.01}
            value={[features[key]]}
            onValueChange={(value) => handleSliderChange(key, value)}
            className="flex-1"
          />
          <Input
            type="number"
            min={0}
            max={featureMaxValues[key]}
            step={0.01}
            value={features[key]}
            onChange={(e) => handleFeatureChange(key, Number.parseFloat(e.target.value) || 0)}
            className="w-20"
          />
        </div>
      </div>
    )
  }

  const frequencyFeatures = ["MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)"]
  const jitterFeatures = ["MDVP:Jitter(%)", "MDVP:Jitter(Abs)", "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP"]
  const shimmerFeatures = [
    "MDVP:Shimmer",
    "MDVP:Shimmer(dB)",
    "Shimmer:APQ3",
    "Shimmer:APQ5",
    "MDVP:APQ",
    "Shimmer:DDA",
  ]
  const noiseFeatures = ["NHR", "HNR"]
  const nonlinearFeatures = ["RPDE", "DFA", "spread1", "spread2", "D2", "PPE"]

  // Replace the return statement with this updated version that includes the presets section
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPresets(!showPresets)}
          className="text-xs h-8 flex items-center gap-1.5"
        >
          {showPresets ? (
            <>
              <span>{t.hidePresets}</span>
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.13523 8.84197C3.3241 9.04343 3.64052 9.05363 3.84197 8.86477L7.5 5.43536L11.158 8.86477C11.3595 9.05363 11.6759 9.04343 11.8648 8.84197C12.0536 8.64051 12.0434 8.32409 11.842 8.13523L7.84197 4.38523C7.64964 4.20492 7.35036 4.20492 7.15803 4.38523L3.15803 8.13523C2.95657 8.32409 2.94637 8.64051 3.13523 8.84197Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </>
          ) : (
            <>
              <span>{t.presets}</span>
              <svg width="12" height="12" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </>
          )}
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12L11 15L16 10"
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#EF4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M12 8V12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 16H12.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
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
          <TabsTrigger value="frequency" className="text[13px]">
            {t.frequency}
          </TabsTrigger>
          <TabsTrigger value="jitter" className="text[13px]">
            {t.jitter}
          </TabsTrigger>
          <TabsTrigger value="shimmer" className="text[13px]">
            {t.shimmer}
          </TabsTrigger>
          <TabsTrigger value="noise" className="text[13px]">
            {t.noise}
          </TabsTrigger>
          <TabsTrigger value="nonlinear" className="text[13px]">
            {t.nonlinear}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="frequency" className="space-y-4">
          {frequencyFeatures.map((feature) => renderFeatureInput(feature, feature, feature as keyof typeof features))}
        </TabsContent>

        <TabsContent value="jitter" className="space-y-4">
          {jitterFeatures.map((feature) => renderFeatureInput(feature, feature, feature as keyof typeof features))}
        </TabsContent>

        <TabsContent value="shimmer" className="space-y-4">
          {shimmerFeatures.map((feature) => renderFeatureInput(feature, feature, feature as keyof typeof features))}
        </TabsContent>

        <TabsContent value="noise" className="space-y-4">
          {noiseFeatures.map((feature) => renderFeatureInput(feature, feature, feature as keyof typeof features))}
        </TabsContent>

        <TabsContent value="nonlinear" className="space-y-4">
          {nonlinearFeatures.map((feature) => renderFeatureInput(feature, feature, feature as keyof typeof features))}
        </TabsContent>
      </Tabs>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          {t.reset}
        </Button>
        <Button className="flex-1" onClick={handleSubmit}>
          {t.analyze}
        </Button>
      </div>
    </div>
  )
}
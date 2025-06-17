"use client"

import { AlertCircle, CheckCircle, Download, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

interface PredictionResultProps {
  prediction: {
    prediction: string // "positive" | "negative"
    probability: number | null | undefined
    message: string
    features?: Record<string, number>
  }
  language: "en" | "fr"
}

export default function PredictionResult({ prediction, language }: PredictionResultProps) {
  const isPositive = prediction.prediction === "positive"
  // Safely handle NaN, null or undefined probabilities
  const probabilityPercentage =
    typeof prediction.probability === "number" && !isNaN(prediction.probability)
      ? Math.round(prediction.probability * 100)
      : "N/A"
  const [shareDialogOpen, setShareDialogOpen] = useState(false)

  const translations = {
    en: {
      positive: "Parkinson's Indicators Detected",
      negative: "No Significant Indicators",
      confidence: "Prediction Confidence",
      sensitivity: "Sensitivity",
      specificity: "Specificity",
      disclaimer:
        "This analysis is based on vocal pattern recognition and should be used for screening purposes only. Please consult with a healthcare professional for a proper diagnosis.",
      share: "Share Results",
      download: "Download PDF",
      shareTitle: "Share Analysis Results",
      shareDescription: "Choose how you want to share these results",
      shareOptions: {
        email: "Email Results",
        doctor: "Send to Doctor",
        copy: "Copy Link",
        print: "Print Results",
      },
      close: "Close",
      resultDate: "Analysis Date",
      resultId: "Result ID",
    },
    fr: {
      positive: "Indicateurs de Parkinson Détectés",
      negative: "Aucun Indicateur Significatif",
      confidence: "Confiance de Prédiction",
      sensitivity: "Sensibilité",
      specificity: "Spécificité",
      disclaimer:
        "Cette analyse est basée sur la reconnaissance des modèles vocaux et doit être utilisée uniquement à des fins de dépistage. Veuillez consulter un professionnel de la santé pour un diagnostic approprié.",
      share: "Partager les Résultats",
      download: "Télécharger PDF",
      shareTitle: "Partager les Résultats d'Analyse",
      shareDescription: "Choisissez comment vous souhaitez partager ces résultats",
      shareOptions: {
        email: "Envoyer par Email",
        doctor: "Envoyer au Médecin",
        copy: "Copier le Lien",
        print: "Imprimer les Résultats",
      },
      close: "Fermer",
      resultDate: "Date d'Analyse",
      resultId: "ID du Résultat",
    },
  }

  const t = translations[language]

  // Generate a random result ID for demo purposes
  const resultId = `R-${Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")}`

  // Get current date
  const currentDate = new Date().toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleShare = (method: string) => {
    // In a real app, this would implement actual sharing functionality
    console.log(`Sharing via ${method}`)

    if (method === "print") {
      window.print()
    }

    setShareDialogOpen(false)
  }

  return (
    <Card className={isPositive ? "border-red-200" : "border-green-200"}>
      <CardHeader className={`pb-2 ${isPositive ? "bg-red-50" : "bg-green-50"}`}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isPositive ? (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>{t.positive}</span>
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{t.negative}</span>
                </>
              )}
            </CardTitle>
            <CardDescription>{prediction.message}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Share2 className="h-4 w-4 mr-1" />
                  {t.share}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t.shareTitle}</DialogTitle>
                  <DialogDescription>{t.shareDescription}</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button variant="outline" onClick={() => handleShare("email")}>
                    {t.shareOptions.email}
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("doctor")}>
                    {t.shareOptions.doctor}
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("copy")}>
                    {t.shareOptions.copy}
                  </Button>
                  <Button variant="outline" onClick={() => handleShare("print")}>
                    {t.shareOptions.print}
                  </Button>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setShareDialogOpen(false)}>
                    {t.close}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" className="h-8" onClick={() => window.print()}>
              <Download className="h-4 w-4 mr-1" />
              {t.download}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div>
              <span className="font-medium">{t.resultDate}:</span> {currentDate}
            </div>
            <div>
              <span className="font-medium">{t.resultId}:</span> {resultId}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{t.confidence}</span>
              <span className="text-sm font-medium">
                {probabilityPercentage !== "N/A" ? `${probabilityPercentage}%` : "N/A"}
              </span>
            </div>
            <Progress
              value={typeof probabilityPercentage === "number" ? probabilityPercentage : 0}
              className={`h-2 ${isPositive ? "bg-red-100" : "bg-green-100"}`}
              indicatorClassName={isPositive ? "bg-red-500" : "bg-green-500"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm text-muted-foreground">{t.sensitivity}</div>
              <div className="text-lg font-semibold">92%</div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm text-muted-foreground">{t.specificity}</div>
              <div className="text-lg font-semibold">88%</div>
            </div>
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            <p>{t.disclaimer}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
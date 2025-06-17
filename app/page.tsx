"use client"

import { useState, useEffect } from "react"
import { Upload, FileAudio, BarChart3, Download, MicVocal, Info, Users, LogIn, LogOut, ShieldCheck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import UploadForm from "@/public/components/upload-form"
import ManualInputForm from "@/public/components/manual-input-form"
import PredictionResult from "@/public/components/prediction-result"
import FeatureVisualization from "@/public/components/feature-visualization"
import ModelPerformance from "@/public/components/model-performance"
import ProjectInfo from "@/public/components/project-info"
import PatientRegistry from "@/public/components/patient-registry"
import PatientLogin from "@/public/components/patient-login"
import PatientDashboard from "@/public/components/patient-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"

type UserRole = "patient" | "admin" | null

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  testHistory?: any[]
}

const KEY_FEATURES = [
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

function normalizeFeatures(input: any): Record<string, number> {
  // If input is already an object with all keys, return as-is
  if (input && typeof input === "object" && !Array.isArray(input)) {
    const asObj: Record<string, number> = {}
    KEY_FEATURES.forEach((key) => {
      asObj[key] = typeof input[key] === "number" ? input[key] : 0
    })
    return asObj
  }
  // If input is an array, map to keys
  if (Array.isArray(input)) {
    const asObj: Record<string, number> = {}
    KEY_FEATURES.forEach((key, idx) => {
      asObj[key] = typeof input[idx] === "number" ? input[idx] : 0
    })
    return asObj
  }
  // Otherwise, return zeros
  return Object.fromEntries(KEY_FEATURES.map((key) => [key, 0]))
}

export default function Home() {
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [language, setLanguage] = useState<"en" | "fr">("en")
  const [currentView, setCurrentView] = useState<"analysis" | "registry" | "info" | "login" | "dashboard">("analysis")
  const [user, setUser] = useState<User | null>(null)
  const [accessError, setAccessError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        if (parsedUser.role === "patient") {
          setCurrentView("dashboard")
        }
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const toggleLanguage = () => setLanguage(language === "en" ? "fr" : "en")

  const translations = {
    en: {
      title: "Early Detection of Parkinson's Disease Using Voice Analysis",
      subtitle:
        "Upload a voice recording or enter acoustic features to analyze for potential Parkinson's disease indicators",
      uploadTab: "Upload Voice Recording",
      manualTab: "Enter Acoustic Features",
      inputData: "Input Data",
      uploadDesc: "Upload a voice recording for analysis",
      manualDesc: "Enter acoustic measurements from voice analysis",
      noDataTitle: "No Data Analyzed Yet",
      noDataDesc: {
        upload: "Upload a voice recording and submit for analysis",
        manual: "Enter acoustic feature values and submit for analysis",
      },
      analyzing: "Analyzing voice data...",
      infoButton: "About This Project",
      registryButton: "Patient Registry",
      analysisButton: "Voice Analysis",
      loginButton: "Patient Login",
      dashboardButton: "My Dashboard",
      patientInfo: "Patient Information",
      welcomeBack: "Welcome back",
      viewHistory: "View History",
      logout: "Log Out",
      accessDenied: "Access Denied",
      accessDeniedMessage: "You don't have permission to access this area.",
      providerLogin: "Provider Login",
      adminLoginButton: "Admin Login",
    },
    fr: {
      title: "Détection Précoce de la Maladie de Parkinson à l'Aide de l'Analyse Vocale",
      subtitle:
        "Téléchargez un enregistrement vocal ou entrez des caractéristiques acoustiques pour analyser les indicateurs potentiels de la maladie de Parkinson",
      uploadTab: "Télécharger un Enregistrement Vocal",
      manualTab: "Entrer les Caractéristiques Acoustiques",
      inputData: "Données d'Entrée",
      uploadDesc: "Téléchargez un enregistrement vocal pour analyse",
      manualDesc: "Entrez les mesures acoustiques de l'analyse vocale",
      noDataTitle: "Aucune Donnée Analysée",
      noDataDesc: {
        upload: "Téléchargez un enregistrement vocal et soumettez-le pour analyse",
        manual: "Entrez les valeurs des caractéristiques acoustiques et soumettez-les pour analyse",
      },
      analyzing: "Analyse des données vocales...",
      infoButton: "À Propos de ce Projet",
      registryButton: "Registre des Patients",
      analysisButton: "Analyse Vocale",
      loginButton: "Connexion Patient",
      dashboardButton: "Mon Tableau de Bord",
      patientInfo: "Information du Patient",
      welcomeBack: "Bienvenue",
      viewHistory: "Voir l'Historique",
      logout: "Déconnexion",
      accessDenied: "Accès Refusé",
      accessDeniedMessage: "Vous n'avez pas la permission d'accéder à cette zone.",
      providerLogin: "Connexion Prestataire",
      adminLoginButton: "Connexion Admin",
    },
  }

  const t = translations[language]

  const handlePredictionResult = (result: any) => {
    setIsLoading(false)
    // Guarantee features are always present and normalized
    const features = normalizeFeatures(result?.features)
    setPrediction({ ...result, features })

    // Save to user history if logged in
    if (user) {
      const newHistory = [
        ...(user.testHistory || []),
        {
          id: `test-${Date.now()}`,
          date: new Date().toISOString(),
          result: { ...result, features },
        },
      ]

      const updatedUser = {
        ...user,
        testHistory: newHistory,
      }

      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const handleLogin = (userData: User) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))

    if (userData.role === "patient") {
      setCurrentView("dashboard")
    } else {
      setCurrentView("analysis")
    }

    setAccessError(null)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    setCurrentView("analysis")
    setPrediction(null)
  }

  const handleViewChange = (view: typeof currentView) => {
    if (view === "registry" && (!user || user.role !== "admin")) {
      setAccessError(t.accessDeniedMessage)
      return
    }
    setAccessError(null)
    setCurrentView(view)
  }

  const canAccessRegistry = user?.role === "admin"

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-6xl">
        {/* ...header and nav unchanged... */}

        {/* ...user bar, access error, and navigation unchanged... */}

        {currentView === "info" ? (
          <ProjectInfo language={language} onClose={() => handleViewChange("analysis")} />
        ) : currentView === "registry" ? (
          canAccessRegistry ? (
            <PatientRegistry language={language} />
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <h2 className="text-2xl font-bold mb-4">{t.accessDenied}</h2>
              <p className="text-muted-foreground mb-6">{t.accessDeniedMessage}</p>
              <Button onClick={() => handleViewChange("analysis")}>{t.analysisButton}</Button>
            </div>
          )
        ) : currentView === "login" ? (
          <PatientLogin language={language} onLogin={handleLogin} />
        ) : currentView === "dashboard" && user?.role === "patient" ? (
          <PatientDashboard language={language} user={user} onAnalyze={() => handleViewChange("analysis")} />
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{t.title}</h1>
              <p className="text-muted-foreground max-w-3xl mx-auto">{t.subtitle}</p>
            </div>

            {/* ...patient info card unchanged... */}

            <Tabs defaultValue="upload" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <FileAudio className="h-4 w-4" />
                  <span>{t.uploadTab}</span>
                </TabsTrigger>
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <MicVocal className="h-4 w-4" />
                  <span>{t.manualTab}</span>
                </TabsTrigger>
              </TabsList>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t.inputData}</CardTitle>
                      <CardDescription>{activeTab === "upload" ? t.uploadDesc : t.manualDesc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TabsContent value="upload" className="mt-0">
                        <UploadForm
                          onSubmit={() => setIsLoading(true)}
                          onResult={handlePredictionResult}
                          language={language}
                        />
                      </TabsContent>
                      <TabsContent value="manual" className="mt-0">
                        <ManualInputForm
                          onSubmit={() => setIsLoading(true)}
                          onResult={handlePredictionResult}
                          language={language}
                        />
                      </TabsContent>
                    </CardContent>
                  </Card>
                </div>

                <div className="md:col-span-2">
                  {prediction ? (
                    <div className="grid gap-6">
                      <PredictionResult prediction={prediction} language={language} />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <BarChart3 className="h-5 w-5" />
                              {language === "en"
                                ? "Key Vocal Biomarkers"
                                : "Biomarqueurs Vocaux Clés"}
                            </CardTitle>
                            <CardDescription>
                              {language === "en"
                                ? "Most significant acoustic features in this prediction"
                                : "Caractéristiques acoustiques les plus significatives dans cette prédiction"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <FeatureVisualization features={prediction.features} language={language} />
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg">
                              <BarChart3 className="h-5 w-5" />
                              {language === "en"
                                ? "Model Performance"
                                : "Performance du Modèle"}
                            </CardTitle>
                            <CardDescription>
                              {language === "en"
                                ? "Statistical evaluation of the AI model"
                                : "Évaluation statistique du modèle d'IA"}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <ModelPerformance language={language} />
                          </CardContent>
                        </Card>
                      </div>
                      <Card>
                        <CardFooter className="flex justify-between gap-4 p-4">
                          <Button variant="outline" className="w-full" onClick={() => window.print()}>
                            <Download className="mr-2 h-4 w-4" />
                            {language === "en" ? "Download Report" : "Télécharger le Rapport"}
                          </Button>
                          {!user && (
                            <Button className="w-full" onClick={() => handleViewChange("login")}>
                              <LogIn className="mr-2 h-4 w-4" />
                              {language === "en"
                                ? "Login to Save Results"
                                : "Connectez-vous pour Sauvegarder"}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </div>
                  ) : (
                    <Card className="h-full flex flex-col justify-center items-center p-8">
                      <div className="text-center space-y-4">
                        {isLoading ? (
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                            <p className="text-muted-foreground">{t.analyzing}</p>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
                            <h3 className="text-xl font-medium">{t.noDataTitle}</h3>
                            <p className="text-muted-foreground">
                              {activeTab === "upload" ? t.noDataDesc.upload : t.noDataDesc.manual}
                            </p>
                            {!user && (
                              <Button variant="outline" onClick={() => handleViewChange("login")} className="mt-4">
                                <LogIn className="mr-2 h-4 w-4" />
                                {t.loginButton}
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </Tabs>
          </>
        )}
      </div>
    </main>
  )
}
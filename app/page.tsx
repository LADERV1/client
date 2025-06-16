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

// Define user roles
type UserRole = "patient" | "admin" | null

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  testHistory?: any[]
}

export default function Home() {
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [language, setLanguage] = useState<"en" | "fr">("en")
  const [currentView, setCurrentView] = useState<"analysis" | "registry" | "info" | "login" | "dashboard">("analysis")
  const [user, setUser] = useState<User | null>(null)
  const [accessError, setAccessError] = useState<string | null>(null)

  //user demo test
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)

        // If a patient logs in, redirect to dashboard
        if (parsedUser.role === "patient") {
          setCurrentView("dashboard")
        }
      } catch (e) {
        console.error("Failed to parse stored user", e)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "fr" : "en")
  }

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
    setPrediction(result)
    setIsLoading(false)

    // If user is logged in, save the result to their history
    if (user) {
      const newHistory = [
        ...(user.testHistory || []),
        {
          id: `test-${Date.now()}`,
          date: new Date().toISOString(),
          result: result,
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
    // check permission 9bl man3ti roles 
    if (view === "registry" && (!user || user.role !== "admin")) {
      setAccessError(t.accessDeniedMessage)
      return
    }

    setAccessError(null)
    setCurrentView(view)
  }

  // Determine wach l user 3ndo l acces
  const canAccessRegistry = user?.role === "admin"

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <MicVocal className="size-5 text-primary" />
            </div>
            <span className="font-semibold text-lg">ParkinVoice AI</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="language-toggle" className="text-sm cursor-pointer">
                {language === "en" ? "EN" : "FR"}
              </Label>
              <Switch id="language-toggle" checked={language === "fr"} onCheckedChange={toggleLanguage} />
            </div>

            {user && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{user.name}</span>
                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={handleLogout}>
                  <LogOut className="h-3 w-3 mr-1" />
                  {t.logout}
                </Button>
              </div>
            )}

            <div className="hidden md:flex gap-2">
              <Button
                variant={currentView === "analysis" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange("analysis")}
              >
                <FileAudio className="mr-2 h-4 w-4" />
                {t.analysisButton}
              </Button>

              {user?.role === "patient" && (
                <Button
                  variant={currentView === "dashboard" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewChange("dashboard")}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  {t.dashboardButton}
                </Button>
              )}

              {user?.role === "admin" && (
                <Button
                  variant={currentView === "registry" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleViewChange("registry")}
                >
                  <Users className="mr-2 h-4 w-4" />
                  {t.registryButton}
                </Button>
              )}

              {!user && (
                <>
                  <Button
                    variant={currentView === "login" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleViewChange("login")}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {t.loginButton}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentView("login")
                      // Set a flag to show admin login tab
                      localStorage.setItem("showAdminLogin", "true")
                    }}
                  >
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {t.adminLoginButton}
                  </Button>
                </>
              )}

              <Button
                variant={currentView === "info" ? "default" : "outline"}
                size="sm"
                onClick={() => handleViewChange("info")}
              >
                <Info className="mr-2 h-4 w-4" />
                {t.infoButton}
              </Button>
            </div>

            <div className="flex md:hidden">
              <Tabs defaultValue="analysis" onValueChange={(value) => handleViewChange(value as any)}>
                <TabsList>
                  <TabsTrigger value="analysis">
                    <FileAudio className="h-4 w-4" />
                  </TabsTrigger>

                  {user?.role === "patient" && (
                    <TabsTrigger value="dashboard">
                      <BarChart3 className="h-4 w-4" />
                    </TabsTrigger>
                  )}

                  {user?.role === "admin" && (
                    <TabsTrigger value="registry">
                      <Users className="h-4 w-4" />
                    </TabsTrigger>
                  )}

                  {!user && (
                    <TabsTrigger value="login">
                      <LogIn className="h-4 w-4" />
                    </TabsTrigger>
                  )}

                  <TabsTrigger value="info">
                    <Info className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>

        {user && (
          <div className="md:hidden flex items-center justify-between mb-4 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.role === "patient"
                    ? language === "en"
                      ? "Patient"
                      : "Patient"
                    : language === "en"
                      ? "Healthcare Provider"
                      : "Prestataire de Santé"}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {t.logout}
            </Button>
          </div>
        )}

        {accessError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{accessError}</AlertDescription>
          </Alert>
        )}

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

            {user?.role === "patient" && (
              <Card className="mb-6 bg-primary/5 border-primary/20">
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t.patientInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0">
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                    <div>
                      <span className="font-medium">{language === "en" ? "Name:" : "Nom:"}</span> {user.name}
                    </div>
                    <div>
                      <span className="font-medium">{language === "en" ? "ID:" : "ID:"}</span> {user.id}
                    </div>
                    <div>
                      <span className="font-medium">{language === "en" ? "Previous Tests:" : "Tests Précédents:"}</span>{" "}
                      {user.testHistory?.length || 0}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                              {language === "en" ? "Key Vocal Biomarkers" : "Biomarqueurs Vocaux Clés"}
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
                              {language === "en" ? "Model Performance" : "Performance du Modèle"}
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
                              {language === "en" ? "Login to Save Results" : "Connectez-vous pour Sauvegarder"}
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

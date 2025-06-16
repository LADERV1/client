"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { FileAudio, BarChart3, Calendar, Clock, Download, FileText } from 'lucide-react'

interface PatientDashboardProps {
  language: "en" | "fr"
  user: any
  onAnalyze: () => void
}

export default function PatientDashboard({ language, user, onAnalyze }: PatientDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "history">("overview")

  const translations = {
    en: {
      title: "Patient Dashboard",
      welcome: "Welcome back",
      overview: "Overview",
      history: "Test History",
      noTests: "No tests recorded yet",
      startTest: "Start New Test",
      downloadResults: "Download Results",
      testDetails: "Test Details",
      testDate: "Test Date",
      testResult: "Test Result",
      positive: "Positive",
      negative: "Negative",
      viewDetails: "View Details",
      lastTest: "Last Test",
      totalTests: "Total Tests",
      accountCreated: "Account Created",
      personalInfo: "Personal Information",
      name: "Name",
      email: "Email",
      id: "Patient ID",
      recentTests: "Recent Tests",
      viewAll: "View All",
      noRecentTests: "No recent tests found",
      runNewTest: "Run a new voice analysis test",
      testHistory: "Your Test History",
      noTestHistory:
        "You haven't taken any tests yet. Start your first voice analysis to track your results over time.",
    },
    fr: {
      title: "Tableau de Bord Patient",
      welcome: "Bienvenue",
      overview: "Aperçu",
      history: "Historique des Tests",
      noTests: "Aucun test enregistré pour le moment",
      startTest: "Commencer un Nouveau Test",
      downloadResults: "Télécharger les Résultats",
      testDetails: "Détails du Test",
      testDate: "Date du Test",
      testResult: "Résultat du Test",
      positive: "Positif",
      negative: "Négatif",
      viewDetails: "Voir les Détails",
      lastTest: "Dernier Test",
      totalTests: "Total des Tests",
      accountCreated: "Compte Créé",
      personalInfo: "Informations Personnelles",
      name: "Nom",
      email: "Email",
      id: "ID Patient",
      recentTests: "Tests Récents",
      viewAll: "Voir Tout",
      noRecentTests: "Aucun test récent trouvé",
      runNewTest: "Effectuer un nouveau test d'analyse vocale",
      testHistory: "Votre Historique de Tests",
      noTestHistory:
        "Vous n'avez pas encore effectué de tests. Commencez votre première analyse vocale pour suivre vos résultats au fil du temps.",
    },
  }

  const t = translations[language]

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "en" ? "en-US" : "fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get recent tests (last 3)
  const recentTests = user.testHistory ? [...user.testHistory].reverse().slice(0, 3) : []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">
            {t.welcome}, {user.name}
          </p>
        </div>
        <Button onClick={onAnalyze}>
          <FileAudio className="mr-2 h-4 w-4" />
          {t.startTest}
        </Button>
      </div>

      <Tabs defaultValue="overview" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{t.overview}</TabsTrigger>
          <TabsTrigger value="history">{t.history}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t.lastTest}</CardDescription>
                <CardTitle className="text-2xl">
                  {user.testHistory && user.testHistory.length > 0
                    ? formatDate(user.testHistory[user.testHistory.length - 1].date)
                    : "-"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.testHistory && user.testHistory.length > 0 ? (
                  <Badge
                    className={
                      user.testHistory[user.testHistory.length - 1].result.prediction === "positive"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }
                  >
                    {user.testHistory[user.testHistory.length - 1].result.prediction === "positive"
                      ? t.positive
                      : t.negative}
                  </Badge>
                ) : (
                  <Badge variant="outline">{t.noTests}</Badge>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t.totalTests}</CardDescription>
                <CardTitle className="text-2xl">{user.testHistory ? user.testHistory.length : 0}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  {language === "en" ? "Tests completed" : "Tests complétés"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>{t.accountCreated}</CardDescription>
                <CardTitle className="text-2xl">{formatDate(new Date().toISOString())}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  {language === "en" ? "Account active" : "Compte actif"}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t.personalInfo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{t.name}</div>
                  <div className="font-medium">{user.name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{t.email}</div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">{t.id}</div>
                  <div className="font-medium">{user.id}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{t.recentTests}</h2>
              {user.testHistory && user.testHistory.length > 3 && (
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("history")}>
                  {t.viewAll}
                </Button>
              )}
            </div>

            {recentTests.length > 0 ? (
              <div className="space-y-4">
                {recentTests.map((test: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardDescription className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDate(test.date)}
                          </CardDescription>
                          <CardTitle className="text-lg">
                            {language === "en" ? "Voice Analysis Result" : "Résultat d'Analyse Vocale"}
                          </CardTitle>
                        </div>
                        <Badge className={test.result.prediction === "positive" ? "bg-red-500" : "bg-green-500"}>
                          {test.result.prediction === "positive" ? t.positive : t.negative}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">{test.result.message}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="mr-2 h-4 w-4" />
                        {t.viewDetails}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <FileAudio className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">{t.noRecentTests}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t.runNewTest}</p>
                  <Button onClick={onAnalyze}>{t.startTest}</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.testHistory}</CardTitle>
            </CardHeader>
            <CardContent>
              {user.testHistory && user.testHistory.length > 0 ? (
                <div className="space-y-6">
                  {[...user.testHistory].reverse().map((test: any, index: number) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <FileAudio className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">
                              {language === "en" ? "Voice Analysis Test" : "Test d'Analyse Vocale"}
                            </div>
                            <div className="text-sm text-muted-foreground">{formatDate(test.date)}</div>
                          </div>
                        </div>
                        <Badge className={test.result.prediction === "positive" ? "bg-red-500" : "bg-green-500"}>
                          {test.result.prediction === "positive" ? t.positive : t.negative}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <p className="mb-4">{test.result.message}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            {t.viewDetails}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            {t.downloadResults}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <FileAudio className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">{t.noTests}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t.noTestHistory}</p>
                  <Button onClick={onAnalyze}>{t.startTest}</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, Users, AlertCircle, ShieldCheck, FileAudio } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PatientRegistryProps {
  language: "en" | "fr"
}

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  dateAdded: string
  status: "positive" | "negative" | "pending"
  lastTest?: string
  notes?: string
}

export default function PatientRegistry({ language }: PatientRegistryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"all" | "positive" | "negative">("all")
  const [isAddingPatient, setIsAddingPatient] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    notes: "",
  })
  const [formError, setFormError] = useState<string | null>(null)

  declare global {
    interface Window {
      recordingInterval: NodeJS.Timeout | undefined
    }
  }

  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false)
  const [testingPatient, setTestingPatient] = useState<Patient | null>(null)
  const [recordingState, setRecordingState] = useState<"idle" | "recording" | "recorded" | "analyzing">("idle")
  const [recordingTime, setRecordingTime] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)

  // Mock patient data - in a real application, this would come from your API
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "p1",
      name: "Mohammed El Amrani",
      age: 65,
      gender: language === "en" ? "Male" : "Homme",
      dateAdded: "2024-10-15",
      status: "positive",
      lastTest: "2025-04-10",
      notes:
        language === "en"
          ? "Early signs detected in voice analysis. Referred to neurologist."
          : "Signes précoces détectés dans l'analyse vocale. Référé à un neurologue.",
    },
    {
      id: "p2",
      name: "Fatima Bensouda",
      age: 58,
      gender: language === "en" ? "Female" : "Femme",
      dateAdded: "2024-11-22",
      status: "negative",
      lastTest: "2025-03-28",
      notes:
        language === "en"
          ? "No significant indicators found. Scheduled for follow-up in 6 months."
          : "Aucun indicateur significatif trouvé. Suivi prévu dans 6 mois.",
    },
    {
      id: "p3",
      name: "Ahmed Tazi",
      age: 72,
      gender: language === "en" ? "Male" : "Homme",
      dateAdded: "2025-01-05",
      status: "positive",
      lastTest: "2025-04-15",
      notes:
        language === "en"
          ? "Moderate indicators in voice analysis. Currently under medication."
          : "Indicateurs modérés dans l'analyse vocale. Actuellement sous médication.",
    },
    {
      id: "p4",
      name: "Aisha Lahlou",
      age: 61,
      gender: language === "en" ? "Female" : "Femme",
      dateAdded: "2024-05-18",
      status: "pending",
      notes:
        language === "en"
          ? "Initial consultation completed. Awaiting voice analysis."
          : "Consultation initiale terminée. En attente d'analyse vocale.",
    },
    {
      id: "p5",
      name: "Youssef Alaoui",
      age: 68,
      gender: language === "en" ? "Male" : "Homme",
      dateAdded: "2025-03-07",
      status: "negative",
      lastTest: "2025-04-02",
      notes:
        language === "en"
          ? "No indicators found. Family history of Parkinson's, monitoring recommended."
          : "Aucun indicateur trouvé. Antécédents familiaux de Parkinson, surveillance recommandée.",
    },
  ])

  const translations = {
    en: {
      title: "Patient Registry",
      subtitle: "Manage and track patients for Parkinson's disease screening",
      search: "Search patients...",
      addPatient: "Add Patient",
      allPatients: "All Patients",
      positivePatients: "Positive Indicators",
      negativePatients: "No Indicators",
      tableHeaders: {
        name: "Name",
        age: "Age",
        gender: "Gender",
        status: "Status",
        lastTest: "Last Test",
        actions: "Actions",
      },
      status: {
        positive: "Positive",
        negative: "Negative",
        pending: "Pending",
      },
      viewDetails: "View Details",
      patientDetails: "Patient Details",
      patientInfo: "Patient Information",
      testHistory: "Test History",
      notes: "Clinical Notes",
      close: "Close",
      newPatient: "New Patient",
      addNewPatient: "Add New Patient",
      patientName: "Patient Name",
      patientAge: "Age",
      patientGender: "Gender",
      patientNotes: "Notes",
      cancel: "Cancel",
      save: "Save Patient",
      male: "Male",
      female: "Female",
      noTestsYet: "No tests recorded yet",
      noResults: "No patients found matching your search",
      formError: "Please fill in all required fields",
      patientAdded: "Patient added successfully!",
      adminOnly: "Administrator Access Only",
      adminOnlyMessage: "This section is only accessible to administrators.",
      testPatient: "Test Patient",
    },
    fr: {
      title: "Registre des Patients",
      subtitle: "Gérer et suivre les patients pour le dépistage de la maladie de Parkinson",
      search: "Rechercher des patients...",
      addPatient: "Ajouter un Patient",
      allPatients: "Tous les Patients",
      positivePatients: "Indicateurs Positifs",
      negativePatients: "Aucun Indicateur",
      tableHeaders: {
        name: "Nom",
        age: "Âge",
        gender: "Genre",
        status: "Statut",
        lastTest: "Dernier Test",
        actions: "Actions",
      },
      status: {
        positive: "Positif",
        negative: "Négatif",
        pending: "En attente",
      },
      viewDetails: "Voir Détails",
      patientDetails: "Détails du Patient",
      patientInfo: "Information du Patient",
      testHistory: "Historique des Tests",
      notes: "Notes Cliniques",
      close: "Fermer",
      newPatient: "Nouveau Patient",
      addNewPatient: "Ajouter un Nouveau Patient",
      patientName: "Nom du Patient",
      patientAge: "Âge",
      patientGender: "Genre",
      patientNotes: "Notes",
      cancel: "Annuler",
      save: "Enregistrer le Patient",
      male: "Homme",
      female: "Femme",
      noTestsYet: "Aucun test enregistré pour le moment",
      noResults: "Aucun patient trouvé correspondant à votre recherche",
      formError: "Veuillez remplir tous les champs obligatoires",
      patientAdded: "Patient ajouté avec succès!",
      adminOnly: "Administrator Access Only",
      adminOnlyMessage: "This section is only accessible to administrators.",
      testPatient: "Tester Patient",
    },
  }

  const t = translations[language]

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || patient.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient)
  }

  const handleTestPatient = (patient: Patient) => {
    setTestingPatient(patient)
    setIsTestDialogOpen(true)
    setRecordingState("idle")
    setRecordingTime(0)
    setAnalysisProgress(0)
  }

  const startRecording = () => {
    setRecordingState("recording")
    // Start timer
    const interval = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 30) {
          clearInterval(interval)
          setRecordingState("recorded")
          return prev
        }
        return prev + 1
      })
    }, 1000)

    // Store interval ID to clear it later
    window.recordingInterval = interval
  }

  const stopRecording = () => {
    // Check if we have a valid media recorder
    if (window.recordingInterval) {
      clearInterval(window.recordingInterval)
    }
    setRecordingState("recorded")
  }

  const cancelRecording = () => {
    if (window.recordingInterval) {
      clearInterval(window.recordingInterval)
    }
    setRecordingState("idle")
    setRecordingTime(0)
  }

  const analyzeVoice = async () => {
    if (!testingPatient) return

    setRecordingState("analyzing")

    // For demonstration, create a mock audio file.
    // In a real app, this would be the actual recorded audio blob.
    const mockAudioBlob = new Blob(["mock audio data"], { type: "audio/wav" })
    const mockAudioFile = new File([mockAudioBlob], "mock_recording.wav", { type: "audio/wav" })

    const formData = new FormData()
    formData.append("file", mockAudioFile) // Send the mock audio file

    try {
      // Simulate analysis progress
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += 5
        setAnalysisProgress(progress)
        if (progress >= 100) {
          clearInterval(progressInterval)
        }
      }, 100)

      const response = await fetch("/api/analyze-audio", {
        // Changed endpoint
        method: "POST",
        body: formData, // Send FormData
      })

      clearInterval(progressInterval)
      setAnalysisProgress(100) // Ensure it reaches 100%

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Prediction failed")
      }

      const result = await response.json()
      const newStatus = result.prediction // Directly use prediction string ("positive" or "negative")
      const today = new Date().toISOString().split("T")[0]

      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === testingPatient.id
            ? {
                ...p,
                status: newStatus,
                lastTest: today,
              }
            : p,
        ),
      )

      setTimeout(() => {
        setIsTestDialogOpen(false)
        alert(
          language === "en"
            ? `Voice analysis completed for ${testingPatient.name}. Result: ${newStatus === "positive" ? "Positive" : "Negative"}`
            : `Analyse vocale terminée pour ${testingPatient.name}. Résultat: ${newStatus === "positive" ? "Positif" : "Négatif"}`,
        )
      }, 500)
    } catch (error) {
      console.error("Analysis failed:", error)
      alert(
        language === "en"
          ? `An error occurred during analysis: ${error instanceof Error ? error.message : String(error)}`
          : `Une erreur s'est produite lors de l'analyse: ${error instanceof Error ? error.message : String(error)}`,
      )
      setIsTestDialogOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewPatient({
      ...newPatient,
      [name]: value,
    })
  }

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validate form
    if (!newPatient.name || !newPatient.age || !newPatient.gender) {
      setFormError(t.formError)
      return
    }

    // Create a new patient object
    const newPatientObj: Patient = {
      id: `p${Math.floor(Math.random() * 10000)}`,
      name: newPatient.name,
      age: Number.parseInt(newPatient.age),
      gender:
        newPatient.gender === "male" ? (language === "en" ? "Male" : "Homme") : language === "en" ? "Female" : "Femme",
      dateAdded: new Date().toISOString().split("T")[0],
      status: "pending",
      notes: newPatient.notes || "",
    }

    // Add the new patient to the patients state
    setPatients((prevPatients) => [...prevPatients, newPatientObj])

    // Reset form and close dialog
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      notes: "",
    })
    setIsAddingPatient(false)

    // Show success message
    alert(t.patientAdded)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "positive":
        return <Badge className="bg-red-500">{t.status.positive}</Badge>
      case "negative":
        return <Badge className="bg-green-500">{t.status.negative}</Badge>
      case "pending":
        return <Badge variant="outline">{t.status.pending}</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground">
            <span className="inline-flex items-center bg-primary/10 text-primary px-2 py-1 rounded-md mr-2">
              <ShieldCheck className="h-4 w-4 mr-1" />
              {language === "en" ? "Admin Access" : "Accès Admin"}
            </span>
            {t.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 md:min-w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.search}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddingPatient} onOpenChange={setIsAddingPatient}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t.addPatient}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t.addNewPatient}</DialogTitle>
                <DialogDescription>{t.newPatient}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddPatient}>
                {formError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">{t.patientName} *</Label>
                    <Input id="name" name="name" value={newPatient.name} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="age">{t.patientAge} *</Label>
                      <Input
                        id="age"
                        name="age"
                        type="number"
                        min="0"
                        max="120"
                        value={newPatient.age}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gender">{t.patientGender} *</Label>
                      <Select
                        name="gender"
                        value={newPatient.gender}
                        onValueChange={(value) => setNewPatient({ ...newPatient, gender: value })}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder={t.patientGender} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{t.male}</SelectItem>
                          <SelectItem value="female">{t.female}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">{t.patientNotes}</Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={newPatient.notes}
                      onChange={handleInputChange}
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddingPatient(false)}>
                    {t.cancel}
                  </Button>
                  <Button type="submit">{t.save}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Alert className="bg-primary/5 border-primary/20">
        <ShieldCheck className="h-4 w-4" />
        <AlertDescription>{t.adminOnlyMessage}</AlertDescription>
      </Alert>

      <Tabs defaultValue="all" onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{t.allPatients}</TabsTrigger>
          <TabsTrigger value="positive">{t.positivePatients}</TabsTrigger>
          <TabsTrigger value="negative">{t.negativePatients}</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          {filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.tableHeaders.name}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.tableHeaders.age}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.tableHeaders.gender}</TableHead>
                  <TableHead>{t.tableHeaders.status}</TableHead>
                  <TableHead className="hidden md:table-cell">{t.tableHeaders.lastTest}</TableHead>
                  <TableHead>{t.tableHeaders.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.age}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.gender}</TableCell>
                    <TableCell>{getStatusBadge(patient.status)}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.lastTest || "-"}</TableCell>
                    <TableCell>
                      {patient.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2 bg-primary/10 hover:bg-primary/20"
                          onClick={() => handleTestPatient(patient)}
                        >
                          <FileAudio className="mr-2 h-4 w-4" />
                          {t.testPatient}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => handleViewPatient(patient)}>
                        {t.viewDetails}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center p-4">
              <Users className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t.noResults}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {language === "en"
                  ? "Try adjusting your search or filters"
                  : "Essayez d'ajuster votre recherche ou vos filtres"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPatient && (
        <Dialog open={!!selectedPatient} onOpenChange={(open) => !open && setSelectedPatient(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t.patientDetails}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.patientInfo}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{language === "en" ? "Name:" : "Nom:"}</span> {selectedPatient.name}
                  </div>
                  <div>
                    <span className="font-medium">{language === "en" ? "Age:" : "Âge:"}</span> {selectedPatient.age}
                  </div>
                  <div>
                    <span className="font-medium">{language === "en" ? "Gender:" : "Genre:"}</span>{" "}
                    {selectedPatient.gender}
                  </div>
                  <div>
                    <span className="font-medium">{language === "en" ? "Status:" : "Statut:"}</span>{" "}
                    {getStatusBadge(selectedPatient.status)}
                  </div>
                  <div>
                    <span className="font-medium">{language === "en" ? "Added:" : "Ajouté:"}</span>{" "}
                    {selectedPatient.dateAdded}
                  </div>
                  <div>
                    <span className="font-medium">{language === "en" ? "Last Test:" : "Dernier Test:"}</span>{" "}
                    {selectedPatient.lastTest || "-"}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.testHistory}</h3>
                {selectedPatient.lastTest ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <span>{selectedPatient.lastTest}</span>
                      </div>
                      <Badge className={selectedPatient.status === "positive" ? "bg-red-500" : "bg-green-500"}>
                        {selectedPatient.status === "positive" ? t.status.positive : t.status.negative}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{t.noTestsYet}</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">{t.notes}</h3>
                <div className="p-3 bg-muted rounded-md text-sm">
                  {selectedPatient.notes || (language === "en" ? "No notes available" : "Aucune note disponible")}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setSelectedPatient(null)}>{t.close}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Voice Test Dialog */}
      <Dialog
        open={isTestDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            cancelRecording()
            setIsTestDialogOpen(false)
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileAudio className="h-5 w-5 text-primary" />
              {language === "en"
                ? `Voice Analysis for ${testingPatient?.name}`
                : `Analyse Vocale pour ${testingPatient?.name}`}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Upload a voice recording or record a new sample to analyze for Parkinson's indicators."
                : "Téléchargez un enregistrement vocal ou enregistrez un nouvel échantillon pour analyser les indicateurs de Parkinson."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {recordingState === "analyzing" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="relative h-24 w-24">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-semibold">{analysisProgress}%</span>
                    </div>
                    <svg className="h-24 w-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        className="text-muted-foreground/20"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                      />
                      <circle
                        className="text-primary"
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={`${analysisProgress * 2.83} 283`}
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">
                    {language === "en" ? "Analyzing voice patterns..." : "Analyse des modèles vocaux..."}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === "en"
                      ? "Our AI is processing the voice sample to detect Parkinson's indicators."
                      : "Notre IA traite l'échantillon vocal pour détecter les indicateurs de Parkinson."}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Upload option */}
                  <div className={`border rounded-lg p-4 ${recordingState !== "idle" ? "opacity-50" : ""}`}>
                    <div className="text-center space-y-2 mb-4">
                      <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                        <FileAudio className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium">
                        {language === "en" ? "Upload Recording" : "Télécharger un Enregistrement"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {language === "en" ? "MP3, WAV or M4A. Max 5MB." : "MP3, WAV ou M4A. Max 5MB."}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <Label
                        htmlFor="voice-file"
                        className={`cursor-pointer flex items-center justify-center px-4 py-2 rounded-md border border-dashed ${recordingState !== "idle" ? "pointer-events-none" : ""}`}
                      >
                        <span className="text-sm">{language === "en" ? "Select file" : "Sélectionner un fichier"}</span>
                        <Input
                          id="voice-file"
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          disabled={recordingState !== "idle"}
                          onChange={() => setRecordingState("recorded")}
                        />
                      </Label>
                    </div>
                  </div>

                  {/* Record option */}
                  <div
                    className={`border rounded-lg p-4 ${recordingState === "idle" || recordingState === "recording" || recordingState === "recorded" ? "" : "opacity-50"}`}
                  >
                    <div className="text-center space-y-2 mb-4">
                      <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" x2="12" y1="19" y2="22"></line>
                        </svg>
                      </div>
                      <h3 className="font-medium">
                        {language === "en" ? "Record New Sample" : "Enregistrer un Nouvel Échantillon"}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {language === "en"
                          ? "Speak clearly for 10-30 seconds"
                          : "Parlez clairement pendant 10-30 secondes"}
                      </p>
                    </div>

                    {recordingState === "idle" && (
                      <Button onClick={startRecording} className="w-full" variant="outline">
                        {language === "en" ? "Start Recording" : "Commencer l'Enregistrement"}
                      </Button>
                    )}

                    {recordingState === "recording" && (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <div className="relative w-full max-w-[200px] h-12">
                            {/* Voice visualization - animated bars */}
                            <div className="absolute inset-0 flex items-center justify-center gap-1">
                              {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-primary rounded-full animate-pulse"
                                  style={{
                                    height: `${Math.random() * 70 + 30}%`,
                                    animationDelay: `${i * 0.1}s`,
                                  }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-sm font-medium">
                          {Math.floor(recordingTime / 60)}:
                          {recordingTime % 60 < 10 ? `0${recordingTime % 60}` : recordingTime % 60}
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button onClick={cancelRecording} variant="outline" size="sm">
                            {language === "en" ? "Cancel" : "Annuler"}
                          </Button>
                          <Button onClick={stopRecording} variant="default" size="sm">
                            {language === "en" ? "Stop" : "Arrêter"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {recordingState === "recorded" && (
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <div className="relative w-full max-w-[200px] h-12 bg-muted rounded-md">
                            {/* Static waveform representation */}
                            <div className="absolute inset-0 flex items-center justify-center gap-1 px-2">
                              {Array.from({ length: 24 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-primary rounded-full"
                                  style={{ height: `${Math.sin(i * 0.5) * 40 + 50}%` }}
                                ></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-center text-sm font-medium">
                          {Math.floor(recordingTime / 60)}:
                          {recordingTime % 60 < 10 ? `0${recordingTime % 60}` : recordingTime % 60}
                        </div>
                        <div className="flex justify-center gap-2">
                          <Button onClick={cancelRecording} variant="outline" size="sm">
                            {language === "en" ? "Re-record" : "Réenregistrer"}
                          </Button>
                          <Button onClick={analyzeVoice} variant="default" size="sm">
                            {language === "en" ? "Use This Recording" : "Utiliser Cet Enregistrement"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 border">
                  <div className="flex gap-3">
                    <div className="bg-primary/10 rounded-full p-2 h-fit">
                      <AlertCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">
                        {language === "en" ? "Voice Analysis Guidelines" : "Directives d'Analyse Vocale"}
                      </h4>
                      <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                        <li>
                          {language === "en"
                            ? "Record in a quiet environment with minimal background noise"
                            : "Enregistrez dans un environnement calme avec un bruit de fond minimal"}
                        </li>
                        <li>
                          {language === "en"
                            ? "Speak clearly and at a normal pace"
                            : "Parlez clairement et à un rythme normal"}
                        </li>
                        <li>
                          {language === "en"
                            ? "Try to maintain a consistent distance from the microphone"
                            : "Essayez de maintenir une distance constante du microphone"}
                        </li>
                        <li>
                          {language === "en"
                            ? "For best results, read the provided text sample aloud"
                            : "Pour de meilleurs résultats, lisez l'échantillon de texte fourni à haute voix"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            {recordingState !== "analyzing" && (
              <>
                <Button variant="outline" onClick={() => setIsTestDialogOpen(false)}>
                  {language === "en" ? "Cancel" : "Annuler"}
                </Button>
                <Button onClick={analyzeVoice} disabled={recordingState !== "recorded"}>
                  {language === "en" ? "Analyze Voice" : "Analyser la Voix"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

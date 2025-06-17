"use client"

import type React from "react"

import { useState, useRef } from "react"
import { FileAudio, Upload, X, Info, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadFormProps {
  onSubmit: () => void
  onResult: (result: any) => void
  language: "en" | "fr"
}

const FEATURE_NAMES = [
  "MDVP:Fo(Hz)", "MDVP:Fhi(Hz)", "MDVP:Flo(Hz)", "MDVP:Jitter(%)", "MDVP:Jitter(Abs)",
  "MDVP:RAP", "MDVP:PPQ", "Jitter:DDP", "MDVP:Shimmer", "MDVP:Shimmer(dB)",
  "Shimmer:APQ3", "Shimmer:APQ5", "MDVP:APQ", "Shimmer:DDA", "NHR", "HNR",
  "RPDE", "DFA", "spread1", "spread2", "D2", "PPE"
]

// Do NOT clamp or normalize here, just map array to object.
function featuresArrayToObject(array: number[] | undefined): Record<string, number> {
  if (!Array.isArray(array)) return {};
  const obj: Record<string, number> = {};
  FEATURE_NAMES.forEach((key, idx) => {
    obj[key] = typeof array[idx] === "number" ? array[idx] : 0;
  });
  return obj;
}

export default function UploadForm({ onSubmit, onResult, language }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Use refs to persist these values between renders
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<BlobPart[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const translations = {
    en: {
      dropzone: {
        title: "Drag and drop your audio file here or click to browse",
        subtitle: "Supports WAV, MP3, M4A (max 10MB)",
        browse: "Browse Files",
      },
      analyze: "Analyze Voice Recording",
      uploadError: "Please upload an audio file",
      apiError: "An error occurred during analysis",
      tooltip:
        "For best results, use a clear voice recording of sustained vowel sounds (like 'aaah') for 5-10 seconds in a quiet environment",
      record: "Record Audio",
      stopRecording: "Stop Recording",
      recording: "Recording...",
      recordingTime: "Recording time:",
      seconds: "seconds",
      recordingPermissionError: "Microphone permission denied. Please allow access to record audio.",
      uploadingFile: "Uploading file...",
    },
    fr: {
      dropzone: {
        title: "Glissez et déposez votre fichier audio ici ou cliquez pour parcourir",
        subtitle: "Formats supportés : WAV, MP3, M4A (max 10MB)",
        browse: "Parcourir les Fichiers",
      },
      analyze: "Analyser l'Enregistrement Vocal",
      uploadError: "Veuillez télécharger un fichier audio",
      apiError: "Une erreur s'est produite lors de l'analyse",
      tooltip:
        "Pour de meilleurs résultats, utilisez un enregistrement vocal clair de sons de voyelles soutenus (comme 'aaah') pendant 5 à 10 secondes dans un environnement calme",
      record: "Enregistrer Audio",
      stopRecording: "Arrêter l'Enregistrement",
      recording: "Enregistrement...",
      recordingTime: "Durée d'enregistrement:",
      seconds: "secondes",
      recordingPermissionError:
        "Permission du microphone refusée. Veuillez autoriser l'accès pour enregistrer l'audio.",
      uploadingFile: "Téléchargement du fichier...",
    },
  }

  const t = translations[language]

  // Recording functionality
  const startRecording = async () => {
    try {
      setRecordingError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Reset audio chunks
      audioChunksRef.current = []

      // Create new media recorder
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        const audioFile = new File([audioBlob], "recording.wav", { type: "audio/wav" })
        setFile(audioFile)
        setIsRecording(false)
        setRecordingTime(0)

        // Clear interval
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current)
          recordingIntervalRef.current = null
        }
      }

      recorder.start()
      setIsRecording(true)

      // Start timer
      let seconds = 0
      recordingIntervalRef.current = setInterval(() => {
        seconds++
        setRecordingTime(seconds)
        // Auto-stop after 10 seconds
        if (seconds >= 10 && recorder && recorder.state === "recording") {
          stopRecording()
        }
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      setRecordingError(t.recordingPermissionError)
    }
  }

  const stopRecording = () => {
    // Check if we have a valid media recorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }

    // Clear interval
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current)
      recordingIntervalRef.current = null
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type.includes("audio")) {
        setFile(droppedFile)
      } else {
        alert(t.uploadError)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      alert(t.uploadError)
      return
    }

    onSubmit()
    setIsUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 7
        setUploadProgress(progress)
        if (progress >= 100) clearInterval(interval)
      }, 60)

      // Call your Next.js API route that proxies to Flask backend
      const response = await fetch("/api/analyze-audio", {
        method: "POST",
        body: formData,
      })

      clearInterval(interval)
      setIsUploading(false)

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        alert(errData.error || t.apiError)
        onResult(null)
        return
      }

      const result = await response.json()
      // Always ensure features is an object!
      result.features = featuresArrayToObject(result.features)
      onResult(result)
    } catch (error) {
      setIsUploading(false)
      alert(t.apiError)
      onResult(null)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4" />
                <span className="sr-only">Recording Tips</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{t.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {recordingError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{recordingError}</AlertDescription>
        </Alert>
      )}

      {isRecording ? (
        <div className="border-2 border-primary rounded-lg p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="size-16 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                <Mic className="h-8 w-8 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-red-500 animate-ping"></span>
            </div>
            <div>
              <p className="font-medium">{t.recording}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {t.recordingTime} {recordingTime} {t.seconds}
              </p>
            </div>
            <Button variant="destructive" onClick={stopRecording}>
              {t.stopRecording}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <div className="flex items-center space-x-2 overflow-hidden">
                <FileAudio className="h-5 w-5 flex-shrink-0 text-primary" />
                <span className="text-sm truncate">{file.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">{t.dropzone.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.dropzone.subtitle}</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-2">
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    {t.dropzone.browse}
                  </div>
                  <Input
                    id="file-upload"
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </Label>
                <Button variant="outline" onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  {t.record}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{t.uploadingFile}</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <Button className="w-full" onClick={handleSubmit} disabled={!file || isRecording || isUploading}>
        {t.analyze}
      </Button>
    </div>
  )
}
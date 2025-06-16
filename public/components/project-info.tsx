"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Brain, FileAudio, FlaskRoundIcon as Flask, LineChart, Microscope } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ProjectInfoProps {
  language: "en" | "fr"
  onClose: () => void
}

export default function ProjectInfo({ language, onClose }: ProjectInfoProps) {
  const translations = {
    en: {
      title: "Early Detection of Parkinson's Disease Using Voice Analysis",
      description: "A non-invasive, rapid, and economical method for early diagnosis",
      overview: {
        title: "Project Overview",
        content:
          "Parkinson's disease is a progressive neurological disorder affecting movement. Early diagnosis allows better management of the disease. This project develops an AI model capable of detecting early signs of Parkinson's through vocal features.",
      },
      objectives: {
        title: "Objectives",
        items: [
          "Analyze voice recordings from affected and non-affected patients",
          "Build a classification model (SVM, Random Forest, or Deep Learning)",
          "Identify relevant vocal biomarkers",
          "Evaluate model performance (precision, sensitivity, specificity)",
        ],
      },
      dataset: {
        title: "Dataset",
        content:
          "This project uses the UCI Machine Learning Repository Parkinson's dataset, containing 195 voice recordings with 23 extracted biomedical features.",
      },
      technology: {
        title: "Technologies",
        items: [
          "Python (Pandas, NumPy, Scikit-learn)",
          "Data visualization (Matplotlib, Seaborn)",
          "Machine Learning algorithms",
          "SHAP/LIME for model explainability",
          "Next.js for the interactive interface",
        ],
      },
      impact: {
        title: "Medical & Social Impact",
        content:
          "This project serves as an early diagnostic tool for physicians, reduces invasive examinations, and quickly alerts at-risk patients. It fully aligns with the growing use of AI in preventive healthcare.",
      },
      back: "Back to Application",
      tabs: {
        overview: "Overview",
        technical: "Technical Details",
        research: "Research",
      },
      research: {
        title: "Research Background",
        content:
          "Parkinson's disease (PD) affects approximately 1% of the population over 60 years old. Voice disorders are among the earliest symptoms, appearing in up to 90% of patients. Acoustic analysis of voice can detect subtle changes in speech production that may not be perceptible to the human ear.",
        papers: [
          {
            title: "Little et al. (2009)",
            description: "Suitability of dysphonia measurements for telemonitoring of Parkinson's disease",
          },
          {
            title: "Tsanas et al. (2012)",
            description:
              "Novel speech signal processing algorithms for high-accuracy classification of Parkinson's disease",
          },
          {
            title: "Sakar et al. (2019)",
            description:
              "Collection and analysis of a Parkinson speech dataset with multiple types of sound recordings",
          },
        ],
      },
      technical: {
        title: "Technical Implementation",
        features: "The model analyzes 23 voice features including:",
        featuresList: [
          "Frequency variations (jitter)",
          "Amplitude variations (shimmer)",
          "Noise-to-harmonics ratios",
          "Nonlinear dynamical complexity measures",
        ],
        architecture: "System Architecture",
        architectureDetails:
          "The application uses a three-tier architecture with a React frontend, Next.js server components for processing, and a Python backend for the machine learning model. Voice recordings are processed to extract acoustic features which are then fed into the trained model for prediction.",
      },
    },
    fr: {
      title: "Détection Précoce de la Maladie de Parkinson à l'Aide de l'Analyse Vocale",
      description: "Une méthode non invasive, rapide et économique pour un diagnostic précoce",
      overview: {
        title: "Aperçu du Projet",
        content:
          "La maladie de Parkinson est un trouble neurologique progressif qui affecte le mouvement. Un diagnostic précoce permet une meilleure gestion de la maladie. Ce projet développe un modèle d'IA capable de détecter les premiers signes de Parkinson à partir de caractéristiques vocales.",
      },
      objectives: {
        title: "Objectifs",
        items: [
          "Analyser des enregistrements vocaux de patients atteints et non atteints",
          "Construire un modèle de classification (SVM, Random Forest, ou Deep Learning)",
          "Identifier les biomarqueurs vocaux les plus pertinents",
          "Évaluer la performance du modèle (précision, sensibilité, spécificité)",
        ],
      },
      dataset: {
        title: "Jeu de Données",
        content:
          "Ce projet utilise le jeu de données Parkinson de l'UCI Machine Learning Repository, contenant 195 enregistrements vocaux avec 23 caractéristiques biomédicales extraites.",
      },
      technology: {
        title: "Technologies",
        items: [
          "Python (Pandas, NumPy, Scikit-learn)",
          "Visualisation de données (Matplotlib, Seaborn)",
          "Algorithmes d'apprentissage automatique",
          "SHAP/LIME pour l'explicabilité du modèle",
          "Next.js pour l'interface interactive",
        ],
      },
      impact: {
        title: "Impact Médical et Social",
        content:
          "Ce projet peut servir d'outil de diagnostic précoce pour les médecins, réduire les examens invasifs, et alerter rapidement les patients à risque. Il s'inscrit pleinement dans l'usage croissant de l'IA au service de la santé préventive.",
      },
      back: "Retour à l'Application",
      tabs: {
        overview: "Aperçu",
        technical: "Détails Techniques",
        research: "Recherche",
      },
      research: {
        title: "Contexte de Recherche",
        content:
          "La maladie de Parkinson (MP) affecte environ 1% de la population de plus de 60 ans. Les troubles de la voix font partie des premiers symptômes, apparaissant chez jusqu'à 90% des patients. L'analyse acoustique de la voix peut détecter des changements subtils dans la production de la parole qui peuvent ne pas être perceptibles à l'oreille humaine.",
        papers: [
          {
            title: "Little et al. (2009)",
            description: "Pertinence des mesures de dysphonie pour le télésuivi de la maladie de Parkinson",
          },
          {
            title: "Tsanas et al. (2012)",
            description:
              "Nouveaux algorithmes de traitement du signal vocal pour une classification de haute précision de la maladie de Parkinson",
          },
          {
            title: "Sakar et al. (2019)",
            description:
              "Collecte et analyse d'un ensemble de données vocales de Parkinson avec plusieurs types d'enregistrements sonores",
          },
        ],
      },
      technical: {
        title: "Implémentation Technique",
        features: "Le modèle analyse 23 caractéristiques vocales, notamment :",
        featuresList: [
          "Variations de fréquence (jitter)",
          "Variations d'amplitude (shimmer)",
          "Rapports bruit-harmoniques",
          "Mesures de complexité dynamique non linéaire",
        ],
        architecture: "Architecture du Système",
        architectureDetails:
          "L'application utilise une architecture à trois niveaux avec une interface React, des composants serveur Next.js pour le traitement, et un backend Python pour le modèle d'apprentissage automatique. Les enregistrements vocaux sont traités pour extraire des caractéristiques acoustiques qui sont ensuite introduites dans le modèle entraîné pour la prédiction.",
      },
    },
  }

  const t = translations[language]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">{t.tabs.overview}</TabsTrigger>
          <TabsTrigger value="technical">{t.tabs.technical}</TabsTrigger>
          <TabsTrigger value="research">{t.tabs.research}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl">{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-8">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  {t.overview.title}
                </h3>
                <p className="text-muted-foreground">{t.overview.content}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  {t.objectives.title}
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {t.objectives.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileAudio className="h-5 w-5 text-primary" />
                    {t.dataset.title}
                  </h3>
                  <p className="text-muted-foreground">{t.dataset.content}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Flask className="h-5 w-5 text-primary" />
                    {t.technology.title}
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    {t.technology.items.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Microscope className="h-5 w-5 text-primary" />
                  {t.impact.title}
                </h3>
                <p className="text-muted-foreground">{t.impact.content}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={onClose} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.back}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <Card>
            <CardHeader>
              <CardTitle>{t.technical.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="font-medium">{t.technical.features}</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {t.technical.featuresList.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t.technical.architecture}</h3>
                <p className="text-muted-foreground">{t.technical.architectureDetails}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {`
# Pseudocode for voice feature extraction
function extract_features(audio_file):
    # Load audio file
    signal, sample_rate = load_audio(audio_file)
    
    # Extract frequency features
    jitter = calculate_jitter(signal)
    shimmer = calculate_shimmer(signal)
    
    # Extract noise features
    nhr = noise_to_harmonics_ratio(signal)
    hnr = harmonics_to_noise_ratio(signal)
    
    # Extract nonlinear features
    rpde = recurrence_period_density_entropy(signal)
    dfa = detrended_fluctuation_analysis(signal)
    
    return [jitter, shimmer, nhr, hnr, rpde, dfa, ...]
                  `}
                </pre>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={onClose} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.back}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="research">
          <Card>
            <CardHeader>
              <CardTitle>{t.research.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">{t.research.content}</p>

              <div className="space-y-4">
                {t.research.papers.map((paper, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <h4 className="font-medium">{paper.title}</h4>
                    <p className="text-sm text-muted-foreground">{paper.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 p-4 rounded-lg">
                <p className="text-sm italic">
                  {language === "en"
                    ? "Research has shown that voice analysis can detect Parkinson's disease with up to 95% accuracy in early stages, potentially years before motor symptoms become apparent."
                    : "La recherche a montré que l'analyse vocale peut détecter la maladie de Parkinson avec une précision allant jusqu'à 95% aux premiers stades, potentiellement des années avant que les symptômes moteurs ne deviennent apparents."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={onClose} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.back}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, AlertCircle, User, ShieldCheck } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PatientLoginProps {
  language: "en" | "fr"
  onLogin?: (userData: any) => void
}

export default function PatientLogin({ language, onLogin }: PatientLoginProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "admin">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if we should show admin login tab
    const showAdminLogin = localStorage.getItem("showAdminLogin")
    if (showAdminLogin === "true") {
      setActiveTab("admin")
      localStorage.removeItem("showAdminLogin")
    }
  }, [])

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [adminData, setAdminData] = useState({
    email: "",
    password: "",
  })

  const translations = {
    en: {
      login: {
        title: "Patient Login",
        subtitle: "Access your account to view your test results and history",
        email: "Email",
        password: "Password",
        forgotPassword: "Forgot password?",
        rememberMe: "Remember me",
        loginButton: "Log In",
        noAccount: "Don't have an account?",
        register: "Register",
        errorMessage: "Invalid email or password. Please try again.",
        adminLogin: "Administrator? Login here",
      },
      register: {
        title: "Create Patient Account",
        subtitle: "Register to track your test results and history",
        name: "Full Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        agreeTerms: "I agree to the terms and privacy policy",
        registerButton: "Create Account",
        haveAccount: "Already have an account?",
        login: "Log In",
        errorMessage: "Please fill in all fields correctly.",
        passwordMismatch: "Passwords do not match.",
        registrationSuccess: "Registration successful! You can now log in.",
      },
      admin: {
        title: "Administrator Login",
        subtitle: "Access the patient registry and management tools",
        email: "Email",
        password: "Password",
        loginButton: "Admin Login",
        backToPatient: "Back to Patient Login",
        errorMessage: "Invalid administrator credentials. Please try again.",
      },
      loading: "Processing...",
    },
    fr: {
      login: {
        title: "Connexion Patient",
        subtitle: "Accédez à votre compte pour consulter vos résultats et votre historique de tests",
        email: "Email",
        password: "Mot de passe",
        forgotPassword: "Mot de passe oublié?",
        rememberMe: "Se souvenir de moi",
        loginButton: "Se connecter",
        noAccount: "Vous n'avez pas de compte?",
        register: "S'inscrire",
        errorMessage: "Email ou mot de passe invalide. Veuillez réessayer.",
        adminLogin: "Administrateur? Connectez-vous ici",
      },
      register: {
        title: "Créer un Compte Patient",
        subtitle: "Inscrivez-vous pour suivre vos résultats et votre historique de tests",
        name: "Nom Complet",
        email: "Email",
        password: "Mot de passe",
        confirmPassword: "Confirmer le Mot de passe",
        agreeTerms: "J'accepte les conditions et la politique de confidentialité",
        registerButton: "Créer un Compte",
        haveAccount: "Vous avez déjà un compte?",
        login: "Se connecter",
        errorMessage: "Veuillez remplir correctement tous les champs.",
        passwordMismatch: "Les mots de passe ne correspondent pas.",
        registrationSuccess: "Inscription réussie! Vous pouvez maintenant vous connecter.",
      },
      admin: {
        title: "Connexion Administrateur",
        subtitle: "Accédez au registre des patients et aux outils de gestion",
        email: "Email",
        password: "Mot de passe",
        loginButton: "Connexion Admin",
        backToPatient: "Retour à la Connexion Patient",
        errorMessage: "Identifiants administrateur invalides. Veuillez réessayer.",
      },
      loading: "Traitement en cours...",
    },
  }

  const t = translations[language]

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setLoginData({
      ...loginData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setRegisterData({
      ...registerData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAdminData({
      ...adminData,
      [name]: value,
    })
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate form
    if (!loginData.email || !loginData.password) {
      setError(t.login.errorMessage)
      setLoading(false)
      return
    }

    // Mock login - in a real app, this would be an API call
    setTimeout(() => {
      // Demo credentials for testing
      if (loginData.email === "patient@example.com" && loginData.password === "password") {
        // Mock user data
        const userData = {
          id: "p1",
          name: "Amine Zakaria hhh",
          email: loginData.email,
          role: "patient",
          testHistory: [],
        }

        if (onLogin) {
          onLogin(userData)
        }
      } else {
        setError(t.login.errorMessage)
      }
      setLoading(false)
    }, 1500)
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate form
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError(t.register.errorMessage)
      setLoading(false)
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError(t.register.passwordMismatch)
      setLoading(false)
      return
    }

    // Mock registration - in a real app, this would be an API call
    setTimeout(() => {
      // Mock user data
      const userData = {
        id: `p${Math.floor(Math.random() * 1000)}`, // Generate random ID
        name: registerData.name,
        email: registerData.email,
        role: "patient",
        testHistory: [],
      }

      // In a real app, you would save this to a database
      // For this demo, we'll just simulate success and switch to login
      alert(t.register.registrationSuccess)
      setActiveTab("login")
      setLoginData({
        ...loginData,
        email: registerData.email,
      })

      setLoading(false)
    }, 1500)
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validate form
    if (!adminData.email || !adminData.password) {
      setError(t.admin.errorMessage)
      setLoading(false)
      return
    }

    // Mock admin login - in a real app, this would be an API call
    setTimeout(() => {
      // Demo admin credentials
      if (adminData.email === "admin@example.com" && adminData.password === "admin") {
        // Mock admin data
        const adminUserData = {
          id: "admin1",
          name: "Amine Jamal",
          email: adminData.email,
          role: "admin",
        }

        if (onLogin) {
          onLogin(adminUserData)
        }
      } else {
        setError(t.admin.errorMessage)
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="container max-w-md py-10">
      <Tabs defaultValue="login" onValueChange={(value) => setActiveTab(value as "login" | "register" | "admin")}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="login">{language === "en" ? "Patient Login" : "Connexion Patient"}</TabsTrigger>
          <TabsTrigger value="register">{language === "en" ? "Register" : "S'inscrire"}</TabsTrigger>
          <TabsTrigger value="admin">{language === "en" ? "Admin Login" : "Admin"}</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">{t.login.title}</CardTitle>
              <CardDescription>{t.login.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.login.email}</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      className="pl-10"
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t.login.password}</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      {t.login.forgotPassword}
                    </a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={handleLoginChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showPassword
                          ? language === "en"
                            ? "Hide password"
                            : "Masquer le mot de passe"
                          : language === "en"
                            ? "Show password"
                            : "Afficher le mot de passe"}
                      </span>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={loginData.rememberMe}
                    onChange={handleLoginChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="rememberMe" className="text-sm font-normal">
                    {t.login.rememberMe}
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.loading : t.login.loginButton}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Button variant="link" className="text-sm text-muted-foreground" onClick={() => setActiveTab("admin")}>
                  <ShieldCheck className="h-4 w-4 mr-1" />
                  {t.login.adminLogin}
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                {t.login.noAccount}{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                  {t.login.register}
                </Button>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">{t.register.title}</CardTitle>
              <CardDescription>{t.register.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.register.name}</Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      className="pl-10"
                      required
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">{t.register.email}</Label>
                  <div className="relative">
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      className="pl-10"
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">{t.register.password}</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">{t.register.confirmPassword}</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      className="pl-10"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    name="agreeTerms"
                    checked={registerData.agreeTerms}
                    onChange={handleRegisterChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    required
                  />
                  <Label htmlFor="agreeTerms" className="text-sm font-normal">
                    {t.register.agreeTerms}
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.loading : t.register.registerButton}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                {t.register.haveAccount}{" "}
                <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
                  {t.register.login}
                </Button>
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-2xl">{t.admin.title}</CardTitle>
              <CardDescription>{t.admin.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">{t.admin.email}</Label>
                  <div className="relative">
                    <Input
                      id="admin-email"
                      name="email"
                      type="email"
                      value={adminData.email}
                      onChange={handleAdminChange}
                      className="pl-10"
                      required
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-password">{t.admin.password}</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={adminData.password}
                      onChange={handleAdminChange}
                      className="pl-10 pr-10"
                      required
                    />
                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-10 w-10"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t.loading : t.admin.loginButton}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-6">
              <Button variant="link" onClick={() => setActiveTab("login")}>
                <User className="mr-2 h-4 w-4" />
                {t.admin.backToPatient}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Demo credentials hint */}
      {activeTab === "login" && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium mb-1">
            {language === "en" ? "Demo Patient Credentials:" : "Identifiants Patient de Démonstration:"}
          </p>
          <p>
            <strong>Email:</strong> patient@example.com
          </p>
          <p>
            <strong>{language === "en" ? "Password" : "Mot de passe"}:</strong> password
          </p>
        </div>
      )}

      {activeTab === "admin" && (
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium mb-1">
            {language === "en" ? "Demo Admin Credentials:" : "Identifiants Admin de Démonstration:"}
          </p>
          <p>
            <strong>Email:</strong> admin@example.com
          </p>
          <p>
            <strong>{language === "en" ? "Password" : "Mot de passe"}:</strong> admin
          </p>
        </div>
      )}
    </div>
  )
}

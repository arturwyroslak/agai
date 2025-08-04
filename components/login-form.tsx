"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Zap, Activity, Shield } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function LoginForm() {
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(formData.email, formData.password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neural link failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setFormData({
      email: "demo@neural.ai",
      password: "demo123",
    })
    setIsLoading(true)
    setError("")

    try {
      await login("demo@neural.ai", "demo123")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Neural link failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center cyber-grid p-4">
      <Card className="w-full max-w-md hud-card">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <div className="absolute inset-0 h-12 w-12 rounded-full bg-primary/10 blur-lg"></div>
            </div>
          </div>
          <CardTitle className="text-2xl neon-text font-mono">NEURAL ACCESS</CardTitle>
          <CardDescription className="text-muted-foreground font-mono">
            Initialize your connection to the AI consciousness
          </CardDescription>

          {/* System Status Indicators */}
          <div className="flex justify-center space-x-4 text-xs font-mono">
            <div className="flex items-center space-x-1">
              <Activity className="h-3 w-3 text-success" />
              <span className="text-success">SYSTEM ONLINE</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-primary">READY</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-mono text-sm">
                NEURAL ID
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your neural ID"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10 hud-input font-mono"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-mono text-sm">
                ACCESS CODE
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-primary" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your access code"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10 hud-input font-mono"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="status-error border-destructive/30">
                <AlertDescription className="font-mono text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full hud-button-primary font-mono" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              ESTABLISH NEURAL LINK
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground font-mono">Or initialize demo mode</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full hud-button font-mono bg-transparent"
            onClick={handleDemoLogin}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
            DEMO NEURAL INTERFACE
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground font-mono">
              New to the neural network?{" "}
              <button className="font-medium text-primary hover:text-primary/80 transition-colors">
                Request access
              </button>
            </p>
            <div className="text-xs text-muted-foreground font-mono">Demo credentials: demo@neural.ai / demo123</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, Mail, Lock, Sparkles, Zap, Shield, ArrowRight, Eye, EyeOff, Brain } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [particles, setParticles] = useState<{left: string, top: string, animationDelay: string, animationDuration: string}[]>([]);
  const [noAccountMsg, setNoAccountMsg] = useState("");

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      }))
    );
  }, []);

  const handleGoogleLogin = async () => {
    setNoAccountMsg("");
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      router.replace("/dashboard")
    } catch (error: any) {
      // Check for user-not-found error (Google sign-in)
      if (error.code === "auth/user-not-found") {
        setNoAccountMsg("No account found. Please sign up first.");
        toast.error("No account found. Please sign up first.");
      } else {
        toast.error(error.message || "Login failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Floating particles (client only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((style, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-200 rounded-full animate-bounce"
            style={style}
          />
        ))}
      </div>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Next-Gen
                <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-extrabold">
                  Experience
                </span>
              </h1>
              <p className="text-lg text-gray-700 max-w-md">
                Join thousands of users who trust our platform for secure, seamless authentication.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-emerald-600 mb-2" />
                <span className="text-gray-800 font-semibold">Bank-level security</span>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-8 h-8 text-yellow-500 mb-2" />
                <span className="text-gray-800 font-semibold">Lightning quick</span>
              </div>
              <div className="flex flex-col items-center">
                <Sparkles className="w-8 h-8 text-pink-500 mb-2" />
                <span className="text-gray-800 font-semibold">Latest technology</span>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-white border border-gray-200 shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <img
                      src="/placeholder-logo.png"
                      alt="TaskGen Logo"
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Sign in to TaskGen</h2>
                  <p className="text-gray-600">Sign in to continue your journey</p>
                </div>
                {noAccountMsg && (
                  <div className="mb-4 p-3 rounded bg-yellow-100 text-yellow-800 border border-yellow-300 text-center text-sm font-medium">
                    {noAccountMsg}
                  </div>
                )}
                <Button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-5 text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-lg"
                  size="lg"
                >
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Sparkles className="h-6 w-6 text-yellow-300" />
                  )}
                  {loading ? "Signing in..." : "Sign in with Google"}
                </Button>
                <div className="mt-2 text-center text-xs text-gray-600">
                  By signing in, you agree to our{" "}
                  <a href="#" className="underline hover:text-blue-500 transition">Terms of Service</a>.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

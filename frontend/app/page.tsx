"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckSquare, Target, User, LogOut, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth"
import FirebaseLogin from "@/components/firebase-login"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export default function HomePage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">TaskGen</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary">Sign Up</Button>
              </Link>
            </>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User Avatar"} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>My Account</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col items-center mt-8 space-y-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User Avatar"} />
                    <AvatarFallback>
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <div className="font-semibold text-xl">{user.displayName || "User"}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">AI-Powered Task Generation</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform any topic into actionable tasks with Google Gemini AI. Organize, track, and complete your goals
            efficiently.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>AI-Generated Tasks</CardTitle>
              <CardDescription>
                Get 5 personalized, actionable tasks for any topic using Google Gemini AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CheckSquare className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Organize tasks by categories, track completion status, and visualize progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Goal Achievement</CardTitle>
              <CardDescription>Stay motivated with progress tracking and completion analytics</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Enter a Topic</h4>
              <p className="text-gray-600">Type any subject you want to learn or work on</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">AI Generates Tasks</h4>
              <p className="text-gray-600">Get 5 tailored, actionable tasks instantly</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Track & Complete</h4>
              <p className="text-gray-600">Organize, edit, and track your progress</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full bg-white/80 mt-12 backdrop-blur border-t">
        <Separator className="mb-4" />
        <div className="container mx-auto flex flex-col items-center justify-center py-8 gap-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg text-gray-800">TaskGen</span>
          </div>
          <div className="flex gap-4 mb-2">
            <Button asChild variant="ghost" size="icon" className="hover:bg-blue-100">
              <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-gray-700 hover:text-blue-600 transition" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="hover:bg-blue-100">
              <a  rel="noopener noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-700 hover:text-blue-600 transition" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="hover:bg-blue-100">
              <a href="https://linkedin.com/in/your-profile" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-700 hover:text-blue-600 transition" />
              </a>
            </Button>
          </div>
          <span className="text-gray-500 text-xs">© {new Date().getFullYear()} TaskGen. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}

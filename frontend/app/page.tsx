"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, CheckSquare, Target, User, LogOut, Github, Twitter, Linkedin, Menu } from "lucide-react"
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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/placeholder-logo.png" 
              alt="TaskGen Logo" 
              className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain" 
            />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">TaskGen</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            <Link href="/dashboard">
              <Button className="px-4 py-2 lg:px-6 lg:py-2 text-sm lg:text-base">
                Dashboard
              </Button>
            </Link>
            {!user ? (
              <Link href="/login">
                <Button variant="outline" className="px-4 py-2 lg:px-6 lg:py-2 text-sm lg:text-base">
                  Login
                </Button>
              </Link>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <Avatar className="cursor-pointer w-9 h-9 lg:w-11 lg:h-11">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User Avatar"} />
                    <AvatarFallback>
                      <User className="w-4 h-4 lg:w-5 lg:h-5" />
                    </AvatarFallback>
                  </Avatar>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 sm:w-96">
                  <SheetHeader>
                    <SheetTitle>My Account</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col items-center mt-8 space-y-4">
                    <Avatar className="w-20 h-20 lg:w-24 lg:h-24">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User Avatar"} />
                      <AvatarFallback>
                        <User className="w-10 h-10 lg:w-12 lg:h-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <div className="font-semibold text-lg lg:text-xl">{user.displayName || "User"}</div>
                      <div className="text-sm text-gray-500 break-all">{user.email}</div>
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

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <Link href="/dashboard">
                    <Button className="w-full justify-start">Dashboard</Button>
                  </Link>
                  {!user ? (
                    <Link href="/login">
                      <Button variant="outline" className="w-full justify-start">Login</Button>
                    </Link>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User Avatar"} />
                          <AvatarFallback>
                            <User className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">{user.displayName || "User"}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="destructive"
                        className="w-full justify-start"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              AI-Powered Task Generation
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 leading-relaxed">
              Transform any topic into actionable tasks with Google Gemini AI. Organize, track, and complete your goals
              efficiently.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="text-sm sm:text-base lg:text-lg px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto max-w-xs sm:max-w-none">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 lg:mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex justify-center mb-4">
                  <img 
                    src="/placeholder-logo.png" 
                    alt="AI-Generated Tasks" 
                    className="h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 object-contain" 
                  />
                </div>
                <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">AI-Generated Tasks</CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                  Get 5 personalized, actionable tasks for any topic using Google Gemini AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="p-4 sm:p-6">
                <CheckSquare className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">Smart Organization</CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                  Organize tasks by categories, track completion status, and visualize progress
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300 md:col-span-1">
              <CardHeader className="p-4 sm:p-6">
                <Target className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">Goal Achievement</CardTitle>
                <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                  Stay motivated with progress tracking and completion analytics
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8">How It Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">1</span>
                </div>
                <h4 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">Enter a Topic</h4>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                  Type any subject you want to learn or work on
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">2</span>
                </div>
                <h4 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">AI Generates Tasks</h4>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                  Get 5 tailored, actionable tasks instantly
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">3</span>
                </div>
                <h4 className="text-base sm:text-lg lg:text-xl font-semibold mb-2">Track & Complete</h4>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-relaxed">
                  Organize, edit, and track your progress
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 mt-8 sm:mt-12 backdrop-blur border-t">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src="/placeholder-logo.png" 
                alt="TaskGen Logo" 
                className="h-6 w-6 sm:h-8 sm:w-8 object-contain" 
              />
              <span className="font-bold text-sm sm:text-base lg:text-lg text-gray-800">TaskGen</span>
            </div>
            
            <div className="flex gap-3 sm:gap-4">
              <Button asChild variant="ghost" size="icon" className="hover:bg-blue-100 h-8 w-8 sm:h-10 sm:w-10">
                <a href="https://github.com/hariaravind03" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-blue-600 transition" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-blue-100 h-8 w-8 sm:h-10 sm:w-10">
                <a rel="noopener noreferrer" aria-label="Twitter">
                  <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-blue-600 transition" />
                </a>
              </Button>
              <Button asChild variant="ghost" size="icon" className="hover:bg-blue-100 h-8 w-8 sm:h-10 sm:w-10">
                <a href="https://www.linkedin.com/in/hari-aravind-a-0a703925a/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700 hover:text-blue-600 transition" />
                </a>
              </Button>
            </div>
            
            <span className="text-gray-500 text-xs sm:text-sm text-center">
              © {new Date().getFullYear()} TaskGen. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TaskGenerator } from "@/components/task-generator"
import { TaskList } from "@/components/task-list"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { TaskProvider } from "@/contexts/task-context"
import { Brain, User, LogOut, Home, ArrowLeft, Menu } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { auth } from "@/lib/firebase"
import type { User as FirebaseUser } from "firebase/auth"

export default function DashboardPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login")
    }
  }, [loading, user, router])

  const handleLogout = async () => {
    try {
      await auth.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-3 sm:px-4 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Left section - Back button */}
              <div className="flex items-center space-x-2 min-w-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-shrink-0 h-9 w-9 p-0 sm:w-auto sm:px-3" 
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:inline">Back</span>
                </Button>
              </div>

              {/* Center section - Logo and title */}
              <div className="flex items-center space-x-2 flex-1 justify-center min-w-0">
                <div className="flex-shrink-0">
                  <img 
                    src="/placeholder-logo.png" 
                    alt="TaskGen Logo" 
                    className="h-8 w-8 sm:h-10 sm:w-10" 
                  />
                </div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 truncate">
                  <span className="hidden xs:inline">TaskGen </span>Dashboard
                </h1>
              </div>

              {/* Right section - User avatar */}
              <div className="flex items-center min-w-0">
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="p-1 h-auto rounded-full">
                      <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                        <AvatarImage 
                          src={user?.photoURL || ""} 
                          alt={user?.displayName || "User Avatar"} 
                        />
                        <AvatarFallback className="text-xs">
                          {user?.displayName?.charAt(0) || <User className="h-4 w-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[280px] sm:w-[320px]">
                    <SheetHeader>
                      <SheetTitle>My Account</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      {user && (
                        <div className="text-center space-y-3">
                          <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto">
                            <AvatarImage 
                              src={user.photoURL || ""} 
                              alt={user.displayName || "User avatar"} 
                            />
                            <AvatarFallback className="text-lg">
                              {user.displayName?.charAt(0) || <User className="h-8 w-8" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h2 className="text-lg font-semibold truncate px-2">
                              {user.displayName || "User"}
                            </h2>
                            <p className="text-sm text-gray-500 truncate px-2">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="space-y-2">
                        <Button 
                          asChild 
                          variant="ghost" 
                          className="w-full justify-start h-11"
                        >
                          <Link href="/" onClick={() => setIsSheetOpen(false)}>
                            <Home className="mr-3 h-4 w-4" />
                            Main Page
                          </Link>
                        </Button>
                        <Button 
                          onClick={handleLogout} 
                          variant="ghost" 
                          className="w-full justify-start h-11 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* Mobile-first grid layout */}
          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main content area */}
            <div className="space-y-6 lg:col-span-8 xl:col-span-9">
              <div className="w-full">
                <TaskGenerator />
              </div>
              <div className="w-full">
                <TaskList />
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="sticky top-20">
                <ProgressDashboard />
              </div>
            </div>
          </div>
        </main>
      </div>
    </TaskProvider>
  )
}
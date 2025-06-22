"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TaskGenerator } from "@/components/task-generator"
import { TaskList } from "@/components/task-list"
import { ProgressDashboard } from "@/components/progress-dashboard"
import { TaskProvider } from "@/contexts/task-context"
import { Brain, User, LogOut, Home, ArrowLeft } from "lucide-react"
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
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-3 relative flex items-center justify-center min-h-[64px]">
            {/* Back button - left on mobile */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 sm:static sm:translate-y-0 flex items-center">
              <Button variant="outline" className="w-10 h-10 p-0 sm:w-auto sm:h-auto sm:mr-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-0 sm:mr-1" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
            {/* App name/logo - centered */}
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="flex items-center space-x-2">
                <Brain className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 text-center">TaskGen Dashboard</h1>
              </div>
            </div>
            {/* Avatar - right on mobile */}
            <div className="absolute right-2 top-2 sm:static sm:ml-4 flex items-center">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Avatar className="cursor-pointer w-9 h-9 sm:w-12 sm:h-12">
                    <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User Avatar"} />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0) || <User />}
                    </AvatarFallback>
                  </Avatar>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>My Account</SheetTitle>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    {user && (
                      <div className="text-center space-y-2">
                        <Avatar className="h-14 w-14 sm:h-20 sm:w-20 mx-auto">
                          <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User avatar"} />
                          <AvatarFallback>{user.displayName?.charAt(0) || <User />}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-base sm:text-lg font-semibold">{user.displayName}</h2>
                        <p className="text-xs sm:text-sm text-gray-500">{user.email}</p>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Button asChild variant="ghost" className="w-full justify-start">
                        <Link href="/" onClick={() => setIsSheetOpen(false)}>
                          <Home className="mr-2 h-4 w-4" />
                          Main Page
                        </Link>
                      </Button>
                      <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-8 lg:col-span-2">
              <TaskGenerator />
              <TaskList />
            </div>
            <div>
              <ProgressDashboard />
            </div>
          </div>
        </main>
      </div>
    </TaskProvider>
  )
}

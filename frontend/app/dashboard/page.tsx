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
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="mr-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">TaskGen Dashboard</h1>
              </Link>
            </div>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Avatar className="cursor-pointer">
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
                      <Avatar className="h-20 w-20 mx-auto">
                        <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User avatar"} />
                        <AvatarFallback>{user.displayName?.charAt(0) || <User />}</AvatarFallback>
                      </Avatar>
                      <h2 className="text-lg font-semibold">{user.displayName}</h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
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
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
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

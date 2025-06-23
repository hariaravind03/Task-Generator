import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { TaskProvider } from "@/contexts/task-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskGen - AI-Powered Task Manager",
  description: "Generate and manage tasks with Google Gemini AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/placeholder-logo.png" sizes="32x32" type="image/png" />
      </head>
      <body className={inter.className}>
        <TaskProvider>
          {children}
        </TaskProvider>
        <Toaster />
      </body>
    </html>
  )
}

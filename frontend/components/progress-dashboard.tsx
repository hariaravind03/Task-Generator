"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Target, TrendingUp, Calendar } from "lucide-react"
import { useTaskContext, type Task } from "@/contexts/task-context"

interface CategoryStats {
  category: string
  topic: string
  total: number
  completed: number
  percentage: number
}

export function ProgressDashboard() {
  const { tasks } = useTaskContext()
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])

  useEffect(() => {
    // Calculate combined category/topic statistics
    const statsMap = new Map<string, { category: string; topic: string; total: number; completed: number }>()

    tasks.forEach((task: Task) => {
      const topic = task.topic || ""
      const key = `${task.category}::${topic}` // Create a unique key
      const current = statsMap.get(key) || { category: task.category, topic, total: 0, completed: 0 }

      statsMap.set(key, {
        ...current,
        total: current.total + 1,
        completed: current.completed + (task.completed ? 1 : 0),
      })
    })

    const stats: CategoryStats[] = Array.from(statsMap.values()).map((data) => ({
      ...data,
      percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
    }))

    setCategoryStats(stats.sort((a, b) => b.total - a.total))
  }, [tasks])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Recent activity (tasks created in last 7 days)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const recentTasks = tasks.filter((task) => new Date(task.createdAt) > weekAgo)

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Overall Progress</span>
          </CardTitle>
          <CardDescription>Your task completion overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{overallProgress}%</div>
            <p className="text-sm text-gray-600">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
          <Progress value={overallProgress} className="w-full" />
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold text-green-600">{completedTasks}</div>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
            <div>
              <div className="text-2xl font-semibold text-orange-600">{totalTasks - completedTasks}</div>
              <p className="text-xs text-gray-600">Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-purple-600" />
            <span>Category Progress</span>
          </CardTitle>
          <CardDescription>Progress by task category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryStats.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No categories yet</p>
          ) : (
            categoryStats.map((stat) => (
              <div key={`${stat.category}-${stat.topic}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {stat.category}
                      {stat.topic && <span className="ml-1 font-semibold opacity-70">({stat.topic})</span>}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {stat.completed}/{stat.total}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{stat.percentage}%</span>
                </div>
                <Progress value={stat.percentage} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Tasks created this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{recentTasks.length}</div>
            <p className="text-sm text-gray-600">New tasks this week</p>
          </div>
          {recentTasks.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Latest tasks:</h4>
              {recentTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="text-xs p-2 bg-gray-50 rounded">
                  <div className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</div>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {task.category}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Motivation */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6 text-center">
          <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-blue-900 mb-1">Keep Going!</h3>
          <p className="text-sm text-blue-700">
            {overallProgress >= 80
              ? "You're crushing it! Almost there!"
              : overallProgress >= 50
                ? "Great progress! Keep up the momentum!"
                : overallProgress > 0
                  ? "Every task completed is a step forward!"
                  : "Start your journey by completing your first task!"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

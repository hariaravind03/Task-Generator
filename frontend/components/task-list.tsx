"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CheckSquare, Edit, Trash2, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTaskContext, type Task } from "@/contexts/task-context"

export function TaskList() {
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext()
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [newTaskCategory, setNewTaskCategory] = useState("")
  const [isAddingTask, setIsAddingTask] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let filtered = tasks

    // Filter by completion status
    if (filter === "completed") {
      filtered = filtered.filter((task) => task.completed)
    } else if (filter === "pending") {
      filtered = filtered.filter((task) => !task.completed)
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((task) => task.category === categoryFilter)
    }

    setFilteredTasks(filtered)
  }, [tasks, filter, categoryFilter])

  const toggleTaskCompletion = (task: Task) => {
    updateTask(task.id, { completed: !task.completed })
    toast({
      title: "Success",
      description: `Task ${!task.completed ? "completed" : "marked as pending"}`,
    })
  }

  const handleUpdateTask = () => {
    if (!editingTask || !newTaskTitle.trim()) return

    updateTask(editingTask.id, {
      title: newTaskTitle,
      category: newTaskCategory,
    })

    setEditingTask(null)
    setNewTaskTitle("")
    setNewTaskCategory("")

    toast({
      title: "Success",
      description: "Task updated successfully",
    })
  }

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId)
    toast({
      title: "Success",
      description: "Task deleted successfully",
    })
  }

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return

    addTask({
      title: newTaskTitle,
      category: newTaskCategory || "General",
      topic: "",
      completed: false,
    })

    setNewTaskTitle("")
    setNewTaskCategory("")
    setIsAddingTask(false)

    toast({
      title: "Success",
      description: "Task created successfully",
    })
  }

  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-600" />
              <span>My Tasks</span>
            </CardTitle>
            <CardDescription>Manage and track your tasks</CardDescription>
          </div>
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>Create a new task manually</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title..."
                  />
                </div>
                <div>
                  <Label htmlFor="task-category">Category</Label>
                  <Input
                    id="task-category"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    placeholder="Enter category (optional)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>Add Task</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task List */}
        <div className="space-y-2">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {tasks.length === 0
                ? "No tasks yet. Generate some tasks above or add manually!"
                : "No tasks match your current filters."}
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 border rounded-lg ${
                  task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox checked={task.completed} onCheckedChange={() => toggleTaskCompletion(task)} />
                    <div className="flex-1">
                      <p className={`${task.completed ? "line-through text-gray-500" : ""}`}>{task.title}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {task.category}
                        </Badge>
                        {task.topic && (
                          <Badge variant="outline" className="text-xs">
                            {task.topic}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTask(task)
                            setNewTaskTitle(task.title)
                            setNewTaskCategory(task.category)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Task</DialogTitle>
                          <DialogDescription>Update your task details</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="edit-title">Task Title</Label>
                            <Input
                              id="edit-title"
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-category">Category</Label>
                            <Input
                              id="edit-category"
                              value={newTaskCategory}
                              onChange={(e) => setNewTaskCategory(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingTask(null)}>
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateTask}>Update Task</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

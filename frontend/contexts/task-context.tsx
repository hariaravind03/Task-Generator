"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { fetchTasks } from "@/lib/api"
import { auth } from "@/lib/firebase"

export interface Task {
  id: string
  title: string
  completed: boolean
  category: string
  topic: string
  createdAt: string
}

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<Task>
  updateTask: (id: string, updates: Partial<Task>) => Promise<{ success: boolean }>
  deleteTask: (id: string) => Promise<void>
  addMultipleTasks: (tasks: Omit<Task, "id" | "createdAt">[]) => Promise<Task[]>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api";

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  async function fetchTasks() {
    const user = auth.currentUser;
    const userId = user ? user.uid : null;
    if (!userId) return [];
    const res = await fetch(`${API_BASE_URL}/tasks?userId=${userId}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const data = await res.json();
    return data.tasks;
  }

  // Load tasks from backend on mount and when auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const fetchedTasks = await fetchTasks();
          setTasks(fetchedTasks);
        } catch (error) {
          console.error("Error fetching tasks:", error);
          setTasks([]);
        }
      } else {
        setTasks([]);
      }
    });

    return () => unsubscribe();
  }, [])

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    try {
      const user = auth.currentUser;
      const userId = user ? user.uid : null;
      if (!userId) throw new Error("User not authenticated");
      const token = user && (await user.getIdToken());
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...taskData, userId }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to create task");
      }
      const { task } = await response.json();
      setTasks(prevTasks => [task, ...prevTasks]);
      return task;
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  }

  const addMultipleTasks = async (tasksData: Omit<Task, "id" | "createdAt">[]) => {
    try {
      const user = auth.currentUser;
      const userId = user ? user.uid : null;
      if (!userId) throw new Error("User not authenticated");
      const token = user && (await user.getIdToken());
      const createdTasks: Task[] = [];
      for (const taskData of tasksData) {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...taskData, userId }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to create one or more tasks");
        }
        const { task } = await response.json();
        createdTasks.push(task);
      }
      setTasks(prevTasks => [...createdTasks, ...prevTasks]);
      return createdTasks;
    } catch (error) {
      console.error("Error adding multiple tasks:", error);
      throw error;
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update task");
      }
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      );
      return { success: true };
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const user = auth.currentUser;
      const token = user && (await user.getIdToken());
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, addMultipleTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider")
  }
  return context
}

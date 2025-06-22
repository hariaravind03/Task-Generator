import { auth } from "@/lib/firebase";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchWithAuth(path: string, options: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  const token = await user.getIdToken();
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export async function fetchTasks() {
  const res = await fetchWithAuth("/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export interface TaskInput {
  title: string;
  category?: string;
  topic?: string;
}

export async function createTask(task: TaskInput) {
  const res = await fetchWithAuth("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTask(id: string, updates: Partial<TaskInput>) {
  const res = await fetchWithAuth(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTask(id: string) {
  const res = await fetchWithAuth(`/tasks/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}

// Add more functions for create, update, delete, etc. as needed. 
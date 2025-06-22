const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

// Add more functions for create, update, delete, etc. as needed. 
export type TaskStatus = "todo" | "in-progress" | "done";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  totalTasks?: number;
  todoTasks?: number;
  inProgressTasks?: number;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  projectId: string;
  dueDate?: string;
}

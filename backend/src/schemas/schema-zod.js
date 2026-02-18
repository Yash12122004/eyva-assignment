import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().transform(val => val.trim().toLowerCase()),
  password: z.string().min(6),
  name: z.string().min(2)
});

export const loginSchema = z.object({
  email: z.string().email().transform(val => val.trim().toLowerCase()),  
  password: z.string().min(6)
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional()
});

export const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "done"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  projectId: z.string().uuid(),
  assigneeId: z.string().uuid().optional(),
  dueDate: z.string().optional()
});

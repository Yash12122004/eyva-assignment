import { Router } from "express";
import auth from "../middleware/authMiddleware.js";
import { getProjectTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import validate from "../middleware/validate.js";
import { taskSchema } from "../schemas/schema-zod.js";

const router = Router();

router.get("/:id/tasks", auth, getProjectTasks);
router.post("/", auth, validate(taskSchema), createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);

export default router;

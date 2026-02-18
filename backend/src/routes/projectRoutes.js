import { Router } from "express";
import auth from "../middleware/authMiddleware.js";
import { getProjects, createProject, getProjectById } from "../controllers/projectController.js";
import { getProjectTasks } from "../controllers/taskController.js";
import validate from "../middleware/validate.js";
import { projectSchema } from "../schemas/schema-zod.js";

const router = Router();

router.get("/", auth, getProjects);
router.get("/:id", auth, getProjectById);
router.post("/", auth, validate(projectSchema), createProject);
router.get("/:id/tasks", auth, getProjectTasks);

export default router;

import { Router } from "express";
import auth from "../middleware/authMiddleware.js";
import { getProjects, createProject } from "../controllers/projectController.js";
import validate from "../middleware/validate.js";
import { projectSchema } from "../schemas/schema-zod.js";

const router = Router();

router.get("/", auth, getProjects);
router.post("/", auth, validate(projectSchema), createProject);

export default router;

import { Router } from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// public
router.get("/", getCategories);

// admin only
router.post("/", authMiddleware, requireRole("admin"), createCategory);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteCategory);

export default router;

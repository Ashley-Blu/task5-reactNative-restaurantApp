import { Router } from "express";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// admin only
router.post("/", authMiddleware, requireRole("admin"), createCategory);
router.put("/:id", authMiddleware, requireRole("admin"), updateCategory);
router.delete("/:id", authMiddleware, requireRole("admin"), deleteCategory);

export default router;

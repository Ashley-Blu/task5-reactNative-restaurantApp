import { Router } from "express";
import {
  getMenu,
  getMenuItemById,
  getMenuByCategory,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menu.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

// public
router.get("/", getMenu);
router.get("/category/:categoryId", getMenuByCategory);
router.get("/:id", getMenuItemById);

// admin
router.post("/", authMiddleware, requireAdmin, createMenuItem);
router.put("/:id", authMiddleware, requireAdmin, updateMenuItem);
router.delete("/:id", authMiddleware, requireAdmin, deleteMenuItem);

export default router;

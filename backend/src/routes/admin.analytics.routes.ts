import { Router } from "express";
import {
  getTodayAnalytics,
  getDailyRevenue,
  getRevenueByRange,
} from "../controllers/admin.analytics.controller";
import { requireAdmin } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/today", getTodayAnalytics, authMiddleware, requireAdmin);
router.get("/daily", getDailyRevenue, authMiddleware, requireAdmin);
router.get("/range", getRevenueByRange, authMiddleware, requireAdmin);

export default router;

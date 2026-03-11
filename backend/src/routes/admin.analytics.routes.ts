import { Router } from "express";
import {
  getTodayAnalytics,
  getDailyRevenue,
  getRevenueByRange,
} from "../controllers/admin.analytics.controller";
import { requireAdmin } from "../middleware/role.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/today", authMiddleware, requireAdmin, getTodayAnalytics);
router.get("/daily", authMiddleware, requireAdmin, getDailyRevenue);
router.get("/range", authMiddleware, requireAdmin, getRevenueByRange);

export default router;

import { Router } from "express";
import {
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller";

import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

// user
router.get("/my", authMiddleware, getMyOrders);

// admin
router.get(
  "/admin",
  authMiddleware,
  requireRole("admin"),
  getAllOrders
);

router.put(
  "/admin/:orderId/status",
  authMiddleware,
  requireRole("admin"),
  updateOrderStatus
);

export default router;

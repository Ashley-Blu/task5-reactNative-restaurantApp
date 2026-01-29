import { Router } from "express";
import {
  getAllOrders,
  getOrderDetailsAdmin,
  updateOrderStatus,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get("/orders", getAllOrders, authMiddleware, requireAdmin);
router.get("/orders/:orderId", getOrderDetailsAdmin, authMiddleware, requireAdmin);
router.patch("/orders/:orderId/status", updateOrderStatus, authMiddleware, requireAdmin);

export default router;

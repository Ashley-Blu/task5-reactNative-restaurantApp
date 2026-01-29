import { Router } from "express";
import {
  getAllOrders,
  getOrderDetailsAdmin,
  updateOrderStatus,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get(
  "/orders",
  authMiddleware,
  requireAdmin,
  getAllOrders
);

router.get(
  "/orders/:orderId",
  authMiddleware,
  requireAdmin,
  getOrderDetailsAdmin
);

router.patch(
  "/orders/:orderId/status",
  authMiddleware,
  requireAdmin,
  updateOrderStatus
);


export default router;

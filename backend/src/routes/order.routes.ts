import { Router } from "express";
import {
  getUserOrders,
  getOrderDetails,
  updateOrderStatus,
} from "../controllers/order.controller";

const router = Router();

router.get("/user/:userId", getUserOrders);
router.get("/:orderId", getOrderDetails);

// admin / restaurant
router.patch("/:orderId/status", updateOrderStatus);

export default router;

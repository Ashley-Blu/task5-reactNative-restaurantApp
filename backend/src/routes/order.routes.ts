import { Router } from "express";

const router = Router();

/**
 * CREATE ORDER
 */
router.post("/", (req, res) => {
  res.json({
    message: "Order created successfully",
  });
});

/**
 * GET ORDERS
 */
router.get("/", (req, res) => {
  res.json({
    message: "Orders fetched successfully",
  });
});

export default router;

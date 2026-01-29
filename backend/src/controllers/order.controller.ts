import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../types/auth";

const statusFlow = [
  "paid",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const result = await pool.query(
    `
    SELECT *
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  res.json(result.rows);
};

export const getAllOrders = async (_req: AuthRequest, res: Response) => {
  const result = await pool.query(
    `
    SELECT
      o.*,
      u.name,
      u.email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    `
  );

  res.json(result.rows);
};

export const updateOrderStatus = async (
  req: AuthRequest,
  res: Response
) => {
  const { orderId } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: "Status required" });
  }

  // get order
  const orderResult = await pool.query(
    `SELECT * FROM orders WHERE id = $1`,
    [orderId]
  );

  if (orderResult.rows.length === 0) {
    return res.status(404).json({ message: "Order not found" });
  }

  const order = orderResult.rows[0];

  const currentIndex = statusFlow.indexOf(order.status);
  const nextIndex = statusFlow.indexOf(status);

  if (nextIndex !== currentIndex + 1) {
    return res.status(400).json({
      message: `Invalid status transition from ${order.status} to ${status}`,
    });
  }

  const updated = await pool.query(
    `
    UPDATE orders
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, orderId]
  );

  res.json({
    message: "Order status updated",
    order: updated.rows[0],
  });
};

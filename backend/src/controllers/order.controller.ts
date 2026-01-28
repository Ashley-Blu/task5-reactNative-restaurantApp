import { Request, Response } from "express";
import { pool } from "../db";

// GET all orders for a user
export const getUserOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT id, total_price, status, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// GET single order details
export const getOrderDetails = async (req: Request, res: Response) => {
  const { orderId } = req.params;

  try {
    const orderResult = await pool.query(
      `
      SELECT id, total_price, status, created_at
      FROM orders
      WHERE id = $1
      `,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemsResult = await pool.query(
      `
      SELECT 
        m.name,
        oi.quantity,
        oi.price
      FROM order_items oi
      JOIN menu_items m ON oi.menu_item_id = m.id
      WHERE oi.order_id = $1
      `,
      [orderId]
    );

    res.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch order details" });
  }
};

// UPDATE order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "paid",
    "preparing",
    "on_the_way",
    "delivered",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status",
    });
  }

  try {
    const result = await pool.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order status updated",
      order: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


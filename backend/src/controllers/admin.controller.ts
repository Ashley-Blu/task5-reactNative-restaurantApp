import { Request, Response } from "express";
import { pool } from "../db";

// Get all orders (admin)
export const getAllOrders = async (req: Request, res: Response) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT 
        o.id,
        o.total_price,
        o.status,
        o.created_at,
        u.id AS user_id,
        u.name,
        u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
    `;

    const values: any[] = [];

    if (status) {
      query += ` WHERE o.status = $1`;
      values.push(status);
    }

    query += ` ORDER BY o.created_at DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Get single order full details
export const getOrderDetailsAdmin = async (
  req: Request,
  res: Response
) => {
  const { orderId } = req.params;

  try {
    const orderResult = await pool.query(
      `
      SELECT 
        o.id,
        o.total_price,
        o.status,
        o.created_at,
        u.name,
        u.email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
      `,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemsResult = await pool.query(
      `
      SELECT 
        oi.quantity,
        oi.price,
        m.name,
        m.image
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

// Update order status
export const updateOrderStatus = async (
  req: Request,
    res: Response
) => {
  const { orderId } = req.params;
  const { status } = req.body;
    try {
    const result = await pool.query(
      `
      UPDATE orders
        SET status = $1
        WHERE id = $2
        `,
        [status, orderId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order status updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

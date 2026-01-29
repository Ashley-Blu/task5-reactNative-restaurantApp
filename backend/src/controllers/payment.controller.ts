import { Request, Response } from "express";
import { pool } from "../db";
import { v4 as uuidv4 } from "uuid";

export const initiatePayment = async (req: Request, res: Response) => {
  const { orderId, provider } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // check order
    const orderResult = await pool.query(
      `SELECT * FROM orders WHERE id = $1 AND user_id = $2`,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderResult.rows[0];

    // create payment
    const reference = `PAY_${uuidv4()}`;

    const paymentResult = await pool.query(
      `
      INSERT INTO payments (order_id, user_id, amount, provider, reference)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [order.id, userId, order.total_price, provider, reference]
    );

    res.json({
      message: "Payment initiated",
      payment: paymentResult.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

// Verify payment (simulated)
export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.body;

  try {
    // simulate successful payment
    const paymentResult = await pool.query(
      `
      UPDATE payments
      SET status = 'success'
      WHERE reference = $1
      RETURNING *
      `,
      [reference]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const payment = paymentResult.rows[0];

    // mark order as paid
    await pool.query(
      `
      UPDATE orders
      SET status = 'paid'
      WHERE id = $1
      `,
      [payment.order_id]
    );

    res.json({
      message: "Payment successful",
      payment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

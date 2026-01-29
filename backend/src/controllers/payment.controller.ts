import { Response } from "express";
import { pool } from "../db";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../types/auth";

export const initiatePayment = async (
  req: AuthRequest,
  res: Response
) => {
  const { orderId, provider = "fake" } = req.body;
  const userId = req.user!.userId;

  try {
    // 1️⃣ validate order
    const orderResult = await pool.query(
      `
      SELECT * FROM orders
      WHERE id = $1 AND user_id = $2 AND status = 'pending'
      `,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found or already paid",
      });
    }

    const order = orderResult.rows[0];

    // 2️⃣ create payment
    const reference = `PAY_${uuidv4()}`;

    const paymentResult = await pool.query(
      `
      INSERT INTO payments
      (order_id, user_id, amount, provider, reference, status)
      VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *
      `,
      [
        order.id,
        userId,
        order.total_price,
        provider,
        reference,
      ]
    );

    res.json({
      message: "Payment initiated",
      payment: paymentResult.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};

export const verifyPayment = async (
  req: AuthRequest,
  res: Response
) => {
  const { reference } = req.body;

  try {
    // 1️⃣ get payment
    const paymentResult = await pool.query(
      `
      SELECT * FROM payments
      WHERE reference = $1 AND status = 'pending'
      `,
      [reference]
    );

    if (paymentResult.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found or already processed",
      });
    }

    const payment = paymentResult.rows[0];

    // 2️⃣ mark payment success
    await pool.query(
      `
      UPDATE payments
      SET status = 'success'
      WHERE id = $1
      `,
      [payment.id]
    );

    // 3️⃣ mark order paid
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../types/auth";

export const initiatePayment = async (
  req: AuthRequest,
  res: Response
) => {
  const { orderId, provider = "fake" } = req.body;
  const userId = req.user!.userId;

  try {
    // validate order
    const orderResult = await pool.query(
      `
      SELECT * FROM orders
      WHERE id = $1
        AND user_id = $2
        AND status = 'pending'
      `,
      [orderId, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(400).json({
        message: "Order not found or already paid",
      });
    }

    // prevent multiple payments
    const existingPayment = await pool.query(
      `
      SELECT id FROM payments
      WHERE order_id = $1 AND status = 'pending'
      `,
      [orderId]
    );

    if (existingPayment.rows.length > 0) {
      return res.status(400).json({
        message: "Payment already initiated",
      });
    }

    const reference = `PAY_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    const paymentResult = await pool.query(
      `
      INSERT INTO payments
      (order_id, user_id, amount, provider, reference, status)
      VALUES ($1,$2,$3,$4,$5,'pending')
      RETURNING *
      `,
      [
        orderId,
        userId,
        orderResult.rows[0].total_price,
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
  const userId = req.user!.userId;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // lock payment
    const paymentResult = await client.query(
      `
      SELECT *
      FROM payments
      WHERE reference = $1
      FOR UPDATE
      `,
      [reference]
    );

    if (paymentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const payment = paymentResult.rows[0];

    // ownership check
    if (payment.user_id !== userId) {
      await client.query("ROLLBACK");
      return res.status(403).json({
        message: "Not authorized for this payment",
      });
    }

    if (payment.status !== "pending") {
      await client.query("ROLLBACK");
      return res.status(400).json({
        message: "Payment already processed",
      });
    }

    // mark payment success
    await client.query(
      `
      UPDATE payments
      SET status = 'success'
      WHERE id = $1
      `,
      [payment.id]
    );

    // mark order paid
    await client.query(
      `
      UPDATE orders
      SET status = 'paid'
      WHERE id = $1
      `,
      [payment.order_id]
    );

    await client.query("COMMIT");

    res.json({
      message: "Payment verified successfully",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);

    res.status(500).json({
      message: "Payment verification failed",
    });
  } finally {
    client.release();
  }
};

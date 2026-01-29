import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../types/auth";

export const checkout = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const client = await pool.connect();

  try {
    // =========================
    // START TRANSACTION
    // =========================
    await client.query("BEGIN");

    // 1️⃣ get cart items
    const cartItemsResult = await client.query(
      `
      SELECT
        c.menu_item_id,
        c.quantity,
        m.price
      FROM carts c
      JOIN menu_items m ON c.menu_item_id = m.id
      WHERE c.user_id = $1
      FOR UPDATE
      `,
      [userId]
    );

    if (cartItemsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ calculate total
    let total = 0;

    for (const item of cartItemsResult.rows) {
      total += Number(item.price) * item.quantity;
    }

    // 3️⃣ create order
    const orderResult = await client.query(
      `
      INSERT INTO orders (user_id, total_price, status)
      VALUES ($1, $2, 'pending')
      RETURNING id
      `,
      [userId, total]
    );

    const orderId = orderResult.rows[0].id;

    // 4️⃣ insert order items
    for (const item of cartItemsResult.rows) {
      await client.query(
        `
        INSERT INTO order_items
        (order_id, menu_item_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [
          orderId,
          item.menu_item_id,
          item.quantity,
          item.price,
        ]
      );
    }

    // 5️⃣ clear cart
    await client.query(
      `DELETE FROM carts WHERE user_id = $1`,
      [userId]
    );

    // =========================
    // COMMIT TRANSACTION
    // =========================
    await client.query("COMMIT");

    res.status(201).json({
      message: "Checkout successful",
      orderId,
      total,
    });
  } catch (error) {
    // =========================
    // ROLLBACK ON ERROR
    // =========================
    await client.query("ROLLBACK");

    console.error("CHECKOUT ERROR:", error);

    res.status(500).json({
      message: "Checkout failed. Transaction rolled back.",
    });
  } finally {
    client.release();
  }
};

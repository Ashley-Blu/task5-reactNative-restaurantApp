import { Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../types/auth";

export const checkout = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    // 1️⃣ get active cart
    const cartResult = await pool.query(
      `
      SELECT * FROM carts
      WHERE user_id = $1 AND status = 'active'
      LIMIT 1
      `,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ message: "No active cart found" });
    }

    const cart = cartResult.rows[0];

    // 2️⃣ get cart items
    const itemsResult = await pool.query(
      `
      SELECT
        ci.quantity,
        m.price
      FROM cart_items ci
      JOIN menu_items m ON ci.menu_item_id = m.id
      WHERE ci.cart_id = $1
      `,
      [cart.id]
    );

    if (itemsResult.rows.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3️⃣ calculate total
    const total = itemsResult.rows.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    // 4️⃣ create order
    const orderResult = await pool.query(
      `
      INSERT INTO orders (user_id, total_price, status)
      VALUES ($1, $2, 'paid')
      RETURNING *
      `,
      [userId, total]
    );

    const order = orderResult.rows[0];

    // 5️⃣ clear cart items
    await pool.query(
      `DELETE FROM cart_items WHERE cart_id = $1`,
      [cart.id]
    );

    // 6️⃣ mark cart as completed
    await pool.query(
      `UPDATE carts SET status = 'completed' WHERE id = $1`,
      [cart.id]
    );

    res.json({
      message: "Checkout successful",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Checkout failed" });
  }
};

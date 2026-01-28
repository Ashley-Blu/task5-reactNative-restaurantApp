import { Request, Response } from "express";
import { pool } from "../db";

export const checkout = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // 1️⃣ get active cart
    const cartResult = await pool.query(
      `SELECT * FROM carts
       WHERE user_id = $1 AND status = 'active'
       LIMIT 1`,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ message: "No active cart" });
    }

    const cart = cartResult.rows[0];

    // 2️⃣ get cart items + prices
    const itemsResult = await pool.query(
      `
      SELECT 
        ci.menu_item_id,
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

    // 3️⃣ calculate total price
    let total = 0;

    for (const item of itemsResult.rows) {
      total += item.price * item.quantity;
    }

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

    // 5️⃣ insert order items
    for (const item of itemsResult.rows) {
      await pool.query(
        `
        INSERT INTO order_items
        (order_id, menu_item_id, quantity, price)
        VALUES ($1, $2, $3, $4)
        `,
        [
          order.id,
          item.menu_item_id,
          item.quantity,
          item.price,
        ]
      );
    }

    // 6️⃣ close cart
    await pool.query(
      `UPDATE carts SET status = 'completed' WHERE id = $1`,
      [cart.id]
    );

    // 7️⃣ cleanup cart items (optional but recommended)
    await pool.query(
      `DELETE FROM cart_items WHERE cart_id = $1`,
      [cart.id]
    );

    res.json({
      message: "Checkout successful",
      order,
    });
  } catch (error: any) {
  console.error("CHECKOUT ERROR 👉", error.message);
  res.status(500).json({
    message: "Checkout failed",
    error: error.message,
  });
}
};

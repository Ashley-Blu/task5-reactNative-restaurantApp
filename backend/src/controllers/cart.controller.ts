import { Request, Response } from "express";
import { pool } from "../db";

export const addToCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { menu_item_id, quantity } = req.body;

  if (!userId || !menu_item_id) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    // find active cart
    let cartResult = await pool.query(
      `
      SELECT * FROM carts
      WHERE user_id = $1 AND status = 'active'
      LIMIT 1
      `,
      [userId],
    );

    // create cart if none exists
    if (cartResult.rows.length === 0) {
      cartResult = await pool.query(
        `
        INSERT INTO carts (user_id, status)
        VALUES ($1, 'active')
        RETURNING *
        `,
        [userId],
      );
    }

    const cart = cartResult.rows[0];

    // add item
    await pool.query(
      `
      INSERT INTO cart_items (cart_id, menu_item_id, quantity)
      VALUES ($1, $2, $3)
      `,
      [cart.id, menu_item_id, quantity || 1],
    );

    res.json({ message: "Item added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    // check if active cart exists
    const cartResult = await pool.query(
      `
      SELECT * FROM carts
      WHERE user_id = $1 AND status = 'active'
      LIMIT 1
      `,
      [userId],
    );

    // if no cart → create one
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        `
        INSERT INTO carts (user_id, status)
        VALUES ($1, 'active')
        RETURNING *
        `,
        [userId],
      );

      return res.json({
        cart: newCart.rows[0],
        items: [],
      });
    }

    const cart = cartResult.rows[0];

    // get cart items
    const itemsResult = await pool.query(
      `
      SELECT 
        ci.id,
        ci.quantity,
        m.name,
        m.price,
        m.image
      FROM cart_items ci
      JOIN menu_items m ON ci.menu_item_id = m.id
      WHERE ci.cart_id = $1
      `,
      [cart.id],
    );

    res.json({
      cart,
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

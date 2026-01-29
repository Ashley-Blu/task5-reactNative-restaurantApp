import { Request, Response } from "express";
import { pool } from "../db";
import { AuthRequest } from "../types/auth";

// ADD TO CART
export const addToCart = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { menu_item_id, quantity = 1 } = req.body;

  if (!userId || !menu_item_id) {
    return res.status(400).json({
      message: "Missing required fields",
    });
  }

  try {
    let cartResult = await pool.query(
      `
      SELECT * FROM carts
      WHERE user_id = $1 AND status = 'active'
      LIMIT 1
      `,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      cartResult = await pool.query(
        `
        INSERT INTO carts (user_id, status)
        VALUES ($1, 'active')
        RETURNING *
        `,
        [userId]
      );
    }

    const cart = cartResult.rows[0];

    const existingItem = await pool.query(
      `
      SELECT * FROM cart_items
      WHERE cart_id = $1 AND menu_item_id = $2
      `,
      [cart.id, menu_item_id]
    );

    if (existingItem.rows.length > 0) {
      await pool.query(
        `
        UPDATE cart_items
        SET quantity = quantity + $1
        WHERE id = $2
        `,
        [quantity, existingItem.rows[0].id]
      );
    } else {
      await pool.query(
        `
        INSERT INTO cart_items (menu_item_id, quantity)
        VALUES ($1, $2, $3)
        `,
        [cart.id, menu_item_id, quantity]
      );
    }

    res.json({ message: "Item added to cart" });
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
};


// GET CART
export const getCart = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  try {
    let cartResult = await pool.query(
      `
      SELECT * FROM carts
      WHERE user_id = $1 AND status = 'active'
      LIMIT 1
      `,
      [userId]
    );

    if (cartResult.rows.length === 0) {
      cartResult = await pool.query(
        `
        INSERT INTO carts (user_id, status)
        VALUES ($1, 'active')
        RETURNING *
        `,
        [userId]
      );
    }

    const cart = cartResult.rows[0];

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
      [cart.id]
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


/**
 * ============================
 * UPDATE CART ITEM QUANTITY
 * PUT /cart/item/:cartItemId
 * body: { quantity }
 * ============================
 */
export const updateCartItem = async (req: Request, res: Response) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined) {
    return res.status(400).json({ message: "Quantity is required" });
  }

  try {
    // quantity = 0 → delete
    if (quantity === 0) {
      await pool.query(
        `DELETE FROM cart_items WHERE id = $1`,
        [cartItemId]
      );

      return res.json({ message: "Item removed from cart" });
    }

    const result = await pool.query(
      `
      UPDATE cart_items
      SET quantity = $1
      WHERE id = $2
      RETURNING *
      `,
      [quantity, cartItemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({
      message: "Quantity updated",
      item: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

/**
 * ============================
 * DELETE SINGLE CART ITEM
 * DELETE /cart/item/:cartItemId
 * ============================
 */
export const deleteCartItem = async (req: Request, res: Response) => {
  const { cartItemId } = req.params;

  try {
    const result = await pool.query(
      `
      DELETE FROM cart_items
      WHERE id = $1
      RETURNING *
      `,
      [cartItemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    res.json({
      message: "Item removed from cart",
      item: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete cart item" });
  }
};

/**
 * ============================
 * CLEAR CART
 * DELETE /cart/clear/:cartId
 * ============================
 */
export const clearCart = async (req: Request, res: Response) => {
  const { cartId } = req.params;

  try {
    await pool.query(
      `
      DELETE FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId]
    );

    res.json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

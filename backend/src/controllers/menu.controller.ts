import { Request, Response } from "express";
import { pool } from "../db";

/**
 * GET ALL MENU (public)
 */
export const getMenu = async (_: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.*,
        c.name AS category
      FROM menu_items m
      JOIN categories c ON c.id = m.category_id
      ORDER BY m.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load menu" });
  }
};

/**
 * GET SINGLE MENU ITEM BY ID (public/admin)
 */
export const getMenuItemById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        m.*,
        c.name AS category
      FROM menu_items m
      JOIN categories c ON c.id = m.category_id
      WHERE m.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load menu item" });
  }
};

/**
 * GET MENU BY CATEGORY (public)
 */
export const getMenuByCategory = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        m.*,
        c.name AS category
      FROM menu_items m
      JOIN categories c ON c.id = m.category_id
      WHERE m.category_id = $1
      ORDER BY m.id DESC
      `,
      [categoryId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load menu" });
  }
};

/**
 * CREATE MENU ITEM (admin)
 */
export const createMenuItem = async (req: Request, res: Response) => {
  const {
    name,
    price,
    image,
    category_id,
    description,
    featured = false,
    special = false,
  } = req.body;

  const result = await pool.query(
    `
    INSERT INTO menu_items
    (name, price, image, category_id, description, featured, special)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [name, price, image, category_id, description, featured, special]
  );

  res.status(201).json(result.rows[0]);
};

/**
 * UPDATE MENU ITEM (admin)
 */
export const updateMenuItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await pool.query(
    `
    UPDATE menu_items
    SET
      name = COALESCE($1, name),
      price = COALESCE($2, price),
      image = COALESCE($3, image),
      category_id = COALESCE($4, category_id),
      description = COALESCE($5, description),
      featured = COALESCE($6, featured),
      special = COALESCE($7, special)
    WHERE id = $8
    RETURNING *
    `,
    [
      req.body.name,
      req.body.price,
      req.body.image,
      req.body.category_id,
      req.body.description,
      req.body.featured,
      req.body.special,
      id,
    ]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  res.json(result.rows[0]);
};

/**
 * DELETE MENU ITEM (admin)
 */
export const deleteMenuItem = async (req: Request, res: Response) => {
  const result = await pool.query(
    `DELETE FROM menu_items WHERE id = $1 RETURNING id`,
    [req.params.id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Menu item not found" });
  }

  res.json({ message: "Menu item deleted" });
};

import { Request, Response } from "express";
import { pool } from "../db";

/**
 * GET /menu
 * returns full menu with category names
 */
export const getMenu = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image,
        c.title AS category
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      ORDER BY c.title
    `);

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching menu" });
  }
};

/**
 * GET /menu/:type
 */
export const getMenuByType = async (req: Request, res: Response) => {
  const { type } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price,
        m.image,
        c.title AS category
      FROM menu_items m
      JOIN categories c ON m.category_id = c.id
      WHERE LOWER(c.title) = LOWER($1)
    `,
      [type]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch menu" });
  }
};

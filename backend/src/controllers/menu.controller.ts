import { Request, Response } from "express";
import { pool } from "../db";

export const getMenuItems = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(`
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image,
        c.name AS category
      FROM menu_items mi
      JOIN categories c ON mi.category_id = c.id
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch menu items" });
  }
};

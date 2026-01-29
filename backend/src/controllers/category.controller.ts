import { Request, Response } from "express";
import { pool } from "../db";

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  const result = await pool.query(
    `INSERT INTO categories (name) VALUES ($1) RETURNING *`,
    [name]
  );

  res.status(201).json(result.rows[0]);
};

export const getCategories = async (_: Request, res: Response) => {
  const result = await pool.query(
    `SELECT * FROM categories ORDER BY name`
  );
  res.json(result.rows);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const result = await pool.query(
    `
    UPDATE categories
    SET name = $1
    WHERE id = $2
    RETURNING *
    `,
    [name, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "Category not found" });
  }

  res.json(result.rows[0]);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;

  const check = await pool.query(
    `SELECT id FROM menu_items WHERE category_id = $1`,
    [id]
  );

  if (check.rows.length > 0) {
    return res.status(400).json({
      message: "Category contains menu items",
    });
  }

  await pool.query(`DELETE FROM categories WHERE id = $1`, [id]);

  res.json({ message: "Category deleted" });
};

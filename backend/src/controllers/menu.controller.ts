import { Request, Response } from "express";
import { pool } from "../db";

//GET menu items
export const getMenu = async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM menu_items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching menu" });
  }
};



 //GET /menu/:type




import { Request, Response } from "express";
import { pool } from "../db";

// CREATE USER
export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email required" });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
      `,
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }

    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

// GET USER BY ID
export const getUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

// GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`); 
    res.json(result.rows);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users" });
  } 

};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email } = req.body;
    if (!name && !email) {
    return res.status(400).json({ message: "At least one field (name or email) required to update" });
  } 
    try {
    const fields: string[] = [];
    const values: any[] = [];
    let query = `UPDATE users SET `;
    if (name) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(name);
    }   
    if (email) {
      fields.push(`email = $${fields.length + 1}`);
      values.push(email);
    }
    query += fields.join(", ") + ` WHERE id = $${fields.length + 1} RETURNING *`;
    values.push(userId);
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }       
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
    try {
    const result = await pool.query(    
        `DELETE FROM users WHERE id = $1 RETURNING *`,
        [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user" });
  } 
};
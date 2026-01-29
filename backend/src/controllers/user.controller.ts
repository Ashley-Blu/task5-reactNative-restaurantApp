import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";

// CREATE USER
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Name, email and password required",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `
      INSERT INTO users (name, email, password, role)
      VALUES ($1, $2, $3, 'user')
      RETURNING id, name, email, role
      `,
      [name, email, hashedPassword]
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

//GET USER BY ID
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT id, name, email, role FROM users WHERE id = $1`,
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  }
  catch (error) {
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
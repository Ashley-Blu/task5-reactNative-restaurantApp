import { Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";

// CREATE USER (admin)
export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    surname,
    email,
    password,
    phone,
    address,
    role = "user",
  } = req.body;

  if (!name || !surname || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const hashed = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      `
      INSERT INTO users
      (name, surname, email, password, phone, address, role)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING id, name, email, role
      `,
      [name, surname, email, hashed, phone, address, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Failed to create user" });
  }
};

// GET ALL USERS
export const getAllUsers = async (_: Request, res: Response) => {
  const result = await pool.query(
    `SELECT id, name, surname, email, role FROM users ORDER BY created_at DESC`
  );
  res.json(result.rows);
};

// GET USER
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await pool.query(
    `SELECT id, name, surname, email, role FROM users WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(result.rows[0]);
};

// UPDATE USER
export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, surname, email, role } = req.body;

  const result = await pool.query(
    `
    UPDATE users
    SET
      name = COALESCE($1, name),
      surname = COALESCE($2, surname),
      email = COALESCE($3, email),
      role = COALESCE($4, role)
    WHERE id = $5
    RETURNING id, name, email, role
    `,
    [name, surname, email, role, userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(result.rows[0]);
};

// DELETE USER
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id`,
    [userId]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted" });
};

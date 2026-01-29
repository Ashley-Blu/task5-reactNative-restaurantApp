import { Response } from "express";
import bcrypt from "bcrypt";
import { pool } from "../db";
import { AuthRequest } from "../types/auth";

export const changePassword = async (
  req: AuthRequest,
  res: Response
) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({
      message: "Old password and new password required",
    });
  }

  try {
    const result = await pool.query(
      "SELECT password FROM users WHERE id = $1",
      [req.user!.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      result.rows[0].password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2",
      [hashed, req.user!.userId]
    );

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

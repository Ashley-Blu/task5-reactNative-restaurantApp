import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { pool } from "../db";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Return full user profile for the authenticated user
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user as { userId: string; role: string };

    const result = await pool.query(
      `
      SELECT
        id,
        name,
        surname,
        email,
        phone,
        address,
        role
      FROM users
      WHERE id = $1
      `,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

export default router;

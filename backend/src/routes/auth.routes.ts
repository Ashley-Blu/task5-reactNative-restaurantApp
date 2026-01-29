import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    user: req.user
  });
});

export default router;

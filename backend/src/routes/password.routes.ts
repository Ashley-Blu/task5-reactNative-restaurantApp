import { Router } from "express";
import { changePassword } from "../controllers/password.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.put("/", authMiddleware, changePassword);

export default router;

import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware);
router.use(requireAdmin);

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;

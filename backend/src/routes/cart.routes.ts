import { Router } from "express";
import { getCart, addToCart } from "../controllers/cart.controller";

const router = Router();

router.get("/:userId", getCart);
router.post("/:userId/add", addToCart);

export default router;

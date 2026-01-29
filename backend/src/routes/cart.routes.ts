import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", addToCart);
router.get("/", getCart);

// Update and Delete cart items by cart item ID
router.put("/item/:cartItemId", updateCartItem);
router.delete("/item/:cartItemId", deleteCartItem);

router.delete("/clear/:cartId", clearCart);

export default router;

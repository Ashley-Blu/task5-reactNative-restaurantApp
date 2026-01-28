import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  clearCart,
} from "../controllers/cart.controller";

const router = Router();

router.post("/:userId", addToCart);
router.get("/:userId", getCart);

// Update and Delete cart items by cart item ID
router.put("/item/:cartItemId", updateCartItem);
router.delete("/item/:cartItemId", deleteCartItem);

router.delete("/clear/:cartId", clearCart);

export default router;

import { Router } from "express";
import { getMenu, getMenuByType } from "../controllers/menu.controller";

const router = Router();

router.get("/", getMenu);
router.get("/:type", getMenuByType); //type - category (pizza, drinks, dessert, salad)

export default router;

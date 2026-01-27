import { Router } from "express";
import { getMenuItems } from "../controllers/menu.controller";

const router = Router();

router.get("/", getMenuItems);

export default router;

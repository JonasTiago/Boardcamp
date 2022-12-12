import { Router } from "express";
import { createCategories, findCategories } from "../controllers/categoriesController.js";

const router = Router();

router.get("/categories", findCategories);

router.post("/categories", createCategories);

export default router;
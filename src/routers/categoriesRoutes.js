import { Router } from "express";
import {
  createCategories,
  findCategories,
} from "../controllers/categoriesController.js";
import categoriesSchema from "../middlewares/categoriesSchemaMiddleware.js";

const router = Router();

router.get("/categories", findCategories);

router.post("/categories", categoriesSchema, createCategories);

export default router;

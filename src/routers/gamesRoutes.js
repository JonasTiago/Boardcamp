import { Router } from "express";
import { createGames, findGames } from "../controllers/gamesController.js";
import gamesSchema from "../middlewares/gamesSchemaMiddleware.js";

const router = Router();

router.get("/games", findGames);
router.post("/games", gamesSchema, createGames);

export default router;

import { Router } from "express";
import { createGames, findGames } from "../controllers/gamesController.js";

const router = Router();

router.get("/games", findGames);
router.post("/games", createGames);

export default router;
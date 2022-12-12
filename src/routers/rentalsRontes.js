import { Router } from "express";
import { enterRent, eraseRent, finalizeRent, listRentals } from "../controllers/rentalsController.js";

const router = Router();

router.get("/rentals", listRentals);
router.post("/rentals", enterRent);
router.post("/rentals/:id/return", finalizeRent);
router.delete("/rentals/:id", eraseRent);

export default router;

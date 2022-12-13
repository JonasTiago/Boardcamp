import { Router } from "express";
import {
  enterRent,
  eraseRent,
  finalizeRent,
  listRentals,
} from "../controllers/rentalsController.js";
import rentFinalizeValidate from "../middlewares/deleteRentMiddleware.js";
import deleteRentValidate from "../middlewares/rentalsDeleteMiddleware.js";
import rentalsSchema from "../middlewares/rentalsSchemaMiddleware.js";

const router = Router();

router.get("/rentals", listRentals);
router.post("/rentals", rentalsSchema, enterRent);
router.post("/rentals/:id/return", rentFinalizeValidate, finalizeRent);
router.delete("/rentals/:id", deleteRentValidate, eraseRent);

export default router;

import { Router } from "express";
import {
  insertCustomer,
  listCustomers,
  SearchCustomerById,
  updateCustomer,
} from "../controllers/customersController.js";

const router = Router();

router.get("/customers", listCustomers);
router.post("/customers", insertCustomer);
router.get("/customers/:id", SearchCustomerById);
router.put("/customers/:id", updateCustomer);

export default router;

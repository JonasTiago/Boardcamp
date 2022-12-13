import { Router } from "express";
import {
  insertCustomer,
  listCustomers,
  SearchCustomerById,
  updateCustomer,
} from "../controllers/customersController.js";
import customerSchemaValidate from "../middlewares/customersSchemaMiddleware.js";

const router = Router();

router.get("/customers", listCustomers);
router.post("/customers", customerSchemaValidate, insertCustomer);
router.get("/customers/:id", SearchCustomerById);
router.put("/customers/:id",customerSchemaValidate, updateCustomer);

export default router;

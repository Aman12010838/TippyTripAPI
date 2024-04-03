import { Router } from "express";
import {
  createPayment,
  getAllPayments,
  getPaymentById,
} from "../../controllers/Admin/payment.controllers.js";

const router = Router();

// Create a payment
router.post("/", createPayment);

// Read all payments
router.get("/", getAllPayments);

// Read payment by ID
router.get("/:id", getPaymentById);


export default router;

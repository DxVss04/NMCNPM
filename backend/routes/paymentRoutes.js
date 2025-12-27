// routes/payment.routes.js (Client)
import express from "express";
import {
  createPayment,
  vnpayIPN,
  vnpayReturn,
} from "../controllers/paymentControllers.js";

const router = express.Router();

router.post("/create", createPayment);
router.get("/vnpay-ipn", vnpayIPN);
router.get("/vnpay-return", vnpayReturn);

export default router;

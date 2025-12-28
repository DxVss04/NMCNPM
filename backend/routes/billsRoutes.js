import express from "express";
import {
  createBill,
  getAllBillsByHousehold,
  getAllBills,
} from "../controllers/billControllers.js";

const router = express.Router();

// User route
router.get("/households/:identification_head/bills", getAllBillsByHousehold);

// Admin routes
router.post("/create-bill", createBill);
router.get("/get-bills", getAllBills);

export default router;

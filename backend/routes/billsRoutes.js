import express from "express";
import {
  createBill,
  getAllBillsByHousehold,
  getAllBills,
  updateBillItemStatus,
} from "../controllers/billControllers.js";

const router = express.Router();

// User route
router.get("/households/:identification_head/bills", getAllBillsByHousehold);

// Admin routes
router.post("/create-bill", createBill);
router.get("/get-bills", getAllBills);
router.patch("/update-bill-item/:billId/:billItemId", updateBillItemStatus);

export default router;

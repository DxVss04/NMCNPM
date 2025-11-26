import { createHouseHold } from "../controllers/houseHoldControllers.js";
import express from "express";

const router = express.Router();

router.post("/create", createHouseHold);

export default router;

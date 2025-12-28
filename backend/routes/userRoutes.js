import express from "express";
import { updateUserProfile } from "../controllers/userControllers.js";

const router = express.Router();

router.patch("/update-profile", updateUserProfile);

export default router;

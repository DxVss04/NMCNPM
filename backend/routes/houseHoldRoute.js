import {
  createHouseHold,
  updateHouseHold,
  getHouseHoldByHeadIdentification,
  getAllHouseHolds,
  deleteHouseHold,
} from "../controllers/houseHoldControllers.js";
import express from "express";

const router = express.Router();

router.post("/create-household", createHouseHold);
// corrected path name: update-household (was update-hosehold)
router.patch("/update-household", updateHouseHold);
router.get(
  "/read-household/:identification_head",
  getHouseHoldByHeadIdentification
);
router.get("/all-households", getAllHouseHolds);
// Delete household (only head of household allowed)
router.delete("/delete-household", deleteHouseHold);
export default router;

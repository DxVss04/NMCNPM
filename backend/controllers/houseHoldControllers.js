import user from "../models/userModel.js";
import houseHold from "../models/houseHoldModel.js";

// Create a new household
export const createHouseHold = async (req, res) => {
  try {
    const { name, members, address } = req.body;
    // const userId = req.user._id;
    const existingHouseHold = await houseHold.findOne({ namehousehold: name });
    if (existingHouseHold) {
      return res.status(400).json({ message: "Household name already exists" });
    }
    const newHouseHold = new houseHold({
      namehousehold: name,
      address: address,
      namehead: "vinh",
      cccdhead: "123456789",
      members: members,
      active: false,
    });
    const savedHouseHold = await newHouseHold.save();

    // await user.findByIdAndUpdate(userId, { household: savedHouseHold._id });
    res.status(201).json(savedHouseHold);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

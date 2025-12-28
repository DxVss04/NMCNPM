import HouseHold from "../models/houseHoldModel.js";
import Bill from "../models/bill.js";

const ELECTRIC_UNIT_PRICE = 3000;
const WATER_UNIT_PRICE = 15000;
const GARBAGE_UNIT_PRICE = 25000;
const MANAGEMENT_UNIT_PRICE = 100000;
const PARKING_UNIT_PRICE = 70000;

// 1. Admin tạo hóa đơn
export const createBill = async (req, res) => {
  try {
    const { identification_head, type, oldIndex, newIndex, dueDate } = req.body;

    const household = await HouseHold.findOne({ identification_head });
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    let unitPrice = 0;
    let amount = 0;
    let billItem = {};

    switch (type) {
      case "electricity":
      case "water":
        if (!oldIndex || !newIndex || newIndex <= oldIndex) {
          return res.status(400).json({ message: "Invalid meter index" });
        }
        unitPrice =
          type === "electricity" ? ELECTRIC_UNIT_PRICE : WATER_UNIT_PRICE;
        amount = (newIndex - oldIndex) * unitPrice;
        billItem = { oldIndex, newIndex, unitPrice, amount, dueDate };
        break;

      case "garbage":
        unitPrice = GARBAGE_UNIT_PRICE;
        amount = unitPrice;
        billItem = { oldIndex: 0, newIndex: 0, unitPrice, amount, dueDate };
        break;

      case "management":
        unitPrice = MANAGEMENT_UNIT_PRICE;
        amount = unitPrice;
        billItem = { oldIndex: 0, newIndex: 0, unitPrice, amount, dueDate };
        break;

      case "parking":
        unitPrice = PARKING_UNIT_PRICE;
        amount = unitPrice;
        billItem = { oldIndex: 0, newIndex: 0, unitPrice, amount, dueDate };
        break;

      default:
        return res.status(400).json({ message: "Invalid bill type" });
    }

    const newBill = new Bill({
      houseHold: household._id,
      type,
      billItem: [billItem],
    });

    await newBill.save();

    res.status(201).json({
      message: "Bill created successfully",
      bill: newBill,
    });
  } catch (error) {
    console.error("Create bill error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. User xem tất cả hóa đơn của nhà mình
export const getAllBillsByHousehold = async (req, res) => {
  try {
    const { identification_head } = req.params;

    const household = await HouseHold.findOne({ identification_head });
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    const bills = await Bill.find({ houseHold: household._id })
      .populate("houseHold", "namehousehold identification_head address")
      .sort({ "billItem.createdAt": -1 });

    res.status(200).json({
      household: {
        id: household._id,
        name: household.namehousehold,
        identification_head: household.identification_head,
      },
      total: bills.length,
      bills,
    });
  } catch (error) {
    console.error("Get bills error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Admin xem tất cả hóa đơn của chung cư
export const getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate("houseHold", "namehousehold identification_head address")
      .sort({ "billItem.createdAt": -1 });

    res.status(200).json({
      total: bills.length,
      bills,
    });
  } catch (error) {
    console.error("Get all bills error:", error);
    res.status(500).json({ message: error.message });
  }
};

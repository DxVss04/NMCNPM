import mongoose from "mongoose";

const memberschema = mongoose.Schema({
  cccd: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  relationship: {
    type: String,
    required: true,
  },
});

const houseHoldschema = mongoose.Schema({
  namehousehold: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  namehead: {
    type: String, // ten chu ho
    required: true,
  },
  cccdhead: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
  },
  members: [memberschema],
});

const HouseHold = mongoose.model("HouseHold", houseHoldschema);

export default HouseHold;

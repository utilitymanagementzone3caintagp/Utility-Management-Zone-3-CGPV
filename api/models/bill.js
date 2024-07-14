import mongoose from "mongoose";

const billSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  stallmonthly: {
    type: String,
  },
  electricbill: {
    type: String,
  },
  mthdateelectricbill: {
    type: String,
  },

  waterbill: {
    type: String,
  },
  mthdatewaterbill: {
    type: String,
  },

  currentbalance: {
    type: String,
  },
  mthdatecurrentbalance: {
    type: String,
  },
});

export const Bill = mongoose.model("Bill", billSchema);
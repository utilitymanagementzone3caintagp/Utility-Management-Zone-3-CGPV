import mongoose from "mongoose";

const billrecordSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  typebill: {
    type: String,
  },
  typebillamount: {
    type: String,
  },
  fromdate: {
    type: String,
  },
  todate: {
    type: String,
  },
  yrtype: {
    type: String,
  },
});

export const Billrecord = mongoose.model("Billrecord", billrecordSchema);
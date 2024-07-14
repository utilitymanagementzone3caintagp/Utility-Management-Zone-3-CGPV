import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema({
  dateyr: {
    type: String,
    required: true,
  },
  time: {
    type: String,
  },
});

export const Meeting = mongoose.model("Meeting", meetingSchema);
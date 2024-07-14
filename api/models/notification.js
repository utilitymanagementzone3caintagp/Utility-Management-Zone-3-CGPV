import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
  definenotifi: {
    type: String,
  },
  timedatenotifi: {
    type: String,
  },
});

export const Notification = mongoose.model("Notification", notificationSchema);
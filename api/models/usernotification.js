import mongoose from "mongoose";

const usernotificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  
  userdefinenotifi: {
    type: String,
  },
  usertimedatenotifi: {
    type: String,
  },
});

export const Usernotification = mongoose.model("Usernotification", usernotificationSchema);
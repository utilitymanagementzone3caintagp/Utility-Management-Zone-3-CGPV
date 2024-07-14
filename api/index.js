import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import usersRoute from "./routes/users.js";
import bills from "./routes/bills.js";
import meetings from "./routes/meetings.js"
import billrecords from "./routes/billrecords.js"
import transactions from "./routes/transactions.js"
import notifications from "./routes/notifications.js"
import usernotifications from "./routes/usernotifications.js"

const app = express();

dotenv.config();

const mongoConnectionString = process.env.MONGO;

const connect = async () => {
  try {
    await mongoose.connect(mongoConnectionString);
    console.log("Connected to MongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

// Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/bills", bills);
app.use("/api/meetings", meetings);
app.use("/api/billrecords", billrecords);
app.use("/api/transactions", transactions);
app.use("/api/notifications", notifications);
app.use("/api/usernotifications", usernotifications);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
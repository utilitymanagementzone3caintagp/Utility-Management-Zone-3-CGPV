import express from "express";
import { login, register, verifyOTP, sendOTP } from "../controllers/auth.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/send-otp", sendOTP);


export default router
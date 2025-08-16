import { Router } from "express";
import {
  sendOtp,
  registerUser,
  login,
  registerAdmin,
  loginAdmin,
} from "../controllers/user.controllers.js";

const authRoutes = Router();

const userRoutes = {
  sendOtp: "/send-otp",
  register: "/register",
  login: "/login",
  registerAdmin: "/admin/register",
  loginAdmin: "/admin/login",
};

authRoutes.post(userRoutes.sendOtp, sendOtp);
authRoutes.post(userRoutes.register, registerUser);
authRoutes.post(userRoutes.login, login);
authRoutes.post(userRoutes.registerAdmin, registerAdmin);
authRoutes.post(userRoutes.loginAdmin, loginAdmin);

export default authRoutes;

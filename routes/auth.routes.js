import { Router } from "express";
import {
  sendOtp,
  registerUser,
  login,
  registerAdmin,
  loginAdmin,
  requestPasswordReset,
  verifyOtp,
  resetPassword,
} from "../controllers/auth.controllers.js";

const router = Router();

const AUTH_ROUTES = {
  SEND_OTP: "/send-otp",
  REGISTER_USER: "/register",
  LOGIN_USER: "/login",
  REGISTER_ADMIN: "/admin/register",
  LOGIN_ADMIN: "/admin/login",
  REQUEST_PASSWORD_RESET: "/password-reset/request",
  VERIFY_OTP: "/password-reset/verify",
  RESET_PASSWORD: "/password-reset/reset",
};

router.post(AUTH_ROUTES.SEND_OTP, sendOtp);
router.post(AUTH_ROUTES.REGISTER_USER, registerUser);
router.post(AUTH_ROUTES.LOGIN_USER, login);
router.post(AUTH_ROUTES.REGISTER_ADMIN, registerAdmin);
router.post(AUTH_ROUTES.LOGIN_ADMIN, loginAdmin);
router.post(AUTH_ROUTES.REQUEST_PASSWORD_RESET, requestPasswordReset);
router.post(AUTH_ROUTES.VERIFY_OTP, verifyOtp);
router.post(AUTH_ROUTES.RESET_PASSWORD, resetPassword);

export default router;

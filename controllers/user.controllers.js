import User from "../models/user.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    console.log("user is ", existingUser);
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      email,
      otp,
      otpExpires,
      firstname: "",
      lastname: "",
      password: "",
      role: "user",
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    next(err);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.firstname = firstname;
    user.lastname = lastname;
    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    user.role = "user";

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

export const registerAdmin = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, secret } = req.body;
    if (secret !== process.env.ADMIN_SECRET) {
      return next({ status: 403, message: "Invalid secret key" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next({ status: 400, message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: "admin",
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password, secret } = req.body;
    if (!email || !password || !secret)
      return next(new Error("All fields are required"));
    if (secret !== process.env.ADMIN_SECRET)
      return next(new Error("Invalid secret key"));

    const user = await User.findOne({ email });
    if (!user) return next(new Error("Invalid credentials"));
    if (user.role !== "admin") return next(new Error("Not authorized"));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new Error("Invalid credentials"));

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
};

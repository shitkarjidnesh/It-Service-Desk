import bcrypt from "bcryptjs";

import User from "../models/User.js";
import Admin from "../models/Admin.js";
import { hashPassword } from "../utils/passwordUtils.js";
import { comparePassword } from "../utils/passwordUtils.js";

import { generateToken } from "../utils/jwt.js";

export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
  const hashpassword = await hashPassword(password);
  console.log("Hashed password:", hashpassword);

  const newAdmin = await Admin.create({
    name,
    email,
    password: hashpassword,
  });

  res.status(201).json(newAdmin);
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login request received:", { email, password });

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password 1",
      });
    }
    const isMatch = await comparePassword(password, admin.password);
    console.log(admin.password);

    console.log("Password match result:", isMatch);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password 2",
      });
    }

    const token = generateToken({
      id: admin._id,
      role: admin.role,
      email: admin.email,
    });
    console.log("Generated token:", token);
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login successful",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.json({
    message: "Logout successful",
  });
};

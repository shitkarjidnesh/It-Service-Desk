import Admin from "../models/Admin.js";
import Employee from "../models/Employee.js";
import Technician from "../models/technician.js";
import { getOTP, deleteOTP } from "../utils/otpStore.js";
import { generateToken } from "../utils/jwt.js";

import { comparePassword } from "../utils/passwordUtils.js";
import { sendOTP } from "../utils/sendOTP.js";
import { saveOTP } from "../utils/otpStore.js";

const models = {
  admin: Admin,
  employee: Employee,
  technician: Technician,
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("Login request received:", { email, password, role });
    // Check role
    const Model = models[role];

    if (!Model) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Find user
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in server memory
    console.log(`Saving OTP for ${email} (${role}): ${otp}`);
    saveOTP(email, role, otp);

    // Send OTP through email
    console.log(`Sending OTP to ${email} (${role}): ${otp}`);
    await sendOTP(email, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, role, otp } = req.body;

    // Check role
    const Model = models[role];

    if (!Model) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // Find user
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // Get OTP from memory
    const storedOTP = getOTP(email, role);

    if (!storedOTP) {
      return res.status(401).json({
        message: "OTP expired or not found",
      });
    }

    // Check OTP
    if (storedOTP.otp !== otp) {
      return res.status(401).json({
        message: "Invalid OTP",
      });
    }

    // OTP is correct → delete it
    deleteOTP(email, role);

    // Generate JWT
    const token = generateToken({
      id: user._id,
      role: role,
      email: user.email,
    });

    // Store JWT in HttpOnly cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

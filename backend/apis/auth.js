import Admin from "../models/Admin.js";
import Employee from "../models/Employee.js";
import Technician from "../models/technician.js";

import { comparePassword } from "../utils/passwordUtils.js";
import { generateToken } from "../utils/jwt.js";

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validate role
    const models = {
      admin: Admin,
      employee: Employee,
      technician: Technician,
    };

    const Model = models[role];

    if (!Model) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    // 2. Find user in the selected collection
    const user = await Model.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 3. Check password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT
    const token = generateToken({
      id: user._id,
      role: role,
      email: user.email,
    });

    // 5. Store JWT in cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // 6. Return basic user information
    res.status(200).json({
      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export default login;

import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  registerAdmin,
  loginAdmin,
  profile,
  updateProfile,
  deleteAdmin,
  // loginUser,
  // getProfile,
  // updateProfile,
  // deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", authMiddleware, profile);
router.put("/updateprofile", authMiddleware, updateProfile);
router.delete("/deleteadmin", authMiddleware, deleteAdmin);

// router.post("/login", loginUser);

// router.get("/profile", getProfile);

// router.put("/profile", updateProfile);

// router.delete("/:id", deleteUser);

export default router;

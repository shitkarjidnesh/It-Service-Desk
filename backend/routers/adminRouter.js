import express from "express";

import {
  registerAdmin,
  loginAdmin,
  // loginUser,
  // getProfile,
  // updateProfile,
  // deleteUser,
} from "../controllers/adminController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// router.post("/login", loginUser);

// router.get("/profile", getProfile);

// router.put("/profile", updateProfile);

// router.delete("/:id", deleteUser);

export default router;

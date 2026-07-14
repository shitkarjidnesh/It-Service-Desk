import express from "express";

import {
  registerUser,
  // loginUser,
  // getProfile,
  // updateProfile,
  // deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);

// router.post("/login", loginUser);

// router.get("/profile", getProfile);

// router.put("/profile", updateProfile);

// router.delete("/:id", deleteUser);

export default router;

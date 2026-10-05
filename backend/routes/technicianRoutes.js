import express from "express";

import {
  registerTechnician,
  // loginUser,
  // getProfile,
  // updateProfile,
  // deleteUser,
} from "../controllers/technicianController.js";

const router = express.Router();

router.post("/register", registerTechnician);

// router.post("/login", loginUser);

// router.get("/profile", getProfile);

// router.put("/profile", updateProfile);

// router.delete("/:id", deleteUser);

export default router;

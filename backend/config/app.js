// Middleware to parse incoming JSON payloads
import express from "express";
import userRoutes from "../routes/userRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import technicianRoutes from "../routes/technicianRoutes.js";
import authRoutes from "../routes/authRoutes.js";
import cookieParser from "cookie-parser";
import login from "../apis/auth.js";
import dotenv from "dotenv";

import { corsmiddleware } from "../middleware/corsmiddleware.js";
// import dotenv from "dotenv";
const app = express();
const PORT = 5000;
dotenv.config();

const connectApp = async () => {
  try {
    app.use(express.json());
    app.use(cookieParser());
    app.use(corsmiddleware);

    // // Simple CORS Middleware

    app.use("/api/users", userRoutes);
    app.use("/api/admins", adminRoutes);
    app.use("/api/technicians", technicianRoutes);

    app.use("/api/auth", authRoutes);

    // Simple GET route
    app.get("/api/", (req, res) => {
      res.send("Hello, World!");
      console.log(`hello world!`);
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

export default connectApp;

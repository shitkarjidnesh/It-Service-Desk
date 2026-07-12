import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = 5000;

connectDB();
// Middleware to parse incoming JSON payloads
app.use(express.json());

// Simple CORS Middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.post("/login/", (req, res) => {
  console.log("Form Data received in backend:", req.body);
  res.json({ status: "success", data: req.body });
});

// Simple GET route
app.get("/api/", (req, res) => {
  res.send("Hello, World!");
  console.log(`hello world!`);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

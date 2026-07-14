import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import connectApp from "./config/app.js";

dotenv.config();
const app = express();
const PORT = 5000;

connectDB();
connectApp();

import mongoose from "mongoose";
import Counter from "../models/Counter.js";
import User from "../models/User.js";
import Technician from "../models/Technician.js";
import Admin from "../models/Admin.js";
import Ticket from "../models/Ticket.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import ActivityLog from "../models/ActivityLog.js";
import Category from "../models/Category.js";
import Department from "../models/Department.js";
import { generateId, generateTicketId } from "../utils/idGenerator.js";

console.log("-----------------------------------------");
console.log("Import check started...");
console.log("-----------------------------------------");

const models = {
  Counter,
  User,
  Technician,
  Admin,
  Ticket,
  Comment,
  Notification,
  ActivityLog,
  Category,
  Department
};

Object.entries(models).forEach(([name, model]) => {
  if (model && model.modelName) {
    console.log(`✅ Model '${name}' parsed successfully. Mongoose model name: '${model.modelName}'`);
  } else {
    console.error(`❌ Model '${name}' failed to load correctly.`);
  }
});

console.log("-----------------------------------------");
console.log("Checking ID Generator imports...");
console.log("Type of generateId:", typeof generateId);
console.log("Type of generateTicketId:", typeof generateTicketId);

if (typeof generateId === "function" && typeof generateTicketId === "function") {
  console.log("✅ ID Generator utility imports parsed successfully.");
} else {
  console.error("❌ ID Generator utilities failed to load.");
}

console.log("-----------------------------------------");
console.log("Validation completed successfully!");
console.log("-----------------------------------------");
process.exit(0);

import mongoose from "mongoose";
import { generateId } from "../utils/idGenerator.js";

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null
  },
  designation: {
    type: String
  },
  location: {
    type: String
  },
  role: {
    type: String,
    default: "user",
    enum: ["user"]
  },
  accountStatus: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "blocked"]
  },
  profileImage: {
    type: String
  },
  notificationPreferences: {
    email: {
      type: Boolean,
      default: true
    },
    inApp: {
      type: Boolean,
      default: true
    }
  },
  lastLoginAt: {
    type: Date
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  }
}, {
  timestamps: true
});

userSchema.pre("validate", async function(next) {
  if (!this.userId) {
    try {
      this.userId = await generateId("user", "USR");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model("User", userSchema);

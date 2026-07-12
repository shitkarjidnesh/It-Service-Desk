import mongoose from "mongoose";
import { generateId } from "../utils/idGenerator.js";

const adminSchema = new mongoose.Schema({
  adminId: {
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
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "super_admin"]
  },
  permissions: [{
    type: String
  }],
  accountStatus: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "blocked"]
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
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

// Helper instance method to check if the admin is a superadmin
adminSchema.methods.isSuperAdmin = function () {
  return this.role === "super_admin";
};

adminSchema.pre("validate", async function (next) {
  if (!this.adminId) {
    try {
      this.adminId = await generateId("admin", "ADM");
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model("Admin", adminSchema);

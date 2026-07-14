import mongoose from "mongoose";
import { generateId } from "../utils/idGenerator.js";
import { hashPassword } from "../utils/passwordUtils.js";

const technicianSchema = new mongoose.Schema(
  {
    technicianId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
      index: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
    specializations: [
      {
        type: String,
      },
    ],
    assignedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    role: {
      type: String,
      default: "technician",
      enum: ["technician"],
    },
    availabilityStatus: {
      type: String,
      default: "available",
      enum: ["available", "busy", "offline", "on_leave"],
      index: true,
    },
    accountStatus: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "blocked"],
      index: true,
    },
    currentTicketCount: {
      type: Number,
      default: 0,
    },
    profileImage: {
      type: String,
    },
    lastLoginAt: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

technicianSchema.pre("validate", async function (next) {
  if (!this.technicianId) {
    try {
      this.technicianId = await generateId("technician", "TEC");
    } catch (err) {
      return next(err);
    }
  }
});

technicianSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await hashPassword(this.password);
});

export default mongoose.model("Technician", technicianSchema);

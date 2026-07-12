import mongoose from "mongoose";
import { generateTicketId } from "../utils/idGenerator.js";

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
    index: true
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true
  },
  affectedItem: {
    type: String
  },
  impact: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  urgency: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "critical"],
    default: "medium",
    index: true
  },
  status: {
    type: String,
    enum: [
      "submitted",
      "acknowledged",
      "assigned",
      "in_progress",
      "waiting_for_user",
      "on_hold",
      "resolved",
      "closed",
      "reopened",
      "cancelled"
    ],
    default: "submitted",
    index: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Technician",
    default: null,
    index: true
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null
  },
  attachments: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  location: {
    type: String
  },
  resolution: {
    summary: { type: String },
    rootCause: { type: String },
    workPerformed: { type: String },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Technician" },
    resolvedAt: { type: Date }
  },
  sla: {
    responseDueAt: { type: Date },
    resolutionDueAt: { type: Date },
    firstRespondedAt: { type: Date },
    responseBreached: { type: Boolean, default: false },
    resolutionBreached: { type: Boolean, default: false }
  },
  closedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index for assigning and status filtering
ticketSchema.index({ assignedTo: 1, status: 1 });
// Index on createdAt is also recommended
ticketSchema.index({ createdAt: -1 });

ticketSchema.pre("validate", async function(next) {
  if (!this.ticketId) {
    try {
      this.ticketId = await generateTicketId();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.model("Ticket", ticketSchema);

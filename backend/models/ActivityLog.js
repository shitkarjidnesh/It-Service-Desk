import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  actorId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "actorModel",
    default: null,
    index: true
  },
  actorRole: {
    type: String,
    required: true,
    enum: ["user", "technician", "admin", "system"]
  },
  actorModel: {
    type: String,
    enum: ["User", "Technician", "Admin"],
    default: null
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  entityType: {
    type: String,
    required: true,
    enum: ["ticket", "user", "technician", "admin", "category", "department"],
    index: true
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "entityModel",
    index: true
  },
  entityModel: {
    type: String,
    required: true,
    enum: ["Ticket", "User", "Technician", "Admin", "Category", "Department"]
  },
  description: {
    type: String,
    required: true
  },
  changes: {
    before: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    after: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for ticket/entity audit trail
activityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

export default mongoose.model("ActivityLog", activityLogSchema);

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    refPath: "recipientModel"
  },
  recipientRole: {
    type: String,
    required: true,
    enum: ["user", "technician", "admin"]
  },
  recipientModel: {
    type: String,
    required: true,
    enum: ["User", "Technician", "Admin"]
  },
  type: {
    type: String,
    required: true,
    enum: [
      "ticket_created",
      "ticket_assigned",
      "status_changed",
      "new_comment",
      "ticket_resolved",
      "ticket_reopened",
      "sla_warning",
      "sla_breached",
      "announcement"
    ]
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTicketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    default: null,
    index: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  readAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for listing notifications by recipient sorted by creation date
notificationSchema.index({ recipientId: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);

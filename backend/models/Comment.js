import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
    index: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    refPath: "authorModel"
  },
  authorRole: {
    type: String,
    required: true,
    enum: ["user", "technician", "admin"]
  },
  authorModel: {
    type: String,
    required: true,
    enum: ["User", "Technician", "Admin"]
  },
  message: {
    type: String,
    required: true
  },
  commentType: {
    type: String,
    required: true,
    enum: ["public", "internal"],
    default: "public"
  },
  attachments: [{
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for sorting comments by creation date
commentSchema.index({ createdAt: 1 });

export default mongoose.model("Comment", commentSchema);

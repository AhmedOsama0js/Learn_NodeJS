const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender is required"],
    index: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    index: true,
  },
  group: {
    type: String,
    trim: true,
    index: true,
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [1, "Content cannot be empty"],
    maxlength: [5000, "Content must not exceed 5000 characters"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
});

messageSchema.index({ receiver: 1, group: 1, timestamp: -1 });

messageSchema.pre("validate", function (next) {
  if (!this.receiver && !this.group) {
    return next(
      new Error("Each message must have either a receiver or a group")
    );
  }
  if (this.receiver && this.group) {
    return next(new Error("A message cannot have both a receiver and a group"));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;

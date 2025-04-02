const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required ⚠️"],
      trim: true,
      minlength: [3, "Name should be at least 3 characters ⚠️"],
    },
    email: {
      type: String,
      required: [true, "Email is required ⚠️"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required ⚠️"],
      minlength: [6, "Password should be at least 6 characters ⚠️ "],
    },
    age: { type: Number, default: 18 },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

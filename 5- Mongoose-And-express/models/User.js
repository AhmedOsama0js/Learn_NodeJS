const mongoose = require("mongoose");

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
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

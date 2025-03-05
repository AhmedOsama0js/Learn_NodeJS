const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required ⚠️"],
      trim: true,
      minlength: [3, "Name should be at least 3 characters ⚠️"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required ⚠️"],
      trim: true,
      minlength: [3, "Name should be at least 3 characters ⚠️"],
    },
    price: {
      type: Number,
      required: [true, "Price is required ⚠️"],
      min: [0, "Price cannot be negative ⚠️"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required ⚠️"],
    },
    image: {
      type: String,
      required: false,
    },
    stock: {
      type: Number,
      required: [true, "Stock is required ⚠️"],
      min: [0, "Stock cannot be negative ⚠️"],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

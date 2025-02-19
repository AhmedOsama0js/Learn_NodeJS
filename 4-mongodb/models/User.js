const mongoose = require("mongoose");


const userSchema  = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, default: 18 },
}, { timestamps: true });


const User = mongoose.model("User", userSchema);

module.exports = User;
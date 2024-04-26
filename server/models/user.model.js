const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;

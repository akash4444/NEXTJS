import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  active: { type: String, default: true },
});

export const UserModel =
  mongoose.models.users || mongoose.model("users", userModel);

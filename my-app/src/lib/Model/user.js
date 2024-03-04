import mongoose from "mongoose";

const userModel = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
  active: Boolean,
});

export const UserModel =
  mongoose.models.users || mongoose.model("users", userModel);

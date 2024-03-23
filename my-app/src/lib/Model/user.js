import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    houseNo: {
      type: String,
      required: true,
    },
    streetLine: {
      type: String,
      required: true,
    },
    pinCode: {
      type: Number,
      required: true,
      default: 0,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    primary: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    active: { type: Boolean, default: true },
    otp: { type: String, default: "" },
    otpExpiresAt: {
      type: Date,
    },
    address: [addressSchema],
  },
  {
    timestamps: true,
  }
);

export const UserModel =
  mongoose.models.users || mongoose.model("users", userModel);

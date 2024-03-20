import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    status: { type: String, required: true, default: "ordered" },
    items: { type: String, default: [] },
  },
  {
    timestamps: true,
  }
);

const ordersModel = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    orders: [orderSchema],
  },
  {
    timestamps: true,
  }
);

export const OrdersModel =
  mongoose.models.orders || mongoose.model("orders", ordersModel);

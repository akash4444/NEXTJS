import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    productName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    image: { type: String, default: "default.png" },
  },
  {
    timestamps: true,
  }
);

const cartModel = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    items: [itemSchema],
  },
  {
    timestamps: true,
  }
);

export const CartModel =
  mongoose.models.carts || mongoose.model("carts", cartModel);

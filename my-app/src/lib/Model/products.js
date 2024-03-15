import mongoose from "mongoose";

const productsModel = new mongoose.Schema(
  {
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

export const ProductsModel =
  mongoose.models.products || mongoose.model("products", productsModel);

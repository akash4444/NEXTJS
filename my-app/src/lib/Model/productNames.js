import mongoose from "mongoose";

const productNamesModel = new mongoose.Schema({
  category: { type: String, required: true, unique: true },
  items: { type: Array, required: true },
  disabled: { type: Boolean, default: false },
});

export const ProductNamesModel =
  mongoose.models.productnames ||
  mongoose.model("productnames", productNamesModel);

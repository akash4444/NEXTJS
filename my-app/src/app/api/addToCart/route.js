import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { CartModel } from "@/lib/Model/cart";

DBConnect();

export async function POST(request) {
  const payload = await request.json();

  const { userId, _id: productId, ...rest } = payload;

  try {
    const cart = await CartModel.findOne({ userId: userId });

    if (!cart) {
      await CartModel.findOneAndUpdate(
        { userId },
        { $push: { items: { ...rest, productId: productId } } }, // Push new item to the items array
        { new: true, upsert: true }
      );
    } else {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );
      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        cart.items[existingItemIndex].quantity =
          cart.items[existingItemIndex].quantity + rest.quantity;
        await cart.save();
      } else {
        // If the item doesn't exist, add it to the cart
        cart.items.push({ ...rest, productId: productId });
        await cart.save();
      }
    }

    return NextResponse.json(
      { message: "Product added in cart successfully.", status: 200 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

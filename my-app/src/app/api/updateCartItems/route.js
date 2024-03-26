import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { CartModel } from "@/lib/Model/cart";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";

DBConnect();

const apiHandler = async (request) => {
  const payload = await request.json();

  const { userId, productId, type } = payload;

  try {
    const cart = await CartModel.findOne({ userId: userId });

    if (type === "add") {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );
      if (existingItemIndex !== -1) {
        // If the item exists, update its quantity
        cart.items[existingItemIndex].quantity =
          cart.items[existingItemIndex].quantity + 1;
        await cart.save();
      }
    } else if (type === "minus") {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      const isLastQuantityItem = cart.items[existingItemIndex].quantity === 1;
      if (isLastQuantityItem) {
        cart.items.splice(existingItemIndex, 1);
        await cart.save();
      } else {
        cart.items[existingItemIndex].quantity =
          cart.items[existingItemIndex].quantity - 1;
        await cart.save();
      }
    } else if (type === "remove") {
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );
      if (existingItemIndex !== -1) {
        cart.items.splice(existingItemIndex, 1);
        await cart.save();
      }
    }

    return NextResponse.json(
      {
        message: `Product ${
          type === "add" ? "added" : "removed"
        } in cart successfully.`,
        status: 200,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
};
// Export the handler function for POST method
export async function POST(request) {
  // Apply verifyTokenMiddleware to the productsHandler
  const verifiedHandler = verifyTokenMiddleware(apiHandler);

  // Call the verified handler with the request
  return verifiedHandler(request);
}

import { NextResponse } from "next/server";
import { CartModel } from "@/lib/Model/cart";
import { DBConnect } from "../dbconnect";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";

DBConnect();
const apiHandler = async (request) => {
  const payload = await request.json();
  try {
    const cartItems = await CartModel.find({ userId: payload.userId });

    if (!cartItems || cartItems?.length === 0) {
      return NextResponse.json(
        { message: "success", status: 200, cartItems: {} },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "success", status: 200, cartItems: cartItems[0] },
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

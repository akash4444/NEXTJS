import { NextResponse } from "next/server";
import { CartModel } from "@/lib/Model/cart";
import { DBConnect } from "../dbconnect";

DBConnect();
export async function POST(request) {
  const payload = await request.json();
  try {
    const cartItems = await CartModel.find({ userId: payload.userId });

    if (!cartItems || cartItems?.length === 0) {
      return NextResponse.json(
        { message: "success", status: 404, cartItems: {} },
        { status: 404 }
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
}

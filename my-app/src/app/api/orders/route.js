import { NextResponse } from "next/server";
import { OrdersModel } from "@/lib/Model/orders";
import { DBConnect } from "../dbconnect";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";

DBConnect();
const apiHandler = async (request) => {
  const payload = await request.json();
  try {
    const orderItems = await OrdersModel.find({ userId: payload.userId });

    if (!orderItems || orderItems?.length === 0) {
      return NextResponse.json(
        { message: "success", status: 200, orderItems: {} },
        { status: 200 }
      );
    }

    const orders = orderItems[0].orders;
    const sortedOrders = orders.sort((a, b) => b.createdAt - a.createdAt);
    orderItems[0].orders = sortedOrders;
    return NextResponse.json(
      { message: "success", status: 200, orderItems: orderItems[0] },
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

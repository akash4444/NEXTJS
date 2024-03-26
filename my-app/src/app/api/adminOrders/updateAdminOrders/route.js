import { NextResponse } from "next/server";
import { DBConnect } from "../../dbconnect";
import { OrdersModel } from "@/lib/Model/orders";
import { verifyTokenMiddleware } from "../../ApiCommonUtil/index";

DBConnect();

const apiHandler = async (request) => {
  const payload = await request.json();

  const { userId, type, orderId } = payload;

  try {
    const order = await OrdersModel.findOne({ userId: userId });

    if (type === "delivered") {
      if (order) {
        const fIndex = order.orders.findIndex(
          (ord) => ord._id.toString() === orderId
        );

        if (fIndex > -1) {
          if (order.orders[fIndex].status !== "ordered") {
            return NextResponse.json(
              {
                message: `Order already ${order.orders[fIndex].status}`,
                status: 200,
                type,
                showAlert: true,
              },
              { status: 200 }
            );
          }
          order.orders[fIndex].status = type;
          await order.save();
        }
      }
    }

    return NextResponse.json(
      {
        message: `Order delivered successfully.`,
        status: 200,
        type,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500, type },
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

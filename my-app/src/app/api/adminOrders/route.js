import { NextResponse } from "next/server";
import { OrdersModel } from "@/lib/Model/orders";
import { DBConnect } from "../dbconnect";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";

DBConnect();
const apiHandler = async (request) => {
  const payload = await request.json();
  try {
    const orderItems = await OrdersModel.find({});

    if (!orderItems || orderItems?.length === 0) {
      return NextResponse.json(
        { message: "success", status: 200, orderItems: {} },
        { status: 200 }
      );
    }

    let finalOrders = [];
    orderItems.forEach((userOrders) => {
      const a = userOrders.orders.reduce((main, current) => {
        return [
          ...main,
          {
            orderId: current._id,
            status: current.status,
            userId: userOrders.userId,
            createdAt: current.createdAt,
          },
        ];
      }, []);
      finalOrders = [...finalOrders, ...a];
    });
    const sortedOrders = finalOrders.sort((a, b) => {
      const statusOrder = { ordered: 0, delivered: 1, cancelled: 2 }; // Define order of statuses

      // Compare statuses based on their order
      if (statusOrder[a.status] < statusOrder[b.status]) {
        return -1; // Put a before b
      } else if (statusOrder[a.status] > statusOrder[b.status]) {
        return 1; // Put b before a
      } else {
        return 0; // Preserve original order if statuses are the same
      }
    });

    return NextResponse.json(
      { message: "success", status: 200, adminOrderItems: sortedOrders },
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

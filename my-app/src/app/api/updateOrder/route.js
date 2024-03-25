import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { OrdersModel } from "@/lib/Model/orders";

DBConnect();

export async function POST(request) {
  const payload = await request.json();

  const { userId, items = [], type, orderId, deliveryAddress } = payload;

  try {
    const order = await OrdersModel.findOne({ userId: userId });

    let createdOrderId = "";
    if (type === "ordered") {
      if (!order) {
        const odr = await OrdersModel.create({
          userId: userId,
          orders: [
            { items: items, status: type, deliveryAddress: deliveryAddress },
          ],
        });
        const res = await odr.save();
        createdOrderId = res.orders[res.orders.length - 1]._id;
      } else {
        order.orders.push({
          items: items,
          status: type,
          deliveryAddress: deliveryAddress,
        });
        const res = await order.save();
        createdOrderId = res.orders[res.orders.length - 1]._id;
      }
    } else if (type === "cancelled") {
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

    return NextResponse.json(
      {
        message: `${
          type === "ordered" ? "Ordered" : "Order cancelled"
        } successfully.`,
        status: 200,
        type,
        orderedId: createdOrderId,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500, type },
      { status: 500 }
    );
  }
}

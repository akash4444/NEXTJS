import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { OrdersModel } from "@/lib/Model/orders";

DBConnect();

export async function POST(request) {
  const payload = await request.json();

  const { userId, items = [], type, orderId } = payload;

  try {
    const order = await OrdersModel.findOne({ userId: userId });

    if (type === "ordered") {
      if (!order) {
        const odr = await OrdersModel.create({
          userId: userId,
          orders: [{ items: items, status: type }],
        });
        await odr.save();
      } else {
        order.orders.push({ items: items, status: type });
        await order.save();
      }
    } else if (type === "cancelled") {
      const fIndex = order.orders.findIndex(
        (ord) => ord._id.toString() === orderId
      );

      if (fIndex > -1) {
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

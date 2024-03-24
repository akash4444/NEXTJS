import { NextResponse } from "next/server";
import { OrdersModel } from "@/lib/Model/orders";

export async function GET(request) {
  const pinCode = content.params.pincode;
  try {
    const response = await fetch(
      `http://www.postalpincode.in/api/pincode/${pinCode}`
    );
    const data = await response.json();
    return NextResponse.json(
      { message: "success", status: 200, d: data },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

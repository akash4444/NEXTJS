import { NextResponse } from "next/server";
import { OrdersModel } from "@/lib/Model/orders";

const apiHandler = async (request, content) => {
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
};
export async function GET(request, content) {
  // Apply verifyTokenMiddleware to the productsHandler
  const verifiedHandler = verifyTokenMiddleware(apiHandler);

  // Call the verified handler with the request
  return verifiedHandler(request, content);
}

import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { CartModel } from "@/lib/Model/cart";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";

DBConnect();

const apiHandler = async (request) => {
  const payload = await request.json();

  const { userId } = payload;

  try {
    const deletedData = await CartModel.findOneAndDelete({ userId });

    if (!deletedData) {
      return NextResponse.json(
        {
          message: `No data found`,
          status: 200,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: `The cart has been successfully cleared.`,
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

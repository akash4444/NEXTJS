import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { ProductsModel } from "@/lib/Model/products";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";

DBConnect();

const apiHandler = async (request) => {
  const payload = await request.json();

  try {
    let product = await ProductsModel.create({
      ...payload,
      image: `${payload.productName.toLowerCase()}.png`,
    });

    const results = await product.save();

    return NextResponse.json(
      { message: "Product added successfully.", status: 200 },
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

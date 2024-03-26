import { NextResponse } from "next/server";
import { DBConnect } from "../../dbconnect";
import { ProductsModel } from "@/lib/Model/products";
import { verifyTokenMiddleware } from "../../ApiCommonUtil/index";

DBConnect();

const apiHandler = async (request, content) => {
  const productId = content.params.productId;

  try {
    const product = await ProductsModel.findOne({ _id: productId });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found", status: 404, product },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "success", status: 200, product },
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

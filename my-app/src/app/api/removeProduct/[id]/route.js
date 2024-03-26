import { NextResponse } from "next/server";
import { DBConnect } from "../../dbconnect";
import { ProductsModel } from "@/lib/Model/products";
import { verifyTokenMiddleware } from "../../ApiCommonUtil/index";

DBConnect();

const apiHandler = async (request, content) => {
  const productId = content.params.id;

  try {
    const results = await ProductsModel.findByIdAndDelete(productId);

    return NextResponse.json(
      { message: "Product Deleted successfully.", status: 200, results },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
};

export async function DELETE(request, content) {
  // Apply verifyTokenMiddleware to the productsHandler
  const verifiedHandler = verifyTokenMiddleware(apiHandler);

  // Call the verified handler with the request
  return verifiedHandler(request, content);
}

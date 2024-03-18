import { NextResponse } from "next/server";
import { DBConnect } from "../../dbconnect";
import { ProductsModel } from "@/lib/Model/products";

DBConnect();

export async function GET(request, content) {
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
}

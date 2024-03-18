import { NextResponse } from "next/server";
import { DBConnect } from "../../dbconnect";
import { ProductsModel } from "@/lib/Model/products";

DBConnect();

export async function PUT(request, content) {
  const productId = content.params.productId;
  const payload = await request.json();

  try {
    const product = await ProductsModel.findOne({ _id: productId });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found", status: 404, product },
        { status: 404 }
      );
    }
    product.price = payload.price;
    product.category = payload.category;
    product.productName = payload.productName;
    product.description = payload.description;

    const results = await product.save();

    return NextResponse.json(
      { message: "Product updated successfully", status: 200, results },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

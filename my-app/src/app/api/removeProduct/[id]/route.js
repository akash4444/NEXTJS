import { NextResponse } from "next/server";
import { DBConnect } from "../../dbconnect";
import { ProductsModel } from "@/lib/Model/products";

DBConnect();

export async function DELETE(request, content) {
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
}

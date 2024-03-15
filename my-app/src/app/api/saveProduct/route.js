import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { ProductsModel } from "@/lib/Model/products";

DBConnect();

export async function POST(request) {
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
}

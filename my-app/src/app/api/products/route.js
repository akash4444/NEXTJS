import { NextResponse } from "next/server";
import { ProductsModel } from "@/lib/Model/products";
import { DBConnect } from "../dbconnect";

DBConnect();
export async function POST(request) {
  const payload = await request.json();
  try {
    const products = await ProductsModel.find({});

    return NextResponse.json(
      { message: "success", status: 200, products },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

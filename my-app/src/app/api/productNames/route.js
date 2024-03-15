import { NextResponse } from "next/server";
import { ProductNamesModel } from "@/lib/Model/productNames";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../dbconnect";

DBConnect();
export async function POST(request) {
  const payload = await request.json();
  try {
    const productNames = await ProductNamesModel.find({
      disabled: false,
    });

    return NextResponse.json(
      { message: "success", status: 200, productNames },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

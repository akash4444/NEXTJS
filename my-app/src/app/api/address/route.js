import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../dbconnect";

DBConnect();
export async function POST(request) {
  const payload = await request.json();

  const { userId } = payload;

  try {
    const user = await UserModel.findOne({ email: userId });
    if (user) {
      const address = user.address;
      return NextResponse.json(
        { message: "success", status: 200, address: address },
        { status: 200 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

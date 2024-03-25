import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../../dbconnect";

DBConnect();
export async function POST(request) {
  const payload = await request.json();
  const { userId, ...rest } = payload;
  try {
    const user = await UserModel.findOne({ email: userId });

    if (user) {
      user.address.push({ ...rest });
      await user.save();
    }
    return NextResponse.json(
      { message: "Address added successfully.", status: 200 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

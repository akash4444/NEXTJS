import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../dbconnect";

DBConnect();
export async function POST(request) {
  const payload = await request.json();

  const { email, password, mobileNumber, firstName, lastName } = payload;

  try {
    const isUserPresent = await UserModel.findOne({ email: payload.email });
    if (isUserPresent) {
      return NextResponse.json(
        { message: "User already exists.", status: 409 },
        { status: 409 }
      );
    } else {
      let user = await UserModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        mobileNumber: mobileNumber,
        address: [],
        active: true,
        role: "user",
      });
      const results = await user.save();
      return NextResponse.json(
        { message: "User added successfully.", status: 200 },
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

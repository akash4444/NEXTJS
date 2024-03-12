import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectURI } from "../../../lib/mongodb";
import { UserModel } from "@/lib/Model/user";

export async function GET() {
  await mongoose.connect(connectURI);

  return NextResponse.json({ ak: true });
}

export async function POST(request) {
  const payload = await request.json();
  await mongoose.connect(connectURI);

  try {
    const isUserPresent = await UserModel.findOne({ email: payload.email });
    if (isUserPresent) {
      return NextResponse.json(
        { message: "User already exists.", status: 409 },
        { status: 409 }
      );
    } else {
      let user = await UserModel.create({
        ...payload,
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

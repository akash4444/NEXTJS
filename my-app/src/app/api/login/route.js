import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../dbconnect";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

DBConnect();
export async function POST(request) {
  const payload = await request.json();

  const { email, password } = payload;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials", status: 400 },
        { status: 400 }
      );
    } else {
      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { message: "Invalid credentials", status: 400 },
          { status: 400 }
        );
      }

      const accessToken = jwt.sign({ userId: user._id }, "accessSecret", {
        expiresIn: "15m",
      });

      const refreshToken = jwt.sign({ userId: user._id }, "refreshSecret");
      user.refreshToken = refreshToken;

      const results = await user.save();

      return NextResponse.json(
        {
          message: "Logged in successfully.",
          status: 200,
          accessToken,
          refreshToken,
        },
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

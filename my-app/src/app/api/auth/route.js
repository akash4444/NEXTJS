import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../dbconnect";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { secretJWTKey } from "@/config";

DBConnect();

export async function POST(request) {
  const payload = await request.json();
  const { email, password } = payload;

  try {
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials", status: 409 },
        { status: 409 }
      );
    }

    const isValidPassword = await bcryptjs.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Invalid credentials", status: 409 },
        { status: 409 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secretJWTKey, {
      expiresIn: "1h", // Expires in 1 hour
    });

    // Set token as an HTTP-only cookie
    const cookieToken = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set 'secure' to true in production
      sameSite: "strict", // Adjust SameSite policy as needed
      maxAge: 3600, // 1 hour (in seconds)
      path: "/", // Set cookie path as needed
    });

    // Return response with cookie set
    return NextResponse.json(
      { message: "success", status: 200, role: user.role },
      {
        status: 200,
        headers: {
          "Set-Cookie": cookieToken,
          "Content-Type": "application/json", // Ensure content type is set
        },
      }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

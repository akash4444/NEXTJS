import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../../dbconnect";
import bcryptjs from "bcryptjs";
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";

DBConnect();

export async function GET(request) {
  try {
    const cookieToken = serialize("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set 'secure' to true in production
      sameSite: "strict", // Adjust SameSite policy as needed
      maxAge: -1, // Expire the cookie immediately
      path: "/", // Set cookie path as needed
    });

    // Return response with cookie cleared
    return NextResponse.json(
      { message: "Logout successful", status: 200 },
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

import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../../dbconnect";
import bcryptjs from "bcryptjs";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { secretJWTKey } from "@/config";

DBConnect();

export async function GET(request) {
  const cookieStore = cookies();
  const cookie = cookieStore.get("token") || {};
  const token = cookie.value || "";
  try {
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }
    const decoded = verify(token, secretJWTKey);
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    if (decoded.exp > currentTime) {
      return NextResponse.json(
        { message: "Authenticated", status: 200 },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Unauthorized", status: 401 },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

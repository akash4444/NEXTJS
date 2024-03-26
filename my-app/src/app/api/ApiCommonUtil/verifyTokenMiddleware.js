// lib/middleware.js
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { secretJWTKey } from "@/config";

export const verifyTokenMiddleware = (handler) => async (req, res) => {
  const cookieToken = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set 'secure' to true in production
    sameSite: "strict", // Adjust SameSite policy as needed
    maxAge: -1, // Expire the cookie immediately
    path: "/", // Set cookie path as needed
  });

  try {
    // Parse cookies from the incoming request
    const cookieStore = cookies();
    const cookie = cookieStore.get("token") || {};
    const token = cookie.value || "";

    // Return response with cookie cleared

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized", status: 401 },
        {
          status: 401,
          headers: {
            "Set-Cookie": cookieToken,
            "Content-Type": "application/json", // Ensure content type is set
          },
        }
      );
    }

    // Verify the token
    const decoded = verify(token, secretJWTKey);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      return NextResponse.json(
        { message: "Unauthorized", status: 401 },
        {
          status: 401,
          headers: {
            "Set-Cookie": cookieToken,
            "Content-Type": "application/json", // Ensure content type is set
          },
        }
      );
    }

    // Call the API route handler if token is valid
    return handler(req, res);
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { message: "Unauthorized", status: 401 },
      {
        status: 401,
        headers: {
          "Set-Cookie": cookieToken,
          "Content-Type": "application/json", // Ensure content type is set
        },
      }
    );
  }
};

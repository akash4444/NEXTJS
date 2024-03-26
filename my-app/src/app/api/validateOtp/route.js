// pages/api/sendOTP.js

import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { UserModel } from "@/lib/Model/user";
import OTPGenerator from "otp-generator";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";

DBConnect();
const apiHandler = async (request) => {
  const payload = await request.json();

  try {
    const { email, otp: enteredOtp } = payload;
    const user = await UserModel.findOne({ email: email });

    if (!user || user.otp !== enteredOtp) {
      return NextResponse.json(
        { message: "Invalid OTP.", status: 404 },
        { status: 404 }
      );
    }

    const currentTime = new Date();
    const otpExpiry = new Date(user.otpExpiresAt);
    if (otpExpiry < currentTime) {
      return NextResponse.json(
        { message: "OTP has expired.", status: 404 },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Otp is Valid", status: 200 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
};
// Export the handler function for POST method
export async function POST(request) {
  // Apply verifyTokenMiddleware to the productsHandler
  // const verifiedHandler = verifyTokenMiddleware(apiHandler);

  // Call the verified handler with the request
  return apiHandler(request);
}

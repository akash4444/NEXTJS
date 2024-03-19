// pages/api/sendOTP.js

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { DBConnect } from "../dbconnect";
import { UserModel } from "@/lib/Model/user";
import OTPGenerator from "otp-generator";

DBConnect();
export async function POST(request) {
  const payload = await request.json();

  try {
    const { email } = payload;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        { message: "Your email is not registered.", status: 404 },
        { status: 404 }
      );
    }
    const otp = OTPGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    const currentTime = Date.now();
    const expDate = currentTime + 5 * 60 * 1000;

    await UserModel.findOneAndUpdate(
      { email: payload.email },
      { otp, otpExpiresAt: expDate }
    );

    return NextResponse.json(
      { message: "Otp sent successfully on your email id", status: 200 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}

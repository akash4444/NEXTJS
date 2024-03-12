import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectURI } from "@/lib/mongodb";
import { UserModel } from "@/lib/Model/user";

export async function DBConnect() {
  try {
    await mongoose.connect(connectURI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

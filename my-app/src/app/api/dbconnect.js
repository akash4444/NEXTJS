import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { UserModel } from "@/lib/Model/user";

const connectURI = process.env.MONGO_URI;

export async function DBConnect() {
  try {
    await mongoose.connect(connectURI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

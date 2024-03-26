import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../dbconnect";
import { verifyTokenMiddleware } from "../ApiCommonUtil/index";
DBConnect();
const apiHandler = async (request) => {
  const payload = await request.json();

  try {
    const user = await UserModel.findOne({ email: payload.email });

    user.password = payload.password;
    const results = await user.save();
    return NextResponse.json(
      { message: "Password Updated successfully.", status: 200 },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Something went wrong.", status: 500 },
      { status: 500 }
    );
  }
}; // Export the handler function for POST method
export async function POST(request) {
  // Apply verifyTokenMiddleware to the productsHandler
  // const verifiedHandler = verifyTokenMiddleware(apiHandler);

  // Call the verified handler with the request
  return apiHandler(request);
}

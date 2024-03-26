import { NextResponse } from "next/server";
import { UserModel } from "@/lib/Model/user";
import { DBConnect } from "../../dbconnect";
import { verifyTokenMiddleware } from "../../ApiCommonUtil/index";

DBConnect();
const apiHandler = async (request) => {
  const payload = await request.json();

  const { userId, ...rest } = payload;

  try {
    const user = await UserModel.findOne({ email: userId });
    if (user) {
      const fIndex = user.address.findIndex(
        (adr) => adr._id.toString() === rest._id
      );

      if (fIndex > -1) {
        user.address[fIndex].firstName = rest.firstName;
        user.address[fIndex].lastName = rest.lastName;
        user.address[fIndex].mobileNumber = rest.mobileNumber;
        user.address[fIndex].pinCode = rest.pinCode;
        user.address[fIndex].state = rest.state;
        user.address[fIndex].city = rest.city;
        user.address[fIndex].locality = rest.locality;
        user.address[fIndex].address = rest.address;

        await user.save();
      }
      return NextResponse.json(
        { message: "Address edited succussfully.", status: 200 },
        { status: 200 }
      );
    }
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
  const verifiedHandler = verifyTokenMiddleware(apiHandler);

  // Call the verified handler with the request
  return verifiedHandler(request);
}

import { NextResponse } from "next/server";

const loggedOutPages = ["/login", "/register", "/home", "/forgotPassword"];

const loggedInPages = ["/home", "/products", "/addproducts", "/editProduct"];

export async function middleware(request) {
  // const session = await getSession(request);

  const { value: session } =
    request.cookies.get("next-auth.session-token") || {};
  const path = request.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.next();
  }
  if (path.includes("/images")) {
    return NextResponse.next();
  }

  if (!session) {
    if (loggedOutPages.includes(path) && path === "/login") {
      return NextResponse.next();
    } else if (loggedOutPages.includes(path)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    if (loggedInPages.includes(path) || path.startsWith("/editProduct/")) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/products", request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

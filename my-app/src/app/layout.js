import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./CommonComponents/Navbar";
const inter = Inter({ subsets: ["latin"] });
import { Providers } from "./redux/Providers";
import AuthGuard from "./CommonComponents/Auth/AuthGaurd";

export const metadata = {
  title: "FreshFareShop",
  description: "Fresh Fare Shop",
};

export default function RootLayout({ children, ...rest }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Providers>
          <AuthGuard>
            <Navbar />
            <div className="px-2 py-24 md:p-24 bg-gray-100">{children}</div>
            <footer className="bg-gray-800 text-white fixed bottom-0 w-full z-999999">
              <div className="container mx-auto px-4 py-3">
                <p>
                  &copy; {new Date().getFullYear()} FreshFareShop. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}

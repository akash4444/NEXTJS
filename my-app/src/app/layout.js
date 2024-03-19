import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./CommonComponents/Navbar";
const inter = Inter({ subsets: ["latin"] });
import { Providers } from "./redux/Providers";
import AuthGuard from "./CommonComponents/Auth/AuthGaurd";
import { getServerSession } from "next-auth";
import SessionProvider from "../app/api/SessionProvider";

export const metadata = {
  title: "FreshFareShop",
  description: "Fresh Fare Shop",
};

export default function RootLayout({ children, ...rest }) {
  const getServerSes = async () => {
    return await getServerSession();
  };
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={getServerSes()}>
          <Providers>
            <AuthGuard>
              <Navbar />
              <div className="p-24 bg-gradient-to-r from-purple-500 to-pink-500">
                {children}
              </div>
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
        </SessionProvider>
      </body>
    </html>
  );
}

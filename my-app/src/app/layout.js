import { Inter } from "next/font/google";
import "./globals.css";
import "./style.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "Akash Kale",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/mainn.css" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

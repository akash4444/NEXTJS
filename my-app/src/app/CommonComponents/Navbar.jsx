"use client";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-gray-800 py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div></div>
        <ul className="flex space-x-4">
          <li>
            <Link className="text-white hover:text-gray-300" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300" href="/products">
              Products
            </Link>
          </li>
          <li>
            <Link
              className="text-white hover:text-gray-300"
              href="/products/add"
            >
              Add Product
            </Link>
          </li>
          <li>
            <Link className="text-white hover:text-gray-300" href="/login">
              Login
            </Link>
            <span className="text-white">{` / `}</span>
            <Link className="text-white hover:text-gray-300" href="/register">
              Register
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

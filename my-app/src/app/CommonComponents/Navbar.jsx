"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AlertModal from "./AlertModal";
import { loggedOut } from "../commonFunctions/commonFunctions";
import { useRouter } from "next/navigation";
import CartIcon from "./CartIcon";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth || {});
  const { items = [] } = useSelector((state) => state.cart || {});

  const isAdmin = role === "admin";

  const [logoutModal, setLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logoutProcess = async () => {
    setLoading(true);
    await loggedOut(dispatch, {});
    setLogoutModal(false);
    setLoading(false);
    router.push("/login");
  };

  return (
    <div>
      <nav className="bg-gray-800 text-white fixed top-0 w-full py-4 z-10">
        {logoutModal && (
          <AlertModal
            open={logoutModal}
            yesbtn="Yes, I'm sure"
            nobtn="No, cancel"
            message="Are you sure you want to sign out ?"
            closeButton={() => setLogoutModal(false)}
            submitButton={() => logoutProcess()}
            loading={loading}
            setLoading={setLoading}
            loadingMsg="Please wait, Logging out in progress..."
          />
        )}
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="h-8 mr-2" />
            <span className="text-white text-lg font-semibold">
              Fresh Fare Shop
            </span>
          </div>

          <ul className="hidden md:flex space-x-4">
            <li>
              <Link className="text-white hover:text-gray-300" href="/">
                Home
              </Link>
            </li>
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    className="text-white hover:text-gray-300"
                    href="/products"
                  >
                    Products
                  </Link>
                </li>
                {isAdmin && (
                  <>
                    <li>
                      <Link
                        className="text-white hover:text-gray-300"
                        href="/addproducts"
                      >
                        Add Product
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-white hover:text-gray-300"
                        href="/adminOrders"
                      >
                        Admin Orders
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link
                    className="text-white hover:text-gray-300"
                    href="/orders"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link className="text-white hover:text-gray-300" href="/cart">
                    <CartIcon count={items.length} />
                  </Link>
                </li>
              </>
            )}
            {!isLoggedIn ? (
              <li>
                <Link className="text-white hover:text-gray-300" href="/login">
                  Login
                </Link>
                <span className="text-white">{` / `}</span>
                <Link
                  className="text-white hover:text-gray-300"
                  href="/register"
                >
                  Register
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  className="text-white hover:text-gray-300"
                  onClick={() => setLogoutModal(true)}
                  href="#"
                >
                  Logout
                </Link>
              </li>
            )}
          </ul>

          <ul
            className={`${
              !isMenuOpen ? "flex items-center justify-between gap-4" : "hidden"
            } md:hidden`}
          >
            {!isLoggedIn ? (
              <li>
                <Link className="text-white hover:text-gray-300" href="/login">
                  Login
                </Link>
                <span className="text-white">{` / `}</span>
                <Link
                  className="text-white hover:text-gray-300"
                  href="/register"
                >
                  Register
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link className="text-white hover:text-gray-300" href="/cart">
                    <CartIcon count={items.length} />
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:text-gray-300"
                    onClick={() => setLogoutModal(true)}
                    href="#"
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden`}>
            <div className="text-sm">
              <ul onClick={toggleMenu}>
                <li>
                  <Link
                    className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                {isLoggedIn && (
                  <>
                    <li>
                      <Link
                        className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                        href="/products"
                      >
                        Products
                      </Link>
                    </li>
                    {isAdmin && (
                      <>
                        <li>
                          <Link
                            className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                            href="/addproducts"
                          >
                            Add Product
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                            href="/adminOrders"
                          >
                            Admin Orders
                          </Link>
                        </li>
                      </>
                    )}
                    <li>
                      <Link
                        className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                        href="/orders"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                        href="/cart"
                      >
                        Cart
                      </Link>
                    </li>
                  </>
                )}
                {!isLoggedIn ? (
                  <>
                    <li>
                      <Link
                        className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                        href="/login"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                        href="/register"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      className="text-white hover:text-gray-300 px-3 py-2 rounded-md block"
                      onClick={() => setLogoutModal(true)}
                      href="#"
                    >
                      Logout
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="flex md:hidden">
            {/* Mobile Menu Button */}
            <button
              className="text-white focus:outline-none"
              onClick={toggleMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

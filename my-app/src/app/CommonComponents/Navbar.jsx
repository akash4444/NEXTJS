"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AlertModal from "./AlertModal";
import { resetAuth } from "../redux/auth/authSlice";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId } = useSelector((state) => state.auth || {});

  const [logoutModal, setLogoutModal] = useState(false);

  const logoutProcess = () => {
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("userId");
    dispatch(resetAuth());
    setLogoutModal(false);
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 py-4">
      {logoutModal && (
        <AlertModal
          open={logoutModal}
          yesbtn="Yes, I'm sure"
          nobtn="No, cancel"
          message="Are you sure you want to sign out ?"
          closeButton={() => setLogoutModal(false)}
          submitButton={() => logoutProcess()}
        />
      )}
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div></div>
        <ul className="flex space-x-4">
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
              <li>
                <Link
                  className="text-white hover:text-gray-300"
                  href="/products/add"
                >
                  Add Product
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
              <Link className="text-white hover:text-gray-300" href="/register">
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
      </div>
    </nav>
  );
};

export default Navbar;

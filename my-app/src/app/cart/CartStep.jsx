"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../redux/cart/cart";
import { useRouter } from "next/navigation";
import ImageSection from "./ImageSection";
import {
  updateCartItems,
  getCartItems,
  updateOrder,
  clearCartItems,
} from "../commonFunctions/commonFunctions";
import { LoadingSpinner, AlertModal } from "../CommonComponents";

const CartStep = ({
  items,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth || {});

  const isAdmin = role === "admin";

  const [placingOrder, setPlacingOrder] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);
  const [orderedModal, setOrderedModal] = useState(false);

  const [loadingCart, setLoadingCart] = useState(false);

  // Calculate subtotal for each product
  const productSubtotals = items.map((item) => item.price * item.quantity);

  // Calculate total bill
  const totalBill = productSubtotals.reduce(
    (acc, subtotal) => acc + subtotal,
    0
  );

  return (
    <div>
      {items.length === 0 && (
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            No items available in your cart.
          </p>
        </div>
      )}
      {items.length > 0 && (
        <div className="border rounded-md p-4 mb-4 md:w-100 lg:w-3/4 mx-auto bg-white">
          <>
            {items.map((item) => (
              <div
                key={item._id}
                className="flex items-center border-b border-gray-200 py-4"
              >
                <ImageSection
                  image={item.image}
                  productName={item.productName}
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.productName}</h2>
                  <p className="text-gray-600">Price: ${item.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l-md"
                      onClick={() => decrementQuantity(item)}
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r-md"
                      onClick={() => incrementQuantity(item)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-gray-600 mb-2">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    className="text-red-500"
                    onClick={() => removeFromCart(item)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-2">
              <span>Total Amount:</span>
              <span className="font-semibold">${totalBill.toFixed(2)}</span>
            </div>
          </>
        </div>
      )}
    </div>
  );
};

export default CartStep;

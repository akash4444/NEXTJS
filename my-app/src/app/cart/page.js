"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCart } from "../redux/cart/cart";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import ImageSection from "./ImageSection";
import {
  updateCartItems,
  getCartItems,
  updateOrder,
  clearCartItems,
} from "../commonFunctions/commonFunctions";
import { LoadingSpinner, AlertModal } from "../CommonComponents";

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth || {});
  const { items = [] } = useSelector((state) => state.cart || {});

  const isAdmin = role === "admin";

  const [placingOrder, setPlacingOrder] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);
  const [orderedModal, setOrderedModal] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      getCartItems(dispatch, { userId: userId });
    }
  }, [userId]);

  const placeYourOrder = async () => {
    const payload = { items: items, userId: userId, type: "ordered" };
    setPlacingOrder(true);
    const response = await updateOrder(dispatch, payload);
    if (response.status === 200) {
      setOrderedModal(response.type);
    }
    setPlacingOrder(false);
  };

  const clearYourCart = async () => {
    const payload = { userId: userId };
    setClearingCart(true);
    const response = await clearCartItems(dispatch, payload);
    setClearingCart(false);
  };

  // Function to remove a product from the cart
  const removeFromCart = async (product) => {
    const payload = { ...product, userId: userId, type: "remove" };
    await updateCartItems(dispatch, payload);
  };

  // Function to increment quantity
  const incrementQuantity = async (product) => {
    const payload = { ...product, userId: userId, type: "add" };
    await updateCartItems(dispatch, payload);
  };

  // Function to decrement quantity
  const decrementQuantity = async (product) => {
    const payload = { ...product, userId: userId, type: "minus" };
    await updateCartItems(dispatch, payload);
  };

  // Calculate subtotal for each product
  const productSubtotals = items.map((item) => item.price * item.quantity);

  // Calculate total bill
  const totalBill = productSubtotals.reduce(
    (acc, subtotal) => acc + subtotal,
    0
  );

  const navigateToOrderPage = () => {
    setOrderedModal("");
    router.push("/orders");
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {orderedModal && (
        <AlertModal
          open={orderedModal}
          yesbtn="Check your order"
          nobtn=""
          message={`Your order ${
            orderedModal === "ordered" ? "placed" : "cancelled"
          } successfully.`}
          closeButton={() => setOrderedModal("")}
          submitButton={() => navigateToOrderPage()}
        />
      )}
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {placingOrder || clearingCart ? (
        <LoadingSpinner
          loadingMsg={
            placingOrder
              ? "Please wait. Placing your order..."
              : "Please wait. Clearing your cart..."
          }
        />
      ) : items.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 text-lg">
            No items available in your cart.
          </p>
          {/* You can add additional content or actions for an empty cart */}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.productId}
                className="bg-white shadow-md rounded-lg p-4 flex items-center"
              >
                <ImageSection
                  productName={item.productName}
                  image={item.image}
                />

                <div className="flex-grow">
                  <h2 className="text-lg font-semibold mb-2">
                    {item.productName}
                  </h2>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-600 mr-4">
                      Price: ${item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <button
                        className="text-gray-600 focus:outline-none border border-gray-300 px-3 py-1 rounded"
                        onClick={() => decrementQuantity(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="text-gray-600 focus:outline-none border border-gray-300 px-3 py-1 rounded"
                        onClick={() => incrementQuantity(item)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 focus:outline-none border border-red-600 hover:bg-red-600 text-black px-4 py-2 rounded-md"
                    onClick={() => removeFromCart(item)}
                  >
                    Remove
                  </button>
                </div>
                <div className="font-semibold text-xl">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <hr className="my-6" />
            <div className="text-right">
              <h2 className="text-lg font-semibold">
                Total: ${totalBill.toFixed(2)}
              </h2>
            </div>
          </div>
          <div className="fixed bottom-12 left-0 w-full bg-white shadow-md px-4 py-3 flex justify-between">
            {clearingCart ? (
              <LoadingSpinner loadingMsg="Please wait. Clearing your cart..." />
            ) : (
              <div className="max-h-6">
                <button
                  className="text-red-600 hover:text-red-800 focus:outline-none border border-red-600 hover:bg-red-600 text-black px-4 py-2 rounded-md"
                  onClick={() => clearYourCart()}
                  disabled={placingOrder}
                >
                  Clear Cart
                </button>
              </div>
            )}
            <div className="flex justify-between items-center gap-6">
              <p className="text-lg font-semibold">
                Total: ${totalBill.toFixed(2)}
              </p>
              {placingOrder ? (
                <LoadingSpinner loadingMsg="Please wait. Placing your order..." />
              ) : (
                <button
                  onClick={() => placeYourOrder()}
                  disabled={clearingCart}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ml-4"
                >
                  Place Order
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
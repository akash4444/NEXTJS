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

  const [loadingCart, setLoadingCart] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
    }
  }, [userId]);

  const fetchCartItems = async () => {
    setLoadingCart(true);
    await getCartItems(dispatch, { userId: userId });
    setLoadingCart(false);
  };

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
    <div className="min-h-screen">
      <div className="border rounded-md p-4 mb-4 md:w-100 lg:w-3/4 mx-auto bg-white">
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

        <h1 className="text-3xl font-semibold text-center mb-4">
          Shopping Cart
        </h1>
        {placingOrder || clearingCart || loadingCart ? (
          <LoadingSpinner
            loadingMsg={
              placingOrder
                ? "Please wait. Placing your order..."
                : clearingCart
                ? "Please wait. Clearing your cart..."
                : "Please wait. Loading cart..."
            }
            size="lg"
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
    </div>
  );
};

export default CartPage;

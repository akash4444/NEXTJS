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
  getAddress,
} from "../commonFunctions/commonFunctions";
import { LoadingSpinner, AlertModal } from "../CommonComponents";
import CartStep from "./CartStep";
import AddressStep from "./AddressStep";
import PlaceOrderStep from "./PlaceOrderStep";
import OrderCompletedStep from "./OrderCompletedStep";
import StepBar from "./StepBar";

const steps = [
  { number: 1, label: "Address" },
  { number: 2, label: "Place Order" },
  { number: 3, label: "Finish" },
];

const CartPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, userId, role } = useSelector((state) => state.auth || {});
  const { items = [] } = useSelector((state) => state.cart || {});

  const isAdmin = role === "admin";

  const [section, setSection] = useState("cart");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);
  const [clearCartModal, setClearCartModal] = useState(false);
  const [orderedModal, setOrderedModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});

  const [createdOrderedId, setCreatedOrderedId] = useState("");

  const [loadingCart, setLoadingCart] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const bottomNextButton = async () => {
    if (section === "cart") {
      setSection("steps");
    } else if (currentStep === 1) {
      nextStep();
    } else if (currentStep === 2) {
      await placeYourOrder();
    } else {
    }
  };

  const bottomBackButton = async () => {
    if (currentStep === 1) {
      setSection("cart");
    } else {
      prevStep();
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartItems();
      getAddress(dispatch, { userId: userId });
    }
  }, [userId]);

  const fetchCartItems = async () => {
    setLoadingCart(true);
    await getCartItems(dispatch, { userId: userId });
    setLoadingCart(false);
  };

  const placeYourOrder = async () => {
    const payload = {
      items: items,
      userId: userId,
      type: "ordered",
      deliveryAddress: selectedAddress,
    };
    setPlacingOrder(true);
    const response = await updateOrder(dispatch, payload);
    if (response.status === 200) {
      setCreatedOrderedId(response.orderedId || "");
      nextStep();
    }
    setPlacingOrder(false);
  };

  const clearYourCart = async () => {
    const payload = { userId: userId };
    setClearCartModal(false);
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

        {clearCartModal && (
          <AlertModal
            open={clearCartModal}
            yesbtn="Yes, I'm sure"
            nobtn="No, cancel"
            message="Are you sure you want to clear cart ?"
            closeButton={() => setClearCartModal(false)}
            submitButton={() => clearYourCart()}
          />
        )}

        {section === "cart" ? (
          <h1 className="text-3xl font-semibold text-center mb-4">Cart</h1>
        ) : (
          <h1 className="text-3xl font-semibold text-center mb-4">
            {(steps.find((st, index) => currentStep === index + 1) || {})
              ?.label || ""}
          </h1>
        )}

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
        ) : section === "cart" ? (
          <CartStep
            items={items}
            currentStep={currentStep}
            removeFromCart={removeFromCart}
            incrementQuantity={incrementQuantity}
            decrementQuantity={decrementQuantity}
          />
        ) : (
          <>
            <StepBar
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              steps={steps}
            />

            {currentStep === 1 && (
              <AddressStep
                prevStep={prevStep}
                nextStep={nextStep}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
              />
            )}
            {currentStep === 2 && (
              <PlaceOrderStep
                prevStep={prevStep}
                items={items}
                selectedAddress={selectedAddress}
              />
            )}
            {currentStep === 3 && (
              <OrderCompletedStep
                prevStep={prevStep}
                orderId={createdOrderedId}
              />
            )}
          </>
        )}
        {!placingOrder &&
          !clearingCart &&
          !loadingCart &&
          currentStep !== 3 &&
          items.length !== 0 && (
            <div className="fixed bottom-12 left-0 w-full bg-white shadow-md px-4 py-3 flex justify-between">
              <div className="max-h-6">
                {currentStep > 0 && section === "steps" ? (
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={bottomBackButton}
                  >
                    Back
                  </button>
                ) : (
                  <button
                    className="text-red-600 hover:text-red-800 focus:outline-none border border-red-600 hover:bg-red-600 text-black px-4 py-2 rounded-md"
                    onClick={() => setClearCartModal(true)}
                    disabled={placingOrder}
                  >
                    Clear Cart
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center gap-6">
                <p className="text-lg font-semibold">
                  Total: ${totalBill.toFixed(2)}
                </p>

                <button
                  onClick={() => bottomNextButton()}
                  disabled={
                    clearingCart ||
                    (currentStep === 1 &&
                      section === "steps" &&
                      !selectedAddress._id)
                  }
                  className={`px-4 py-2 rounded ml-4 ${
                    clearingCart ||
                    (currentStep === 1 &&
                      section === "steps" &&
                      !selectedAddress._id)
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  {currentStep === 2 ? "Place Order" : "Next"}
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default CartPage;

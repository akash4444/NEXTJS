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

const initialCartItems = [
  {
    productName: "Product 1",
    quantity: 2,
    price: 10,
    totalprice: 20,
    image: "https://via.placeholder.com/150",
  },
  {
    productName: "Product 13",
    quantity: 2,
    price: 10,
    totalprice: 20,
    image: "https://via.placeholder.com/150",
  },
  {
    productName: "Product 2",
    quantity: 2,
    price: 10,
    totalprice: 20,
    image: "https://via.placeholder.com/150",
  },
  // Add more items as needed
];

const CartItem = ({ item, updateQuantity, removeItem }) => {
  const { productName, quantity, price, totalprice, image } = item;

  const handleIncrement = () => {
    updateQuantity(item, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item, quantity - 1);
    }
  };

  return (
    <div className="flex items-center border-b border-gray-200 py-4">
      <input
        type="checkbox"
        className="mr-4 form-checkbox h-5 w-5 text-indigo-600"
      />
      <img
        src={image}
        alt={productName}
        className="w-20 h-20 object-cover mr-4 rounded-lg"
      />
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{productName}</h2>
        <p className="text-gray-600">Price: ${price}</p>
        <div className="flex items-center mt-2">
          <button
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-l-md"
            onClick={handleDecrement}
          >
            -
          </button>
          <span className="px-2">{quantity}</span>
          <button
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded-r-md"
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="text-gray-600 mb-2">Total: ${totalprice}</p>
        <button className="text-red-500" onClick={() => removeItem(item)}>
          Remove
        </button>
      </div>
    </div>
  );
};

const CartPage = ({}) => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [selectedItems, setSelectedItems] = useState([]);

  const updateQuantity = (item, newQuantity) => {
    const updatedItems = cartItems.map((cartItem) => {
      if (cartItem.productName === item.productName) {
        return {
          ...cartItem,
          quantity: newQuantity,
          totalprice: newQuantity * cartItem.price,
        };
      }
      return cartItem;
    });
    setCartItems(updatedItems);
  };

  const removeItem = (item) => {
    const updatedItems = cartItems.filter(
      (cartItem) => cartItem.productName !== item.productName
    );
    setCartItems(updatedItems);
  };

  const toggleItemSelection = (item) => {
    if (
      selectedItems.some(
        (selectedItem) => selectedItem.productName === item.productName
      )
    ) {
      setSelectedItems(
        selectedItems.filter(
          (selectedItem) => selectedItem.productName !== item.productName
        )
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems([...cartItems]);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalprice, 0);

  // Calculate taxes (assuming a fixed tax rate of 10%)
  const taxRate = 0.1;
  const taxes = subtotal * taxRate;

  // Calculate total amount
  const totalAmount = subtotal + taxes;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto mt-8 bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <div className="flex items-center border-b border-gray-200 py-2">
          <input
            type="checkbox"
            className="mr-4 form-checkbox h-5 w-5 text-indigo-600"
            checked={selectedItems.length === cartItems.length}
            onChange={toggleSelectAll}
          />
          <p className="text-lg font-semibold">
            Selected Items ({selectedItems.length})
          </p>
        </div>
        {cartItems.map((item, index) => (
          <CartItem
            key={index}
            item={item}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            toggleItemSelection={toggleItemSelection}
          />
        ))}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <div className="flex justify-between mt-2">
            <span>Total Amount:</span>
            <span className="font-semibold">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
          Place Order
        </button>
      </div>
    </div>
  );
};

export default CartPage;

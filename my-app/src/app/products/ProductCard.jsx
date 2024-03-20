"use client";
import React from "react";
import ImageSection from "./ImageSection";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { LoadingSpinner } from "../CommonComponents";

const ProductCard = ({
  product,
  onDelete,
  onEdit,
  addToCart,
  addingToCart,
}) => {
  const { image, productName, description, category, price, _id } = product;

  const { role } = useSelector((state) => state.auth || {});
  const isAdmin = role === "admin";

  return (
    <div key={_id} className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="flex justify-center items-center"
        style={{ height: "150px" }}
      >
        <ImageSection productName={productName} image={image} />
      </div>
      <div className="p-4" key={_id + productName}>
        <div className="flex justify-center justify-between items-center">
          <h2 className="text-xl font-semibold mb-2">{productName}</h2>
          <div className="flex">
            {isAdmin ? (
              <>
                <IconButton color="error" onClick={() => onDelete()}>
                  <DeleteIcon />
                </IconButton>
                <IconButton color="primary" onClick={() => onEdit()}>
                  <EditIcon />
                </IconButton>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-gray-600 mb-2">Category: {category}</p>
        <p className="text-gray-800 font-semibold">${price.toFixed(2)}</p>

        {addingToCart === _id ? (
          <LoadingSpinner loadingMsg="Please wait. Adding to cart" />
        ) : (
          <button
            onClick={() => addToCart()}
            className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 mt-2 px-4 rounded flex items-center justify-center"
          >
            <ShoppingCart style={{ marginRight: "0.5rem" }} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

"use client";
import React from "react";
import ImageSection from "./ImageSection";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductCard = ({ product, onDelete, onEdit }) => {
  const { image, productName, description, category, price, _id } = product;

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
            <IconButton color="error" onClick={() => onDelete()}>
              <DeleteIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => onEdit()}>
              <EditIcon />
            </IconButton>
          </div>
        </div>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-gray-600 mb-2">Category: {category}</p>
        <p className="text-gray-800 font-semibold">${price}</p>
      </div>
    </div>
  );
};

export default ProductCard;

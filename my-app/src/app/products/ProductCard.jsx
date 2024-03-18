"use client";
import React from "react";
import ImageSection from "./ImageSection";

const ProductCard = ({ product }) => {
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
        <h2 className="text-xl font-semibold mb-2">{productName}</h2>
        <p className="text-gray-600 mb-2">{description}</p>
        <p className="text-gray-600 mb-2">Category: {category}</p>
        <p className="text-gray-800 font-semibold">${price}</p>
      </div>
    </div>
  );
};

export default ProductCard;

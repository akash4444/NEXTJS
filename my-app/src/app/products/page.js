"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { updateProducts } from "../redux/products/products";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import servicePath from "@/config";

const ProductsPage = () => {
  const dispatch = useDispatch();

  const products = useSelector((state) => state.products || []);

  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    try {
      const response = (await axios.post(servicePath + "/products", {}))?.data;

      if (response?.status === 200) {
        dispatch(updateProducts(response?.products || []));
      }
    } catch (e) {}
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductsPage;

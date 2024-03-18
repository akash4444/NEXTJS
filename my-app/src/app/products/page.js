"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { updateProducts } from "../redux/products/products";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import servicePath from "@/config";
import { AlertModal } from "../CommonComponents";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  const deleteProduct = async () => {
    try {
      setDeleting(true);
      const productId = deleteDialog;
      const response = (
        await axios.delete(servicePath + "/removeProduct" + `/${productId}`)
      )?.data;

      if (response?.status === 200) {
        await getProductDetails();
        setDeleting(false);
        setDeleteDialog("");
      }
    } catch (e) {
      setDeleting(false);
      setDeleteDialog("");
    }
  };

  const onEdit = (productId) => {
    router.push(`/editProduct/${productId}`);
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 p-4">
      {deleteDialog && (
        <AlertModal
          open={deleteDialog}
          yesbtn="Yes, I'm sure"
          nobtn="No, cancel"
          message="Are you sure you want to delete product?"
          closeButton={() => setDeleteDialog("")}
          submitButton={() => deleteProduct()}
          loading={deleting}
          loadingMsg="Please wait, Product delete in progress..."
        />
      )}
      {products.map((product) => (
        <ProductCard
          key={product._id}
          product={product}
          onDelete={() => setDeleteDialog(product._id)}
          onEdit={() => onEdit(product._id)}
        />
      ))}
    </div>
  );
};

export default ProductsPage;

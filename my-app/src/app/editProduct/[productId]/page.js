"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductForm } from "../../CommonComponents";
import axios from "axios";
import servicePath from "@/config";
import { MessageAlert, LoadingSpinner } from "../../CommonComponents";

const EditProductForm = ({ params }) => {
  const router = useRouter();
  const { productId } = params || {};

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = React.useState({});
  const [loadingPrd, setLoadingPrd] = useState(false);

  const [initialState, setInitialState] = useState({
    category: "",
    productName: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage({}), 2000);
    }
  }, [message]);

  useEffect(() => {
    if (productId) {
      getProduct(productId);
    }
  }, [productId]);

  const getProduct = async (productId) => {
    try {
      setLoadingPrd(true);

      const data = (await axios.get(servicePath + "/product" + `/${productId}`))
        ?.data;

      if (data.status === 200) {
        const { productName, price, description, category } = data.product;
        setInitialState({
          category: category,
          productName: productName,
          description: description,
          price: price,
        });
      } else {
        router.push("/products");
      }

      setLoadingPrd(false);
    } catch (e) {
      const data = e?.response?.data;
      setLoadingPrd(false);
      router.push("/products");
    }
  };

  const updateProductDetails = async (payload) => {
    try {
      setSubmitting(true);

      const data = (
        await axios.put(servicePath + "/editProduct" + `/${productId}`, {
          ...payload,
        })
      )?.data;

      setMessage({
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
      setSubmitting(false);
    } catch (e) {
      const data = e?.response?.data;
      setMessage({
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md mt-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      {loadingPrd ? (
        <LoadingSpinner loadingMsg="Please wait, Fetching product details..." />
      ) : (
        <>
          <ProductForm
            initialValues={initialState}
            handleSubmitButton={updateProductDetails}
            loading={submitting}
            loadingMsg="Please wait, Product update in progress..."
            isEditForm={true}
          />
          <div>
            {message.msg && (
              <MessageAlert
                type={message.type}
                message={message.msg}
                onClose={() => setMessage({})}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(EditProductForm);

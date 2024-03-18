"use client";
import React, { useEffect, useState } from "react";
import { ProductForm } from "../CommonComponents";
import axios from "axios";
import servicePath from "@/config";
import { MessageAlert } from "../CommonComponents";

const AddProductForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = React.useState({});

  const initialState = {
    category: "",
    productName: "",
    description: "",
    price: "",
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => setMessage({}), 2000);
    }
  }, [message]);

  const saveProductDetails = async (payload) => {
    try {
      setSubmitting(true);

      const data = (
        await axios.post(servicePath + "/saveProduct", { ...payload })
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
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <ProductForm
        initialValues={initialState}
        handleSubmitButton={saveProductDetails}
        loading={submitting}
        loadingMsg="Please wait, Product saving in progress..."
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
    </div>
  );
};

export default AddProductForm;

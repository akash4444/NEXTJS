"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updateProductNames } from "../redux/products/productNames";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import servicePath from "@/config";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import LoadingSpinner from "./LoadingSpinner";

const ProductForm = ({
  initialValues,
  handleSubmitButton,
  loading,
  loadingMsg,
  isEditForm = false,
}) => {
  const dispatch = useDispatch();
  const productNames = useSelector((state) => state.productNames);
  const [loadingPrdNames, setLoadingPrdNames] = useState(true);
  const [productCat, setProductCat] = useState([]);
  const [productList, setProductList] = useState([]);

  const [showProductName, setShowProductName] = useState(false);

  const validationSchema = Yup.object().shape({
    category: Yup.string().required("Category is required"),
    productName: Yup.string().required("Product name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be positive"),
  });

  const {
    handleSubmit,
    setFieldValue,
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setFieldTouched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await handleSubmitButton(values);
    },
  });

  useEffect(() => {
    getProductNames();
  }, []);

  useEffect(() => {
    if (productNames.length > 0 && values?.category) {
      setShowProductName(false);
      setProductList([]);
      setFieldTouched("productName", true);
      setFieldValue("productName", "");

      const list = productNames.find((r) => r.category === values.category);
      if (list) {
        setProductList([
          ...list.items.reduce((main, current) => {
            return [...main, { label: current, value: current }];
          }, []),
        ]);
      }
    }
  }, [values?.category]);

  useEffect(() => {
    if (productList.length > 0) {
      isEditForm && setFieldValue("productName", initialValues.productName);
      setShowProductName(true);
    }
  }, [productList]);

  const getProductNames = async () => {
    try {
      const response = (await axios.post(servicePath + "/productNames", {}))
        ?.data;

      if (response.status === 200) {
        dispatch(updateProductNames(response.productNames));

        const cat = response.productNames.reduce((main, current) => {
          return [
            ...main,
            { label: current.category, value: current.category },
          ];
        }, []);
        setProductCat(cat);
        setLoadingPrdNames(false);
      }
    } catch (e) {
      setLoadingPrdNames(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block font-semibold">
          Category:
        </label>
        <Autocomplete
          id="category"
          name="category"
          size="small"
          disabled={loading || loadingPrdNames || isEditForm}
          options={productCat}
          getOptionLabel={(option) => option.label}
          value={
            productCat.find((option) => option.value === values.category) ||
            null
          }
          onChange={(event, value) =>
            setFieldValue("category", value?.value || "")
          }
          onBlur={() => setFieldTouched("category", true)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Select category"
            />
          )}
        />
        {touched.category && errors.category ? (
          <div className="text-red-500">{errors.category}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="productName" className="block font-semibold">
          Product Name:
        </label>

        {!showProductName ? (
          <Autocomplete
            id="productName"
            name="productName"
            size="small"
            options={[]}
            disabled={loading || loadingPrdNames || isEditForm}
            value=""
            getOptionLabel={(option) => option.label || ""}
            onChange={(event, value) =>
              setFieldValue("productName", value?.value || "")
            }
            onBlur={() => setFieldTouched("productName", true)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select product name"
              />
            )}
          />
        ) : (
          <Autocomplete
            id="productName"
            name="productName"
            size="small"
            options={productList}
            disabled={loading || loadingPrdNames || isEditForm}
            value={
              productList.find(
                (option) => option.value === values.productName
              ) || null
            }
            getOptionLabel={(option) => option.label || ""}
            onChange={(event, value) =>
              setFieldValue("productName", value?.value || "")
            }
            onBlur={() => setFieldTouched("productName", true)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                placeholder="Select product name"
              />
            )}
          />
        )}

        {touched.productName && errors.productName ? (
          <div className="text-red-500">{errors.productName}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          disabled={loading}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.description}
          className="border border-gray-300 rounded p-2 w-full"
        ></textarea>
        {touched.description && errors.description ? (
          <div className="text-red-500">{errors.description}</div>
        ) : null}
      </div>
      <div>
        <label htmlFor="price" className="block font-semibold">
          Price:
        </label>
        <input
          id="price"
          name="price"
          type="number"
          disabled={loading}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.price}
          className="border border-gray-300 rounded p-2 w-full"
        />
        {touched.price && errors.price ? (
          <div className="text-red-500">{errors.price}</div>
        ) : null}
      </div>
      {loading ? (
        <LoadingSpinner loadingMsg={loadingMsg} />
      ) : (
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded"
        >
          Submit
        </button>
      )}
    </form>
  );
};

export default ProductForm;

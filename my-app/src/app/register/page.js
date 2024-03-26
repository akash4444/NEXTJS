"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import servicePath from "@/config";
import { MessageAlert, LoadingSpinner } from "../CommonComponents";
import axios from "axios";
import bcryptjs from "bcryptjs";
import axiosInstance from "../commonFunctions/axiosCommon";

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Must be at least 6 characters")
    .required("Required"),
  mobileNumber: Yup.number().required("Required"),
});

const Register = () => {
  const router = useRouter();

  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { ...rest } = values;
    try {
      setLoading(true);
      const saltRounds = 10;
      const staticSalt = bcryptjs.genSaltSync(saltRounds);
      const hashedPassword = await bcryptjs.hash(rest.password, staticSalt);
      const response = await axios.post(servicePath + "/api/register", {
        ...rest,
        password: hashedPassword,
      });
      const data = response.data;
      setMessage({
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
      setLoading(false);
    } catch (e) {
      const data = e?.response?.data;
      setMessage({
        msg: data?.message,
        type: data?.status === 200 ? "success" : "error",
      });
      setLoading(false);
    }
  };

  const navigateToLoginPage = () => {
    router.push("/login");
  };

  const handleChange = (event, setFieldValue) => {
    const inputValue = event.target.value;
    // Check if the input value contains only digits
    if (/^\d*$/.test(inputValue)) {
      setFieldValue("mobileNumber", inputValue);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-md rounded px-8 py-6">
        <h2 className="text-3xl font-semibold text-center mb-4">Register</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="#"
            onClick={() => navigateToLoginPage()}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </a>
        </p>
        <Formik
          initialValues={{
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            mobileNumber: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="grid  grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block mb-1">
                    First Name
                  </label>
                  <Field
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-1">
                    Last Name
                  </label>
                  <Field
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="mobileNumber" className="block mb-1">
                  Mobile No.
                </label>
                <Field
                  type="tel"
                  id="mobileNumber"
                  maxLength={10}
                  value={values.mobileNumber}
                  onChange={(e) => handleChange(e, setFieldValue)}
                  name="mobileNumber"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
              </div>

              {loading ? (
                <LoadingSpinner loadingMsg="Please wait, Register in progress..." />
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 w-full"
                >
                  Register
                </button>
              )}
              <div>
                {message.msg && (
                  <MessageAlert
                    type={message.type}
                    message={message.msg}
                    onClose={() => setMessage({})}
                  />
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;

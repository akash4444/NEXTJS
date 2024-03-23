"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import servicePath from "@/config";
import { MessageAlert, LoadingSpinner } from "../CommonComponents";
import axios from "axios";
import bcryptjs from "bcryptjs";

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Must be at least 6 characters")
    .required("Required"),
  address: Yup.object().shape({
    houseNo: Yup.string().required("Required"),
    streetLine: Yup.string().required("Required"),
    pinCode: Yup.number().min(6, "Must be 6 digit").required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
  }),
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
      const response = await axios.post(servicePath + "/register", {
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
            address: {
              houseNo: "",
              streetLine: "",
              pinCode: "",
              city: "",
              state: "",
            },
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values) => {
            await handleSubmit(values);
          }}
        >
          {({}) => (
            <Form>
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
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="houseNo" className="block mb-1">
                    House No
                  </label>
                  <Field
                    type="text"
                    id="houseNo"
                    name="address.houseNo"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="address.houseNo"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="streetLine" className="block mb-1">
                    Street Line
                  </label>
                  <Field
                    type="text"
                    id="streetLine"
                    name="address.streetLine"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="address.streetLine"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="pinCode" className="block mb-1">
                    Pin Code
                  </label>
                  <Field
                    type="number"
                    id="pinCode"
                    name="address.pinCode"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="address.pinCode"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1">
                    City
                  </label>
                  <Field
                    type="text"
                    id="city"
                    name="address.city"
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <ErrorMessage
                    name="address.city"
                    component="div"
                    className="text-red-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="state" className="block mb-1">
                  State
                </label>
                <Field
                  type="text"
                  id="state"
                  name="address.state"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="address.state"
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

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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

const Register = () => {
  const router = useRouter();

  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    const { confirmPassword, ...rest } = values;
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
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
      setLoading(false);
    }
  };

  const navigateToLoginPage = () => {
    router.push("/login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-center text-3xl font-bold text-gray-900">
            Register
          </h1>
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
        </div>
        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ errors, touched, values }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    disabled={loading}
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    disabled={loading}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <div>
                  <Field
                    type="password"
                    name="confirmPassword"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    disabled={loading}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div>
                {loading ? (
                  <LoadingSpinner loadingMsg="Please wait, Register in progress..." />
                ) : (
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Register
                  </button>
                )}
              </div>
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

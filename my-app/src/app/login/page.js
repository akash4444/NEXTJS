"use client";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import bcryptjs from "bcryptjs";
import axios from "axios";
import servicePath from "@/config";
import { MessageAlert } from "../CommonComponents";

const Login = () => {
  const router = useRouter();
  const [message, setMessage] = React.useState({});

  const navigateToRegisterPage = () => {
    router.push("/register");
  };

  const handleLoginIn = async (values, setSubmitting) => {
    const { email, password } = values;

    try {
      const response = await axios.post(servicePath + "/login", {
        email,
        password,
      });
      const data = response.data;

      if (data.status === 200) {
        router.push("/dashboard");
      }
      setMessage({
        msg: data.message,
        type: data.status === 200 ? "" : "error",
      });
    } catch (e) {
      const data = e?.response?.data;
      setMessage({
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            await handleLoginIn(values, setSubmitting);
          }}
        >
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">
                Email Address
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                placeholder="Enter your email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="form-input mt-1 block w-full rounded-md border-gray-300"
                placeholder="Enter your password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
            >
              Log in
            </button>
          </Form>
        </Formik>
        <div>
          {message.msg && (
            <MessageAlert
              type={message.type}
              message={message.msg}
              onClose={() => setMessage({})}
            />
          )}
        </div>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account yet?
          <a
            href="#"
            onClick={() => navigateToRegisterPage()}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

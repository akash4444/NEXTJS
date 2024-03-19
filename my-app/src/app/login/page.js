"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { MessageAlert, LoadingSpinner } from "../CommonComponents";
import { updateAuth } from "../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { signIn } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const navigateToRegisterPage = () => {
    router.push("/register");
  };

  const navigateToForgotPasswordPage = () => {
    router.push("/forgotPassword");
  };

  const handleLoginIn = async (values, setSubmitting) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      const data = response;

      if (data.status === 200) {
        await dispatch(
          updateAuth({
            userId: email,
            isLoggedIn: true,
          })
        );
        router.push("/products");
      }
      setMessage({
        msg:
          data.status === 200
            ? "Logged in successfully."
            : "Invalid credentials.",
        type: data.status === 200 ? "" : "error",
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-8  bg-white rounded shadow-md rounded-lg border border-gray-300">
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
          {({ errors, touched, values }) => (
            <Form className="mt-8 space-y-6">
              <div className="rounded-md shadow-sm space-y-4">
                <div>
                  <Field
                    type="email"
                    name="email"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    disabled={loading}
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
                    disabled={loading}
                    name="password"
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
              <div>
                {loading ? (
                  <LoadingSpinner loadingMsg="Please wait, login in progress..." />
                ) : (
                  <button
                    type="submit"
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Login
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
        <p className="mt-2 text-center text-sm text-gray-600">
          <a
            href="#"
            onClick={() => navigateToForgotPasswordPage()}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot password ?
          </a>
        </p>
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

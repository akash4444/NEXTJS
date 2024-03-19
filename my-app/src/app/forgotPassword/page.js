"use client";
import { useEffect, useState } from "react";
import { Formik, Form, Field, useFormik, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axios from "axios";
import servicePath from "@/config";
import * as Yup from "yup";
import { MessageAlert, LoadingSpinner } from "../CommonComponents";
import bcryptjs from "bcryptjs";

const ForgotPassword = () => {
  const router = useRouter();
  const [isOtpSent, setIsOtpSent] = useState("send");

  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  const [message, setMessage] = useState({});

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Must be at least 6 characters"),
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
    getFieldProps,
    isSubmitting,
  } = useFormik({
    initialValues: { email: "", otp: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (isOtpSent === "send") {
        await sendOtp(values);
      } else if (isOtpSent === "verify") {
        await verifyOtp(values);
      } else if (isOtpSent === "update") {
        await updatePassword(values);
      }
    },
  });

  const sendOtp = async (values) => {
    try {
      const { email } = values;

      setOtpSending(true);
      const response = (
        await axios.post(servicePath + "/sendOtp", { email: email })
      )?.data;

      if (response.status === 200) {
        setIsOtpSent("verify");
        setMessage({
          msg: response.message,
          type: response.status === 200 ? "success" : "error",
        });
      }
      setOtpSending(false);
    } catch (e) {
      const data = e?.response?.data;
      setMessage({
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
      setOtpSending(false);
    }
  };

  const verifyOtp = async (values) => {
    try {
      const { email, otp } = values;
      setOtpVerifying(true);
      const response = (
        await axios.post(servicePath + "/validateOtp", { email, otp })
      )?.data;

      if (response.status === 200) {
        setIsOtpSent("update");
      }
      setOtpVerifying(false);
    } catch (e) {
      const data = e?.response?.data;
      setMessage({
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
      setOtpVerifying(false);
    }
  };

  const updatePassword = async (values) => {
    try {
      setPasswordUpdating(true);
      const { email, password } = values;

      const saltRounds = 10;
      const staticSalt = bcryptjs.genSaltSync(saltRounds);
      const hashedPassword = await bcryptjs.hash(password, staticSalt);

      const response = (
        await axios.post(servicePath + "/updatePassword", {
          email,
          password: hashedPassword,
        })
      )?.data;

      if (response.status === 200) {
        setMessage({
          msg: response.message,
          type: response.status === 200 ? "success" : "error",
        });

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
      setPasswordUpdating(false);
    } catch (e) {
      const data = e?.response?.data;
      setMessage({
        msg: data.message,
        type: data.status === 200 ? "success" : "error",
      });
      setPasswordUpdating(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="p-8 min-w-[350px] bg-white rounded shadow-md rounded-lg border border-gray-300">
        <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
        {["send", "verify"].includes(isOtpSent) ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-1">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isOtpSent !== "send" || otpSending}
                value={values.email}
                className="border border-gray-300 rounded p-2 w-full"
              />
              {touched.email && errors.email && (
                <div className="text-red-500 text-sm mt-1">{errors.email}</div>
              )}
            </div>
            {isOtpSent === "verify" && (
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">
                  OTP:
                </label>
                <input
                  id="otp"
                  name="otp"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={otpSending || otpVerifying}
                  type="otp"
                  value={values.otp}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                {touched.otp && errors.otp && (
                  <div className="text-red-500 text-sm mt-1">{errors.otp}</div>
                )}
                {!otpSending && !otpVerifying && (
                  <p className="mt-2 text-center text-sm text-gray-600">
                    <a
                      href="#"
                      disabled={otpSending || otpVerifying}
                      onClick={async () => await sendOtp(values)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Resent OTP
                    </a>
                  </p>
                )}
              </div>
            )}
            {otpSending || otpVerifying ? (
              <LoadingSpinner
                loadingMsg={`Please wait.${
                  otpSending ? "Sending OTP..." : "Validating OTP"
                } `}
              />
            ) : (
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600"
              >
                {isOtpSent === "send" ? "Send OTP" : "Validate OTP"}
              </button>
            )}
          </form>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-1">
                  Email:
                </label>
                <input
                  id="email"
                  name="email"
                  disabled={isOtpSent === "update"}
                  type="email"
                  value={values.email}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                {touched.email && errors.email && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block mb-1">
                  Password:
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  disabled={passwordUpdating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                {touched.password && errors.password && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </div>
                )}
              </div>

              {passwordUpdating ? (
                <LoadingSpinner
                  loadingMsg={`Please wait. Updating password...`}
                />
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md focus:outline-none hover:bg-blue-600"
                  disabled={!values.password}
                >
                  Update Password
                </button>
              )}
            </form>
          </div>
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
      </div>
    </div>
  );
};

export default ForgotPassword;

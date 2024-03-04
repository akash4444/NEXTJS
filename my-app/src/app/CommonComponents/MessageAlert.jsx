"use client";
// components/Alert.js
import React from "react";

const Alert = ({ type, message, onClose }) => {
  const colors = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  const icons = {
    success: (
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    warning: (
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4v.01M12 16v.01"
        />
      </svg>
    ),
    info: (
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`flex justify-between items-center ${colors[type]} px-4 py-3 rounded-lg`}
    >
      <div className="flex items-center">
        {icons[type]}
        <p className="text-sm font-semibold">{message}</p>
      </div>
      <button onClick={onClose}>
        <svg className="h-4 w-4 fill-current text-gray-600" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.87968 5.87864C5.48868 5.48764 4.85518 5.48764 4.46418 5.87864C4.07318 6.26964 4.07318 6.90314 4.46418 7.29414L11.1702 13.9991L4.46418 20.7051C4.07318 21.0961 4.07318 21.7296 4.46418 22.1206C4.85518 22.5116 5.48868 22.5116 5.87968 22.1206L12.5857 15.4141L19.2922 22.1216C19.6832 22.5126 20.3167 22.5126 20.7077 22.1216C21.0987 21.7306 21.0987 21.0971 20.7077 20.7061L13.9992 13.9991L20.7077 7.29414C21.0987 6.90314 21.0987 6.26964 20.7077 5.87864C20.3167 5.48764 19.6832 5.48764 19.2922 5.87864L12.5857 12.5851L5.87968 5.87864Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default Alert;

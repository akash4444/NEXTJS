import React, { useState } from "react";

const LoadingSpinner = ({
  loadingMsg = "Please wait, process in progress...",
  size = "md",
}) => {
  const tempMsg = "Please wait, process in progress...";
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        {size === "md" ? (
          <>
            <div className="animate-spin mb-2 rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p className="">{loadingMsg || tempMsg}</p>
          </>
        ) : size === "sm" ? (
          <>
            <div className="animate-spin mb-2 rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
            <p style={{ fontSize: "10px" }}>{loadingMsg || tempMsg}</p>
          </>
        ) : (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="">
              {/* size lg */}
              <div className="animate-spin mb-2 rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
              <p style={{ fontSize: "32px" }}>{loadingMsg || tempMsg}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;

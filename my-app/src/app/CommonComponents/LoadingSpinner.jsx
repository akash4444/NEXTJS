import React, { useState } from "react";

const LoadingSpinner = ({
  loadingMsg = "Please wait, process in progress...",
}) => {
  const tempMsg = "Please wait, process in progress...";
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin mb-2 rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
        <p>{loadingMsg || tempMsg}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

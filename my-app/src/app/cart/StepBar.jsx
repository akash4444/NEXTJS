import React from "react";

const StepBar = ({ currentStep, setCurrentStep, steps }) => {
  const handleStepClick = (step) => {
    setCurrentStep(step);
  };

  const disableStep = (step, stepNo) => {
    let disable = true;

    if (currentStep === 3) {
      return disable;
    } else if (currentStep <= stepNo) {
      return disable;
    } else {
      disable = false;
    }
    return disable;
  };
  return (
    <div key="step" className="flex items-center justify-between w-full mb-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          <div className="relative">
            {index !== 0 && (
              <div
                className={`absolute top-0 left-1/2 transform -translate-x-1/2 h-full border-t-2 border-${
                  currentStep >= index ? "green" : "gray"
                }-300`}
              ></div>
            )}
            <button
              className={`relative flex items-center justify-center rounded-full text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${
                currentStep >= index + 1
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg"
                  : "bg-white text-gray-600 border border-gray-300 shadow-md"
              }`}
              disabled={disableStep(step, index + 1)}
              style={{ width: "3rem", height: "3rem" }}
              onClick={() => handleStepClick(index + 1)}
            >
              {currentStep >= index + 1 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.293 7.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 01-1.414 0l-1-1a1 1 0 00-1.414 1.414l2.293 2.293a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                step.number
              )}
            </button>
            <div
              className={`absolute top-12 left-1/2 transform -translate-x-1/2 text-center text-xs text-gray-600 w-24`}
            >
              {step.label}
            </div>
          </div>
          {steps.length - 1 !== index && (
            <div
              className={`flex-grow h-1 ${
                currentStep >= index + 2
                  ? "bg-gradient-to-r from-green-400 to-green-600 text-white shadow-lg"
                  : "bg-gray-300"
              }`}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepBar;

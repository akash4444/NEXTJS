import React from "react";

const Step2 = ({ prevStep, nextStep }) => {
  const handlePrev = () => {
    // Logic to move to the previous step
    prevStep();
  };

  const handleNext = () => {
    // Logic to move to the next step
    nextStep();
  };

  return <div className="p-4">{/* Place order form */}</div>;
};

export default Step2;

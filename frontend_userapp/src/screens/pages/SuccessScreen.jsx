import React from "react";
import { useNavigate } from "react-router-dom";

const SuccessScreen = () => {
  const navigate = useNavigate();

  const handleBrowseMore = () => {
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-3xl font-bold text-indigo-900 mb-3">
        Order Placed Successfully!
      </h1>
      <p className="text-gray-600 text-base mb-6">
        Thank you for ordering with <span className="font-semibold">RR Food Corner</span>
      </p>
      <button
        onClick={handleBrowseMore}
        className="bg-indigo-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-indigo-800 transition cursor-pointer"
      >
        Browse More Items
      </button>
    </div>
  );
};

export default SuccessScreen;

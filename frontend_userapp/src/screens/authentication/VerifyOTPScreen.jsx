import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../utils/api";

const VerifyOTPScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrMobile } = location.state || {};
  const [otp, setOtp] = useState("");

  const handleVerifyOTP = async () => {
    if (!otp) {
      alert("Please enter the OTP");
      return;
    }

    try {
      await API.post("/auth/verify-otp", {
        emailOrMobile,
        otp,
      });

      alert("OTP verified. Please reset your password.");
      navigate("/reset-password", { state: { emailOrMobile } });
    } catch (err) {
      console.error("OTP verify error:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Verify OTP</h1>
        <p className="text-center text-gray-600 mb-6">
          Sent to: <strong>{emailOrMobile}</strong>
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-3 mb-6"
        />

        <button
          onClick={handleVerifyOTP}
          className="w-full bg-[#16203bd5] text-white font-bold py-3 rounded"
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyOTPScreen;

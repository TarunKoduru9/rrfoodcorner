import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const ForgotPasswordScreen = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!emailOrMobile.trim()) {
      alert("Please enter your email or mobile number.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/send-otp", { emailOrMobile: emailOrMobile.trim() });
      alert("OTP sent successfully!");
      navigate("/verify-otp", { state: { emailOrMobile: emailOrMobile.trim() } });
    } catch (err) {
      console.error("OTP send error:", err);
      alert(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <input
          type="text"
          placeholder="Enter your email or mobile"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />

        <button
          onClick={handleSendOTP}
          disabled={loading}
          className="w-full bg-[#16203bd5] hover:bg-[#0e1329] text-white font-semibold py-3 rounded transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;

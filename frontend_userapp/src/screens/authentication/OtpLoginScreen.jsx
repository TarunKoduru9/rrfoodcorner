import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const OtpLoginScreen = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const otpRef = useRef(null);

  const requestOtp = async () => {
    const trimmedInput = emailOrMobile.trim();

    if (!trimmedInput) {
      alert("Please enter your email or mobile number.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/send-otp", { emailOrMobile: trimmedInput });
      alert("OTP sent to your email or mobile");
      setStep(2);
    } catch (err) {
      console.error("OTP send error:", err);
      alert(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP.");
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/verify-otp", {
        emailOrMobile: emailOrMobile.trim(),
        otp: otp.trim(),
      });
      alert("Login successful!");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("OTP verify error:", err);
      alert(err?.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && otpRef.current) {
      otpRef.current.focus();
    }
  }, [step]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md bg-white shadow p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">OTP Login</h2>

        <input
          type="text"
          placeholder="Email or Mobile Number"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={step === 2}
        />

        {step === 2 && (
          <input
            ref={otpRef}
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <button
          onClick={step === 1 ? requestOtp : verifyOtp}
          className={`w-full text-white font-bold py-3 rounded transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#16203bd5] hover:bg-[#0e142bd5] cursor-pointer"
          }`}
          disabled={loading}
        >
          {loading
            ? step === 1
              ? "Sending OTP..."
              : "Verifying..."
            : step === 1
            ? "Send OTP"
            : "Verify OTP"}
        </button>
      </div>
    </div>
  );
};

export default OtpLoginScreen;

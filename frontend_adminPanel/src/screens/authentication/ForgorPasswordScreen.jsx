import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState("");

  const handleSendOTP = async () => {
    if (!emailOrMobile) {
      alert("Please enter your email or mobile");
      return;
    }

    try {
      await API.post("/admin/send-otp", { emailOrMobile });
      alert("OTP sent to your email");
      navigate("/verify-otp", { state: { emailOrMobile } });
    } catch (err) {
      console.error("OTP error:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <input
          type="text"
          placeholder="Enter your email or mobile"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
        />

        <button
          onClick={handleSendOTP}
          className="w-full bg-[#16203bd5] hover:bg-[#16203b] text-white font-bold py-3 rounded-md transition cursor-pointer"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordScreen;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../utils/api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

// Reusable password input field with eye toggle
const PasswordField = ({ value, onChange, show, setShow, placeholder }) => (
  <div className="relative mb-4">
    <input
      type={show ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <span
      onClick={() => setShow((prev) => !prev)}
      className="absolute right-3 top-3 text-gray-600 hover:text-gray-800 cursor-pointer text-xl"
    >
      {show ? <AiFillEyeInvisible /> : <AiFillEye />}
    </span>
  </div>
);

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrMobile } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await API.post("/auth/reset-password", {
        emailOrMobile,
        password,
      });

      alert("Password has been reset successfully!");
      navigate("/");
    } catch (err) {
      console.error("Reset error:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Email / Mobile: <strong>{emailOrMobile}</strong>
        </p>

        <PasswordField
          value={password}
          onChange={(val) => setPassword(val)}
          show={showPassword}
          setShow={setShowPassword}
          placeholder="New Password"
        />

        <PasswordField
          value={confirmPassword}
          onChange={(val) => setConfirmPassword(val)}
          show={showConfirm}
          setShow={setShowConfirm}
          placeholder="Confirm Password"
        />

        <button
          onClick={handleResetPassword}
          className="w-full bg-[#16203bd5] text-white font-bold py-3 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;

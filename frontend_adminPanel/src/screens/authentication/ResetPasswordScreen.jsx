import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../utils/api";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function ResetPasswordScreen() {
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
      await API.post("/admin/reset-password", {
        emailOrMobile,
        password,
      });

      alert("Password has been reset");
      navigate("/login");
    } catch (err) {
      console.error("Reset error:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Email / Mobile: <span className="font-medium">{emailOrMobile}</span>
        </p>

        {/* New Password */}
        <div className="relative mb-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-xl text-gray-500 cursor-pointer"
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="relative mb-6">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute inset-y-0 right-3 flex items-center text-xl text-gray-500 cursor-pointer"
          >
            {showConfirm ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>

        <button
          onClick={handleResetPassword}
          className="w-full bg-[#16203bd5] hover:bg-[#16203b] text-white font-bold py-3 rounded-md transition cursor-pointer"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordScreen;

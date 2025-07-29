import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import coverImage from "../../assets/coverimage.jpg";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const LoginScreen = () => {
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/home", { replace: true });
  }, [navigate]);

  const handleLogin = async () => {
    if (!emailOrMobile.trim() || !password.trim()) {
      alert("Please enter both email/mobile and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/auth/login", {
        emailOrMobile: emailOrMobile.trim(),
        password: password.trim(),
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful!");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-5">
          RR Food Corner
        </h1>

        <img
          src={coverImage}
          alt="cover"
          className="w-full h-44 object-cover rounded-lg mb-6"
        />

        <button
          onClick={() => navigate("/home")}
          className="text-sm text-gray-500 hover:text-blue-600 underline mb-4 w-full text-right cursor-pointer"
        >
          Skip &rarr;
        </button>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Email or Mobile"
            value={emailOrMobile}
            onChange={(e) => setEmailOrMobile(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
            autoComplete="username"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
              autoComplete="current-password"
            />
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute top-3 right-3 text-xl text-gray-600 cursor-pointer hover:text-gray-800"
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-center mt-6 text-sm">
          <span className="text-gray-600">Don't have an account?</span>
          <button
            onClick={() => navigate("/signup")}
            className="ml-2 text-blue-600 hover:underline cursor-pointer"
          >
            Signup
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative text-center">
            <span className="bg-white px-3 text-gray-500 text-sm">OR</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/otp-login")}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition cursor-pointer"
        >
          Login with OTP
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;

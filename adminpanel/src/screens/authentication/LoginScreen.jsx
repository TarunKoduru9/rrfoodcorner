import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import coverImage from "../../assets/coverimage.jpg";
import { useAuth } from "../../utils/AuthContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function LoginScreen() {
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrMobile || !password) {
      alert("Please enter email/mobile and password");
      return;
    }

    try {
      setLoading(true);
      const response = await API.post("/admin/login", {
        emailOrMobile,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      await fetchUser();

      alert("Login successful!");
      navigate("/panel", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/panel", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center  px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-[#16203bd5]">RR Food Corner</h1>

        <img
          src={coverImage}
          alt="cover"
          className="w-full h-40 object-cover rounded-lg"
        />

        <p className="text-center text-sm font-medium text-red-600">Admin's Only</p>

        <input
          type="text"
          placeholder="Email or Mobile"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
          autoComplete="username"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="current-password"
          />
          <div
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-2xl text-gray-600 cursor-pointer"
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-md font-semibold text-white transition duration-200 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;

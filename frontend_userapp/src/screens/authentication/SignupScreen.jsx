import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import API from "../../utils/api";

const SignupScreen = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !mobile || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/signup", {
        name,
        email,
        mobile,
        password,
      });

      alert("Signup successful! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-[#16203bd5] mb-6 text-center">
          Create an Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          maxLength={10}
          onChange={(e) =>
            setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
          }
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10"
          />
          <span
            className="absolute top-2.5 right-3 text-xl text-gray-600 cursor-pointer hover:text-gray-800"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[#16203bd5] text-white font-bold py-3 rounded-md mb-4"
        >
          {loading ? "Loading..." : "Signup"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="text-blue-600 text-sm underline w-full text-center"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default SignupScreen;

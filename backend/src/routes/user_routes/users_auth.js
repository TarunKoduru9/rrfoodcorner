const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  getMe,
  updateUser,
  googleLogin,
} = require("../../controller/user_Controller/users_authController");
const authorize = require("../../middleware/authorize");

// Public Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

// Protected Routes
router.get("/me", authorize("user"), getMe);
router.patch("/update", authorize("user"), updateUser);


module.exports = router;

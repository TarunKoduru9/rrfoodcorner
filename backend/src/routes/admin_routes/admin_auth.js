const express = require("express");
const router = express.Router();
const {
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  getDashboardStats,
} = require("../../controller/admin_Controller/admin_authController");

const authorize = require("../../middleware/authorize");


// Auth routes
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

// Protected route
router.get("/dashboard", authorize(["admin", "superadmin", "manager", "delivery"]), getDashboardStats);

module.exports = router;

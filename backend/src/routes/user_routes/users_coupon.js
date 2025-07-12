const express = require("express");
const router = express.Router();
const { getAllCoupons  } = require("../../controller/user_Controller/users_couponController");

router.get("/", getAllCoupons);
module.exports = router;

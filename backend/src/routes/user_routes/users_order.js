const express = require("express");
const router = express.Router();
const { placeOrder, getOrdersByUser } = require("../../controller/user_Controller/users_orderController");
const authorize = require("../../middleware/authorize");

router.post("/", authorize("user"),placeOrder );
router.get("/:userId",authorize("user"), getOrdersByUser);

module.exports = router;

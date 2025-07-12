const express = require("express");
const router = express.Router();
const deliveryOrderController = require("../../controller/admin_Controller/deliveryOrderController");
const authorize = require("../../middleware/authorize");

router.get("/", authorize(["delivery"]), deliveryOrderController.getAssignedOrders);

router.patch("/:id/status", authorize(["delivery"]), deliveryOrderController.updateStatus);

module.exports = router;

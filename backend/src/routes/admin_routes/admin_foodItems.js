const express = require("express");
const router = express.Router();
const adminFoodItemsController = require("../../controller/admin_Controller/adminFoodItemsController");
const upload = require("../../utils/uploadImage");

router.get("/", adminFoodItemsController.getAllFoodItems);
router.post("/", upload.single("image"), adminFoodItemsController.createFoodItem);
router.put("/:id", upload.single("image"), adminFoodItemsController.updateFoodItem);
router.delete("/:id", adminFoodItemsController.deleteFoodItem);

module.exports = router;

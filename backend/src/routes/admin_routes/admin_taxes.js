const express = require("express");
const router = express.Router();
const adminController = require("../../controller/admin_Controller/admin_taxesController");

router.get("/", adminController.getSettings);
router.put("/", adminController.updateSettings);

module.exports = router;

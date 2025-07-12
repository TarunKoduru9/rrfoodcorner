// routes/settingsRoutes.js
const express = require("express");
const router = express.Router();
const { getSettings } = require("../../controller/user_Controller/users_settingsController");

router.get("/", getSettings);

module.exports = router;

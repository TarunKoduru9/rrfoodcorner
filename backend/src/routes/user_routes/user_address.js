const express = require("express");
const router = express.Router();
const { addAddress, getAddresses, updateAddress, deleteAddress} = require("../../controller/user_Controller/users_addressController");
const authorize = require("../../middleware/authorize");


router.post("/", authorize("user"), addAddress);
router.get("/", authorize("user"), getAddresses);
router.put("/:id", authorize("user"), updateAddress);
router.delete("/:id", authorize("user"), deleteAddress);


module.exports = router;

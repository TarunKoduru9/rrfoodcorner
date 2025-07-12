const express = require("express");
const router = express.Router();
const {
  getCategoryItems,
  getCategoryKeywords,
  getCategoryFoodTypes,
} = require("../../controller/user_Controller/users_categoryItemController");

router.get("/:id/items", getCategoryItems);
router.get("/:id/keywords", getCategoryKeywords);
router.get("/:id/foodtypes", getCategoryFoodTypes);

module.exports = router;

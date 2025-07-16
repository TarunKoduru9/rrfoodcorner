const express = require("express");
const router = express.Router();
const {
  getCategoryItems,
  getCategoryKeywords,
  getCategoryFoodTypes,
  getAllMenuItems,
  getAllMenuFoodTypes,
  getAllMenuKeywords,
  getAllMenuCategories,
} = require("../../controller/user_Controller/users_categoryItemController");

router.get("/menu/items", getAllMenuItems);
router.get("/menu/foodtypes", getAllMenuFoodTypes);
router.get("/menu/keywords", getAllMenuKeywords);
router.get("/menu/categories", getAllMenuCategories);


router.get("/:id/items", getCategoryItems);
router.get("/:id/keywords", getCategoryKeywords);
router.get("/:id/foodtypes", getCategoryFoodTypes);


module.exports = router;

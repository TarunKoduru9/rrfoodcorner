const express = require('express');
const router = express.Router();
const controller = require('../../controller/admin_Controller/admin_dashitemController');

router.get('/fornewcategories', controller.getAllCategories);

router.get('/fornew-food-items/:categoryId', controller.getFoodItemsByCategory);

router.get('/whatsnew', controller.getWhatsNewItems);
router.post('/whatsnew', controller.setWhatsNewItem);

module.exports = router;

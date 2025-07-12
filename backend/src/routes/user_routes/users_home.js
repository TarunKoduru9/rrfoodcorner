const express = require('express');
const router = express.Router();
const { getCategories, getWhatsNewItems } = require('../../controller/user_Controller/users_homeController');

router.get('/categories', getCategories);
router.get('/whatsnew', getWhatsNewItems);

module.exports = router;

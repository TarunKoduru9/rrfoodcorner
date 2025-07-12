const express = require('express');
const router = express.Router();
const userController = require('../../controller/admin_Controller/admin_userController');

router.get('/with-orders', userController.getUsersWithOrders);

router.get('/:id/orders', userController.getUserOrders);


router.delete('/:id', userController.deleteUser);

module.exports = router;

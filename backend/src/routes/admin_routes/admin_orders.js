const express = require('express');
const router = express.Router();
const orderController = require('../../controller/admin_Controller/admin_orderController');

router.get('/', orderController.getAllOrders);
router.patch('/:id/assign-delivery', orderController.assignDelivery);
router.get('/delivery-users', orderController.getDeliveryUsers);

module.exports = router;

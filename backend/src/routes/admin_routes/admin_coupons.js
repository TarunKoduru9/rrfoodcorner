const express = require("express");
const router = express.Router();
const couponsController = require('../../controller/admin_Controller/admin_couponsController');

router.get('/', couponsController.getAllCoupons);
router.post('/', couponsController.createCoupon);
router.put('/:id', couponsController.updateCoupon);
router.patch('/:id/toggle', couponsController.toggleCouponStatus);
router.delete('/:id', couponsController.deleteCoupon);

module.exports = router;

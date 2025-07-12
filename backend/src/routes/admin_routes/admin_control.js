const express = require('express');
const router = express.Router();
const controlController = require('../../controller/admin_Controller/admin_controlsController');

router.get('/users', controlController.getUsers);

router.post('/users', controlController.createUser);

router.delete('/users/:id', controlController.deleteUser);

router.get('/permissions', controlController.getRolePermissions);

router.post('/permissions', controlController.updatePermission);

module.exports = router;

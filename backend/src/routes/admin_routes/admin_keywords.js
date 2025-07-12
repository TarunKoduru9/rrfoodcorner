const express = require('express');
const router = express.Router();
const keywordController = require('../../controller/admin_Controller/admin_keywordController');

router.get('/', keywordController.getAllKeywords);
router.get('/:id', keywordController.getKeywordById);
router.post('/', keywordController.createKeyword);
router.put('/:id', keywordController.updateKeyword);
router.delete('/:id', keywordController.deleteKeyword);

module.exports = router;

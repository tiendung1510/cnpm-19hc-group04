const express = require('express');
const router = express.Router({});
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const CategoryController = require('./category.controller');

router.get('/', checkTokenMiddleware, CategoryController.getCategories);
router.post('/', checkTokenMiddleware, CategoryController.addCategory);

module.exports = router;
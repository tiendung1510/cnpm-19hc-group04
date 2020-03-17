const express = require('express');
const router = express.Router({});

router.use('/users', require('../modules/user/user.route'));
router.use('/suppliers', require('../modules/supplier/supplier.route'));
router.use('/categories', require('../modules/category/category.route'));
router.use('/products', require('../modules/product/product.route'));

module.exports = router;

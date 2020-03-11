const express = require('express');
const router = express.Router({});

router.use('/users', require('../modules/user/user.route'));

module.exports = router;

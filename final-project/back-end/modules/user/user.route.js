const express = require('express');
const router = express.Router({});
const UserController = require('./user.controller');

router.post('/login', UserController.login);
router.post('/', UserController.addUser);

module.exports = router;

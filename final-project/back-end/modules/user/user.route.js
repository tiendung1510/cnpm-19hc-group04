const express = require('express');
const router = express.Router({});
const UserController = require('./user.controller');
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');

router.get('/', checkTokenMiddleware, UserController.getUsers);
router.post('/login', UserController.login);
router.post('/', checkTokenMiddleware, UserController.addUser);
router.put('/change-password', checkTokenMiddleware, UserController.changePassword);

module.exports = router;

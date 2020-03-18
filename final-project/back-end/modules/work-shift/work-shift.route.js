const router = require('express').Router({});
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const checkManagerRoleMiddleware = require('../../middlewares/check-manager-role.middleware');
const WorkShiftController = require('./work-shift.controller');

router.get('/', checkTokenMiddleware, checkManagerRoleMiddleware, WorkShiftController.getWorkShifts);
router.post('/', checkTokenMiddleware, checkManagerRoleMiddleware, WorkShiftController.addWorkShift);

module.exports = router;
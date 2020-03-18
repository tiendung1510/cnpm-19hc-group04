const router = require('express').Router({});
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const checkManagerRoleMiddleware = require('../../middlewares/check-manager-role.middleware');
const WorkScheduleController = require('./work-schedule.controller');

router.get('/', checkTokenMiddleware, checkManagerRoleMiddleware, WorkScheduleController.getWorkSchedules);
router.post('/', checkTokenMiddleware, checkManagerRoleMiddleware, WorkScheduleController.addWorkSchedule);

module.exports = router;
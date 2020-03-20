const router = require('express').Router({});
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const checkManagerRoleMiddleware = require('../../middlewares/check-manager-role.middleware');
const WorkAssignmentController = require('./work-assignment.controller');

router.get('/assigners/:assignerID', checkTokenMiddleware, WorkAssignmentController.getWorkAssignmentsByAssignerID)
router.post('/', checkTokenMiddleware, checkManagerRoleMiddleware, WorkAssignmentController.addWorkAssignment);

module.exports = router;
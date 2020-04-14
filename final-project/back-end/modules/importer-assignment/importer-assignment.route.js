const router = require('express').Router({});
const importerAssignmentController = require('./importer-assignment.controller');
const checkTokenMiddleware = require('../../middlewares/check-token.middleware');
const checkManagerRoleMiddleware = require('../../middlewares/check-manager-role.middleware');

router.get('/', checkTokenMiddleware, checkManagerRoleMiddleware, importerAssignmentController.getImporterAssignments);

module.exports = router;
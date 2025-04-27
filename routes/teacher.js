const express = require('express');
const router = express.Router();
const {allowRole} = require('../middleware/roleMiddleware');
const teacherController = require('../controllers/teacherController');

router.use(allowRole('teacher'));

router.get('/dashboard', teacherController.dashboard);
router.get('/plan/:planId/tasks', teacherController.groupTasks);
router.get('/task/:taskId/submissions', teacherController.studentTasks);
router.post('/submission/:id/status', teacherController.updateStatus);

module.exports = router;

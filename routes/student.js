const express = require('express');
const router = express.Router();
const {allowRole} = require('../middleware/roleMiddleware');
const studentController = require('../controllers/studentController');
const upload = require('../utils/fileUpload');

router.use(allowRole('student'));

router.get('/dashboard', studentController.dashboard);
router.get('/tasks', studentController.allTasks);
router.get('/tasks/:id', studentController.taskDetail);
router.post('/tasks/:id/submit', upload.single('file'), studentController.submitTask);

module.exports = router;

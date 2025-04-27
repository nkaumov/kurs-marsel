const express = require('express');
const router = express.Router();
const {allowRole} = require('../middleware/roleMiddleware');
const methodistController = require('../controllers/methodistController');

router.use(allowRole('methodist'));

router.get('/dashboard', methodistController.dashboard);

// GROUPS
router.get('/groups', methodistController.groups);
router.post('/groups', methodistController.createGroup);
router.delete('/groups/:id', methodistController.deleteGroup);

// SUBJECTS
router.get('/subjects', methodistController.subjects);
router.post('/subjects', methodistController.createSubject);
router.delete('/subjects/:id', methodistController.deleteSubject);

// STUDENTS
router.get('/students', methodistController.students);
router.post('/students', methodistController.createStudent);
router.delete('/students/:id', methodistController.deleteStudent);

// TEACHERS
router.get('/teachers', methodistController.teachers);
router.post('/teachers', methodistController.createTeacher);
router.delete('/teachers/:id', methodistController.deleteTeacher);

// STUDYPLANS
router.get('/studyplans', methodistController.studyplans);
router.post('/studyplans', methodistController.createStudyPlan);
router.delete('/studyplans/:id', methodistController.deleteStudyPlan);

module.exports = router;

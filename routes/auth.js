const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/', authController.dashboardRedirect);
router.get('/dashboard', authController.dashboardRedirect);
router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

module.exports = router;

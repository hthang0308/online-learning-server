const express = require('express');
const router = express.Router();

const usersController = require('../controllers/UserController');
const verifyToken = require('../middleware/auth');

router.post('/google-login', usersController.googleLogin);
router.post('/login', usersController.login);
router.post('/signup', usersController.signup);
router.put('/change-info', verifyToken, usersController.changeInfo);
router.put('/change-password', verifyToken, usersController.changePassword);
router.put('/become-tutor', verifyToken, usersController.becomeTutor);
router.put('/top-up', verifyToken, usersController.topUp);

module.exports = router;

const express = require('express');
const router = express.Router();

const enrollingController = require('../controllers/EnrollingController');
const verifyToken = require('../middleware/auth');

router.post('/enroll', enrollingController.enroll);
router.put('/get-credit', verifyToken, enrollingController.getCredit);
router.get('/my-enrollment', enrollingController.getMyEnrollment);

module.exports = router;

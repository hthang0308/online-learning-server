const express = require('express');
const router = express.Router();

const enrollingController = require('../controllers/EnrollingController');

router.post('/enrolling/enroll', enrollingController.enroll);
router.get('/enrolling', enrollingController.index);

module.exports = router;

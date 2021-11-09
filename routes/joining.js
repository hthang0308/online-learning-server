const express = require('express');
const router = express.Router();

const joiningController = require('../controllers/JoiningController');

router.post('/join', joiningController.join);
router.get('/', joiningController.index);

module.exports = router;

const express = require('express');
const router = express.Router();

const joiningController = require('../controllers/JoiningController');

router.post('/joining/join', joiningController.join);
router.get('/joining', joiningController.index);

module.exports = router;

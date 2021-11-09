const express = require('express');
const router = express.Router();

const joiningController = require('../controllers/JoiningController');

router.post('/join', joiningController.join);
router.get('/my-joining', joiningController.getHistory);

module.exports = router;

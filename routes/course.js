const express = require('express');
const router = express.Router();

const coursesController = require('../controllers/CourseController');

const verifyToken = require('../middleware/auth');

const Course = require("../models/Course");

// router.post('/courses/create', coursesController.create);
// router.put('/courses/:course_name/update', verifyToken, coursesController.update);
// router.delete('/courses/:course_name/delete', verifyToken, coursesController.delete);
// router.get('/courses/:course_name', coursesController.detail);
// router.get('/courses', ensureAuth, coursesController.index);
router.get('/courses', verifyToken, (req, res, next) => {
    Course.find({})
        .then(courses => res.json(courses))
        .catch(next);
});

module.exports = router;

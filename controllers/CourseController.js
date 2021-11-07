require('dotenv').config();

const Course = require("../models/Course");

class CoursesController {
    // [GET] /api/courses
    index(req, res, next) {
        Course.find({})
            .then(courses => res.json(courses))
            .catch(next);
    };

    // [GET] /api/courses/:course_name
    detail(req, res) {
        Course.find({ courseName })
            .then(courses => res.json(courses))
            .catch(next);

    };

    // [POST] /api/courses/create
    create(req, res, next) {
        const newCourse = new Course(req.body);
        newCourse.save()
            .then(() => res.send('Course created'))
            .catch(err => console.log(err));
    };

    // [PUT] /api/courses/:course_name/update
    update(req, res, next) {
        Course.updateOne({ courseName: req.params.course_name }, req.body)
            .then(() => res.send('Course updated'))
            .catch(next());
    };

    // [DELETE] /api/courses/:course_name/delete
    delete(req, res, next) {
        Course.deleteOne({ courseName: req.params.course_name })
            .then(res.send('Course deleted'))
            .catch(next());
    };

    // post(req, res, next) {}
};

module.exports = new CoursesController;
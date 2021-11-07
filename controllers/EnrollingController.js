require('dotenv').config();

const Enrolling = require("../models/Enrolling");

class EnrollingController {
    // [GET] /api/joining
    index(req, res, next) {
        Enrolling.find({})
            .then(joining => res.json(joining))
            .catch(next);
    };

    // [POST] /api/joining/join
    enroll(req, res, next) {
        const newJoining = new Enrolling(req.body);
        console.log(Date(Date.now()));
        newJoining.save()
            .then(() => res.send('joined'))
            .catch(err => console.log(err));
    };


};

module.exports = new EnrollingController;
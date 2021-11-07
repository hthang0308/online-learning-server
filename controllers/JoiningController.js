require('dotenv').config();

const Joining = require("../models/Joining");


class JoiningController {
    // [GET] /api/joining
    index(req, res, next) {
        Joining.find({})
            .then(joining => res.json(joining))
            .catch(next);
    };

    // [POST] /api/joining/join
    join(req, res, next) {
        const newJoining = new Joining(req.body);
        console.log(Date(Date.now()));
        newJoining.save()
            .then(() => res.send('joined'))
            .catch(err => console.log(err));
    };


};

module.exports = new JoiningController;
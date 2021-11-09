require('dotenv').config();

const Joining = require("../models/Joining");
class JoiningController {
    // [GET] /api/joining
    index(req, res, next) {
        Joining.find({})
            .then(joining => {
                joining[1].time = new Date("2021-11-08T17:58:34 GMT+0700")
                // joining[1].time = joining[1].time.toUTCString()
                res.json(joining[1])
            })
            .catch(next);
    };

    // [POST] /api/joining/join
    join(req, res, next) {
        const newJoining = new Joining(req.body);
        console.log(Date.now());
        newJoining.save()
            .then(() => res.send('joined'))
            .catch(err => console.log(err));
    };


};

module.exports = new JoiningController;
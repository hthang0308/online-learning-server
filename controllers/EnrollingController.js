require('dotenv').config();

const Enrolling = require("../models/Enrolling");
const Course = require("../models/Course");
const User = require("../models/User");

class EnrollingController {
    // [POST] /api/enrolling/enroll
    async enroll(req, res, next) {
        const { course, username } = req.body;

        try {
            const courseInfo = await Course.findOne({ slug: course })
            if (!courseInfo)
                return res.status(400).json({ message: 'Course does not exist' });

            const courseEndingDate = new Date(courseInfo.endingDate);
            const currentDate = new Date();
            if (currentDate > courseEndingDate)
                return res.status(400).json({ message: 'Time is over' });

            const existingUser = await User.findOne({ username });
            if (!existingUser)
                return res.status(404).json({ message: 'User does not exist' });
            const newBalance = existingUser.balance - courseInfo.fee;
            if (newBalance < 0)
                return res.status(404).json({ message: 'User does not have enough money to enroll' });
            const updatedUser = await User.findOneAndUpdate(
                { username },
                { balance: newBalance },
                { new: true }
            )

            const temp = await Enrolling.findOne({ course, username })
            if (temp)
                return res.status(400).json({ message: 'User have already enrolled this course' });

            const newEnrollment = await Enrolling.create({
                course,
                username,
                fee: courseInfo.fee
            })

            res.status(200).json({
                message: 'Enroll course successfully',
                content: newEnrollment._doc
            });
        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };

    // [GET] /api/enrolling/my-enrollment
    async getMyEnrollment(req, res, next) {
        const { username } = req.body;

        try {
            const courses = await Enrolling.find({ username });
            if (!courses)
                return res.status(500).json({ message: "User have no enrollment" })

            const result = await Promise.all(courses.map(async course => {
                const temp = await Course.findOne({ slug: course.course });
                return temp;
            }));

            res.status(200).json({
                message: 'Find successfully',
                content: result
            });
        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };

    // [PUT] /api/enrolling/get-credit
    async getCredit(req, res, next) {
        const { course } = req.body;

        try {
            const courseInfo = await Course.findOne({ slug: course })
            if (!courseInfo)
                return res.status(400).json({ message: 'Course does not exist' });

            const courseEndingDate = new Date(courseInfo.endingDate);
            const currentDate = new Date();
            if (currentDate < courseEndingDate)
                return res.status(400).json({ message: 'The course have not been ended' });

            // get total of money for the tutor
            const userList = await Enrolling.find({ course });
            const sumMoney = userList
                .map(user => user.fee)
                .reduce((prev, next) => prev + next);
            // top up to tutor
            const tutor = await User.findOne({ username: courseInfo.tutor })
            const newBalance = tutor.balance + sumMoney;
            const updatedTutor = await User.findOneAndUpdate(
                { username: courseInfo.tutor },
                { balance: newBalance },
                { new: true }
            )

            // update fee of enrolling
            const temp = await Enrolling.updateMany(
                { course },
                { fee: 0 }
            )

            res.status(200).json({ message: 'Get credit successfully' })

        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };
};

module.exports = new EnrollingController;
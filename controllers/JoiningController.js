require('dotenv').config();

const Joining = require("../models/Joining");
const Course = require("../models/Course");
const User = require("../models/User");
const Enrolling = require("../models/Enrolling");

const GMT = 7 * 60 * 60 * 1000;
const weekday = ["#", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];

const getWeekdayNumber = (daysInWeek) => {
    return daysInWeek.map(day => weekday.indexOf(day.toLowerCase()))
}

const makeDateTimeString = (time) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();

    const res = year + '-'
        + String(month).padStart(2, '0') + '-'
        + String(date).padStart(2, '0') + 'T'
        + time
    return new Date(res)
};

const isValidTime = (startingDate, endingDate, daysInWeek, startingTime) => {
    startingDate = new Date(startingDate)
    startingDate = new Date(startingDate.getTime() - GMT)
    endingDate = new Date(endingDate)
    endingDate = new Date(endingDate.getTime() - GMT)

    var currentDate = new Date();
    // after 30m 
    var futureDate = new Date(currentDate.getTime() + 30 * 60 * 1000);
    // before 30m 
    var pastDate = new Date(currentDate.getTime() - 30 * 60 * 1000);

    // check if the course is not started or have been ended
    if (futureDate < startingDate)
        return false;
    if (pastDate > endingDate) {
        return false;
    }

    let timeToJoin = makeDateTimeString(startingTime);
    // // convert to GMT +7
    timeToJoin = new Date(timeToJoin.getTime());

    if (timeToJoin > futureDate | timeToJoin < pastDate)
        return false;

    daysInWeek = getWeekdayNumber(daysInWeek);
    const dayOfFuture = futureDate.getDay();
    const dayOfPast = pastDate.getDay();
    const indexOfFuture = daysInWeek.indexOf(dayOfFuture);
    const indexOfPast = daysInWeek.indexOf(dayOfPast);
    if (indexOfFuture == -1 && indexOfPast == -1)
        return false;

    return true;
}
class JoiningController {
    // [POST] /api/joining/join
    async join(req, res, next) {
        const { course, username } = req.body;

        try {
            const courseInfo = await Course.findOne({ slug: course });
            if (!courseInfo)
                return res.status(400).json({ message: "Course does not exist" })

            const userInfo = await User.findOne({ username });
            if (!userInfo)
                return res.status(400).json({ message: "User does not exist" })

            const hasEnrolled = await Enrolling.findOne({ username, course })
            if (!hasEnrolled)
                return res.status(400).json({ message: "User has not enrolled this course" })

            const isOnTime = isValidTime(
                courseInfo.startingDate,
                courseInfo.endingDate,
                courseInfo.day,
                courseInfo.time.starting
            )
            if (!isOnTime)
                return res.status(500).json({ message: "User's late or the course is not started" });

            // get date when the user joins
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const date = now.getDate();
            const currentDate = year + '-'
                + String(month).padStart(2, '0') + '-'
                + String(date).padStart(2, '0')

            const alreadyJoin = await Joining.findOne({
                course,
                username,
                date: currentDate
            })
            if (alreadyJoin)
                return res.status(400).json({ message: "User has already joined" });

            // get time
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const currentTime = String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0')
            const newJoining = await Joining.create({
                course,
                username,
                date: currentDate,
                time: currentTime
            })
            res.status(200).json({ message: "Join successfully" });

        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    };

    // [GET] /api/joining/my-joining
    async getHistory(req, res, next) {
        const { username } = req.body;

        try {
            const history = await Joining.find({ username });

            res.status(200).json({
                message: "Get joining history successfully",
                content: history
            });
        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };
};

module.exports = new JoiningController;
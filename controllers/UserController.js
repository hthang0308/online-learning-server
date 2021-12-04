require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require("../models/User");
const { phoneNumberPattern, emailPattern } = require('../config/patterns');

const checkConstraints = (user) => {
    // check if username has any space
    if (user.username?.split(' ').length > 1)
        return false;
    if (user.username && user.username.length == 0)
        return false;

    // check if password length < 6
    if (user.password?.length < 6)
        return false;

    // check if phone does not contain exactly 10 number
    if (user.phone && !phoneNumberPattern.test(user.phone))
        return false;

    // check if email is wrong
    if (user.email && !emailPattern.test(user.email))
        return false;

    // check role
    if (user.role && (user.role != 'student' && user.role != 'tutor'))
        return false;

    // check balance
    if (user.balance && user.balance < 0)
        return false;

    return true;
};

class UsersController {
    // [POST] /api/google-login
    async googleLogin(req, res, next) {
        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (!existingUser)
                try {
                    if (!checkConstraints(req.body))
                        return res.status(400).json({ message: "Given user's information is invalid" });

                    const hashedPassword = await bcrypt.hash(password, 10);

                    const result = await User.create({ ...req.body, password: hashedPassword });

                    const accessToken = jwt.sign(result.username, process.env.ACCESS_TOKEN_SECRET);
                    res.status(200).json({
                        message: 'Signup with google successfully',
                        content: {
                            ...result._doc, 'accessToken': accessToken
                        }
                    });

                } catch (err) {
                    res.status(500).json({ message: "Server error" })
                }

            const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
            if (!isCorrectPassword)
                return res.status(400).json({ message: 'Invalid password' });

            const accessToken = jwt.sign(existingUser.username, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({
                message: 'Login with google successfully',
                content: {
                    ...existingUser._doc, 'accessToken': accessToken
                }
            });

        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };

    // [POST] /api/login
    async login(req, res, next) {
        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (!existingUser)
                return res.status(404).json({ message: 'User does not exist' });

            const isCorrectPassword = await bcrypt.compare(password, existingUser.password);
            if (!isCorrectPassword)
                return res.status(400).json({ message: 'Invalid password' });

            const accessToken = jwt.sign(existingUser.username, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({
                message: 'Login successfully',
                content: {
                    ...existingUser._doc, 'accessToken': accessToken
                }
            });

        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };

    // [POST] /api/signup
    async signup(req, res, next) {
        if (!checkConstraints(req.body))
            return res.status(400).json({ message: "Given user's information is invalid" });

        const { username, password } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (existingUser)
                return res.status(400).json({ message: 'User already exists' });

            const hashedPassword = await bcrypt.hash(password, 10);

            const result = await User.create({ ...req.body, password: hashedPassword });

            const accessToken = jwt.sign(result.username, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({
                message: 'Signup successfully',
                content: {
                    ...result._doc, 'accessToken': accessToken
                }
            });

        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };

    // [PUT] /api/user/change-info
    async changeInfo(req, res, next) {
        if (!checkConstraints(req.body))
            return res.status(400).json({ message: "Given user's information is invalid" });

        const { username } = req.body;
        delete req.body["password"];

        try {
            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                req.body,
                { new: true }
            );

            if (!updatedUser)
                return res.status(400).json({ message: "User dose not exist" });


            const accessToken = jwt.sign(updatedUser.username, process.env.ACCESS_TOKEN_SECRET);

            res.status(200).json({
                message: 'Change info successfully',
                content: {
                    ...updatedUser._doc, 'accessToken': accessToken
                }
            });
        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };

    // [PUT] /api/user/change-password
    async changePassword(req, res, next) {
        const { username, currentPassword, newPassword } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (!existingUser)
                return res.status(400).json({ message: 'User doest not exist' });
            let isCorrectPassword = await bcrypt.compare(currentPassword, existingUser.password);
            if (!isCorrectPassword)
                return res.status(400).json({ message: 'Wrong password' });

            isCorrectPassword = newPassword.length >= 6;
            if (!isCorrectPassword)
                return res.status(400).json({ message: 'New password must be at least 6 characters' });

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                { password: hashedPassword },
                { new: true }
            );

            const accessToken = jwt.sign(updatedUser.username, process.env.ACCESS_TOKEN_SECRET);

            res.status(200).json({
                message: 'Change password successfully',
                content: {
                    ...updatedUser._doc, 'accessToken': accessToken
                }
            });

        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    };

    // [PUT] /api/user/become-tutor
    async becomeTutor(req, res, next) {
        const { username } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (!existingUser)
                return res.status(404).json({ message: 'User does not exist' });

            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                { role: "tutor" },
                { new: true }
            );

            const accessToken = jwt.sign(updatedUser.username, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({
                message: 'Change role successfully',
                content: {
                    ...updatedUser._doc, 'accessToken': accessToken
                }
            });

        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    }

    // [PUT] /api/user/top-up
    async topUp(req, res, next) {
        const { username, amount } = req.body;

        try {
            const existingUser = await User.findOne({ username });
            if (!existingUser)
                return res.status(404).json({ message: 'User does not exist' });

            if (amount < 0)
                return res.status(404).json({ message: 'Amount must be a positive number' });

            const newBalance = amount + existingUser.balance;
            const updatedUser = await User.findOneAndUpdate(
                { username: username },
                { balance: newBalance },
                { new: true }
            );

            const accessToken = jwt.sign(updatedUser.username, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({
                message: 'Top up successfully',
                content: {
                    ...updatedUser._doc, 'accessToken': accessToken
                }
            });
        } catch (err) {
            res.status(500).json({ message: "Server error" })
        }
    }
};

module.exports = new UsersController;
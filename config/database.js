require('dotenv').config();

const mongoose = require('mongoose');

const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${db_username}:${db_password}@courses-management.h2myy.mongodb.net/courses-management?retryWrites=true&w=majority`)
        console.log("MongoDB connected")
    } catch (err) {
        console.log("MongoDB not connected")
    }
};

module.exports = connectDB;
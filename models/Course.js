const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    courseName: {
        type: String,
        require: true
    },

    slug: {
        type: String,
        require: true,
        unique: true,
    },

    fee: {
        type: Number,
        require: true
    },

    tutor: {
        type: String,
        require: true
    },

    rating: [{
        username: String,
        star: Number,
        _id: false
    }],

    description: {
        type: String,
        default: ""
    },

    picture: {
        type: String,
        default: ""
    },

    time: {
        starting: String,
        ending: String
    },

    day: {
        type: Array,
        require: true
    },

    startingDate: {
        type: String,
        require: true
    },

    endingDate: {
        type: String,
        require: true
    }
}, { versionKey: false });

module.exports = mongoose.model('courses', CourseSchema);

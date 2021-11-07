const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EnrollingSchema = new Schema({
    course: {
        type: String,
        require: true
    },

    username: {
        type: String,
        require: true
    },

    fee: {
        type: Number,
        require: true
    }
}, { versionKey: false });

module.exports = mongoose.model('enrolling', EnrollingSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JoiningSchema = new Schema({
    course: {
        type: String,
        require: true
    },

    username: {
        type: String,
        require: true
    },

    date: {
        type: String,
        require: true
    },

    time: {
        type: String,
        require: true
    }
}, { versionKey: false });

module.exports = mongoose.model('joining', JoiningSchema);

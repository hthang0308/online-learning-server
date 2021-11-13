const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },

    password: {
        type: String,
        require: true
    },

    fullName: {
        type: String,
        require: true
    },

    phone: {
        type: String,
        default: ''
    },

    email: {
        type: String,
        require: true,
    },

    picture: {
        type: String,
        default: ''
    },

    role: {
        type: String,
        default: "student"
    },

    balance: {
        type: Number,
        default: 0
    }

}, { versionKey: false });

module.exports = mongoose.model('users', UserSchema);
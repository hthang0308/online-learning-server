const express = require('express');

const coursesRouter = require('./course');
const usersRouter = require('./user');
const joiningRouter = require('./joining');
const enrollingRouter = require('./enrolling');

const routes = (app) => {
    // for form
    app.use(express.urlencoded({
        extended: true
    }));
    // for axios
    app.use(express.json());

    app.use('/api/courses', coursesRouter);
    app.use('/api/user', usersRouter);
    app.use('/api/joining', joiningRouter);
    app.use('/api/enrolling', enrollingRouter);
}

module.exports = routes;
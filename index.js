require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const app = express();

const connectDB = require('./config/database');
const routes = require('./routes');
const cors = require('cors');

const port = process.env.PORT || 5000;

// HTTP logger
app.use(morgan('dev'));

// connect to database
connectDB();

// allow access from any localhost port
app.use(cors({ origin: "*" }));
// routes
routes(app);

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
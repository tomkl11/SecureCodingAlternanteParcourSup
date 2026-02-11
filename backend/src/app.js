const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const schoolRoutes = require('./routes/schools');
const applicationRoutes = require('./routes/applications');
const app = express();


// Middlewares
app.use(cors({origin:true, credentials:true}));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', schoolRoutes);
app.use('/api', applicationRoutes);
module.exports = app;
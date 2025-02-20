const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const userRouter = require('./routes/userRouts');
const transactionRouter = require('./routes/transactionRoute');
const budgetRouter = require('./routes/budgetRoute');
const cookieParser = require('cookie-parser')

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());



// ROUTES
app.use('/api/v1/transation', transactionRouter);
app.use('/api/v1/budget', budgetRouter);
app.use('/api/v1/user', userRouter);
app.all('*', (req, res, next) => {
    try {
        res.status(404).json({
            message: `Can't find ${req.originalUrl} on this server!`, success: false
        });
        next();
    } catch (error) {
        res.status(404).json({
            message: `Can't find on this server!`, success: false
        });
    }
});

module.exports = app;
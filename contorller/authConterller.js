const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { promisify } = require('util')
const jwt = require('jsonwebtoken')

exports.signup = async (req, res) => {
    try {
        const { email, password, name } = req.body
        const User = await userModel.findOne({ email: email });
        if (User) {
            return res.status(409).json({ message: 'User is already exist', success: false })
        };

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({ email, name, password: hashPassword });
        const token = jwt.sign({ email: newUser.email, _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };
        res.cookie('financejwt', token, cookieOptions);
        return res.status(201).json({ message: newUser, token, success: true })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', success: false })
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const User = await userModel.findOne({ email: email }).select('+password');
        if (!User) {
            return res.status(403).json({ message: 'User is not exist', success: false })
        };

        const matchPass = await bcrypt.compare(password, User.password);
        if (!matchPass) {
            return res.status(403).json({ message: 'Invalid credential', success: false })
        };

        const token = jwt.sign({ email: User.email, _id: User._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
        };
        res.cookie('financejwt', token, cookieOptions);
        res.status(200).json({
            message: 'login success',
            success: true,
            token,
            email,
            user: User.name
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
};

exports.logout = async (req, res) => {
    try {
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.financejwt) {
            token = req.cookies.financejwt;
        }
        if (!token) {
            console.log('No auth token found');
            return res.status(404).json({ message: 'No auth token found', success: false });
        }
        res.clearCookie('financejwt');
        res.status(200).json({ message: 'Logged out successfully', success: true });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.financejwt) {
        token = req.cookies.financejwt;
    }

    if (!token) {
        return res.status(401).json({ message: 'You are not logged in! Please log in to get access.', success: false })
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await userModel.findById(decoded._id);
    if (!currentUser) {
        return res.status(401).json({ message: 'The user belonging to this token does no longer exist.', success: false });
    };

    req.user = currentUser;
    next();
};
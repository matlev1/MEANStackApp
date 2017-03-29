"use strict"
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

// Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {

        if (err) {
            res.json({ success: false, msg: 'Failed to register User', errmsg: err.errmsg });
        } else {
            res.json({ success: true, msg: 'User successfully registered!' });
        }
    });
});

// Authenticate
router.post('/authenticate', (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 //1 week
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({ success: false, msg: 'Wrong password' });
            }
        });
    });
});

// Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});

// Remove User
router.delete('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    User.remove({ _id: req.user._id }, (err) => {
        res.json({ result: err ? 'error' : 'ok' });
    });
});

//Update User
router.post('/update', passport.authenticate('jwt', { session: false }), (req, res, next) => {

    if (req.body.name) var newName = req.body.name;
    if (req.body.username) var newUsername = req.body.username;
    if (req.body.email) var newEmail = req.body.email;
    if (req.body.password) var newPassword = req.body.password;

    User.getUserById({ _id: req.user._id }, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({ success: false, msg: 'User not found' });
        } else {

            user.name = newName;
            user.username = newUsername;
            user.email = newEmail;

            if (newPassword === '' || newPassword === undefined) {

                User.addUser(user, (err, user) => {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to update User', errmsg: err.errmsg });
                    } else {
                        res.json({ success: true, msg: 'User successfully updated!' });
                    }
                });

            } else {
                user.password = newPassword;

                User.addUser(user, (err, user) => {
                    if (err) {
                        res.json({ success: false, msg: 'Failed to update User', errmsg: err.errmsg });
                    } else {
                        res.json({ success: true, msg: 'User successfully updated!' });
                    }
                });
            }
            user.save();
        }
    });

});


module.exports = router;

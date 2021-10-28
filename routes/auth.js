/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");

const router = new express.Router();

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async(req, res, next) => {
    try {
        const { username } = await User.register(req.body);
        const token = jwt.sign({username}, SECRET_KEY);
        return res.json({ token });
    } catch(e) {
        if (e.code === '23505') {
            return next(new ExpressError("Sorry, that username is taken. Please try another.", 400));
        };
        return next(e);
    };
});

router.post('/login', async(req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return next (new ExpressError("Must provide username and password to log in.", 400));
        };
        const isLoggedIn = await User.authenticate(username, password);
        if (isLoggedIn) {
            const token = jwt.sign({username}, SECRET_KEY);
            return res.json({ message: `${username} logged in.`, token });
        };
        throw new ExpressError("Invalid username/password combination.", 400);
    } catch (e) {
        return next(e);
    };
});

 module.exports = router;
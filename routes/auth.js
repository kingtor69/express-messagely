/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET_KEY } = require("../config");

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

 module.exports = router;
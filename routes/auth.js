/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
const express = require("express");
const jwt = require("jsonwebtoken");

const router = new express.Router();

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async(req, res, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        if (!username || 
            !password ||
            !first_name ||
            !last_name ||
            !phone) {
                throw new ExpressError("Some required information is missing.", 400);
        };
        await User.register(username, password, first_name, last_name, phone);
        const token = jwt.sign({username}, SECRET_KEY);
        return res.json({ username, token });
    } catch(e) {
        if (e.code === '23505') {
            return next(new ExpressError("Sorry, that username is taken. Please try another.", 400));
        };
        return next(e);
    };
});

 module.exports = router;
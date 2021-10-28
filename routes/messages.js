/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
const express = require("express");
const ExpressError = require("../expressError");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Message = require("../models/message");

const router = new express.Router();
 
/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async (req, res, next) => {
    try {
        const newMessage = await Message.create(req.user.username, req.body.to_username, req.body.body);
        return res.json(newMessage);
    } catch (e) {
        return next(e);
    };
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureLoggedIn, async(req, res, next) => {
    try {
        const message = await Message.get(req.params.id);
        if (message.from_user.from_username !== req.user.username) {
            throw new ExpressError("User unauthroized to mark this message read.", 400);
        };
        const readMessage = await Message.markRead(message.id);
        return res.json({message: readMessage});
    } catch(e) {
        return next(e);
    };
});

module.exports = router;
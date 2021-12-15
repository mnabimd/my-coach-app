const express = require('express');
const auth = require('../../middleware/auth');
const {
    nanoid
} = require('nanoid');

// Load in User:-
const Users = require('../../db/models/User');

const {updateMessagesAlert} = require('../utils/Notify');
const router = new express.Router();

router.post('/api/notification', auth, async (req, res) => {
    // Notification type:- messagesNotification, adminMessage and maybe more 
    const type = req.body.type;

    if (type === 'message') {
        const state = req.body.messageState;

        try {
            await updateMessagesAlert(req.user._id, state);

            res.send({
                message: 'Message Notification Updated.'
            })
        } catch (e) {
            res.status(500).send({
                e
            })
        }
    }


})

module.exports = router;
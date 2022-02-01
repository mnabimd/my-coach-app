const express = require('express');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const {
    nanoid
} = require('nanoid');

// Load in User:-
const Coach = require('../../db/models/Coach');
const Messages = require('../../db/models/Messages');
const Users = require('../../db/models/User');
const Course = require('../../db/models/Course');

const {
    updateMessagesAlert
} = require('../utils/Notify');
const router = new express.Router();

router.put('/registerAsCoach/:userId', auth, async (req, res) => {

    let coachData = req.body;

    // Set user userId similar to the id
    coachData['userId'] = coachData._id;

    const response = await Coach.create(coachData);

    res.send({
        message: 'User has been  added as coach.~'
    })
});


router.get('/api/coaches', async (req, res) => {
    let loadCoaches = await Coach.findAll({
        where: {
            requestApproved: true
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    const coachesIds = loadCoaches.map(coach => coach._id);

    const getBio = await Users.findAll({
        where: {
            _id: coachesIds
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });



    let coaches = loadCoaches.map((coach, index) => {

        coach.dataValues.firstname = getBio[index].dataValues.firstname;
        coach.dataValues.lastname = getBio[index].dataValues.lastname;
        coach.dataValues.profile = getBio[index].dataValues.profile;

        return coach.dataValues;
    });

    for (let i = 0; i < coaches.length; i++) {
        let courses = await Course.findAll({
            where: {
                coachId: coaches[i]._id
            }
        })

        courses = courses.map(course => course.dataValues);

        coaches[i].courses = courses;
    }

    res.send(coaches);
});

router.post('/coaches/:coachId/contact', auth, async (req, res) => {
    // const coachId = req.params.coachIdUser;
    try {

        const theMessage = req.body.theMessage;

        if (!theMessage) {
            return res.status(400).send({
                message: 'Please make sure to include your message and email address.'
            });
        }

        // Add unique id
        theMessage['_id'] = nanoid();

        await Messages.create(theMessage);

        // ----------------- Also, notify the other user that he/she has recieved a message

        await updateMessagesAlert(theMessage.userId, true);

        res.send({
            message: 'Your message has been sent!'
        })

    } catch (e) {
        res.status(500).send({
            message: 'Failed sending message. Please contact for further assistance.',
            error: e
        });

        console.log(e)
    }

});


router.get('/messages', auth, async (req, res) => {
    const userId = req.user._id;

    let messages = await Messages.findAll({
        where: {
            userId,
        },
        order: [
            ['createdAt', 'DESC']
        ]
    });

    let globalMessages = await Messages.findAll();

    let adminMessages = [];
    let coachesMessages = [];
    let usersMessages = [];


    globalMessages.forEach(message => {
        if (message.senderId.includes('admins')) {
            adminMessages.push(message.dataValues)
        } 
        if (message.senderId.includes('coaches')) {
            coachesMessages.push(message.dataValues)
        } 
        if (message.senderId.includes('users')) {
            usersMessages.push(message.dataValues)
        }
    })
    
    messages = messages.map(message => message.dataValues);

    let allMessages = [...messages, ...usersMessages, ...coachesMessages, ...adminMessages];

    allMessages = [...new Set(allMessages)]; //Remove duplicates by calling ...new Set(array);

    const sortedMessages = allMessages.sort((a, b) => {
        return b.createdAt - a.createdAt;
    });

    res.json(sortedMessages)
})

module.exports = router;
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
const Coaches = require('../../db/models/Coach');
const Courses = require('../../db/models/Course');

const router = new express.Router();

router.get('/api/admins/allUsers', auth, isAdmin, async (req, res) => {
    const userId = req.user._id;

    let allUsers = await Users.findAll();

    allUsers = allUsers.map(user => {

        delete user.dataValues.tokens;
        delete user.dataValues.password;

        return user;
    });

    let coaches = await Coach.findAll();

    const users = allUsers.filter(user => {
        const isNotCoach = coaches.findIndex(coach => coach._id === user._id);

        if (!user.isAdmin && isNotCoach === -1) {
            return user
        }
    });
    const admins = allUsers.filter(user => user.isAdmin === true);

    if (coaches) {

        coaches = coaches.map(coach => {
            const coachBio = allUsers.filter(user => user._id === coach._id)[0];

            if (!coachBio) return false;

            coach.dataValues['firstname'] = coachBio.firstname;
            coach.dataValues['lastname'] = coachBio.lastname;
            coach.dataValues['email'] = coachBio.email;
            coach.dataValues['messageAlert'] = coachBio.messageAlert;
            coach.dataValues['profile'] = coachBio.profile;
            coach.dataValues['isAdmin'] = coachBio.isAdmin;

            return coach;
        })
    }


    res.send({
        admins,
        coaches,
        users
    })
});

router.get('/api/admins/courses', auth, isAdmin, async (req, res) => {
    const courses = await Courses.findAll();

    res.send(courses);
})

router.delete('/api/admins/removeAsCoach', auth, isAdmin, async (req, res) => {
    const coachId = req.body.id;

    try {
        await Coach.destroy({
            where: {
                _id: coachId
            }
        })

        res.send({
            message: 'User has been removed as a coach, successfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || "Failed to remove user as a coach. Please try later"
        })
    }
});

router.delete('/api/admins/deleteUser', auth, isAdmin, async (req, res) => {
    const userId = req.body.id;

    try {
        await Users.destroy({
            where: {
                _id: userId
            }
        });

        res.send({
            message: 'User has been deleted, successfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || "Failed to delete user. Please try later"
        })
    }
});

router.post('/api/admins/promoteAsAdmin', auth, isAdmin, async (req, res) => {
    const userId = req.body.id;

    try {
        const user = await Users.update({
            isAdmin: true
        }, {
            where: {
                _id: userId
            }
        })

        res.send({
            message: 'User has been deleted, successfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || "Failed to promote user. Please try later"
        })
    }
});

router.post('/api/admins/demoteAsAdmin', auth, isAdmin, async (req, res) => {
    const userId = req.body.id;

    try {
        const user = await Users.update({
            isAdmin: true
        }, {
            where: {
                _id: userId
            }
        })

        res.send({
            message: 'User has been demoted as Admin, successfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || "Failed to demote as Admin. Please try later"
        })
    }
});

router.post('/api/admins/coachApproval', auth, isAdmin, async (req, res) => {
    const coachId = req.body.coachId;
    const approval = req.body.approval;

    try {
        if (approval === true) {
            const coach = await Coaches.update({
                requestApproved: approval
            }, {
                where: {
                    _id: coachId
                }
            })
        } else if (approval === false) {
            await Coach.destroy({
                where: {
                    _id: coachId
                }
            })
        }

        res.send({
            message: 'Coach approval has been updated, successfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || "Failed to update approval. Please try later"
        })
    }
});

router.delete('/api/admins/deleteCourse', auth, isAdmin, async (req, res) => {
    const courseId = req.body.courseId;

    try {
        await Courses.destroy({
            where: {
                _id: courseId
            }
        });

        res.send({
            message: 'Course has been deleted, successfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || "Failed to delete course. Please try later"
        })
    }
})
module.exports = router;
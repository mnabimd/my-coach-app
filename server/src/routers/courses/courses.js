const express = require('express');
const auth = require('../../middleware/auth');
const {
    nanoid
} = require('nanoid');

// Load in User:-
const Coach = require('../../db/models/Coach');
const Users = require('../../db/models/User');
const Course = require('../../db/models/Course');
const router = new express.Router();

router.get('/api/courses', async (req, res) => {

    const coaches = await Coach.findAll();
    const coachesIds = coaches.map(coach => coach._id);

    const coachesBio = await Users.findAll({
        where: {
            _id: coachesIds
        }
    });


    if (!coaches) {
        return res.status(404).send({
            message: 'No courses found.'
        })
    }

    const courses = [];

    for (let i = 0; i < coaches.length; i++) {
        const coachId = coaches[i]._id;

        let coachCourses = await Course.findAll({
            where: {
                coachId: coachId
            }
        });

        coachCourses = coachCourses.map(course => course.dataValues);


        const trainer = {
            id: coachId,
            firstname: coachesBio[i].dataValues.firstname,
            lastname: coachesBio[i].dataValues.lastname,
            hourlyRate: coaches[i].dataValues.hourlyRate,
            language: coaches[i].dataValues.language
        }

        coachCourses.forEach(course => {
            course.coach = trainer
        });

        courses.push(coachCourses);
    }


    const allCourses = [];

    courses.forEach((course) => {
        course.forEach(courseObj => {
            allCourses.push(courseObj)
        })
    })

    const sortedCourses = allCourses.sort((a, b) => {
        return b.timestamp - a.timestamp;
    });

    res.send(sortedCourses)
})

router.post('/api/addCourse', auth, async (req, res) => {

    // CoachId or UserID, doesnt matter;
    const coachId = req.user._id;

    if (!req.body.course.name || !req.body.course.description || !req.body.course.goals || !req.body.course.requirements || !req.body.course.timestamp) {
        return false;
    }

    const newCourse = req.body.course;
    newCourse['coachId'] = coachId;
    newCourse['_id'] = nanoid();

    try {
        await Course.create(newCourse);

        res.send({
            message: 'Course added, succesfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || 'Failed adding new course.'
        })
    }
});

router.post('/api/editCourse', auth, async (req, res) => {

    const coachId = req.user._id;
    const courseId = req.body.course.courseId;


    if (!courseId || !req.body.course.name || !req.body.course.description || !req.body.course.goals || !req.body.course.requirements) {
        return false;
    }

    const editedCourse = req.body.course;

    try {
        const updatedCourse = await Course.update(editedCourse, {
            where: {
                _id: courseId,
                coachId: coachId
            }
        });

        res.send({
            message: 'Course updated, succesfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || 'Failed editing new course.'
        })
    }
});

router.delete('/api/deleteCourse', auth, async (req, res) => {
    const coachId = req.user._id;
    const courseId = req.body.courseId;

    if (!courseId) return res.status(401).send({message: 'Please select a course first with an id'})

    try {
        
        await Course.destroy({
                where: {
                    _id: courseId,
                    coachId: coachId
                }
        })
        res.send({
            message: 'Course has been deleted, succesfully.'
        })
    } catch (e) {
        res.status(500).send({
            message: e || 'Failed deleting the course.'
        })
    }
})



module.exports = router;
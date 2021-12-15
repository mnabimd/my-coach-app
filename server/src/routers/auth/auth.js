const express = require('express');
const auth = require('../../middleware/auth');
const bcrypt = require('bcrypt');
const {
    nanoid
} = require('nanoid');
const jwt = require('jsonwebtoken');
const validateCredentials = require('./utils/validate');

// Load in User:-
const User = require('../../db/models/User');
const router = new express.Router();



// ----------------- OUR STATIC DB ---------------------

async function findByCredintials(email, password) {

    // const user = await db.get("users").value().find(user => user.username === username);

    const user = await User.findOne({
        where: {
            email
        }
    })

    if (!user) {
        return {
            error: 'No user found with this email',
            status: false
        }
    }

    // password = the entered password || user.password = the hashed password in DB
    const passwordIsMatch = await bcrypt.compare(password, user.password)

    if (!passwordIsMatch) {
        return {
            error: 'Password does not match',
            status: false
        }
    }

    return {
        error: null,
        status: true,
        userId: user._id
    }
}

async function emailExists(email) {

    const usernameIsDuplicate = await User.findOne({
        where: {
            email
        }
    })

    if (usernameIsDuplicate) {
        return true
    } else {
        return false
    }
}

async function usersExists() {
    const users = await User.findAll();

    if (users.length !== 0) {
        return true
    } else {
        return false;
    }
}
// ---------------- --------------- ----------------------

// ---------------- Token Generation Functions --------------------
function generateToken(payload) {
    return jwt.sign(payload, 'qwe')
}
// ---------------- --------------- -------------------------------

router.post('/signIn', async (req, res) => {

    const inputsValidity = validateCredentials(null, req.body.email, req.body.password, {
        authWith: 'email',
        passwordLength: 8,
    })

    // If inputs are invalid
    if (!inputsValidity.status) {
        return res.status(400).send(inputsValidity)
    }

    // Let's search this user in Database first (in our case the users array)
    const userIsInDb = await findByCredintials(req.body.email, req.body.password)

    // If user is not in DB, that means the credinitals are wrong.
    if (!userIsInDb.status) {
        return res.status(403).send(userIsInDb)
    }

    // Otherwise, let's send the token, yeah!

    const token = generateToken({
        _id: userIsInDb.userId
    })


    // Let's push this token now to the user that just logged in

    let user = await User.findOne({
        where: {
            _id: userIsInDb.userId
        }
    });

    // First, let's convert our tokens array back from String to Array

    const tokens = JSON.parse(user.tokens);

    // Let's push this new token to tokens:-
    tokens.push({
        _id: nanoid(),
        token
    })

    // Let's change our tokens back from Array to String

    JSON.stringify(tokens);

    // Now let's update our user and overwrite our old tokens with new tokens
    await User.update({
        tokens
    }, {
        where: {
            _id: userIsInDb.userId
        }
    })

    // Let's delete user tokens and password

    delete user.dataValues.tokens;
    delete user.dataValues.password;

    res.send({
        localId: userIsInDb.userId,
        idToken: token,
        userData: user
    })

})

router.post('/signUp', async (req, res) => {

    // First let's run validations if user inputs are correct:-
    const inputsValidity = validateCredentials(null, req.body.email, req.body.password, {
        authWith: 'email',
        passwordLength: 8,
    });

    // If inputs are invalid
    if (!inputsValidity.status) {
        return res.status(400).send(inputsValidity)
    }

    // Till now, user has typed the credentials correctly, but now we should prevent a duplicate username in our db

    // Get latest updates from db

    if (await emailExists(req.body.email)) {
        return res.status(409).send({
            error: `email ${req.body.email} is already taken`
        })
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 8);

    // Add the user to the database or whatsoever, here we'll just use an example
    const newUser = {
        _id: nanoid(),
        email: req.body.email,
        password: hashedPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        tokens: []
    }

    const doUsersExists = await usersExists();
    
    // Check, if this user is the first person to database. If yes, make him/her admin
    if (!doUsersExists) {
        newUser['isAdmin'] = true
    }

    // Let's generated and attach token to this created user
    const token = generateToken({
        _id: newUser._id
    });

    newUser.tokens.push({
        _id: nanoid(),
        token
    })

    // Note: MYSQL Database doesn't support Objects or Arrays, so there for we have to strinify our tokens array

    JSON.stringify(newUser.tokens);

    const user = await User.create(newUser);
    // Let's delete user tokens and password

    delete user.dataValues.tokens;
    delete user.dataValues.password;

    // You can send whatever you want, but here we'll just send the generated user

    res.send({
        localId: newUser._id,
        idToken: token,
        userData: user
    })

})

router.post('/signOut', auth, async (req, res) => {
    // If the user is logged in, that means in (req) param, we have already attached the (req.user)
    try {
        // Remove the user's token from DB, simple:-

        const updatedUser = await User.findOne({
            where: {
                _id: req.user._id
            }
        });

        const tokens = JSON.parse(updatedUser.dataValues.tokens);


        const newTokens = tokens.filter(token => token.token !== req.token);

        await User.update({
            tokens: newTokens
        }, {
            where: {
                _id: req.user._id
            }
        });



        res.send({
            message: 'Logging you out'
        })
    } catch (e) {
        res.status(500).send()
    }
});

router.post('/api/editProfile', auth, async (req, res) => {
    // The user
    const theUser = req.user;

    // Step 1. Let's update user's username and password

    // Let's check the inputs firsts

    // If password was provided, skip is otherwise don't

    let skipPassword = !!!req.body.password;
    let skipEmail = !!!req.body.email;

    const validateInputs = validateCredentials(null, req.body.email, req.body.password, {
        passwordLength: 8,
        skipPassword,
        skipUsernameEmail: skipEmail,
        authWith: 'email'
    });

    if (!validateInputs.status) {
        return res.status(500).send({
            ...validateInputs
        })
    }

    // If no username is provided then no need to check the exisitng user

    if (!skipEmail) {
        if (await emailExists(req.body.email)) {
            return res.status(409).send({
                error: `Email ${req.body.email} is already taken!`
            })
        }
    }

    if (req.body.password) {
        // If only password was provided

        var hashedPassword = await bcrypt.hash(req.body.password, 8);

        await User.update({
            password: hashedPassword,
            tokens: []
        }, {
            where: {
                _id: theUser._id
            }
        })
    }

    await User.update({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        tokens: []
    }, {
        where: {
            _id: theUser._id
        }
    })

    res.send({
        message: 'You have successfully changed your credentials.'
    })
})


router.post('/deleteAccount', auth, async (req, res) => {

    await User.destroy({
        where: {
            _id: req.user._id
        }
    })

    res.send({
        message: 'Your account has been deleted successfully'
    })

});

router.post('/api/updatePhoto', auth, async (req, res) => {

    const imageBlob = req.body.imageBlob;

    if (!imageBlob) return res.status(401).send({
        message: 'Please upload a photo.'
    })

    await User.update({
        profile: imageBlob
    }, {
        where: {
            _id: req.user._id
        }
    })

    res.send({
        message: 'Profile photo has been updated successfully.'
    })
})


module.exports = router;
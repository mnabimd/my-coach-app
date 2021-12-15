const jwt = require('jsonwebtoken')
const User = require('../db/models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, 'qwe')

        const user = await User.findOne({
            where: {
                _id: decoded._id,
            }
        })

        // Also, if the foundedUser (user) has the matched token

        // But first, let's convert our tokens back from String to Array

        const tokens = JSON.parse(user.dataValues.tokens);

        let tokenMatched = tokens.some(tokenObj => tokenObj.token === token);


        if (!user || !tokenMatched) {
            throw new Error()
        }

        req.token = token
        req.user = user.dataValues
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate', e })
    }
}

module.exports = auth
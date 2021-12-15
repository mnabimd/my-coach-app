const User = require('../db/models/User');

const isAdmin = async (req, res, next) => {

    const user = req.user;

    if (user.isAdmin) {
        return next()
    } else {
        res.status(401).send({
            message: `You don't have the priveliges to access this data. Please contact admin.`,
        })
    }

}

module.exports = isAdmin
const User = require('../../db/models/User');

module.exports = {
    promoteToAdmin: async (userId) => {
        const user = await User.updateOne({
            isAdmin: true
        }, {
            where: {
                _id: userId
            }
        })
    },
    deomoteFromAdmin: async (userId) => {
        const user = await User.updateOne({
            isAdmin: false
        }, {
            where: {
                _id: userId
            }
        })
    }
}
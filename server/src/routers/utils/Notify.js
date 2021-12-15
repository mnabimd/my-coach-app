const Users = require('../../db/models/User');

module.exports = {
    async updateMessagesAlert(userId, state = true) {
        await Users.update({
            messageAlert: state
        }, {
            where: {
                _id: userId
            }
        })
    }
}
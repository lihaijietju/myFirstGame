const Sequelize = require('sequelize')
const config = require('../config')

module.exports = {
    updateAccountTime: async function (Game_account, account) {
        let targetAccount = await Game_account.findOne({
            where: {
                account: account,
            }
        })
        targetAccount.updatetime = +new Date();
        await targetAccount.save();
    },
    getSqlConnection: function () {
        return new Sequelize(config.database.database, config.database.username, config.database.password, {
            host: config.database.host,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                idle: 30000
            },
            logging:false
        });
    }
}

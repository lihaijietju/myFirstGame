const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_account = sequelize.define('game_account', {
    account: Sequelize.STRING(40),
    password: Sequelize.STRING(40),
    updatetime: Sequelize.STRING(40),
    isdanger:Sequelize.INTEGER,
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = Game_account;
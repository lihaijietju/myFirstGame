const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_account = sequelize.define('game_account', {
    account: Sequelize.STRING(40),
    password: Sequelize.STRING(40),
    updatetime: Sequelize.STRING(20)
}, {
    timestamps: false
});

module.exports = Game_account;

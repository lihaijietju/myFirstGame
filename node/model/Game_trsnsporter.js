const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_trsnsporter = sequelize.define('game_transporter', {
    belongsto: Sequelize.STRING(40),
    name: Sequelize.STRING(40),
    level: Sequelize.INTEGER,
    class: Sequelize.INTEGER,
    baseweight: Sequelize.INTEGER,
    isBusy: Sequelize.INTEGER,
    targetcity: Sequelize.STRING(40),
    starttime: Sequelize.STRING(20),
    totaltime: Sequelize.INTEGER,
    isbuiedmoney: Sequelize.INTEGER,
}, {
    timestamps: false
});

module.exports = Game_trsnsporter;

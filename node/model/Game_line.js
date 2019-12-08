const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_line = sequelize.define('game_line', {
    targetcity: Sequelize.STRING(40),
    belongsto: Sequelize.STRING(40),
    level: Sequelize.STRING(10)
}, {
    timestamps: false
});

module.exports = Game_line;

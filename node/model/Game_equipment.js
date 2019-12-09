const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_equipment = sequelize.define('game_equipment', {
    belongs: Sequelize.STRING(40),
    strength: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
    tizhi: Sequelize.INTEGER,
    speed: Sequelize.INTEGER,
    baoji: Sequelize.INTEGER,
    gengu: Sequelize.INTEGER,
    level: Sequelize.INTEGER,
    class: Sequelize.INTEGER,
}, {
    timestamps: false
});

module.exports = Game_equipment;
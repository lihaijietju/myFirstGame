const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_equip = sequelize.define('game_equip', {
    belongs: Sequelize.STRING(40),
    type: Sequelize.INTEGER,
    name: Sequelize.STRING(50),
    property: Sequelize.STRING(50),
    level: Sequelize.INTEGER,
    class: Sequelize.INTEGER,
    strongLevel: Sequelize.INTEGER,
    ison: Sequelize.INTEGER,
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = Game_equip;
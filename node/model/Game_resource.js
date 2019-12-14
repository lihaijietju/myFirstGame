const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_resource = sequelize.define('game_resource', {
    name: Sequelize.STRING(40),
    belongs: Sequelize.STRING(40),
    level: Sequelize.INTEGER,
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = Game_resource;
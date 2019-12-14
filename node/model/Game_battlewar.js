const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_battlewar = sequelize.define('game_battlewar', {
    belongsto: Sequelize.STRING(40),
    name: Sequelize.STRING(40),
    level: Sequelize.INTEGER,
    class: Sequelize.INTEGER,
    basebattle: Sequelize.INTEGER,
    isbusy: Sequelize.INTEGER,
    targetwar: Sequelize.STRING(40),
    starttime: Sequelize.STRING(20),
    totaltime: Sequelize.INTEGER,
    isbuiedmoney: Sequelize.INTEGER,
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = Game_battlewar;
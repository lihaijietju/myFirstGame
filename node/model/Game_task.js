const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_task = sequelize.define('game_task', {
    account: Sequelize.STRING(45),
    sign: Sequelize.INTEGER,
    signflag: Sequelize.INTEGER,

    tradego: Sequelize.INTEGER,
    tradegoflag: Sequelize.INTEGER,

    tradeback: Sequelize.INTEGER,
    tradebackflag: Sequelize.INTEGER,

    battlego: Sequelize.INTEGER,
    battlegoflag: Sequelize.INTEGER,

    battleback: Sequelize.INTEGER,
    battlebackflag: Sequelize.INTEGER,

    newequip: Sequelize.INTEGER,
    newequipflag: Sequelize.INTEGER,

    wujinshilian: Sequelize.INTEGER,
    wujinshilianflag: Sequelize.INTEGER,

    id: {
        type: Sequelize.STRING(45),
        primaryKey: true
    }
}, {
    timestamps: false
});

module.exports = Game_task;
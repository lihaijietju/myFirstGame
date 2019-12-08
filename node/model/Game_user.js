const Sequelize = require('sequelize');
const util = require('../util/util');

// 创建数据库连接
const sequelize = util.getSqlConnection();


let Game_user = sequelize.define('game_user', {
    account: Sequelize.STRING(40),
    username: Sequelize.STRING(40),
    level: Sequelize.INTEGER,
    exp: Sequelize.STRING(40),
    exprate: Sequelize.INTEGER,
    totalexp: Sequelize.STRING(40),
    gold: Sequelize.STRING(20),
    gemstone: Sequelize.INTEGER,
    tiekuang: Sequelize.STRING(20),
    caoyao: Sequelize.STRING(20),
    liangshi: Sequelize.STRING(20),
    woods: Sequelize.STRING(20),
    tiekuangrate: Sequelize.STRING(10),
    caoyaorate: Sequelize.STRING(10),
    liangshirate: Sequelize.STRING(10),
    woodsrate: Sequelize.STRING(10),
    currentbattlelevel: Sequelize.INTEGER,  // 当前挂机地图
    xianyuancips: Sequelize.INTEGER, // 仙缘碎片
    keepclassnum: Sequelize.INTEGER, // 保级符
    strongstonenum: Sequelize.INTEGER, // 强化石
    strongstoneclip: Sequelize.INTEGER, // 强化石碎片
    upclassstone: Sequelize.INTEGER, // 升阶石
    upclassstoneclip: Sequelize.INTEGER, // 升阶石碎片
    editnamecard: Sequelize.INTEGER, // 改名卡
    liangshibag: Sequelize.INTEGER, // 粮食资源包
    tiekuangbag: Sequelize.INTEGER, // 铁矿资源包
    woodsbag: Sequelize.INTEGER, // 木材资源包
    caoyaobag: Sequelize.INTEGER // 草药资源包
}, {
    timestamps: false
});

module.exports = Game_user;

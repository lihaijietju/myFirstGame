const Koa = require('koa');
const router = require('koa-router')();
const static = require('koa-static');
const path = require('path');
const moment = require('moment');
const cors = require('koa2-cors');
const KoaJson = require('koa-json');
const config = require('./config');
const bodyParser = require('koa-bodyparser');
const schedule = require('node-schedule');

// 路由api引用
const loginApi = require('./api/loginApi');
const cityApi = require('./api/cityApi');
const tradeApi = require('./api/tradeApi');
const battleApi = require('./api/battleApi');
const bagApi = require('./api/bagApi');
const userApi = require('./api/userApi');
const activityApi = require('./api/activityApi');
const originEquipmentApi = require('./api/originEquipmentApi');

const Game_user = require('./model/Game_user');
const Game_equipment = require('./model/Game_equipment');

// 创建一个Koa对象表示web app本身:
const app = new Koa();

//中间件
app.use(cors({
    origin: function (ctx) {
        return '*';
    },
    allowMethods: ['GET', 'POST', 'DELETE'],
}))
app.use(KoaJson());
app.use(bodyParser());
app.use(static(path.join(__dirname, './dist')));


// 登录相关api
app.use(loginApi.routes()).use(loginApi.allowedMethods());

// city主场景api
app.use(cityApi.routes()).use(cityApi.allowedMethods());

// 贸易队相关api
app.use(tradeApi.routes()).use(tradeApi.allowedMethods());

// 挂机相关api
app.use(battleApi.routes()).use(battleApi.allowedMethods());

// 背包相关api
app.use(bagApi.routes()).use(bagApi.allowedMethods());

// 用户信息相关api
app.use(userApi.routes()).use(userApi.allowedMethods());

// 活动相关api
app.use(activityApi.routes()).use(activityApi.allowedMethods());

// 装备相关api
app.use(originEquipmentApi.routes()).use(originEquipmentApi.allowedMethods());


// add router middleware:
app.use(router.routes());

app.listen(config.port);
console.log('app started at port ' + config.port + '...');


// 定时任务
const scheduleCronstyle = () => {
    //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('30 * * * * *', () => {
        getUserList();
    });
}

const scheduleInitUserFlag = () => {
    //每分钟的第30秒定时执行一次:
    schedule.scheduleJob('0 0 3 * * *', async () => {
        let userList = await Game_user.findAll();
        for (let i = 0; i < userList.length; i++) {
            initUserDailyFlag(userList[i].account);
        }
    });
}

scheduleCronstyle();
scheduleInitUserFlag();

async function getUserList() {
    let userList = await Game_user.findAll();
    for (let i = 0; i < userList.length; i++) {
        updateBattleValue(userList[i].account);
    }
}

async function updateBattleValue(account) {
    let propertyInfo = {
        'strength': 0,
        'tizhi': 0,
        'gengu': 0,
        'speed': 0,
        'baoji': 0
    }

    let targetEquipment = await Game_equipment.findAll({
        where: {
            belongs: account
        }
    });
    // 获取装备属性
    targetEquipment.forEach((equipment) => {
        propertyInfo.strength = +propertyInfo.strength + +equipment.strength + +equipment.level + +equipment.class * 10;
        propertyInfo.tizhi = +propertyInfo.tizhi + +equipment.tizhi + +equipment.level + +equipment.class * 10;
        propertyInfo.gengu = +propertyInfo.gengu + +equipment.gengu + +equipment.level + +equipment.class * 10;
        propertyInfo.speed = +propertyInfo.speed + +equipment.speed + +equipment.level + +equipment.class * 10;
        propertyInfo.baoji = +propertyInfo.baoji + +equipment.baoji + +equipment.level + +equipment.class * 10;
    });

    let targetUser = await Game_user.findOne({
        where: {
            account: account
        }
    });

    // 自身属性
    propertyInfo.strength = +propertyInfo.strength + +targetUser.strength;
    propertyInfo.tizhi = +propertyInfo.tizhi + +targetUser.tizhi;
    propertyInfo.gengu = +propertyInfo.gengu + +targetUser.gengu;
    propertyInfo.speed = +propertyInfo.speed + +targetUser.speed;
    propertyInfo.baoji = +propertyInfo.baoji + +targetUser.baoji;

    let classLevel = Math.floor(+targetUser.level / 10);
    let restLevel = +targetUser.level - classLevel * 10;

    let property = 0;

    for (let i = 0; i < classLevel; i++) {
        property = property + (i + 1) * 10;
    }
    property = property + restLevel * 10 * classLevel

    propertyInfo.strength = +propertyInfo.strength + property;
    propertyInfo.tizhi = +propertyInfo.tizhi + property;
    propertyInfo.gengu = +propertyInfo.gengu + property;
    propertyInfo.speed = +propertyInfo.speed + property;
    propertyInfo.baoji = +propertyInfo.baoji + property;

    let myBattle = propertyInfo.strength * 5 + propertyInfo.gengu * 5 + propertyInfo.tizhi * 10 + propertyInfo.speed * 2 + propertyInfo.baoji * 2;
    targetUser.battle = myBattle;
    await targetUser.save();
}

async function initUserDailyFlag(account) {
    let targetUser = await Game_user.findOne({
        where: {
            account: account
        }
    });
    targetUser.shilianFlag = 0;
    targetUser.signFlag = 0;
    await targetUser.save();
}
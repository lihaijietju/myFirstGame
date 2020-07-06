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
const session = require('koa-session');
const myLog = require('koa-sam-log');

// 路由api引用
const loginApi = require('./api/loginApi');
const cityApi = require('./api/cityApi');
const tradeApi = require('./api/tradeApi');
const battleApi = require('./api/battleApi');
const bagApi = require('./api/bagApi');
const userApi = require('./api/userApi');
const activityApi = require('./api/activityApi');
const equipApi = require('./api/equipApi');

const Game_user = require('./model/Game_user');
const Game_equipment = require('./model/Game_equipment');
const Game_equip = require('./model/Game_equip');

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

app.use(myLog({
    type: 'dateFile', //按日期创建文件，文件名为 filename + pattern
    filename: 'logs/',
    pattern: 'yyyy-MM-dd.log',
    alwaysIncludePattern: true
}, {
    env: app.env, //如果是development则可以同时在控制台中打印
    level: 'error' //logger level
}));

app.keys = ['some secret hurr'];

const CONFIG = {
    key: 'koa:sess',
    /** (string) cookie key (default is koa:sess) */
    maxAge: 86400000000,
    overwrite: true,
    /** (boolean) can overwrite or not (default true) */
    httpOnly: true,
    /** (boolean) httpOnly or not (default true) */
    signed: true,
    /** (boolean) signed or not (default true) */
    rolling: false,
    /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false,
    /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app));

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
app.use(equipApi.routes()).use(equipApi.allowedMethods());


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

    property = property + restLevel * 10 + (classLevel * 100)

    propertyInfo.strength = +propertyInfo.strength + property;
    propertyInfo.tizhi = +propertyInfo.tizhi + property;
    propertyInfo.gengu = +propertyInfo.gengu + property;
    propertyInfo.speed = +propertyInfo.speed + property;
    propertyInfo.baoji = +propertyInfo.baoji + property;

    let targetEquip = await Game_equip.findAll({
        where: {
            belongs: account,
            ison: 1
        }
    });

    propertyInfo.battle =0;
    for(var j=0;j<targetEquip.length;j++){
        propertyInfo.battle += (+targetEquip[j].property);
    }

    let myBattle = propertyInfo.strength * 5 + propertyInfo.gengu * 5 + propertyInfo.tizhi * 10 + propertyInfo.speed * 2 + propertyInfo.baoji * 2 + (propertyInfo.battle||0) * 5;
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
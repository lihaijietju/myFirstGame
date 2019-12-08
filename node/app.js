const Koa = require('koa');
const router = require('koa-router')();
const static = require('koa-static');
const path = require('path');
const moment = require('moment');
const cors = require('koa2-cors');
const KoaJson = require('koa-json');
const config = require('./config');
const bodyParser = require('koa-bodyparser');

// 路由api引用
const loginApi = require('./api/loginApi');
const cityApi = require('./api/cityApi');
const tradeApi = require('./api/tradeApi');
const battleApi = require('./api/battleApi');
const bagApi = require('./api/bagApi');
const userApi = require('./api/userApi');

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


// add router middleware:
app.use(router.routes());

app.listen(config.port);
console.log('app started at port ' + config.port + '...');

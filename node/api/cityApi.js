const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');
const util = require('../util/util');


// 获取用户账号信息
router.get('/getAccount', async(ctx, next) => {
    await next();
    // 查询数据
    let targetAccount = await Game_account.findOne({
        where: {
            account: ctx.query.account,
        }
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetAccount
    };

});

// 获取用户信息
router.get('/getUserInfo', async(ctx, next) => {
    await next();
    // 查询数据
    let targetUser = await Game_user.findAll({
        where: {
            account: ctx.query.account,
        }
    });
    let params = {};
    if (!targetUser.length) {
        params = {
            account: ctx.query.account,
            username: ctx.query.account,
            level: 1,
            exp: 0,
            exprate: 1,
            totalexp: 10000,
            gold: 0,
            gemstone: 0,
            tiekuang: 0,
            caoyao: 0,
            liangshi: 0,
            woods: 0,
            tiekuangrate: 1,
            caoyaorate: 1,
            liangshirate: 1,
            woodsrate: 1,
            currentbattlelevel: 1,
            editnamecard:1
        };
        await Game_user.create(params);
    } else {
        params = targetUser[0];
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params
    };

});

// 更新资源信息
router.post('/updateResource', async(ctx, next) => {
    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });

    util.updateAccountTime(Game_account, ctx.request.body.account);

    targetUser.tiekuang = ctx.request.body.tiekuang;
    targetUser.tiejing = ctx.request.body.tiejing;
    targetUser.liangshi = ctx.request.body.liangshi;
    targetUser.shengwang = ctx.request.body.shengwang;
    targetUser.caoyao = ctx.request.body.caoyao;
    targetUser.woods = ctx.request.body.woods;
    targetUser.exp = ctx.request.body.exp;
    targetUser.totalexp = ctx.request.body.totalexp;
    targetUser.level = ctx.request.body.level;
    targetUser.currentbattlelevel = ctx.request.body.currentbattlelevel;

    targetUser.gold = ctx.request.body.gold;
    targetUser.xianyuancips = ctx.request.body.xianyuancips;

    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

// 更新仙缘信息
router.post('/updateGemstone', async(ctx, next) => {
    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });

    targetUser.gemstone = ctx.request.body.gemstone;
    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

module.exports = router;

const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');


// 获取商队列表
router.get('/getTransportList', async (ctx, next) => {
    await next();
    // 查询数据
    let targetTransporter = await Game_trsnsporter.findAll({
        where: {
            belongsto: ctx.query.account,
        }
    });

    let params = [];
    for (let i = 0; i < targetTransporter.length; i++) {
        params.push({
            id: targetTransporter[i].id,
            belongsto: targetTransporter[i].belongsto,
            name: targetTransporter[i].name,
            level: targetTransporter[i].level,
            class: targetTransporter[i].class,
            baseweight: targetTransporter[i].baseweight,
            isbusy: +targetTransporter[i].isBusy,
            targetcity: targetTransporter[i].targetcity,
            starttime: targetTransporter[i].starttime,
            totaltime: targetTransporter[i].totaltime,
            isbuiedmoney: targetTransporter[i].isbuiedmoney
        });
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params
    };

});

// 获取贸易线列表
router.get('/getCityLines', async (ctx, next) => {
    await next();
    // 查询数据
    let targetLines = await Game_line.findAll({
        where: {
            belongsto: ctx.query.account,
        }
    });

    let params = [];
    for (let i = 0; i < targetLines.length; i++) {
        params.push({
            targetCity: targetLines[i].targetcity,
            level: targetLines[i].level,
            belongsto: targetLines[i].belongsto
        });
    }
    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params
    };

});

// 升级商队
router.post('/transportUplevel', async (ctx, next) => {
    await next();
    // 查询数据
    let targetTransport = await Game_trsnsporter.findOne({
        where: {
            belongsto: ctx.request.body.account,
            id: ctx.request.body.id
        }
    });

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    targetUser.tiekuang = targetUser.tiekuang - ctx.request.body.resourceAmount;
    targetUser.liangshi = targetUser.liangshi - ctx.request.body.resourceAmount;
    targetUser.caoyao = targetUser.caoyao - ctx.request.body.resourceAmount;
    targetUser.woods = targetUser.woods - ctx.request.body.resourceAmount;

    targetTransport.level = +targetTransport.level + 1;
    await targetTransport.save();
    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 升阶商队
router.post('/transportUpclass', async (ctx, next) => {
    await next();
    // 查询数据
    let targetTransport = await Game_trsnsporter.findOne({
        where: {
            belongsto: ctx.request.body.account,
            id: ctx.request.body.id
        }
    });
    if (targetTransport.class < 8) {
        targetTransport.class = +targetTransport.class + 1;
        targetTransport.level = 1;
    }
    targetTransport.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 创建新商队
router.post('/addNewTransport', async (ctx, next) => {
    await next();
    // 查询数据
    await Game_trsnsporter.create({
        belongsto: ctx.request.body.account,
        name: '新商队',
        level: 1,
        class: 1,
        baseweight: 1,
        isBusy: 0,
        targetcity: '',
        starttime: 0,
        totaltime: 0,
        isbuiedmoney: ctx.request.body.money ? 1 : 0
    });

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });
    targetUser.caoyao = +targetUser.caoyao - 1000;
    targetUser.woods = +targetUser.woods - 1000;
    targetUser.tiekuang = +targetUser.tiekuang - 1000;
    targetUser.liangshi = +targetUser.liangshi - 1000;

    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

//创建贸易
router.post('/createNewBusiness', async (ctx, next) => {
    await next();
    ctx.request.body.ids = ctx.request.body.ids.split(',');

    for (let i = 0; i < ctx.request.body.ids.length; i++) {
        let targetTransport = await Game_trsnsporter.findOne({
            where: {
                id: ctx.request.body.ids[i],
                belongsto: ctx.request.body.account
            }
        });
        targetTransport.starttime = +new Date();
        targetTransport.totaltime = 24 * 60 * 60;
        targetTransport.targetcity = ctx.request.body.targetCity;
        targetTransport.isBusy = 1;
        await targetTransport.save();
    }

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 完成贸易
router.post('/finishBusiness', async (ctx, next) => {
    await next();

    let targetTransport = await Game_trsnsporter.findOne({
        where: {
            id: ctx.request.body.id,
            belongsto: ctx.request.body.account
        }
    });
    targetTransport.targetcity = '';
    targetTransport.starttime = 0;
    targetTransport.totaltime = 0;
    targetTransport.isBusy = 0;
    await targetTransport.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

//

module.exports = router;

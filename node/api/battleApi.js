const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');
const Game_battlewar = require('../model/Game_battlewar');


// 更新挂机副本
router.post('/updateBattleLevel', async (ctx, next) => {
    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });
    console.log(ctx.request.body)

    targetUser.currentbattlelevel = ctx.request.body.currentbattlelevel;

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

// 获取战斗队列表
router.get('/battleWarList', async (ctx, next) => {
    await next();
    // 查询数据
    let targetBattleList = await Game_battlewar.findAll({
        where: {
            belongsto: ctx.query.account,
        }
    });

    let params = [];
    for (let i = 0; i < targetBattleList.length; i++) {
        params.push({
            id: targetBattleList[i].id,
            belongsto: targetBattleList[i].belongsto,
            name: targetBattleList[i].name,
            level: targetBattleList[i].level,
            class: targetBattleList[i].class,
            basebattle: targetBattleList[i].basebattle,
            isbusy: +targetBattleList[i].isbusy,
            targetwar: targetBattleList[i].targetwar,
            starttime: targetBattleList[i].starttime,
            totaltime: targetBattleList[i].totaltime,
            isbuiedmoney: targetBattleList[i].isbuiedmoney
        });
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params
    };
});

// 创建新战队
router.post('/addNewBattleWar', async (ctx, next) => {
    await next();
    // 查询数据

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });

    if (targetUser.gemstone > 1000 && ctx.request.body.money) {
        targetUser.gemstone = +targetUser.gemstone - 1000;
        await targetUser.save();

        await Game_battlewar.create({
            belongsto: ctx.request.body.account,
            name: '新战队',
            level: 1,
            class: 1,
            basebattle: 500,
            isbusy: 0,
            targetwar: '',
            starttime: 0,
            totaltime: 0,
            isbuiedmoney: 1
        });
    } else {
        await Game_battlewar.create({
            belongsto: ctx.request.body.account,
            name: '新战队',
            level: 1,
            class: 1,
            basebattle: 500,
            isbusy: 0,
            targetwar: '',
            starttime: 0,
            totaltime: 0,
            isbuiedmoney: 0
        });
    }

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 创建战斗副本
router.post('/createNewBattle', async (ctx, next) => {
    await next();
    // 查询数据
    ctx.request.body.ids = ctx.request.body.ids.split(',');

    for (let i = 0; i < ctx.request.body.ids.length; i++) {
        let targetBattle = await Game_battlewar.findOne({
            where: {
                id: ctx.request.body.ids[i],
                belongsto: ctx.request.body.account
            }
        });
        targetBattle.starttime = +new Date();
        targetBattle.totaltime = 2 * 60 * 60;
        targetBattle.isbusy = 1;
        await targetBattle.save();
    }


    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 完成副本
router.post('/finishBattle', async (ctx, next) => {
    await next();

    let targetBattle = await Game_battlewar.findOne({
        where: {
            id: ctx.request.body.id,
            belongsto: ctx.request.body.account
        }
    });

    targetBattle.starttime = 0;
    targetBattle.totaltime = 0;
    targetBattle.isbusy = 0;
    await targetBattle.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 升级战斗队
router.post('/battleUplevel', async (ctx, next) => {
    await next();
    // 查询数据
    let targetBattle = await Game_battlewar.findOne({
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
    targetBattle.level = +targetBattle.level + 1;

    await targetBattle.save();
    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 升阶战斗队
router.post('/battleUpClass', async (ctx, next) => {
    await next();
    // 查询数据
    let targetBattle = await Game_battlewar.findOne({
        where: {
            belongsto: ctx.request.body.account,
            id: ctx.request.body.id
        }
    });
    if (targetBattle.class < 8) {
        targetBattle.class = +targetBattle.class + 1;
        targetBattle.level = 1;
    }
    await targetBattle.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

module.exports = router;

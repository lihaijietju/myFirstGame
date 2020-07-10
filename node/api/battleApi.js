const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');
const Game_battlewar = require('../model/Game_battlewar');
const utility = require("utility");
const resourceuplevel = require('../data/resourceuplevel');


// 更新挂机副本
router.post('/updateBattleLevel', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });
    targetUser.currentbattlelevel = ctx.request.body.currentbattlelevel;

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

// 获取战斗队列表
router.get('/battleWarList', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

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
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });

    if (ctx.request.body.money) {
        if(targetUser.gemstone >= 1000){
            targetUser.gemstone = +targetUser.gemstone - 1000;
            await targetUser.save();

            await Game_battlewar.create({
                id: +new Date(),
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

            ctx.response.body = {
                code: 200,
                message: '成功'
            };
        }

    } else {
        if (+targetUser.caoyao >= 1000 && +targetUser.woods >= 1000 && +targetUser.tiekuang >= 1000 && +targetUser.liangshi >= 1000) {
            targetUser.caoyao = +targetUser.caoyao - 1000;
            targetUser.woods = +targetUser.woods - 1000;
            targetUser.tiekuang = +targetUser.tiekuang - 1000;
            targetUser.liangshi = +targetUser.liangshi - 1000;
            await Game_battlewar.create({
                id: +new Date(),
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

            await targetUser.save();

            ctx.response.body = {
                code: 200,
                message: '成功'
            };
        } else {
            ctx.response.body = {
                code: 400,
                message: '资源不足'
            };
        }

    }


});

// 创建战斗副本
router.post('/createNewBattle', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

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
        targetBattle.totaltime = 3 * 60 * 60;
        targetBattle.isbusy = 1;
        await targetBattle.save();
    }


    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 一键派遣战队
router.post('/onceCreateBattle', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let battleList = await Game_battlewar.findAll({
        where:{
            belongsto: ctx.request.body.account,
            isbusy: 0
        }
    });

    let targetList =[];
    for(var i=0;i<battleList.length;i++){
        let obj = {
            belongsto: battleList[i].belongsto,
            name: battleList[i].name,
            level: battleList[i].level,
            class: battleList[i].class,
            basebattle: battleList[i].basebattle,
            isbusy: 1,
            targetwar: '',
            starttime: +new Date(),
            totaltime: 3*60*60,
            isbuiedmoney: battleList[i].isbuiedmoney,
            id: battleList[i].id
        };
        targetList.push(obj);
    }
    await Game_battlewar.bulkCreate(targetList,{updateOnDuplicate:['isbusy','starttime','totaltime']});

    ctx.response.body = {
        code: 200,
        message: '派遣成功',
        data: ''
    };
});

// 一键收货战队
router.post('/onceFinishBattle', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let battleList = await Game_battlewar.findAll({
        where:{
            belongsto: ctx.request.body.account,
            isbusy: 1
        }
    });

    let totalgemstone = 0;
    let targetBattleList = [];
    for(var i=0; i < battleList.length;i++){
        let resttime = battleList[i].totaltime - parseInt((+new Date() - battleList[i].starttime) / 1000);
        if (resttime <= 0) {
            totalgemstone = totalgemstone + battleList[i].class * 1;

            let obj = {
                belongsto: battleList[i].belongsto,
                name: battleList[i].name,
                level: battleList[i].level,
                class: battleList[i].class,
                basebattle: battleList[i].basebattle,
                isbusy: 0,
                targetwar: '',
                starttime: 0,
                totaltime: 0,
                isbuiedmoney: battleList[i].isbuiedmoney,
                id: battleList[i].id
            };
            targetBattleList.push(obj);
        }
    }

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });

    targetUser.gemstone = +targetUser.gemstone + totalgemstone;

    await targetUser.save();

    await Game_battlewar.bulkCreate(targetBattleList,{updateOnDuplicate:['isbusy','starttime','totaltime']});

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: totalgemstone
    };
});

// 完成副本
router.post('/finishBattle', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let targetBattle = await Game_battlewar.findOne({
        where: {
            id: ctx.request.body.id,
            belongsto: ctx.request.body.account
        }
    });

    let money = 0;
    let resttime = targetBattle.totaltime - parseInt((+new Date() - targetBattle.starttime) / 1000);

    if (resttime <= 0) {
        money = targetBattle.class * 1;
        let targetUser = await Game_user.findOne({
            where: {
                account: ctx.request.body.account
            }
        });

        console.log()

        targetUser.gemstone = +targetUser.gemstone + money;

        targetBattle.starttime = 0;
        targetBattle.totaltime = 0;
        targetBattle.isbusy = 0;
        await targetBattle.save();
        await targetUser.save();

        ctx.response.body = {
            code: 200,
            message: '成功',
            data: money
        };
    } else{
        ctx.response.body = {
            code: 400,
            message: '失败'
        };
    }
});

// 升级战斗队
router.post('/battleUplevel', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

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

    if(targetBattle.level > targetBattle.class*10){
        ctx.response.body = {
            code: 400,
            message: '战队品质不足，请升阶战队'
        };
        return;
    }

    let resourceAmount = +resourceuplevel[targetBattle.level-1].needWoods;

    if(+targetUser.tiekuang >= resourceAmount
        && +targetUser.liangshi >= parseInt(resourceAmount*1.5)
        && +targetUser.caoyao >= resourceAmount
        && +targetUser.woods >= parseInt(resourceAmount*0.5)){

        targetUser.tiekuang = targetUser.tiekuang - resourceAmount;
        targetUser.liangshi = targetUser.liangshi - parseInt(resourceAmount*1.5);
        targetUser.caoyao = targetUser.caoyao - resourceAmount;
        targetUser.woods = targetUser.woods - parseInt(resourceAmount*0.5);


        targetBattle.level = +targetBattle.level + 1;
        await targetBattle.save();
        await targetUser.save();

        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    } else {
        ctx.response.body = {
            code: 400,
            message: '资源不足'
        };
    }
});

// 升阶战斗队
router.post('/battleUpClass', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

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

    // 等级不足
    if(targetBattle.class *10 >= targetBattle.level){
        ctx.response.body = {
            code: 400,
            message: '战队阶位不足无法升级,请升阶战队'
        };
        return;
    }

    // 满阶
    if(targetBattle.class >= 8){
        ctx.response.body = {
            code: 400,
            message: '战队已满阶，无法升阶'
        };
        return;
    }

    let needGemstone = targetBattle.class*100;
    if(needGemstone > targetUser.gemstone){
        ctx.response.body = {
            code: 400,
            message: '升阶需要钻石'+needGemstone+'，钻石不足无法升阶'
        };
        return;
    }

    targetUser.gemstone = targetUser.gemstone - needGemstone;
    targetBattle.class = +targetBattle.class + 1;

    await targetUser.save();
    await targetBattle.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});


router.post('/updateTradeList', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    // 查询数据
    let battleList = await Game_battlewar.findAll({
        where: {
            belongsto: ctx.request.body.account,
        }
    });
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });

    for (var i = 0; i < battleList.length; i++) {
        if (+battleList[i].isbusy) {
            let resttime = battleList[i].totaltime - parseInt((+new Date() - battleList[i].starttime) / 1000);
            if (resttime <= 0) {

                targetUser.gemstone = +targetUser.gemstone + (+battleList[i].class * 1);
                console.log(targetUser.gemstone, '=======');
                battleList[i].isbusy = 0;
                battleList[i].starttime = 0;
                battleList[i].totaltime = 0;
                await battleList[i].save();
            }
        }
    }

    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetUser
    };
});

module.exports = router;
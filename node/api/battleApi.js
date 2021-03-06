const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');
const Game_battlewar = require('../model/Game_battlewar');
const utility = require("utility");
const resourceuplevel = require('../data/resourceuplevel');
const Game_task = require('../model/Game_task');


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
            isbuiedmoney: targetBattleList[i].isbuiedmoney,
            resourceAmount:+resourceuplevel[targetBattleList[i].level-1].needWoods
        });
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params
    };
});

router.get('/getBattleWarRank', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetBattleList = await Game_battlewar.findAll({
        limit:50,
        'order': [
            ['class', 'DESC'],
            ['level', 'DESC']
        ]
    });


    // 需要查询的账号信息
    let accountList =[];
    for(let i=0;i<targetBattleList.length;i++){
        if(accountList.indexOf(targetBattleList[i].belongsto)===-1){
            accountList.push(targetBattleList[i].belongsto);
        }
    }

    let targetUserList = await Game_user.findAll({
        attributes:['account','username'],
        where:{},
        account: {
            $in: accountList
        }
    });

    let nameAccountMap={};
    for(let j=0;j<targetUserList.length;j++){
        nameAccountMap[targetUserList[j].account] = targetUserList[j].username;
    }

    for(let i=0;i<targetBattleList.length;i++){
        targetBattleList[i].belongsto = nameAccountMap[targetBattleList[i].belongsto];
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetBattleList
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
        let battleList = await Game_battlewar.findAll({
            where:{
                isbuiedmoney:1,
                belongsto:ctx.request.body.account
            }
        })
        if(targetUser.gemstone >= 1000 && battleList.length<5){
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
        }else{
            ctx.response.body = {
                code: 400,
                message: '当前战队数量已达最大值或者钻石数量不足'
            };
        }

    } else {
        let battleList = await Game_battlewar.findAll({
            where:{
                isbuiedmoney:0,
                belongsto:ctx.request.body.account
            }
        })
        let len = parseInt((+targetUser.level) / 10) + 1

        if (+targetUser.caoyao >= 1000
            && +targetUser.woods >= 1000
            && +targetUser.tiekuang >= 1000
            && +targetUser.liangshi >= 1000 && battleList.length < len) {
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

    let targetUser = await Game_user.findOne({
        where:{
            account:ctx.request.body.account
        }
    });
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
        if(+targetUser.monthcarddays > 0){
            targetBattle.totaltime = 6 * 60 * 60;
        }else{
            targetBattle.totaltime = 3 * 60 * 60;
        }
        targetBattle.isbusy = 1;
        await targetBattle.save();
    }

    let targetTask = await Game_task.findOne({
        where:{
            account:ctx.request.body.account
        }
    });

    targetTask.battlego = +targetTask.battlego + 1;
    await targetTask.save();

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

    let targetUser = await Game_user.findOne({
        where:{
            account:ctx.request.body.account
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
        if(+targetUser.monthcarddays > 0){
            obj.totaltime = 6 * 60 * 60;
        }else{
            obj.totaltime = 3 * 60 * 60;
        }
        targetList.push(obj);
    }

    let targetTask = await Game_task.findOne({
        where:{
            account:ctx.request.body.account
        }
    });

    targetTask.battlego = +targetTask.battlego + targetList.length;
    await targetTask.save();

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

    let targetTask = await Game_task.findOne({
        where:{
            account:ctx.request.body.account
        }
    });

    targetTask.battleback = +targetTask.battleback + targetBattleList.length;
    await targetTask.save();

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });

    if(+targetUser.monthcarddays > 0){
        totalgemstone = 2 * +totalgemstone;
    }

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

        let targetTask = await Game_task.findOne({
            where:{
                account:ctx.request.body.account
            }
        });

        targetTask.battleback = +targetTask.battleback + 1;
        await targetTask.save();

        if(+targetUser.monthcarddays > 0){
            money = 2 * +money;
        }

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

    if(+targetBattle.level >= +targetBattle.class*10){
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
    if(+targetBattle.class *10 > +targetBattle.level){
        ctx.response.body = {
            code: 400,
            message: '战队等级不足，无法升阶'
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

    if(targetBattle.class > 3){
        needGemstone = 500;
    }
    if(targetBattle.class > 5){
        needGemstone = 1000;
    }

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
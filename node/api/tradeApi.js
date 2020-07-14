const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');
const utility = require("utility");
const resourceuplevel = require('../data/resourceuplevel');

// 获取商队列表
router.get('/getTransportList', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
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
            isbuiedmoney: targetTransporter[i].isbuiedmoney,
            resourceAmount: resourceuplevel[targetTransporter[i].level-1].needWoods
        });
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params
    };

});

// 获取商队列表排行
router.get('/getTradeRank', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    await next();
    // 查询数据
    let transportList = await Game_trsnsporter.findAll({
        limit:50,
        'order': [
            ['class', 'DESC'],
            ['level', 'DESC']
        ]
    });

    // 需要查询的账号信息
    let accountList =[];
    for(let i=0;i<transportList.length;i++){
        if(accountList.indexOf(transportList[i].belongsto)===-1){
            accountList.push(transportList[i].belongsto);
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

    for(let i=0;i<transportList.length;i++){
        transportList[i].belongsto = nameAccountMap[transportList[i].belongsto];
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: transportList
    };

});

// 升级商队
router.post('/transportUplevel', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
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

    if(+targetTransport.level >= +targetTransport.class*10){
        ctx.response.body = {
            code: 400,
            message: '商队品质不足，请升阶商队'
        };
        return;
    }

    let resourceAmount = +resourceuplevel[targetTransport.level-1].needWoods;

    if(+targetUser.tiekuang >= resourceAmount
        && +targetUser.liangshi >= parseInt(resourceAmount*1.5)
        && +targetUser.caoyao >= resourceAmount
        && +targetUser.woods >= parseInt(resourceAmount*0.5)){

        targetUser.tiekuang = targetUser.tiekuang - resourceAmount;
        targetUser.liangshi = targetUser.liangshi - parseInt(resourceAmount*1.5);
        targetUser.caoyao = targetUser.caoyao - resourceAmount;
        targetUser.woods = targetUser.woods - parseInt(resourceAmount*0.5);


        targetTransport.level = +targetTransport.level + 1;
        await targetTransport.save();
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

// 升阶商队 升阶需要对应等级满
router.post('/transportUpclass', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
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

    // 等级不足
    if(targetTransport.class *10 > targetTransport.level){
        ctx.response.body = {
            code: 400,
            message: '商队等级不足无法升阶,请升级商队'
        };
        return;
    }

    // 满阶
    if(targetTransport.class >= 8){
        ctx.response.body = {
            code: 400,
            message: '商队已满阶，无法升阶'
        };
        return;
    }

    let needGemstone = targetTransport.class*100;

    if(targetTransport.class > 3){
        needGemstone = 500;
    }
    if(targetTransport.class > 5){
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
    targetTransport.class = +targetTransport.class + 1;

    await targetUser.save();
    await targetTransport.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 创建新商队
router.post('/addNewTransport', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });


    if(ctx.request.body.money){
        let tradeList = await Game_trsnsporter.findAll({
            where:{
                isbuiedmoney:1,
                belongsto:ctx.request.body.account
            }
        })
        console.log(targetUser.gemstone,tradeList.length)
        if(+targetUser.gemstone >= 1000 && tradeList.length < 5){
            targetUser.gemstone = +targetUser.gemstone - 1000;
            await targetUser.save();

            await Game_trsnsporter.create({
                id: +new Date(),
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

            ctx.response.body = {
                code: 200,
                message: '成功'
            };
        }else{
            ctx.response.body = {
                code: 400,
                message: '当前商队数量已经到达最大值或者钻石不足'
            };
        }
    }else{
        let tradeList = await Game_trsnsporter.findAll({
            where:{
                isbuiedmoney:0,
                belongsto:ctx.request.body.account
            }
        })
        let len = parseInt((+targetUser.level) / 10) + 1
        if(+targetUser.caoyao >= 1000
            && +targetUser.woods >= 1000
            && +targetUser.tiekuang >= 1000
            && +targetUser.liangshi >= 1000 && tradeList.length < len){

                targetUser.caoyao = +targetUser.caoyao - 1000;
            targetUser.woods = +targetUser.woods - 1000;
            targetUser.tiekuang = +targetUser.tiekuang - 1000;
            targetUser.liangshi = +targetUser.liangshi - 1000;

            await Game_trsnsporter.create({
                id: +new Date(),
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
            await targetUser.save();

            ctx.response.body = {
                code: 200,
                message: '成功'
            };

        }else{
            ctx.response.body = {
                code: 400,
                message: '商队数量已经到达最大值或者资源不足'
            };
        }
    }
});

//创建贸易
router.post('/createNewBusiness', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    console.log(11111);

    await next();
    ctx.request.body.ids = ctx.request.body.ids.split(',');

    let targetUser = await Game_user.findOne({
        where:{
            account:ctx.request.body.account
        }
    });

    for (let i = 0; i < ctx.request.body.ids.length; i++) {
        let targetTransport = await Game_trsnsporter.findOne({
            where: {
                id: ctx.request.body.ids[i],
                belongsto: ctx.request.body.account
            }
        });
        targetTransport.starttime = +new Date();
        if(+targetUser.monthcarddays > 0){
            targetTransport.totaltime = 3 * 60 * 60;
        }else{
            targetTransport.totaltime = 60 * 60;
        }
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
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let targetTransport = await Game_trsnsporter.findOne({
        where: {
            id: ctx.request.body.id,
            belongsto: ctx.request.body.account
        }
    });

    let gold = 0;

    let resttime = targetTransport.totaltime - parseInt((+new Date() - targetTransport.starttime) / 1000);
    if (resttime <= 0) {
        gold = (10 + +targetTransport.class * 30 + +targetTransport.level);
        let targetUser = await Game_user.findOne({
            where: {
                account: ctx.request.body.account
            }
        });

        // 月卡玩家三倍
        if(+targetUser.monthcarddays > 0){
            gold = 3 * gold;
        }
        targetUser.gold = +targetUser.gold + gold;

        targetTransport.starttime = 0;
        targetTransport.totaltime = 0;
        targetTransport.isBusy = 0;
        await targetTransport.save();
        await targetUser.save();

        ctx.response.body = {
            code: 200,
            message: '成功',
            data: gold
        };
    } else{
        ctx.response.body = {
            code: 400,
            message: '失败'
        };
    }
});


// 一键派遣商队
router.post('/onceCreateBusiness', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let transportList = await Game_trsnsporter.findAll({
        where:{
            belongsto: ctx.request.body.account,
            isBusy: 0
        }
    });

    let targetUser = await Game_user.findOne({
        where:{
            account:ctx.request.body.account
        }
    });

    let targetList =[];
    for(var i=0;i<transportList.length;i++){
        let obj = {
            belongsto: transportList[i].belongsto,
            name: transportList[i].name,
            level: transportList[i].level,
            class: transportList[i].class,
            baseweight: transportList[i].baseweight,
            isBusy: 1,
            targetcity: '',
            starttime: +new Date(),
            totaltime: 60 * 60,
            isbuiedmoney: transportList[i].isbuiedmoney,
            id: transportList[i].id
        };
        if(+targetUser.monthcarddays > 0){
            obj.totaltime = 3 * 60 * 60;
        }
        targetList.push(obj);
    }
    await Game_trsnsporter.bulkCreate(targetList,{updateOnDuplicate:['isBusy','starttime','totaltime']});
    ctx.response.body = {
        code: 200,
        message: '成功',
        data: ''
    };
});

// 一键收货
router.post('/onceFinishBusiness', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let totalGold = 0;

    let transportList = await Game_trsnsporter.findAll({
        where:{
            belongsto: ctx.request.body.account,
            isBusy: 1
        }
    });

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });

    let targetTransList = [];
    for(var i=0; i<transportList.length;i++){
        let resttime = transportList[i].totaltime - parseInt((+new Date() - transportList[i].starttime) / 1000);
        if (resttime <= 0) {
            gold = (10 + +transportList[i].class * 30 + +transportList[i].level);

            let obj = {
                belongsto: transportList[i].belongsto,
                name: transportList[i].name,
                level: transportList[i].level,
                class: transportList[i].class,
                baseweight: transportList[i].baseweight,
                isBusy: 0,
                targetcity: '',
                starttime: 0,
                totaltime: 0,
                isbuiedmoney: transportList[i].isbuiedmoney,
                id: transportList[i].id
            };
            targetTransList.push(obj);

            if(+targetUser.monthcarddays > 0){
                gold = 3 * gold;
            }
            totalGold = totalGold + gold;
        }
    }

    targetUser.gold = +targetUser.gold + totalGold;

    await targetUser.save();
    await Game_trsnsporter.bulkCreate(targetTransList,{updateOnDuplicate:['isBusy','starttime','totaltime']});

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: totalGold
    };
});


// 批量更新贸易战队
router.post('/updateTradeList', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    // 查询数据
    let tradeList = await Game_trsnsporter.findAll({
        where: {
            belongsto: ctx.request.body.account,
        }
    });
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });

    for (var i = 0; i < tradeList.length; i++) {
        if (+tradeList[i].isBusy) {
            let resttime = tradeList[i].totaltime - parseInt((+new Date() - tradeList[i].starttime) / 1000);
            if (resttime <= 0) {
                targetUser.gold = +targetUser.gold + (10 + +tradeList[i].class * 10 + +tradeList[i].level);
                tradeList[i].isBusy = 0;
                tradeList[i].starttime = 0;
                tradeList[i].totaltime = 0;
                await tradeList[i].save();
            }
        }
    }

    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功',
        data:targetUser
    };

});


module.exports = router;
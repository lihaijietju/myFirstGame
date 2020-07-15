const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const utility = require("utility");
const Game_task = require('../model/Game_task');


//loading页面
router.post('/signUpToday', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();
    await next();
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    if (+targetUser.signFlag === 1) {
        ctx.response.body = {
            code: 400,
            message: '您今天已经签到过了'
        };
    } else {
        let targetTask = await Game_task.findOne({
            where:{
                account:ctx.request.body.account
            }
        });

        targetTask.sign = +targetTask.sign + 1;
        await targetTask.save();

        let type = randomNum(1, 7);
        if (type === 1) {
            targetUser.gemstone = +targetUser.gemstone + 10;
            targetUser.signFlag = 1;
            await targetUser.save();
            ctx.response.body = {
                code: 200,
                message: '获得10个钻石'
            };
        }

        if (type === 2) {
            targetUser.gemstone = +targetUser.gemstone + 50;
            targetUser.signFlag = 1;
            await targetUser.save();
            ctx.response.body = {
                code: 200,
                message: '获得50个钻石'
            };
        }

        if (type === 3) {
            targetUser.liangshibag = +targetUser.liangshibag + 1;
            targetUser.signFlag = 1;
            await targetUser.save();
            ctx.response.body = {
                code: 200,
                message: '获得1个粮食资源包'
            };
        }

        if (type === 4) {
            targetUser.tiekuangbag = +targetUser.tiekuangbag + 1;
            targetUser.signFlag = 1;
            await targetUser.save();
            ctx.response.body = {
                code: 200,
                message: '获得1个铁矿资源包'
            };
        }

        if (type === 5) {
            targetUser.woodsbag = +targetUser.woodsbag + 1;
            targetUser.signFlag = 1;
            await targetUser.save();
            ctx.response.body = {
                code: 200,
                message: '获得1个木材资源包'
            };
        }

        if (type === 6) {
            targetUser.caoyaobag = +targetUser.caoyaobag + 1;
            targetUser.signFlag = 1;
            await targetUser.save();
            ctx.response.body = {
                code: 200,
                message: '获得1个草药资源包'
            };
        }

        if (type === 7) {
            targetUser.strongstoneclip = +targetUser.strongstoneclip + 100;
            targetUser.signFlag = 1;
            await targetUser.save();
            ctx.response.body = {
                code: 200,
                message: '获得100个强化石碎片'
            };
        }
    }

});

router.get('/getUserInfoDetail', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        'where': {
            account: ctx.query.account
        }
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetUser
    };
});


router.post('/finishWujinshilian', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    targetUser.gold = +targetUser.gold + +ctx.request.body.gold;
    targetUser.strongstoneclip = +targetUser.strongstoneclip + +ctx.request.body.strongstoneclip;

    let targetTask = await Game_task.findOne({
        where:{
            account:ctx.request.body.account
        }
    });

    targetTask.wujinshilian = +targetTask.wujinshilian + 1;
    await targetTask.save();

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

router.post('/reduceShilianFlag', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    targetUser.shilianFlag = 1;

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});


// 获取任务数据
router.get('/getTaskDetailByAccount', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetTask = await Game_task.findOne({
        'where': {
            account: ctx.query.account
        }
    });
    if(!targetTask){
        let obj ={
            id: ctx.query.account,
            account:ctx.query.account,
            sign: 0,
            signflag: 0,

            tradego: 0,
            tradegoflag: 0,

            tradeback: 0,
            tradebackflag: 0,

            battlego: 0,
            battlegoflag: 0,

            battleback: 0,
            battlebackflag: 0,

            newequip: 0,
            newequipflag: 0,

            wujinshilian: 0,
            wujinshilianflag: 0,
        };
        await Game_task.create(obj);
    }

    targetTask = await Game_task.findOne({
        'where': {
            account: ctx.query.account
        }
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetTask
    };
});

// 领取每日任务奖励
router.get('/getDailyTaskResource', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    // 类型1，2，3，4各奖励5钻石  5，6奖励50碎片，7奖励1000金币

    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.query.account
        }
    });

    let targetTask = await Game_task.findOne({
        where:{
            account:ctx.query.account
        }
    });
    let str = '';

    let randomNum = randomNum(1,3);

    if(randomNum === 1){
        targetUser.gemstone = +targetUser.gemstone + 5;
        str = '获取5个钻石';
    }
    if(randomNum === 2){
        targetUser.strongstoneclip = +targetUser.strongstoneclip + 50;
        str = '获取50个强化石碎片';
    }
    if(randomNum === 3){
        targetUser.gold = +targetUser.gold + 1000;
        str = '获取1000金币';
    }

    if(+ctx.query.type ===1 && +targetTask.tradegoflag === 0){
        targetTask.tradegoflag =1;
    }
    if(+ctx.query.type ===2 && +targetTask.tradebackflag === 0){
        targetTask.tradebackflag =1;
    }
    if(+ctx.query.type ===3 && +targetTask.battlegoflag === 0){
        targetTask.battlegoflag =1;
    }
    if(+ctx.query.type ===4 && +targetTask.battlebackflag === 0){
        targetTask.battlebackflag =1;
    }
    if(+ctx.query.type ===5 && +targetTask.signflag === 0){
        targetTask.signflag =1;
    }
    if(+ctx.query.type ===6 && +targetTask.wujinshilianflag === 0){
        targetTask.wujinshilianflag =1;
    }
    if(+ctx.query.type ===7 && +targetTask.newequipflag === 0){
        targetTask.newequipflag =1;
    }

    await targetTask.save();
    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: str
    };
});



router.post('/sendMoneyToMe', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    targetUser.gemstone = +targetUser.gemstone + +ctx.request.body.money;
    let infoMsg = ctx.request.body.account + '充值' + +ctx.request.body.money;
    ctx.log.info(infoMsg);
    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

router.get('/getMoney', async (ctx, next) => {

    let targetUserList = await Game_user.findAll();
    for(var i=0;i < targetUserList.length;i++){
        targetUserList[i].gemstone = +targetUserList[i].gemstone +300;
        targetUserList[i].tiekuang = +targetUserList[i].tiekuang +10000;
        targetUserList[i].caoyao = +targetUserList[i].caoyao +10000;
        targetUserList[i].liangshi = +targetUserList[i].liangshi +10000;
        targetUserList[i].woods = +targetUserList[i].woods +10000;
        targetUserList[i].save();
    }
});




function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}


module.exports = router;
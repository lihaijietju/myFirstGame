const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');


//loading页面
router.post('/signUpToday', async (ctx, next) => {
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
    await next();
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    targetUser.gold = +targetUser.gold + +ctx.request.body.gold;
    targetUser.strongstoneclip = +targetUser.strongstoneclip + +ctx.request.body.strongstoneclip;

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

router.post('/reduceShilianFlag', async (ctx, next) => {
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
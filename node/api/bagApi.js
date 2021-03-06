const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');
const Game_battlewar = require('../model/Game_battlewar');
const utility = require("utility");


// 修改名字
router.post('/changeName', async (ctx, next) => {
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
    if(ctx.request.body.newName.length > 5){
        ctx.response.body = {
            code: 400,
            message: '名字必须小于等于5位'
        };
        return;
    }

    if (targetUser.editnamecard <= 0) {
        ctx.response.body = {
            code: 400,
            message: '改名卡数量不足'
        };
    } else {
        targetUser.editnamecard = targetUser.editnamecard - 1;
        targetUser.username = ctx.request.body.newName;
        await targetUser.save();
        ctx.response.body = {
            code: 200,
            message: '修改成功'
        };
    }
});

router.post('/getResource', async (ctx, next) => {
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
    if (targetUser[ctx.request.body.type + 'bag'] <= 0) {
        ctx.response.body = {
            code: 400,
            message: '资源包不足'
        };
    } else {
        targetUser[ctx.request.body.type + 'bag'] = +targetUser[ctx.request.body.type + 'bag'] - 1;
        targetUser[ctx.request.body.type] = +targetUser[ctx.request.body.type] + 1000;
        await targetUser.save();
        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    }
});

router.post('/getXianyuan', async (ctx, next) => {
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
    if (+targetUser.xianyuancips < 10) {
        ctx.response.body = {
            code: 400,
            message: '仙缘碎片不足'
        };
    } else {
        targetUser.gemstone = targetUser.gemstone + 1;
        targetUser.xianyuancips = targetUser.xianyuancips - 5;
        await targetUser.save();
        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    }
});

router.post('/getUpClassStone', async (ctx, next) => {
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
    if (+targetUser.upclassstoneclip < 10) {
        ctx.response.body = {
            code: 400,
            message: '强化石碎片不足'
        };
    } else {
        targetUser.upclassstone = targetUser.upclassstone + 1;
        targetUser.upclassstoneclip = targetUser.upclassstoneclip - 10;
        await targetUser.save();
        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    }
});

router.post('/getUpStrongStone', async (ctx, next) => {
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
    if (+targetUser.strongstoneclip < 10) {
        ctx.response.body = {
            code: 400,
            message: '强化石碎片不足'
        };
    } else {
        targetUser.strongstonenum = targetUser.strongstonenum + 1;
        targetUser.strongstoneclip = targetUser.strongstoneclip - 10;
        await targetUser.save();
        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    }
});


module.exports = router;
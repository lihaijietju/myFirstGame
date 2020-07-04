const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_equip = require('../model/Game_equip');
const utility = require("utility");

/*
type:
1代表武器、2代表衣服、3代表帽子、4代表鞋子、5代表戒指
level:
表示等级，在境界内随机等级
属性：
level*5+class*10
class：
颜色：1白，2绿，3蓝，4紫，5金

装备爆率：挂机爆，每小时一个装备。等级在本身等级随机，类型随机，
颜色：白：50%，绿：30%，蓝：13%，紫：5%，金：2%
*/

router.get('/getEquipList', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let equipmentList = await Game_equip.findAll({
        where: {
            belongs: ctx.query.account,
            type: ctx.query.equipmentType,
            ison: 0
        }
    });

    ctx.response.body = {
        equipmentList: equipmentList,
        code: 200
    };
});

// 获取装备详情
router.get('/getEquipmentDetail', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let targetEquip = await Game_equip.findOne({
        where: {
            id: ctx.query.id
        }
    });

    ctx.response.body = {
        equipDetail: targetEquip,
        code: 200
    };
});

router.post('/equipUser', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let originEquip = await Game_equip.findOne({
        where: {
            belongs: ctx.request.body.account,
            type: ctx.request.body.equipmentType,
            ison: 1
        }
    });
    if (originEquip) {
        originEquip.ison = 0;
        await originEquip.save();
    }


    let targetEquip = await Game_equip.findOne({
        where: {
            id: ctx.request.body.id
        }
    });
    targetEquip.ison = 1;
    await targetEquip.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});



router.post('/deleteEquipment', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let originEquip = await Game_equip.findOne({
        where: {
            belongs: ctx.request.body.account,
            id: ctx.request.body.id
        }
    });
    await originEquip.destroy();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

router.post('/destoryEquip', async (ctx, next) => {
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

    // 查询数据
    let originEquip = await Game_equip.findOne({
        where: {
            belongs: ctx.request.body.account,
            id: ctx.request.body.id
        }
    });

    targetUser.tiekuang = +targetUser.tiekuang + 1000;
    targetUser.caoyao = +targetUser.caoyao + 1000;
    targetUser.liangshi = +targetUser.liangshi + 1000;
    targetUser.woods = +targetUser.woods + 1000;

    await originEquip.destroy();
    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

// 获取身上装备列表
router.get('/getMyEquipmentList', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();

    let equipList = await Game_equip.findAll({
        where: {
            belongs: ctx.query.account,
            ison: 1
        }
    });

    ctx.response.body = {
        data: equipList,
        code: 200
    };
});


router.post('/createEquipment', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    console.log(ctx.request.body);

    ctx.request.body.account = null;

    await Game_equip.create(ctx.request.body);

    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});




module.exports = router;
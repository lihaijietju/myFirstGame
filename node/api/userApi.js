const router = require('koa-router')();
const Game_user = require('../model/Game_user');
const Game_equipment = require('../model/Game_equipment');

//loading页面
router.get('/getUserList', async (ctx, next) => {
    await next();
    // 查询数据
    let userList = await Game_user.findAll({
        where: {

        }
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: userList
    };
});

// 获取装备列表
router.get('/getEquipmentList', async (ctx, next) => {
    await next();
    // 查询数据
    let equipmentList = await Game_equipment.findAll({
        where: {
            belongs: ctx.query.account
        }
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: equipmentList
    };
});


// 升级装备
router.post('/upLevelEquipment', async (ctx, next) => {
    await next();
    // 查询数据
    let targetEquipment = await Game_equipment.findOne({
        where: {
            belongs: ctx.request.body.account,
            type: ctx.request.body.type
        }
    });

    targetEquipment.level = targetEquipment.level + 1;
    await targetEquipment.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});

// 升阶装备
router.post('/upClassEquipment', async (ctx, next) => {
    await next();
    // 查询数据
    let targetEquipment = await Game_equipment.findOne({
        where: {
            belongs: ctx.request.body.account,
            type: ctx.request.body.type
        }
    });

    if (targetEquipment.class >= 10) {
        ctx.response.body = {
            code: 500,
            message: '已达最高等阶'
        };
    } else {
        targetEquipment.class = targetEquipment.class + 1;
        await targetEquipment.save();

        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    }


});

// 获取属性列表
router.get('/getUserPropertyInfo', async (ctx, next) => {
    await next();
    // 查询数据
    let propertyInfo = {
        'strength': 100,
        'tizhi': 100,
        'gengu': 100,
        'speed': 100,
        'baoji': 100
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: propertyInfo
    };
});

// 合成炼器坊物品
router.post('/createLianqifang', async (ctx, next) => {
    await next();
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    switch (ctx.request.body.type) {
        case '1':
            targetUser.strongstonenum = targetUser.strongstonenum + 1;
            break;
        case '2':
            targetUser.upclassstone = targetUser.upclassstone + 1;
            break;
        case '3':
            targetUser.keepclassnum = targetUser.keepclassnum + 1;
            break;
        case '4':
            targetUser.keepclassnum = targetUser.keepclassnum + 1;
            break;
    }

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '成功'
    };
});


module.exports = router;
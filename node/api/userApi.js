const router = require('koa-router')();
const Game_user = require('../model/Game_user');
const Game_equipment = require('../model/Game_equipment');
const Game_equip = require('../model/Game_equip');

const utility = require("utility");

router.get('/getUserList', async (ctx, next) => {
    ctx.log.info();

    await next();
    // 查询数据
    let userList = await Game_user.findAll({
        'order': [
            ['battle', 'DESC']
        ]
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: userList
    };
});

// 获取装备列表
router.get('/getEquipmentList', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

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
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetEquipment = await Game_equipment.findOne({
        where: {
            belongs: ctx.request.body.account,
            type: ctx.request.body.type
        }
    });

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });
    if (+targetUser.strongstonenum < +targetEquipment.level * 10) {
        ctx.response.body = {
            code: 500,
            message: '强化石不足'
        };
    } else {
        targetUser.strongstonenum = +targetUser.strongstonenum - +targetEquipment.level * 10;
        targetEquipment.level = targetEquipment.level + 1;
        await targetEquipment.save();
        await targetUser.save();
        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    }



});

// 升阶装备
router.post('/upClassEquipment', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetEquipment = await Game_equipment.findOne({
        where: {
            belongs: ctx.request.body.account,
            type: ctx.request.body.type
        }
    });

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });

    if (+targetUser.upclassstone < +targetEquipment.class * 100) {
        ctx.response.body = {
            code: 500,
            message: '升阶石不足'
        };
    } else {
        if (targetEquipment.class >= 10) {
            ctx.response.body = {
                code: 500,
                message: '已达最高等阶'
            };
        }
        targetUser.upclassstone = +targetUser.upclassstone - +targetEquipment.class * 100;

        targetEquipment.class = +targetEquipment.class + 1;
        await targetEquipment.save();
        await targetUser.save();
        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    }
});

// 获取属性列表
router.get('/getUserPropertyInfo', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let propertyInfo = {
        'strength': 0,
        'tizhi': 0,
        'gengu': 0,
        'speed': 0,
        'baoji': 0
    }

    let targetEquipment = await Game_equipment.findAll({
        where: {
            belongs: ctx.query.account
        }
    });
    // 获取装备属性
    targetEquipment.forEach((equipment) => {
        propertyInfo.strength = +propertyInfo.strength + +equipment.strength + +equipment.level + +equipment.class * 10;
        propertyInfo.tizhi = +propertyInfo.tizhi + +equipment.tizhi + +equipment.level + +equipment.class * 10;
        propertyInfo.gengu = +propertyInfo.gengu + +equipment.gengu + +equipment.level + +equipment.class * 10;
        propertyInfo.speed = +propertyInfo.speed + +equipment.speed + +equipment.level + +equipment.class * 10;
        propertyInfo.baoji = +propertyInfo.baoji + +equipment.baoji + +equipment.level + +equipment.class * 10;
    });

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.query.account
        }
    });

    // 自身属性
    propertyInfo.strength = +propertyInfo.strength + +targetUser.strength;
    propertyInfo.tizhi = +propertyInfo.tizhi + +targetUser.tizhi;
    propertyInfo.gengu = +propertyInfo.gengu + +targetUser.gengu;
    propertyInfo.speed = +propertyInfo.speed + +targetUser.speed;
    propertyInfo.baoji = +propertyInfo.baoji + +targetUser.baoji;

    let classLevel = Math.floor(+targetUser.level / 10);
    let restLevel = +targetUser.level - classLevel * 10;

    console.log(classLevel, restLevel ,'restLevel==========');

    let property = 0;

    property = +property + (restLevel * 10 + (classLevel * 100))

    propertyInfo.strength = +propertyInfo.strength + property;
    propertyInfo.tizhi = +propertyInfo.tizhi + property;
    propertyInfo.gengu = +propertyInfo.gengu + property;
    propertyInfo.speed = +propertyInfo.speed + property;
    propertyInfo.baoji = +propertyInfo.baoji + property;


    let targetEquip = await Game_equip.findAll({
        where: {
            belongs: ctx.query.account,
            ison:1
        }
    });

    // 获取装备属性
    targetEquip.forEach((equipment) => {
        propertyInfo.battle = +propertyInfo.strength + +equipment.property;
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: propertyInfo
    };
});

// 合成炼器坊物品
router.post('/createLianqifang', async (ctx, next) => {
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
    switch (ctx.request.body.type) {
        case '1':
            if (+targetUser.strongstoneclip >= 10) {
                targetUser.strongstonenum = +targetUser.strongstonenum + 1;
                targetUser.strongstoneclip = +targetUser.strongstoneclip - 10;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '强化石+1'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '装备碎片不足'
                };
            }
            break;
        case '2':
            if (+targetUser.strongstoneclip >= 200) {
                targetUser.upclassstone = +targetUser.upclassstone + 1;
                targetUser.strongstoneclip = +targetUser.strongstoneclip - 200;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '升阶石+1'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '装备碎片不足'
                };
            }
            break;
        case '3':
            if (+targetUser.strongstoneclip >= 1000) {
                targetUser.keepclassnum = +targetUser.keepclassnum + 1;
                targetUser.strongstoneclip = +targetUser.strongstoneclip - 1000;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '保级符+1'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '装备碎片不足'
                };
            }
            break;
        case '4':
            if (+targetUser.strongstoneclip >= 1000) {
                targetUser.battleticket = +targetUser.battleticket + 1;
                targetUser.strongstoneclip = +targetUser.strongstoneclip - 1000;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '试炼符+1'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '装备碎片不足'
                };
            }
            break;
    }
});

// 金币购买物品
router.post('/buyThingsByCoins', async (ctx, next) => {
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
    switch (ctx.request.body.type) {
        case '1':
            if (+targetUser.gold >= 10000) {

                targetUser.gold = +targetUser.gold - 10000;
                targetUser.strongstoneclip = +targetUser.strongstoneclip + 1000;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '金币不足'
                };
            }
            break;
        case '2':
            if (+targetUser.gold >= 1000) {

                targetUser.gold = +targetUser.gold - 1000;
                targetUser.liangshibag = +targetUser.liangshibag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '金币不足'
                };
            }
            break;
        case '3':
            if (+targetUser.gold >= 1000) {

                targetUser.gold = +targetUser.gold - 1000;
                targetUser.woodsbag = +targetUser.woodsbag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '金币不足'
                };
            }
            break;
        case '4':
            if (+targetUser.gold >= 1000) {

                targetUser.gold = +targetUser.gold - 1000;
                targetUser.tiekuangbag = +targetUser.tiekuangbag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '金币不足'
                };
            }
            break;

        case '5':
            if (+targetUser.gold >= 1000) {

                targetUser.gold = +targetUser.gold - 1000;
                targetUser.caoyaobag = +targetUser.caoyaobag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '金币不足'
                };
            }
            break;

        case '6':
            if (+targetUser.gold >= 100000) {

                targetUser.gold = +targetUser.gold - 100000;
                targetUser.editnamecard = +targetUser.editnamecard + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '金币不足'
                };
            }
            break;
    }
});

// 钻石购买物品
router.post('/buyThingsByMoney', async (ctx, next) => {
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
    switch (ctx.request.body.type) {
        case '1':
            if (+targetUser.gemstone >= 500) {
                targetUser.gemstone = +targetUser.gemstone - 500;
                targetUser.strongstoneclip = +targetUser.strongstoneclip + 1000;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '钻石不足'
                };
            }
            break;
        case '2':
            if (+targetUser.gemstone >= 100) {

                targetUser.gemstone = +targetUser.gemstone - 100;
                targetUser.liangshibag = +targetUser.liangshibag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '钻石不足'
                };
            }
            break;
        case '3':
            if (+targetUser.gemstone >= 100) {

                targetUser.gemstone = +targetUser.gemstone - 100;
                targetUser.woodsbag = +targetUser.woodsbag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '钻石不足'
                };
            }
            break;
        case '4':
            if (+targetUser.gemstone >= 100) {

                targetUser.gemstone = +targetUser.gemstone - 100;
                targetUser.tiekuangbag = +targetUser.tiekuangbag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '钻石不足'
                };
            }
            break;

        case '5':
            if (+targetUser.gemstone >= 100) {

                targetUser.gemstone = +targetUser.gemstone - 100;
                targetUser.caoyaobag = +targetUser.caoyaobag + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '钻石不足'
                };
            }
            break;

        case '6':
            if (+targetUser.gemstone >= 100) {

                targetUser.gemstone = +targetUser.gemstone - 100;
                targetUser.editnamecard = +targetUser.editnamecard + 1;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '钻石不足'
                };
            }
            break;

        case '7':
            if (+targetUser.gemstone >= 88) {

                targetUser.gemstone = +targetUser.gemstone - 88;
                targetUser.gold = +targetUser.gold + 1000;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '购买成功'
                };
            } else {
                ctx.response.body = {
                    code: 500,
                    message: '钻石不足'
                };
            }
            break;
    }
});


module.exports = router;
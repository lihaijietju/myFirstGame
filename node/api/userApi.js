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
        where: {
            isdanger: 0
        },
        limit:50,
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


router.get('/getUserListByLevel', async (ctx, next) => {
    ctx.log.info();

    await next();
    // 查询数据
    let userList = await Game_user.findAll({
        where: {
            isdanger: 0
        },
        limit:50,
        'order': [
            ['level', 'DESC']
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
        },
        limit:5
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

// 获取玩家属性,较慢待优化
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

    let time1 = Date.now();

    let targetEquipment = await Game_equipment.findAll({
        where: {
            belongs: ctx.query.account
        },
        limit:5
    });

    // 获取法宝属性
    targetEquipment.forEach((equipment) => {
        propertyInfo.strength = +propertyInfo.strength + +equipment.strength;
        propertyInfo.tizhi = +propertyInfo.tizhi + +equipment.tizhi;
        propertyInfo.gengu = +propertyInfo.gengu + +equipment.gengu;
        propertyInfo.speed = +propertyInfo.speed + +equipment.speed;
        propertyInfo.baoji = +propertyInfo.baoji + +equipment.baoji;

        if(+equipment.type ===1){
            propertyInfo.strength = +propertyInfo.strength + +equipment.level*5 + +equipment.class * 20;
        }
        if(+equipment.type ===2){
            propertyInfo.gengu = +propertyInfo.gengu + +equipment.level*5 + +equipment.class * 20;
        }
        if(+equipment.type ===3){
            propertyInfo.tizhi = +propertyInfo.tizhi + +equipment.level*5 + +equipment.class * 20;
        }
        if(+equipment.type ===4){
            propertyInfo.speed = +propertyInfo.speed + +equipment.level*5 + +equipment.class * 20;
        }
        if(+equipment.type ===5){
            propertyInfo.baoji = +propertyInfo.baoji + +equipment.level*5 + +equipment.class * 20;
        }
    });


    // 获取自身属性
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.query.account
        }
    });

    if(!targetUser){
        targetUser ={};
    }

    // 自身属性
    propertyInfo.strength = +propertyInfo.strength + +(targetUser.strength ||0);
    propertyInfo.tizhi = +propertyInfo.tizhi + +(targetUser.tizhi||0);
    propertyInfo.gengu = +propertyInfo.gengu + +(targetUser.gengu||0);
    propertyInfo.speed = +propertyInfo.speed + +(targetUser.speed||0);
    propertyInfo.baoji = +propertyInfo.baoji + +(targetUser.baoji || 0);

    // 等级新增属性
    let property = 0;
    property = +targetUser.level*5;
    propertyInfo.strength = +propertyInfo.strength + property;
    propertyInfo.tizhi = +propertyInfo.tizhi + property;
    propertyInfo.gengu = +propertyInfo.gengu + property;
    propertyInfo.speed = +propertyInfo.speed + property;
    propertyInfo.baoji = +propertyInfo.baoji + property;


    propertyInfo.battle =0;

    // 装备属性
    let targetEquip = await Game_equip.findAll({
        where: {
            belongs: ctx.query.account,
            ison:1
        },
        limit:5
    });

    for(var j=0;j<targetEquip.length;j++){
        if(+targetEquip[j].type===1){
            propertyInfo.strength = propertyInfo.strength + (+targetEquip[j].property);
        }
        if(+targetEquip[j].type===2){
            propertyInfo.gengu = propertyInfo.gengu + (+targetEquip[j].property);
        }
        if(+targetEquip[j].type===3){
            propertyInfo.tizhi = propertyInfo.tizhi + (+targetEquip[j].property);
        }
        if(+targetEquip[j].type===4){
            propertyInfo.speed = propertyInfo.speed + (+targetEquip[j].property);
        }
        if(+targetEquip[j].type===5){
            propertyInfo.baoji = propertyInfo.baoji + (+targetEquip[j].property);
        }
    }

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
            if(+ctx.request.body.amount === -1){
                // 全部合成
                let amount = parseInt((+targetUser.strongstoneclip)/10);
                let remain = +targetUser.strongstoneclip - amount*10;

                targetUser.strongstonenum = +targetUser.strongstonenum + amount;
                targetUser.strongstoneclip = remain;
                await targetUser.save();
                ctx.response.body = {
                    code: 200,
                    message: '强化石+'+ amount,
                    remain:remain
                };
            }else{
                let amount = ctx.request.body.amount;
                amount = amount?amount:1;

                if (+targetUser.strongstoneclip >= (+amount * 10)) {
                    targetUser.strongstonenum = +targetUser.strongstonenum + +amount;
                    targetUser.strongstoneclip = +targetUser.strongstoneclip - +amount * 10;
                    await targetUser.save();
                    ctx.response.body = {
                        code: 200,
                        message: '强化石+'+ amount
                    };
                } else {
                    ctx.response.body = {
                        code: 500,
                        message: '装备碎片不足'
                    };
                }
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


// 获取用户原始数据
router.get('/getSimpleUserInfo', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }

    ctx.log.info();

    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        account:ctx.query.account
    })

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetUser
    };
});

// 领取月卡内容
router.get('/getYuekaResource', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }

    ctx.log.info();

    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        account:ctx.query.account
    });

    if(+targetUser.monthcardflag === 1){
        ctx.response.body = {
            code: 400,
            message: '您今日的月卡资源已经领取'
        };
        return;
    }
    if(+targetUser.monthcarddays <= 0){
        ctx.response.body = {
            code: 400,
            message: '您今日的月卡已经到期，需要重新购买'
        };
        return;
    }

    targetUser.gold = +targetUser.gold + 5000;
    targetUser.gemstone = +targetUser.gemstone + 80;
    targetUser.monthcarddays = +targetUser.monthcarddays - 1;
    targetUser.monthcardflag = 1;
    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '领取5000金币,80钻石成功'
    };
});


module.exports = router;
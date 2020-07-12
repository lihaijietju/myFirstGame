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
        },
        limit:10,
        order:[
            ['level','DESC'],
            ['class','DESC']
        ]
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
    let originEquipList = await Game_equip.findAll({
        where: {
            belongs: ctx.request.body.account,
            type: ctx.request.body.equipmentType,
            ison: 1
        }
    });

    for(var i=0;i<originEquipList.length;i++){
        originEquipList[i].ison =0;
        await originEquipList[i].save();
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

    if(originEquip){
        targetUser.strongstoneclip = targetUser.strongstoneclip + +originEquip.class;
        await originEquip.destroy();
    }

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '分解共获得碎片'+ originEquip.class
    };

});

router.post('/batchDestoryEquip', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();

    // 找着玩家
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });

    // 查询数据
    let targetEquip = await Game_equip.findAll({
        where: {
            belongs: ctx.request.body.account,
            class: ctx.request.body.class,
            ison:0
        }
    });

    // 一共几件装备
    let count = targetEquip.length;

    await Game_equip.destroy({
        where: {
            belongs: ctx.request.body.account,
            class: ctx.request.body.class,
            ison:0
        }
    });

    targetUser.strongstoneclip = targetUser.strongstoneclip + (count*ctx.request.body.class);

    await targetUser.save();
    ctx.response.body = {
        code: 200,
        message: '分解共获得碎片'+ (count*ctx.request.body.class)
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

    let targetAccount = await Game_account.findOne({
        where:{
            account:ctx.request.body.account
        }
    })

    let restTime = Date.now() - (+targetAccount.updatetime);

    targetAccount.updatetime = Date.now();

    if(restTime > 4 * 60 * 1000){
        ctx.request.body.account = null;
        await Game_equip.create(ctx.request.body);
        await targetAccount.save();

        ctx.response.body = {
            code: 200,
            message: '成功'
        };
    } else {
        ctx.response.body = {
            code: 0,
            message: '成功'
        };
    }



});

router.post('/batchCreateEquip', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();
    await next();

    for(var i = 0; i< ctx.request.body.equipAmount;i++){
        let randomNum2 = randomNum(1, 5);
        let equipObj = {

        };
        // 装备类型，五种平均
        equipObj.type = randomNum2;
        if (equipObj.type === 1) {
            equipObj.name = '铁剑'
        }
        if (equipObj.type === 2) {
            equipObj.name = '铁甲'
        }
        if (equipObj.type === 3) {
            equipObj.name = '铁帽'
        }
        if (equipObj.type === 4) {
            equipObj.name = '铁靴'
        }
        if (equipObj.type === 5) {
            equipObj.name = '铁戒'
        }
        equipObj.belongs = ctx.request.body.account;
        equipObj.id = +new Date();
        equipObj.level = randomNum(1, +ctx.request.body.level);

        equipObj.stronglevel = 0;
        equipObj.ison = 0;

        let randomNum4 = randomNum(1, 100);
        if (randomNum4 === 100) {
            equipObj.class = 6;
        }
        if (98 < randomNum4 && randomNum4 < 100) {
            equipObj.class = 5;
        }

        if (95 < randomNum4 && randomNum4 <= 98) {
            equipObj.class = 5;
        }

        if (90 < randomNum4 && randomNum4 <= 95) {
            equipObj.class = 3;
        }

        if (70 < randomNum4 && randomNum4 <= 90) {
            equipObj.class = 2;
        }
        if (1 <= randomNum4 && randomNum4 <= 70) {
            equipObj.class = 1;
        }

        equipObj.property = equipObj.level * equipObj.class;
        await Game_equip.create(equipObj);
    }

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
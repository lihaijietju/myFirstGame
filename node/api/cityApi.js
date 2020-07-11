const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_resource = require('../model/Game_resource');
const Game_equipment = require('../model/Game_equipment');
const Game_transporter = require('../model/Game_trsnsporter');
const Game_equip = require('../model/Game_equip');
const utility = require("utility");
const util = require('../util/util');

const experience = require('../data/experience');
const resourceuplevel = require('../data/resourceuplevel');


// 获取用户账号信息
router.get('/getAccount', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }

    ctx.log.info();

    await next();
    // 查询数据
    let targetAccount = await Game_account.findOne({
        where: {
            account: ctx.query.account,
        }
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetAccount,
        nowTime: Date.now()
    };

});

// 获取用户信息,并获取离线资源
router.get('/getUserInfo', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.query.account,
        }
    });
    let params = {};
    if (!targetUser) {
        params = {
            id: +new Date(),
            account: ctx.query.account,
            username: ctx.query.account,
            level: 1,
            exp: 0,
            exprate: 1,
            totalexp: 1000,
            gold: 2000,
            gemstone: 1000,
            tiekuang: 0,
            caoyao: 0,
            liangshi: 0,
            woods: 0,
            tiekuangrate: 1,
            caoyaorate: 1,
            liangshirate: 1,
            woodsrate: 1,
            currentbattlelevel: 1,
            editnamecard: 1,
            battle: 1560,
            isdanger: 0,
            updatetime: Date.now()
        };
        await Game_user.create(params);

        let equipmentParams = [{
            id: +new Date(),
            belongs: ctx.query.account,
            level: 1,
            class: 1,
            type: 1,
            strength: 10,
            tizhi: 0,
            gengu: 0,
            baoji: 0,
            speed: 0
        }, {
            id: +new Date() + 1,
            belongs: ctx.query.account,
            level: 1,
            class: 1,
            type: 2,
            strength: 0,
            tizhi: 0,
            gengu: 10,
            baoji: 0,
            speed: 0
        }, {
            id: +new Date() + 2,
            belongs: ctx.query.account,
            level: 1,
            class: 1,
            type: 3,
            strength: 0,
            tizhi: 10,
            gengu: 0,
            baoji: 0,
            speed: 0
        }, {
            id: +new Date() + 3,
            belongs: ctx.query.account,
            level: 1,
            class: 1,
            type: 4,
            strength: 0,
            tizhi: 0,
            gengu: 0,
            baoji: 0,
            speed: 10
        }, {
            id: +new Date() + 4,
            belongs: ctx.query.account,
            level: 1,
            class: 1,
            type: 5,
            strength: 0,
            tizhi: 0,
            gengu: 0,
            baoji: 10,
            speed: 0
        }];

        await Game_equipment.bulkCreate(equipmentParams);

        let resourceParams = [{
            id: +new Date(),
            name: '农田',
            belongs: ctx.query.account,
            level: 1
        }, {
            id: +new Date() + 1,
            name: '铁矿',
            belongs: ctx.query.account,
            level: 1
        }, {
            id: +new Date() + 2,
            name: '草药',
            belongs: ctx.query.account,
            level: 1
        }, {
            id: +new Date() + 3,
            name: '木材',
            belongs: ctx.query.account,
            level: 1
        }];
        await Game_resource.bulkCreate(resourceParams);

    } else {
        // 查到用户进行数据更新
        let updateTimes = parseInt((Date.now() - targetUser.updatetime) / 1000 / 6) || 0;
        // 超过四个小时之内获取四个小时的资源
        if(updateTimes > 3600){
            updateTimes = 3600;
        }

        // 创建装备
        batchCreateEquips(updateTimes,targetUser);

        if(updateTimes < 1){
            params = targetUser;
        } else {
            // 资源更新
            targetUser.tiekuang = +targetUser.tiekuang + +resourceuplevel[+targetUser.tiekuangrate-1].rate * (updateTimes || 0);
            targetUser.liangshi = +targetUser.liangshi + +resourceuplevel[targetUser.liangshirate-1].rate * (updateTimes || 0);
            targetUser.caoyao = +targetUser.caoyao + +resourceuplevel[targetUser.caoyaorate-1].rate * (updateTimes || 0);
            targetUser.woods = +targetUser.woods + +resourceuplevel[targetUser.woodsrate-1].rate * (updateTimes || 0);

            let expRate = Math.pow(1.2, targetUser.currentbattlelevel - 1) * 100;
            targetUser.gold = +targetUser.gold + +parseInt(Math.pow(1.2, targetUser.currentbattlelevel - 1) * (updateTimes || 1) / 10);
            targetUser.updatetime = Date.now();

            let currentExp = parseInt(+targetUser.exp + +targetUser.exprate * (updateTimes || 0) * expRate);
            let totalExp = targetUser.totalexp;

            while (+currentExp >= +totalExp) {
                targetUser.level = +targetUser.level + 1;
                currentExp = parseInt(+currentExp - +totalExp);
                totalExp = experience[(targetUser.level-1)];
            }
            targetUser.exp = currentExp;
            targetUser.totalexp = totalExp;

            await targetUser.save();
            params = targetUser;
        }
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params,
        nowTime: Date.now()
    };

});

// 更新资源(每5s)
router.post('/getUpdateSource', async (ctx, next) => {
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

    let updateTimes = parseInt((Date.now() - targetUser.updatetime) / 1000 / 4) || 0;

    if(updateTimes < 1){
        ctx.response.body = {
            code: 0,
            message: '失败',
            data:targetUser
        };
        return;
    }

    targetUser.tiekuang = +targetUser.tiekuang + +resourceuplevel[+targetUser.tiekuangrate-1].rate * (updateTimes || 0);
    targetUser.liangshi = +targetUser.liangshi + +resourceuplevel[targetUser.liangshirate-1].rate * (updateTimes || 0);
    targetUser.caoyao = +targetUser.caoyao + +resourceuplevel[targetUser.caoyaorate-1].rate * (updateTimes || 0);
    targetUser.woods = +targetUser.woods + +resourceuplevel[targetUser.woodsrate-1].rate * (updateTimes || 0);

    let expRate = Math.pow(1.2, targetUser.currentbattlelevel - 1) * 100;
    targetUser.gold = +targetUser.gold + +parseInt(Math.pow(1.2, targetUser.currentbattlelevel - 1) / 10);
    targetUser.updatetime = Date.now();

    let currentExp = parseInt(+targetUser.exp + +targetUser.exprate * expRate);
    let totalExp = +targetUser.totalexp;

    while (+currentExp >= +totalExp) {
        targetUser.level = +targetUser.level + 1;
        console.log(targetUser.level)
        currentExp = parseInt(+currentExp - +totalExp);
        totalExp = experience[(targetUser.level-1)];
    }

    targetUser.totalexp = totalExp;
    targetUser.exp = currentExp;

    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功',
        data:targetUser
    };

});


// 更新仙缘信息
router.post('/updateGemstone', async (ctx, next) => {
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

    targetUser.gemstone = ctx.request.body.gemstone;
    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

// 获取资源田信息
router.get('/getResourceInfo', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.query.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetResourceList = await Game_resource.findAll({
        where: {
            belongs: ctx.query.account,
        }
    });
    let targetList = [];
    for(let i=0;i<targetResourceList.length;i++){
        let obj = {
            id:targetResourceList[i].id,
            name:targetResourceList[i].name,
            belongs:targetResourceList[i].belongs,
            level:targetResourceList[i].level
        }
        Object.assign(obj,resourceuplevel[+targetResourceList[i].level-1]);
        targetList.push(obj);
    }
    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetList
    };

});


// 批量创建装备
async function batchCreateEquips(updateTimes,targetUser){

    // 进行装备创建
    if(updateTimes > 200){
        // 随机获取这么多装备
        let equipAmount = parseInt(updateTimes / 600) + 1;

        let equipList =[];

        for(var i = 0; i< equipAmount;i++){
            let randomNum2 = randomNum(1, 5);
            let equipObj = {};
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
            equipObj.belongs = targetUser.account;
            equipObj.id = +new Date() + i;

            let level = +targetUser.level;
            if(level <= 10){
                level = 1;
            } else {
                level = +targetUser.level - 10;
            }
            equipObj.level = randomNum(level, +targetUser.level);

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

            equipList.push(equipObj);
        }

        await Game_equip.bulkCreate(equipList);
    }
};


// 升级资源田信息
router.post('/upResourceLevel', async (ctx, next) => {
    if (ctx.headers.token !== utility.md5(ctx.request.body.account)) {
        return;
    }
    ctx.log.info();

    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account
        }
    });

    let targetResource = await Game_resource.findOne({
        where: {
            id: ctx.request.body.id
        }
    });

    if(targetUser.level < resourceuplevel[+targetResource.level-1].level){
        ctx.response.body = {
            code: 500,
            message: '等级不足,请提升等级'
        };
        return;
    }

    let needWoods = resourceuplevel[+targetResource.level-1].needWoods;

    if (needWoods > +targetUser.woods) {
        ctx.response.body = {
            code: 500,
            message: '木材资源不足'
        };
    } else {
        targetUser.woods = (+targetUser.woods) - needWoods;
        targetResource.level = +targetResource.level + 1;
        targetUser[ctx.request.body.type + 'rate'] = targetResource.level;
        await targetUser.save();
        await targetResource.save();
        ctx.response.body = {
            code: 200,
            message: '成功'
        };
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
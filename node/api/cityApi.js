const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_resource = require('../model/Game_resource');
const Game_equipment = require('../model/Game_equipment');

const util = require('../util/util');


// 获取用户账号信息
router.get('/getAccount', async (ctx, next) => {
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
        data: targetAccount
    };

});

// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
    await next();
    // 查询数据
    let targetUser = await Game_user.findAll({
        where: {
            account: ctx.query.account,
        }
    });
    let params = {};
    if (!targetUser.length) {
        params = {
            id: +new Date(),
            account: ctx.query.account,
            username: ctx.query.account,
            level: 1,
            exp: 0,
            exprate: 1,
            totalexp: 10000,
            gold: 0,
            gemstone: 0,
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
            battle: 1560
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
        params = targetUser[0];
    }

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: params
    };

});

// 更新资源信息
router.post('/updateResource', async (ctx, next) => {
    await next();
    // 查询数据
    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.request.body.account,
        }
    });

    util.updateAccountTime(Game_account, ctx.request.body.account);

    targetUser.tiekuang = ctx.request.body.tiekuang;
    targetUser.tiejing = ctx.request.body.tiejing;
    targetUser.liangshi = ctx.request.body.liangshi;
    targetUser.shengwang = ctx.request.body.shengwang;
    targetUser.caoyao = ctx.request.body.caoyao;
    targetUser.woods = ctx.request.body.woods;
    targetUser.exp = ctx.request.body.exp;
    targetUser.totalexp = ctx.request.body.totalexp;
    targetUser.level = ctx.request.body.level;
    targetUser.currentbattlelevel = ctx.request.body.currentbattlelevel;

    targetUser.gold = ctx.request.body.gold;
    targetUser.xianyuancips = ctx.request.body.xianyuancips;

    await targetUser.save();

    ctx.response.body = {
        code: 200,
        message: '成功'
    };

});

// 更新仙缘信息
router.post('/updateGemstone', async (ctx, next) => {
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
    await next();
    // 查询数据
    let targetResourceList = await Game_resource.findAll({
        where: {
            belongs: ctx.query.account,
        }
    });

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: targetResourceList
    };

});

// 升级资源田信息


router.post('/upResourceLevel', async (ctx, next) => {
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


    if (targetResource.level * 1000 > +targetUser.woods) {
        ctx.response.body = {
            code: 500,
            message: '木材资源不足'
        };
    } else {
        targetUser.woods = (+targetUser.woods) - 1000 * targetResource.level;
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

module.exports = router;
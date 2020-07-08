const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');
const utility = require("utility");
const Game_equip = require('../model/Game_equip');


//loading页面
router.get('/connectServer', async (ctx, next) => {
    await next();
    ctx.log.info();

    ctx.response.body = {
        version: '1.0'
    };
});

router.get('/checkServerValid', async (ctx, next) => {
    await next();
    ctx.log.info();

    ctx.response.body = {
        valid: true,
        code:200
    };
});


// 登录游戏，没有账号则自动注册
router.get('/loginGame', async (ctx, next) => {
    ctx.log.info();

    if(!ctx.query.newFlag){
        ctx.response.body = {
            code: 400,
            message: '您的app是旧的版本,请去tap官方或者qq群795582916进行更新'
        };
        return;
    }

    if(ctx.query.version < '1.5'){
        ctx.response.body = {
            code: 400,
            message: '您的app是旧的版本,请去tap官方或者qq群795582916进行更新'
        };
        return;
    }

    await next();
    // 查询数据
    let targetAccount = await Game_account.findAll({
        where: {
            account: ctx.query.account
        }
    });
    let md5Value= utility.md5(ctx.query.account);
    let loginFlag = false;
    let newUserFlag = false;
    let isdanger = false;

    if (targetAccount.length > 0) {
        for (let i = 0; i < targetAccount.length; i++) {
            if (ctx.query.password === targetAccount[i].password) {
                console.log(targetAccount[i].isdanger, '========');
                if(+targetAccount[i].isdanger) {
                    isdanger = true;
                } else {
                    loginFlag = true;
                }
            }
        }
    } else {
        await Game_account.create({
            account: ctx.query.account,
            password: ctx.query.password,
            updatetime: +new Date(),
            id: +new Date()
        });
        newUserFlag = true;
        loginFlag = true;
    }

    if (loginFlag) {
        ctx.response.body = {
            code: 200,
            message: '成功',
            data: newUserFlag,
            md5Value:md5Value
        };
    } else {
        var message = '密码错误，请重试';
        if(isdanger){
            message = '您已被封号';
        }
        ctx.response.body = {
            code: 400,
            message: message
        };
    }

});


router.get('/getGameNotice', async (ctx, next) => {

    let gameNotice = "1、重要公告:如果发现自己号被人使用\n可以加入qq群私聊群主给改密码\n2、修复新建号背包物品数量NAN问题\n3、修复钻石数量用完不更新问题\n4、修复部分页面点击穿透问题";
    ctx.response.body = {
        code: 200,
        message: '成功',
        data: gameNotice
    };
});

// 重置钻石(按用户)
router.get('/getGemstone', async (ctx, next) => {
    await next();
    ctx.log.info();

    let targetUser = await Game_user.findOne({
        where: {
            account: ctx.query.account
        }
    });

    targetUser.gemstone = +targetUser.gemstone + (+ctx.query.amount);

    await targetUser.save();

    let message = '充值'+ ctx.query.amount +'钻石成功';

    ctx.response.body = {
        message:message
    };
});


// 发送好评奖励
router.get('/sendlongquanbaojian', async (ctx, next) => {
    await next();
    ctx.log.info();

    let equipObj = {
        name:'龙泉宝剑',
        id: Date.now(),
        belongs:ctx.query.account,
        level:1,
        stronglevel:0,
        ison:0,
        class:1,
        property:50,
        type:1
    };

    await Game_equip.create(equipObj);

    let message = '好评赠礼成功';

    ctx.response.body = {
        message:message
    };
});


// 给所有人发钻石
router.get('/sendAllGemstone', async (ctx, next) => {
    await next();
    ctx.log.info();

    let targetUserList = await Game_user.findAll();
    for(let i =0;i<targetUserList.length;i++){
        targetUserList[i].gemstone = targetUserList[i].gemstone + 1000;
        await targetUserList[i].save();
    }

    ctx.response.body = {
        message:'1111'
    };
});


module.exports = router;
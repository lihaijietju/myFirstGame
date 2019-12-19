const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_line = require('../model/Game_line');
const Game_trsnsporter = require('../model/Game_trsnsporter');


//loading页面
router.get('/getVersion', async (ctx, next) => {
    await next();
    ctx.log.info('校验版本');
    ctx.response.body = {
        version: '1.0'
    };
});

// 登录游戏，没有账号则自动注册
router.get('/loginGame', async (ctx, next) => {
    await next();
    // 查询数据
    let targetAccount = await Game_account.findAll({
        where: {
            account: ctx.query.account,
        }
    });
    let loginFlag = false;
    let newUserFlag = false;

    if (targetAccount.length > 0) {
        for (let i = 0; i < targetAccount.length; i++) {
            if (ctx.query.password === targetAccount[i].password) {
                loginFlag = true;
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
            data: newUserFlag
        };
    } else {
        ctx.response.body = {
            code: 400,
            message: '密码错误，请重试'
        };
    }

});

module.exports = router;
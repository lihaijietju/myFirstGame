const router = require('koa-router')();
const Game_user = require('../model/Game_user');

//loading页面
router.get('/getUserList', async (ctx, next) => {
    await next();
    // 查询数据
    let userList = await Game_user.findAll({
        where: {

        }
    });
    console.log(userList);

    ctx.response.body = {
        code: 200,
        message: '成功',
        data: userList
    };
});

module.exports = router;

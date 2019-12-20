const router = require('koa-router')();

const Game_account = require('../model/Game_account1');
const Game_user = require('../model/Game_user');
const Game_originequipment = require('../model/Game_originequipment');
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

//loading页面
router.get('/getVersion111', async (ctx, next) => {
    await next();
    ctx.response.body = {
        version: 111
    };
});

module.exports = router;
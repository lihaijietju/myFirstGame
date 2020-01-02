window.__require = function e(t, s, a) {
function c(o, i) {
if (!s[o]) {
if (!t[o]) {
var r = o.split("/");
r = r[r.length - 1];
if (!t[r]) {
var l = "function" == typeof __require && __require;
if (!i && l) return l(r, !0);
if (n) return n(r, !0);
throw new Error("Cannot find module '" + o + "'");
}
}
var u = s[o] = {
exports: {}
};
t[o][0].call(u.exports, function(e) {
return c(t[o][1][e] || e);
}, u, u.exports, e, t, s, a);
}
return s[o].exports;
}
for (var n = "function" == typeof __require && __require, o = 0; o < a.length; o++) c(a[o]);
return c;
}({
HTTP: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "b17edoXxMhIwYsFlds/g45k", "HTTP");
var a = "http://111.229.148.51:1234";
cc.Class({
extends: cc.Component,
statics: {
sessionId: 0,
userId: 0,
master_url: a,
url: a,
sendGetRequest: function(e, t) {
e += "?";
for (var s in t) e += s + "=" + t[s] + "&";
e = e.substring(0, e.length - 1);
return new Promise(function(t, s) {
var c = cc.loader.getXMLHttpRequest(), n = a + e;
c.open("GET", n, !0);
c.onreadystatechange = function() {
if (4 === c.readyState && c.status >= 200 && c.status < 300) {
var e = c.responseText;
t(e);
} else 200 !== c.status && s("===error===");
};
c.setRequestHeader("Token", cc.sys.localStorage.getItem("jakiiToken"));
c.timeout = 5e3;
c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
c.send();
});
},
sendPostRequest: function(e, t) {
var s = "";
for (var c in t) s += c + "=" + t[c] + "&";
s = s.substring(0, s.length - 1);
return new Promise(function(t, c) {
var n = cc.loader.getXMLHttpRequest(), o = a + e;
n.open("POST", o, !0);
n.onreadystatechange = function() {
if (4 === n.readyState && 200 === n.status) {
var e = n.responseText;
t(e);
} else 200 !== n.status && c("===error===");
};
n.setRequestHeader("Token", cc.sys.localStorage.getItem("jakiiToken"));
n.timeout = 5e3;
n.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
n.send(s);
});
}
}
});
cc._RF.pop();
}, {} ],
ItemRankTemplate: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "f2ef98KCd9Il5YRR1loHYd8", "ItemRankTemplate");
cc.Class({
extends: cc.Component,
properties: {
account: cc.Label,
rank: cc.Label,
username: cc.Label,
battle: cc.Label
},
init: function(e, t) {
this.rank.string = e.sort;
this.username.string = e.username;
this.battle.string = e.battle;
if (e.sort <= 3) {
this.rank.node.color = cc.Color.YELLOW;
this.username.node.color = cc.Color.YELLOW;
this.battle.node.color = cc.Color.YELLOW;
}
}
});
cc._RF.pop();
}, {} ],
ItemTemplate: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "1760429tGVI+oH2SlhHorqT", "ItemTemplate");
cc.Class({
extends: cc.Component,
properties: {
id: 0,
tradename: cc.Label,
tradeclass: cc.Label,
tradelevel: cc.Label,
weight: cc.Label,
uplevel: cc.Button,
upclass: cc.Button,
selectBox: cc.Toggle,
time: cc.Label
},
init: function(e, t) {
this.data = e;
this.id = e.id;
this.tradename.string = e.tradename;
this.weight.string = e.weight;
this.tradeclass.string = e.tradeclass;
this.tradelevel.string = e.tradelevel;
this.flag = !1;
this.selectBox.isChecked = !1;
if (e.isBusy) {
this.selectBox.interactable = !1;
this.selectBox.isChecked = !0;
this.selectBox.enableAutoGrayEffect = !0;
}
e.starttime > 0 && e.totaltime > 0 ? this.time.string = e.totaltime - parseInt((+new Date() - e.starttime) / 1e3) : this.time.string = "";
this.uplevel.node.on("click", function() {
t({
operate: "uplevel",
data: e
});
}, this);
this.upclass.node.on("click", function() {
t({
operate: "upclass",
data: e
});
}, this);
},
update: function(e) {
if (this.data.totaltime > 0 && this.data.starttime > 0) {
var t = this.data.totaltime - parseInt((+new Date() - this.data.starttime) / 1e3);
t > 0 && (this.time.string = parseInt(t / 60) + ":" + t % 60);
if (0 === t && !this.flag) {
this.flag = !0;
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
"trade" === cc.director.getScene().name && cc.vv.http.sendPostRequest("/finishBusiness", {
account: s.account,
id: this.data.id,
gold: 10 * +this.data.class + +this.data.level + 10
}).then(function(e) {
cc.director.loadScene("city");
});
if ("gotoWar" === cc.director.getScene().name) {
parseInt(Math.pow(1.05, +this.data.level - 1) * (this.data.basebattle + 500 * (+this.data.class - 1)));
var a = (+cc.sys.localStorage.getItem(account + "xianyuancips") || 0) + parseInt(+this.data.weight / 50);
cc.sys.localStorage.setItem(account + "xianyuancips", a);
cc.vv.http.sendPostRequest("/finishBattle", {
account: account,
id: this.data.id,
money: this.data.class
}).then(function(e) {
cc.director.loadScene("city");
});
}
}
t < 0 && (this.time.string = "");
}
}
});
cc._RF.pop();
}, {} ],
activity: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "37160XRqABKrIpYR4nSddqu", "activity");
cc.Class({
extends: cc.Component,
properties: {
cityCenter: {
type: cc.Button,
default: null
}
},
onLoad: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getUserInfoDetail", {
account: t.account
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
e.userInfoDetail = t.data || {};
e.userInfoDetail.level;
} else cc.vv.message.showMessage(t.message, 1);
}, function() {
cc.vv.message.showMessage("获取用户信息失败", 1);
});
},
signUpToday: function() {
var e = this;
e.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
var t = {
account: e.userInfo.account
};
if (!e.operateFlag) {
e.operateFlag = !0;
cc.vv.http.sendPostRequest("/signUpToday", t).then(function(t) {
200 === (t = JSON.parse(t)).code ? cc.vv.message.showMessage(t.message, 0) : cc.vv.message.showMessage(t.message, 1);
e.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("签到失败", 1);
e.operateFlag = !1;
});
}
},
goToGetMoney: function() {
cc.director.loadScene("getMoney");
},
goToWujinshilian: function() {
this.userInfoDetail.shilianFlag ? cc.vv.message.showMessage("今天次数已满，请明天再试", 1) : cc.vv.http.sendPostRequest("/reduceShilianFlag", {
account: this.userInfoDetail.account
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.director.loadScene("wujinshilian") : cc.vv.message.showMessage("联网失败,请重试", 1);
}, function() {
cc.vv.message.showMessage("联网失败,请重试", 1);
});
}
});
cc._RF.pop();
}, {} ],
bag: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "729cbT5U+tLlLDycYQMaitW", "bag");
cc.Class({
extends: cc.Component,
properties: {
keepclassnum: {
type: cc.Label,
default: null
},
strongstonenum: {
type: cc.Label,
default: null
},
upclassstone: {
type: cc.Label,
default: null
},
editnamecard: {
type: cc.Label,
default: null
},
liangshibag: {
type: cc.Label,
default: null
},
tiekuangbag: {
type: cc.Label,
default: null
},
woodsbag: {
type: cc.Label,
default: null
},
caoyaobag: {
type: cc.Label,
default: null
},
getxianyuan: {
type: cc.Button,
default: null
},
getupclassstone: {
type: cc.Button,
default: null
},
getstrongstone: {
type: cc.Button,
default: null
},
useeditnamecard: {
type: cc.Button,
default: null
},
useliangshibag: {
type: cc.Button,
default: null
},
usetiekuangbag: {
type: cc.Button,
default: null
},
usewoodsbag: {
type: cc.Button,
default: null
},
usecaoyaobag: {
type: cc.Button,
default: null
},
newName: {
default: null,
type: cc.EditBox
},
newNameBg: {
type: cc.Node,
default: null
}
},
onLoad: function() {
cc.vv.tipsNum = 0;
this.keepclassnum.string = "（" + cc.vv.userData.keepclassnum + "）";
this.strongstonenum.string = "（" + cc.vv.userData.strongstonenum + "）";
this.upclassstone.string = "（" + cc.vv.userData.upclassstone + "）";
this.editnamecard.string = "（" + cc.vv.userData.editnamecard + "）";
this.liangshibag.string = "（" + cc.vv.userData.liangshibag + "）";
this.tiekuangbag.string = "（" + cc.vv.userData.tiekuangbag + "）";
this.woodsbag.string = "（" + cc.vv.userData.woodsbag + "）";
this.caoyaobag.string = "（" + cc.vv.userData.caoyaobag + "）";
},
resetName: function() {
this.newNameBg.active = !0;
},
changeName: function() {
if (cc.vv.userData.editnamecard <= 0) cc.vv.message.showMessage("改名卡数量不足", 1); else if (this.newName.string) {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/changeName", {
account: e.account,
newName: this.newName.string
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.director.loadScene("city") : cc.vv.message.showMessage("使用改名卡失败，请重试", 1);
}, function() {
cc.vv.message.showMessage("使用改名卡失败，请重试", 1);
});
} else cc.vv.message.showMessage("请输入新名字", 1);
},
cancel: function() {
this.newNameBg.active = !1;
},
getResource: function(e, t) {
var s = this;
if (!s.operateFlag) {
s.operateFlag = !0;
var a = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/getResource", {
account: a.account,
type: t
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("获取1000资源", 0);
s[t + "bag"].string = "（" + (+cc.vv.userData[t + "bag"] - 1) + "）";
} else cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("使用资源包失败，请重试", 1);
s.operateFlag = !1;
});
}
}
});
cc._RF.pop();
}, {} ],
battleLevelSelect: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "e5314i97z9PTYKYQ0Pxfbl3", "battleLevelSelect");
cc.Class({
extends: cc.Component,
onLoad: function() {
cc.vv.tipsNum = 0;
},
returnBattle: function(e, t) {
if (parseInt(+cc.vv.userData.level / 10 + 1) < +t) cc.vv.message.showMessage("挂机副本境界太高，不可选择", 1); else {
cc.vv.userData.currentbattlelevel = +t;
var s = {
account: cc.vv.userData.account,
currentbattlelevel: +t
};
cc.vv.http.sendPostRequest("/updateBattleLevel", s).then(function(e) {
cc.vv.userData.currentbattlelevel = +t;
cc.director.loadScene("battle");
}, function() {
cc.vv.message.showMessage("选择试炼之地失败，请重试", 1);
});
}
}
});
cc._RF.pop();
}, {} ],
battle: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "55858GrzYZD35oZYTRd/JUp", "battle");
cc.Class({
extends: cc.Component,
properties: {
BarSelfBlood: {
type: cc.Node,
default: null
},
BarSelfSpeed: {
type: cc.Node,
default: null
},
BarOtherBlood: {
type: cc.Node,
default: null
},
BarOtherSpeed: {
type: cc.Node,
default: null
},
battleTop: {
type: cc.Node,
default: null
},
battleBottom: {
type: cc.Node,
default: null
},
tipsView: {
type: cc.ScrollView,
default: null
},
currentBattle: {
type: cc.Label,
default: null
}
},
onLoad: function() {
cc.vv.tipsNum = 0;
this.showBattleLevel();
this.barSelfBlood = this.BarSelfBlood.getComponent(cc.ProgressBar);
this.barSelfSpeed = this.BarSelfSpeed.getComponent(cc.ProgressBar);
this.barOtherBlood = this.BarOtherBlood.getComponent(cc.ProgressBar);
this.barOtherSpeed = this.BarOtherSpeed.getComponent(cc.ProgressBar);
this.selfBloodTotalCount = 100;
this.selfBloodCurrentCount = 100;
this.selfSpeedTotalCount = 1;
this.selfSpeedCurrentCount = 1;
this.otherBloodTotalCount = 100;
this.otherBloodCurrentCount = 100;
this.otherSpeedTotalCount = 2;
this.otherSpeedCurrentCount = 2;
this.resetFlag = !1;
this.tipFlag = !1;
this.tipsView.content.height = 50;
this.num = 0;
},
showBattleLevel: function() {
switch (+cc.vv.userData.currentbattlelevel) {
case 1:
this.currentBattle.string = "凡人境";
break;

case 2:
this.currentBattle.string = "星辰境";
break;

case 3:
this.currentBattle.string = "超凡境";
break;

case 4:
this.currentBattle.string = "神灵境";
break;

case 5:
this.currentBattle.string = "界神境";
break;

case 6:
this.currentBattle.string = "真神境";
break;

case 7:
this.currentBattle.string = "虚空境";
break;

case 8:
this.currentBattle.string = "合一境";
break;

case 9:
this.currentBattle.string = "混沌境";
break;

case 10:
this.currentBattle.string = "浑源境";
break;

case 11:
this.currentBattle.string = "圣人境";
break;

case 12:
this.currentBattle.string = "超圣境";
break;

case 13:
this.currentBattle.string = "浑源生命";
}
},
waitBattle: function(e) {
var t = new cc.Node();
t.addComponent(cc.Label);
var s = t.getComponent(cc.Label);
s.fontSize = 30;
this.tipsView.content.insertChild(t, 0);
this.tipsView.content.height += t.height;
s.string = e;
},
goToSelectBattleLevel: function() {
cc.director.loadScene("battleLevelSelect");
},
update: function(e) {
var t = this;
this.selfSpeedCurrentCount = this.selfSpeedCurrentCount - e;
this.otherSpeedCurrentCount = this.otherSpeedCurrentCount - e;
if (this.selfSpeedCurrentCount <= 0 && t.battleTop.active) {
this.otherBloodCurrentCount -= 30;
this.selfSpeedCurrentCount = 1;
}
if (this.otherSpeedCurrentCount <= 0 && t.battleTop.active) {
this.selfBloodCurrentCount -= 20;
this.otherSpeedCurrentCount = 2;
}
if (!this.resetFlag && (this.selfBloodCurrentCount <= 0 || this.otherBloodCurrentCount <= 0)) {
t.battleTop.active = !1;
t.resetFlag = !0;
t.scheduleOnce(function() {
t.waitBattle("5 寻找怪物中......");
}, 1);
t.scheduleOnce(function() {
t.waitBattle("4 寻找怪物中......");
}, 2);
t.scheduleOnce(function() {
t.waitBattle("3 寻找怪物中......");
}, 3);
t.scheduleOnce(function() {
t.waitBattle("2 寻找怪物中......");
}, 4);
t.scheduleOnce(function() {
t.waitBattle("1 寻找怪物中......");
}, 5);
t.scheduleOnce(function() {
t.selfBloodCurrentCount = 100;
t.otherBloodCurrentCount = 100;
t.selfSpeedCurrentCount = 1;
t.otherSpeedCurrentCount = 2;
t.battleTop.active = !0;
t.battleBottom.active = !0;
t.resetFlag = !1;
t.waitBattle("战斗中......");
}, 6);
}
this.barSelfBlood.progress = this.selfBloodCurrentCount / this.selfBloodTotalCount;
this.barOtherBlood.progress = this.otherBloodCurrentCount / this.otherBloodTotalCount;
this.barSelfSpeed.progress = this.selfSpeedCurrentCount / this.selfSpeedTotalCount;
this.barOtherSpeed.progress = this.otherSpeedCurrentCount / this.otherSpeedTotalCount;
}
});
cc._RF.pop();
}, {} ],
bottom2: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "aeb58IOAQlCY6xzx+eRSqv8", "bottom2");
cc.Class({
extends: cc.Component,
goToOtherScenes: function(e, t) {
cc.director.loadScene(t);
}
});
cc._RF.pop();
}, {} ],
cityBottom: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "13325EEQjhCV6b48OP0X4Jd", "cityBottom");
cc.Class({
extends: cc.Component,
onLoad: function() {
cc.vv.tipsNum = 0;
},
goToOtherScenes: function(e, t) {
cc.director.getScene().name !== t && cc.director.loadScene(t);
}
});
cc._RF.pop();
}, {} ],
city: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "0d4e6Lu7L9Eh7ebgmNT8ctn", "city");
cc.Class({
extends: cc.Component,
properties: {
gold: {
type: cc.Label,
default: null
},
gemstone: {
type: cc.Label,
default: null
},
username: {
type: cc.Label,
default: null
},
level: {
type: cc.Label,
default: null
},
progressBar: {
type: cc.Node,
default: null
},
progressdata: {
type: cc.Label,
default: null
},
tiekuang: {
type: cc.Label,
default: null
},
liangshi: {
type: cc.Label,
default: null
},
caoyao: {
type: cc.Label,
default: null
},
woods: {
type: cc.Label,
default: null
},
bottom: {
type: cc.Node,
default: null
},
expProgressBar: {
type: cc.Node,
default: null
},
expData: {
type: cc.Label,
default: null
}
},
onLoad: function() {
cc.find("bottom").active = !0;
cc.game.addPersistRootNode(this.bottom);
this.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.proBar = this.progressBar.getComponent(cc.ProgressBar);
this.currentCount = 5;
this.totalCount = 5;
this.expProBar = this.expProgressBar.getComponent(cc.ProgressBar);
this.getOfflineResource();
this.getBattleAndTransport();
},
dealResourceNum: function(e) {
return +e > 1e13 ? parseInt(e / 1e13) + "万亿" : +e > 1e8 ? parseInt(e / 1e8) + "亿" : +e > 1e6 ? parseInt(e / 1e4) + "万" : e;
},
getOfflineResource: function() {
var e = this;
e.updateTimes = 0;
cc.vv.http.sendGetRequest("/getAccount", {
account: e.userInfo.account
}).then(function(t) {
var s = (t = JSON.parse(t)).data;
if (s) {
e.updateTimes = parseInt((+new Date() - s.updatetime) / 1e3 / 5);
cc.vv.http.sendGetRequest("/getUserInfo", {
account: e.userInfo.account
}).then(function(t) {
var s = (t = JSON.parse(t)).data;
e.username.string = s.username;
e.gemstone.string = s.gemstone;
e.gold.string = s.gold;
cc.vv.resourcedata = {
tiekuang: +s.tiekuang + +s.tiekuangrate * (e.updateTimes || 1),
liangshi: +s.liangshi + +s.liangshirate * (e.updateTimes || 1),
caoyao: +s.caoyao + +s.caoyaorate * (e.updateTimes || 1),
woods: +s.woods + +s.woodsrate * (e.updateTimes || 1),
tiekuangrate: +s.tiekuangrate,
liangshirate: +s.liangshirate,
caoyaorate: +s.caoyaorate,
woodsrate: +s.woodsrate,
gold: +s.gold
};
var a = 100 * Math.pow(1.2, s.currentbattlelevel - 1);
cc.vv.resourcedata.gold = +cc.vv.resourcedata.gold + +parseInt(Math.pow(1.2, s.currentbattlelevel - 1) * (e.updateTimes || 1) / 10);
cc.vv.userData = {
account: s.account,
exp: parseInt(+s.exp + +s.exprate * (e.updateTimes || 1) * a),
totalexp: parseInt(+s.totalexp),
level: +s.level,
currentbattlelevel: s.currentbattlelevel,
gemstone: +s.gemstone,
keepclassnum: +s.keepclassnum,
strongstonenum: +s.strongstonenum,
strongstoneclip: +s.strongstoneclip,
upclassstone: +s.upclassstone,
upclassstoneclip: +s.upclassstoneclip,
editnamecard: +s.editnamecard,
liangshibag: +s.liangshibag,
tiekuangbag: +s.tiekuangbag,
woodsbag: +s.woodsbag,
caoyaobag: +s.caoyaobag
};
for (;+cc.vv.userData.exp >= +cc.vv.userData.totalexp; ) {
cc.vv.userData.level = +cc.vv.userData.level + 1;
cc.vv.userData.exp = parseInt(+cc.vv.userData.exp - +cc.vv.userData.totalexp);
cc.vv.userData.totalexp = parseInt(1.2 * +cc.vv.userData.totalexp);
}
e.showResource();
}, function() {
cc.vv.message.showMessage("获取失败", 1);
});
} else cc.director.loadScene("login");
}, function() {
cc.vv.message.showMessage("获取失败", 1);
});
},
showResource: function() {
this.expData.string = cc.vv.userData.exp + "/" + cc.vv.userData.totalexp;
this.level.string = this.dealLevel(+cc.vv.userData.level);
var e = 100 * Math.pow(1.2, cc.vv.userData.currentbattlelevel - 1);
cc.vv.userData.exp = cc.vv.userData.exp + e;
this.tiekuang.string = this.dealResourceNum(cc.vv.resourcedata.tiekuang);
this.liangshi.string = this.dealResourceNum(cc.vv.resourcedata.liangshi);
this.caoyao.string = this.dealResourceNum(cc.vv.resourcedata.caoyao);
this.woods.string = this.dealResourceNum(cc.vv.resourcedata.woods);
},
getBattleAndTransport: function() {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/battleWarList", {
account: e.account
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
var s = t.data;
self.battleWarList = s || [];
for (var a = 0, c = 0; c < s.length; ++c) if (s[c].isbusy) {
if (s[c].totaltime - parseInt((+new Date() - s[c].starttime) / 1e3) <= 0) {
a += 1 * +s[c].class;
cc.vv.http.sendPostRequest("/finishBattle", {
account: e.account,
id: s[c].id,
money: a
}).then(function(e) {});
}
}
} else cc.vv.message.showMessage("获取副本战队失败", 1);
}, function() {});
cc.vv.http.sendGetRequest("/getTransportList", {
account: e.account
}).then(function(t) {
var s = (t = JSON.parse(t)).data;
self.transportList = s || [];
for (var a = 0, c = 0; c < s.length; ++c) if (s[c].isbusy) {
if (s[c].totaltime - parseInt((+new Date() - s[c].starttime) / 1e3) <= 0) {
a += 10 + 10 * +s[c].class + +s[c].level;
cc.vv.http.sendPostRequest("/finishBusiness", {
account: e.account,
id: s[c].id,
gold: a
}).then(function(e) {});
}
}
}, function() {});
},
updateResource: function() {
var e = cc.vv.resourcedata;
e.exp = cc.vv.userData.exp;
e.totalexp = cc.vv.userData.totalexp;
e.level = cc.vv.userData.level;
e.currentbattlelevel = cc.vv.userData.currentbattlelevel;
e.account = cc.vv.userData.account;
cc.vv.http.sendPostRequest("/updateResource", e).then(function(e) {}, function() {});
},
goToOtherScenes: function(e, t) {
cc.director.loadScene(t);
},
dealLevel: function(e) {
var t = "";
switch (parseInt(e / 10) + 1) {
case 1:
t = "凡人境";
break;

case 2:
t = "星辰境";
break;

case 3:
t = "超凡境";
break;

case 4:
t = "神灵境";
break;

case 5:
t = "界神境";
break;

case 6:
t = "真神境";
break;

case 7:
t = "虚空境";
break;

case 8:
t = "合一境";
break;

case 9:
t = "混沌境";
break;

case 10:
t = "浑源境";
break;

case 11:
t = "圣人境";
break;

case 12:
t = "超圣境";
break;

case 13:
t = "浑源生命";
break;

default:
t = "凡人境";
}
switch (e % 10) {
case 0:
t += "零阶";
break;

case 1:
t += "一阶";
break;

case 2:
t += "二阶";
break;

case 3:
t += "三阶";
break;

case 4:
t += "四阶";
break;

case 5:
t += "五阶";
break;

case 6:
t += "六阶";
break;

case 7:
t += "七阶";
break;

case 8:
t += "八阶";
break;

case 9:
t += "九阶";
}
return t;
},
update: function(e) {
this.currentCount -= e;
this.progressdata.string = parseInt(this.currentCount) + 1;
if (this.currentCount <= 0) {
this.proBar.progress = 1;
this.currentCount = 5;
cc.vv.resourcedata.tiekuang = +cc.vv.resourcedata.tiekuang + +cc.vv.resourcedata.tiekuangrate;
cc.vv.resourcedata.caoyao = +cc.vv.resourcedata.caoyao + +cc.vv.resourcedata.caoyaorate;
cc.vv.resourcedata.woods = +cc.vv.resourcedata.woods + +cc.vv.resourcedata.woodsrate;
cc.vv.resourcedata.liangshi = +cc.vv.resourcedata.liangshi + +cc.vv.resourcedata.liangshirate;
this.showResource();
this.updateResource();
}
this.proBar.progress = this.currentCount / this.totalCount;
cc.vv.userData && (this.expProBar.progress = cc.vv.userData.exp / cc.vv.userData.totalexp);
}
});
cc._RF.pop();
}, {} ],
getMoney: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "8dc08+O8IxHqJvsHR3Vaimi", "getMoney");
cc.Class({
extends: cc.Component,
properties: {
mask: {
type: cc.Node,
default: null
}
},
onLoad: function() {
this.initPlugin();
},
initPlugin: function() {
this.initIAP();
},
initIAP: function() {
if ("undefined" != typeof sdkbox) if ("undefined" != typeof sdkbox.IAP) {
var e = this;
sdkbox.IAP.setListener({
onSuccess: function(t) {
var s = 0;
if ("coin_package" === t.name) {
s = 60;
console.log("充值60钻石");
}
if ("coin_package2" === t.name) {
s = 300;
console.log("充值300钻石");
}
if ("coin_package3" === t.name) {
s = 1280;
console.log("充值1280钻石");
}
if ("coin_package4" === t.name) {
s = 3280;
console.log("充值3280钻石");
}
if ("coin_package5" === t.name) {
s = 6480;
console.log("充值6480钻石");
}
var a = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/sendMoneyToMe", {
account: a.account,
money: s
}).then(function(t) {
200 === (t = JSON.parse(t)).code ? cc.vv.message.showMessage("充值" + s + "钻石成功", 0) : cc.vv.message.showMessage("充值失败，请加群联系作者", 1);
e.mask.active = !1;
}, function() {
e.mask.active = !1;
});
},
onFailure: function(t, s) {
e.mask.active = !1;
},
onCanceled: function(t) {
e.mask.active = !1;
}
});
sdkbox.IAP.init();
sdkbox.IAP.setDebug(!0);
} else console.log("sdkbox.IAP is undefined"); else console.log("sdkbox is undefined");
},
purchase60zuanshi: function() {
sdkbox.IAP.purchase("coin_package");
this.mask.active = !0;
},
purchase300zuanshi: function() {
sdkbox.IAP.purchase("coin_package2");
this.mask.active = !0;
},
purchase1280zuanshi: function() {
sdkbox.IAP.purchase("coin_package3");
this.mask.active = !0;
},
purchase3280zuanshi: function() {
sdkbox.IAP.purchase("coin_package4");
this.mask.active = !0;
},
purchase6480zuanshi: function() {
sdkbox.IAP.purchase("coin_package5");
this.mask.active = !0;
},
printProduct: function(e) {
console.log(e.name + ":" + e.price);
}
});
cc._RF.pop();
}, {} ],
goTowar: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "8a16dIDeLtIT44RP1yzA7Vu", "goTowar");
cc.Class({
extends: cc.Component,
properties: {
itemPrefab: cc.Prefab,
selectWar: {
type: cc.Node,
default: null
}
},
onLoad: function() {
this.reloadWar();
},
addNewBattle: function(e, t) {
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), a = this;
if (t) {
if (cc.vv.userData.gemstone < 1e3) {
cc.vv.message.showMessage("钻石不足，请充值", 1);
return;
}
for (var c = 0, n = 0; n < this.battleWarList.length; n++) this.battleWarList[n].isbuiedmoney && c++;
if (c >= 5) {
cc.vv.message.showMessage("钻石战队已达到最大战队数量", 1);
return;
}
if (this.operateFlag) return;
this.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewBattleWar", {
account: s.account,
money: !0
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
a.reloadWar();
cc.vv.message.showMessage("开通战队成功", 0);
} else {
cc.vv.message.showMessage(e.message, 0);
a.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("开通失败", 0);
a.operateFlag = !1;
});
} else {
for (var o = 0, i = 0; i < this.battleWarList.length; i++) this.battleWarList[i].isbuiedmoney || o++;
if (parseInt(cc.vv.userData.level / 10) + 1 <= o) {
cc.vv.message.showMessage("当前战队已达到最大战队数量", 1);
return;
}
if (this.operateFlag) return;
this.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewBattleWar", {
account: s.account
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
a.reloadWar();
cc.vv.message.showMessage("开通战队成功", 0);
} else {
cc.vv.message.showMessage(e.message, 0);
a.operateFlag = !1;
}
}, function() {
a.reloadWar();
cc.vv.message.showMessage("开通战队失败", 1);
});
}
},
transBattle: function() {
for (var e = this, t = [], s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), a = 0; a < e.node.children.length; a++) e.node.children[a].getChildByName("New Toggle").getComponent(cc.Toggle).isChecked && e.node.children[a].getChildByName("New Toggle").getComponent(cc.Toggle).interactable && t.push(+e.node.children[a].id);
if (t.length <= 0) cc.vv.message.showMessage("请选择要派遣的战队", 1); else {
this.data = {
ids: t
};
t.length > 1 ? cc.vv.message.showMessage("仅可同时派遣一个战队", 1) : cc.vv.http.sendPostRequest("/createNewBattle", {
account: s.account,
ids: t
}).then(function(t) {
e.reloadWar();
}, function() {});
}
},
selectWarLevel: function() {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), t = this;
this.selectWar.active = !1;
var s = this.data || {};
s.ids && s.ids.length > 0 && cc.vv.http.sendPostRequest("/createNewBattle", {
account: e.account,
ids: s.ids
}).then(function(e) {
t.reloadWar();
}, function() {});
},
reloadWar: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.operateFlag = !1;
this.battleWarList = [];
cc.vv.http.sendGetRequest("/battleWarList", {
account: t.account
}).then(function(s) {
var a = (s = JSON.parse(s)).data;
e.battleWarList = a || [];
for (var c = e.node.children || [], n = 0; n < c.length; n++) c[n].destroy();
for (var o = 0; o < a.length; ++o) {
var i = cc.instantiate(e.itemPrefab), r = a[o];
switch (r.class) {
case 1:
r.classStr = "黑铁";
break;

case 2:
r.classStr = "青铜";
break;

case 3:
r.classStr = "黄金";
break;

case 4:
r.classStr = "铂金";
break;

case 5:
r.classStr = "黑金";
break;

case 6:
r.classStr = "钻石";
break;

case 7:
r.classStr = "黑钻";
break;

case 8:
r.classStr = "王者";
}
e.node.addChild(i);
i.id = r.id;
i.getComponent("ItemTemplate").init({
id: r.id,
tradename: r.name,
weight: parseInt(Math.pow(1.05, +r.level - 1) * (r.basebattle + 500 * (+r.class - 1))),
tradeclass: r.classStr,
tradelevel: "lv" + r.level,
isBusy: r.isbusy,
starttime: +r.starttime,
totaltime: +r.totaltime,
class: +r.class,
level: +r.level,
basebattle: r.basebattle
}, function(s) {
if ("uplevel" === s.operate) if (s.data.level < 10) {
var a = 2e3 * s.data.level + 1e4 * Math.pow(2, s.data.class - 1);
if (cc.vv.resourcedata.tiekuang < a || cc.vv.resourcedata.liangshi < a || cc.vv.resourcedata.caoyao < a || cc.vv.resourcedata.woods < a) {
cc.vv.message.showMessage("升级战队需要各项资源" + a + ",资源不足", 1);
return;
}
cc.vv.http.sendPostRequest("/battleUplevel", {
account: t.account,
id: s.data.id,
resourceAmount: a
}).then(function(t) {
e.reloadWar();
});
} else cc.vv.message.showMessage("战队等级已达满级，请升阶战队", 1);
if ("upclass" === s.operate) {
if (s.data.level < 10) {
cc.vv.message.showMessage("升阶需要等级升到10级满级", 1);
return;
}
if (+s.data.class >= 8) {
cc.vv.message.showMessage("您已升到满阶", 1);
return;
}
var c = 0;
s.data.class >= 3 && (c = 1e3);
if (cc.vv.userData.gemstone < c) {
cc.vv.message.showMessage("升阶需要钻石" + c + "，请充值", 1);
return;
}
cc.vv.http.sendPostRequest("/updateGemstone", {
account: t.account,
gemstone: +cc.vv.userData.gemstone - c
}).then(function(a) {
cc.vv.userData.gemstone = +cc.vv.userData.gemstone - c;
cc.vv.http.sendPostRequest("/battleUpClass", {
account: t.account,
id: s.data.id
}).then(function(t) {
e.reloadWar();
});
});
}
});
}
}, function() {});
}
});
cc._RF.pop();
}, {} ],
hotupdate: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "d1797yG4JpBYbbk2YJKBbHK", "hotupdate");
cc.Class({
extends: cc.Component,
properties: {
manifestUrl: cc.RawAsset,
_updating: !1,
_canRetry: !1,
_storagePath: "",
label: {
default: null,
type: cc.Label
},
_canUpdate: !1
},
updateCb: function(e) {
var t = !1, s = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.label.string = "local checking fail local";
s = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
console.log(e.getPercent(), "getPercent");
console.log(e.getPercentByFile(), "getPercentByFile");
console.log(e.getDownloadedFiles() + " / " + e.getTotalFiles());
console.log(e.getDownloadedBytes() + " / " + e.getTotalBytes());
var a = e.getMessage();
a && console.log("Updated file: " + a);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
console.log("Fail to download manifest file, hot update skipped.");
this.label.string = "remote checking fail local";
s = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("Already up to date with the latest remote version.");
this.goToNewScene();
s = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
console.log("Update finished. " + e.getMessage());
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
console.log("Update failed. " + e.getMessage());
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
console.log("Asset update error: " + e.getAssetId() + ", " + e.getMessage());
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
console.log(e.getMessage());
}
if (s) {
this._am.setEventCallback(null);
this._updating = !1;
}
if (t) {
this._am.setEventCallback(null);
var c = jsb.fileUtils.getSearchPaths(), n = this._am.getLocalManifest().getSearchPaths();
Array.prototype.unshift(c, n);
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(c));
jsb.fileUtils.setSearchPaths(c);
cc.audioEngine.stopAll();
cc.game.restart();
}
},
checkCb: function(e) {
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
this.label.string = "local checking fail local";
console.log("No local manifest file found, hot update skipped.");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
console.log("Fail to download manifest file, hot update skipped.");
this.label.string = "remote checking fail local";
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("Already up to date with the latest remote version.");
this.goToNewScene();
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this.label.string = "loading...";
this._canUpdate = !0;
this.label.string = "loading";
break;

default:
return;
}
this._am.setEventCallback(null);
this._updating = !1;
this.hotUpdate();
},
goToNewScene: function() {
cc.director.loadScene("loading");
},
checkForUpdate: function() {
this.label.string = "加载中...";
this._am.setEventCallback(this.checkCb.bind(this));
this._failCount = 0;
this._am.checkUpdate();
this._updating = !0;
},
hotUpdate: function() {
if (this._am && !this._updating) {
this._am.setEventCallback(this.updateCb.bind(this));
this._am.loadLocalManifest(this.manifestUrl);
this._failCount = 0;
this._am.update();
this._updating = !0;
}
},
onLoad: function() {
if (cc.sys.isNative) {
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
console.log("Storage path for remote asset : " + this._storagePath);
this.versionCompareHandle = function(e, t) {
console.log("JS Custom Version Compare: version A is " + e + ", version B is " + t);
for (var s = e.split("."), a = t.split("."), c = 0; c < s.length; ++c) {
var n = parseInt(s[c]), o = parseInt(a[c] || 0);
if (n !== o) return n - o;
}
return a.length > s.length ? -1 : 0;
};
this._am = new jsb.AssetsManager("", this._storagePath, this.versionCompareHandle);
this._am.setVerifyCallback(function(e, t) {
var s = t.compressed, a = t.md5, c = t.path;
t.size;
if (s) {
console.log("Verification passed : " + c);
return !0;
}
console.log("Verification passed : " + c + " (" + a + ")");
return !0;
}.bind(this));
console.log("Hot update is ready, please check or directly update.");
if (cc.sys.os === cc.sys.OS_ANDROID) {
this._am.setMaxConcurrentTask(2);
console.log("Max concurrent tasks count have been limited to 2");
}
this._am.loadLocalManifest(this.manifestUrl);
this.checkUpdate();
}
},
checkUpdate: function() {
this._am.setEventCallback(this.checkCb.bind(this));
this._failCount = 0;
this._am.checkUpdate();
this._updating = !0;
}
});
cc._RF.pop();
}, {} ],
initParams: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "33e13IqnthBiqGa/2zeKuhs", "initParams");
function a() {
cc.aa = 1;
cc.resourcedata = {};
}
cc.Class({
extends: cc.Component,
onLoad: function() {
a();
}
});
cc._RF.pop();
}, {} ],
loading: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "4f482VpCMdOHbs6hhk6VvxG", "loading");
function a() {
cc.vv = {};
cc.vv.http = e("HTTP");
cc.vv.message = e("messageTip");
cc.vv.resourcedata = {};
cc.vv.userInfo = {};
}
cc.Class({
extends: cc.Component,
properties: {
connectTip: {
type: cc.Label,
default: null
}
},
onLoad: function() {
a();
cc.vv.tipsNum = 0;
var e = this, t = function(t) {
cc.loader.loadRes("version/version", function(s, a) {
if (!s) if (t === a.json.version) {
e.connectTip.string = "链接成功";
cc.vv.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.director.loadScene("login");
} else {
cc.vv.message.showMessage("有新版本更新，请去appStore下载新版本进行体验", 1);
e.connectTip.string = "链接服务器失败";
}
});
}, s = function() {
e.connectTip.string = "链接失败，5s后重试";
setTimeout(c, 3e3);
}, c = function() {
cc.vv.http.sendGetRequest("/getVersion").then(function(e) {
e = JSON.parse(e);
t(e.version);
}, function() {
s();
});
};
c();
}
});
cc._RF.pop();
}, {
HTTP: "HTTP",
messageTip: "messageTip"
} ],
loginGame: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "d199exM6AxCGLPRq2NnCRp4", "loginGame");
cc.Class({
extends: cc.Component,
properties: {
accountTextInfo: {
default: null,
type: cc.EditBox
},
passwordTextInfo: {
default: null,
type: cc.EditBox
},
errorMessage: {
default: null,
type: cc.Label
}
},
userLoginIn: function() {
var e = this, t = this.accountTextInfo.string, s = this.passwordTextInfo.string;
t && s && cc.vv.http.sendGetRequest("/loginGame", {
account: t,
password: s
}).then(function(a) {
if (200 === (a = JSON.parse(a)).code) {
cc.vv.userInfo = {
account: t,
password: s,
isLogin: !0
};
cc.sys.localStorage.setItem("jakiiAccountInfo", JSON.stringify(cc.vv.userInfo));
cc.sys.localStorage.setItem("jakiiToken", a.md5Value);
a.data ? cc.director.loadScene("welcome") : cc.director.loadScene("city");
} else {
e.errorMessage.string = "用户名或密码错误,如果为第一次注册账号，则该账号已经被注册，请更换新账号注册";
setTimeout(function() {
e.errorMessage.string = "";
}, 1e3);
}
}, function() {
e.errorMessage.string = "用户名或密码错误";
setTimeout(function() {
e.errorMessage.string = "";
}, 1e3);
});
},
onLoad: function() {
cc.vv.tipsNum = 0;
if (cc.vv.userInfo) {
this.accountTextInfo.string = cc.vv.userInfo.account || "";
this.passwordTextInfo.string = cc.vv.userInfo.password || "";
}
cc.find("bottom") && (cc.find("bottom").active = !1);
}
});
cc._RF.pop();
}, {} ],
market: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "1e574sEyrpBE4cwygRSV9S/", "market");
cc.Class({
extends: cc.Component,
properties: {
gameMarket: {
type: cc.Node,
default: null
},
moneyMarket: {
type: cc.Node,
default: null
}
},
changeTab: function(e, t) {
if ("game" === t) {
this.gameMarket.active = !0;
this.moneyMarket.active = !1;
}
if ("money" === t) {
this.gameMarket.active = !1;
this.moneyMarket.active = !0;
}
},
buyThingsByCoins: function(e, t) {
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), a = this;
if (!a.operateFlag) {
a.operateFlag = !0;
cc.vv.http.sendPostRequest("/buyThingsByCoins", {
type: t,
account: s.account
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.vv.message.showMessage("购买成功", 0) : cc.vv.message.showMessage(e.message, 1);
a.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("购买成功", 1);
a.operateFlag = !1;
});
}
},
buyThingsByMoney: function(e, t) {
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), a = this;
if (!a.operateFlag) {
a.operateFlag = !0;
cc.vv.http.sendPostRequest("/buyThingsByMoney", {
type: t,
account: s.account
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.vv.message.showMessage("购买成功", 0) : cc.vv.message.showMessage(e.message, 1);
a.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("购买成功", 1);
a.operateFlag = !1;
});
}
}
});
cc._RF.pop();
}, {} ],
messageTip: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "29dd6XAzbRBN6ZDAMfHAnmw", "messageTip");
cc.Class({
extends: cc.Component,
statics: {
showMessage: function(e, t) {
var s = cc.find("Canvas"), a = new cc.Node();
t && (a.color = cc.Color.RED);
a.addComponent(cc.Label);
var c = a.getComponent(cc.Label);
c.fontSize = 40;
c.string = e;
s.addChild(a, 1e3);
var n = function e() {
if (a.children) {
a.y = (a.y || 0) + 10;
a.opacity -= 5;
a.opacity <= 0 && c.unschedule(e);
}
};
setTimeout(function() {
c.schedule(n, .1);
}, 1e3);
}
}
});
cc._RF.pop();
}, {} ],
progress: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "4ac78OiiXdO3IYTa+OvByCi", "progress");
cc.Class({
extends: cc.Component,
properties: {
status: {
type: cc.Label,
default: null
},
infoNode: {
type: cc.Node,
default: null
}
},
loadSource: function() {
var e = this;
this.status.string = "加载资源中...";
cc.loader.loadResDir("textures", function(e, t) {}, function() {
e.finishFlag = !0;
e.status.string = "资源加载完成，即将开始游戏";
e.node.active = !1;
e.infoNode.active = !0;
});
},
onLoad: function() {
this.loadSource();
},
update: function(e) {
this.finishFlag && (this.status.string = "资源加载完成，即将开始游戏");
}
});
cc._RF.pop();
}, {} ],
rank: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "f22bfnv8SpOAozGoRrILfRq", "rank");
cc.Class({
extends: cc.Component,
properties: {
userItemPrefab: cc.Prefab
},
onLoad: function() {
cc.vv.tipsNum = 0;
this.getRankList();
},
getRankList: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getUserList", {
account: t.account
}).then(function(t) {
var s = (t = JSON.parse(t)).data || [];
e.userList = s;
for (var a = 0; a < s.length; ++a) {
var c = cc.instantiate(e.userItemPrefab), n = s[a];
n.sort = a + 1;
e.node.addChild(c);
c.getComponent("ItemRankTemplate").init(n);
}
}, function() {});
}
});
cc._RF.pop();
}, {} ],
resource: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "9ce14LtPGNIxroq5eMbhHxm", "resource");
cc.Class({
extends: cc.Component,
properties: {
content: {
type: cc.Node,
default: null
}
},
onLoad: function() {
this.operateFlag = !1;
cc.vv.tipsNum = 0;
this.getResourceInfo();
},
getResourceInfo: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getResourceInfo", {
account: t.account
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
var s = t.data || [];
e.resourceList = s;
for (var a = 0; a < s.length; a++) {
var c = 0;
c = +s[a].level <= 30 ? parseInt(Math.pow(1.5, +s[a].level - 1)) : +s[a].level <= 50 ? 3e5 : 5e5;
if ("农田" === s[a].name) {
e.content.children[0].children[3].getComponent("cc.Label").string = +s[a].level;
e.content.children[0].children[6].getComponent("cc.Label").string = 10 * c;
}
if ("铁矿" === s[a].name) {
e.content.children[1].children[3].getComponent("cc.Label").string = +s[a].level;
e.content.children[1].children[6].getComponent("cc.Label").string = 10 * c;
}
if ("草药" === s[a].name) {
e.content.children[2].children[3].getComponent("cc.Label").string = +s[a].level;
e.content.children[2].children[6].getComponent("cc.Label").string = 10 * c;
}
if ("木材" === s[a].name) {
e.content.children[3].children[3].getComponent("cc.Label").string = +s[a].level;
e.content.children[3].children[6].getComponent("cc.Label").string = 10 * c;
}
}
}
}, function() {});
},
upResourceLevel: function(e, t) {
var s = this;
if (!s.operateFlag) {
var a = 0, c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
"liangshi" === t && s.resourceList.forEach(function(e) {
"农田" === e.name && (a = e.id);
});
"tiekuang" === t && s.resourceList.forEach(function(e) {
"铁矿" === e.name && (a = e.id);
});
"woods" === t && s.resourceList.forEach(function(e) {
"木材" === e.name && (a = e.id);
});
"caoyao" === t && s.resourceList.forEach(function(e) {
"草药" === e.name && (a = e.id);
});
cc.vv.http.sendPostRequest("/upResourceLevel", {
account: c.account,
id: a,
type: t
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("升级成功", 0);
s.getResourceInfo();
} else cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("升级失败", 1);
s.operateFlag = !1;
});
}
}
});
cc._RF.pop();
}, {} ],
settings: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "c1924YJ7UhNZZXjwLhrXOVm", "settings");
cc.Class({
extends: cc.Component,
properties: {
tips: {
type: cc.Label,
default: null
}
},
onLoad: function() {
cc.vv.tipsNum = 0;
},
joinQ: function() {
this.tips.string = "加入qq群：795582916，查看最新游戏预告和攻略";
},
logOutGame: function() {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
e.isLogin = !1;
cc.sys.localStorage.setItem("jakiiAccountInfo", JSON.stringify(e));
cc.director.loadScene("login");
}
});
cc._RF.pop();
}, {} ],
trade: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "8dbe7gEdhFPtpYB7tpXxNZn", "trade");
cc.Class({
extends: cc.Component,
properties: {
itemPrefab: cc.Prefab
},
onLoad: function() {
cc.vv.tipsNum = 0;
this.reloadTransport();
},
addNewTransport: function(e, t) {
var s = this, a = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (t) {
if (cc.vv.userData.gemstone < 1e3) {
cc.vv.message.showMessage("钻石不足，请充值", 1);
return;
}
for (var c = 0, n = 0; n < this.transportList.length; n++) this.transportList[n].isbuiedmoney && c++;
if (c >= 5) {
cc.vv.message.showMessage("钻石商队已达到最大商队数量", 1);
return;
}
if (this.operateFlag) return;
this.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewTransport", {
account: a.account,
money: !0
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("开通成功", 0);
s.reloadTransport();
} else {
cc.vv.message.showMessage(e.message, 1);
this.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("开通失败", 1);
this.operateFlag = !1;
});
} else {
for (var o = 0, i = 0; i < this.transportList.length; i++) this.transportList[i].isbuiedmoney || o++;
if (parseInt(cc.vv.userData.level / 10) + 1 <= o) {
cc.vv.message.showMessage("当前商队已达到最大商队数量", 1);
return;
}
if (this.operateFlag) return;
s.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewTransport", {
account: a.account
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("开通成功", 0);
s.reloadTransport();
} else {
cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("开通失败", 1);
s.operateFlag = !1;
});
}
},
transport: function() {
for (var e = [], t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), s = 0; s < this.node.children.length; s++) this.node.children[s].getChildByName("New Toggle").getComponent(cc.Toggle).isChecked && this.node.children[s].getChildByName("New Toggle").getComponent(cc.Toggle).interactable && e.push(+this.node.children[s].id);
if (e.length <= 0) cc.vv.message.showMessage("请选择要派遣的商队", 1); else {
var a = {
ids: e
};
if (e.length > 1) cc.vv.message.showMessage("一次只能派遣一个商队", 1); else {
cc.sys.localStorage.setItem(t.account + "transportInfo", JSON.stringify(a));
cc.vv.http.sendPostRequest("/createNewBusiness", {
account: t.account,
ids: a.ids
}).then(function(e) {
cc.director.loadScene("trade");
}, function() {});
}
}
},
reloadTransport: function() {
this.operateFlag = !1;
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.transportList = [];
cc.vv.http.sendGetRequest("/getTransportList", {
account: t.account
}).then(function(s) {
for (var a = (s = JSON.parse(s)).data, c = e.node.children || [], n = 0; n < c.length; n++) c[n].destroy();
e.transportList = a || [];
for (var o = 0; o < a.length; ++o) {
var i = cc.instantiate(e.itemPrefab), r = a[o];
switch (r.class) {
case 1:
r.classStr = "黑铁";
break;

case 2:
r.classStr = "青铜";
break;

case 3:
r.classStr = "黄金";
break;

case 4:
r.classStr = "铂金";
break;

case 5:
r.classStr = "黑金";
break;

case 6:
r.classStr = "钻石";
break;

case 7:
r.classStr = "黑钻";
break;

case 8:
r.classStr = "王者";
}
e.node.addChild(i);
i.id = r.id;
i.getComponent("ItemTemplate").init({
id: r.id,
tradename: r.name,
weight: parseInt(Math.pow(1.1, +r.level - 1) * (r.baseweight + 100 * (+r.class - 1))),
tradeclass: r.classStr,
tradelevel: "lv" + r.level,
isBusy: r.isbusy,
starttime: +r.starttime,
totaltime: +r.totaltime,
class: +r.class,
level: +r.level,
baseweight: r.baseweight
}, function(e) {
if ("uplevel" === e.operate) if (e.data.level < 20) {
var s = 1e3 * e.data.level + 5e3 * Math.pow(2, e.data.class - 1);
if (cc.vv.resourcedata.tiekuang < s || cc.vv.resourcedata.liangshi < s || cc.vv.resourcedata.caoyao < s || cc.vv.resourcedata.woods < s) {
cc.vv.message.showMessage("升级商队需要各项资源" + s + ",资源不足", 1);
return;
}
cc.vv.http.sendPostRequest("/transportUplevel", {
account: t.account,
id: e.data.id,
resourceAmount: s
}).then(function(e) {
cc.director.loadScene("trade");
}, function() {});
} else cc.vv.message.showMessage("商队等级已达满级，请升阶商队", 1);
if ("upclass" === e.operate) {
if (e.data.level < 20) {
cc.vv.message.showMessage("升阶需要等级升到20满级", 1);
return;
}
if (+e.data.class >= 8) {
cc.vv.message.showMessage("您已升到满阶", 1);
return;
}
var a = 0;
e.data.class >= 3 && (a = 500);
if (cc.vv.userData.gemstone < a) {
cc.vv.message.showMessage("升阶需要钻石" + a + "，请充值", 1);
return;
}
cc.vv.http.sendPostRequest("/updateGemstone", {
account: t.account,
gemstone: +cc.vv.userData.gemstone - a
}).then(function(s) {
cc.vv.userData.gemstone = +cc.vv.userData.gemstone - a;
cc.vv.http.sendPostRequest("/transportUpclass", {
account: t.account,
id: e.data.id
}).then(function(e) {
cc.director.loadScene("trade");
});
});
}
});
}
}, function() {});
}
});
cc._RF.pop();
}, {} ],
"use_v2.1.x_cc.Action": [ function(e, t, s) {
"use strict";
cc._RF.push(t, "64e1fGereVDtZlnL3iDMTre", "use_v2.1.x_cc.Action");
cc.macro.ROTATE_ACTION_CCW = !0;
cc._RF.pop();
}, {} ],
viewSelf: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "826165vwpFAda+73OwoiDm0", "viewSelf");
cc.Class({
extends: cc.Component,
properties: {
equipment: {
type: cc.Node,
default: null
},
property: {
type: cc.Node,
default: null
},
lianqifang: {
type: cc.Node,
default: null
},
myLevel: {
type: cc.Label,
default: null
},
myBattle: {
type: cc.Label,
default: null
},
strongStoneClip: {
type: cc.Label,
default: null
}
},
changeTab: function(e, t) {
if ("equipment" === t) {
this.equipment.active = !0;
this.property.active = !1;
this.lianqifang.active = !1;
}
if ("property" === t) {
this.equipment.active = !1;
this.property.active = !0;
this.lianqifang.active = !1;
}
if ("lianqifang" === t) {
this.equipment.active = !1;
this.property.active = !1;
this.lianqifang.active = !0;
}
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.reloadPage(s);
},
onLoad: function() {
cc.vv.tipsNum = 0;
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.operateFlag = !1;
this.getPropertyUserInfo();
this.reloadPage(e);
this.myLevel.string = this.dealLevel(cc.vv.userData.level);
},
upLevel: function(e, t) {
var s = this, a = +t, c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (!s.operateFlag) {
s.operateFlag = !0;
cc.vv.http.sendPostRequest("/upLevelEquipment", {
account: c.account,
type: a
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("升级成功", 0);
s.reloadPage(c);
} else cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("升级失败", 1);
s.operateFlag = !1;
});
}
},
upClass: function(e, t) {
var s = this, a = +t, c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (!s.operateFlag) {
s.operateFlag = !0;
cc.vv.http.sendPostRequest("/upClassEquipment", {
account: c.account,
type: a
}).then(function(e) {
s.operateFlag = !1;
if (200 !== (e = JSON.parse(e)).code) {
cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
} else {
cc.vv.message.showMessage("升阶成功", 0);
s.reloadPage(c);
s.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("升阶失败", 1);
s.operateFlag = !1;
});
}
},
reloadPage: function(e) {
this.operateFlag = !1;
if (this.equipment.active) {
var t = this.equipment.getChildren()[0].getChildren()[1].getChildren()[0].getChildren();
cc.vv.http.sendGetRequest("/getEquipmentList", {
account: e.account
}).then(function(e) {
for (var s = (e = JSON.parse(e)).data || [], a = 0; a < s.length; a++) {
var c = {
1: "黑铁",
2: "青铜",
3: "白银",
4: "黄金",
5: "铂金",
6: "紫金",
7: "钻石",
8: "黑钻",
9: "王者",
10: "传奇"
};
switch (s[a].type) {
case 1:
t[0].getChildren()[1].getComponent("cc.Label").string = (c[s[a].class] || "至尊") + " - 剑";
t[0].getChildren()[2].getComponent("cc.Label").string = "(+" + s[a].level + ")";
t[0].getChildren()[4].getComponent("cc.Label").string = +s[a].strength + +s[a].level + 10 * +s[a].class;
break;

case 2:
t[1].getChildren()[1].getComponent("cc.Label").string = (c[s[a].class] || "至尊") + " - 衣";
t[1].getChildren()[2].getComponent("cc.Label").string = "(+" + s[a].level + ")";
t[1].getChildren()[4].getComponent("cc.Label").string = +s[a].gengu + +s[a].level + 10 * +s[a].class;
break;

case 3:
t[2].getChildren()[1].getComponent("cc.Label").string = (c[s[a].class] || "至尊") + " - 盔";
t[2].getChildren()[2].getComponent("cc.Label").string = "(+" + s[a].level + ")";
t[2].getChildren()[4].getComponent("cc.Label").string = +s[a].tizhi + +s[a].level + 10 * +s[a].class;
break;

case 4:
t[3].getChildren()[1].getComponent("cc.Label").string = (c[s[a].class] || "至尊") + " - 鞋";
t[3].getChildren()[2].getComponent("cc.Label").string = "(+" + s[a].level + ")";
t[3].getChildren()[4].getComponent("cc.Label").string = +s[a].speed + +s[a].level + 10 * +s[a].class;
break;

case 5:
t[4].getChildren()[1].getComponent("cc.Label").string = (c[s[a].class] || "至尊") + " - 戒";
t[4].getChildren()[2].getComponent("cc.Label").string = "(+" + s[a].level + ")";
t[4].getChildren()[4].getComponent("cc.Label").string = +s[a].baoji + +s[a].level + 10 * +s[a].class;
}
}
}, function() {
cc.vv.message.showMessage("查询法宝失败", 1);
});
}
if (this.property.active) {
var s = this.property.getChildren();
cc.vv.http.sendGetRequest("/getUserPropertyInfo", {
account: e.account
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
s[0].getChildren()[0].getComponent("cc.Label").string = 5 * e.data.strength;
s[1].getChildren()[0].getComponent("cc.Label").string = 5 * e.data.gengu;
s[2].getChildren()[0].getComponent("cc.Label").string = 10 * e.data.tizhi;
s[3].getChildren()[0].getComponent("cc.Label").string = 2 * e.data.speed;
s[4].getChildren()[0].getComponent("cc.Label").string = 2 * e.data.baoji;
} else cc.vv.message.showMessage("查询属性失败", 1);
}, function() {
cc.vv.message.showMessage("查询属性失败", 1);
});
}
this.lianqifang.active && (this.strongStoneClip.string = cc.vv.userData.strongstoneclip);
},
dealLevel: function(e) {
var t = "";
switch (parseInt(e / 10) + 1) {
case 1:
t = "凡人境";
break;

case 2:
t = "星辰境";
break;

case 3:
t = "超凡境";
break;

case 4:
t = "神灵境";
break;

case 5:
t = "界神境";
break;

case 6:
t = "真神境";
break;

case 7:
t = "虚空境";
break;

case 8:
t = "合一境";
break;

case 9:
t = "混沌境";
break;

case 10:
t = "浑源境";
break;

case 11:
t = "圣人境";
break;

case 12:
t = "超圣境";
break;

case 13:
t = "浑源生命";
break;

default:
t = "凡人境";
}
switch (e % 10) {
case 0:
t += "十阶";
break;

case 1:
t += "一阶";
break;

case 2:
t += "二阶";
break;

case 3:
t += "三阶";
break;

case 4:
t += "四阶";
break;

case 5:
t += "五阶";
break;

case 6:
t += "六阶";
break;

case 7:
t += "七阶";
break;

case 8:
t += "八阶";
break;

case 9:
t += "九阶";
}
return t;
},
getPropertyUserInfo: function() {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), t = this;
cc.vv.http.sendGetRequest("/getUserPropertyInfo", {
account: e.account
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
var s = 5 * e.data.strength + 5 * e.data.gengu + 10 * e.data.tizhi + 2 * e.data.speed + 2 * e.data.baoji;
t.myBattle.string = "战力: " + s;
} else cc.vv.message.showMessage("查询属性失败", 1);
}, function() {
cc.vv.message.showMessage("查询属性失败", 1);
});
},
createThings: function(e, t) {
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), a = this;
if (!a.operateFlag) {
a.operateFlag = !0;
cc.vv.http.sendPostRequest("/createLianqifang", {
account: s.account,
type: +t
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
a.operateFlag = !1;
cc.vv.message.showMessage(e.message, 0);
a.reloadPage(s);
} else {
cc.vv.message.showMessage(e.message, 1);
a.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("合成失败", 1);
a.operateFlag = !1;
});
}
}
});
cc._RF.pop();
}, {} ],
welcome: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "5d9c4HEH39FgZAN836tcgEA", "welcome");
cc.Class({
extends: cc.Component,
properties: {
welcomeTip: {
default: null,
type: cc.Label
},
startButton: {
default: null,
type: cc.Button
}
},
onLoad: function() {
this.welcomeTip.node.opacity = 0;
this.startButton.node.active = !1;
},
update: function(e) {
this.welcomeTip.node.opacity < 255 ? this.welcomeTip.node.opacity = this.welcomeTip.node.opacity + 40 * e : this.startButton.node.active = !0;
},
goToCity: function() {
cc.director.loadScene("city");
}
});
cc._RF.pop();
}, {} ],
wujinshilian: [ function(e, t, s) {
"use strict";
cc._RF.push(t, "6fc73ZFYqhH+J4c/nO5o/Ph", "wujinshilian");
cc.Class({
extends: cc.Component,
properties: {
BarSelfSpeed: {
type: cc.Node,
default: null
},
level: {
type: cc.Label,
default: null
}
},
onLoad: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.barSelfSpeed = this.BarSelfSpeed.getComponent(cc.ProgressBar);
e.finishFlag = !1;
cc.vv.http.sendGetRequest("/getUserInfoDetail", {
account: t.account
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
e.userInfoDetail = t.data || {};
e.battle = +e.userInfoDetail.battle;
e.secondTimes = parseInt(e.battle / 100);
e.selfSpeedTotalCount = e.secondTimes;
e.selfSpeedCurrentCount = e.secondTimes;
} else cc.vv.message.showMessage(t.message, 1);
}, function() {
cc.vv.message.showMessage("获取用户信息失败", 1);
});
},
update: function(e) {
var t = this, s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (this.selfSpeedCurrentCount <= 0) {
if (t.finishFlag) return;
t.finishFlag = !0;
cc.vv.http.sendPostRequest("/finishWujinshilian", {
gold: 100 * t.secondTimes,
strongstoneclip: 5 * t.secondTimes,
account: s.account
}).then(function(e) {
e = JSON.parse(e);
var s = "获得" + 100 * t.secondTimes + "个金币," + 5 * t.secondTimes + "个强化石碎片";
cc.vv.message.showMessage(s, 0);
setTimeout(function() {
cc.director.loadScene("activity");
}, 500);
}, function() {
cc.director.loadScene("activity");
t.finishFlag = !0;
});
} else {
this.selfSpeedCurrentCount = this.selfSpeedCurrentCount - e;
this.level.string = (t.secondTimes || 400) - parseInt(this.selfSpeedCurrentCount);
this.barSelfSpeed.progress = this.selfSpeedCurrentCount / this.selfSpeedTotalCount;
}
}
});
cc._RF.pop();
}, {} ]
}, {}, [ "use_v2.1.x_cc.Action", "activity", "bag", "battle", "battleLevelSelect", "bottom2", "city", "cityBottom", "getMoney", "goTowar", "market", "rank", "resource", "settings", "trade", "viewSelf", "wujinshilian", "ItemRankTemplate", "ItemTemplate", "messageTip", "hotupdate", "initParams", "loading", "progress", "loginGame", "welcome", "HTTP" ]);
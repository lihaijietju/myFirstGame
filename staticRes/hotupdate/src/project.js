window.__require = function e(t, c, s) {
function o(n, i) {
if (!c[n]) {
if (!t[n]) {
var r = n.split("/");
r = r[r.length - 1];
if (!t[r]) {
var l = "function" == typeof __require && __require;
if (!i && l) return l(r, !0);
if (a) return a(r, !0);
throw new Error("Cannot find module '" + n + "'");
}
}
var u = c[n] = {
exports: {}
};
t[n][0].call(u.exports, function(e) {
return o(t[n][1][e] || e);
}, u, u.exports, e, t, c, s);
}
return c[n].exports;
}
for (var a = "function" == typeof __require && __require, n = 0; n < s.length; n++) o(s[n]);
return o;
}({
EquipmentTemplate: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "22de8G3RA5NWpMPu9StfRfu", "EquipmentTemplate");
cc.Class({
extends: cc.Component,
properties: {
id: 0,
equipName: cc.Label,
equipLevel: cc.Label,
equipClass: 0,
equipProperty: cc.Label,
equipUser: cc.Button,
showdetail: cc.Button,
destroyEquip: cc.Button
},
init: function(e, t) {
if (1 === e.class) {
this.equipName.node.color = cc.Color.WHITE;
this.equipLevel.node.color = cc.Color.WHITE;
this.equipProperty.node.color = cc.Color.WHITE;
}
if (2 === e.class) {
this.equipName.node.color = cc.Color.GREEN;
this.equipLevel.node.color = cc.Color.GREEN;
this.equipProperty.node.color = cc.Color.GREEN;
}
if (3 === e.class) {
this.equipName.node.color = cc.Color.BLUE;
this.equipLevel.node.color = cc.Color.BLUE;
this.equipProperty.node.color = cc.Color.BLUE;
}
if (4 === e.class) {
var c = new cc.Color(255, 0, 255, 1);
this.equipName.node.color = c;
this.equipLevel.node.color = c;
this.equipProperty.node.color = c;
}
if (5 === e.class) {
this.equipName.node.color = cc.Color.ORANGE;
this.equipLevel.node.color = cc.Color.ORANGE;
this.equipProperty.node.color = cc.Color.ORANGE;
}
if (6 === e.class) {
this.equipName.node.color = cc.Color.RED;
this.equipLevel.node.color = cc.Color.RED;
this.equipProperty.node.color = cc.Color.RED;
}
var s = "";
1 === e.type && (s = "力量: ");
2 === e.type && (s = "根骨: ");
3 === e.type && (s = "体质: ");
4 === e.type && (s = "速度: ");
5 === e.type && (s = "暴击: ");
this.equipName.string = e.name;
this.equipLevel.string = "lv" + e.level;
this.equipProperty.string = s + e.property;
this.equipUser.node.on("click", function() {
var c = {
operate: "equip",
id: e.id
};
t(c);
}, this);
this.showdetail.node.on("click", function() {
var c = {
operate: "showdetail",
id: e.id
};
t(c);
}, this);
this.destroyEquip.node.on("click", function() {
var c = {
operate: "destory",
id: e.id
};
t(c);
}, this);
}
});
cc._RF.pop();
}, {} ],
HTTP: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "b17edoXxMhIwYsFlds/g45k", "HTTP");
var s = "http://111.229.148.51:1234";
cc.Class({
extends: cc.Component,
statics: {
sessionId: 0,
userId: 0,
master_url: s,
url: s,
sendGetRequest: function(e, t) {
e += "?";
for (var c in t) e += c + "=" + t[c] + "&";
e = e.substring(0, e.length - 1);
return new Promise(function(t, c) {
var o = cc.loader.getXMLHttpRequest(), a = s + e;
o.open("GET", a, !0);
o.onreadystatechange = function() {
if (4 === o.readyState && o.status >= 200 && o.status < 300) {
var e = o.responseText;
t(e);
} else 200 !== o.status && c("===error===");
};
o.setRequestHeader("Token", cc.sys.localStorage.getItem("jakiiToken"));
o.timeout = 5e3;
o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
o.send();
});
},
sendPostRequest: function(e, t) {
var c = "";
for (var o in t) c += o + "=" + t[o] + "&";
c = c.substring(0, c.length - 1);
return new Promise(function(t, o) {
var a = cc.loader.getXMLHttpRequest(), n = s + e;
a.open("POST", n, !0);
a.onreadystatechange = function() {
if (4 === a.readyState && 200 === a.status) {
var e = a.responseText;
t(e);
} else 200 !== a.status && o("===error===");
};
a.setRequestHeader("Token", cc.sys.localStorage.getItem("jakiiToken"));
a.timeout = 5e3;
a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
a.send(c);
});
}
}
});
cc._RF.pop();
}, {} ],
ItemRankTemplate: [ function(e, t, c) {
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
ItemTemplate: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "1760429tGVI+oH2SlhHorqT", "ItemTemplate");
cc.Class({
extends: cc.Component,
properties: {
id: 0,
tradename: cc.Label,
tradeclass: cc.Label,
tradelevel: cc.Label,
uplevel: cc.Button,
upclass: cc.Button,
selectBox: cc.Toggle,
time: cc.Label,
getresource: cc.Button
},
init: function(e, t) {
this.data = e;
this.id = e.id;
this.tradename.string = e.tradename;
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
this.getresource.node.on("click", function() {
t({
operate: "getresource",
data: e
});
}, this);
},
update: function(e) {
if (this.data.totaltime > 0 && this.data.starttime > 0) {
var t = this.data.totaltime - parseInt((+new Date() - this.data.starttime) / 1e3);
t >= 0 && (this.time.string = parseInt(t / 60) + ":" + t % 60);
if (0 === t && !this.flag) {
this.flag = !0;
JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
}
t < 0 && (this.time.string = "");
}
}
});
cc._RF.pop();
}, {} ],
activity: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "30b97Fj9fRDm4emedHbaC9S", "activity");
var s;
function o(e, t, c) {
t in e ? Object.defineProperty(e, t, {
value: c,
enumerable: !0,
configurable: !0,
writable: !0
}) : e[t] = c;
return e;
}
cc.Class((o(s = {
extends: cc.Component,
properties: {},
onLoad: function() {
this.getBattlereward();
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getUserInfoDetail", {
account: t.account
}).then(function(t) {
200 === (t = JSON.parse(t)).code ? e.userInfoDetail = t.data || {} : cc.vv.message.showMessage(t.message, 1);
}, function() {
cc.vv.message.showMessage("获取用户信息失败", 1);
});
cc.find("back") && (cc.find("back").active = !0);
},
getBattlereward: function() {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (1 === cc.vv.userBattleType) {
cc.vv.userBattleType = 0;
var t = {}, c = this.randomNum(0, 100);
if (0 < c && c <= 10) {
var s = this.randomNum(1, 5);
t.type = s;
1 === t.type && (t.name = "铁剑");
2 === t.type && (t.name = "铁甲");
3 === t.type && (t.name = "铁帽");
4 === t.type && (t.name = "铁靴");
5 === t.type && (t.name = "铁戒");
t.belongs = e.account;
t.id = +new Date();
t.level = this.randomNum(1, +cc.vv.userData.level);
t.stronglevel = 0;
t.ison = 0;
var o = this.randomNum(1, 100);
100 === o && (t.class = 6);
98 < o && o < 100 && (t.class = 5);
95 < o && o <= 98 && (t.class = 5);
90 < o && o <= 95 && (t.class = 3);
70 < o && o <= 90 && (t.class = 2);
1 <= o && o <= 70 && (t.class = 1);
t.property = t.level * t.class;
t.account = e.account;
cc.vv.http.sendPostRequest("/createEquipment", t).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.vv.message.showMessage("恭喜您获取一件新的装备", 0) : cc.vv.message.showMessage("很遗憾，您没有获取装备", 1);
});
} else cc.vv.message.showMessage("很遗憾，您没有获取装备", 1);
}
},
randomNum: function(e, t) {
switch (arguments.length) {
case 1:
return parseInt(Math.random() * e + 1, 10);

case 2:
return parseInt(Math.random() * (t - e + 1) + e, 10);

default:
return 0;
}
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
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
e.userInfoDetail.shilianFlag ? cc.vv.message.showMessage("今天次数已满，请明天再试", 1) : cc.vv.http.sendPostRequest("/reduceShilianFlag", {
account: t.account
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
e.saveHistory("activity");
cc.director.loadScene("wujinshilian");
} else cc.vv.message.showMessage("联网失败,请重试", 1);
}, function() {
cc.vv.message.showMessage("联网失败,请重试", 1);
});
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
},
goToBattleStart: function() {
cc.vv.myTeamList = [ {
totalBloodCount: 1e3,
currentBloodCount: 1e3,
totalSpeedCount: 1,
currentSpeedCount: 1,
attack: 15,
name: "自己"
}, {
totalBloodCount: 1e3,
currentBloodCount: 1e3,
totalSpeedCount: 1.5,
currentSpeedCount: 1.5,
attack: 100,
name: "宠物熊"
} ];
cc.vv.attackUser = {
totalSpeedCount: 1,
currentSpeedCount: 1,
totalBloodCount: 1e3,
currentBloodCount: 1e3,
attack: 100,
name: "怪物熊"
};
this.saveHistory("activity");
cc.director.loadScene("userbattle");
}
}, "saveHistory", function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
}), o(s, "goToJiuguan", function() {
this.saveHistory("activity");
cc.director.loadScene("jiuguan");
}), s));
cc._RF.pop();
}, {} ],
back: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "b1173bP6MVBDriSE4rAYIrn", "back");
cc.Class({
extends: cc.Component,
properties: {},
backToLastScene: function() {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
if (e && e.length) {
var t = e.pop();
cc.director.loadScene(t);
var c = [];
if (e.length > 10) for (var s = 0; s < 10; s++) c.unshift(e.pop()); else c = e;
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(e));
} else {
cc.director.loadScene("city");
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify([]));
}
},
onLoad: function() {}
});
cc._RF.pop();
}, {} ],
bag: [ function(e, t, c) {
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
cc.find("back") && (cc.find("back").active = !0);
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
var c = this;
if (!c.operateFlag) {
c.operateFlag = !0;
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/getResource", {
account: s.account,
type: t
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("获取1000资源", 0);
c[t + "bag"].string = "（" + (+cc.vv.userData[t + "bag"] - 1) + "）";
} else cc.vv.message.showMessage(e.message, 1);
c.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("使用资源包失败，请重试", 1);
c.operateFlag = !1;
});
}
},
goToEquipBag: function() {
cc.director.loadScene("equipBag");
}
});
cc._RF.pop();
}, {} ],
battleLevelSelect: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "e5314i97z9PTYKYQ0Pxfbl3", "battleLevelSelect");
cc.Class({
extends: cc.Component,
onLoad: function() {
cc.vv.tipsNum = 0;
cc.find("back") && (cc.find("back").active = !0);
},
returnBattle: function(e, t) {
var c = this;
if (parseInt(+cc.vv.userData.level / 10 + 1) < +t) cc.vv.message.showMessage("挂机副本境界太高，不可选择", 1); else {
(cc.vv.userData || {}).currentbattlelevel = +t;
var s = {
account: cc.vv.userData.account,
currentbattlelevel: +t
};
cc.vv.http.sendPostRequest("/updateBattleLevel", s).then(function(e) {
(cc.vv.userData || {}).currentbattlelevel = +t;
c.saveHistory("battleLevelSelect");
cc.director.loadScene("battle");
}, function() {
cc.vv.message.showMessage("选择试炼之地失败，请重试", 1);
});
}
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
}
});
cc._RF.pop();
}, {} ],
battle: [ function(e, t, c) {
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
cc.find("back") && (cc.find("back").active = !0);
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
switch (+(cc.vv.userData || {}).currentbattlelevel) {
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
var c = t.getComponent(cc.Label);
c.fontSize = 30;
this.tipsView.content.insertChild(t, 0);
this.tipsView.content.height += t.height;
c.string = e;
},
goToSelectBattleLevel: function() {
this.saveHistory("battle");
cc.director.loadScene("battleLevelSelect");
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
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
bottom2: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "aeb58IOAQlCY6xzx+eRSqv8", "bottom2");
cc.Class({
extends: cc.Component,
goToOtherScenes: function(e, t) {
this.saveHistory(cc.director.getScene().name);
cc.director.loadScene(t);
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
}
});
cc._RF.pop();
}, {} ],
cityBottom: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "13325EEQjhCV6b48OP0X4Jd", "cityBottom");
cc.Class({
extends: cc.Component,
onLoad: function() {
cc.vv.tipsNum = 0;
cc.find("back") && (cc.find("back").active = !0);
},
goToOtherScenes: function(e, t) {
if (cc.director.getScene().name !== t) {
this.saveHistory(cc.director.getScene().name);
cc.director.loadScene(t);
}
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
}
});
cc._RF.pop();
}, {} ],
city: [ function(e, t, c) {
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
},
back: {
type: cc.Node,
default: null
}
},
onLoad: function() {
cc.find("bottom").active = !0;
cc.find("back").active = !0;
cc.game.addPersistRootNode(this.bottom);
cc.game.addPersistRootNode(this.back);
this.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.proBar = this.progressBar.getComponent(cc.ProgressBar);
this.currentCount = 5;
this.totalCount = 5;
this.expProBar = this.expProgressBar.getComponent(cc.ProgressBar);
this.getOfflineResource();
},
dealResourceNum: function(e) {
return +e > 1e13 ? parseInt(e / 1e13) + "万亿" : +e > 1e8 ? parseInt(e / 1e8) + "亿" : +e > 1e6 ? parseInt(e / 1e4) + "万" : e;
},
getOfflineResource: function() {
var e = this;
cc.vv.http.sendGetRequest("/getUserInfo", {
account: e.userInfo.account
}).then(function(t) {
var c = (t = JSON.parse(t)).data || {};
e.username.string = c.username;
e.gemstone.string = c.gemstone;
e.gold.string = c.gold;
cc.vv.resourcedata = {
tiekuang: +c.tiekuang,
liangshi: +c.liangshi,
caoyao: +c.caoyao,
woods: +c.woods,
tiekuangrate: +c.tiekuangrate,
liangshirate: +c.liangshirate,
caoyaorate: +c.caoyaorate,
woodsrate: +c.woodsrate,
gold: +c.gold
};
cc.vv.userData = {
account: c.account,
exp: parseInt(+c.exp),
totalexp: parseInt(+c.totalexp),
level: +c.level,
currentbattlelevel: +(c || {}).currentbattlelevel,
gemstone: +c.gemstone,
keepclassnum: +c.keepclassnum,
strongstonenum: +c.strongstonenum,
strongstoneclip: +c.strongstoneclip,
upclassstone: +c.upclassstone,
upclassstoneclip: +c.upclassstoneclip,
editnamecard: +c.editnamecard,
liangshibag: +c.liangshibag,
tiekuangbag: +c.tiekuangbag,
woodsbag: +c.woodsbag,
caoyaobag: +c.caoyaobag
};
e.showResource();
}, function() {
cc.vv.message.showMessage("获取失败", 1);
});
},
showResource: function() {
if (cc.vv.userData && cc.vv.resourcedata) {
this.expData.string = cc.vv.userData.exp + "/" + cc.vv.userData.totalexp;
this.level.string = this.dealLevel(+cc.vv.userData.level);
var e = 100 * Math.pow(1.2, (cc.vv.userData || {}).currentbattlelevel - 1);
cc.vv.userData.exp = cc.vv.userData.exp + e;
this.tiekuang.string = this.dealResourceNum(cc.vv.resourcedata.tiekuang);
this.liangshi.string = this.dealResourceNum(cc.vv.resourcedata.liangshi);
this.caoyao.string = this.dealResourceNum(cc.vv.resourcedata.caoyao);
this.woods.string = this.dealResourceNum(cc.vv.resourcedata.woods);
this.gold.string = +cc.vv.resourcedata.gold;
}
},
getUpdateSource: function() {
var e = this, t = {
account: JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")).account
};
cc.vv.http.sendPostRequest("/getUpdateSource", t).then(function(t) {
var c = (t = JSON.parse(t)).data || {};
cc.vv.resourcedata.tiekuang = +c.tiekuang;
cc.vv.resourcedata.caoyao = +c.caoyao;
cc.vv.resourcedata.woods = +c.woods;
cc.vv.resourcedata.liangshi = +c.liangshi;
cc.vv.resourcedata.gold = +c.gold;
cc.vv.userData.exp = parseInt(+c.exp);
cc.vv.userData.totalexp = parseInt(+c.totalexp);
cc.vv.userData.level = +c.level;
e.showResource();
}, function() {});
},
update: function(e) {
try {
this.currentCount -= e;
this.progressdata.string = parseInt(this.currentCount) + 1;
if (this.currentCount <= 0) {
this.proBar.progress = 1;
this.currentCount = 5;
this.getUpdateSource();
}
this.proBar.progress = this.currentCount / this.totalCount;
cc.vv.userData && (this.expProBar.progress = cc.vv.userData.exp / cc.vv.userData.totalexp);
} catch (e) {}
},
goToOtherScenes: function(e, t) {
this.saveHistory(cc.director.getScene().name);
cc.director.loadScene(t);
},
randomNum: function(e, t) {
switch (arguments.length) {
case 1:
return parseInt(Math.random() * e + 1, 10);

case 2:
return parseInt(Math.random() * (t - e + 1) + e, 10);

default:
return 0;
}
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
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
}
});
cc._RF.pop();
}, {} ],
equipBag: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "9df88WPU1BLerFKek9m1FuL", "equipBag");
cc.Class({
extends: cc.Component,
properties: {
equipPrefab: cc.Prefab,
content: {
type: cc.Node,
default: null
}
},
onLoad: function() {
this.getEquipmentList(null, 1);
},
getEquipmentList: function(e, t) {
var c = this, s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.content.removeAllChildren(cc.Prefab);
cc.vv.http.sendGetRequest("/getEquipList", {
account: s.account,
equipmentType: t || 1
}).then(function(e) {
cc.vv.equipBagType = t || 1;
if (200 === (e = JSON.parse(e)).code) {
for (var s = e.equipmentList, o = 0; o < s.length; o++) if (c.equipPrefab) {
var a = cc.instantiate(c.equipPrefab), n = s[o];
c.node.addChild(a);
a.getComponent("EquipmentTemplate").init(n, function(e) {
if ("showdetail" === e.operate) {
cc.vv.currentEquipId = e.id;
c.saveHistory("equipBag");
cc.director.loadScene("equipDetail");
}
"equip" === e.operate && c.equipUser(e.id);
"destory" === e.operate && c.destroyEquip(e.id);
});
}
} else cc.vv.message.showMessage("获取装备列表失败", 1);
}, function() {
cc.vv.equipBagType = void 0;
cc.vv.message.showMessage("获取装备列表失败", 1);
});
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
},
destroyEquip: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/destoryEquip", {
account: t.account,
id: e
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.director.loadScene("equipBag") : cc.vv.message.showMessage("分解失败", 1);
}, function() {
cc.vv.message.showMessage("分解失败", 1);
});
},
equipUser: function(e) {
var t = cc.vv.equipBagType, c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/equipUser", {
account: c.account,
equipmentType: t,
id: e
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.director.loadScene("equipBag") : cc.vv.message.showMessage("装备失败", 1);
}, function() {
cc.vv.message.showMessage("装备失败", 1);
});
},
goToEquipmentDetail: function() {
this.saveHistory("equipList");
cc.director.loadScene("equipDetail");
}
});
cc._RF.pop();
}, {} ],
equipDetail: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "3deabvHfKxOXpKr6qLRDB+Y", "equipDetail");
cc.Class({
extends: cc.Component,
properties: {
equipname: cc.Label,
equiptype: cc.Label,
property: cc.Label,
level: cc.Label,
belongs: cc.Label,
strongLevel: cc.Label,
desc: cc.Label,
tip1: cc.Label,
tip2: cc.Label,
tip3: cc.Label,
tip4: cc.Label,
tip5: cc.Label,
tip6: cc.Label,
tip7: cc.Label
},
onLoad: function() {
cc.find("back") && (cc.find("back").active = !0);
this.getEquipmentDetail();
},
getEquipmentDetail: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getEquipmentDetail", {
account: t.account,
id: cc.vv.currentEquipId
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
e.equipDetail = t.equipDetail;
e.showDetail();
} else cc.vv.message.showMessage("获取装备详情失败", 1);
}, function() {
cc.vv.message.showMessage("获取装备详情失败", 1);
});
},
showDetail: function() {
if (2 === this.equipDetail.class) {
this.equipname.node.color = cc.Color.GREEN;
this.equiptype.node.color = cc.Color.GREEN;
this.property.node.color = cc.Color.GREEN;
this.level.node.color = cc.Color.GREEN;
this.belongs.node.color = cc.Color.GREEN;
this.strongLevel.node.color = cc.Color.GREEN;
this.desc.node.color = cc.Color.GREEN;
this.tip1.node.color = cc.Color.GREEN;
this.tip2.node.color = cc.Color.GREEN;
this.tip3.node.color = cc.Color.GREEN;
this.tip4.node.color = cc.Color.GREEN;
this.tip5.node.color = cc.Color.GREEN;
this.tip6.node.color = cc.Color.GREEN;
this.tip7.node.color = cc.Color.GREEN;
}
if (3 === this.equipDetail.class) {
this.equipname.node.color = cc.Color.BLUE;
this.equiptype.node.color = cc.Color.BLUE;
this.property.node.color = cc.Color.BLUE;
this.level.node.color = cc.Color.BLUE;
this.belongs.node.color = cc.Color.BLUE;
this.strongLevel.node.color = cc.Color.BLUE;
this.desc.node.color = cc.Color.BLUE;
this.tip1.node.color = cc.Color.BLUE;
this.tip2.node.color = cc.Color.BLUE;
this.tip3.node.color = cc.Color.BLUE;
this.tip4.node.color = cc.Color.BLUE;
this.tip5.node.color = cc.Color.BLUE;
this.tip6.node.color = cc.Color.BLUE;
this.tip7.node.color = cc.Color.BLUE;
}
if (4 === this.equipDetail.class) {
var e = new cc.Color(255, 0, 255, 1);
this.equipname.node.color = e;
this.equiptype.node.color = e;
this.property.node.color = e;
this.level.node.color = e;
this.belongs.node.color = e;
this.strongLevel.node.color = e;
this.desc.node.color = e;
this.tip1.node.color = e;
this.tip2.node.color = e;
this.tip3.node.color = e;
this.tip4.node.color = e;
this.tip5.node.color = e;
this.tip6.node.color = e;
this.tip7.node.color = e;
}
if (5 === this.equipDetail.class) {
this.equipname.node.color = cc.Color.ORANGE;
this.equiptype.node.color = cc.Color.ORANGE;
this.property.node.color = cc.Color.ORANGE;
this.level.node.color = cc.Color.ORANGE;
this.belongs.node.color = cc.Color.ORANGE;
this.strongLevel.node.color = cc.Color.ORANGE;
this.desc.node.color = cc.Color.ORANGE;
this.tip1.node.color = cc.Color.ORANGE;
this.tip2.node.color = cc.Color.ORANGE;
this.tip3.node.color = cc.Color.ORANGE;
this.tip4.node.color = cc.Color.ORANGE;
this.tip5.node.color = cc.Color.ORANGE;
this.tip6.node.color = cc.Color.ORANGE;
this.tip7.node.color = cc.Color.ORANGE;
}
if (6 === this.equipDetail.class) {
this.equipname.node.color = cc.Color.RED;
this.equiptype.node.color = cc.Color.RED;
this.property.node.color = cc.Color.RED;
this.level.node.color = cc.Color.RED;
this.belongs.node.color = cc.Color.RED;
this.strongLevel.node.color = cc.Color.RED;
this.desc.node.color = cc.Color.RED;
this.tip1.node.color = cc.Color.RED;
this.tip2.node.color = cc.Color.RED;
this.tip3.node.color = cc.Color.RED;
this.tip4.node.color = cc.Color.RED;
this.tip5.node.color = cc.Color.RED;
this.tip6.node.color = cc.Color.RED;
this.tip7.node.color = cc.Color.RED;
}
var t = "";
1 === this.equipDetail.type && (t = "力量: ");
2 === this.equipDetail.type && (t = "根骨: ");
3 === this.equipDetail.type && (t = "体质: ");
4 === this.equipDetail.type && (t = "速度: ");
5 === this.equipDetail.type && (t = "暴击: ");
this.equipname.string = this.equipDetail.name;
this.equiptype.string = this.equipDetail.type;
this.property.string = t + this.equipDetail.property;
this.level.string = this.equipDetail.level;
this.belongs.string = this.equipDetail.belongs;
this.strongLevel.string = this.equipDetail.strongLevel;
this.desc.string = this.equipDetail.desc || "";
},
deleteEquipment: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/deleteEquipment", {
account: t.account,
id: cc.vv.currentEquipId
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
e.saveHistory("requipDetail");
cc.director.loadScene("equipList");
cc.vv.message.showMessage("丢弃装备成功", 1);
} else cc.vv.message.showMessage("丢弃装备失败", 1);
}, function() {
cc.vv.message.showMessage("丢弃装备失败", 1);
});
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
},
strongEquipment: function() {
console.log("强化装备");
},
goToEquipmentList: function() {
cc.director.loadScene("equipList");
}
});
cc._RF.pop();
}, {} ],
equipList: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "e3d10J9tRlCOKgTAQ//w6RJ", "equipList");
cc.Class({
extends: cc.Component,
properties: {
equipPrefab: cc.Prefab
},
onLoad: function() {
cc.find("back") && (cc.find("back").active = !0);
this.getEquipmentList();
},
getEquipmentList: function() {
var e = this, t = cc.vv.equipmentType, c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getEquipList", {
account: c.account,
equipmentType: t
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
var c = t.equipmentList;
e.node.height = 110 * c.length;
for (var s = 0; s < c.length; ++s) {
var o = cc.instantiate(e.equipPrefab), a = c[s];
e.node.addChild(o);
o.getComponent("EquipmentTemplate").init(a, function(t) {
if ("showdetail" === t.operate) {
cc.vv.currentEquipId = t.id;
e.saveHistory("equipList");
cc.director.loadScene("equipDetail");
}
"equip" === t.operate && e.equipUser(t.id);
"destory" === t.operate && e.destroyEquip(t.id);
});
}
} else cc.vv.message.showMessage("获取装备列表失败", 1);
}, function() {
cc.vv.message.showMessage("获取装备列表失败", 1);
});
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
},
destroyEquip: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/destoryEquip", {
account: t.account,
id: e
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.director.loadScene("equipList") : cc.vv.message.showMessage("分解失败", 1);
}, function() {
cc.vv.message.showMessage("分解失败", 1);
});
},
equipUser: function(e) {
var t = cc.vv.equipmentType, c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/equipUser", {
account: c.account,
equipmentType: t,
id: e
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.director.loadScene("equip") : cc.vv.message.showMessage("装备失败", 1);
}, function() {
cc.vv.message.showMessage("装备失败", 1);
});
},
goToEquipmentDetail: function() {
this.saveHistory("equipList");
cc.director.loadScene("equipDetail");
}
});
cc._RF.pop();
}, {} ],
equip: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "13211GT+lNBX6b7sGHOwvJp", "equip");
cc.Class({
extends: cc.Component,
properties: {
equipName1: cc.Label,
equipLevel1: cc.Label,
equipProperty1: cc.Label,
equipName2: cc.Label,
equipLevel2: cc.Label,
equipProperty2: cc.Label,
equipName3: cc.Label,
equipLevel3: cc.Label,
equipProperty3: cc.Label,
equipName4: cc.Label,
equipLevel4: cc.Label,
equipProperty4: cc.Label,
equipName5: cc.Label,
equipLevel5: cc.Label,
equipProperty5: cc.Label
},
onLoad: function() {
cc.find("back") && (cc.find("back").active = !0);
this.getMyEquipmentList();
},
getMyEquipmentList: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getMyEquipmentList", {
account: t.account
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
e.equipList = t.data || [];
e.showEquipment();
} else cc.vv.message.showMessage("获取装备失败", 1);
}, function() {
cc.vv.message.showMessage("获取装备失败", 1);
});
},
showEquipment: function() {
for (var e = 0; e < this.equipList.length; e++) {
if (2 === this.equipList[e].class) {
this["equipName" + this.equipList[e].type].node.color = cc.Color.GREEN;
this["equipLevel" + this.equipList[e].type].node.color = cc.Color.GREEN;
this["equipProperty" + this.equipList[e].type].node.color = cc.Color.GREEN;
}
if (3 === this.equipList[e].class) {
this["equipName" + this.equipList[e].type].node.color = cc.Color.BLUE;
this["equipLevel" + this.equipList[e].type].node.color = cc.Color.BLUE;
this["equipProperty" + this.equipList[e].type].node.color = cc.Color.BLUE;
}
if (4 === this.equipList[e].class) {
var t = new cc.Color(255, 0, 255, 1);
this["equipName" + this.equipList[e].type].node.color = t;
this["equipLevel" + this.equipList[e].type].node.color = t;
this["equipProperty" + this.equipList[e].type].node.color = t;
}
if (5 === this.equipList[e].class) {
this["equipName" + this.equipList[e].type].node.color = cc.Color.ORANGE;
this["equipLevel" + this.equipList[e].type].node.color = cc.Color.ORANGE;
this["equipProperty" + this.equipList[e].type].node.color = cc.Color.ORANGE;
}
if (6 === this.equipList[e].class) {
this["equipName" + this.equipList[e].type].node.color = cc.Color.RED;
this["equipLevel" + this.equipList[e].type].node.color = cc.Color.RED;
this["equipProperty" + this.equipList[e].type].node.color = cc.Color.RED;
}
var c = "";
1 === this.equipList[e].type && (c = "力量: ");
2 === this.equipList[e].type && (c = "根骨: ");
3 === this.equipList[e].type && (c = "体质: ");
4 === this.equipList[e].type && (c = "速度: ");
5 === this.equipList[e].type && (c = "暴击: ");
this["equipName" + this.equipList[e].type].string = this.equipList[e].name;
this["equipLevel" + this.equipList[e].type].string = "lv" + this.equipList[e].level;
this["equipProperty" + this.equipList[e].type].string = c + this.equipList[e].property;
}
},
goToEquipmentList: function(e, t) {
cc.vv.equipmentType = +t;
this.saveHistory("equip");
cc.director.loadScene("equipList");
},
saveHistory: function(e) {
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiSceneList")) || [];
t.push(e);
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify(t));
}
});
cc._RF.pop();
}, {} ],
getMoney: [ function(e, t, c) {
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
cc.find("back") && (cc.find("back").active = !0);
},
initPlugin: function() {
this.initIAP();
},
initIAP: function() {
if ("undefined" != typeof sdkbox) if ("undefined" != typeof sdkbox.IAP) {
var e = this;
sdkbox.IAP.setListener({
onSuccess: function(t) {
var c = 0;
if ("coin_package" === t.name) {
c = 60;
console.log("充值60钻石");
}
if ("coin_package2" === t.name) {
c = 300;
console.log("充值300钻石");
}
if ("coin_package3" === t.name) {
c = 1280;
console.log("充值1280钻石");
}
if ("coin_package4" === t.name) {
c = 3280;
console.log("充值3280钻石");
}
if ("coin_package5" === t.name) {
c = 6480;
console.log("充值6480钻石");
}
var s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendPostRequest("/sendMoneyToMe", {
account: s.account,
money: c
}).then(function(t) {
200 === (t = JSON.parse(t)).code ? cc.vv.message.showMessage("充值" + c + "钻石成功", 0) : cc.vv.message.showMessage("充值失败，请加群联系作者", 1);
e.mask.active = !1;
}, function() {
e.mask.active = !1;
});
},
onFailure: function(t, c) {
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
goTowar: [ function(e, t, c) {
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
cc.find("back") && (cc.find("back").active = !0);
},
addNewBattle: function(e, t) {
var c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), s = this;
if (t) {
if (cc.vv.userData.gemstone < 1e3) {
cc.vv.message.showMessage("钻石不足，请充值", 1);
return;
}
for (var o = 0, a = 0; a < this.battleWarList.length; a++) this.battleWarList[a].isbuiedmoney && o++;
if (o >= 5) {
cc.vv.message.showMessage("钻石战队已达到最大战队数量", 1);
return;
}
if (this.operateFlag) return;
this.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewBattleWar", {
account: c.account,
money: !0
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
s.reloadWar();
cc.vv.message.showMessage("开通战队成功", 0);
} else {
cc.vv.message.showMessage(e.message, 0);
s.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("开通失败", 0);
s.operateFlag = !1;
});
} else {
for (var n = 0, i = 0; i < this.battleWarList.length; i++) this.battleWarList[i].isbuiedmoney || n++;
if (n >= 5) {
cc.vv.message.showMessage("当前战队已达到最大战队数量", 1);
return;
}
if (parseInt(cc.vv.userData.level / 10) + 1 <= n) {
cc.vv.message.showMessage("当前战队已达到最大战队数量", 1);
return;
}
if (this.operateFlag) return;
this.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewBattleWar", {
account: c.account
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
s.reloadWar();
cc.vv.message.showMessage("开通战队成功", 0);
} else {
cc.vv.message.showMessage(e.message, 0);
s.operateFlag = !1;
}
}, function() {
s.reloadWar();
cc.vv.message.showMessage("开通战队失败", 1);
});
}
},
transBattle: function() {
for (var e = this, t = [], c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), s = 0; s < e.node.children.length; s++) e.node.children[s].getChildByName("New Toggle").getComponent(cc.Toggle).isChecked && e.node.children[s].getChildByName("New Toggle").getComponent(cc.Toggle).interactable && t.push(+e.node.children[s].id);
if (t.length <= 0) cc.vv.message.showMessage("请选择要派遣的战队", 1); else {
this.data = {
ids: t
};
t.length > 1 ? cc.vv.message.showMessage("仅可同时派遣一个战队", 1) : cc.vv.http.sendPostRequest("/createNewBattle", {
account: c.account,
ids: t
}).then(function(t) {
e.reloadWar();
}, function() {});
}
},
selectWarLevel: function() {
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), t = this;
this.selectWar.active = !1;
var c = this.data || {};
c.ids && c.ids.length > 0 && cc.vv.http.sendPostRequest("/createNewBattle", {
account: e.account,
ids: c.ids
}).then(function(e) {
t.reloadWar();
}, function() {});
},
updateGold: function() {
cc.vv.http.sendGetRequest("/getUserInfo", {
account: userInfo.account
}).then(function(e) {
var t = (e = JSON.parse(e)).data;
self.gemstone.string = t.gemstone;
self.gold.string = t.gold;
}, function() {
cc.vv.message.showMessage("获取失败", 1);
});
},
reloadWar: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.operateFlag = !1;
this.battleWarList = [];
cc.vv.http.sendGetRequest("/battleWarList", {
account: t.account
}).then(function(c) {
var s = (c = JSON.parse(c)).data;
e.battleWarList = s || [];
for (var o = e.node.children || [], a = 0; a < o.length; a++) o[a].destroy();
for (var n = 0; n < s.length; ++n) {
var i = cc.instantiate(e.itemPrefab), r = s[n];
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
}, function(c) {
if ("uplevel" === c.operate) if (c.data.level < 10) {
var s = 2e3 * c.data.level + 1e4 * Math.pow(2, c.data.class - 1);
if (cc.vv.resourcedata.tiekuang < s || cc.vv.resourcedata.liangshi < s || cc.vv.resourcedata.caoyao < s || cc.vv.resourcedata.woods < s) {
cc.vv.message.showMessage("升级战队需要各项资源" + s + ",资源不足", 1);
return;
}
cc.vv.http.sendPostRequest("/battleUplevel", {
account: t.account,
id: c.data.id,
resourceAmount: s
}).then(function(t) {
e.reloadWar();
});
} else cc.vv.message.showMessage("战队等级已达满级，请升阶战队", 1);
if ("upclass" === c.operate) {
if (c.data.level < 10) {
cc.vv.message.showMessage("升阶需要等级升到10级满级", 1);
return;
}
if (+c.data.class >= 8) {
cc.vv.message.showMessage("您已升到满阶", 1);
return;
}
var o = 0;
c.data.class >= 3 && (o = 1e3);
if (cc.vv.userData.gemstone < o) {
cc.vv.message.showMessage("升阶需要钻石" + o + "，请充值", 1);
return;
}
cc.vv.http.sendPostRequest("/updateGemstone", {
account: t.account,
gemstone: +cc.vv.userData.gemstone - o
}).then(function(s) {
cc.vv.userData.gemstone = +cc.vv.userData.gemstone - o;
cc.vv.http.sendPostRequest("/battleUpClass", {
account: t.account,
id: c.data.id
}).then(function(t) {
e.reloadWar();
});
});
}
if ("getresource" === c.operate) {
if (!c.data.isBusy) {
cc.vv.message.showMessage("您无需收货", 1);
return;
}
if (e.submitFlag) return;
e.submitFlag = !0;
cc.vv.http.sendPostRequest("/finishBattle", {
account: t.account,
id: c.data.id
}).then(function(t) {
t = JSON.parse(t);
e.submitFlag = !1;
if (200 === t.code) {
e.reloadWar();
cc.vv.message.showMessage("您获取" + t.data + "个钻石", 0);
} else cc.vv.message.showMessage("您无需收货", 1);
}, function() {
e.submitFlag = !1;
});
}
});
}
}, function() {});
}
});
cc._RF.pop();
}, {} ],
hodate: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "7a24ckCdXdMgJMFcuppytcy", "hodate");
function s() {
cc.vv = {};
cc.vv.http = e("HTTP");
cc.vv.message = e("messageTip");
cc.vv.resourcedata = {};
cc.vv.userInfo = {};
}
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
_candate: !1
},
dateCb: function(e) {
var t = !1, c = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
c = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
e.getMessage();
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
c = !0;
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.goToNewScene();
c = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
t = !0;
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this._updating = !1;
this._canRetry = !0;
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
case jsb.EventAssetsManager.ERROR_DECOMPRESS:
}
if (c) {
this._am.setEventCallback(null);
this._updating = !1;
}
if (t) {
this._am.setEventCallback(null);
var s = jsb.fileUtils.getSearchPaths(), o = this._am.getLocalManifest().getSearchPaths();
Array.prototype.unshift(s, o);
cc.sys.localStorage.setItem("HodateSearchPaths", JSON.stringify(s));
jsb.fileUtils.setSearchPaths(s);
cc.audioEngine.stopAll();
cc.game.restart();
}
},
checkCb: function(e) {
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
this.goToNewScene();
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this.label.string = "loading...";
this._candate = !0;
this.label.string = "loading";
break;

default:
return;
}
this._am.setEventCallback(null);
this._updating = !1;
this.hodate();
},
goToNewScene: function() {
cc.director.loadScene("loading");
},
hodate: function() {
if (this._am && !this._updating) {
this._am.setEventCallback(this.dateCb.bind(this));
this._am.loadLocalManifest(this.manifestUrl);
this._failCount = 0;
this._am.update();
this._updating = !0;
}
},
loadingdate: function() {
if (cc.sys.isNative) {
this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "remote-asset";
this.vCompare = function(e, t) {
for (var c = e.split("."), s = t.split("."), o = 0; o < c.length; ++o) {
var a = parseInt(c[o]), n = parseInt(s[o] || 0);
if (a !== n) return a - n;
}
return s.length > c.length ? -1 : 0;
};
this._am = new jsb.AssetsManager("", this._storagePath, this.vCompare);
cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2);
this._am.loadLocalManifest(this.manifestUrl);
this.checkdate();
}
},
onLoad: function() {
var e = this;
s();
cc.vv.http.sendGetRequest("/checkServerValid").then(function(t) {
(t = JSON.parse(t)).valid ? e.loadingdate() : e.goToNewScene();
}, function() {
e.goToNewScene();
});
},
checkdate: function() {
this._am.setEventCallback(this.checkCb.bind(this));
this._failCount = 0;
this._am.checkUpdate();
this._updating = !0;
}
});
cc._RF.pop();
}, {
HTTP: "HTTP",
messageTip: "messageTip"
} ],
initParams: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "33e13IqnthBiqGa/2zeKuhs", "initParams");
function s() {
cc.aa = 1;
cc.resourcedata = {};
}
cc.Class({
extends: cc.Component,
onLoad: function() {
s();
}
});
cc._RF.pop();
}, {} ],
loading: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "4f482VpCMdOHbs6hhk6VvxG", "loading");
cc.Class({
extends: cc.Component,
properties: {
connectTip: {
type: cc.Label,
default: null
}
},
onLoad: function() {
cc.vv.tipsNum = 0;
var e = this, t = function(t) {
e.connectTip.string = "链接成功";
cc.vv.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.director.loadScene("notice");
}, c = function() {
e.connectTip.string = "链接失败，5s后重试";
setTimeout(s, 3e3);
}, s = function() {
cc.vv.http.sendGetRequest("/connectServer").then(function(e) {
e = JSON.parse(e);
t(e.version);
}, function() {
c();
});
};
s();
}
});
cc._RF.pop();
}, {} ],
loginGame: [ function(e, t, c) {
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
var e = this, t = this.accountTextInfo.string, c = this.passwordTextInfo.string;
t && c && cc.vv.http.sendGetRequest("/loginGame", {
account: t,
password: c,
newFlag: 111,
version: "1.5"
}).then(function(s) {
if (200 === (s = JSON.parse(s)).code) {
cc.vv.userInfo = {
account: t,
password: c,
isLogin: !0
};
cc.sys.localStorage.setItem("jakiiAccountInfo", JSON.stringify(cc.vv.userInfo));
cc.sys.localStorage.setItem("jakiiToken", s.md5Value);
s.data ? cc.director.loadScene("welcome") : cc.director.loadScene("city");
} else {
e.errorMessage.string = s.message;
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
if (cc.find("back")) {
cc.find("back").active = !1;
cc.sys.localStorage.setItem("jakiiSceneList", JSON.stringify([]));
}
}
});
cc._RF.pop();
}, {} ],
market: [ function(e, t, c) {
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
onLoad: function() {
cc.find("back") && (cc.find("back").active = !0);
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
var c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), s = this;
if (!s.operateFlag) {
s.operateFlag = !0;
cc.vv.http.sendPostRequest("/buyThingsByCoins", {
type: t,
account: c.account
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.vv.message.showMessage("购买成功", 0) : cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("购买成功", 1);
s.operateFlag = !1;
});
}
},
buyThingsByMoney: function(e, t) {
var c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), s = this;
if (!s.operateFlag) {
s.operateFlag = !0;
cc.vv.http.sendPostRequest("/buyThingsByMoney", {
type: t,
account: c.account
}).then(function(e) {
200 === (e = JSON.parse(e)).code ? cc.vv.message.showMessage("购买成功", 0) : cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("购买成功", 1);
s.operateFlag = !1;
});
}
}
});
cc._RF.pop();
}, {} ],
messageTip: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "29dd6XAzbRBN6ZDAMfHAnmw", "messageTip");
cc.Class({
extends: cc.Component,
statics: {
showMessage: function(e, t) {
var c = cc.find("Canvas"), s = new cc.Node();
t && (s.color = cc.Color.RED);
s.addComponent(cc.Label);
var o = s.getComponent(cc.Label);
o.fontSize = 40;
o.string = e;
c.addChild(s, 1e3);
var a = function e() {
if (s.children) {
s.y = (s.y || 0) + 10;
s.opacity -= 5;
s.opacity <= 0 && o.unschedule(e);
}
};
setTimeout(function() {
o.schedule(a, .1);
}, 1e3);
}
}
});
cc._RF.pop();
}, {} ],
notice: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "bcecc3ocGNCa7817lb6YXJq", "notice");
cc.Class({
extends: cc.Component,
properties: {
notice: {
default: null,
type: cc.Label
},
loginButton: {
default: null,
type: cc.Button
}
},
onLoad: function() {
this.getNotice();
},
getNotice: function() {
var e = this;
cc.vv.http.sendGetRequest("/getGameNotice").then(function(t) {
t = JSON.parse(t);
e.notice.string = t.data;
console.log(t.data, "======");
}, function() {
e.goToLogin();
});
},
goToLogin: function() {
cc.director.loadScene("login");
}
});
cc._RF.pop();
}, {} ],
progress: [ function(e, t, c) {
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
rank: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "f22bfnv8SpOAozGoRrILfRq", "rank");
cc.Class({
extends: cc.Component,
properties: {
userItemPrefab: cc.Prefab
},
onLoad: function() {
cc.vv.tipsNum = 0;
cc.find("back") && (cc.find("back").active = !0);
this.getRankList();
},
getRankList: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getUserList", {
account: t.account
}).then(function(t) {
var c = (t = JSON.parse(t)).data || [];
e.userList = c;
for (var s = 0; s < c.length; ++s) {
var o = cc.instantiate(e.userItemPrefab), a = c[s];
a.sort = s + 1;
e.node.addChild(o);
o.getComponent("ItemRankTemplate").init(a);
}
}, function() {});
}
});
cc._RF.pop();
}, {} ],
resource: [ function(e, t, c) {
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
cc.find("back") && (cc.find("back").active = !0);
},
getResourceInfo: function() {
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
cc.vv.http.sendGetRequest("/getResourceInfo", {
account: t.account
}).then(function(t) {
if (200 === (t = JSON.parse(t)).code) {
var c = t.data || [];
e.resourceList = c;
for (var s = 0; s < c.length; s++) {
var o = 0;
o = +c[s].level <= 30 ? parseInt(Math.pow(1.5, +c[s].level - 1)) : +c[s].level <= 50 ? 3e5 : 5e5;
if ("农田" === c[s].name) {
e.content.children[0].children[3].getComponent("cc.Label").string = +c[s].level;
e.content.children[0].children[6].getComponent("cc.Label").string = 10 * o;
}
if ("铁矿" === c[s].name) {
e.content.children[1].children[3].getComponent("cc.Label").string = +c[s].level;
e.content.children[1].children[6].getComponent("cc.Label").string = 10 * o;
}
if ("草药" === c[s].name) {
e.content.children[2].children[3].getComponent("cc.Label").string = +c[s].level;
e.content.children[2].children[6].getComponent("cc.Label").string = 10 * o;
}
if ("木材" === c[s].name) {
e.content.children[3].children[3].getComponent("cc.Label").string = +c[s].level;
e.content.children[3].children[6].getComponent("cc.Label").string = 10 * o;
}
}
}
}, function() {});
},
upResourceLevel: function(e, t) {
var c = this;
if (!c.operateFlag) {
var s = 0, o = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
"liangshi" === t && c.resourceList.forEach(function(e) {
"农田" === e.name && (s = e.id);
});
"tiekuang" === t && c.resourceList.forEach(function(e) {
"铁矿" === e.name && (s = e.id);
});
"woods" === t && c.resourceList.forEach(function(e) {
"木材" === e.name && (s = e.id);
});
"caoyao" === t && c.resourceList.forEach(function(e) {
"草药" === e.name && (s = e.id);
});
cc.vv.http.sendPostRequest("/upResourceLevel", {
account: o.account,
id: s,
type: t
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("升级成功", 0);
c.getResourceInfo();
} else cc.vv.message.showMessage(e.message, 1);
c.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("升级失败", 1);
c.operateFlag = !1;
});
}
}
});
cc._RF.pop();
}, {} ],
settings: [ function(e, t, c) {
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
cc.find("back") && (cc.find("back").active = !0);
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
trade: [ function(e, t, c) {
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
cc.find("back") && (cc.find("back").active = !0);
},
addNewTransport: function(e, t) {
var c = this, s = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
console.log("11111111", cc.vv.userData);
if (t) {
if (cc.vv.userData.gemstone < 1e3) {
cc.vv.message.showMessage("钻石不足，请充值", 1);
return;
}
for (var o = 0, a = 0; a < this.transportList.length; a++) this.transportList[a].isbuiedmoney && o++;
if (o >= 5) {
cc.vv.message.showMessage("钻石商队已达到最大商队数量", 1);
return;
}
if (this.operateFlag) return;
this.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewTransport", {
account: s.account,
money: !0
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("开通成功", 0);
c.reloadTransport();
} else {
cc.vv.message.showMessage(e.message, 1);
this.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("开通失败", 1);
this.operateFlag = !1;
});
} else {
for (var n = 0, i = 0; i < this.transportList.length; i++) this.transportList[i].isbuiedmoney || n++;
if (n >= 5) {
cc.vv.message.showMessage("当前商队已达到最大商队数量", 1);
return;
}
if (parseInt(cc.vv.userData.level / 10) + 1 <= n) {
cc.vv.message.showMessage("当前商队已达到最大商队数量", 1);
return;
}
if (this.operateFlag) return;
c.operateFlag = !0;
cc.vv.http.sendPostRequest("/addNewTransport", {
account: s.account
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("开通成功", 0);
c.reloadTransport();
} else {
cc.vv.message.showMessage(e.message, 1);
c.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("开通失败", 1);
c.operateFlag = !1;
});
}
},
transport: function() {
for (var e = [], t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), c = 0; c < this.node.children.length; c++) this.node.children[c].getChildByName("New Toggle").getComponent(cc.Toggle).isChecked && this.node.children[c].getChildByName("New Toggle").getComponent(cc.Toggle).interactable && e.push(+this.node.children[c].id);
if (e.length <= 0) cc.vv.message.showMessage("请选择要派遣的商队", 1); else {
var s = {
ids: e
};
if (e.length > 1) cc.vv.message.showMessage("一次只能派遣一个商队", 1); else {
cc.sys.localStorage.setItem(t.account + "transportInfo", JSON.stringify(s));
cc.vv.http.sendPostRequest("/createNewBusiness", {
account: t.account,
ids: s.ids
}).then(function(e) {
cc.director.loadScene("trade");
}, function() {});
}
}
},
reloadTransport: function() {
this.operateFlag = !1;
var e = this, t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
e.submitFlag = !1;
this.transportList = [];
cc.vv.http.sendGetRequest("/getTransportList", {
account: t.account
}).then(function(c) {
for (var s = (c = JSON.parse(c)).data, o = e.node.children || [], a = 0; a < o.length; a++) o[a].destroy();
e.transportList = s || [];
for (var n = 0; n < s.length; ++n) {
var i = cc.instantiate(e.itemPrefab), r = s[n];
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
tradeclass: r.classStr,
tradelevel: "lv" + r.level,
isBusy: r.isbusy,
starttime: +r.starttime,
totaltime: +r.totaltime,
class: +r.class,
level: +r.level,
baseweight: r.baseweight
}, function(c) {
if ("uplevel" === c.operate) if (c.data.level < 20) {
var s = 1e3 * c.data.level + 5e3 * Math.pow(2, c.data.class - 1);
if (cc.vv.resourcedata.tiekuang < s || cc.vv.resourcedata.liangshi < s || cc.vv.resourcedata.caoyao < s || cc.vv.resourcedata.woods < s) {
cc.vv.message.showMessage("升级商队需要各项资源" + s + ",资源不足", 1);
return;
}
cc.vv.http.sendPostRequest("/transportUplevel", {
account: t.account,
id: c.data.id,
resourceAmount: s
}).then(function(e) {
cc.director.loadScene("trade");
}, function() {});
} else cc.vv.message.showMessage("商队等级已达满级，请升阶商队", 1);
if ("upclass" === c.operate) {
if (c.data.level < 20) {
cc.vv.message.showMessage("升阶需要等级升到20满级", 1);
return;
}
if (+c.data.class >= 8) {
cc.vv.message.showMessage("您已升到满阶", 1);
return;
}
var o = 0;
c.data.class >= 3 && (o = 500);
if (cc.vv.userData.gemstone < o) {
cc.vv.message.showMessage("升阶需要钻石" + o + "，请充值", 1);
return;
}
cc.vv.http.sendPostRequest("/updateGemstone", {
account: t.account,
gemstone: +cc.vv.userData.gemstone - o
}).then(function(e) {
cc.vv.userData.gemstone = +cc.vv.userData.gemstone - o;
cc.vv.http.sendPostRequest("/transportUpclass", {
account: t.account,
id: c.data.id
}).then(function(e) {
cc.director.loadScene("trade");
});
});
}
if ("getresource" === c.operate) {
if (!c.data.isBusy) {
cc.vv.message.showMessage("您无需收货", 1);
return;
}
if (e.submitFlag) return;
e.submitFlag = !0;
cc.vv.http.sendPostRequest("/finishBusiness", {
account: t.account,
id: c.data.id
}).then(function(t) {
t = JSON.parse(t);
e.submitFlag = !1;
if (200 === t.code) {
e.reloadTransport();
cc.vv.message.showMessage("您获取" + t.data + "个金币", 0);
} else cc.vv.message.showMessage("您无需收货", 1);
}, function() {
e.submitFlag = !1;
});
}
});
}
}, function() {});
}
});
cc._RF.pop();
}, {} ],
userbattle: [ function(e, t, c) {
"use strict";
cc._RF.push(t, "a198bDO07pAcYTBo1+6xh4l", "userbattle");
cc.Class({
extends: cc.Component,
properties: {
BarSelfBlood1: {
type: cc.Node,
default: null
},
BarSelfSpeed1: {
type: cc.Node,
default: null
},
BarSelfBlood2: {
type: cc.Node,
default: null
},
BarSelfSpeed2: {
type: cc.Node,
default: null
},
BarSelfBlood3: {
type: cc.Node,
default: null
},
BarSelfSpeed3: {
type: cc.Node,
default: null
},
selfName1: cc.Label,
selfName2: cc.Label,
selfName3: cc.Label,
otherName: cc.Label,
BarOtherBlood: {
type: cc.Node,
default: null
},
BarOtherSpeed: {
type: cc.Node,
default: null
},
battleObjBottom1: {
type: cc.Node,
default: null
},
battleObjBottom2: {
type: cc.Node,
default: null
},
battleObjBottom3: {
type: cc.Node,
default: null
}
},
onLoad: function() {
cc.find("back") && (cc.find("back").active = !0);
this.myTeamList = cc.vv.myTeamList || [];
this.attackUser = cc.vv.attackUser || {};
for (var e = 0; e < this.myTeamList.length; e++) {
this["battleObjBottom" + (e + 1)].active = !0;
this["selfName" + (e + 1)].string = this.myTeamList[e].name;
}
this.otherName.string = this.attackUser.name;
var t = this.myTeamList;
this.barSelfBlood1 = this.BarSelfBlood1.getComponent(cc.ProgressBar);
this.barSelfSpeed1 = this.BarSelfSpeed1.getComponent(cc.ProgressBar);
this.barSelfBlood2 = this.BarSelfBlood2.getComponent(cc.ProgressBar);
this.barSelfSpeed2 = this.BarSelfSpeed2.getComponent(cc.ProgressBar);
this.barSelfBlood3 = this.BarSelfBlood3.getComponent(cc.ProgressBar);
this.barSelfSpeed3 = this.BarSelfSpeed3.getComponent(cc.ProgressBar);
for (var c = 0; c < t.length; c++) {
this["totalBloodCount" + (c + 1)] = t[c].totalBloodCount;
this["currentBloodCount" + (c + 1)] = t[c].currentBloodCount;
this["totalSpeedCount" + (c + 1)] = t[c].totalSpeedCount;
this["currentSpeedCount" + (c + 1)] = t[c].currentSpeedCount;
}
this.barOtherBlood = this.BarOtherBlood.getComponent(cc.ProgressBar);
this.barOtherSpeed = this.BarOtherSpeed.getComponent(cc.ProgressBar);
this.otherBloodTotalCount = this.attackUser.totalBloodCount;
this.otherBloodCurrentCount = this.attackUser.currentBloodCount;
this.otherSpeedTotalCount = this.attackUser.totalSpeedCount;
this.otherSpeedCurrentCount = this.attackUser.currentSpeedCount;
},
update: function(e) {
for (var t = 0; t < this.myTeamList.length; t++) if (this["currentBloodCount" + (t + 1)] > 0 && !this.forbidOtherSpeedFlag) {
this["currentSpeedCount" + (t + 1)] = +this["currentSpeedCount" + (t + 1)] - e;
this["barSelfSpeed" + (t + 1)].progress = this["currentSpeedCount" + (t + 1)] / this["totalSpeedCount" + (t + 1)];
if (this["currentSpeedCount" + (t + 1)] <= 0) {
this["currentSpeedCount" + (t + 1)] = this["totalSpeedCount" + (t + 1)];
if (this.otherBloodCurrentCount > 0) this.otherBloodCurrentCount = this.otherBloodCurrentCount - this.myTeamList[t].attack; else {
this.forbidOtherSpeedFlag = !0;
cc.vv.userBattleType = 1;
cc.director.loadScene("activity");
}
}
}
this.forbidOtherSpeedFlag || (this.otherSpeedCurrentCount = this.otherSpeedCurrentCount - e);
if (this.otherSpeedCurrentCount <= 0) {
this.otherSpeedCurrentCount = 1;
if (this.currentBloodCount1 > 0) {
this.currentBloodCount1 = this.currentBloodCount1 - this.attackUser.attack;
this.barSelfBlood1.progress = this.currentBloodCount1 / this.totalBloodCount1;
} else if (this.currentBloodCount2 > 0) {
this.currentSpeedCount1 = 0;
this.barSelfSpeed1.progress = -1;
this.currentBloodCount2 = this.currentBloodCount2 - this.attackUser.attack;
this.barSelfBlood2.progress = this.currentBloodCount2 / this.totalBloodCount2;
} else if (this.currentBloodCount3 > 0) {
this.currentBloodCount3 = this.currentBloodCount3 - this.attackUser.attack;
this.barSelfBlood3.progress = this.currentBloodCount3 / this.totalBloodCount3;
} else cc.director.loadScene("activity");
}
this.barOtherBlood.progress = this.otherBloodCurrentCount / this.otherBloodTotalCount;
this.barOtherSpeed.progress = this.otherSpeedCurrentCount / this.otherSpeedTotalCount;
}
});
cc._RF.pop();
}, {} ],
viewSelf: [ function(e, t, c) {
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
var c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.reloadPage(c);
},
onLoad: function() {
cc.find("back") && (cc.find("back").active = !0);
cc.vv.tipsNum = 0;
var e = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
this.operateFlag = !1;
this.getPropertyUserInfo();
this.reloadPage(e);
this.myLevel.string = this.dealLevel(cc.vv.userData.level);
},
upLevel: function(e, t) {
var c = this, s = +t, o = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (!c.operateFlag) {
c.operateFlag = !0;
cc.vv.http.sendPostRequest("/upLevelEquipment", {
account: o.account,
type: s
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
cc.vv.message.showMessage("升级成功", 0);
c.reloadPage(o);
} else cc.vv.message.showMessage(e.message, 1);
c.operateFlag = !1;
}, function() {
cc.vv.message.showMessage("升级失败", 1);
c.operateFlag = !1;
});
}
},
upClass: function(e, t) {
var c = this, s = +t, o = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (!c.operateFlag) {
c.operateFlag = !0;
cc.vv.http.sendPostRequest("/upClassEquipment", {
account: o.account,
type: s
}).then(function(e) {
c.operateFlag = !1;
if (200 !== (e = JSON.parse(e)).code) {
cc.vv.message.showMessage(e.message, 1);
c.operateFlag = !1;
} else {
cc.vv.message.showMessage("升阶成功", 0);
c.reloadPage(o);
c.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("升阶失败", 1);
c.operateFlag = !1;
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
for (var c = (e = JSON.parse(e)).data || [], s = 0; s < c.length; s++) {
var o = {
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
switch (c[s].type) {
case 1:
t[0].getChildren()[1].getComponent("cc.Label").string = (o[c[s].class] || "至尊") + " - 剑";
t[0].getChildren()[2].getComponent("cc.Label").string = "(+" + c[s].level + ")";
t[0].getChildren()[4].getComponent("cc.Label").string = +c[s].strength + +c[s].level + 10 * +c[s].class;
break;

case 2:
t[1].getChildren()[1].getComponent("cc.Label").string = (o[c[s].class] || "至尊") + " - 衣";
t[1].getChildren()[2].getComponent("cc.Label").string = "(+" + c[s].level + ")";
t[1].getChildren()[4].getComponent("cc.Label").string = +c[s].gengu + +c[s].level + 10 * +c[s].class;
break;

case 3:
t[2].getChildren()[1].getComponent("cc.Label").string = (o[c[s].class] || "至尊") + " - 盔";
t[2].getChildren()[2].getComponent("cc.Label").string = "(+" + c[s].level + ")";
t[2].getChildren()[4].getComponent("cc.Label").string = +c[s].tizhi + +c[s].level + 10 * +c[s].class;
break;

case 4:
t[3].getChildren()[1].getComponent("cc.Label").string = (o[c[s].class] || "至尊") + " - 鞋";
t[3].getChildren()[2].getComponent("cc.Label").string = "(+" + c[s].level + ")";
t[3].getChildren()[4].getComponent("cc.Label").string = +c[s].speed + +c[s].level + 10 * +c[s].class;
break;

case 5:
t[4].getChildren()[1].getComponent("cc.Label").string = (o[c[s].class] || "至尊") + " - 戒";
t[4].getChildren()[2].getComponent("cc.Label").string = "(+" + c[s].level + ")";
t[4].getChildren()[4].getComponent("cc.Label").string = +c[s].baoji + +c[s].level + 10 * +c[s].class;
}
}
}, function() {
cc.vv.message.showMessage("查询法宝失败", 1);
});
}
if (this.property.active) {
var c = this.property.getChildren();
cc.vv.http.sendGetRequest("/getUserPropertyInfo", {
account: e.account
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
c[0].getChildren()[0].getComponent("cc.Label").string = 5 * e.data.strength;
c[1].getChildren()[0].getComponent("cc.Label").string = 5 * e.data.gengu;
c[2].getChildren()[0].getComponent("cc.Label").string = 10 * e.data.tizhi;
c[3].getChildren()[0].getComponent("cc.Label").string = 2 * e.data.speed;
c[4].getChildren()[0].getComponent("cc.Label").string = 2 * e.data.baoji;
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
var c = 5 * e.data.strength + 5 * e.data.gengu + 10 * e.data.tizhi + 2 * e.data.speed + 2 * e.data.baoji + 5 * (e.data.battle || 0);
console.log(e.data.battle, "res.data.battle");
t.myBattle.string = "战力: " + c;
} else cc.vv.message.showMessage("查询属性失败", 1);
}, function() {
cc.vv.message.showMessage("查询属性失败", 1);
});
},
createThings: function(e, t) {
var c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo")), s = this;
if (!s.operateFlag) {
s.operateFlag = !0;
cc.vv.http.sendPostRequest("/createLianqifang", {
account: c.account,
type: +t
}).then(function(e) {
if (200 === (e = JSON.parse(e)).code) {
s.operateFlag = !1;
cc.vv.message.showMessage(e.message, 0);
s.reloadPage(c);
} else {
cc.vv.message.showMessage(e.message, 1);
s.operateFlag = !1;
}
}, function() {
cc.vv.message.showMessage("合成失败", 1);
s.operateFlag = !1;
});
}
}
});
cc._RF.pop();
}, {} ],
welcome: [ function(e, t, c) {
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
wujinshilian: [ function(e, t, c) {
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
var e = this;
cc.find("back") && (cc.find("back").active = !0);
var t = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
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
var t = this, c = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
if (this.selfSpeedCurrentCount <= 0) {
if (t.finishFlag) return;
t.finishFlag = !0;
cc.vv.http.sendPostRequest("/finishWujinshilian", {
gold: 100 * t.secondTimes,
strongstoneclip: 5 * t.secondTimes,
account: c.account
}).then(function(e) {
e = JSON.parse(e);
var c = "获得" + 100 * t.secondTimes + "个金币," + 5 * t.secondTimes + "个强化石碎片";
cc.vv.message.showMessage(c, 0);
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
}, {}, [ "activity", "back", "bag", "battle", "battleLevelSelect", "bottom2", "city", "cityBottom", "equip", "equipBag", "equipDetail", "equipList", "getMoney", "goTowar", "market", "rank", "resource", "settings", "trade", "userbattle", "viewSelf", "wujinshilian", "EquipmentTemplate", "ItemRankTemplate", "ItemTemplate", "messageTip", "hodate", "initParams", "loading", "progress", "loginGame", "notice", "welcome", "HTTP" ]);
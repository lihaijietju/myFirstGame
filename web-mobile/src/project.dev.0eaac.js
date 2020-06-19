window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  EquipmentTemplate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "22de8G3RA5NWpMPu9StfRfu", "EquipmentTemplate");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        id: 0,
        equipName: cc.Label,
        equipLevel: cc.Label,
        equipClass: 0,
        equipProperty: cc.Label,
        equipUser: cc.Button,
        showdetail: cc.Button
      },
      init: function init(data, callback) {
        if (1 === data.class) {
          this.equipName.node.color = cc.Color.WHITE;
          this.equipLevel.node.color = cc.Color.WHITE;
          this.equipProperty.node.color = cc.Color.WHITE;
        }
        if (2 === data.class) {
          this.equipName.node.color = cc.Color.GREEN;
          this.equipLevel.node.color = cc.Color.GREEN;
          this.equipProperty.node.color = cc.Color.GREEN;
        }
        if (3 === data.class) {
          this.equipName.node.color = cc.Color.BLUE;
          this.equipLevel.node.color = cc.Color.BLUE;
          this.equipProperty.node.color = cc.Color.BLUE;
        }
        if (4 === data.class) {
          var ZISE = new cc.Color(255, 0, 255, 1);
          this.equipName.node.color = ZISE;
          this.equipLevel.node.color = ZISE;
          this.equipProperty.node.color = ZISE;
        }
        if (5 === data.class) {
          this.equipName.node.color = cc.Color.ORANGE;
          this.equipLevel.node.color = cc.Color.ORANGE;
          this.equipProperty.node.color = cc.Color.ORANGE;
        }
        if (6 === data.class) {
          this.equipName.node.color = cc.Color.RED;
          this.equipLevel.node.color = cc.Color.RED;
          this.equipProperty.node.color = cc.Color.RED;
        }
        var equipPropertyStr = "";
        1 === data.type && (equipPropertyStr = "\u529b\u91cf: ");
        2 === data.type && (equipPropertyStr = "\u6839\u9aa8: ");
        3 === data.type && (equipPropertyStr = "\u4f53\u8d28: ");
        4 === data.type && (equipPropertyStr = "\u901f\u5ea6: ");
        5 === data.type && (equipPropertyStr = "\u66b4\u51fb: ");
        this.equipName.string = data.name;
        this.equipLevel.string = "lv" + data.level;
        this.equipProperty.string = equipPropertyStr + data.property;
        this.equipUser.node.on("click", function() {
          var params = {
            operate: "equip",
            id: data.id
          };
          callback(params);
        }, this);
        this.showdetail.node.on("click", function() {
          var params = {
            operate: "showdetail",
            id: data.id
          };
          callback(params);
        }, this);
      }
    });
    cc._RF.pop();
  }, {} ],
  HTTP: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b17edoXxMhIwYsFlds/g45k", "HTTP");
    "use strict";
    var URL = "http://111.229.148.51:1234";
    var HTTP = cc.Class({
      extends: cc.Component,
      statics: {
        sessionId: 0,
        userId: 0,
        master_url: URL,
        url: URL,
        sendGetRequest: function sendGetRequest(url, reqData) {
          var self = this;
          url += "?";
          for (var item in reqData) url += item + "=" + reqData[item] + "&";
          url = url.substring(0, url.length - 1);
          return new Promise(function(resolve, reject) {
            var xhr = cc.loader.getXMLHttpRequest();
            var url_temp = URL + url;
            xhr.open("GET", url_temp, true);
            xhr.onreadystatechange = function() {
              if (4 === xhr.readyState && xhr.status >= 200 && xhr.status < 300) {
                var respone = xhr.responseText;
                resolve(respone);
              } else 200 !== xhr.status && reject("===error===");
            };
            xhr.setRequestHeader("Token", cc.sys.localStorage.getItem("jakiiToken"));
            xhr.timeout = 5e3;
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send();
          });
        },
        sendPostRequest: function sendPostRequest(url, reqData) {
          var self = this;
          var param = "";
          for (var item in reqData) param += item + "=" + reqData[item] + "&";
          param = param.substring(0, param.length - 1);
          return new Promise(function(resolve, reject) {
            var xhr = cc.loader.getXMLHttpRequest();
            var url_temp = URL + url;
            xhr.open("POST", url_temp, true);
            xhr.onreadystatechange = function() {
              if (4 === xhr.readyState && 200 === xhr.status) {
                var respone = xhr.responseText;
                resolve(respone);
              } else 200 !== xhr.status && reject("===error===");
            };
            xhr.setRequestHeader("Token", cc.sys.localStorage.getItem("jakiiToken"));
            xhr.timeout = 5e3;
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(param);
          });
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ItemRankTemplate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f2ef98KCd9Il5YRR1loHYd8", "ItemRankTemplate");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        account: cc.Label,
        rank: cc.Label,
        username: cc.Label,
        battle: cc.Label
      },
      init: function init(data, callback) {
        this.rank.string = data.sort;
        this.username.string = data.username;
        this.battle.string = data.battle;
        if (data.sort <= 3) {
          this.rank.node.color = cc.Color.YELLOW;
          this.username.node.color = cc.Color.YELLOW;
          this.battle.node.color = cc.Color.YELLOW;
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  ItemTemplate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1760429tGVI+oH2SlhHorqT", "ItemTemplate");
    "use strict";
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
      init: function init(data, callback) {
        this.data = data;
        this.id = data.id;
        this.tradename.string = data.tradename;
        this.weight.string = data.weight;
        this.tradeclass.string = data.tradeclass;
        this.tradelevel.string = data.tradelevel;
        this.flag = false;
        this.selectBox.isChecked = false;
        if (data.isBusy) {
          this.selectBox.interactable = false;
          this.selectBox.isChecked = true;
          this.selectBox.enableAutoGrayEffect = true;
        }
        data.starttime > 0 && data.totaltime > 0 ? this.time.string = data.totaltime - parseInt((+new Date() - data.starttime) / 1e3) : this.time.string = "";
        this.uplevel.node.on("click", function() {
          var params = {
            operate: "uplevel",
            data: data
          };
          callback(params);
        }, this);
        this.upclass.node.on("click", function() {
          var params = {
            operate: "upclass",
            data: data
          };
          callback(params);
        }, this);
      },
      update: function update(dt) {
        if (this.data.totaltime > 0 && this.data.starttime > 0) {
          var resttime = this.data.totaltime - parseInt((+new Date() - this.data.starttime) / 1e3);
          resttime > 0 && (this.time.string = parseInt(resttime / 60) + ":" + resttime % 60);
          if (0 === resttime && !this.flag) {
            this.flag = true;
            var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
            "trade" === cc.director.getScene().name && cc.vv.http.sendPostRequest("/finishBusiness", {
              account: userInfo.account,
              id: this.data.id,
              gold: 10 * +this.data.class + +this.data.level + 10
            }).then(function(res) {
              cc.director.loadScene("city");
            });
            if ("gotoWar" === cc.director.getScene().name) {
              var weight = parseInt(Math.pow(1.05, +this.data.level - 1) * (this.data.basebattle + 500 * (+this.data.class - 1)));
              cc.vv.http.sendPostRequest("/finishBattle", {
                account: userInfo.account,
                id: this.data.id,
                money: this.data.class
              }).then(function(res) {
                cc.director.loadScene("city");
              });
            }
          }
          resttime < 0 && (this.time.string = "");
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  activity: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "30b97Fj9fRDm4emedHbaC9S", "activity");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {
        this.getBattlereward();
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendGetRequest("/getUserInfoDetail", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          200 === res.code ? self.userInfoDetail = res.data || {} : cc.vv.message.showMessage(res.message, 1);
        }, function() {
          cc.vv.message.showMessage("\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u5931\u8d25", 1);
        });
      },
      getBattlereward: function getBattlereward() {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        if (1 === cc.vv.userBattleType) {
          cc.vv.userBattleType = 0;
          var equipObj = {};
          var randomNum1 = this.randomNum(0, 100);
          if (0 < randomNum1 && randomNum1 <= 5) {
            var randomNum2 = this.randomNum(1, 5);
            equipObj.type = randomNum2;
            1 === equipObj.type && (equipObj.name = "\u94c1\u5251");
            2 === equipObj.type && (equipObj.name = "\u94c1\u7532");
            3 === equipObj.type && (equipObj.name = "\u94c1\u5e3d");
            4 === equipObj.type && (equipObj.name = "\u94c1\u9774");
            5 === equipObj.type && (equipObj.name = "\u94c1\u6212");
            equipObj.belongs = userInfo.account;
            equipObj.id = +new Date();
            equipObj.level = this.randomNum(1, +cc.vv.userData.level);
            equipObj.stronglevel = 0;
            equipObj.ison = 0;
            var randomNum4 = this.randomNum(1, 100);
            100 === randomNum4 && (equipObj.class = 6);
            95 < randomNum4 && randomNum4 < 100 && (equipObj.class = 5);
            85 < randomNum4 && randomNum4 <= 95 && (equipObj.class = 5);
            75 < randomNum4 && randomNum4 <= 85 && (equipObj.class = 3);
            50 < randomNum4 && randomNum4 <= 75 && (equipObj.class = 2);
            1 <= randomNum4 && randomNum4 <= 50 && (equipObj.class = 1);
            equipObj.property = equipObj.level * equipObj.class;
            equipObj.account = userInfo.account;
            cc.vv.http.sendPostRequest("/createEquipment", equipObj).then(function(res) {
              res = JSON.parse(res);
              200 === res.code && cc.vv.message.showMessage("\u606d\u559c\u60a8\u83b7\u53d6\u4e00\u4ef6\u65b0\u7684\u88c5\u5907", 0);
            });
          } else cc.vv.message.showMessage("\u5f88\u9057\u61be\uff0c\u60a8\u6ca1\u6709\u83b7\u53d6\u88c5\u5907", 1);
        }
      },
      randomNum: function randomNum(minNum, maxNum) {
        switch (arguments.length) {
         case 1:
          return parseInt(Math.random() * minNum + 1, 10);

         case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);

         default:
          return 0;
        }
      },
      signUpToday: function signUpToday() {
        var self = this;
        self.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        var params = {
          account: self.userInfo.account
        };
        if (self.operateFlag) return;
        self.operateFlag = true;
        cc.vv.http.sendPostRequest("/signUpToday", params).then(function(res) {
          res = JSON.parse(res);
          200 === res.code ? cc.vv.message.showMessage(res.message, 0) : cc.vv.message.showMessage(res.message, 1);
          self.operateFlag = false;
        }, function() {
          cc.vv.message.showMessage("\u7b7e\u5230\u5931\u8d25", 1);
          self.operateFlag = false;
        });
      },
      goToGetMoney: function goToGetMoney() {
        cc.director.loadScene("getMoney");
      },
      goToWujinshilian: function goToWujinshilian() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        if (self.userInfoDetail.shilianFlag) {
          cc.vv.message.showMessage("\u4eca\u5929\u6b21\u6570\u5df2\u6ee1\uff0c\u8bf7\u660e\u5929\u518d\u8bd5", 1);
          return;
        }
        cc.vv.http.sendPostRequest("/reduceShilianFlag", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          200 === res.code ? cc.director.loadScene("wujinshilian") : cc.vv.message.showMessage("\u8054\u7f51\u5931\u8d25,\u8bf7\u91cd\u8bd5", 1);
        }, function() {
          cc.vv.message.showMessage("\u8054\u7f51\u5931\u8d25,\u8bf7\u91cd\u8bd5", 1);
        });
      },
      goToBattleStart: function goToBattleStart() {
        cc.vv.myTeamList = [ {
          totalBloodCount: 1e3,
          currentBloodCount: 1e3,
          totalSpeedCount: 1,
          currentSpeedCount: 1,
          attack: 15,
          name: "\u674e\u6d77\u6770"
        }, {
          totalBloodCount: 1e3,
          currentBloodCount: 1e3,
          totalSpeedCount: 1.5,
          currentSpeedCount: 1.5,
          attack: 100,
          name: "\u5ba0\u7269\u718a"
        } ];
        cc.vv.attackUser = {
          totalSpeedCount: 1,
          currentSpeedCount: 1,
          totalBloodCount: 1e3,
          currentBloodCount: 1e3,
          attack: 100,
          name: "\u602a\u7269\u718a"
        };
        cc.director.loadScene("userbattle");
      },
      goToJiuguan: function goToJiuguan() {
        cc.director.loadScene("jiuguan");
      }
    });
    cc._RF.pop();
  }, {} ],
  bag: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "729cbT5U+tLlLDycYQMaitW", "bag");
    "use strict";
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
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
        this.keepclassnum.string = "\uff08" + cc.vv.userData.keepclassnum + "\uff09";
        this.strongstonenum.string = "\uff08" + cc.vv.userData.strongstonenum + "\uff09";
        this.upclassstone.string = "\uff08" + cc.vv.userData.upclassstone + "\uff09";
        this.editnamecard.string = "\uff08" + cc.vv.userData.editnamecard + "\uff09";
        this.liangshibag.string = "\uff08" + cc.vv.userData.liangshibag + "\uff09";
        this.tiekuangbag.string = "\uff08" + cc.vv.userData.tiekuangbag + "\uff09";
        this.woodsbag.string = "\uff08" + cc.vv.userData.woodsbag + "\uff09";
        this.caoyaobag.string = "\uff08" + cc.vv.userData.caoyaobag + "\uff09";
      },
      resetName: function resetName() {
        this.newNameBg.active = true;
      },
      changeName: function changeName() {
        if (cc.vv.userData.editnamecard <= 0) {
          cc.vv.message.showMessage("\u6539\u540d\u5361\u6570\u91cf\u4e0d\u8db3", 1);
          return;
        }
        if (!this.newName.string) {
          cc.vv.message.showMessage("\u8bf7\u8f93\u5165\u65b0\u540d\u5b57", 1);
          return;
        }
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendPostRequest("/changeName", {
          account: userInfo.account,
          newName: this.newName.string
        }).then(function(res) {
          res = JSON.parse(res);
          200 === res.code ? cc.director.loadScene("city") : cc.vv.message.showMessage("\u4f7f\u7528\u6539\u540d\u5361\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5", 1);
        }, function() {
          cc.vv.message.showMessage("\u4f7f\u7528\u6539\u540d\u5361\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5", 1);
        });
      },
      cancel: function cancel() {
        this.newNameBg.active = false;
      },
      getResource: function getResource(event, resourcecate) {
        var self = this;
        if (self.operateFlag) return;
        self.operateFlag = true;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendPostRequest("/getResource", {
          account: userInfo.account,
          type: resourcecate
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            cc.vv.message.showMessage("\u83b7\u53d61000\u8d44\u6e90", 0);
            self[resourcecate + "bag"].string = "\uff08" + (+cc.vv.userData[resourcecate + "bag"] - 1) + "\uff09";
          } else cc.vv.message.showMessage(res.message, 1);
          self.operateFlag = false;
        }, function() {
          cc.vv.message.showMessage("\u4f7f\u7528\u8d44\u6e90\u5305\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5", 1);
          self.operateFlag = false;
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  battleLevelSelect: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5314i97z9PTYKYQ0Pxfbl3", "battleLevelSelect");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
      },
      returnBattle: function returnBattle(event, level) {
        if (parseInt(+cc.vv.userData.level / 10 + 1) < +level) {
          cc.vv.message.showMessage("\u6302\u673a\u526f\u672c\u5883\u754c\u592a\u9ad8\uff0c\u4e0d\u53ef\u9009\u62e9", 1);
          return;
        }
        cc.vv.userData.currentbattlelevel = +level;
        var params = {
          account: cc.vv.userData.account,
          currentbattlelevel: +level
        };
        cc.vv.http.sendPostRequest("/updateBattleLevel", params).then(function(res) {
          cc.vv.userData.currentbattlelevel = +level;
          cc.director.loadScene("battle");
        }, function() {
          cc.vv.message.showMessage("\u9009\u62e9\u8bd5\u70bc\u4e4b\u5730\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5", 1);
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  battle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "55858GrzYZD35oZYTRd/JUp", "battle");
    "use strict";
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
      onLoad: function onLoad() {
        var self = this;
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
        this.resetFlag = false;
        this.tipFlag = false;
        self.tipsView.content.height = 50;
        this.num = 0;
      },
      showBattleLevel: function showBattleLevel() {
        var self = this;
        switch (+cc.vv.userData.currentbattlelevel) {
         case 1:
          self.currentBattle.string = "\u51e1\u4eba\u5883";
          break;

         case 2:
          self.currentBattle.string = "\u661f\u8fb0\u5883";
          break;

         case 3:
          self.currentBattle.string = "\u8d85\u51e1\u5883";
          break;

         case 4:
          self.currentBattle.string = "\u795e\u7075\u5883";
          break;

         case 5:
          self.currentBattle.string = "\u754c\u795e\u5883";
          break;

         case 6:
          self.currentBattle.string = "\u771f\u795e\u5883";
          break;

         case 7:
          self.currentBattle.string = "\u865a\u7a7a\u5883";
          break;

         case 8:
          self.currentBattle.string = "\u5408\u4e00\u5883";
          break;

         case 9:
          self.currentBattle.string = "\u6df7\u6c8c\u5883";
          break;

         case 10:
          self.currentBattle.string = "\u6d51\u6e90\u5883";
          break;

         case 11:
          self.currentBattle.string = "\u5723\u4eba\u5883";
          break;

         case 12:
          self.currentBattle.string = "\u8d85\u5723\u5883";
          break;

         case 13:
          self.currentBattle.string = "\u6d51\u6e90\u751f\u547d";
        }
      },
      waitBattle: function waitBattle(string) {
        var self = this;
        var labelNode = new cc.Node();
        labelNode.addComponent(cc.Label);
        var label = labelNode.getComponent(cc.Label);
        label.fontSize = 30;
        self.tipsView.content.insertChild(labelNode, 0);
        self.tipsView.content.height += labelNode.height;
        label.string = string;
      },
      goToSelectBattleLevel: function goToSelectBattleLevel() {
        cc.director.loadScene("battleLevelSelect");
      },
      update: function update(dt) {
        var self = this;
        this.selfSpeedCurrentCount = this.selfSpeedCurrentCount - dt;
        this.otherSpeedCurrentCount = this.otherSpeedCurrentCount - dt;
        if (this.selfSpeedCurrentCount <= 0 && self.battleTop.active) {
          this.otherBloodCurrentCount -= 30;
          this.selfSpeedCurrentCount = 1;
        }
        if (this.otherSpeedCurrentCount <= 0 && self.battleTop.active) {
          this.selfBloodCurrentCount -= 20;
          this.otherSpeedCurrentCount = 2;
        }
        if (!this.resetFlag && (this.selfBloodCurrentCount <= 0 || this.otherBloodCurrentCount <= 0)) {
          self.battleTop.active = false;
          self.resetFlag = true;
          self.scheduleOnce(function() {
            self.waitBattle("5 \u5bfb\u627e\u602a\u7269\u4e2d......");
          }, 1);
          self.scheduleOnce(function() {
            self.waitBattle("4 \u5bfb\u627e\u602a\u7269\u4e2d......");
          }, 2);
          self.scheduleOnce(function() {
            self.waitBattle("3 \u5bfb\u627e\u602a\u7269\u4e2d......");
          }, 3);
          self.scheduleOnce(function() {
            self.waitBattle("2 \u5bfb\u627e\u602a\u7269\u4e2d......");
          }, 4);
          self.scheduleOnce(function() {
            self.waitBattle("1 \u5bfb\u627e\u602a\u7269\u4e2d......");
          }, 5);
          self.scheduleOnce(function() {
            self.selfBloodCurrentCount = 100;
            self.otherBloodCurrentCount = 100;
            self.selfSpeedCurrentCount = 1;
            self.otherSpeedCurrentCount = 2;
            self.battleTop.active = true;
            self.battleBottom.active = true;
            self.resetFlag = false;
            self.waitBattle("\u6218\u6597\u4e2d......");
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
  bottom2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aeb58IOAQlCY6xzx+eRSqv8", "bottom2");
    "use strict";
    cc.Class({
      extends: cc.Component,
      goToOtherScenes: function goToOtherScenes(event, customEventData) {
        cc.director.loadScene(customEventData);
      }
    });
    cc._RF.pop();
  }, {} ],
  cityBottom: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "13325EEQjhCV6b48OP0X4Jd", "cityBottom");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
      },
      goToOtherScenes: function goToOtherScenes(event, customEventData) {
        cc.director.getScene().name !== customEventData && cc.director.loadScene(customEventData);
      }
    });
    cc._RF.pop();
  }, {} ],
  city: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0d4e6Lu7L9Eh7ebgmNT8ctn", "city");
    "use strict";
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
      onLoad: function onLoad() {
        var self = this;
        cc.find("bottom").active = true;
        cc.game.addPersistRootNode(self.bottom);
        self.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        this.proBar = this.progressBar.getComponent(cc.ProgressBar);
        this.currentCount = 5;
        this.totalCount = 5;
        this.expProBar = this.expProgressBar.getComponent(cc.ProgressBar);
        this.getOfflineResource();
        this.getBattleAndTransport();
      },
      dealResourceNum: function dealResourceNum(amount) {
        if (+amount > 1e13) return parseInt(amount / 1e13) + "\u4e07\u4ebf";
        if (+amount > 1e8) return parseInt(amount / 1e8) + "\u4ebf";
        return +amount > 1e6 ? parseInt(amount / 1e4) + "\u4e07" : amount;
      },
      getOfflineResource: function getOfflineResource() {
        var self = this;
        self.updateTimes = 0;
        cc.vv.http.sendGetRequest("/getAccount", {
          account: self.userInfo.account
        }).then(function(response) {
          response = JSON.parse(response);
          var accountdata = response.data;
          if (!accountdata) {
            cc.director.loadScene("login");
            return;
          }
          self.updateTimes = parseInt((+new Date() - accountdata.updatetime) / 1e3 / 5);
          cc.vv.http.sendGetRequest("/getUserInfo", {
            account: self.userInfo.account
          }).then(function(res) {
            res = JSON.parse(res);
            var data = res.data;
            self.username.string = data.username;
            self.gemstone.string = data.gemstone;
            self.gold.string = data.gold;
            cc.vv.resourcedata = {
              tiekuang: +data.tiekuang + +data.tiekuangrate * (self.updateTimes || 1),
              liangshi: +data.liangshi + +data.liangshirate * (self.updateTimes || 1),
              caoyao: +data.caoyao + +data.caoyaorate * (self.updateTimes || 1),
              woods: +data.woods + +data.woodsrate * (self.updateTimes || 1),
              tiekuangrate: +data.tiekuangrate,
              liangshirate: +data.liangshirate,
              caoyaorate: +data.caoyaorate,
              woodsrate: +data.woodsrate,
              gold: +data.gold
            };
            var expRate = 100 * Math.pow(1.2, data.currentbattlelevel - 1);
            cc.vv.resourcedata.gold = +cc.vv.resourcedata.gold + +parseInt(Math.pow(1.2, data.currentbattlelevel - 1) * (self.updateTimes || 1) / 10);
            cc.vv.userData = {
              account: data.account,
              exp: parseInt(+data.exp + +data.exprate * (self.updateTimes || 1) * expRate),
              totalexp: parseInt(+data.totalexp),
              level: +data.level,
              currentbattlelevel: data.currentbattlelevel,
              gemstone: +data.gemstone,
              keepclassnum: +data.keepclassnum,
              strongstonenum: +data.strongstonenum,
              strongstoneclip: +data.strongstoneclip,
              upclassstone: +data.upclassstone,
              upclassstoneclip: +data.upclassstoneclip,
              editnamecard: +data.editnamecard,
              liangshibag: +data.liangshibag,
              tiekuangbag: +data.tiekuangbag,
              woodsbag: +data.woodsbag,
              caoyaobag: +data.caoyaobag
            };
            while (+cc.vv.userData.exp >= +cc.vv.userData.totalexp) {
              cc.vv.userData.level = +cc.vv.userData.level + 1;
              cc.vv.userData.exp = parseInt(+cc.vv.userData.exp - +cc.vv.userData.totalexp);
              cc.vv.userData.totalexp = parseInt(1.2 * +cc.vv.userData.totalexp);
            }
            self.showResource();
          }, function() {
            cc.vv.message.showMessage("\u83b7\u53d6\u5931\u8d25", 1);
          });
        }, function() {
          cc.vv.message.showMessage("\u83b7\u53d6\u5931\u8d25", 1);
        });
      },
      showResource: function showResource() {
        var self = this;
        self.expData.string = cc.vv.userData.exp + "/" + cc.vv.userData.totalexp;
        self.level.string = self.dealLevel(+cc.vv.userData.level);
        var expRate = 100 * Math.pow(1.2, cc.vv.userData.currentbattlelevel - 1);
        cc.vv.userData.exp = cc.vv.userData.exp + expRate;
        self.tiekuang.string = self.dealResourceNum(cc.vv.resourcedata.tiekuang);
        self.liangshi.string = self.dealResourceNum(cc.vv.resourcedata.liangshi);
        self.caoyao.string = self.dealResourceNum(cc.vv.resourcedata.caoyao);
        self.woods.string = self.dealResourceNum(cc.vv.resourcedata.woods);
      },
      getBattleAndTransport: function getBattleAndTransport() {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendGetRequest("/battleWarList", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 !== res.code) {
            cc.vv.message.showMessage("\u83b7\u53d6\u526f\u672c\u6218\u961f\u5931\u8d25", 1);
            return;
          }
          var items = res.data;
          self.battleWarList = items || [];
          var money = 0;
          for (var i = 0; i < items.length; ++i) if (items[i].isbusy) {
            var resttime = items[i].totaltime - parseInt((+new Date() - items[i].starttime) / 1e3);
            if (resttime <= 0) {
              money += 1 * +items[i].class;
              cc.vv.http.sendPostRequest("/finishBattle", {
                account: userInfo.account,
                id: items[i].id,
                money: money
              }).then(function(res) {});
            }
          }
        }, function() {});
        cc.vv.http.sendGetRequest("/getTransportList", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          var items = res.data;
          self.transportList = items || [];
          var gold = 0;
          for (var i = 0; i < items.length; ++i) if (items[i].isbusy) {
            var resttime = items[i].totaltime - parseInt((+new Date() - items[i].starttime) / 1e3);
            if (resttime <= 0) {
              gold += 10 + 10 * +items[i].class + +items[i].level;
              cc.vv.http.sendPostRequest("/finishBusiness", {
                account: userInfo.account,
                id: items[i].id,
                gold: gold
              }).then(function(res) {});
            }
          }
        }, function() {});
      },
      updateResource: function updateResource() {
        var params = cc.vv.resourcedata;
        params.exp = cc.vv.userData.exp;
        params.totalexp = cc.vv.userData.totalexp;
        params.level = cc.vv.userData.level;
        params.currentbattlelevel = cc.vv.userData.currentbattlelevel;
        params.account = cc.vv.userData.account;
        cc.vv.http.sendPostRequest("/updateResource", params).then(function(res) {}, function() {});
      },
      goToOtherScenes: function goToOtherScenes(event, customEventData) {
        cc.director.loadScene(customEventData);
      },
      dealLevel: function dealLevel(level) {
        var str = "";
        switch (parseInt(level / 10) + 1) {
         case 1:
          str = "\u51e1\u4eba\u5883";
          break;

         case 2:
          str = "\u661f\u8fb0\u5883";
          break;

         case 3:
          str = "\u8d85\u51e1\u5883";
          break;

         case 4:
          str = "\u795e\u7075\u5883";
          break;

         case 5:
          str = "\u754c\u795e\u5883";
          break;

         case 6:
          str = "\u771f\u795e\u5883";
          break;

         case 7:
          str = "\u865a\u7a7a\u5883";
          break;

         case 8:
          str = "\u5408\u4e00\u5883";
          break;

         case 9:
          str = "\u6df7\u6c8c\u5883";
          break;

         case 10:
          str = "\u6d51\u6e90\u5883";
          break;

         case 11:
          str = "\u5723\u4eba\u5883";
          break;

         case 12:
          str = "\u8d85\u5723\u5883";
          break;

         case 13:
          str = "\u6d51\u6e90\u751f\u547d";
          break;

         default:
          str = "\u51e1\u4eba\u5883";
        }
        switch (level % 10) {
         case 0:
          str += "\u96f6\u9636";
          break;

         case 1:
          str += "\u4e00\u9636";
          break;

         case 2:
          str += "\u4e8c\u9636";
          break;

         case 3:
          str += "\u4e09\u9636";
          break;

         case 4:
          str += "\u56db\u9636";
          break;

         case 5:
          str += "\u4e94\u9636";
          break;

         case 6:
          str += "\u516d\u9636";
          break;

         case 7:
          str += "\u4e03\u9636";
          break;

         case 8:
          str += "\u516b\u9636";
          break;

         case 9:
          str += "\u4e5d\u9636";
        }
        return str;
      },
      update: function update(dt) {
        this.currentCount -= dt;
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
  equipDetail: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3deabvHfKxOXpKr6qLRDB+Y", "equipDetail");
    "use strict";
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
      onLoad: function onLoad() {
        var self = this;
        self.getEquipmentDetail();
      },
      getEquipmentDetail: function getEquipmentDetail() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendGetRequest("/getEquipmentDetail", {
          account: userInfo.account,
          id: cc.vv.currentEquipId
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            self.equipDetail = res.equipDetail;
            self.showDetail();
          } else cc.vv.message.showMessage("\u83b7\u53d6\u88c5\u5907\u8be6\u60c5\u5931\u8d25", 1);
        }, function() {
          cc.vv.message.showMessage("\u83b7\u53d6\u88c5\u5907\u8be6\u60c5\u5931\u8d25", 1);
        });
      },
      showDetail: function showDetail() {
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
          var ZISE = new cc.Color(255, 0, 255, 1);
          this.equipname.node.color = ZISE;
          this.equiptype.node.color = ZISE;
          this.property.node.color = ZISE;
          this.level.node.color = ZISE;
          this.belongs.node.color = ZISE;
          this.strongLevel.node.color = ZISE;
          this.desc.node.color = ZISE;
          this.tip1.node.color = ZISE;
          this.tip2.node.color = ZISE;
          this.tip3.node.color = ZISE;
          this.tip4.node.color = ZISE;
          this.tip5.node.color = ZISE;
          this.tip6.node.color = ZISE;
          this.tip7.node.color = ZISE;
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
        var equipPropertyStr = "";
        1 === this.equipDetail.type && (equipPropertyStr = "\u529b\u91cf: ");
        2 === this.equipDetail.type && (equipPropertyStr = "\u6839\u9aa8: ");
        3 === this.equipDetail.type && (equipPropertyStr = "\u4f53\u8d28: ");
        4 === this.equipDetail.type && (equipPropertyStr = "\u901f\u5ea6: ");
        5 === this.equipDetail.type && (equipPropertyStr = "\u66b4\u51fb: ");
        this.equipname.string = this.equipDetail.name;
        this.equiptype.string = this.equipDetail.type;
        this.property.string = equipPropertyStr + this.equipDetail.property;
        this.level.string = this.equipDetail.level;
        this.belongs.string = this.equipDetail.belongs;
        this.strongLevel.string = this.equipDetail.strongLevel;
        this.desc.string = this.equipDetail.desc || "";
      },
      deleteEquipment: function deleteEquipment() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendPostRequest("/deleteEquipment", {
          account: userInfo.account,
          id: cc.vv.currentEquipId
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            cc.director.loadScene("equipList");
            cc.vv.message.showMessage("\u4e22\u5f03\u88c5\u5907\u6210\u529f", 1);
          } else cc.vv.message.showMessage("\u4e22\u5f03\u88c5\u5907\u5931\u8d25", 1);
        }, function() {
          cc.vv.message.showMessage("\u4e22\u5f03\u88c5\u5907\u5931\u8d25", 1);
        });
      },
      strongEquipment: function strongEquipment() {
        console.log("\u5f3a\u5316\u88c5\u5907");
      },
      goToEquipmentList: function goToEquipmentList() {
        cc.director.loadScene("equipList");
      }
    });
    cc._RF.pop();
  }, {} ],
  equipList: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e3d10J9tRlCOKgTAQ//w6RJ", "equipList");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        equipPrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        this.getEquipmentList();
      },
      getEquipmentList: function getEquipmentList() {
        var self = this;
        var equipmentType = cc.vv.equipmentType;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendGetRequest("/getEquipList", {
          account: userInfo.account,
          equipmentType: equipmentType
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            var equipmentList = res.equipmentList;
            self.node.height = 110 * equipmentList.length;
            for (var i = 0; i < equipmentList.length; ++i) {
              var item = cc.instantiate(self.equipPrefab);
              var data = equipmentList[i];
              self.node.addChild(item);
              item.getComponent("EquipmentTemplate").init(data, function(params) {
                if ("showdetail" === params.operate) {
                  cc.vv.currentEquipId = params.id;
                  cc.director.loadScene("equipDetail");
                }
                "equip" === params.operate && self.equipUser(params.id);
              });
            }
          } else cc.vv.message.showMessage("\u83b7\u53d6\u88c5\u5907\u5217\u8868\u5931\u8d25", 1);
        }, function() {
          cc.vv.message.showMessage("\u83b7\u53d6\u88c5\u5907\u5217\u8868\u5931\u8d25", 1);
        });
      },
      equipUser: function equipUser(id) {
        var equipmentType = cc.vv.equipmentType;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendPostRequest("/equipUser", {
          account: userInfo.account,
          equipmentType: equipmentType,
          id: id
        }).then(function(res) {
          res = JSON.parse(res);
          200 === res.code ? cc.director.loadScene("equip") : cc.vv.message.showMessage("\u88c5\u5907\u5931\u8d25", 1);
        }, function() {
          cc.vv.message.showMessage("\u88c5\u5907\u5931\u8d25", 1);
        });
      },
      goToEquipmentDetail: function goToEquipmentDetail() {
        cc.director.loadScene("equipDetail");
      }
    });
    cc._RF.pop();
  }, {} ],
  equip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "13211GT+lNBX6b7sGHOwvJp", "equip");
    "use strict";
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
      onLoad: function onLoad() {
        var self = this;
        self.getMyEquipmentList();
      },
      getMyEquipmentList: function getMyEquipmentList() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendGetRequest("/getMyEquipmentList", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            self.equipList = res.data || [];
            self.showEquipment();
          } else cc.vv.message.showMessage("\u83b7\u53d6\u88c5\u5907\u5931\u8d25", 1);
        }, function() {
          cc.vv.message.showMessage("\u83b7\u53d6\u88c5\u5907\u5931\u8d25", 1);
        });
      },
      showEquipment: function showEquipment() {
        for (var i = 0; i < this.equipList.length; i++) {
          if (2 === this.equipList[i].class) {
            this["equipName" + this.equipList[i].type].node.color = cc.Color.GREEN;
            this["equipLevel" + this.equipList[i].type].node.color = cc.Color.GREEN;
            this["equipProperty" + this.equipList[i].type].node.color = cc.Color.GREEN;
          }
          if (3 === this.equipList[i].class) {
            this["equipName" + this.equipList[i].type].node.color = cc.Color.BLUE;
            this["equipLevel" + this.equipList[i].type].node.color = cc.Color.BLUE;
            this["equipProperty" + this.equipList[i].type].node.color = cc.Color.BLUE;
          }
          if (4 === this.equipList[i].class) {
            var ZISE = new cc.Color(255, 0, 255, 1);
            this["equipName" + this.equipList[i].type].node.color = ZISE;
            this["equipLevel" + this.equipList[i].type].node.color = ZISE;
            this["equipProperty" + this.equipList[i].type].node.color = ZISE;
          }
          if (5 === this.equipList[i].class) {
            this["equipName" + this.equipList[i].type].node.color = cc.Color.ORANGE;
            this["equipLevel" + this.equipList[i].type].node.color = cc.Color.ORANGE;
            this["equipProperty" + this.equipList[i].type].node.color = cc.Color.ORANGE;
          }
          if (6 === this.equipList[i].class) {
            this["equipName" + this.equipList[i].type].node.color = cc.Color.RED;
            this["equipLevel" + this.equipList[i].type].node.color = cc.Color.RED;
            this["equipProperty" + this.equipList[i].type].node.color = cc.Color.RED;
          }
          var equipPropertyStr = "";
          1 === this.equipList[i].type && (equipPropertyStr = "\u529b\u91cf: ");
          2 === this.equipList[i].type && (equipPropertyStr = "\u6839\u9aa8: ");
          3 === this.equipList[i].type && (equipPropertyStr = "\u4f53\u8d28: ");
          4 === this.equipList[i].type && (equipPropertyStr = "\u901f\u5ea6: ");
          5 === this.equipList[i].type && (equipPropertyStr = "\u66b4\u51fb: ");
          this["equipName" + this.equipList[i].type].string = this.equipList[i].name;
          this["equipLevel" + this.equipList[i].type].string = "lv" + this.equipList[i].level;
          this["equipProperty" + this.equipList[i].type].string = equipPropertyStr + this.equipList[i].property;
        }
      },
      goToEquipmentList: function goToEquipmentList(event, type) {
        cc.vv.equipmentType = +type;
        cc.director.loadScene("equipList");
      }
    });
    cc._RF.pop();
  }, {} ],
  goTowar: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8a16dIDeLtIT44RP1yzA7Vu", "goTowar");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        itemPrefab: cc.Prefab,
        selectWar: {
          type: cc.Node,
          default: null
        }
      },
      onLoad: function onLoad() {
        this.reloadWar();
      },
      addNewBattle: function addNewBattle(event, money) {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        var self = this;
        if (money) {
          if (cc.vv.userData.gemstone < 1e3) {
            cc.vv.message.showMessage("\u94bb\u77f3\u4e0d\u8db3\uff0c\u8bf7\u5145\u503c", 1);
            return;
          }
          var moneyLen = 0;
          for (var i = 0; i < this.battleWarList.length; i++) this.battleWarList[i].isbuiedmoney && moneyLen++;
          if (moneyLen >= 5) {
            cc.vv.message.showMessage("\u94bb\u77f3\u6218\u961f\u5df2\u8fbe\u5230\u6700\u5927\u6218\u961f\u6570\u91cf", 1);
            return;
          }
          if (this.operateFlag) return;
          this.operateFlag = true;
          cc.vv.http.sendPostRequest("/addNewBattleWar", {
            account: userInfo.account,
            money: true
          }).then(function(res) {
            res = JSON.parse(res);
            if (200 === res.code) {
              self.reloadWar();
              cc.vv.message.showMessage("\u5f00\u901a\u6218\u961f\u6210\u529f", 0);
            } else {
              cc.vv.message.showMessage(res.message, 0);
              self.operateFlag = false;
            }
          }, function() {
            cc.vv.message.showMessage("\u5f00\u901a\u5931\u8d25", 0);
            self.operateFlag = false;
          });
        } else {
          var len = 0;
          for (var _i = 0; _i < this.battleWarList.length; _i++) this.battleWarList[_i].isbuiedmoney || len++;
          if (parseInt(cc.vv.userData.level / 10) + 1 <= len) {
            cc.vv.message.showMessage("\u5f53\u524d\u6218\u961f\u5df2\u8fbe\u5230\u6700\u5927\u6218\u961f\u6570\u91cf", 1);
            return;
          }
          if (this.operateFlag) return;
          this.operateFlag = true;
          cc.vv.http.sendPostRequest("/addNewBattleWar", {
            account: userInfo.account
          }).then(function(res) {
            res = JSON.parse(res);
            if (200 === res.code) {
              self.reloadWar();
              cc.vv.message.showMessage("\u5f00\u901a\u6218\u961f\u6210\u529f", 0);
            } else {
              cc.vv.message.showMessage(res.message, 0);
              self.operateFlag = false;
            }
          }, function() {
            self.reloadWar();
            cc.vv.message.showMessage("\u5f00\u901a\u6218\u961f\u5931\u8d25", 1);
          });
        }
      },
      transBattle: function transBattle() {
        var self = this;
        var ids = [];
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        for (var i = 0; i < self.node.children.length; i++) self.node.children[i].getChildByName("New Toggle").getComponent(cc.Toggle).isChecked && self.node.children[i].getChildByName("New Toggle").getComponent(cc.Toggle).interactable && ids.push(+self.node.children[i].id);
        if (ids.length <= 0) {
          cc.vv.message.showMessage("\u8bf7\u9009\u62e9\u8981\u6d3e\u9063\u7684\u6218\u961f", 1);
          return;
        }
        this.data = {
          ids: ids
        };
        if (ids.length > 1) {
          cc.vv.message.showMessage("\u4ec5\u53ef\u540c\u65f6\u6d3e\u9063\u4e00\u4e2a\u6218\u961f", 1);
          return;
        }
        cc.vv.http.sendPostRequest("/createNewBattle", {
          account: userInfo.account,
          ids: ids
        }).then(function(res) {
          self.reloadWar();
        }, function() {});
      },
      selectWarLevel: function selectWarLevel() {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        var self = this;
        this.selectWar.active = false;
        var data = this.data || {};
        data.ids && data.ids.length > 0 && cc.vv.http.sendPostRequest("/createNewBattle", {
          account: userInfo.account,
          ids: data.ids
        }).then(function(res) {
          self.reloadWar();
        }, function() {});
      },
      reloadWar: function reloadWar() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        this.operateFlag = false;
        this.battleWarList = [];
        cc.vv.http.sendGetRequest("/battleWarList", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          var items = res.data;
          self.battleWarList = items || [];
          var children = self.node.children || [];
          for (var _i2 = 0; _i2 < children.length; _i2++) children[_i2].destroy();
          for (var i = 0; i < items.length; ++i) {
            var item = cc.instantiate(self.itemPrefab);
            var data = items[i];
            switch (data.class) {
             case 1:
              data.classStr = "\u9ed1\u94c1";
              break;

             case 2:
              data.classStr = "\u9752\u94dc";
              break;

             case 3:
              data.classStr = "\u9ec4\u91d1";
              break;

             case 4:
              data.classStr = "\u94c2\u91d1";
              break;

             case 5:
              data.classStr = "\u9ed1\u91d1";
              break;

             case 6:
              data.classStr = "\u94bb\u77f3";
              break;

             case 7:
              data.classStr = "\u9ed1\u94bb";
              break;

             case 8:
              data.classStr = "\u738b\u8005";
            }
            self.node.addChild(item);
            item.id = data.id;
            item.getComponent("ItemTemplate").init({
              id: data.id,
              tradename: data.name,
              weight: parseInt(Math.pow(1.05, +data.level - 1) * (data.basebattle + 500 * (+data.class - 1))),
              tradeclass: data.classStr,
              tradelevel: "lv" + data.level,
              isBusy: data.isbusy,
              starttime: +data.starttime,
              totaltime: +data.totaltime,
              class: +data.class,
              level: +data.level,
              basebattle: data.basebattle
            }, function(data) {
              if ("uplevel" === data.operate) if (data.data.level < 10) {
                var resourceAmount = 2e3 * data.data.level + 1e4 * Math.pow(2, data.data.class - 1);
                if (cc.vv.resourcedata.tiekuang < resourceAmount || cc.vv.resourcedata.liangshi < resourceAmount || cc.vv.resourcedata.caoyao < resourceAmount || cc.vv.resourcedata.woods < resourceAmount) {
                  cc.vv.message.showMessage("\u5347\u7ea7\u6218\u961f\u9700\u8981\u5404\u9879\u8d44\u6e90" + resourceAmount + ",\u8d44\u6e90\u4e0d\u8db3", 1);
                  return;
                }
                cc.vv.http.sendPostRequest("/battleUplevel", {
                  account: userInfo.account,
                  id: data.data.id,
                  resourceAmount: resourceAmount
                }).then(function(res) {
                  self.reloadWar();
                });
              } else cc.vv.message.showMessage("\u6218\u961f\u7b49\u7ea7\u5df2\u8fbe\u6ee1\u7ea7\uff0c\u8bf7\u5347\u9636\u6218\u961f", 1);
              if ("upclass" === data.operate) {
                if (data.data.level < 10) {
                  cc.vv.message.showMessage("\u5347\u9636\u9700\u8981\u7b49\u7ea7\u5347\u523010\u7ea7\u6ee1\u7ea7", 1);
                  return;
                }
                if (+data.data.class >= 8) {
                  cc.vv.message.showMessage("\u60a8\u5df2\u5347\u5230\u6ee1\u9636", 1);
                  return;
                }
                var reduceXianyuan = 0;
                data.data.class >= 3 && (reduceXianyuan = 1e3);
                if (cc.vv.userData.gemstone < reduceXianyuan) {
                  cc.vv.message.showMessage("\u5347\u9636\u9700\u8981\u94bb\u77f3" + reduceXianyuan + "\uff0c\u8bf7\u5145\u503c", 1);
                  return;
                }
                cc.vv.http.sendPostRequest("/updateGemstone", {
                  account: userInfo.account,
                  gemstone: +cc.vv.userData.gemstone - reduceXianyuan
                }).then(function(res) {
                  cc.vv.userData.gemstone = +cc.vv.userData.gemstone - reduceXianyuan;
                  cc.vv.http.sendPostRequest("/battleUpClass", {
                    account: userInfo.account,
                    id: data.data.id
                  }).then(function(res) {
                    self.reloadWar();
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
  initParams: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "33e13IqnthBiqGa/2zeKuhs", "initParams");
    "use strict";
    function initData() {
      cc.aa = 1;
      cc.resourcedata = {};
    }
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        initData();
        console.log("==================");
      }
    });
    cc._RF.pop();
  }, {} ],
  loading: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4f482VpCMdOHbs6hhk6VvxG", "loading");
    "use strict";
    function initManager() {
      cc.vv = {};
      cc.vv.http = require("HTTP");
      cc.vv.message = require("messageTip");
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
      onLoad: function onLoad() {
        initManager();
        cc.vv.tipsNum = 0;
        var self = this;
        var onsuccess = function onsuccess(version) {
          self.connectTip.string = "\u94fe\u63a5\u6210\u529f";
          cc.vv.userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
          cc.director.loadScene("login");
        };
        var onFail = function onFail() {
          self.connectTip.string = "\u94fe\u63a5\u5931\u8d25\uff0c5s\u540e\u91cd\u8bd5";
          setTimeout(connectServer, 3e3);
        };
        var connectServer = function connectServer() {
          cc.vv.http.sendGetRequest("/connectServer").then(function(res) {
            res = JSON.parse(res);
            onsuccess(res.version);
          }, function() {
            onFail();
          });
        };
        connectServer();
      }
    });
    cc._RF.pop();
  }, {
    HTTP: "HTTP",
    messageTip: "messageTip"
  } ],
  loginGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d199exM6AxCGLPRq2NnCRp4", "loginGame");
    "use strict";
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
      userLoginIn: function userLoginIn() {
        var self = this;
        var account = this.accountTextInfo.string;
        var password = this.passwordTextInfo.string;
        if (!account || !password) return;
        cc.vv.http.sendGetRequest("/loginGame", {
          account: account,
          password: password
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            cc.vv.userInfo = {
              account: account,
              password: password,
              isLogin: true
            };
            cc.sys.localStorage.setItem("jakiiAccountInfo", JSON.stringify(cc.vv.userInfo));
            cc.sys.localStorage.setItem("jakiiToken", res.md5Value);
            res.data ? cc.director.loadScene("welcome") : cc.director.loadScene("city");
          } else {
            self.errorMessage.string = "\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef,\u5982\u679c\u4e3a\u7b2c\u4e00\u6b21\u6ce8\u518c\u8d26\u53f7\uff0c\u5219\u8be5\u8d26\u53f7\u5df2\u7ecf\u88ab\u6ce8\u518c\uff0c\u8bf7\u66f4\u6362\u65b0\u8d26\u53f7\u6ce8\u518c";
            setTimeout(function() {
              self.errorMessage.string = "";
            }, 1e3);
          }
        }, function() {
          self.errorMessage.string = "\u7528\u6237\u540d\u6216\u5bc6\u7801\u9519\u8bef";
          setTimeout(function() {
            self.errorMessage.string = "";
          }, 1e3);
        });
      },
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
        if (cc.vv.userInfo) {
          this.accountTextInfo.string = cc.vv.userInfo.account || "";
          this.passwordTextInfo.string = cc.vv.userInfo.password || "";
        }
        cc.find("bottom") && (cc.find("bottom").active = false);
      }
    });
    cc._RF.pop();
  }, {} ],
  market: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1e574sEyrpBE4cwygRSV9S/", "market");
    "use strict";
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
      changeTab: function changeTab(event, resourceData) {
        if ("game" === resourceData) {
          this.gameMarket.active = true;
          this.moneyMarket.active = false;
        }
        if ("money" === resourceData) {
          this.gameMarket.active = false;
          this.moneyMarket.active = true;
        }
      },
      buyThingsByCoins: function buyThingsByCoins(event, resourceData) {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        var self = this;
        if (self.operateFlag) return;
        self.operateFlag = true;
        cc.vv.http.sendPostRequest("/buyThingsByCoins", {
          type: resourceData,
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          200 === res.code ? cc.vv.message.showMessage("\u8d2d\u4e70\u6210\u529f", 0) : cc.vv.message.showMessage(res.message, 1);
          self.operateFlag = false;
        }, function() {
          cc.vv.message.showMessage("\u8d2d\u4e70\u6210\u529f", 1);
          self.operateFlag = false;
        });
      },
      buyThingsByMoney: function buyThingsByMoney(event, resourceData) {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        var self = this;
        if (self.operateFlag) return;
        self.operateFlag = true;
        cc.vv.http.sendPostRequest("/buyThingsByMoney", {
          type: resourceData,
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          200 === res.code ? cc.vv.message.showMessage("\u8d2d\u4e70\u6210\u529f", 0) : cc.vv.message.showMessage(res.message, 1);
          self.operateFlag = false;
        }, function() {
          cc.vv.message.showMessage("\u8d2d\u4e70\u6210\u529f", 1);
          self.operateFlag = false;
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  messageTip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29dd6XAzbRBN6ZDAMfHAnmw", "messageTip");
    "use strict";
    var messageTip = cc.Class({
      extends: cc.Component,
      statics: {
        showMessage: function showMessage(str, error) {
          var canvas = cc.find("Canvas");
          var labelNode = new cc.Node();
          error && (labelNode.color = cc.Color.RED);
          labelNode.addComponent(cc.Label);
          var label = labelNode.getComponent(cc.Label);
          label.fontSize = 40;
          label.string = str;
          canvas.addChild(labelNode, 1e3);
          var callback = function callback() {
            if (labelNode.children) {
              labelNode.y = (labelNode.y || 0) + 10;
              labelNode.opacity -= 5;
              labelNode.opacity <= 0 && label.unschedule(callback);
            }
          };
          setTimeout(function() {
            label.schedule(callback, .1);
          }, 1e3);
        }
      }
    });
    cc._RF.pop();
  }, {} ],
  progress: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4ac78OiiXdO3IYTa+OvByCi", "progress");
    "use strict";
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
      loadSource: function loadSource() {
        var self = this;
        this.status.string = "\u52a0\u8f7d\u8d44\u6e90\u4e2d...";
        cc.loader.loadResDir("textures", function(currentCount, totalCount) {}, function() {
          self.finishFlag = true;
          self.status.string = "\u8d44\u6e90\u52a0\u8f7d\u5b8c\u6210\uff0c\u5373\u5c06\u5f00\u59cb\u6e38\u620f";
          self.node.active = false;
          self.infoNode.active = true;
        });
      },
      onLoad: function onLoad() {
        this.loadSource();
      },
      update: function update(dt) {
        this.finishFlag && (this.status.string = "\u8d44\u6e90\u52a0\u8f7d\u5b8c\u6210\uff0c\u5373\u5c06\u5f00\u59cb\u6e38\u620f");
      }
    });
    cc._RF.pop();
  }, {} ],
  rank: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f22bfnv8SpOAozGoRrILfRq", "rank");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        userItemPrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
        this.getRankList();
      },
      getRankList: function getRankList() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendGetRequest("/getUserList", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          var userList = res.data || [];
          self.userList = userList;
          for (var i = 0; i < userList.length; ++i) {
            var item = cc.instantiate(self.userItemPrefab);
            var data = userList[i];
            data["sort"] = i + 1;
            self.node.addChild(item);
            item.getComponent("ItemRankTemplate").init(data);
          }
        }, function() {});
      }
    });
    cc._RF.pop();
  }, {} ],
  resource: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9ce14LtPGNIxroq5eMbhHxm", "resource");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        content: {
          type: cc.Node,
          default: null
        }
      },
      onLoad: function onLoad() {
        var self = this;
        self.operateFlag = false;
        cc.vv.tipsNum = 0;
        this.getResourceInfo();
      },
      getResourceInfo: function getResourceInfo() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        cc.vv.http.sendGetRequest("/getResourceInfo", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            var resourceList = res.data || [];
            self.resourceList = resourceList;
            for (var i = 0; i < resourceList.length; i++) {
              var needWoods = 0;
              needWoods = +resourceList[i].level <= 30 ? parseInt(Math.pow(1.5, +resourceList[i].level - 1)) : +resourceList[i].level <= 50 ? 3e5 : 5e5;
              if ("\u519c\u7530" === resourceList[i].name) {
                self.content.children[0].children[3].getComponent("cc.Label").string = +resourceList[i].level;
                self.content.children[0].children[6].getComponent("cc.Label").string = 10 * needWoods;
              }
              if ("\u94c1\u77ff" === resourceList[i].name) {
                self.content.children[1].children[3].getComponent("cc.Label").string = +resourceList[i].level;
                self.content.children[1].children[6].getComponent("cc.Label").string = 10 * needWoods;
              }
              if ("\u8349\u836f" === resourceList[i].name) {
                self.content.children[2].children[3].getComponent("cc.Label").string = +resourceList[i].level;
                self.content.children[2].children[6].getComponent("cc.Label").string = 10 * needWoods;
              }
              if ("\u6728\u6750" === resourceList[i].name) {
                self.content.children[3].children[3].getComponent("cc.Label").string = +resourceList[i].level;
                self.content.children[3].children[6].getComponent("cc.Label").string = 10 * needWoods;
              }
            }
          }
        }, function() {});
      },
      upResourceLevel: function upResourceLevel(event, resourceData) {
        var self = this;
        if (self.operateFlag) return;
        var resourceId = 0;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        "liangshi" === resourceData && self.resourceList.forEach(function(resourceItem) {
          "\u519c\u7530" === resourceItem.name && (resourceId = resourceItem.id);
        });
        "tiekuang" === resourceData && self.resourceList.forEach(function(resourceItem) {
          "\u94c1\u77ff" === resourceItem.name && (resourceId = resourceItem.id);
        });
        "woods" === resourceData && self.resourceList.forEach(function(resourceItem) {
          "\u6728\u6750" === resourceItem.name && (resourceId = resourceItem.id);
        });
        "caoyao" === resourceData && self.resourceList.forEach(function(resourceItem) {
          "\u8349\u836f" === resourceItem.name && (resourceId = resourceItem.id);
        });
        cc.vv.http.sendPostRequest("/upResourceLevel", {
          account: userInfo.account,
          id: resourceId,
          type: resourceData
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            cc.vv.message.showMessage("\u5347\u7ea7\u6210\u529f", 0);
            self.getResourceInfo();
          } else cc.vv.message.showMessage(res.message, 1);
          self.operateFlag = false;
        }, function() {
          cc.vv.message.showMessage("\u5347\u7ea7\u5931\u8d25", 1);
          self.operateFlag = false;
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  settings: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c1924YJ7UhNZZXjwLhrXOVm", "settings");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        tips: {
          type: cc.Label,
          default: null
        }
      },
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
      },
      joinQ: function joinQ() {
        this.tips.string = "\u52a0\u5165qq\u7fa4\uff1a795582916\uff0c\u67e5\u770b\u6700\u65b0\u6e38\u620f\u9884\u544a\u548c\u653b\u7565";
      },
      logOutGame: function logOutGame() {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        userInfo.isLogin = false;
        cc.sys.localStorage.setItem("jakiiAccountInfo", JSON.stringify(userInfo));
        cc.director.loadScene("login");
      }
    });
    cc._RF.pop();
  }, {} ],
  trade: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8dbe7gEdhFPtpYB7tpXxNZn", "trade");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        itemPrefab: cc.Prefab
      },
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
        this.reloadTransport();
      },
      addNewTransport: function addNewTransport(event, money) {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        if (money) {
          if (cc.vv.userData.gemstone < 1e3) {
            cc.vv.message.showMessage("\u94bb\u77f3\u4e0d\u8db3\uff0c\u8bf7\u5145\u503c", 1);
            return;
          }
          var moneyLen = 0;
          for (var i = 0; i < this.transportList.length; i++) this.transportList[i].isbuiedmoney && moneyLen++;
          if (moneyLen >= 5) {
            cc.vv.message.showMessage("\u94bb\u77f3\u5546\u961f\u5df2\u8fbe\u5230\u6700\u5927\u5546\u961f\u6570\u91cf", 1);
            return;
          }
          if (this.operateFlag) return;
          this.operateFlag = true;
          cc.vv.http.sendPostRequest("/addNewTransport", {
            account: userInfo.account,
            money: true
          }).then(function(res) {
            res = JSON.parse(res);
            if (200 === res.code) {
              cc.vv.message.showMessage("\u5f00\u901a\u6210\u529f", 0);
              self.reloadTransport();
            } else {
              cc.vv.message.showMessage(res.message, 1);
              this.operateFlag = false;
            }
          }, function() {
            cc.vv.message.showMessage("\u5f00\u901a\u5931\u8d25", 1);
            this.operateFlag = false;
          });
        } else {
          var len = 0;
          for (var _i = 0; _i < this.transportList.length; _i++) this.transportList[_i].isbuiedmoney || len++;
          if (parseInt(cc.vv.userData.level / 10) + 1 <= len) {
            cc.vv.message.showMessage("\u5f53\u524d\u5546\u961f\u5df2\u8fbe\u5230\u6700\u5927\u5546\u961f\u6570\u91cf", 1);
            return;
          }
          if (this.operateFlag) return;
          self.operateFlag = true;
          cc.vv.http.sendPostRequest("/addNewTransport", {
            account: userInfo.account
          }).then(function(res) {
            res = JSON.parse(res);
            if (200 === res.code) {
              cc.vv.message.showMessage("\u5f00\u901a\u6210\u529f", 0);
              self.reloadTransport();
            } else {
              cc.vv.message.showMessage(res.message, 1);
              self.operateFlag = false;
            }
          }, function() {
            cc.vv.message.showMessage("\u5f00\u901a\u5931\u8d25", 1);
            self.operateFlag = false;
          });
        }
      },
      transport: function transport() {
        var self = this;
        var ids = [];
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        for (var i = 0; i < self.node.children.length; i++) self.node.children[i].getChildByName("New Toggle").getComponent(cc.Toggle).isChecked && self.node.children[i].getChildByName("New Toggle").getComponent(cc.Toggle).interactable && ids.push(+self.node.children[i].id);
        if (ids.length <= 0) {
          cc.vv.message.showMessage("\u8bf7\u9009\u62e9\u8981\u6d3e\u9063\u7684\u5546\u961f", 1);
          return;
        }
        var data = {
          ids: ids
        };
        if (ids.length > 1) {
          cc.vv.message.showMessage("\u4e00\u6b21\u53ea\u80fd\u6d3e\u9063\u4e00\u4e2a\u5546\u961f", 1);
          return;
        }
        cc.sys.localStorage.setItem(userInfo.account + "transportInfo", JSON.stringify(data));
        cc.vv.http.sendPostRequest("/createNewBusiness", {
          account: userInfo.account,
          ids: data.ids
        }).then(function(res) {
          cc.director.loadScene("trade");
        }, function() {});
      },
      reloadTransport: function reloadTransport() {
        this.operateFlag = false;
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        this.transportList = [];
        cc.vv.http.sendGetRequest("/getTransportList", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          var items = res.data;
          var children = self.node.children || [];
          for (var _i2 = 0; _i2 < children.length; _i2++) children[_i2].destroy();
          self.transportList = items || [];
          for (var i = 0; i < items.length; ++i) {
            var item = cc.instantiate(self.itemPrefab);
            var data = items[i];
            switch (data.class) {
             case 1:
              data.classStr = "\u9ed1\u94c1";
              break;

             case 2:
              data.classStr = "\u9752\u94dc";
              break;

             case 3:
              data.classStr = "\u9ec4\u91d1";
              break;

             case 4:
              data.classStr = "\u94c2\u91d1";
              break;

             case 5:
              data.classStr = "\u9ed1\u91d1";
              break;

             case 6:
              data.classStr = "\u94bb\u77f3";
              break;

             case 7:
              data.classStr = "\u9ed1\u94bb";
              break;

             case 8:
              data.classStr = "\u738b\u8005";
            }
            self.node.addChild(item);
            item.id = data.id;
            item.getComponent("ItemTemplate").init({
              id: data.id,
              tradename: data.name,
              weight: parseInt(Math.pow(1.1, +data.level - 1) * (data.baseweight + 100 * (+data.class - 1))),
              tradeclass: data.classStr,
              tradelevel: "lv" + data.level,
              isBusy: data.isbusy,
              starttime: +data.starttime,
              totaltime: +data.totaltime,
              class: +data.class,
              level: +data.level,
              baseweight: data.baseweight
            }, function(data) {
              if ("uplevel" === data.operate) if (data.data.level < 20) {
                var resourceAmount = 1e3 * data.data.level + 5e3 * Math.pow(2, data.data.class - 1);
                if (cc.vv.resourcedata.tiekuang < resourceAmount || cc.vv.resourcedata.liangshi < resourceAmount || cc.vv.resourcedata.caoyao < resourceAmount || cc.vv.resourcedata.woods < resourceAmount) {
                  cc.vv.message.showMessage("\u5347\u7ea7\u5546\u961f\u9700\u8981\u5404\u9879\u8d44\u6e90" + resourceAmount + ",\u8d44\u6e90\u4e0d\u8db3", 1);
                  return;
                }
                cc.vv.http.sendPostRequest("/transportUplevel", {
                  account: userInfo.account,
                  id: data.data.id,
                  resourceAmount: resourceAmount
                }).then(function(res) {
                  cc.director.loadScene("trade");
                }, function() {});
              } else cc.vv.message.showMessage("\u5546\u961f\u7b49\u7ea7\u5df2\u8fbe\u6ee1\u7ea7\uff0c\u8bf7\u5347\u9636\u5546\u961f", 1);
              if ("upclass" === data.operate) {
                if (data.data.level < 20) {
                  cc.vv.message.showMessage("\u5347\u9636\u9700\u8981\u7b49\u7ea7\u5347\u523020\u6ee1\u7ea7", 1);
                  return;
                }
                if (+data.data.class >= 8) {
                  cc.vv.message.showMessage("\u60a8\u5df2\u5347\u5230\u6ee1\u9636", 1);
                  return;
                }
                var reduceXianyuan = 0;
                data.data.class >= 3 && (reduceXianyuan = 500);
                if (cc.vv.userData.gemstone < reduceXianyuan) {
                  cc.vv.message.showMessage("\u5347\u9636\u9700\u8981\u94bb\u77f3" + reduceXianyuan + "\uff0c\u8bf7\u5145\u503c", 1);
                  return;
                }
                cc.vv.http.sendPostRequest("/updateGemstone", {
                  account: userInfo.account,
                  gemstone: +cc.vv.userData.gemstone - reduceXianyuan
                }).then(function(res) {
                  cc.vv.userData.gemstone = +cc.vv.userData.gemstone - reduceXianyuan;
                  cc.vv.http.sendPostRequest("/transportUpclass", {
                    account: userInfo.account,
                    id: data.data.id
                  }).then(function(res) {
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
  userbattle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a198bDO07pAcYTBo1+6xh4l", "userbattle");
    "use strict";
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
      onLoad: function onLoad() {
        this.myTeamList = cc.vv.myTeamList || [];
        this.attackUser = cc.vv.attackUser || {};
        for (var i = 0; i < this.myTeamList.length; i++) {
          this["battleObjBottom" + (i + 1)].active = true;
          this["selfName" + (i + 1)].string = this.myTeamList[i].name;
        }
        this.otherName.string = this.attackUser.name;
        var myTeamList = this.myTeamList;
        this.barSelfBlood1 = this.BarSelfBlood1.getComponent(cc.ProgressBar);
        this.barSelfSpeed1 = this.BarSelfSpeed1.getComponent(cc.ProgressBar);
        this.barSelfBlood2 = this.BarSelfBlood2.getComponent(cc.ProgressBar);
        this.barSelfSpeed2 = this.BarSelfSpeed2.getComponent(cc.ProgressBar);
        this.barSelfBlood3 = this.BarSelfBlood3.getComponent(cc.ProgressBar);
        this.barSelfSpeed3 = this.BarSelfSpeed3.getComponent(cc.ProgressBar);
        for (var _i = 0; _i < myTeamList.length; _i++) {
          this["totalBloodCount" + (_i + 1)] = myTeamList[_i].totalBloodCount;
          this["currentBloodCount" + (_i + 1)] = myTeamList[_i].currentBloodCount;
          this["totalSpeedCount" + (_i + 1)] = myTeamList[_i].totalSpeedCount;
          this["currentSpeedCount" + (_i + 1)] = myTeamList[_i].currentSpeedCount;
        }
        this.barOtherBlood = this.BarOtherBlood.getComponent(cc.ProgressBar);
        this.barOtherSpeed = this.BarOtherSpeed.getComponent(cc.ProgressBar);
        this.otherBloodTotalCount = this.attackUser.totalBloodCount;
        this.otherBloodCurrentCount = this.attackUser.currentBloodCount;
        this.otherSpeedTotalCount = this.attackUser.totalSpeedCount;
        this.otherSpeedCurrentCount = this.attackUser.currentSpeedCount;
      },
      update: function update(dt) {
        for (var i = 0; i < this.myTeamList.length; i++) if (this["currentBloodCount" + (i + 1)] > 0 && !this.forbidOtherSpeedFlag) {
          this["currentSpeedCount" + (i + 1)] = +this["currentSpeedCount" + (i + 1)] - dt;
          this["barSelfSpeed" + (i + 1)].progress = this["currentSpeedCount" + (i + 1)] / this["totalSpeedCount" + (i + 1)];
          if (this["currentSpeedCount" + (i + 1)] <= 0) {
            this["currentSpeedCount" + (i + 1)] = this["totalSpeedCount" + (i + 1)];
            if (this.otherBloodCurrentCount > 0) this.otherBloodCurrentCount = this.otherBloodCurrentCount - this.myTeamList[i].attack; else {
              this.forbidOtherSpeedFlag = true;
              cc.vv.userBattleType = 1;
              cc.director.loadScene("activity");
            }
          }
        }
        this.forbidOtherSpeedFlag || (this.otherSpeedCurrentCount = this.otherSpeedCurrentCount - dt);
        if (this.otherSpeedCurrentCount <= 0) {
          this.otherSpeedCurrentCount = 1;
          if (this["currentBloodCount1"] > 0) {
            this["currentBloodCount1"] = this["currentBloodCount1"] - this.attackUser.attack;
            this["barSelfBlood1"].progress = this["currentBloodCount1"] / this["totalBloodCount1"];
          } else if (this["currentBloodCount2"] > 0) {
            this["currentSpeedCount1"] = 0;
            this["barSelfSpeed1"].progress = -1;
            this["currentBloodCount2"] = this["currentBloodCount2"] - this.attackUser.attack;
            this["barSelfBlood2"].progress = this["currentBloodCount2"] / this["totalBloodCount2"];
          } else if (this["currentBloodCount3"] > 0) {
            this["currentBloodCount3"] = this["currentBloodCount3"] - this.attackUser.attack;
            this["barSelfBlood3"].progress = this["currentBloodCount3"] / this["totalBloodCount3"];
          } else cc.director.loadScene("activity");
        }
        this.barOtherBlood.progress = this.otherBloodCurrentCount / this.otherBloodTotalCount;
        this.barOtherSpeed.progress = this.otherSpeedCurrentCount / this.otherSpeedTotalCount;
      }
    });
    cc._RF.pop();
  }, {} ],
  viewSelf: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "826165vwpFAda+73OwoiDm0", "viewSelf");
    "use strict";
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
      changeTab: function changeTab(event, customEventData) {
        if ("equipment" === customEventData) {
          this.equipment.active = true;
          this.property.active = false;
          this.lianqifang.active = false;
        }
        if ("property" === customEventData) {
          this.equipment.active = false;
          this.property.active = true;
          this.lianqifang.active = false;
        }
        if ("lianqifang" === customEventData) {
          this.equipment.active = false;
          this.property.active = false;
          this.lianqifang.active = true;
        }
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        this.reloadPage(userInfo);
      },
      onLoad: function onLoad() {
        cc.vv.tipsNum = 0;
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        self.operateFlag = false;
        self.getPropertyUserInfo();
        self.reloadPage(userInfo);
        this.myLevel.string = this.dealLevel(cc.vv.userData.level);
      },
      upLevel: function upLevel(event, customEventData) {
        var self = this;
        var type = +customEventData;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        if (self.operateFlag) return;
        self.operateFlag = true;
        cc.vv.http.sendPostRequest("/upLevelEquipment", {
          account: userInfo.account,
          type: type
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            cc.vv.message.showMessage("\u5347\u7ea7\u6210\u529f", 0);
            self.reloadPage(userInfo);
          } else cc.vv.message.showMessage(res.message, 1);
          self.operateFlag = false;
        }, function() {
          cc.vv.message.showMessage("\u5347\u7ea7\u5931\u8d25", 1);
          self.operateFlag = false;
        });
      },
      upClass: function upClass(event, customEventData) {
        var self = this;
        var type = +customEventData;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        if (self.operateFlag) return;
        self.operateFlag = true;
        cc.vv.http.sendPostRequest("/upClassEquipment", {
          account: userInfo.account,
          type: type
        }).then(function(res) {
          self.operateFlag = false;
          res = JSON.parse(res);
          if (200 !== res.code) {
            cc.vv.message.showMessage(res.message, 1);
            self.operateFlag = false;
          } else {
            cc.vv.message.showMessage("\u5347\u9636\u6210\u529f", 0);
            self.reloadPage(userInfo);
            self.operateFlag = false;
          }
        }, function() {
          cc.vv.message.showMessage("\u5347\u9636\u5931\u8d25", 1);
          self.operateFlag = false;
        });
      },
      reloadPage: function reloadPage(userInfo) {
        var self = this;
        this.operateFlag = false;
        if (this.equipment.active) {
          var equipChild = this.equipment.getChildren()[0];
          var equipItems = equipChild.getChildren()[1].getChildren()[0].getChildren();
          cc.vv.http.sendGetRequest("/getEquipmentList", {
            account: userInfo.account
          }).then(function(res) {
            res = JSON.parse(res);
            var equipmentList = res.data || [];
            for (var i = 0; i < equipmentList.length; i++) {
              var classLevelStr = {
                1: "\u9ed1\u94c1",
                2: "\u9752\u94dc",
                3: "\u767d\u94f6",
                4: "\u9ec4\u91d1",
                5: "\u94c2\u91d1",
                6: "\u7d2b\u91d1",
                7: "\u94bb\u77f3",
                8: "\u9ed1\u94bb",
                9: "\u738b\u8005",
                10: "\u4f20\u5947"
              };
              switch (equipmentList[i].type) {
               case 1:
                equipItems[0].getChildren()[1].getComponent("cc.Label").string = (classLevelStr[equipmentList[i].class] || "\u81f3\u5c0a") + " - \u5251";
                equipItems[0].getChildren()[2].getComponent("cc.Label").string = "(+" + equipmentList[i].level + ")";
                equipItems[0].getChildren()[4].getComponent("cc.Label").string = +equipmentList[i].strength + +equipmentList[i].level + 10 * +equipmentList[i].class;
                break;

               case 2:
                equipItems[1].getChildren()[1].getComponent("cc.Label").string = (classLevelStr[equipmentList[i].class] || "\u81f3\u5c0a") + " - \u8863";
                equipItems[1].getChildren()[2].getComponent("cc.Label").string = "(+" + equipmentList[i].level + ")";
                equipItems[1].getChildren()[4].getComponent("cc.Label").string = +equipmentList[i].gengu + +equipmentList[i].level + 10 * +equipmentList[i].class;
                break;

               case 3:
                equipItems[2].getChildren()[1].getComponent("cc.Label").string = (classLevelStr[equipmentList[i].class] || "\u81f3\u5c0a") + " - \u76d4";
                equipItems[2].getChildren()[2].getComponent("cc.Label").string = "(+" + equipmentList[i].level + ")";
                equipItems[2].getChildren()[4].getComponent("cc.Label").string = +equipmentList[i].tizhi + +equipmentList[i].level + 10 * +equipmentList[i].class;
                break;

               case 4:
                equipItems[3].getChildren()[1].getComponent("cc.Label").string = (classLevelStr[equipmentList[i].class] || "\u81f3\u5c0a") + " - \u978b";
                equipItems[3].getChildren()[2].getComponent("cc.Label").string = "(+" + equipmentList[i].level + ")";
                equipItems[3].getChildren()[4].getComponent("cc.Label").string = +equipmentList[i].speed + +equipmentList[i].level + 10 * +equipmentList[i].class;
                break;

               case 5:
                equipItems[4].getChildren()[1].getComponent("cc.Label").string = (classLevelStr[equipmentList[i].class] || "\u81f3\u5c0a") + " - \u6212";
                equipItems[4].getChildren()[2].getComponent("cc.Label").string = "(+" + equipmentList[i].level + ")";
                equipItems[4].getChildren()[4].getComponent("cc.Label").string = +equipmentList[i].baoji + +equipmentList[i].level + 10 * +equipmentList[i].class;
              }
            }
          }, function() {
            cc.vv.message.showMessage("\u67e5\u8be2\u6cd5\u5b9d\u5931\u8d25", 1);
          });
        }
        if (this.property.active) {
          var propertyChild = this.property.getChildren();
          cc.vv.http.sendGetRequest("/getUserPropertyInfo", {
            account: userInfo.account
          }).then(function(res) {
            res = JSON.parse(res);
            if (200 === res.code) {
              propertyChild[0].getChildren()[0].getComponent("cc.Label").string = 5 * res.data.strength;
              propertyChild[1].getChildren()[0].getComponent("cc.Label").string = 5 * res.data.gengu;
              propertyChild[2].getChildren()[0].getComponent("cc.Label").string = 10 * res.data.tizhi;
              propertyChild[3].getChildren()[0].getComponent("cc.Label").string = 2 * res.data.speed;
              propertyChild[4].getChildren()[0].getComponent("cc.Label").string = 2 * res.data.baoji;
            } else cc.vv.message.showMessage("\u67e5\u8be2\u5c5e\u6027\u5931\u8d25", 1);
          }, function() {
            cc.vv.message.showMessage("\u67e5\u8be2\u5c5e\u6027\u5931\u8d25", 1);
          });
        }
        this.lianqifang.active && (this.strongStoneClip.string = cc.vv.userData.strongstoneclip);
      },
      dealLevel: function dealLevel(level) {
        var str = "";
        switch (parseInt(level / 10) + 1) {
         case 1:
          str = "\u51e1\u4eba\u5883";
          break;

         case 2:
          str = "\u661f\u8fb0\u5883";
          break;

         case 3:
          str = "\u8d85\u51e1\u5883";
          break;

         case 4:
          str = "\u795e\u7075\u5883";
          break;

         case 5:
          str = "\u754c\u795e\u5883";
          break;

         case 6:
          str = "\u771f\u795e\u5883";
          break;

         case 7:
          str = "\u865a\u7a7a\u5883";
          break;

         case 8:
          str = "\u5408\u4e00\u5883";
          break;

         case 9:
          str = "\u6df7\u6c8c\u5883";
          break;

         case 10:
          str = "\u6d51\u6e90\u5883";
          break;

         case 11:
          str = "\u5723\u4eba\u5883";
          break;

         case 12:
          str = "\u8d85\u5723\u5883";
          break;

         case 13:
          str = "\u6d51\u6e90\u751f\u547d";
          break;

         default:
          str = "\u51e1\u4eba\u5883";
        }
        switch (level % 10) {
         case 0:
          str += "\u5341\u9636";
          break;

         case 1:
          str += "\u4e00\u9636";
          break;

         case 2:
          str += "\u4e8c\u9636";
          break;

         case 3:
          str += "\u4e09\u9636";
          break;

         case 4:
          str += "\u56db\u9636";
          break;

         case 5:
          str += "\u4e94\u9636";
          break;

         case 6:
          str += "\u516d\u9636";
          break;

         case 7:
          str += "\u4e03\u9636";
          break;

         case 8:
          str += "\u516b\u9636";
          break;

         case 9:
          str += "\u4e5d\u9636";
        }
        return str;
      },
      getPropertyUserInfo: function getPropertyUserInfo() {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        var self = this;
        cc.vv.http.sendGetRequest("/getUserPropertyInfo", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            var myBattle = 5 * res.data.strength + 5 * res.data.gengu + 10 * res.data.tizhi + 2 * res.data.speed + 2 * res.data.baoji;
            self.myBattle.string = "\u6218\u529b: " + myBattle;
          } else cc.vv.message.showMessage("\u67e5\u8be2\u5c5e\u6027\u5931\u8d25", 1);
        }, function() {
          cc.vv.message.showMessage("\u67e5\u8be2\u5c5e\u6027\u5931\u8d25", 1);
        });
      },
      createThings: function createThings(event, type) {
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        var self = this;
        if (self.operateFlag) return;
        self.operateFlag = true;
        cc.vv.http.sendPostRequest("/createLianqifang", {
          account: userInfo.account,
          type: +type
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            self.operateFlag = false;
            cc.vv.message.showMessage(res.message, 0);
            self.reloadPage(userInfo);
          } else {
            cc.vv.message.showMessage(res.message, 1);
            self.operateFlag = false;
          }
        }, function() {
          cc.vv.message.showMessage("\u5408\u6210\u5931\u8d25", 1);
          self.operateFlag = false;
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  welcome: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5d9c4HEH39FgZAN836tcgEA", "welcome");
    "use strict";
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
      onLoad: function onLoad() {
        this.welcomeTip.node.opacity = 0;
        this.startButton.node.active = false;
      },
      update: function update(dt) {
        this.welcomeTip.node.opacity < 255 ? this.welcomeTip.node.opacity = this.welcomeTip.node.opacity + 40 * dt : this.startButton.node.active = true;
      },
      goToCity: function goToCity() {
        cc.director.loadScene("city");
      }
    });
    cc._RF.pop();
  }, {} ],
  wujinshilian: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6fc73ZFYqhH+J4c/nO5o/Ph", "wujinshilian");
    "use strict";
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
      onLoad: function onLoad() {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        this.barSelfSpeed = this.BarSelfSpeed.getComponent(cc.ProgressBar);
        self.finishFlag = false;
        cc.vv.http.sendGetRequest("/getUserInfoDetail", {
          account: userInfo.account
        }).then(function(res) {
          res = JSON.parse(res);
          if (200 === res.code) {
            self.userInfoDetail = res.data || {};
            self.battle = +self.userInfoDetail.battle;
            self.secondTimes = parseInt(self.battle / 100);
            self.selfSpeedTotalCount = self.secondTimes;
            self.selfSpeedCurrentCount = self.secondTimes;
          } else cc.vv.message.showMessage(res.message, 1);
        }, function() {
          cc.vv.message.showMessage("\u83b7\u53d6\u7528\u6237\u4fe1\u606f\u5931\u8d25", 1);
        });
      },
      update: function update(dt) {
        var self = this;
        var userInfo = JSON.parse(cc.sys.localStorage.getItem("jakiiAccountInfo"));
        if (this.selfSpeedCurrentCount <= 0) {
          if (self.finishFlag) return;
          self.finishFlag = true;
          cc.vv.http.sendPostRequest("/finishWujinshilian", {
            gold: 100 * self.secondTimes,
            strongstoneclip: 5 * self.secondTimes,
            account: userInfo.account
          }).then(function(res) {
            res = JSON.parse(res);
            var message = "\u83b7\u5f97" + 100 * self.secondTimes + "\u4e2a\u91d1\u5e01," + 5 * self.secondTimes + "\u4e2a\u5f3a\u5316\u77f3\u788e\u7247";
            cc.vv.message.showMessage(message, 0);
            setTimeout(function() {
              cc.director.loadScene("activity");
            }, 500);
          }, function() {
            cc.director.loadScene("activity");
            self.finishFlag = true;
          });
        } else {
          this.selfSpeedCurrentCount = this.selfSpeedCurrentCount - dt;
          this.level.string = (self.secondTimes || 400) - parseInt(this.selfSpeedCurrentCount);
          this.barSelfSpeed.progress = this.selfSpeedCurrentCount / this.selfSpeedTotalCount;
        }
      }
    });
    cc._RF.pop();
  }, {} ]
}, {}, [ "activity", "bag", "battle", "battleLevelSelect", "bottom2", "city", "cityBottom", "equip", "equipDetail", "equipList", "goTowar", "market", "rank", "resource", "settings", "trade", "userbattle", "viewSelf", "wujinshilian", "EquipmentTemplate", "ItemRankTemplate", "ItemTemplate", "messageTip", "initParams", "loading", "progress", "loginGame", "welcome", "HTTP" ]);
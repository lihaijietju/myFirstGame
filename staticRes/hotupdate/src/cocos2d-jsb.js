(function(t, e, i) {
function n(i, r) {
var s = e[i];
if (!s) {
var o = t[i];
if (!o) return;
var a = {};
s = e[i] = {
exports: a
};
o[0]((function(t) {
return n(o[1][t] || t);
}), s, a);
}
return s.exports;
}
for (var r = 0; r < i.length; r++) n(i[r]);
})({
1: [ (function(t, e, i) {
"use strict";
var n = t("../core/event/event-target"), r = t("../core/platform/CCSys"), s = t("../core/assets/CCAudioClip").LoadMode, o = !1, a = [], c = function t(e) {
n.call(this);
this._src = e;
this._element = null;
this.id = 0;
this._volume = 1;
this._loop = !1;
this._nextTime = 0;
this._state = t.State.INITIALZING;
this._onended = function() {
this._state = t.State.STOPPED;
this.emit("ended");
}.bind(this);
};
cc.js.extend(c, n);
c.State = {
ERROR: -1,
INITIALZING: 0,
PLAYING: 1,
PAUSED: 2,
STOPPED: 3
};
(function(t) {
t._bindEnded = function(t) {
t = t || this._onended;
var e = this._element;
this._src && e instanceof HTMLAudioElement ? e.addEventListener("ended", t) : e.onended = t;
};
t._unbindEnded = function() {
var t = this._element;
t instanceof HTMLAudioElement ? t.removeEventListener("ended", this._onended) : t && (t.onended = null);
};
t._onLoaded = function() {
this._createElement();
this.setVolume(this._volume);
this.setLoop(this._loop);
0 !== this._nextTime && this.setCurrentTime(this._nextTime);
this.getState() === c.State.PLAYING ? this.play() : this._state = c.State.INITIALZING;
};
t._createElement = function() {
var t = this._src._nativeAsset;
if (t instanceof HTMLAudioElement) {
this._element || (this._element = document.createElement("audio"));
this._element.src = t.src;
} else this._element = new u(t, this);
};
t.play = function() {
this._state = c.State.PLAYING;
if (this._element) {
this._bindEnded();
this._element.play();
this._touchToPlay();
}
};
t._touchToPlay = function() {
this._src && this._src.loadMode === s.DOM_AUDIO && this._element.paused && a.push({
instance: this,
offset: 0,
audio: this._element
});
if (!o) {
o = !0;
var t = "ontouchend" in window ? "touchend" : "mousedown";
cc.game.canvas.addEventListener(t, (function() {
for (var t = void 0; t = a.pop(); ) t.audio.play(t.offset);
}));
}
};
t.destroy = function() {
this._element = null;
};
t.pause = function() {
if (this._element && this.getState() === c.State.PLAYING) {
this._unbindEnded();
this._element.pause();
this._state = c.State.PAUSED;
}
};
t.resume = function() {
if (this._element && this.getState() === c.State.PAUSED) {
this._bindEnded();
this._element.play();
this._state = c.State.PLAYING;
}
};
t.stop = function() {
if (this._element) {
this._element.pause();
try {
this._element.currentTime = 0;
} catch (t) {}
for (var t = 0; t < a.length; t++) if (a[t].instance === this) {
a.splice(t, 1);
break;
}
this._unbindEnded();
this.emit("stop");
this._state = c.State.STOPPED;
}
};
t.setLoop = function(t) {
this._loop = t;
this._element && (this._element.loop = t);
};
t.getLoop = function() {
return this._loop;
};
t.setVolume = function(t) {
this._volume = t;
this._element && (this._element.volume = t);
};
t.getVolume = function() {
return this._volume;
};
t.setCurrentTime = function(t) {
if (this._element) {
this._nextTime = 0;
this._unbindEnded();
this._bindEnded(function() {
this._bindEnded();
}.bind(this));
try {
this._element.currentTime = t;
} catch (i) {
var e = this._element;
if (e.addEventListener) {
e.addEventListener("loadedmetadata", (function i() {
e.removeEventListener("loadedmetadata", i);
e.currentTime = t;
}));
}
}
} else this._nextTime = t;
};
t.getCurrentTime = function() {
return this._element ? this._element.currentTime : 0;
};
t.getDuration = function() {
return this._element ? this._element.duration : 0;
};
t.getState = function() {
this._forceUpdatingState();
return this._state;
};
t._forceUpdatingState = function() {
var t = this._element;
t && (c.State.PLAYING === this._state && t.paused ? this._state = c.State.STOPPED : c.State.STOPPED !== this._state || t.paused || (this._state = c.State.PLAYING));
};
Object.defineProperty(t, "src", {
get: function() {
return this._src;
},
set: function(t) {
this._unbindEnded();
if (t) {
this._src = t;
if (t.loaded) this._onLoaded(); else {
var e = this;
t.once("load", (function() {
t === e._src && e._onLoaded();
}));
cc.loader.load({
url: t.nativeUrl,
skips: [ "Loader" ]
}, (function(e, i) {
e ? cc.error(e) : t.loaded || (t._nativeAsset = i);
}));
}
} else {
this._src = null;
this._element instanceof HTMLAudioElement ? this._element.src = "" : this._element = null;
this._state = c.State.INITIALZING;
}
return t;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(t, "paused", {
get: function() {
return !this._element || this._element.paused;
},
enumerable: !0,
configurable: !0
});
})(c.prototype);
var l = void 0;
l = cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE || cc.sys.browserType === cc.sys.BROWSER_TYPE_BAIDU || cc.sys.browserType === cc.sys.BROWSER_TYPE_UC ? .01 : 0;
var u = function(t, e) {
this._audio = e;
this._context = r.__audioSupport.context;
this._buffer = t;
this._gainObj = this._context.createGain();
this.volume = 1;
this._gainObj.connect(this._context.destination);
this._loop = !1;
this._startTime = -1;
this._currentSource = null;
this.playedLength = 0;
this._currentTimer = null;
this._endCallback = function() {
this.onended && this.onended(this);
}.bind(this);
};
(function(t) {
t.play = function(t) {
if (this._currentSource && !this.paused) {
this._currentSource.onended = null;
this._currentSource.stop(0);
this.playedLength = 0;
}
var e = this._context.createBufferSource();
e.buffer = this._buffer;
e.connect(this._gainObj);
e.loop = this._loop;
this._startTime = this._context.currentTime;
(t = t || this.playedLength) && (this._startTime -= t);
var i = this._buffer.duration, n = t, r = void 0;
if (this._loop) e.start ? e.start(0, n) : e.notoGrainOn ? e.noteGrainOn(0, n) : e.noteOn(0, n); else {
r = i - t;
e.start ? e.start(0, n, r) : e.noteGrainOn ? e.noteGrainOn(0, n, r) : e.noteOn(0, n, r);
}
this._currentSource = e;
e.onended = this._endCallback;
if ((!e.context.state || "suspended" === e.context.state) && 0 === this._context.currentTime) {
var s = this;
clearTimeout(this._currentTimer);
this._currentTimer = setTimeout((function() {
0 === s._context.currentTime && a.push({
instance: s._audio,
offset: t,
audio: s
});
}), 10);
}
};
t.pause = function() {
clearTimeout(this._currentTimer);
if (!this.paused) {
this.playedLength = this._context.currentTime - this._startTime;
this.playedLength %= this._buffer.duration;
var t = this._currentSource;
this._currentSource = null;
this._startTime = -1;
t && t.stop(0);
}
};
Object.defineProperty(t, "paused", {
get: function() {
return (!this._currentSource || !this._currentSource.loop) && (-1 === this._startTime || this._context.currentTime - this._startTime > this._buffer.duration);
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(t, "loop", {
get: function() {
return this._loop;
},
set: function(t) {
this._currentSource && (this._currentSource.loop = t);
return this._loop = t;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(t, "volume", {
get: function() {
return this._volume;
},
set: function(t) {
this._volume = t;
if (this._gainObj.gain.setTargetAtTime) try {
this._gainObj.gain.setTargetAtTime(t, this._context.currentTime, l);
} catch (e) {
this._gainObj.gain.setTargetAtTime(t, this._context.currentTime, .01);
} else this._gainObj.gain.value = t;
if (r.os === r.OS_IOS && !this.paused && this._currentSource) {
this._currentSource.onended = null;
this.pause();
this.play();
}
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(t, "currentTime", {
get: function() {
if (this.paused) return this.playedLength;
this.playedLength = this._context.currentTime - this._startTime;
this.playedLength %= this._buffer.duration;
return this.playedLength;
},
set: function(t) {
if (this.paused) this.playedLength = t; else {
this.pause();
this.playedLength = t;
this.play();
}
return t;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(t, "duration", {
get: function() {
return this._buffer.duration;
},
enumerable: !0,
configurable: !0
});
})(u.prototype);
e.exports = cc.Audio = c;
}), {
"../core/assets/CCAudioClip": 12,
"../core/event/event-target": 77,
"../core/platform/CCSys": 119
} ],
2: [ (function(t, e, i) {
"use strict";
var n = t("./CCAudio"), r = t("../core/assets/CCAudioClip"), s = cc.js, o = 0, a = s.createMap(!0), c = {}, l = [], u = function(t) {
t._finishCallback = null;
t.off("ended");
t.off("stop");
t.src = null;
l.includes(t) || (l.length < 32 ? l.push(t) : t.destroy());
}, h = function(t) {
var e = o++, i = c[t];
i || (i = c[t] = []);
if (_._maxAudioInstance <= i.length) {
var r = i.shift();
f(r).stop();
}
var s = l.pop() || new n(), h = function() {
if (f(this.id)) {
delete a[this.id];
var t = i.indexOf(this.id);
cc.js.array.fastRemoveAt(i, t);
}
u(this);
};
s.on("ended", (function() {
this._finishCallback && this._finishCallback();
h.call(this);
}), s);
s.on("stop", h, s);
s.id = e;
a[e] = s;
i.push(e);
return s;
}, f = function(t) {
return a[t];
}, d = function(t) {
void 0 === t ? t = 1 : "string" == typeof t && (t = Number.parseFloat(t));
return t;
}, _ = {
AudioState: n.State,
_maxWebAudioSize: 2097152,
_maxAudioInstance: 24,
_id2audio: a,
play: function(t, e, i) {
var n, s = t;
if ("string" == typeof t) {
cc.warnID(8401, "cc.audioEngine", "cc.AudioClip", "AudioClip", "cc.AudioClip", "audio");
n = h(s = t);
r._loadByUrl(s, (function(t, e) {
e && (n.src = e);
}));
} else {
if (!t) return;
s = t.nativeUrl;
(n = h(s)).src = t;
}
n.setLoop(e || !1);
i = d(i);
n.setVolume(i);
n.play();
return n.id;
},
setLoop: function(t, e) {
var i = f(t);
i && i.setLoop && i.setLoop(e);
},
isLoop: function(t) {
var e = f(t);
return !(!e || !e.getLoop) && e.getLoop();
},
setVolume: function(t, e) {
var i = f(t);
i && i.setVolume(e);
},
getVolume: function(t) {
var e = f(t);
return e ? e.getVolume() : 1;
},
setCurrentTime: function(t, e) {
var i = f(t);
if (i) {
i.setCurrentTime(e);
return !0;
}
return !1;
},
getCurrentTime: function(t) {
var e = f(t);
return e ? e.getCurrentTime() : 0;
},
getDuration: function(t) {
var e = f(t);
return e ? e.getDuration() : 0;
},
getState: function(t) {
var e = f(t);
return e ? e.getState() : this.AudioState.ERROR;
},
setFinishCallback: function(t, e) {
var i = f(t);
i && (i._finishCallback = e);
},
pause: function(t) {
var e = f(t);
if (e) {
e.pause();
return !0;
}
return !1;
},
_pauseIDCache: [],
pauseAll: function() {
for (var t in a) {
var e = a[t];
if (e.getState() === n.State.PLAYING) {
this._pauseIDCache.push(t);
e.pause();
}
}
},
resume: function(t) {
var e = f(t);
e && e.resume();
},
resumeAll: function() {
for (var t = 0; t < this._pauseIDCache.length; ++t) {
var e = this._pauseIDCache[t], i = f(e);
i && i.resume();
}
this._pauseIDCache.length = 0;
},
stop: function(t) {
var e = f(t);
if (e) {
e.stop();
return !0;
}
return !1;
},
stopAll: function() {
for (var t in a) {
var e = a[t];
e && e.stop();
}
},
setMaxAudioInstance: function(t) {
this._maxAudioInstance = t;
},
getMaxAudioInstance: function() {
return this._maxAudioInstance;
},
uncache: function(t) {
var e = t;
if ("string" == typeof t) {
cc.warnID(8401, "cc.audioEngine", "cc.AudioClip", "AudioClip", "cc.AudioClip", "audio");
e = t;
} else {
if (!t) return;
e = t.nativeUrl;
}
var i = c[e];
if (i) for (;i.length > 0; ) {
var n = i.pop(), r = a[n];
if (r) {
r.stop();
delete a[n];
}
}
},
uncacheAll: function() {
this.stopAll();
var t = void 0;
for (var e in a) (t = a[e]) && t.destroy();
for (;t = l.pop(); ) t.destroy();
a = s.createMap(!0);
c = {};
},
getProfile: function(t) {},
preload: function(t, e) {
0;
cc.loader.load(t, e && function(t) {
t || e();
});
},
setMaxWebAudioSize: function(t) {
this._maxWebAudioSize = 1024 * t;
},
_breakCache: null,
_break: function() {
this._breakCache = [];
for (var t in a) {
var e = a[t];
if (e.getState() === n.State.PLAYING) {
this._breakCache.push(t);
e.pause();
}
}
},
_restore: function() {
if (this._breakCache) {
for (;this._breakCache.length > 0; ) {
var t = this._breakCache.pop(), e = f(t);
e && e.resume && e.resume();
}
this._breakCache = null;
}
},
_music: {
id: -1,
loop: !1,
volume: 1
},
_effect: {
volume: 1,
pauseCache: []
},
playMusic: function(t, e) {
var i = this._music;
this.stop(i.id);
i.id = this.play(t, e, i.volume);
i.loop = e;
return i.id;
},
stopMusic: function() {
this.stop(this._music.id);
},
pauseMusic: function() {
this.pause(this._music.id);
return this._music.id;
},
resumeMusic: function() {
this.resume(this._music.id);
return this._music.id;
},
getMusicVolume: function() {
return this._music.volume;
},
setMusicVolume: function(t) {
t = d(t);
var e = this._music;
e.volume = t;
this.setVolume(e.id, e.volume);
return e.volume;
},
isMusicPlaying: function() {
return this.getState(this._music.id) === this.AudioState.PLAYING;
},
playEffect: function(t, e) {
return this.play(t, e || !1, this._effect.volume);
},
setEffectsVolume: function(t) {
t = d(t);
var e = this._music.id;
this._effect.volume = t;
for (var i in a) {
var n = a[i];
n && n.id !== e && _.setVolume(i, t);
}
},
getEffectsVolume: function() {
return this._effect.volume;
},
pauseEffect: function(t) {
return this.pause(t);
},
pauseAllEffects: function() {
var t = this._music.id, e = this._effect;
e.pauseCache.length = 0;
for (var i in a) {
var n = a[i];
if (n && n.id !== t) {
if (n.getState() === this.AudioState.PLAYING) {
e.pauseCache.push(i);
n.pause();
}
}
}
},
resumeEffect: function(t) {
this.resume(t);
},
resumeAllEffects: function() {
for (var t = this._effect.pauseCache, e = 0; e < t.length; ++e) {
var i = t[e], n = a[i];
n && n.resume();
}
},
stopEffect: function(t) {
return this.stop(t);
},
stopAllEffects: function() {
var t = this._music.id;
for (var e in a) {
var i = a[e];
if (i && i.id !== t) {
i.getState() === _.AudioState.PLAYING && i.stop();
}
}
}
};
e.exports = cc.audioEngine = _;
}), {
"../core/assets/CCAudioClip": 12,
"./CCAudio": 1
} ],
3: [ (function(t, e, i) {
"use strict";
var n = t("../vmath"), r = t("../CCNode"), s = r.EventType, o = r._LocalDirtyFlag, a = t("../renderer/render-flow"), c = Math.PI / 180, l = 1, u = 2;
function h() {
if (this._localMatDirty) {
var t = this._matrix, e = t.m;
n.mat4.fromTRSArray(t, this._trs);
if (this._skewX || this._skewY) {
var i = e[0], r = e[1], s = e[4], o = e[5], a = Math.tan(this._skewX * c), l = Math.tan(this._skewY * c);
Infinity === a && (a = 99999999);
Infinity === l && (l = 99999999);
e[0] = i + s * l;
e[1] = r + o * l;
e[4] = s + i * a;
e[5] = o + r * a;
}
this._localMatDirty = 0;
this._worldMatDirty = !0;
}
}
function f() {
this._localMatDirty && this._updateLocalMatrix();
if (this._parent) {
var t = this._parent._worldMatrix;
n.mat4.mul(this._worldMatrix, t, this._matrix);
} else n.mat4.copy(this._worldMatrix, this._matrix);
this._worldMatDirty = !1;
}
function d(t, e, i) {
var n = void 0;
if (void 0 === e) {
n = t.x;
e = t.y;
i = t.z || 0;
} else {
n = t;
i = i || 0;
}
var r = this._trs;
if (r[0] !== n || r[1] !== e || r[2] !== i) {
r[0] = n;
r[1] = e;
r[2] = i;
this.setLocalDirty(o.POSITION);
this._eventMask & l && this.emit(s.POSITION_CHANGED);
}
}
var _ = cc.Node.prototype, p = _._updateLocalMatrix, v = _._calculWorldMatrix, g = _._upgrade_1x_to_2x, m = _._mulMat;
_.setPosition = d;
_.setScale = function(t, e, i) {
if (t && "number" != typeof t) {
e = t.y;
i = void 0 === t.z ? 1 : t.z;
t = t.x;
} else if (void 0 !== t && void 0 === e) {
e = t;
i = t;
} else void 0 === i && (i = 1);
var n = this._trs;
if (n[7] !== t || n[8] !== e || n[9] !== i) {
n[7] = t;
n[8] = e;
n[9] = i;
this.setLocalDirty(o.SCALE);
this._eventMask & u && this.emit(s.SCALE_CHANGED);
}
};
_._upgrade_1x_to_2x = function() {
this._is3DNode && this._update3DFunction();
g.call(this);
};
_._update3DFunction = function() {
if (this._is3DNode) {
this._updateLocalMatrix = h;
this._calculWorldMatrix = f;
this._mulMat = n.mat4.mul;
} else {
this._updateLocalMatrix = p;
this._calculWorldMatrix = v;
this._mulMat = m;
}
this._renderComponent && this._renderComponent._on3DNodeChanged && this._renderComponent._on3DNodeChanged();
this._renderFlag |= a.FLAG_TRANSFORM;
this._localMatDirty = o.ALL;
this._proxy.update3DNode();
};
cc.js.getset(_, "position", _.getPosition, d, !1, !0);
cc.js.getset(_, "is3DNode", (function() {
return this._is3DNode;
}), (function(t) {
this._is3DNode = t;
this._update3DFunction();
}));
cc.js.getset(_, "scaleZ", (function() {
return this._trs[9];
}), (function(t) {
if (this._trs[9] !== t) {
this._trs[9] = t;
this.setLocalDirty(o.SCALE);
this._eventMask & u && this.emit(s.SCALE_CHANGED);
}
}));
cc.js.getset(_, "z", (function() {
return this._trs[2];
}), (function(t) {
var e = this._trs;
if (t !== e[2]) {
e[2] = t;
this.setLocalDirty(o.POSITION);
this._eventMask & l && this.emit(s.POSITION_CHANGED);
}
}));
cc.js.getset(_, "eulerAngles", (function() {
return n.trs.toEuler(this._eulerAngles, this._trs);
}), (function(t) {
0;
n.trs.fromEuler(this._trs, t);
this.setLocalDirty(o.ROTATION);
}));
cc.js.getset(_, "quat", (function() {
var t = this._trs;
return cc.quat(t[3], t[4], t[5], t[6]);
}), _.setRotation);
}), {
"../CCNode": 7,
"../renderer/render-flow": 156,
"../vmath": 213
} ],
4: [ (function(t, e, i) {
"use strict";
var n = t("./platform/utils"), r = (t("../../DebugInfos"), "https://github.com/cocos-creator/engine/blob/master/EngineErrorMap.md"), s = void 0;
cc.log = cc.warn = cc.error = cc.assert = console.log.bind ? console.log.bind(console) : console.log;
cc._throw = function(t) {
n.callInNextTick((function() {
throw t;
}));
};
function o(t) {
return function() {
var e = arguments[0], i = t + " " + e + ", please go to " + r + "#" + e + " to see details.";
if (1 === arguments.length) return i;
if (2 === arguments.length) return i + " Arguments: " + arguments[1];
var n = cc.js.shiftArguments.apply(null, arguments);
return i + " Arguments: " + n.join(", ");
};
}
var a = o("Log");
cc.logID = function() {
cc.log(a.apply(null, arguments));
};
var c = o("Warning");
cc.warnID = function() {
cc.warn(c.apply(null, arguments));
};
var l = o("Error");
cc.errorID = function() {
cc.error(l.apply(null, arguments));
};
var u = o("Assert");
cc.assertID = function(t) {
t || cc.assert(!1, u.apply(null, cc.js.shiftArguments.apply(null, arguments)));
};
var h = cc.Enum({
NONE: 0,
INFO: 1,
WARN: 2,
ERROR: 3,
INFO_FOR_WEB_PAGE: 4,
WARN_FOR_WEB_PAGE: 5,
ERROR_FOR_WEB_PAGE: 6
});
e.exports = cc.debug = {
DebugMode: h,
_resetDebugSetting: function(t) {
cc.log = cc.warn = cc.error = cc.assert = function() {};
if (t !== h.NONE) {
if (t > h.ERROR) {
var e = function(t) {
if (cc.game.canvas) {
if (!s) {
var e = document.createElement("Div");
e.setAttribute("id", "logInfoDiv");
e.setAttribute("width", "200");
e.setAttribute("height", cc.game.canvas.height);
var i = e.style;
i.zIndex = "99999";
i.position = "absolute";
i.top = i.left = "0";
(s = document.createElement("textarea")).setAttribute("rows", "20");
s.setAttribute("cols", "30");
s.setAttribute("disabled", "true");
var n = s.style;
n.backgroundColor = "transparent";
n.borderBottom = "1px solid #cccccc";
n.borderTopWidth = n.borderLeftWidth = n.borderRightWidth = "0px";
n.borderTopStyle = n.borderLeftStyle = n.borderRightStyle = "none";
n.padding = "0px";
n.margin = 0;
e.appendChild(s);
cc.game.canvas.parentNode.appendChild(e);
}
s.value = s.value + t + "\r\n";
s.scrollTop = s.scrollHeight;
}
};
cc.error = function() {
e("ERROR :  " + cc.js.formatStr.apply(null, arguments));
};
cc.assert = function(t, i) {
if (!t && i) {
i = cc.js.formatStr.apply(null, cc.js.shiftArguments.apply(null, arguments));
e("ASSERT: " + i);
}
};
t !== h.ERROR_FOR_WEB_PAGE && (cc.warn = function() {
e("WARN :  " + cc.js.formatStr.apply(null, arguments));
});
t === h.INFO_FOR_WEB_PAGE && (cc.log = function() {
e(cc.js.formatStr.apply(null, arguments));
});
} else if (console && console.log.apply) {
console.error || (console.error = console.log);
console.warn || (console.warn = console.log);
console.error.bind ? cc.error = console.error.bind(console) : cc.error = console.error;
cc.assert = function(t, e) {
if (!t) {
e && (e = cc.js.formatStr.apply(null, cc.js.shiftArguments.apply(null, arguments)));
throw new Error(e);
}
};
}
t !== h.ERROR && (console.warn.bind ? cc.warn = console.warn.bind(console) : cc.warn = console.warn);
t === h.INFO && ("JavaScriptCore" === scriptEngineType ? cc.log = function() {
return console.log.apply(console, arguments);
} : cc.log = console.log);
}
},
getError: o("ERROR"),
isDisplayStats: function() {
return !!cc.profiler && cc.profiler.isShowingStats();
},
setDisplayStats: function(t) {
if (cc.profiler) {
t ? cc.profiler.showStats() : cc.profiler.hideStats();
cc.game.config.showFPS = !!t;
}
}
};
}), {
"../../DebugInfos": void 0,
"./platform/utils": 134
} ],
5: [ (function(t, e, i) {
"use strict";
var n = t("./event/event-target"), r = t("./load-pipeline/auto-release-utils"), s = t("./component-scheduler"), o = t("./node-activator"), a = t("./platform/CCObject"), c = t("./CCGame"), l = t("./renderer"), u = t("./event-manager"), h = t("./CCScheduler");
cc.Director = function() {
n.call(this);
this._paused = !1;
this._purgeDirectorInNextLoop = !1;
this._winSizeInPoints = null;
this._loadingScene = "";
this._scene = null;
this._totalFrames = 0;
this._lastUpdate = 0;
this._deltaTime = 0;
this._startTime = 0;
this._scheduler = null;
this._compScheduler = null;
this._nodeActivator = null;
this._actionManager = null;
var t = this;
c.on(c.EVENT_SHOW, (function() {
t._lastUpdate = performance.now();
}));
c.once(c.EVENT_ENGINE_INITED, this.init, this);
};
cc.Director.prototype = {
constructor: cc.Director,
init: function() {
this._totalFrames = 0;
this._lastUpdate = performance.now();
this._startTime = this._lastUpdate;
this._paused = !1;
this._purgeDirectorInNextLoop = !1;
this._winSizeInPoints = cc.size(0, 0);
this._scheduler = new h();
if (cc.ActionManager) {
this._actionManager = new cc.ActionManager();
this._scheduler.scheduleUpdate(this._actionManager, h.PRIORITY_SYSTEM, !1);
} else this._actionManager = null;
this.sharedInit();
return !0;
},
sharedInit: function() {
this._compScheduler = new s();
this._nodeActivator = new o();
u && u.setEnabled(!0);
if (cc.AnimationManager) {
this._animationManager = new cc.AnimationManager();
this._scheduler.scheduleUpdate(this._animationManager, h.PRIORITY_SYSTEM, !1);
} else this._animationManager = null;
if (cc.CollisionManager) {
this._collisionManager = new cc.CollisionManager();
this._scheduler.scheduleUpdate(this._collisionManager, h.PRIORITY_SYSTEM, !1);
} else this._collisionManager = null;
if (cc.PhysicsManager) {
this._physicsManager = new cc.PhysicsManager();
this._scheduler.scheduleUpdate(this._physicsManager, h.PRIORITY_SYSTEM, !1);
} else this._physicsManager = null;
cc._widgetManager && cc._widgetManager.init(this);
cc.loader.init(this);
},
calculateDeltaTime: function(t) {
t || (t = performance.now());
this._deltaTime = (t - this._lastUpdate) / 1e3;
0;
this._deltaTime < 0 ? this.calculateDeltaTime() : this._lastUpdate = t;
},
convertToGL: function(t) {
var e = c.container, i = cc.view, n = e.getBoundingClientRect(), r = n.left + window.pageXOffset - e.clientLeft, s = n.top + window.pageYOffset - e.clientTop, o = i._devicePixelRatio * (t.x - r), a = i._devicePixelRatio * (s + n.height - t.y);
return i._isRotated ? cc.v2(i._viewportRect.width - a, o) : cc.v2(o, a);
},
convertToUI: function(t) {
var e = c.container, i = cc.view, n = e.getBoundingClientRect(), r = n.left + window.pageXOffset - e.clientLeft, s = n.top + window.pageYOffset - e.clientTop, o = cc.v2(0, 0);
if (i._isRotated) {
o.x = r + t.y / i._devicePixelRatio;
o.y = s + n.height - (i._viewportRect.width - t.x) / i._devicePixelRatio;
} else {
o.x = r + t.x * i._devicePixelRatio;
o.y = s + n.height - t.y * i._devicePixelRatio;
}
return o;
},
end: function() {
this._purgeDirectorInNextLoop = !0;
},
getWinSize: function() {
return cc.size(cc.winSize);
},
getWinSizeInPixels: function() {
return cc.size(cc.winSize);
},
pause: function() {
this._paused || (this._paused = !0);
},
purgeCachedData: function() {
cc.loader.releaseAll();
},
purgeDirector: function() {
this._scheduler.unscheduleAll();
this._compScheduler.unscheduleAll();
this._nodeActivator.reset();
u && u.setEnabled(!1);
cc.isValid(this._scene) && this._scene.destroy();
this._scene = null;
cc.renderer.clear();
cc.AssetLibrary.resetBuiltins();
cc.game.pause();
cc.loader.releaseAll();
},
reset: function() {
this.purgeDirector();
u && u.setEnabled(!0);
this._actionManager && this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, !1);
this._animationManager && this._scheduler.scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, !1);
this._collisionManager && this._scheduler.scheduleUpdate(this._collisionManager, cc.Scheduler.PRIORITY_SYSTEM, !1);
this._physicsManager && this._scheduler.scheduleUpdate(this._physicsManager, cc.Scheduler.PRIORITY_SYSTEM, !1);
cc.game.resume();
},
runSceneImmediate: function(t, e, i) {
cc.assertID(t instanceof cc.Scene, 1216);
t._load();
for (var n = Object.keys(c._persistRootNodes).map((function(t) {
return c._persistRootNodes[t];
})), s = 0; s < n.length; s++) {
var o = n[s], l = t.getChildByUuid(o.uuid);
if (l) {
var u = l.getSiblingIndex();
l._destroyImmediate();
t.insertChild(o, u);
} else o.parent = t;
}
var h = this._scene, f = h && h.autoReleaseAssets && h.dependAssets;
r.autoRelease(f, t.dependAssets, n);
cc.isValid(h) && h.destroy();
this._scene = null;
a._deferredDestroy();
e && e();
this.emit(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, t);
this._scene = t;
t._activate();
cc.game.resume();
i && i(null, t);
this.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH, t);
},
runScene: function(t, e, i) {
cc.assertID(t, 1205);
cc.assertID(t instanceof cc.Scene, 1216);
t._load();
this.once(cc.Director.EVENT_AFTER_UPDATE, (function() {
this.runSceneImmediate(t, e, i);
}), this);
},
_getSceneUuid: function(t) {
var e = c._sceneInfos;
if ("string" == typeof t) {
t.endsWith(".fire") || (t += ".fire");
"/" === t[0] || t.startsWith("db://") || (t = "/" + t);
for (var i = 0; i < e.length; i++) {
var n = e[i];
if (n.url.endsWith(t)) return n;
}
} else if ("number" == typeof t) {
if (0 <= t && t < e.length) return e[t];
cc.errorID(1206, t);
} else cc.errorID(1207, t);
return null;
},
loadScene: function(t, e, i) {
if (this._loadingScene) {
cc.warnID(1208, t, this._loadingScene);
return !1;
}
var n = this._getSceneUuid(t);
if (n) {
var r = n.uuid;
this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, t);
this._loadingScene = t;
this._loadSceneByUuid(r, e, i);
return !0;
}
cc.errorID(1209, t);
return !1;
},
preloadScene: function(t, e, i) {
if (void 0 === i) {
i = e;
e = null;
}
var n = this._getSceneUuid(t);
if (n) {
this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, t);
cc.loader.load({
uuid: n.uuid,
type: "uuid"
}, e, (function(e, n) {
e && cc.errorID(1210, t, e.message);
i && i(e, n);
}));
} else {
var r = 'Can not preload the scene "' + t + '" because it is not in the build settings.';
i(new Error(r));
cc.error("preloadScene: " + r);
}
},
_loadSceneByUuid: function(t, e, i, n) {
0;
console.time("LoadScene " + t);
cc.AssetLibrary.loadAsset(t, (function(n, r) {
console.timeEnd("LoadScene " + t);
var s = cc.director;
s._loadingScene = "";
if (n) {
n = "Failed to load scene: " + n;
cc.error(n);
} else {
if (r instanceof cc.SceneAsset) {
var o = r.scene;
o._id = r._uuid;
o._name = r._name;
s.runSceneImmediate(o, i, e);
return;
}
n = "The asset " + t + " is not a scene";
cc.error(n);
}
e && e(n);
}));
},
resume: function() {
if (this._paused) {
this._lastUpdate = performance.now();
this._lastUpdate || cc.logID(1200);
this._paused = !1;
this._deltaTime = 0;
}
},
setDepthTest: function(t) {
cc.Camera.main && (cc.Camera.main.depth = !!t);
},
setClearColor: function(t) {
cc.Camera.main && (cc.Camera.main.backgroundColor = t);
},
getRunningScene: function() {
return this._scene;
},
getScene: function() {
return this._scene;
},
getAnimationInterval: function() {
return 1e3 / c.getFrameRate();
},
setAnimationInterval: function(t) {
c.setFrameRate(Math.round(1e3 / t));
},
getDeltaTime: function() {
return this._deltaTime;
},
getTotalTime: function() {
return performance.now() - this._startTime;
},
getTotalFrames: function() {
return this._totalFrames;
},
isPaused: function() {
return this._paused;
},
getScheduler: function() {
return this._scheduler;
},
setScheduler: function(t) {
this._scheduler !== t && (this._scheduler = t);
},
getActionManager: function() {
return this._actionManager;
},
setActionManager: function(t) {
if (this._actionManager !== t) {
this._actionManager && this._scheduler.unscheduleUpdate(this._actionManager);
this._actionManager = t;
this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, !1);
}
},
getAnimationManager: function() {
return this._animationManager;
},
getCollisionManager: function() {
return this._collisionManager;
},
getPhysicsManager: function() {
return this._physicsManager;
},
startAnimation: function() {
cc.game.resume();
},
stopAnimation: function() {
cc.game.pause();
},
_resetDeltaTime: function() {
this._lastUpdate = performance.now();
this._deltaTime = 0;
},
mainLoop: function(t) {
if (this._purgeDirectorInNextLoop) {
this._purgeDirectorInNextLoop = !1;
this.purgeDirector();
} else {
this.calculateDeltaTime(t);
if (!this._paused) {
this.emit(cc.Director.EVENT_BEFORE_UPDATE);
this._compScheduler.startPhase();
this._compScheduler.updatePhase(this._deltaTime);
this._scheduler.update(this._deltaTime);
this._compScheduler.lateUpdatePhase(this._deltaTime);
this.emit(cc.Director.EVENT_AFTER_UPDATE);
a._deferredDestroy();
}
this.emit(cc.Director.EVENT_BEFORE_DRAW);
l.render(this._scene, this._deltaTime);
this.emit(cc.Director.EVENT_AFTER_DRAW);
u.frameUpdateListeners();
this._totalFrames++;
}
},
__fastOn: function(t, e, i) {
this.on(t, e, i);
},
__fastOff: function(t, e, i) {
this.off(t, e, i);
}
};
cc.js.addon(cc.Director.prototype, n.prototype);
cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed";
cc.Director.EVENT_BEFORE_SCENE_LOADING = "director_before_scene_loading";
cc.Director.EVENT_BEFORE_SCENE_LAUNCH = "director_before_scene_launch";
cc.Director.EVENT_AFTER_SCENE_LAUNCH = "director_after_scene_launch";
cc.Director.EVENT_BEFORE_UPDATE = "director_before_update";
cc.Director.EVENT_AFTER_UPDATE = "director_after_update";
cc.Director.EVENT_BEFORE_VISIT = "director_before_draw";
cc.Director.EVENT_AFTER_VISIT = "director_before_draw";
cc.Director.EVENT_BEFORE_DRAW = "director_before_draw";
cc.Director.EVENT_AFTER_DRAW = "director_after_draw";
cc.Director.PROJECTION_2D = 0;
cc.Director.PROJECTION_3D = 1;
cc.Director.PROJECTION_CUSTOM = 3;
cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_2D;
cc.director = new cc.Director();
e.exports = cc.director;
}), {
"./CCGame": 6,
"./CCScheduler": 10,
"./component-scheduler": 43,
"./event-manager": 75,
"./event/event-target": 77,
"./load-pipeline/auto-release-utils": 92,
"./node-activator": 108,
"./platform/CCObject": 116,
"./renderer": 155
} ],
6: [ (function(t, e, i) {
"use strict";
var n = t("./event/event-target");
t("../audio/CCAudioEngine");
var r = t("./CCDebug"), s = t("./renderer/index.js"), o = t("../core/renderer/utils/dynamic-atlas/manager"), a = {
EVENT_HIDE: "game_on_hide",
EVENT_SHOW: "game_on_show",
EVENT_RESTART: "game_on_restart",
EVENT_GAME_INITED: "game_inited",
EVENT_ENGINE_INITED: "engine_inited",
EVENT_RENDERER_INITED: "engine_inited",
RENDER_TYPE_CANVAS: 0,
RENDER_TYPE_WEBGL: 1,
RENDER_TYPE_OPENGL: 2,
_persistRootNodes: {},
_paused: !0,
_configLoaded: !1,
_isCloning: !1,
_prepared: !1,
_rendererInitialized: !1,
_renderContext: null,
_intervalId: null,
_lastTime: null,
_frameTime: null,
_sceneInfos: [],
frame: null,
container: null,
canvas: null,
renderType: -1,
config: null,
onStart: null,
setFrameRate: function(t) {
this.config.frameRate = t;
this._intervalId && window.cancelAnimFrame(this._intervalId);
this._intervalId = 0;
this._paused = !0;
this._setAnimFrame();
this._runMainLoop();
},
getFrameRate: function() {
return this.config.frameRate;
},
step: function() {
cc.director.mainLoop();
},
pause: function() {
if (!this._paused) {
this._paused = !0;
cc.audioEngine && cc.audioEngine._break();
this._intervalId && window.cancelAnimFrame(this._intervalId);
this._intervalId = 0;
}
},
resume: function() {
if (this._paused) {
this._paused = !1;
cc.audioEngine && cc.audioEngine._restore();
cc.director._resetDeltaTime();
this._runMainLoop();
}
},
isPaused: function() {
return this._paused;
},
restart: function() {
cc.director.once(cc.Director.EVENT_AFTER_DRAW, (function() {
for (var t in a._persistRootNodes) a.removePersistRootNode(a._persistRootNodes[t]);
cc.director.getScene().destroy();
cc.Object._deferredDestroy();
cc.audioEngine && cc.audioEngine.uncacheAll();
cc.director.reset();
a.pause();
cc.AssetLibrary._loadBuiltins((function() {
a.onStart();
a.emit(a.EVENT_RESTART);
}));
}));
},
end: function() {
close();
},
_initEngine: function() {
if (!this._rendererInitialized) {
this._initRenderer();
this._initEvents();
this.emit(this.EVENT_ENGINE_INITED);
}
},
_prepareFinished: function(t) {
var e = this;
0;
this._initEngine();
this._setAnimFrame();
cc.AssetLibrary._loadBuiltins((function() {
console.log("Cocos Creator v" + cc.ENGINE_VERSION);
e._prepared = !0;
e._runMainLoop();
e.emit(e.EVENT_GAME_INITED);
t && t();
}));
},
eventTargetOn: n.prototype.on,
eventTargetOnce: n.prototype.once,
on: function(t, e, i) {
this._prepared && t === this.EVENT_ENGINE_INITED || !this._paused && t === this.EVENT_GAME_INITED ? e.call(i) : this.eventTargetOn(t, e, i);
},
once: function(t, e, i) {
this._prepared && t === this.EVENT_ENGINE_INITED || !this._paused && t === this.EVENT_GAME_INITED ? e.call(i) : this.eventTargetOnce(t, e, i);
},
prepare: function(t) {
if (this._prepared) t && t(); else {
var e = this.config.jsList;
if (e && e.length > 0) {
var i = this;
cc.loader.load(e, (function(e) {
if (e) throw new Error(JSON.stringify(e));
i._prepareFinished(t);
}));
} else this._prepareFinished(t);
}
},
run: function(t, e) {
this._initConfig(t);
this.onStart = e;
this.prepare(a.onStart && a.onStart.bind(a));
},
addPersistRootNode: function(t) {
if (cc.Node.isNode(t) && t.uuid) {
var e = t.uuid;
if (!this._persistRootNodes[e]) {
var i = cc.director._scene;
if (cc.isValid(i)) if (t.parent) {
if (!(t.parent instanceof cc.Scene)) {
cc.warnID(3801);
return;
}
if (t.parent !== i) {
cc.warnID(3802);
return;
}
} else t.parent = i;
this._persistRootNodes[e] = t;
t._persistNode = !0;
}
} else cc.warnID(3800);
},
removePersistRootNode: function(t) {
var e = t.uuid || "";
if (t === this._persistRootNodes[e]) {
delete this._persistRootNodes[e];
t._persistNode = !1;
}
},
isPersistRootNode: function(t) {
return t._persistNode;
},
_setAnimFrame: function() {
this._lastTime = performance.now();
var t = a.config.frameRate;
this._frameTime = 1e3 / t;
jsb.setPreferredFramesPerSecond(t);
window.requestAnimFrame = window.requestAnimationFrame;
window.cancelAnimFrame = window.cancelAnimationFrame;
},
_stTime: function(t) {
var e = performance.now(), i = Math.max(0, a._frameTime - (e - a._lastTime)), n = window.setTimeout((function() {
t();
}), i);
a._lastTime = e + i;
return n;
},
_ctTime: function(t) {
window.clearTimeout(t);
},
_runMainLoop: function() {
0;
if (this._prepared) {
var t, e = this, i = e.config, n = cc.director;
i.frameRate;
r.setDisplayStats(i.showFPS);
t = function(i) {
if (!e._paused) {
e._intervalId = window.requestAnimFrame(t);
0;
n.mainLoop(i);
}
};
e._intervalId = window.requestAnimFrame(t);
e._paused = !1;
}
},
_initConfig: function(t) {
"number" != typeof t.debugMode && (t.debugMode = 0);
t.exposeClassName = !!t.exposeClassName;
"number" != typeof t.frameRate && (t.frameRate = 60);
var e = t.renderMode;
("number" != typeof e || e > 2 || e < 0) && (t.renderMode = 0);
"boolean" != typeof t.registerSystemEvent && (t.registerSystemEvent = !0);
t.showFPS = !!t.showFPS;
this._sceneInfos = t.scenes || [];
this.collisionMatrix = t.collisionMatrix || [];
this.groupList = t.groupList || [];
r._resetDebugSetting(t.debugMode);
this.config = t;
this._configLoaded = !0;
},
_determineRenderType: function() {
var t = this.config, e = parseInt(t.renderMode) || 0;
this.renderType = this.RENDER_TYPE_CANVAS;
var i = !1;
if (0 === e) {
if (cc.sys.capabilities.opengl) {
this.renderType = this.RENDER_TYPE_WEBGL;
i = !0;
} else if (cc.sys.capabilities.canvas) {
this.renderType = this.RENDER_TYPE_CANVAS;
i = !0;
}
} else if (1 === e && cc.sys.capabilities.canvas) {
this.renderType = this.RENDER_TYPE_CANVAS;
i = !0;
} else if (2 === e && cc.sys.capabilities.opengl) {
this.renderType = this.RENDER_TYPE_WEBGL;
i = !0;
}
if (!i) throw new Error(r.getError(3820, e));
},
_initRenderer: function() {
if (!this._rendererInitialized) {
this.config.id;
var t = void 0, e = void 0;
this.container = e = document.createElement("DIV");
this.frame = e.parentNode === document.body ? document.documentElement : e.parentNode;
t = window.__canvas;
this.canvas = t;
this._determineRenderType();
if (this.renderType === this.RENDER_TYPE_WEBGL) {
var i = {
stencil: !0,
antialias: cc.macro.ENABLE_WEBGL_ANTIALIAS,
alpha: cc.macro.ENABLE_TRANSPARENT_CANVAS
};
s.initWebGL(t, i);
this._renderContext = s.device._gl;
!cc.macro.CLEANUP_IMAGE_CACHE && o && (o.enabled = !0);
}
if (!this._renderContext) {
this.renderType = this.RENDER_TYPE_CANVAS;
s.initCanvas(t);
this._renderContext = s.device._ctx;
}
this.canvas.oncontextmenu = function() {
if (!cc._isContextMenuEnable) return !1;
};
this._rendererInitialized = !0;
}
},
_initEvents: function() {
var t, e = window;
this.config.registerSystemEvent && _cc.inputManager.registerSystemEvent(this.canvas);
"undefined" != typeof document.hidden ? t = "hidden" : "undefined" != typeof document.mozHidden ? t = "mozHidden" : "undefined" != typeof document.msHidden ? t = "msHidden" : "undefined" != typeof document.webkitHidden && (t = "webkitHidden");
var i = !1;
function n() {
if (!i) {
i = !0;
a.emit(a.EVENT_HIDE);
}
}
function r(t, e, n, r, s) {
if (i) {
i = !1;
a.emit(a.EVENT_SHOW, t, e, n, r, s);
}
}
if (t) for (var s = [ "visibilitychange", "mozvisibilitychange", "msvisibilitychange", "webkitvisibilitychange", "qbrowserVisibilityChange" ], o = 0; o < s.length; o++) document.addEventListener(s[o], (function(e) {
var i = document[t];
(i = i || e.hidden) ? n() : r();
})); else {
e.addEventListener("blur", n);
e.addEventListener("focus", r);
}
navigator.userAgent.indexOf("MicroMessenger") > -1 && (e.onfocus = r);
if ("onpageshow" in window && "onpagehide" in window) {
e.addEventListener("pagehide", n);
e.addEventListener("pageshow", r);
document.addEventListener("pagehide", n);
document.addEventListener("pageshow", r);
}
this.on(a.EVENT_HIDE, (function() {
a.pause();
}));
this.on(a.EVENT_SHOW, (function() {
a.resume();
}));
}
};
n.call(a);
cc.js.addon(a, n.prototype);
cc.game = e.exports = a;
}), {
"../audio/CCAudioEngine": 2,
"../core/renderer/utils/dynamic-atlas/manager": 158,
"./CCDebug": 4,
"./event/event-target": 77,
"./renderer/index.js": 155
} ],
7: [ (function(t, e, i) {
"use strict";
var n = t("./vmath"), r = t("./utils/base-node"), s = t("./utils/prefab-helper"), o = t("./utils/trans-pool").NodeMemPool, a = t("./utils/affine-transform"), c = t("./event-manager"), l = t("./platform/CCMacro"), u = t("./platform/js"), h = (t("./event/event"), 
t("./event/event-target")), f = t("./renderer/render-flow"), d = cc.Object.Flags.Destroying, _ = Math.PI / 180, p = !!cc.ActionManager, v = function() {}, g = cc.v3(), m = cc.quat(), y = cc.v3(), E = cc.v3(), C = cc.quat(), T = cc.quat(), A = cc.v3(), x = cc.v3(), b = cc.v3(), S = cc.v3(), R = cc.v3(), w = cc.quat(), L = cc.quat(), O = cc.v3(), M = n.quat.create(), I = cc.v3(), D = cc.v3(), N = cc.quat(), P = cc.quat(), F = (cc.quat(), 
n.mat4.create()), B = n.vec3.create(), z = new Array(16);
z.length = 0;
var U = cc.Enum({
DEBUG: 31
}), k = cc.Enum({
POSITION: 1,
SCALE: 2,
ROTATION: 4,
SKEW: 8,
TRS: 7,
RS: 6,
ALL: 65535
}), H = cc.Enum({
TOUCH_START: "touchstart",
TOUCH_MOVE: "touchmove",
TOUCH_END: "touchend",
TOUCH_CANCEL: "touchcancel",
MOUSE_DOWN: "mousedown",
MOUSE_MOVE: "mousemove",
MOUSE_ENTER: "mouseenter",
MOUSE_LEAVE: "mouseleave",
MOUSE_UP: "mouseup",
MOUSE_WHEEL: "mousewheel",
POSITION_CHANGED: "position-changed",
ROTATION_CHANGED: "rotation-changed",
SCALE_CHANGED: "scale-changed",
SIZE_CHANGED: "size-changed",
ANCHOR_CHANGED: "anchor-changed",
COLOR_CHANGED: "color-changed",
CHILD_ADDED: "child-added",
CHILD_REMOVED: "child-removed",
CHILD_REORDER: "child-reorder",
GROUP_CHANGED: "group-changed",
SIBLING_ORDER_CHANGED: "sibling-order-changed"
}), G = [ H.TOUCH_START, H.TOUCH_MOVE, H.TOUCH_END, H.TOUCH_CANCEL ], V = [ H.MOUSE_DOWN, H.MOUSE_ENTER, H.MOUSE_MOVE, H.MOUSE_LEAVE, H.MOUSE_UP, H.MOUSE_WHEEL ], j = !0, W = function(t, e) {
if (0 !== t) {
var i = "";
j && cc.warn("`cc.Node.skewX/Y` is deprecated since v2.2.1, please use 3D node instead.", i);
j = !1;
}
}, Y = null, X = function(t, e) {
var i = t.getLocation(), n = this.owner;
if (n._hitTest(i, this)) {
e.type = H.TOUCH_START;
e.touch = t;
e.bubbles = !0;
n.dispatchEvent(e);
return !0;
}
return !1;
}, q = function(t, e) {
var i = this.owner;
e.type = H.TOUCH_MOVE;
e.touch = t;
e.bubbles = !0;
i.dispatchEvent(e);
}, K = function(t, e) {
var i = t.getLocation(), n = this.owner;
n._hitTest(i, this) ? e.type = H.TOUCH_END : e.type = H.TOUCH_CANCEL;
e.touch = t;
e.bubbles = !0;
n.dispatchEvent(e);
}, Z = function(t, e) {
t.getLocation();
var i = this.owner;
e.type = H.TOUCH_CANCEL;
e.touch = t;
e.bubbles = !0;
i.dispatchEvent(e);
}, $ = function(t) {
var e = t.getLocation(), i = this.owner;
if (i._hitTest(e, this)) {
t.type = H.MOUSE_DOWN;
t.bubbles = !0;
i.dispatchEvent(t);
}
}, Q = function(t) {
var e = t.getLocation(), i = this.owner;
if (i._hitTest(e, this)) {
if (!this._previousIn) {
if (Y && Y._mouseListener) {
t.type = H.MOUSE_LEAVE;
Y.dispatchEvent(t);
Y._mouseListener._previousIn = !1;
}
Y = this.owner;
t.type = H.MOUSE_ENTER;
i.dispatchEvent(t);
this._previousIn = !0;
}
t.type = H.MOUSE_MOVE;
t.bubbles = !0;
i.dispatchEvent(t);
} else {
if (!this._previousIn) return;
t.type = H.MOUSE_LEAVE;
i.dispatchEvent(t);
this._previousIn = !1;
Y = null;
}
t.stopPropagation();
}, J = function(t) {
var e = t.getLocation(), i = this.owner;
if (i._hitTest(e, this)) {
t.type = H.MOUSE_UP;
t.bubbles = !0;
i.dispatchEvent(t);
t.stopPropagation();
}
}, tt = function(t) {
var e = t.getLocation(), i = this.owner;
if (i._hitTest(e, this)) {
t.type = H.MOUSE_WHEEL;
t.bubbles = !0;
i.dispatchEvent(t);
t.stopPropagation();
}
};
function et(t) {
var e = cc.Mask;
if (e) for (var i = 0, n = t; n && cc.Node.isNode(n); n = n._parent, ++i) if (n.getComponent(e)) return {
index: i,
node: n
};
return null;
}
function it(t, e) {
if (!(t._objFlags & d)) {
var i = 0;
if (t._bubblingListeners) for (;i < e.length; ++i) if (t._bubblingListeners.hasEventListener(e[i])) return !0;
if (t._capturingListeners) for (;i < e.length; ++i) if (t._capturingListeners.hasEventListener(e[i])) return !0;
return !1;
}
return !0;
}
function nt(t, e) {
var i, n;
e.target = t;
z.length = 0;
t._getCapturingTargets(e.type, z);
e.eventPhase = 1;
for (n = z.length - 1; n >= 0; --n) if ((i = z[n])._capturingListeners) {
e.currentTarget = i;
i._capturingListeners.emit(e.type, e, z);
if (e._propagationStopped) {
z.length = 0;
return;
}
}
z.length = 0;
e.eventPhase = 2;
e.currentTarget = t;
t._capturingListeners && t._capturingListeners.emit(e.type, e);
!e._propagationImmediateStopped && t._bubblingListeners && t._bubblingListeners.emit(e.type, e);
if (!e._propagationStopped && e.bubbles) {
t._getBubblingTargets(e.type, z);
e.eventPhase = 3;
for (n = 0; n < z.length; ++n) if ((i = z[n])._bubblingListeners) {
e.currentTarget = i;
i._bubblingListeners.emit(e.type, e);
if (e._propagationStopped) {
z.length = 0;
return;
}
}
}
z.length = 0;
}
function rt(t) {
var e = t.groupIndex;
0 === e && t.parent && (e = rt(t.parent));
return e;
}
function st(t) {
var e = rt(t);
t._cullingMask = 1 << e;
t._proxy && t._proxy.updateCullingMask();
for (var i = 0; i < t._children.length; i++) st(t._children[i]);
}
var ot = {
name: "cc.Node",
extends: r,
properties: {
_opacity: 255,
_color: cc.Color.WHITE,
_contentSize: cc.Size,
_anchorPoint: cc.v2(.5, .5),
_position: void 0,
_scale: void 0,
_trs: null,
_eulerAngles: cc.Vec3,
_skewX: 0,
_skewY: 0,
_zIndex: {
default: void 0,
type: cc.Integer
},
_localZOrder: {
default: 0,
serializable: !1
},
_is3DNode: !1,
_groupIndex: {
default: 0,
formerlySerializedAs: "groupIndex"
},
groupIndex: {
get: function() {
return this._groupIndex;
},
set: function(t) {
this._groupIndex = t;
st(this);
this.emit(H.GROUP_CHANGED, this);
}
},
group: {
get: function() {
return cc.game.groupList[this.groupIndex] || "";
},
set: function(t) {
this.groupIndex = cc.game.groupList.indexOf(t);
}
},
x: {
get: function() {
return this._trs[0];
},
set: function(t) {
var e = this._trs;
if (t !== e[0]) {
0;
e[0] = t;
this.setLocalDirty(k.POSITION);
1 & this._eventMask && this.emit(H.POSITION_CHANGED);
}
}
},
y: {
get: function() {
return this._trs[1];
},
set: function(t) {
var e = this._trs;
if (t !== e[1]) {
0;
e[1] = t;
this.setLocalDirty(k.POSITION);
1 & this._eventMask && this.emit(H.POSITION_CHANGED);
}
}
},
rotation: {
get: function() {
0;
return -this.angle;
},
set: function(t) {
0;
this.angle = -t;
}
},
angle: {
get: function() {
return this._eulerAngles.z;
},
set: function(t) {
n.vec3.set(this._eulerAngles, 0, 0, t);
n.trs.fromAngleZ(this._trs, t);
this.setLocalDirty(k.ROTATION);
4 & this._eventMask && this.emit(H.ROTATION_CHANGED);
}
},
rotationX: {
get: function() {
0;
return this._eulerAngles.x;
},
set: function(t) {
0;
if (this._eulerAngles.x !== t) {
this._eulerAngles.x = t;
this._eulerAngles.x === this._eulerAngles.y ? n.trs.fromAngleZ(this._trs, -t) : n.trs.fromEulerNumber(this._trs, t, this._eulerAngles.y, 0);
this.setLocalDirty(k.ROTATION);
4 & this._eventMask && this.emit(H.ROTATION_CHANGED);
}
}
},
rotationY: {
get: function() {
0;
return this._eulerAngles.y;
},
set: function(t) {
0;
if (this._eulerAngles.y !== t) {
this._eulerAngles.y = t;
this._eulerAngles.x === this._eulerAngles.y ? n.trs.fromAngleZ(this._trs, -t) : n.trs.fromEulerNumber(this._trs, this._eulerAngles.x, t, 0);
this.setLocalDirty(k.ROTATION);
4 & this._eventMask && this.emit(H.ROTATION_CHANGED);
}
}
},
scale: {
get: function() {
return this._trs[7];
},
set: function(t) {
this.setScale(t);
}
},
scaleX: {
get: function() {
return this._trs[7];
},
set: function(t) {
if (this._trs[7] !== t) {
this._trs[7] = t;
this.setLocalDirty(k.SCALE);
2 & this._eventMask && this.emit(H.SCALE_CHANGED);
}
}
},
scaleY: {
get: function() {
return this._trs[8];
},
set: function(t) {
if (this._trs[8] !== t) {
this._trs[8] = t;
this.setLocalDirty(k.SCALE);
2 & this._eventMask && this.emit(H.SCALE_CHANGED);
}
}
},
skewX: {
get: function() {
return this._skewX;
},
set: function(t) {
W(t);
this._skewX = t;
this.setLocalDirty(k.SKEW);
this._proxy.updateSkew();
}
},
skewY: {
get: function() {
return this._skewY;
},
set: function(t) {
W(t);
this._skewY = t;
this.setLocalDirty(k.SKEW);
this._proxy.updateSkew();
}
},
opacity: {
get: function() {
return this._opacity;
},
set: function(t) {
t = cc.misc.clampf(t, 0, 255);
if (this._opacity !== t) {
this._opacity = t;
this._proxy.updateOpacity();
this._renderFlag |= f.FLAG_OPACITY_COLOR;
}
},
range: [ 0, 255 ]
},
color: {
get: function() {
return this._color.clone();
},
set: function(t) {
if (!this._color.equals(t)) {
this._color.set(t);
0;
this._renderFlag |= f.FLAG_COLOR;
32 & this._eventMask && this.emit(H.COLOR_CHANGED, t);
}
}
},
anchorX: {
get: function() {
return this._anchorPoint.x;
},
set: function(t) {
var e = this._anchorPoint;
if (e.x !== t) {
e.x = t;
16 & this._eventMask && this.emit(H.ANCHOR_CHANGED);
}
}
},
anchorY: {
get: function() {
return this._anchorPoint.y;
},
set: function(t) {
var e = this._anchorPoint;
if (e.y !== t) {
e.y = t;
16 & this._eventMask && this.emit(H.ANCHOR_CHANGED);
}
}
},
width: {
get: function() {
return this._contentSize.width;
},
set: function(t) {
if (t !== this._contentSize.width) {
this._contentSize.width = t;
8 & this._eventMask && this.emit(H.SIZE_CHANGED);
}
}
},
height: {
get: function() {
return this._contentSize.height;
},
set: function(t) {
if (t !== this._contentSize.height) {
this._contentSize.height = t;
8 & this._eventMask && this.emit(H.SIZE_CHANGED);
}
}
},
zIndex: {
get: function() {
return this._localZOrder >> 16;
},
set: function(t) {
if (t > l.MAX_ZINDEX) {
cc.warnID(1636);
t = l.MAX_ZINDEX;
} else if (t < l.MIN_ZINDEX) {
cc.warnID(1637);
t = l.MIN_ZINDEX;
}
if (this.zIndex !== t) {
this._localZOrder = 65535 & this._localZOrder | t << 16;
this.emit(H.SIBLING_ORDER_CHANGED);
this._parent && this._onSiblingIndexChanged();
}
this._proxy.updateZOrder();
}
}
},
ctor: function() {
this._reorderChildDirty = !1;
this._widget = null;
this._renderComponent = null;
this._capturingListeners = null;
this._bubblingListeners = null;
this._touchListener = null;
this._mouseListener = null;
this._initDataFromPool();
this._eventMask = 0;
this._cullingMask = 1;
this._childArrivalOrder = 1;
this._proxy = new renderer.NodeProxy(this._spaceInfo.unitID, this._spaceInfo.index, this._id, this._name);
this._proxy.init(this);
},
statics: {
EventType: H,
_LocalDirtyFlag: k,
isNode: function(t) {
return t instanceof at && (t.constructor === at || !(t instanceof cc.Scene));
},
BuiltinGroupIndex: U
},
_onSiblingIndexChanged: function() {
for (var t = this._parent, e = t._children, i = 0, n = e.length; i < n; i++) e[i]._updateOrderOfArrival();
t._delaySort();
},
_onPreDestroy: function() {
this._onPreDestroyBase();
p && cc.director.getActionManager().removeAllActionsFromTarget(this);
Y === this && (Y = null);
if (this._touchListener || this._mouseListener) {
c.removeListeners(this);
if (this._touchListener) {
this._touchListener.owner = null;
this._touchListener.mask = null;
this._touchListener = null;
}
if (this._mouseListener) {
this._mouseListener.owner = null;
this._mouseListener.mask = null;
this._mouseListener = null;
}
}
this._proxy.destroy();
this._proxy = null;
this._backDataIntoPool();
this._reorderChildDirty && cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
},
_onPostActivated: function(t) {
var e = p ? cc.director.getActionManager() : null;
if (t) {
this._renderFlag |= f.FLAG_WORLD_TRANSFORM;
e && e.resumeTarget(this);
c.resumeTarget(this);
if (this._touchListener) {
var i = this._touchListener.mask = et(this);
this._mouseListener && (this._mouseListener.mask = i);
} else this._mouseListener && (this._mouseListener.mask = et(this));
} else {
e && e.pauseTarget(this);
c.pauseTarget(this);
}
},
_onHierarchyChanged: function(t) {
this._updateOrderOfArrival();
st(this);
this._parent && this._parent._delaySort();
this._renderFlag |= f.FLAG_WORLD_TRANSFORM;
this._onHierarchyChangedBase(t);
cc._widgetManager && (cc._widgetManager._nodesOrderDirty = !0);
this._proxy.updateParent();
},
_initDataFromPool: function() {
this._spaceInfo || (this._spaceInfo = o.pop());
var t = this._spaceInfo;
this._matrix = n.mat4.create(t.localMat);
n.mat4.identity(this._matrix);
this._worldMatrix = n.mat4.create(t.worldMat);
n.mat4.identity(this._worldMatrix);
this._localMatDirty = k.ALL;
this._worldMatDirty = !0;
var e = this._trs = this._spaceInfo.trs;
e[0] = 0;
e[1] = 0;
e[2] = 0;
e[3] = 0;
e[4] = 0;
e[5] = 0;
e[6] = 1;
e[7] = 1;
e[8] = 1;
e[9] = 1;
},
_backDataIntoPool: function() {
o.push(this._spaceInfo);
this._matrix = null;
this._worldMatrix = null;
this._trs = null;
this._spaceInfo = null;
},
_toEuler: function() {
if (this.is3DNode) n.trs.toEuler(this._eulerAngles, this._trs); else {
var t = Math.asin(this._trs[5]) / _ * 2;
n.vec3.set(this._eulerAngles, 0, 0, t);
}
},
_fromEuler: function() {
this.is3DNode ? n.trs.fromEuler(this._trs, this._eulerAngles) : n.trs.fromAngleZ(this._trs, this._eulerAngles.z);
},
_upgrade_1x_to_2x: function() {
var t = this._trs;
if (t) {
var e = t;
t = this._trs = this._spaceInfo.trs;
11 === e.length ? t.set(e.subarray(1)) : t.set(e);
} else t = this._trs = this._spaceInfo.trs;
if (void 0 !== this._zIndex) {
this._localZOrder = this._zIndex << 16;
this._zIndex = void 0;
}
this._fromEuler();
0 !== this._localZOrder && (this._zIndex = (4294901760 & this._localZOrder) >> 16);
if (this._color.a < 255 && 255 === this._opacity) {
this._opacity = this._color.a;
this._color.a = 255;
}
this._renderFlag |= f.FLAG_TRANSFORM | f.FLAG_OPACITY_COLOR;
},
_onBatchCreated: function() {
var t = this._prefab;
if (t && t.sync && t.root === this) {
0;
s.syncWithPrefab(this);
}
this._upgrade_1x_to_2x();
this._updateOrderOfArrival();
this._cullingMask = 1 << rt(this);
this._proxy && this._proxy.updateCullingMask();
if (!this._activeInHierarchy) {
p && cc.director.getActionManager().pauseTarget(this);
c.pauseTarget(this);
}
for (var e = this._children, i = 0, n = e.length; i < n; i++) e[i]._onBatchCreated();
e.length > 0 && (this._renderFlag |= f.FLAG_CHILDREN);
this._proxy.initNative();
},
_onBatchRestored: function() {
this._upgrade_1x_to_2x();
this._cullingMask = 1 << rt(this);
this._proxy && this._proxy.updateCullingMask();
if (!this._activeInHierarchy) {
var t = cc.director.getActionManager();
t && t.pauseTarget(this);
c.pauseTarget(this);
}
for (var e = this._children, i = 0, n = e.length; i < n; i++) e[i]._onBatchRestored();
e.length > 0 && (this._renderFlag |= f.FLAG_CHILDREN);
this._proxy.initNative();
},
_checknSetupSysEvent: function(t) {
var e = !1, i = !1;
if (-1 !== G.indexOf(t)) {
if (!this._touchListener) {
this._touchListener = cc.EventListener.create({
event: cc.EventListener.TOUCH_ONE_BY_ONE,
swallowTouches: !0,
owner: this,
mask: et(this),
onTouchBegan: X,
onTouchMoved: q,
onTouchEnded: K,
onTouchCancelled: Z
});
c.addListener(this._touchListener, this);
e = !0;
}
i = !0;
} else if (-1 !== V.indexOf(t)) {
if (!this._mouseListener) {
this._mouseListener = cc.EventListener.create({
event: cc.EventListener.MOUSE,
_previousIn: !1,
owner: this,
mask: et(this),
onMouseDown: $,
onMouseMove: Q,
onMouseUp: J,
onMouseScroll: tt
});
c.addListener(this._mouseListener, this);
e = !0;
}
i = !0;
}
e && !this._activeInHierarchy && cc.director.getScheduler().schedule((function() {
this._activeInHierarchy || c.pauseTarget(this);
}), this, 0, 0, 0, !1);
return i;
},
on: function(t, e, i, n) {
if (this._checknSetupSysEvent(t)) return this._onDispatch(t, e, i, n);
switch (t) {
case H.POSITION_CHANGED:
this._eventMask |= 1;
break;

case H.SCALE_CHANGED:
this._eventMask |= 2;
break;

case H.ROTATION_CHANGED:
this._eventMask |= 4;
break;

case H.SIZE_CHANGED:
this._eventMask |= 8;
break;

case H.ANCHOR_CHANGED:
this._eventMask |= 16;
break;

case H.COLOR_CHANGED:
this._eventMask |= 32;
}
this._bubblingListeners || (this._bubblingListeners = new h());
return this._bubblingListeners.on(t, e, i);
},
once: function(t, e, i, n) {
(this._checknSetupSysEvent(t) && n ? this._capturingListeners = this._capturingListeners || new h() : this._bubblingListeners = this._bubblingListeners || new h()).once(t, e, i);
},
_onDispatch: function(t, e, i, n) {
if ("boolean" == typeof i) {
n = i;
i = void 0;
} else n = !!n;
if (e) {
var r = null;
if (!(r = n ? this._capturingListeners = this._capturingListeners || new h() : this._bubblingListeners = this._bubblingListeners || new h()).hasEventListener(t, e, i)) {
r.on(t, e, i);
i && i.__eventTargets && i.__eventTargets.push(this);
}
return e;
}
cc.errorID(6800);
},
off: function(t, e, i, n) {
var r = -1 !== G.indexOf(t), s = !r && -1 !== V.indexOf(t);
if (r || s) {
this._offDispatch(t, e, i, n);
if (r) {
if (this._touchListener && !it(this, G)) {
c.removeListener(this._touchListener);
this._touchListener = null;
}
} else if (s && this._mouseListener && !it(this, V)) {
c.removeListener(this._mouseListener);
this._mouseListener = null;
}
} else if (this._bubblingListeners) {
this._bubblingListeners.off(t, e, i);
if (!this._bubblingListeners.hasEventListener(t)) switch (t) {
case H.POSITION_CHANGED:
this._eventMask &= -2;
break;

case H.SCALE_CHANGED:
this._eventMask &= -3;
break;

case H.ROTATION_CHANGED:
this._eventMask &= -5;
break;

case H.SIZE_CHANGED:
this._eventMask &= -9;
break;

case H.ANCHOR_CHANGED:
this._eventMask &= -17;
break;

case H.COLOR_CHANGED:
this._eventMask &= -33;
}
}
},
_offDispatch: function(t, e, i, n) {
if ("boolean" == typeof i) {
n = i;
i = void 0;
} else n = !!n;
if (e) {
var r = n ? this._capturingListeners : this._bubblingListeners;
if (r) {
r.off(t, e, i);
i && i.__eventTargets && u.array.fastRemove(i.__eventTargets, this);
}
} else {
this._capturingListeners && this._capturingListeners.removeAll(t);
this._bubblingListeners && this._bubblingListeners.removeAll(t);
}
},
targetOff: function(t) {
var e = this._bubblingListeners;
if (e) {
e.targetOff(t);
1 & this._eventMask && !e.hasEventListener(H.POSITION_CHANGED) && (this._eventMask &= -2);
2 & this._eventMask && !e.hasEventListener(H.SCALE_CHANGED) && (this._eventMask &= -3);
4 & this._eventMask && !e.hasEventListener(H.ROTATION_CHANGED) && (this._eventMask &= -5);
8 & this._eventMask && !e.hasEventListener(H.SIZE_CHANGED) && (this._eventMask &= -9);
16 & this._eventMask && !e.hasEventListener(H.ANCHOR_CHANGED) && (this._eventMask &= -17);
32 & this._eventMask && !e.hasEventListener(H.COLOR_CHANGED) && (this._eventMask &= -33);
}
this._capturingListeners && this._capturingListeners.targetOff(t);
t && t.__eventTargets && u.array.fastRemove(t.__eventTargets, this);
if (this._touchListener && !it(this, G)) {
c.removeListener(this._touchListener);
this._touchListener = null;
}
if (this._mouseListener && !it(this, V)) {
c.removeListener(this._mouseListener);
this._mouseListener = null;
}
},
hasEventListener: function(t) {
var e = !1;
this._bubblingListeners && (e = this._bubblingListeners.hasEventListener(t));
!e && this._capturingListeners && (e = this._capturingListeners.hasEventListener(t));
return e;
},
emit: function(t, e, i, n, r, s) {
this._bubblingListeners && this._bubblingListeners.emit(t, e, i, n, r, s);
},
dispatchEvent: function(t) {
nt(this, t);
z.length = 0;
},
pauseSystemEvents: function(t) {
c.pauseTarget(this, t);
},
resumeSystemEvents: function(t) {
c.resumeTarget(this, t);
},
_hitTest: function(t, e) {
var i = this._contentSize.width, r = this._contentSize.height, s = I, o = D, a = cc.Camera.findCamera(this);
a ? a.getScreenToWorldPoint(t, s) : s.set(t);
this._updateWorldMatrix();
if (!n.mat4.invert(F, this._worldMatrix)) return !1;
n.vec2.transformMat4(o, s, F);
o.x += this._anchorPoint.x * i;
o.y += this._anchorPoint.y * r;
if (o.x >= 0 && o.y >= 0 && o.x <= i && o.y <= r) {
if (e && e.mask) {
for (var c = e.mask, l = this, u = 0; l && u < c.index; ++u, l = l.parent) ;
if (l === c.node) {
var h = l.getComponent(cc.Mask);
return !h || !h.enabledInHierarchy || h._hitTest(s);
}
e.mask = null;
return !0;
}
return !0;
}
return !1;
},
_getCapturingTargets: function(t, e) {
for (var i = this.parent; i; ) {
i._capturingListeners && i._capturingListeners.hasEventListener(t) && e.push(i);
i = i.parent;
}
},
_getBubblingTargets: function(t, e) {
for (var i = this.parent; i; ) {
i._bubblingListeners && i._bubblingListeners.hasEventListener(t) && e.push(i);
i = i.parent;
}
},
runAction: p ? function(t) {
if (this.active) {
cc.assertID(t, 1618);
cc.director.getActionManager().addAction(t, this, !1);
return t;
}
} : v,
pauseAllActions: p ? function() {
cc.director.getActionManager().pauseTarget(this);
} : v,
resumeAllActions: p ? function() {
cc.director.getActionManager().resumeTarget(this);
} : v,
stopAllActions: p ? function() {
cc.director.getActionManager().removeAllActionsFromTarget(this);
} : v,
stopAction: p ? function(t) {
cc.director.getActionManager().removeAction(t);
} : v,
stopActionByTag: p ? function(t) {
t !== cc.Action.TAG_INVALID ? cc.director.getActionManager().removeActionByTag(t, this) : cc.logID(1612);
} : v,
getActionByTag: p ? function(t) {
if (t === cc.Action.TAG_INVALID) {
cc.logID(1613);
return null;
}
return cc.director.getActionManager().getActionByTag(t, this);
} : function() {
return null;
},
getNumberOfRunningActions: p ? function() {
return cc.director.getActionManager().getNumberOfRunningActionsInTarget(this);
} : function() {
return 0;
},
getPosition: function(t) {
t = t || cc.v3();
return n.trs.toPosition(t, this._trs);
},
setPosition: function(t, e) {
var i;
if (void 0 === e) {
i = t.x;
e = t.y;
} else i = t;
var n = this._trs;
if (n[0] !== i || n[1] !== e) {
n[0] = i;
n[1] = e;
this.setLocalDirty(k.POSITION);
1 & this._eventMask && this.emit(H.POSITION_CHANGED);
}
},
getScale: function(t) {
if (void 0 !== t) return n.trs.toScale(t, this._trs);
cc.warnID(1400, "cc.Node.getScale", "cc.Node.scale or cc.Node.getScale(cc.Vec3)");
return this._trs[7];
},
setScale: function(t, e) {
if (t && "number" != typeof t) {
e = t.y;
t = t.x;
} else void 0 === e && (e = t);
var i = this._trs;
if (i[7] !== t || i[8] !== e) {
i[7] = t;
i[8] = e;
this.setLocalDirty(k.SCALE);
2 & this._eventMask && this.emit(H.SCALE_CHANGED);
}
},
getRotation: function(t) {
if (t instanceof cc.Quat) return n.trs.toRotation(t, this._trs);
0;
return -this.angle;
},
setRotation: function(t, e, i, n) {
if ("number" == typeof t && void 0 === e) {
0;
this.angle = -t;
} else {
var r = t;
if (void 0 === e) {
r = t.x;
e = t.y;
i = t.z;
n = t.w;
}
var s = this._trs;
if (s[3] !== r || s[4] !== e || s[5] !== i || s[6] !== n) {
s[3] = r;
s[4] = e;
s[5] = i;
s[6] = n;
this.setLocalDirty(k.ROTATION);
4 & this._eventMask && this.emit(H.ROTATION_CHANGED);
0;
}
}
},
getContentSize: function() {
return cc.size(this._contentSize.width, this._contentSize.height);
},
setContentSize: function(t, e) {
var i = this._contentSize;
if (void 0 === e) {
if (t.width === i.width && t.height === i.height) return;
0;
i.width = t.width;
i.height = t.height;
} else {
if (t === i.width && e === i.height) return;
0;
i.width = t;
i.height = e;
}
8 & this._eventMask && this.emit(H.SIZE_CHANGED);
},
getAnchorPoint: function() {
return cc.v2(this._anchorPoint);
},
setAnchorPoint: function(t, e) {
var i = this._anchorPoint;
if (void 0 === e) {
if (t.x === i.x && t.y === i.y) return;
i.x = t.x;
i.y = t.y;
} else {
if (t === i.x && e === i.y) return;
i.x = t;
i.y = e;
}
this.setLocalDirty(k.POSITION);
16 & this._eventMask && this.emit(H.ANCHOR_CHANGED);
},
_invTransformPoint: function(t, e) {
this._parent ? this._parent._invTransformPoint(t, e) : n.vec3.copy(t, e);
var i = this._trs;
n.trs.toPosition(y, i);
n.vec3.sub(t, t, y);
n.trs.toRotation(C, i);
n.quat.conjugate(T, C);
n.vec3.transformQuat(t, t, T);
n.trs.toScale(y, i);
n.vec3.inverseSafe(E, y);
n.vec3.mul(t, t, E);
return t;
},
getWorldPosition: function(t) {
n.trs.toPosition(t, this._trs);
for (var e = this._parent, i = void 0; e; ) {
i = e._trs;
n.trs.toScale(g, i);
n.vec3.mul(t, t, g);
n.trs.toRotation(m, i);
n.vec3.transformQuat(t, t, m);
n.trs.toPosition(g, i);
n.vec3.add(t, t, g);
e = e._parent;
}
return t;
},
setWorldPosition: function(t) {
var e = this._trs;
this._parent ? this._parent._invTransformPoint(A, t) : n.vec3.copy(A, t);
n.trs.fromPosition(e, A);
this.setLocalDirty(k.POSITION);
1 & this._eventMask && this.emit(H.POSITION_CHANGED);
},
getWorldRotation: function(t) {
n.trs.toRotation(N, this._trs);
n.quat.copy(t, N);
for (var e = this._parent; e; ) {
n.trs.toRotation(N, e._trs);
n.quat.mul(t, N, t);
e = e._parent;
}
return t;
},
setWorldRotation: function(t) {
if (this._parent) {
this._parent.getWorldRotation(P);
n.quat.conjugate(P, P);
n.quat.mul(P, P, t);
} else n.quat.copy(P, t);
n.trs.fromRotation(this._trs, P);
0;
this.setLocalDirty(k.ROTATION);
},
getWorldScale: function(t) {
n.trs.toScale(x, this._trs);
n.vec3.copy(t, x);
for (var e = this._parent; e; ) {
n.trs.toScale(x, e._trs);
n.vec3.mul(t, t, x);
e = e._parent;
}
return t;
},
setWorldScale: function(t) {
if (this._parent) {
this._parent.getWorldScale(b);
n.vec3.div(b, t, b);
} else n.vec3.copy(b, t);
n.trs.fromScale(this._trs, b);
this.setLocalDirty(k.SCALE);
},
getWorldRT: function(t) {
var e = S, i = w, r = this._trs;
n.trs.toPosition(e, r);
n.trs.toRotation(i, r);
for (var s = this._parent; s; ) {
r = s._trs;
n.trs.toScale(R, r);
n.vec3.mul(e, e, R);
n.trs.toRotation(L, r);
n.vec3.transformQuat(e, e, L);
n.trs.toPosition(R, r);
n.vec3.add(e, e, R);
n.quat.mul(i, L, i);
s = s._parent;
}
n.mat4.fromRT(t, i, e);
return t;
},
lookAt: function(t, e) {
this.getWorldPosition(O);
n.vec3.sub(O, O, t);
n.vec3.normalize(O, O);
n.quat.fromViewUp(M, O, e);
this.setWorldRotation(M);
},
_updateLocalMatrix: function() {
var t = this._localMatDirty;
if (t) {
var e = this._matrix.m, i = this._trs;
if (t & (k.RS | k.SKEW)) {
var n = -this._eulerAngles.z, r = this._skewX || this._skewY, s = i[7], o = i[8];
if (n || r) {
var a = 1, c = 0, l = 0, u = 1;
if (n) {
var h = n * _;
l = Math.sin(h);
a = u = Math.cos(h);
c = -l;
}
e[0] = a *= s;
e[1] = c *= s;
e[4] = l *= o;
e[5] = u *= o;
if (r) {
var f = e[0], d = e[1], p = e[4], v = e[5], g = Math.tan(this._skewX * _), m = Math.tan(this._skewY * _);
Infinity === g && (g = 99999999);
Infinity === m && (m = 99999999);
e[0] = f + p * m;
e[1] = d + v * m;
e[4] = p + f * g;
e[5] = v + d * g;
}
} else {
e[0] = s;
e[1] = 0;
e[4] = 0;
e[5] = o;
}
}
e[12] = i[0];
e[13] = i[1];
this._localMatDirty = 0;
this._worldMatDirty = !0;
}
},
_calculWorldMatrix: function() {
this._localMatDirty && this._updateLocalMatrix();
var t = this._parent;
t ? this._mulMat(this._worldMatrix, t._worldMatrix, this._matrix) : n.mat4.copy(this._worldMatrix, this._matrix);
this._worldMatDirty = !1;
},
_mulMat: function(t, e, i) {
var n = e.m, r = i.m, s = t.m, o = n[0], a = n[1], c = n[4], l = n[5], u = n[12], h = n[13], f = r[0], d = r[1], _ = r[4], p = r[5], v = r[12], g = r[13];
if (0 !== a || 0 !== c) {
s[0] = f * o + d * c;
s[1] = f * a + d * l;
s[4] = _ * o + p * c;
s[5] = _ * a + p * l;
s[12] = o * v + c * g + u;
s[13] = a * v + l * g + h;
} else {
s[0] = f * o;
s[1] = d * l;
s[4] = _ * o;
s[5] = p * l;
s[12] = o * v + u;
s[13] = l * g + h;
}
},
_updateWorldMatrix: function() {
this._parent && this._parent._updateWorldMatrix();
if (this._worldMatDirty) {
this._calculWorldMatrix();
for (var t = this._children, e = 0, i = t.length; e < i; e++) t[e]._worldMatDirty = !0;
}
},
setLocalDirty: function(t) {
this._localMatDirty |= t;
this._worldMatDirty = !0;
t === k.POSITION ? this._renderFlag |= f.FLAG_WORLD_TRANSFORM : this._renderFlag |= f.FLAG_TRANSFORM;
},
setWorldDirty: function() {
this._worldMatDirty = !0;
},
getLocalMatrix: function(t) {
this._updateLocalMatrix();
return n.mat4.copy(t, this._matrix);
},
getWorldMatrix: function(t) {
this._updateWorldMatrix();
return n.mat4.copy(t, this._worldMatrix);
},
convertToNodeSpaceAR: function(t, e) {
this._updateWorldMatrix();
n.mat4.invert(F, this._worldMatrix);
if (t instanceof cc.Vec2) {
e = e || new cc.Vec2();
return n.vec2.transformMat4(e, t, F);
}
e = e || new cc.Vec3();
return n.vec3.transformMat4(e, t, F);
},
convertToWorldSpaceAR: function(t, e) {
this._updateWorldMatrix();
if (t instanceof cc.Vec2) {
e = e || new cc.Vec2();
return n.vec2.transformMat4(e, t, this._worldMatrix);
}
e = e || new cc.Vec3();
return n.vec3.transformMat4(e, t, this._worldMatrix);
},
convertToNodeSpace: function(t) {
this._updateWorldMatrix();
n.mat4.invert(F, this._worldMatrix);
var e = new cc.Vec2();
n.vec2.transformMat4(e, t, F);
e.x += this._anchorPoint.x * this._contentSize.width;
e.y += this._anchorPoint.y * this._contentSize.height;
return e;
},
convertToWorldSpace: function(t) {
this._updateWorldMatrix();
var e = new cc.Vec2(t.x - this._anchorPoint.x * this._contentSize.width, t.y - this._anchorPoint.y * this._contentSize.height);
return n.vec2.transformMat4(e, e, this._worldMatrix);
},
getNodeToParentTransform: function(t) {
t || (t = a.identity());
this._updateLocalMatrix();
var e = this._contentSize;
B.x = -this._anchorPoint.x * e.width;
B.y = -this._anchorPoint.y * e.height;
n.mat4.copy(F, this._matrix);
n.mat4.translate(F, F, B);
return a.fromMat4(t, F);
},
getNodeToParentTransformAR: function(t) {
t || (t = a.identity());
this._updateLocalMatrix();
return a.fromMat4(t, this._matrix);
},
getNodeToWorldTransform: function(t) {
t || (t = a.identity());
this._updateWorldMatrix();
var e = this._contentSize;
B.x = -this._anchorPoint.x * e.width;
B.y = -this._anchorPoint.y * e.height;
n.mat4.copy(F, this._worldMatrix);
n.mat4.translate(F, F, B);
return a.fromMat4(t, F);
},
getNodeToWorldTransformAR: function(t) {
t || (t = a.identity());
this._updateWorldMatrix();
return a.fromMat4(t, this._worldMatrix);
},
getParentToNodeTransform: function(t) {
t || (t = a.identity());
this._updateLocalMatrix();
n.mat4.invert(F, this._matrix);
return a.fromMat4(t, F);
},
getWorldToNodeTransform: function(t) {
t || (t = a.identity());
this._updateWorldMatrix();
n.mat4.invert(F, this._worldMatrix);
return a.fromMat4(t, F);
},
convertTouchToNodeSpace: function(t) {
return this.convertToNodeSpace(t.getLocation());
},
convertTouchToNodeSpaceAR: function(t) {
return this.convertToNodeSpaceAR(t.getLocation());
},
getBoundingBox: function() {
this._updateLocalMatrix();
var t = this._contentSize.width, e = this._contentSize.height, i = cc.rect(-this._anchorPoint.x * t, -this._anchorPoint.y * e, t, e);
return i.transformMat4(i, this._matrix);
},
getBoundingBoxToWorld: function() {
if (this._parent) {
this._parent._updateWorldMatrix();
return this._getBoundingBoxTo(this._parent._worldMatrix);
}
return this.getBoundingBox();
},
_getBoundingBoxTo: function(t) {
this._updateLocalMatrix();
var e = this._contentSize.width, i = this._contentSize.height, r = cc.rect(-this._anchorPoint.x * e, -this._anchorPoint.y * i, e, i);
t = n.mat4.mul(this._worldMatrix, t, this._matrix);
r.transformMat4(r, t);
if (!this._children) return r;
for (var s = this._children, o = 0; o < s.length; o++) {
var a = s[o];
if (a && a.active) {
var c = a._getBoundingBoxTo(t);
c && r.union(r, c);
}
}
return r;
},
_updateOrderOfArrival: function() {
var t = this._parent ? ++this._parent._childArrivalOrder : 0;
this._localZOrder = 4294901760 & this._localZOrder | t;
if (65535 === t) {
var e = this._parent._children;
e.forEach((function(t, e) {
t._localZOrder = 4294901760 & t._localZOrder | e + 1;
}));
this._parent._childArrivalOrder = e.length;
}
this.emit(H.SIBLING_ORDER_CHANGED);
},
addChild: function(t, e, i) {
0;
cc.assertID(t, 1606);
cc.assertID(null === t._parent, 1605);
t.parent = this;
void 0 !== e && (t.zIndex = e);
void 0 !== i && (t.name = i);
},
cleanup: function() {
p && cc.director.getActionManager().removeAllActionsFromTarget(this);
c.removeListeners(this);
var t, e, i = this._children.length;
for (t = 0; t < i; ++t) (e = this._children[t]) && e.cleanup();
},
sortAllChildren: function() {
if (this._reorderChildDirty) {
c._setDirtyForNode(this);
this._reorderChildDirty = !1;
var t = this._children;
if (t.length > 1) {
var e, i, n, r = t.length;
for (e = 1; e < r; e++) {
n = t[e];
i = e - 1;
for (;i >= 0 && n._localZOrder < t[i]._localZOrder; ) {
t[i + 1] = t[i];
i--;
}
t[i + 1] = n;
}
this.emit(H.CHILD_REORDER, this);
}
cc.director.__fastOff(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
}
},
_delaySort: function() {
if (!this._reorderChildDirty) {
this._reorderChildDirty = !0;
cc.director.__fastOn(cc.Director.EVENT_AFTER_UPDATE, this.sortAllChildren, this);
}
},
_restoreProperties: !1,
onRestore: !1
};
0;
var at = cc.Class(ot), ct = at.prototype;
u.getset(ct, "position", ct.getPosition, ct.setPosition, !1, !0);
cc.Node = e.exports = at;
}), {
"./event-manager": 75,
"./event/event": 78,
"./event/event-target": 77,
"./platform/CCMacro": 115,
"./platform/js": 130,
"./renderer/render-flow": 156,
"./utils/affine-transform": 180,
"./utils/base-node": 181,
"./utils/prefab-helper": 190,
"./utils/trans-pool": 196,
"./vmath": 213
} ],
8: [ (function(t, e, i) {
"use strict";
var n = t("./CCNode"), r = (t("./renderer/render-flow"), cc.Object.Flags.HideInHierarchy, 
n._LocalDirtyFlag), s = cc.Class({
name: "cc.PrivateNode",
extends: n,
properties: {
x: {
get: function() {
return this._originPos.x;
},
set: function(t) {
var e = this._originPos;
if (t !== e.x) {
e.x = t;
this._posDirty(!0);
}
},
override: !0
},
y: {
get: function() {
return this._originPos.y;
},
set: function(t) {
var e = this._originPos;
if (t !== e.y) {
e.y = t;
this._posDirty(!0);
}
},
override: !0
},
zIndex: {
get: function() {
return cc.macro.MIN_ZINDEX;
},
set: function() {
cc.warnID(1638);
},
override: !0
},
showInEditor: {
default: !1,
editorOnly: !0,
override: !0
}
},
ctor: function(t) {
this._localZOrder = cc.macro.MIN_ZINDEX << 16;
this._originPos = cc.v2();
0;
},
_posDirty: function(t) {
this.setLocalDirty(r.POSITION);
!0 === t && 1 & this._eventMask && this.emit(n.EventType.POSITION_CHANGED);
},
_updateLocalMatrix: function() {
if (this._localMatDirty) {
var t = this.parent;
if (t) {
this._trs[0] = this._originPos.x - (t._anchorPoint.x - .5) * t._contentSize.width;
this._trs[1] = this._originPos.y - (t._anchorPoint.y - .5) * t._contentSize.height;
}
this._super();
}
},
getPosition: function() {
return new cc.Vec2(this._originPos);
},
setPosition: function(t, e) {
void 0 === e && (e = (t = t.x).y);
var i = this._originPos;
if (i.x !== t || i.y !== e) {
i.x = t;
i.y = e;
this._posDirty(!0);
}
},
setParent: function(t) {
var e = this._parent;
this._super(t);
if (e !== t) {
e && e.off(n.EventType.ANCHOR_CHANGED, this._posDirty, this);
t && t.on(n.EventType.ANCHOR_CHANGED, this._posDirty, this);
}
},
_updateOrderOfArrival: function() {}
});
cc.js.getset(s.prototype, "parent", s.prototype.getParent, s.prototype.setParent);
cc.js.getset(s.prototype, "position", s.prototype.getPosition, s.prototype.setPosition);
cc.PrivateNode = e.exports = s;
}), {
"./CCNode": 7,
"./renderer/render-flow": 156
} ],
9: [ (function(t, e, i) {
"use strict";
cc.Scene = cc.Class({
name: "cc.Scene",
extends: t("./CCNode"),
properties: {
_is3DNode: {
default: !0,
override: !0
},
autoReleaseAssets: {
default: void 0,
type: cc.Boolean
}
},
ctor: function() {
this._anchorPoint.x = 0;
this._anchorPoint.y = 0;
this._activeInHierarchy = !1;
this._inited = !cc.game._isCloning;
0;
this.dependAssets = null;
},
destroy: function() {
if (cc.Object.prototype.destroy.call(this)) for (var t = this._children, e = 0; e < t.length; ++e) t[e].active = !1;
this._active = !1;
this._activeInHierarchy = !1;
},
_onHierarchyChanged: function() {},
_instantiate: null,
_load: function() {
if (!this._inited) {
0;
this._onBatchCreated();
this._inited = !0;
}
},
_activate: function(t) {
t = !1 !== t;
0;
cc.director._nodeActivator.activateNode(this, t);
}
});
e.exports = cc.Scene;
}), {
"./CCNode": 7
} ],
10: [ (function(t, e, i) {
"use strict";
var n = t("./platform/js"), r = new (t("./platform/id-generater"))("Scheduler"), s = function(t, e, i, n) {
this.target = t;
this.priority = e;
this.paused = i;
this.markedForDeletion = n;
}, o = [];
s.get = function(t, e, i, n) {
var r = o.pop();
if (r) {
r.target = t;
r.priority = e;
r.paused = i;
r.markedForDeletion = n;
} else r = new s(t, e, i, n);
return r;
};
s.put = function(t) {
if (o.length < 20) {
t.target = null;
o.push(t);
}
};
var a = function(t, e, i, n) {
this.list = t;
this.entry = e;
this.target = i;
this.callback = n;
}, c = [];
a.get = function(t, e, i, n) {
var r = c.pop();
if (r) {
r.list = t;
r.entry = e;
r.target = i;
r.callback = n;
} else r = new a(t, e, i, n);
return r;
};
a.put = function(t) {
if (c.length < 20) {
t.list = t.entry = t.target = t.callback = null;
c.push(t);
}
};
var l = function(t, e, i, n, r, s) {
var o = this;
o.timers = t;
o.target = e;
o.timerIndex = i;
o.currentTimer = n;
o.currentTimerSalvaged = r;
o.paused = s;
}, u = [];
l.get = function(t, e, i, n, r, s) {
var o = u.pop();
if (o) {
o.timers = t;
o.target = e;
o.timerIndex = i;
o.currentTimer = n;
o.currentTimerSalvaged = r;
o.paused = s;
} else o = new l(t, e, i, n, r, s);
return o;
};
l.put = function(t) {
if (u.length < 20) {
t.timers = t.target = t.currentTimer = null;
u.push(t);
}
};
function h() {
this._lock = !1;
this._scheduler = null;
this._elapsed = -1;
this._runForever = !1;
this._useDelay = !1;
this._timesExecuted = 0;
this._repeat = 0;
this._delay = 0;
this._interval = 0;
this._target = null;
this._callback = null;
}
var f = h.prototype;
f.initWithCallback = function(t, e, i, n, r, s) {
this._lock = !1;
this._scheduler = t;
this._target = i;
this._callback = e;
this._elapsed = -1;
this._interval = n;
this._delay = s;
this._useDelay = this._delay > 0;
this._repeat = r;
this._runForever = this._repeat === cc.macro.REPEAT_FOREVER;
return !0;
};
f.getInterval = function() {
return this._interval;
};
f.setInterval = function(t) {
this._interval = t;
};
f.update = function(t) {
if (-1 === this._elapsed) {
this._elapsed = 0;
this._timesExecuted = 0;
} else {
this._elapsed += t;
if (this._runForever && !this._useDelay) {
if (this._elapsed >= this._interval) {
this.trigger();
this._elapsed = 0;
}
} else {
if (this._useDelay) {
if (this._elapsed >= this._delay) {
this.trigger();
this._elapsed -= this._delay;
this._timesExecuted += 1;
this._useDelay = !1;
}
} else if (this._elapsed >= this._interval) {
this.trigger();
this._elapsed = 0;
this._timesExecuted += 1;
}
this._callback && !this._runForever && this._timesExecuted > this._repeat && this.cancel();
}
}
};
f.getCallback = function() {
return this._callback;
};
f.trigger = function() {
if (this._target && this._callback) {
this._lock = !0;
this._callback.call(this._target, this._elapsed);
this._lock = !1;
}
};
f.cancel = function() {
this._scheduler.unschedule(this._callback, this._target);
};
var d = [];
h.get = function() {
return d.pop() || new h();
};
h.put = function(t) {
if (d.length < 20 && !t._lock) {
t._scheduler = t._target = t._callback = null;
d.push(t);
}
};
cc.Scheduler = function() {
this._timeScale = 1;
this._updatesNegList = [];
this._updates0List = [];
this._updatesPosList = [];
this._hashForUpdates = n.createMap(!0);
this._hashForTimers = n.createMap(!0);
this._currentTarget = null;
this._currentTargetSalvaged = !1;
this._updateHashLocked = !1;
this._arrayForTimers = [];
};
cc.Scheduler.prototype = {
constructor: cc.Scheduler,
_removeHashElement: function(t) {
delete this._hashForTimers[t.target._id];
for (var e = this._arrayForTimers, i = 0, n = e.length; i < n; i++) if (e[i] === t) {
e.splice(i, 1);
break;
}
l.put(t);
},
_removeUpdateFromHash: function(t) {
var e = t.target._id, i = this._hashForUpdates[e];
if (i) {
for (var n = i.list, r = i.entry, o = 0, c = n.length; o < c; o++) if (n[o] === r) {
n.splice(o, 1);
break;
}
delete this._hashForUpdates[e];
s.put(r);
a.put(i);
}
},
_priorityIn: function(t, e, i) {
for (var n = 0; n < t.length; n++) if (i < t[n].priority) {
t.splice(n, 0, e);
return;
}
t.push(e);
},
_appendIn: function(t, e) {
t.push(e);
},
enableForTarget: function(t) {
t._id || (t.__instanceId ? cc.warnID(1513) : t._id = r.getNewId());
},
setTimeScale: function(t) {
this._timeScale = t;
},
getTimeScale: function() {
return this._timeScale;
},
update: function(t) {
this._updateHashLocked = !0;
1 !== this._timeScale && (t *= this._timeScale);
var e, i, n, r;
for (e = 0, n = (i = this._updatesNegList).length; e < n; e++) (r = i[e]).paused || r.markedForDeletion || r.target.update(t);
for (e = 0, n = (i = this._updates0List).length; e < n; e++) (r = i[e]).paused || r.markedForDeletion || r.target.update(t);
for (e = 0, n = (i = this._updatesPosList).length; e < n; e++) (r = i[e]).paused || r.markedForDeletion || r.target.update(t);
var s, o = this._arrayForTimers;
for (e = 0; e < o.length; e++) {
s = o[e];
this._currentTarget = s;
this._currentTargetSalvaged = !1;
if (!s.paused) for (s.timerIndex = 0; s.timerIndex < s.timers.length; ++s.timerIndex) {
s.currentTimer = s.timers[s.timerIndex];
s.currentTimerSalvaged = !1;
s.currentTimer.update(t);
s.currentTimer = null;
}
if (this._currentTargetSalvaged && 0 === this._currentTarget.timers.length) {
this._removeHashElement(this._currentTarget);
--e;
}
}
for (e = 0, i = this._updatesNegList; e < i.length; ) (r = i[e]).markedForDeletion ? this._removeUpdateFromHash(r) : e++;
for (e = 0, i = this._updates0List; e < i.length; ) (r = i[e]).markedForDeletion ? this._removeUpdateFromHash(r) : e++;
for (e = 0, i = this._updatesPosList; e < i.length; ) (r = i[e]).markedForDeletion ? this._removeUpdateFromHash(r) : e++;
this._updateHashLocked = !1;
this._currentTarget = null;
},
schedule: function(t, e, i, n, r, s) {
if ("function" != typeof t) {
var o = t;
t = e;
e = o;
}
if (4 === arguments.length || 5 === arguments.length) {
s = !!n;
n = cc.macro.REPEAT_FOREVER;
r = 0;
}
cc.assertID(e, 1502);
var a = e._id;
if (!a) if (e.__instanceId) {
cc.warnID(1513);
a = e._id = e.__instanceId;
} else cc.errorID(1510);
var c, u, f = this._hashForTimers[a];
if (f) f.paused !== s && cc.warnID(1511); else {
f = l.get(null, e, 0, null, null, s);
this._arrayForTimers.push(f);
this._hashForTimers[a] = f;
}
if (null == f.timers) f.timers = []; else for (u = 0; u < f.timers.length; ++u) if ((c = f.timers[u]) && t === c._callback) {
cc.logID(1507, c.getInterval(), i);
c._interval = i;
return;
}
(c = h.get()).initWithCallback(this, t, e, i, n, r);
f.timers.push(c);
this._currentTarget === f && this._currentTargetSalvaged && (this._currentTargetSalvaged = !1);
},
scheduleUpdate: function(t, e, i) {
var n = t._id;
if (!n) if (t.__instanceId) {
cc.warnID(1513);
n = t._id = t.__instanceId;
} else cc.errorID(1510);
var r = this._hashForUpdates[n];
if (r && r.entry) {
if (r.entry.priority === e) {
r.entry.markedForDeletion = !1;
r.entry.paused = i;
return;
}
if (this._updateHashLocked) {
cc.logID(1506);
r.entry.markedForDeletion = !1;
r.entry.paused = i;
return;
}
this.unscheduleUpdate(t);
}
var o, c = s.get(t, e, i, !1);
if (0 === e) {
o = this._updates0List;
this._appendIn(o, c);
} else {
o = e < 0 ? this._updatesNegList : this._updatesPosList;
this._priorityIn(o, c, e);
}
this._hashForUpdates[n] = a.get(o, c, t, null);
},
unschedule: function(t, e) {
if (e && t) {
var i = e._id;
if (!i) if (e.__instanceId) {
cc.warnID(1513);
i = e._id = e.__instanceId;
} else cc.errorID(1510);
var n = this._hashForTimers[i];
if (n) for (var r = n.timers, s = 0, o = r.length; s < o; s++) {
var a = r[s];
if (t === a._callback) {
a !== n.currentTimer || n.currentTimerSalvaged || (n.currentTimerSalvaged = !0);
r.splice(s, 1);
h.put(a);
n.timerIndex >= s && n.timerIndex--;
0 === r.length && (this._currentTarget === n ? this._currentTargetSalvaged = !0 : this._removeHashElement(n));
return;
}
}
}
},
unscheduleUpdate: function(t) {
if (t) {
var e = t._id;
if (!e) if (t.__instanceId) {
cc.warnID(1513);
e = t._id = t.__instanceId;
} else cc.errorID(1510);
var i = this._hashForUpdates[e];
i && (this._updateHashLocked ? i.entry.markedForDeletion = !0 : this._removeUpdateFromHash(i.entry));
}
},
unscheduleAllForTarget: function(t) {
if (t) {
var e = t._id;
if (!e) if (t.__instanceId) {
cc.warnID(1513);
e = t._id = t.__instanceId;
} else cc.errorID(1510);
var i = this._hashForTimers[e];
if (i) {
var n = i.timers;
n.indexOf(i.currentTimer) > -1 && !i.currentTimerSalvaged && (i.currentTimerSalvaged = !0);
for (var r = 0, s = n.length; r < s; r++) h.put(n[r]);
n.length = 0;
this._currentTarget === i ? this._currentTargetSalvaged = !0 : this._removeHashElement(i);
}
this.unscheduleUpdate(t);
}
},
unscheduleAll: function() {
this.unscheduleAllWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
},
unscheduleAllWithMinPriority: function(t) {
var e, i, n, r = this._arrayForTimers;
for (e = r.length - 1; e >= 0; e--) {
i = r[e];
this.unscheduleAllForTarget(i.target);
}
var s = 0;
if (t < 0) for (e = 0; e < this._updatesNegList.length; ) {
s = this._updatesNegList.length;
(n = this._updatesNegList[e]) && n.priority >= t && this.unscheduleUpdate(n.target);
s == this._updatesNegList.length && e++;
}
if (t <= 0) for (e = 0; e < this._updates0List.length; ) {
s = this._updates0List.length;
(n = this._updates0List[e]) && this.unscheduleUpdate(n.target);
s == this._updates0List.length && e++;
}
for (e = 0; e < this._updatesPosList.length; ) {
s = this._updatesPosList.length;
(n = this._updatesPosList[e]) && n.priority >= t && this.unscheduleUpdate(n.target);
s == this._updatesPosList.length && e++;
}
},
isScheduled: function(t, e) {
cc.assertID(t, 1508);
cc.assertID(e, 1509);
var i = e._id;
if (!i) if (e.__instanceId) {
cc.warnID(1513);
i = e._id = e.__instanceId;
} else cc.errorID(1510);
var n = this._hashForTimers[i];
if (!n) return !1;
if (null == n.timers) return !1;
for (var r = n.timers, s = 0; s < r.length; ++s) {
if (t === r[s]._callback) return !0;
}
return !1;
},
pauseAllTargets: function() {
return this.pauseAllTargetsWithMinPriority(cc.Scheduler.PRIORITY_SYSTEM);
},
pauseAllTargetsWithMinPriority: function(t) {
var e, i, n, r, s = [], o = this._arrayForTimers;
for (i = 0, n = o.length; i < n; i++) if (e = o[i]) {
e.paused = !0;
s.push(e.target);
}
if (t < 0) for (i = 0; i < this._updatesNegList.length; i++) if ((r = this._updatesNegList[i]) && r.priority >= t) {
r.paused = !0;
s.push(r.target);
}
if (t <= 0) for (i = 0; i < this._updates0List.length; i++) if (r = this._updates0List[i]) {
r.paused = !0;
s.push(r.target);
}
for (i = 0; i < this._updatesPosList.length; i++) if ((r = this._updatesPosList[i]) && r.priority >= t) {
r.paused = !0;
s.push(r.target);
}
return s;
},
resumeTargets: function(t) {
if (t) for (var e = 0; e < t.length; e++) this.resumeTarget(t[e]);
},
pauseTarget: function(t) {
cc.assertID(t, 1503);
var e = t._id;
if (!e) if (t.__instanceId) {
cc.warnID(1513);
e = t._id = t.__instanceId;
} else cc.errorID(1510);
var i = this._hashForTimers[e];
i && (i.paused = !0);
var n = this._hashForUpdates[e];
n && (n.entry.paused = !0);
},
resumeTarget: function(t) {
cc.assertID(t, 1504);
var e = t._id;
if (!e) if (t.__instanceId) {
cc.warnID(1513);
e = t._id = t.__instanceId;
} else cc.errorID(1510);
var i = this._hashForTimers[e];
i && (i.paused = !1);
var n = this._hashForUpdates[e];
n && (n.entry.paused = !1);
},
isTargetPaused: function(t) {
cc.assertID(t, 1505);
var e = t._id;
if (!e) if (t.__instanceId) {
cc.warnID(1513);
e = t._id = t.__instanceId;
} else cc.errorID(1510);
var i = this._hashForTimers[e];
if (i) return i.paused;
var n = this._hashForUpdates[e];
return !!n && n.entry.paused;
}
};
cc.Scheduler.PRIORITY_SYSTEM = 1 << 31;
cc.Scheduler.PRIORITY_NON_SYSTEM = cc.Scheduler.PRIORITY_SYSTEM + 1;
e.exports = cc.Scheduler;
}), {
"./platform/id-generater": 126,
"./platform/js": 130
} ],
11: [ (function(t, e, i) {
"use strict";
var n = t("./CCRawAsset");
cc.Asset = cc.Class({
name: "cc.Asset",
extends: n,
ctor: function() {
this.loaded = !0;
this.url = "";
},
properties: {
nativeUrl: {
get: function() {
if (this._native) {
var t = this._native;
if (47 === t.charCodeAt(0)) return t.slice(1);
if (cc.AssetLibrary) {
var e = cc.AssetLibrary.getLibUrlNoExt(this._uuid, !0);
return 46 === t.charCodeAt(0) ? e + t : e + "/" + t;
}
cc.errorID(6400);
}
return "";
},
visible: !1
},
_native: "",
_nativeAsset: {
get: function() {
return this._$nativeAsset;
},
set: function(t) {
this._$nativeAsset = t;
}
}
},
statics: {
deserialize: !1,
preventDeferredLoadDependents: !1,
preventPreloadNativeObject: !1
},
toString: function() {
return this.nativeUrl;
},
serialize: !1,
createNode: null,
_setRawAsset: function(t, e) {
this._native = !1 !== e ? t || void 0 : "/" + t;
}
});
e.exports = cc.Asset;
}), {
"./CCRawAsset": 20
} ],
12: [ (function(t, e, i) {
"use strict";
var n = t("./CCAsset"), r = t("../event/event-target"), s = cc.Enum({
WEB_AUDIO: 0,
DOM_AUDIO: 1
}), o = cc.Class({
name: "cc.AudioClip",
extends: n,
mixins: [ r ],
ctor: function() {
this.loaded = !1;
this._audio = null;
},
properties: {
loadMode: {
default: s.WEB_AUDIO,
type: s
},
_nativeAsset: {
get: function() {
return this._audio;
},
set: function(t) {
t instanceof cc.AudioClip ? this._audio = t._nativeAsset : this._audio = t;
if (this._audio) {
this.loaded = !0;
this.emit("load");
}
},
override: !0
}
},
statics: {
LoadMode: s,
_loadByUrl: function(t, e) {
var i = cc.loader.getItem(t) || cc.loader.getItem(t + "?useDom=1");
i && i.complete ? i._owner instanceof o ? e(null, i._owner) : e(null, i.content) : cc.loader.load(t, (function(n, r) {
if (n) return e(n);
i = cc.loader.getItem(t) || cc.loader.getItem(t + "?useDom=1");
e(null, i.content);
}));
}
},
destroy: function() {
cc.audioEngine.uncache(this);
this._super();
}
});
cc.AudioClip = o;
e.exports = o;
}), {
"../event/event-target": 77,
"./CCAsset": 11
} ],
13: [ (function(t, e, i) {
"use strict";
var n = function() {
this.u = 0;
this.v = 0;
this.w = 0;
this.h = 0;
this.offsetX = 0;
this.offsetY = 0;
this.textureID = 0;
this.valid = !1;
this.xAdvance = 0;
}, r = function(t) {
this._letterDefinitions = {};
this._texture = t;
};
r.prototype = {
constructor: r,
addLetterDefinitions: function(t, e) {
this._letterDefinitions[t] = e;
},
cloneLetterDefinition: function() {
var t = {};
for (var e in this._letterDefinitions) {
var i = new n();
cc.js.mixin(i, this._letterDefinitions[e]);
t[e] = i;
}
return t;
},
getTexture: function() {
return this._texture;
},
getLetter: function(t) {
return this._letterDefinitions[t];
},
getLetterDefinitionForChar: function(t) {
var e = t.charCodeAt(0);
return this._letterDefinitions.hasOwnProperty(e) ? this._letterDefinitions[e] : null;
},
clear: function() {
this._letterDefinitions = {};
}
};
var s = cc.Class({
name: "cc.BitmapFont",
extends: cc.Font,
properties: {
fntDataStr: {
default: ""
},
spriteFrame: {
default: null,
type: cc.SpriteFrame
},
fontSize: {
default: -1
},
_fntConfig: null,
_fontDefDictionary: null
},
onLoad: function() {
var t = this.spriteFrame;
!this._fontDefDictionary && t && (this._fontDefDictionary = new r(t._texture));
var e = this._fntConfig;
if (e) {
var i = e.fontDefDictionary;
for (var s in i) {
var o = new n(), a = i[s].rect;
o.offsetX = i[s].xOffset;
o.offsetY = i[s].yOffset;
o.w = a.width;
o.h = a.height;
o.u = a.x;
o.v = a.y;
o.textureID = 0;
o.valid = !0;
o.xAdvance = i[s].xAdvance;
this._fontDefDictionary.addLetterDefinitions(s, o);
}
}
}
});
cc.BitmapFont = s;
cc.BitmapFont.FontLetterDefinition = n;
cc.BitmapFont.FontAtlas = r;
e.exports = s;
}), {} ],
14: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.BufferAsset",
extends: cc.Asset,
ctor: function() {
this._buffer = null;
},
properties: {
_nativeAsset: {
get: function() {
return this._buffer;
},
set: function(t) {
this._buffer = t.buffer || t;
},
override: !0
},
buffer: function() {
return this._buffer;
}
}
});
cc.BufferAsset = e.exports = n;
}), {} ],
15: [ (function(t, e, i) {
"use strict";
var n = t("./CCAsset"), r = t("../../renderer/core/effect"), s = cc.Class({
name: "cc.EffectAsset",
extends: n,
ctor: function() {
this._effect = null;
},
properties: {
properties: Object,
techniques: [],
shaders: []
},
onLoad: function() {
if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
for (var t = cc.renderer._forward._programLib, e = 0; e < this.shaders.length; e++) t.define(this.shaders[e]);
this._initEffect();
}
},
_initEffect: function() {
this._effect || (this._effect = r.parseEffect(this));
},
getInstantiatedEffect: function() {
this._initEffect();
return this._effect.clone();
}
});
e.exports = cc.EffectAsset = s;
}), {
"../../renderer/core/effect": 229,
"./CCAsset": 11
} ],
16: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.Font",
extends: cc.Asset
});
cc.Font = e.exports = n;
}), {} ],
17: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.JsonAsset",
extends: cc.Asset,
properties: {
json: null
}
});
e.exports = cc.JsonAsset = n;
}), {} ],
18: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.LabelAtlas",
extends: cc.BitmapFont,
onLoad: function() {
this.spriteFrame ? this._fntConfig ? this._super() : cc.warnID(9101, this.name) : cc.warnID(9100, this.name);
}
});
cc.LabelAtlas = n;
e.exports = n;
}), {} ],
19: [ (function(t, e, i) {
"use strict";
var n = cc.Enum({
AUTO: 0,
SINGLE_INSTANCE: 1,
MULTI_INSTANCE: 2
}), r = cc.Class({
name: "cc.Prefab",
extends: cc.Asset,
ctor: function() {
this._createFunction = null;
this._instantiatedTimes = 0;
},
properties: {
data: null,
optimizationPolicy: n.AUTO,
asyncLoadAssets: !1,
readonly: {
default: !1,
editorOnly: !0
}
},
statics: {
OptimizationPolicy: n,
OptimizationPolicyThreshold: 3
},
createNode: !1,
compileCreateFunction: function() {
var e = t("../platform/instantiate-jit");
this._createFunction = e.compile(this.data);
},
_doInstantiate: function(t) {
this.data._prefab ? this.data._prefab._synced = !0 : cc.warnID(3700);
this._createFunction || this.compileCreateFunction();
return this._createFunction(t);
},
_instantiate: function() {
var t;
if (this.optimizationPolicy !== n.SINGLE_INSTANCE && (this.optimizationPolicy === n.MULTI_INSTANCE || this._instantiatedTimes + 1 >= r.OptimizationPolicyThreshold)) {
t = this._doInstantiate();
this.data._instantiate(t);
} else {
this.data._prefab._synced = !0;
t = this.data._instantiate();
}
++this._instantiatedTimes;
return t;
},
destroy: function() {
this.data && this.data.destroy();
this._super();
}
});
cc.Prefab = e.exports = r;
cc.js.obsolete(cc, "cc._Prefab", "Prefab");
}), {
"../platform/instantiate-jit": 128
} ],
20: [ (function(t, e, i) {
"use strict";
var n = t("../platform/CCObject"), r = t("../platform/js");
cc.RawAsset = cc.Class({
name: "cc.RawAsset",
extends: n,
ctor: function() {
Object.defineProperty(this, "_uuid", {
value: "",
writable: !0
});
}
});
r.value(cc.RawAsset, "isRawAssetType", (function(t) {
return r.isChildClassOf(t, cc.RawAsset) && !r.isChildClassOf(t, cc.Asset);
}));
r.value(cc.RawAsset, "wasRawAssetType", (function(t) {
return t === cc.Texture2D || t === cc.AudioClip || t === cc.ParticleAsset || t === cc.Asset;
}));
e.exports = cc.RawAsset;
}), {
"../platform/CCObject": 116,
"../platform/js": 130
} ],
21: [ (function(t, e, i) {
"use strict";
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../renderer/gfx"));
var r = t("../renderer"), s = t("./CCTexture2D"), o = cc.Class({
name: "cc.RenderTexture",
extends: s,
ctor: function() {
this._framebuffer = null;
},
initWithSize: function(t, e, i) {
this.width = Math.floor(t || cc.visibleRect.width);
this.height = Math.floor(e || cc.visibleRect.height);
this._resetUnderlyingMipmaps();
var s = {
colors: [ this._texture ]
};
this._depthStencilBuffer && this._depthStencilBuffer.destroy();
var o = void 0;
if (i) {
o = new n.default.RenderBuffer(r.device, i, t, e);
i === n.default.RB_FMT_D24S8 ? s.depthStencil = o : i === n.default.RB_FMT_S8 ? s.stencil = o : i === n.default.RB_FMT_D16 && (s.depth = o);
}
this._depthStencilBuffer = o;
this._framebuffer && this._framebuffer.destroy();
this._framebuffer = new n.default.FrameBuffer(r.device, t, e, s);
this._packable = !1;
this.loaded = !0;
this.emit("load");
},
updateSize: function(t, e) {
this.width = Math.floor(t || cc.visibleRect.width);
this.height = Math.floor(e || cc.visibleRect.height);
this._resetUnderlyingMipmaps();
var i = this._depthStencilBuffer;
i && i.update(this.width, this.height);
this._framebuffer._width = t;
this._framebuffer._height = e;
},
drawTextureAt: function(t, e, i) {
t._image && this._texture.updateSubImage({
x: e,
y: i,
image: t._image,
width: t.width,
height: t.height,
level: 0,
flipY: !1,
premultiplyAlpha: t._premultiplyAlpha
});
},
readPixels: function(t, e, i, n, r) {
if (!this._framebuffer || !this._texture) return t;
e = e || 0;
i = i || 0;
var s = n || this.width, o = r || this.height;
t = t || new Uint8Array(s * o * 4);
var a = cc.game._renderContext, c = a.getParameter(a.FRAMEBUFFER_BINDING);
a.bindFramebuffer(a.FRAMEBUFFER, this._framebuffer.getHandle());
a.readPixels(e, i, s, o, a.RGBA, a.UNSIGNED_BYTE, t);
a.bindFramebuffer(a.FRAMEBUFFER, c);
return t;
},
destroy: function() {
this._super();
if (this._framebuffer) {
this._framebuffer.destroy();
this._framebuffer = null;
}
}
});
cc.RenderTexture = e.exports = o;
}), {
"../../renderer/gfx": 234,
"../renderer": 155,
"./CCTexture2D": 28
} ],
22: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.SceneAsset",
extends: cc.Asset,
properties: {
scene: null,
asyncLoadAssets: void 0
}
});
cc.SceneAsset = n;
e.exports = n;
}), {} ],
23: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.Script",
extends: cc.Asset
});
cc._Script = n;
var r = cc.Class({
name: "cc.JavaScript",
extends: n
});
cc._JavaScript = r;
var s = cc.Class({
name: "cc.CoffeeScript",
extends: n
});
cc._CoffeeScript = s;
var o = cc.Class({
name: "cc.TypeScript",
extends: n
});
cc._TypeScript = o;
}), {} ],
24: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.SpriteAtlas",
extends: cc.Asset,
properties: {
_spriteFrames: {
default: {}
}
},
getTexture: function() {
var t = Object.keys(this._spriteFrames);
if (t.length > 0) {
var e = this._spriteFrames[t[0]];
return e ? e.getTexture() : null;
}
return null;
},
getSpriteFrame: function(t) {
var e = this._spriteFrames[t];
if (!e) return null;
e.name || (e.name = t);
return e;
},
getSpriteFrames: function() {
var t = [], e = this._spriteFrames;
for (var i in e) t.push(this.getSpriteFrame(i));
return t;
}
});
cc.SpriteAtlas = n;
e.exports = n;
}), {} ],
25: [ (function(t, e, i) {
"use strict";
var n = t("../event/event-target"), r = t("../utils/texture-util"), s = [ {
u: 0,
v: 0
}, {
u: 0,
v: 0
}, {
u: 0,
v: 0
}, {
u: 0,
v: 0
} ], o = cc.Class({
name: "cc.SpriteFrame",
extends: t("../assets/CCAsset"),
mixins: [ n ],
properties: {
_textureSetter: {
set: function(t) {
if (t) {
0;
this._texture !== t && this._refreshTexture(t);
this._textureFilename = t.url;
}
}
},
insetTop: {
get: function() {
return this._capInsets[1];
},
set: function(t) {
this._capInsets[1] = t;
this._texture && this._calculateSlicedUV();
}
},
insetBottom: {
get: function() {
return this._capInsets[3];
},
set: function(t) {
this._capInsets[3] = t;
this._texture && this._calculateSlicedUV();
}
},
insetLeft: {
get: function() {
return this._capInsets[0];
},
set: function(t) {
this._capInsets[0] = t;
this._texture && this._calculateSlicedUV();
}
},
insetRight: {
get: function() {
return this._capInsets[2];
},
set: function(t) {
this._capInsets[2] = t;
this._texture && this._calculateSlicedUV();
}
}
},
ctor: function() {
n.call(this);
var t = arguments[0], e = arguments[1], i = arguments[2], r = arguments[3], s = arguments[4];
this._rect = null;
this.uv = [];
this._texture = null;
this._original = null;
this._offset = null;
this._originalSize = null;
this._rotated = !1;
this.vertices = null;
this._capInsets = [ 0, 0, 0, 0 ];
this.uvSliced = [];
this._textureFilename = "";
0;
void 0 !== t && this.setTexture(t, e, i, r, s);
},
textureLoaded: function() {
return this._texture && this._texture.loaded;
},
isRotated: function() {
return this._rotated;
},
setRotated: function(t) {
this._rotated = t;
this._texture && this._calculateUV();
},
getRect: function() {
return cc.rect(this._rect);
},
setRect: function(t) {
this._rect = t;
this._texture && this._calculateUV();
},
getOriginalSize: function() {
return cc.size(this._originalSize);
},
setOriginalSize: function(t) {
if (this._originalSize) {
this._originalSize.width = t.width;
this._originalSize.height = t.height;
} else this._originalSize = cc.size(t);
},
getTexture: function() {
return this._texture;
},
_textureLoadedCallback: function() {
var t = this._texture;
if (t) {
var e = t.width, i = t.height;
this._rect ? this._checkRect(this._texture) : this._rect = cc.rect(0, 0, e, i);
this._originalSize || this.setOriginalSize(cc.size(e, i));
this._offset || this.setOffset(cc.v2(0, 0));
this._calculateUV();
this.emit("load");
}
},
_refreshTexture: function(t) {
this._texture = t;
t.loaded ? this._textureLoadedCallback() : t.once("load", this._textureLoadedCallback, this);
},
getOffset: function() {
return cc.v2(this._offset);
},
setOffset: function(t) {
this._offset = cc.v2(t);
},
clone: function() {
return new o(this._texture || this._textureFilename, this._rect, this._rotated, this._offset, this._originalSize);
},
setTexture: function(t, e, i, n, r) {
this._rect = e || null;
n ? this.setOffset(n) : this._offset = null;
r ? this.setOriginalSize(r) : this._originalSize = null;
this._rotated = i || !1;
var s = t;
if ("string" == typeof s && s) {
this._textureFilename = s;
this._loadTexture();
}
s instanceof cc.Texture2D && this._texture !== s && this._refreshTexture(s);
return !0;
},
_loadTexture: function() {
if (this._textureFilename) {
var t = r.loadImage(this._textureFilename);
this._refreshTexture(t);
}
},
ensureLoadTexture: function() {
if (this._texture) {
if (!this._texture.loaded) {
this._refreshTexture(this._texture);
r.postLoadTexture(this._texture);
}
} else this._textureFilename && this._loadTexture();
},
_checkRect: function(t) {
var e = this._rect, i = e.x, n = e.y;
if (this._rotated) {
i += e.height;
n += e.width;
} else {
i += e.width;
n += e.height;
}
i > t.width && cc.errorID(3300, t.url + "/" + this.name, i, t.width);
n > t.height && cc.errorID(3400, t.url + "/" + this.name, n, t.height);
},
_calculateSlicedUV: function() {
var t = this._rect, e = this._texture.width, i = this._texture.height, n = this._capInsets[0], r = this._capInsets[2], o = t.width - n - r, a = this._capInsets[1], c = this._capInsets[3], l = t.height - a - c, u = this.uvSliced;
u.length = 0;
if (this._rotated) {
s[0].u = t.x / e;
s[1].u = (t.x + c) / e;
s[2].u = (t.x + c + l) / e;
s[3].u = (t.x + t.height) / e;
s[3].v = t.y / i;
s[2].v = (t.y + n) / i;
s[1].v = (t.y + n + o) / i;
s[0].v = (t.y + t.width) / i;
for (var h = 0; h < 4; ++h) for (var f = s[h], d = 0; d < 4; ++d) {
var _ = s[3 - d];
u.push({
u: f.u,
v: _.v
});
}
} else {
s[0].u = t.x / e;
s[1].u = (t.x + n) / e;
s[2].u = (t.x + n + o) / e;
s[3].u = (t.x + t.width) / e;
s[3].v = t.y / i;
s[2].v = (t.y + a) / i;
s[1].v = (t.y + a + l) / i;
s[0].v = (t.y + t.height) / i;
for (var p = 0; p < 4; ++p) for (var v = s[p], g = 0; g < 4; ++g) {
var m = s[g];
u.push({
u: m.u,
v: v.v
});
}
}
},
_setDynamicAtlasFrame: function(t) {
if (t) {
this._original = {
_texture: this._texture,
_x: this._rect.x,
_y: this._rect.y
};
this._texture = t.texture;
this._rect.x = t.x;
this._rect.y = t.y;
this._calculateUV();
}
},
_resetDynamicAtlasFrame: function() {
if (this._original) {
this._rect.x = this._original._x;
this._rect.y = this._original._y;
this._texture = this._original._texture;
this._original = null;
this._calculateUV();
}
},
_calculateUV: function() {
var t = this._rect, e = this._texture, i = this.uv, n = e.width, r = e.height;
if (this._rotated) {
var s = 0 === n ? 0 : t.x / n, o = 0 === n ? 0 : (t.x + t.height) / n, a = 0 === r ? 0 : (t.y + t.width) / r, c = 0 === r ? 0 : t.y / r;
i[0] = s;
i[1] = c;
i[2] = s;
i[3] = a;
i[4] = o;
i[5] = c;
i[6] = o;
i[7] = a;
} else {
var l = 0 === n ? 0 : t.x / n, u = 0 === n ? 0 : (t.x + t.width) / n, h = 0 === r ? 0 : (t.y + t.height) / r, f = 0 === r ? 0 : t.y / r;
i[0] = l;
i[1] = h;
i[2] = u;
i[3] = h;
i[4] = l;
i[5] = f;
i[6] = u;
i[7] = f;
}
var d = this.vertices;
if (d) {
d.nu.length = 0;
d.nv.length = 0;
for (var _ = 0; _ < d.u.length; _++) {
d.nu[_] = d.u[_] / n;
d.nv[_] = d.v[_] / r;
}
}
this._calculateSlicedUV();
},
_serialize: !1,
_deserialize: function(t, e) {
var i = t.rect;
i && (this._rect = new cc.Rect(i[0], i[1], i[2], i[3]));
t.offset && this.setOffset(new cc.Vec2(t.offset[0], t.offset[1]));
t.originalSize && this.setOriginalSize(new cc.Size(t.originalSize[0], t.originalSize[1]));
this._rotated = 1 === t.rotated;
this._name = t.name;
var n = t.capInsets;
if (n) {
this._capInsets[0] = n[0];
this._capInsets[1] = n[1];
this._capInsets[2] = n[2];
this._capInsets[3] = n[3];
}
0;
this.vertices = t.vertices;
if (this.vertices) {
this.vertices.nu = [];
this.vertices.nv = [];
}
var r = t.texture;
r && e.result.push(this, "_textureSetter", r);
}
}), a = o.prototype;
a.copyWithZone = a.clone;
a.copy = a.clone;
a.initWithTexture = a.setTexture;
cc.SpriteFrame = o;
e.exports = o;
}), {
"../assets/CCAsset": 11,
"../event/event-target": 77,
"../utils/texture-util": 195
} ],
26: [ (function(t, e, i) {
"use strict";
var n = t("./CCFont"), r = cc.Class({
name: "cc.TTFFont",
extends: n,
properties: {
_fontFamily: null,
_nativeAsset: {
type: cc.String,
get: function() {
return this._fontFamily;
},
set: function(t) {
this._fontFamily = t || "Arial";
},
override: !0
}
}
});
cc.TTFFont = e.exports = r;
}), {
"./CCFont": 16
} ],
27: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.TextAsset",
extends: cc.Asset,
properties: {
text: ""
},
toString: function() {
return this.text;
}
});
e.exports = cc.TextAsset = n;
}), {} ],
28: [ (function(t, e, i) {
"use strict";
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../renderer/gfx"));
var r = t("../event/event-target"), s = t("../renderer");
t("../platform/CCClass");
var o = new (t("../platform/id-generater"))("Tex"), a = 1024, c = cc.Enum({
RGB565: n.default.TEXTURE_FMT_R5_G6_B5,
RGB5A1: n.default.TEXTURE_FMT_R5_G5_B5_A1,
RGBA4444: n.default.TEXTURE_FMT_R4_G4_B4_A4,
RGB888: n.default.TEXTURE_FMT_RGB8,
RGBA8888: n.default.TEXTURE_FMT_RGBA8,
RGBA32F: n.default.TEXTURE_FMT_RGBA32F,
A8: n.default.TEXTURE_FMT_A8,
I8: n.default.TEXTURE_FMT_L8,
AI8: n.default.TEXTURE_FMT_L8_A8,
RGB_PVRTC_2BPPV1: n.default.TEXTURE_FMT_RGB_PVRTC_2BPPV1,
RGBA_PVRTC_2BPPV1: n.default.TEXTURE_FMT_RGBA_PVRTC_2BPPV1,
RGB_A_PVRTC_2BPPV1: a++,
RGB_PVRTC_4BPPV1: n.default.TEXTURE_FMT_RGB_PVRTC_4BPPV1,
RGBA_PVRTC_4BPPV1: n.default.TEXTURE_FMT_RGBA_PVRTC_4BPPV1,
RGB_A_PVRTC_4BPPV1: a++,
RGB_ETC1: n.default.TEXTURE_FMT_RGB_ETC1,
RGBA_ETC1: a++,
RGB_ETC2: n.default.TEXTURE_FMT_RGB_ETC2,
RGBA_ETC2: n.default.TEXTURE_FMT_RGBA_ETC2
}), l = cc.Enum({
REPEAT: 10497,
CLAMP_TO_EDGE: 33071,
MIRRORED_REPEAT: 33648
}), u = cc.Enum({
LINEAR: 9729,
NEAREST: 9728
}), h = {
9728: 0,
9729: 1
}, f = [], d = {
width: void 0,
height: void 0,
minFilter: void 0,
magFilter: void 0,
wrapS: void 0,
wrapT: void 0,
format: void 0,
genMipmaps: void 0,
images: void 0,
image: void 0,
flipY: void 0,
premultiplyAlpha: void 0
};
function _() {
for (var t in d) d[t] = void 0;
f.length = 0;
d.images = f;
d.flipY = !1;
return d;
}
var p = cc.Class({
name: "cc.Texture2D",
extends: t("../assets/CCAsset"),
mixins: [ r ],
properties: {
_nativeAsset: {
get: function() {
return this._image;
},
set: function(t) {
t._compressed && t._data ? this.initWithData(t._data, this._format, t.width, t.height) : this.initWithElement(t);
},
override: !0
},
_format: c.RGBA8888,
_premultiplyAlpha: !1,
_flipY: !1,
_minFilter: u.LINEAR,
_magFilter: u.LINEAR,
_mipFilter: u.LINEAR,
_wrapS: l.CLAMP_TO_EDGE,
_wrapT: l.CLAMP_TO_EDGE,
_genMipmaps: !1,
genMipmaps: {
get: function() {
return this._genMipmaps;
},
set: function(t) {
if (this._genMipmaps !== t) {
var e = _();
e.genMipmaps = t;
this.update(e);
}
}
},
_packable: !0,
packable: {
get: function() {
return this._packable;
},
set: function(t) {
this._packable = t;
}
}
},
statics: {
PixelFormat: c,
WrapMode: l,
Filter: u,
_FilterIndex: h,
extnames: [ ".png", ".jpg", ".jpeg", ".bmp", ".webp", ".pvr", ".pkm" ]
},
ctor: function() {
this._id = o.getNewId();
this.loaded = !1;
this.width = 0;
this.height = 0;
this._hashDirty = !0;
this._hash = 0;
this._texture = null;
0;
},
getImpl: function() {
return this._texture;
},
getId: function() {
return this._id;
},
toString: function() {
return this.url || "";
},
update: function(t) {
if (t) {
var e = !1;
void 0 !== t.width && (this.width = t.width);
void 0 !== t.height && (this.height = t.height);
if (void 0 !== t.minFilter) {
this._minFilter = t.minFilter;
t.minFilter = h[t.minFilter];
}
if (void 0 !== t.magFilter) {
this._magFilter = t.magFilter;
t.magFilter = h[t.magFilter];
}
if (void 0 !== t.mipFilter) {
this._mipFilter = t.mipFilter;
t.mipFilter = h[t.mipFilter];
}
void 0 !== t.wrapS && (this._wrapS = t.wrapS);
void 0 !== t.wrapT && (this._wrapT = t.wrapT);
void 0 !== t.format && (this._format = t.format);
if (void 0 !== t.flipY) {
this._flipY = t.flipY;
e = !0;
}
if (void 0 !== t.premultiplyAlpha) {
this._premultiplyAlpha = t.premultiplyAlpha;
e = !0;
}
void 0 !== t.genMipmaps && (this._genMipmaps = t.genMipmaps);
e && this._image && (t.image = this._image);
if (t.images && t.images.length > 0) this._image = t.images[0]; else if (void 0 !== t.image) {
this._image = t.image;
if (!t.images) {
f.length = 0;
t.images = f;
}
t.images.push(t.image);
}
t.images && t.images.length > 0 && this._texture.update(t);
this._hashDirty = !0;
}
},
initWithElement: function(t) {
if (t) {
this._image = t;
if (t.complete || t instanceof HTMLCanvasElement) this.handleLoadedTexture(); else {
var e = this;
t.addEventListener("load", (function() {
e.handleLoadedTexture();
}));
t.addEventListener("error", (function(t) {
cc.warnID(3119, t.message);
}));
}
}
},
initWithData: function(t, e, i, n) {
var r = _();
r.image = t;
r.images = [ r.image ];
r.genMipmaps = this._genMipmaps;
r.premultiplyAlpha = this._premultiplyAlpha;
r.flipY = this._flipY;
r.minFilter = h[this._minFilter];
r.magFilter = h[this._magFilter];
r.wrapS = this._wrapS;
r.wrapT = this._wrapT;
r.format = this._getGFXPixelFormat(e);
r.width = i;
r.height = n;
this._texture ? this._texture.update(r) : this._texture = new s.Texture2D(s.device, r);
this.width = i;
this.height = n;
this._checkPackable();
this.loaded = !0;
this.emit("load");
return !0;
},
getHtmlElementObj: function() {
return this._image;
},
destroy: function() {
this._image = null;
this._texture && this._texture.destroy();
this._super();
},
getPixelFormat: function() {
return this._format;
},
hasPremultipliedAlpha: function() {
return this._premultiplyAlpha || !1;
},
handleLoadedTexture: function() {
if (this._image && this._image.width && this._image.height) {
this.width = this._image.width;
this.height = this._image.height;
var t = _();
t.image = this._image;
t.images = [ t.image ];
t.width = this.width;
t.height = this.height;
t.genMipmaps = this._genMipmaps;
t.format = this._getGFXPixelFormat(this._format);
t.premultiplyAlpha = this._premultiplyAlpha;
t.flipY = this._flipY;
t.minFilter = h[this._minFilter];
t.magFilter = h[this._magFilter];
t.wrapS = this._wrapS;
t.wrapT = this._wrapT;
this._texture ? this._texture.update(t) : this._texture = new s.Texture2D(s.device, t);
this._checkPackable();
this.loaded = !0;
this.emit("load");
cc.macro.CLEANUP_IMAGE_CACHE && this._image instanceof HTMLImageElement && this._clearImage();
}
},
description: function() {
return "<cc.Texture2D | Name = " + this.url + " | Dimensions = " + this.width + " x " + this.height + ">";
},
releaseTexture: function() {
this._image = null;
this._texture && this._texture.destroy();
},
setWrapMode: function(t, e) {
if (this._wrapS !== t || this._wrapT !== e) {
var i = _();
i.wrapS = t;
i.wrapT = e;
this.update(i);
}
},
setFilters: function(t, e) {
if (this._minFilter !== t || this._magFilter !== e) {
var i = _();
i.minFilter = t;
i.magFilter = e;
this.update(i);
}
},
setFlipY: function(t) {
if (this._flipY !== t) {
var e = _();
e.flipY = t;
this.update(e);
}
},
setPremultiplyAlpha: function(t) {
if (this._premultiplyAlpha !== t) {
var e = _();
e.premultiplyAlpha = t;
this.update(e);
}
},
_checkPackable: function() {
var t = cc.dynamicAtlasManager;
if (t) if (this._isCompressed()) this._packable = !1; else {
var e = this.width, i = this.height;
!this._image || e > t.maxFrameSize || i > t.maxFrameSize || e <= t.minFrameSize || i <= t.minFrameSize || this._getHash() !== t.Atlas.DEFAULT_HASH ? this._packable = !1 : this._image && this._image instanceof HTMLCanvasElement && (this._packable = !0);
}
},
_getOpts: function() {
var t = _();
t.width = this.width;
t.height = this.height;
t.genMipmaps = this._genMipmaps;
t.format = this._format;
t.premultiplyAlpha = this._premultiplyAlpha;
t.anisotropy = this._anisotropy;
t.flipY = this._flipY;
t.minFilter = h[this._minFilter];
t.magFilter = h[this._magFilter];
t.mipFilter = h[this._mipFilter];
t.wrapS = this._wrapS;
t.wrapT = this._wrapT;
return t;
},
_getGFXPixelFormat: function(t) {
t === c.RGBA_ETC1 ? t = c.RGB_ETC1 : t === c.RGB_A_PVRTC_4BPPV1 ? t = c.RGB_PVRTC_4BPPV1 : t === c.RGB_A_PVRTC_2BPPV1 && (t = c.RGB_PVRTC_2BPPV1);
return t;
},
_resetUnderlyingMipmaps: function(t) {
var e = this._getOpts();
e.images = t || [ null ];
this._texture ? this._texture.update(e) : this._texture = new s.Texture2D(s.device, e);
},
_serialize: !1,
_deserialize: function(t, e) {
var i = cc.renderer.device, n = t.split(","), r = n[0];
if (r) {
for (var s = r.split("_"), o = "", a = "", l = 999, u = this._format, h = cc.macro.SUPPORT_TEXTURE_FORMATS, f = 0; f < s.length; f++) {
var d = s[f].split("@"), _ = d[0];
_ = p.extnames[_.charCodeAt(0) - 48] || _;
var v = h.indexOf(_);
if (-1 !== v && v < l) {
var g = d[1] ? parseInt(d[1]) : this._format;
if (".pvr" === _ && !i.ext("WEBGL_compressed_texture_pvrtc")) continue;
if (!(g !== c.RGB_ETC1 && g !== c.RGBA_ETC1 || i.ext("WEBGL_compressed_texture_etc1"))) continue;
if (!(g !== c.RGB_ETC2 && g !== c.RGBA_ETC2 || i.ext("WEBGL_compressed_texture_etc"))) continue;
if (".webp" === _ && !cc.sys.capabilities.webp) continue;
l = v;
a = _;
u = g;
} else o || (o = _);
}
if (a) {
this._setRawAsset(a);
this._format = u;
} else {
this._setRawAsset(o);
cc.warnID(3120, e.customEnv.url, o, o);
}
}
if (8 === n.length) {
this._minFilter = parseInt(n[1]);
this._magFilter = parseInt(n[2]);
this._wrapS = parseInt(n[3]);
this._wrapT = parseInt(n[4]);
this._premultiplyAlpha = 49 === n[5].charCodeAt(0);
this._genMipmaps = 49 === n[6].charCodeAt(0);
this._packable = 49 === n[7].charCodeAt(0);
}
},
_getHash: function() {
if (!this._hashDirty) return this._hash;
var t = this._genMipmaps ? 1 : 0, e = this._premultiplyAlpha ? 1 : 0, i = this._flipY ? 1 : 0, n = this._minFilter === u.LINEAR ? 1 : 2, r = this._magFilter === u.LINEAR ? 1 : 2, s = this._wrapS === l.REPEAT ? 1 : this._wrapS === l.CLAMP_TO_EDGE ? 2 : 3, o = this._wrapT === l.REPEAT ? 1 : this._wrapT === l.CLAMP_TO_EDGE ? 2 : 3, a = this._format, c = this._image;
if (c) {
6408 !== c._glFormat && (a = 0);
e = c._premultiplyAlpha;
}
this._hash = Number("" + n + r + a + s + o + t + e + i);
this._hashDirty = !1;
return this._hash;
},
_isCompressed: function() {
return this._texture && this._texture._compressed;
},
_clearImage: function() {
cc.loader.removeItem(this._image.id || this._image.src);
this._image.src = "";
}
});
cc.Texture2D = e.exports = p;
}), {
"../../renderer/gfx": 234,
"../assets/CCAsset": 11,
"../event/event-target": 77,
"../platform/CCClass": 110,
"../platform/id-generater": 126,
"../renderer": 155
} ],
29: [ (function(t, e, i) {
"use strict";
t("./CCRawAsset");
t("./CCAsset");
t("./CCFont");
t("./CCPrefab");
t("./CCAudioClip");
t("./CCScripts");
t("./CCSceneAsset");
t("./CCSpriteFrame");
t("./CCTexture2D");
t("./CCRenderTexture");
t("./CCTTFFont");
t("./CCSpriteAtlas");
t("./CCBitmapFont");
t("./CCLabelAtlas");
t("./CCTextAsset");
t("./CCJsonAsset");
t("./CCBufferAsset");
t("./CCEffectAsset");
t("./material/CCMaterial");
}), {
"./CCAsset": 11,
"./CCAudioClip": 12,
"./CCBitmapFont": 13,
"./CCBufferAsset": 14,
"./CCEffectAsset": 15,
"./CCFont": 16,
"./CCJsonAsset": 17,
"./CCLabelAtlas": 18,
"./CCPrefab": 19,
"./CCRawAsset": 20,
"./CCRenderTexture": 21,
"./CCSceneAsset": 22,
"./CCScripts": 23,
"./CCSpriteAtlas": 24,
"./CCSpriteFrame": 25,
"./CCTTFFont": 26,
"./CCTextAsset": 27,
"./CCTexture2D": 28,
"./material/CCMaterial": 30
} ],
30: [ (function(t, e, i) {
"use strict";
var n = o(t("../../../renderer/murmurhash2_gc")), r = o(t("./utils")), s = o(t("./material-pool"));
function o(t) {
return t && t.__esModule ? t : {
default: t
};
}
var a = t("../CCAsset"), c = t("../CCTexture2D"), l = c.PixelFormat, u = t("../CCEffectAsset"), h = t("../../utils/texture-util"), f = cc.Class({
name: "cc.Material",
extends: a,
ctor: function() {
this._manualHash = !1;
this._dirty = !0;
this._effect = null;
this._owner = null;
this._hash = 0;
},
properties: {
_effectAsset: {
type: u,
default: null
},
_defines: {
default: {},
type: Object
},
_props: {
default: {},
type: Object
},
effectName: void 0,
effectAsset: {
get: function() {
return this._effectAsset;
},
set: function(t) {
if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
this._effectAsset = t;
t ? this._effect = this._effectAsset.getInstantiatedEffect() : cc.error("Can not set an empty effect asset.");
}
}
},
effect: {
get: function() {
return this._effect;
}
},
owner: {
get: function() {
return this._owner;
}
}
},
statics: {
getBuiltinMaterial: function(t) {
return cc.AssetLibrary.getBuiltin("material", "builtin-" + t);
},
getInstantiatedBuiltinMaterial: function(t, e) {
var i = this.getBuiltinMaterial(t);
return f.getInstantiatedMaterial(i, e);
},
getInstantiatedMaterial: function(t, e) {
return t._owner === e ? t : s.default.get(t, e);
}
},
copy: function(t) {
this.effectAsset = t.effectAsset;
for (var e in t._defines) this.define(e, t._defines[e]);
for (var i in t._props) this.setProperty(i, t._props[i]);
},
setProperty: function(t, e, i) {
if (this._props[t] !== e || i) {
this._props[t] = e;
this._dirty = !0;
if (this._effect) if (e instanceof c) {
var n = function() {
this._effect.setProperty(t, e);
var i = e.getPixelFormat();
i !== l.RGBA_ETC1 && i !== l.RGB_A_PVRTC_4BPPV1 && i !== l.RGB_A_PVRTC_2BPPV1 || this.define("CC_USE_ALPHA_ATLAS_" + t.toUpperCase(), !0);
};
if (e.loaded) n.call(this); else {
e.once("load", n, this);
h.postLoadTexture(e);
}
} else this._effect.setProperty(t, e);
}
},
getProperty: function(t) {
return this._props[t];
},
define: function(t, e, i) {
if (this._defines[t] !== e || i) {
this._defines[t] = e;
this._dirty = !0;
this._effect && this._effect.define(t, e);
}
},
getDefine: function(t) {
return this._defines[t];
},
setDirty: function(t) {
this._dirty = t;
},
updateHash: function(t) {
void 0 === t || null === t ? t = this.computeHash() : this._manualHash = !0;
this._dirty = !1;
this._hash = t;
this._effect && this._effect.updateHash(this._hash);
},
computeHash: function() {
var t = this._effect, e = "";
if (t) {
e += r.default.serializeDefines(t._defines);
e += r.default.serializeTechniques(t._techniques);
e += r.default.serializeUniforms(t._properties);
}
return (0, n.default)(e, 666);
},
getHash: function() {
if (!this._dirty) return this._hash;
this._manualHash || this.updateHash();
this._dirty = !1;
return this._hash;
},
onLoad: function() {
this.effectAsset = this._effectAsset;
if (this._effect) {
for (var t in this._defines) this.define(t, this._defines[t], !0);
for (var e in this._props) this.setProperty(e, this._props[e], !0);
}
}
});
e.exports = cc.Material = f;
}), {
"../../../renderer/murmurhash2_gc": 237,
"../../utils/texture-util": 195,
"../CCAsset": 11,
"../CCEffectAsset": 15,
"../CCTexture2D": 28,
"./material-pool": 31,
"./utils": 32
} ],
31: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = s(t("./utils")), r = s(t("../../utils/pool"));
function s(t) {
return t && t.__esModule ? t : {
default: t
};
}
function o(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function a(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function c(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var l = new (function(t) {
c(e, t);
function e() {
var i, n, r;
o(this, e);
for (var s = arguments.length, c = Array(s), l = 0; l < s; l++) c[l] = arguments[l];
return r = (i = n = a(this, t.call.apply(t, [ this ].concat(c))), n.enabled = !1, 
n._pool = {}, i), a(n, r);
}
e.prototype.get = function(t, e) {
var i = this._pool, r = void 0;
if (this.enabled) {
var s = t.effectAsset._uuid;
if (i[s]) {
var o = n.default.serializeDefines(t._effect._defines) + n.default.serializeTechniques(t._effect._techniques);
r = i[s][o] && i[s][o].pop();
}
}
if (r) this.count--; else {
(r = new cc.Material()).copy(t);
r._name = t._name + " (Instance)";
r._uuid = t._uuid;
}
r._owner = e;
return r;
};
e.prototype.put = function(t) {
if (this.enabled && t._owner) {
var e = this._pool, i = t.effectAsset._uuid;
e[i] || (e[i] = {});
var r = n.default.serializeDefines(t._effect._defines) + n.default.serializeTechniques(t._effect._techniques);
e[i][r] || (e[i][r] = []);
if (!(this.count > this.maxSize)) {
this._clean(t);
e[i][r].push(t);
this.count++;
}
}
};
e.prototype.clear = function() {
this._pool = {};
this.count = 0;
};
e.prototype._clean = function(t) {
t._owner = null;
};
return e;
}(r.default))();
r.default.register("material", l);
i.default = l;
e.exports = i.default;
}), {
"../../utils/pool": 189,
"./utils": 32
} ],
32: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../../renderer/enums"));
function r(t) {
var e = t._programName + t._cullMode;
t._blend && (e += t._blendEq + t._blendAlphaEq + t._blendSrc + t._blendDst + t._blendSrcAlpha + t._blendDstAlpha + t._blendColor);
t._depthTest && (e += t._depthWrite + t._depthFunc);
t._stencilTest && (e += t._stencilFuncFront + t._stencilRefFront + t._stencilMaskFront + t._stencilFailOpFront + t._stencilZFailOpFront + t._stencilZPassOpFront + t._stencilWriteMaskFront + t._stencilFuncBack + t._stencilRefBack + t._stencilMaskBack + t._stencilFailOpBack + t._stencilZFailOpBack + t._stencilZPassOpBack + t._stencilWriteMaskBack);
return e;
}
i.default = {
serializeDefines: function(t) {
var e = "";
for (var i in t) e += i + t[i];
return e;
},
serializeTechniques: function(t) {
for (var e = "", i = 0; i < t.length; i++) {
var n = t[i];
e += n.stageIDs;
for (var s = 0; s < n.passes.length; s++) e += r(n.passes[s]);
}
return e;
},
serializeUniforms: function(t) {
var e = "";
for (var i in t) {
var r = t[i], s = r.value;
s && (r.type === n.default.PARAM_TEXTURE_2D || r.type === n.default.PARAM_TEXTURE_CUBE ? e += s._id + ";" : e += s.toString() + ";");
}
return e;
}
};
e.exports = i.default;
}), {
"../../../renderer/enums": 233
} ],
33: [ (function(t, e, i) {
"use strict";
t("../CCNode").EventType;
var n = 56, r = 7, s = cc.Enum({
ONCE: 0,
ON_WINDOW_RESIZE: 1,
ALWAYS: 2
});
function o(t) {
return t instanceof cc.Scene ? cc.visibleRect : t._contentSize;
}
function a(t, e, i, n) {
for (var r = t._parent.scaleX, s = t._parent.scaleY, o = 0, a = 0, c = t._parent; ;) {
o += c.x;
a += c.y;
if (!(c = c._parent)) {
i.x = i.y = 0;
n.x = n.y = 1;
return;
}
if (c === e) break;
var l = c.scaleX, u = c.scaleY;
o *= l;
a *= u;
r *= l;
s *= u;
}
n.x = 0 !== r ? 1 / r : 1;
n.y = 0 !== s ? 1 / s : 1;
i.x = -o;
i.y = -a;
}
var c = cc.Vec2.ZERO, l = cc.Vec2.ONE;
function u(t, e) {
var i, s, u, h = e._target;
h ? a(t, i = h, s = c, u = l) : i = t._parent;
var f = o(i), d = i._anchorPoint, _ = i instanceof cc.Scene, p = t.x, v = t.y, g = t._anchorPoint;
if (e._alignFlags & n) {
var m, y, E = f.width;
if (_) {
m = cc.visibleRect.left.x;
y = cc.visibleRect.right.x;
} else y = (m = -d.x * E) + E;
m += e._isAbsLeft ? e._left : e._left * E;
y -= e._isAbsRight ? e._right : e._right * E;
if (h) {
m += s.x;
m *= u.x;
y += s.x;
y *= u.x;
}
var C, T = g.x, A = t.scaleX;
if (A < 0) {
T = 1 - T;
A = -A;
}
if (e.isStretchWidth) {
C = y - m;
0 !== A && (t.width = C / A);
p = m + T * C;
} else {
C = t.width * A;
if (e.isAlignHorizontalCenter) {
var x = e._isAbsHorizontalCenter ? e._horizontalCenter : e._horizontalCenter * E, b = (.5 - d.x) * f.width;
if (h) {
x *= u.x;
b += s.x;
b *= u.x;
}
p = b + (T - .5) * C + x;
} else p = e.isAlignLeft ? m + T * C : y + (T - 1) * C;
}
}
if (e._alignFlags & r) {
var S, R, w = f.height;
if (_) {
R = cc.visibleRect.bottom.y;
S = cc.visibleRect.top.y;
} else S = (R = -d.y * w) + w;
R += e._isAbsBottom ? e._bottom : e._bottom * w;
S -= e._isAbsTop ? e._top : e._top * w;
if (h) {
R += s.y;
R *= u.y;
S += s.y;
S *= u.y;
}
var L, O = g.y, M = t.scaleY;
if (M < 0) {
O = 1 - O;
M = -M;
}
if (e.isStretchHeight) {
L = S - R;
0 !== M && (t.height = L / M);
v = R + O * L;
} else {
L = t.height * M;
if (e.isAlignVerticalCenter) {
var I = e._isAbsVerticalCenter ? e._verticalCenter : e._verticalCenter * w, D = (.5 - d.y) * f.height;
if (h) {
I *= u.y;
D += s.y;
D *= u.y;
}
v = D + (O - .5) * L + I;
} else v = e.isAlignBottom ? R + O * L : S + (O - 1) * L;
}
}
t.setPosition(p, v);
}
function h(t) {
var e = t._widget;
if (e) {
0;
u(t, e);
e.alignMode !== s.ALWAYS ? e.enabled = !1 : d.push(e);
}
for (var i = t._children, n = 0; n < i.length; n++) {
var r = i[n];
r._active && h(r);
}
}
function f() {
var t = cc.director.getScene();
if (t) {
_.isAligning = !0;
if (_._nodesOrderDirty) {
d.length = 0;
h(t);
_._nodesOrderDirty = !1;
} else {
var e, i = _._activeWidgetsIterator;
for (i.i = 0; i.i < d.length; ++i.i) u((e = d[i.i]).node, e);
}
_.isAligning = !1;
}
0;
}
var d = [];
var _ = cc._widgetManager = e.exports = {
_AlignFlags: {
TOP: 1,
MID: 2,
BOT: 4,
LEFT: 8,
CENTER: 16,
RIGHT: 32
},
isAligning: !1,
_nodesOrderDirty: !1,
_activeWidgetsIterator: new cc.js.array.MutableForwardIterator(d),
init: function(t) {
t.on(cc.Director.EVENT_AFTER_UPDATE, f);
cc.sys.isMobile ? window.addEventListener("resize", this.onResized.bind(this)) : cc.view.on("canvas-resize", this.onResized, this);
},
add: function(t) {
t.node._widget = t;
this._nodesOrderDirty = !0;
0;
},
remove: function(t) {
t.node._widget = null;
this._activeWidgetsIterator.remove(t);
0;
},
onResized: function() {
var t = cc.director.getScene();
t && this.refreshWidgetOnResized(t);
},
refreshWidgetOnResized: function(t) {
var e = cc.Node.isNode(t) && t.getComponent(cc.Widget);
e && e.alignMode === s.ON_WINDOW_RESIZE && (e.enabled = !0);
for (var i = t._children, n = 0; n < i.length; n++) {
var r = i[n];
this.refreshWidgetOnResized(r);
}
},
updateAlignment: function t(e) {
var i = e._parent;
cc.Node.isNode(i) && t(i);
var n = e._widget || e.getComponent(cc.Widget);
n && i && u(e, n);
},
AlignMode: s
};
0;
}), {
"../CCNode": 7
} ],
34: [ (function(t, e, i) {
"use strict";
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../geom-utils"));
var r = t("../utils/affine-transform"), s = t("../renderer/index"), o = t("../renderer/render-flow"), a = t("../CCGame"), c = null;
c = window.renderer.Camera;
var l = cc.vmath.mat4, u = cc.vmath.vec2, h = cc.vmath.vec3, f = l.create(), d = l.create(), _ = cc.v3(), p = cc.v3(), v = cc.v3(), g = [], m = null;
function y() {
if (m) {
var t = m.getNode(), e = cc.game.canvas;
t.z = e.height / 1.1566;
t.x = e.width / 2;
t.y = e.height / 2;
}
}
var E = cc.Enum({
COLOR: 1,
DEPTH: 2,
STENCIL: 4
}), C = cc.Enum({
OPAQUE: 1,
TRANSPARENT: 2
}), T = cc.Class({
name: "cc.Camera",
extends: cc.Component,
ctor: function() {
if (a.renderType !== a.RENDER_TYPE_CANVAS) {
var t = new c();
t.setStages([ "opaque" ]);
t.dirty = !0;
this._inited = !1;
this._camera = t;
} else this._inited = !0;
},
editor: !1,
properties: {
_cullingMask: 4294967295,
_clearFlags: E.DEPTH | E.STENCIL,
_backgroundColor: cc.color(0, 0, 0, 255),
_depth: 0,
_zoomRatio: 1,
_targetTexture: null,
_fov: 60,
_orthoSize: 10,
_nearClip: 1,
_farClip: 4096,
_ortho: !0,
_rect: cc.rect(0, 0, 1, 1),
_renderStages: 1,
_alignWithScreen: !0,
zoomRatio: {
get: function() {
return this._zoomRatio;
},
set: function(t) {
this._zoomRatio = t;
},
tooltip: !1
},
fov: {
get: function() {
return this._fov;
},
set: function(t) {
this._fov = t;
},
tooltip: !1
},
orthoSize: {
get: function() {
return this._orthoSize;
},
set: function(t) {
this._orthoSize = t;
},
tooltip: !1
},
nearClip: {
get: function() {
return this._nearClip;
},
set: function(t) {
this._nearClip = t;
this._updateClippingpPlanes();
},
tooltip: !1
},
farClip: {
get: function() {
return this._farClip;
},
set: function(t) {
this._farClip = t;
this._updateClippingpPlanes();
},
tooltip: !1
},
ortho: {
get: function() {
return this._ortho;
},
set: function(t) {
this._ortho = t;
this._updateProjection();
},
tooltip: !1
},
rect: {
get: function() {
return this._rect;
},
set: function(t) {
this._rect = t;
this._updateRect();
},
tooltip: !1
},
cullingMask: {
get: function() {
return this._cullingMask;
},
set: function(t) {
this._cullingMask = t;
this._updateCameraMask();
},
tooltip: !1
},
clearFlags: {
get: function() {
return this._clearFlags;
},
set: function(t) {
this._clearFlags = t;
this._camera && this._camera.setClearFlags(t);
},
tooltip: !1
},
backgroundColor: {
get: function() {
return this._backgroundColor;
},
set: function(t) {
this._backgroundColor = t;
this._updateBackgroundColor();
},
tooltip: !1
},
depth: {
get: function() {
return this._depth;
},
set: function(t) {
this._depth = t;
this._camera && this._camera.setPriority(t);
},
tooltip: !1
},
targetTexture: {
get: function() {
return this._targetTexture;
},
set: function(t) {
this._targetTexture = t;
this._updateTargetTexture();
},
tooltip: !1
},
renderStages: {
get: function() {
return this._renderStages;
},
set: function(t) {
this._renderStages = t;
this._updateStages();
},
tooltip: !1
},
alignWithScreen: {
get: function() {
return this._alignWithScreen;
},
set: function(t) {
this._alignWithScreen = t;
}
},
_is3D: {
get: function() {
return this.node && this.node._is3DNode;
}
}
},
statics: {
main: null,
cameras: g,
ClearFlags: E,
findCamera: function(t) {
for (var e = 0, i = g.length; e < i; e++) {
var n = g[e];
if (n.containsNode(t)) return n;
}
return null;
},
_findRendererCamera: function(t) {
for (var e = s.scene._cameras, i = 0; i < e._count; i++) if (e._data[i]._cullingMask & t._cullingMask) return e._data[i];
return null;
},
_setupDebugCamera: function() {
if (!m && a.renderType !== a.RENDER_TYPE_CANVAS) {
var t = new c();
m = t;
t.setStages([ "opaque" ]);
t.setFov(60 * Math.PI / 180);
t.setNear(.1);
t.setFar(4096);
t.dirty = !0;
t.cullingMask = 1 << cc.Node.BuiltinGroupIndex.DEBUG;
t.setPriority(cc.macro.MAX_ZINDEX);
t.setClearFlags(0);
t.setColor(0, 0, 0, 0);
var e = new cc.Node();
t.setNode(e);
y();
cc.view.on("design-resolution-changed", y);
s.scene.addCamera(t);
}
}
},
_updateCameraMask: function() {
if (this._camera) {
var t = this._cullingMask & ~(1 << cc.Node.BuiltinGroupIndex.DEBUG);
this._camera.cullingMask = t;
}
},
_updateBackgroundColor: function() {
if (this._camera) {
var t = this._backgroundColor;
this._camera.setColor(t.r / 255, t.g / 255, t.b / 255, t.a / 255);
}
},
_updateTargetTexture: function() {
if (this._camera) {
var t = this._targetTexture;
this._camera.setFrameBuffer(t ? t._framebuffer : null);
}
},
_updateClippingpPlanes: function() {
if (this._camera) {
this._camera.setNear(this._nearClip);
this._camera.setFar(this._farClip);
}
},
_updateProjection: function() {
if (this._camera) {
var t = this._ortho ? 1 : 0;
this._camera.setType(t);
}
},
_updateRect: function() {
if (this._camera) {
var t = this._rect;
this._camera.setRect(t.x, t.y, t.width, t.height);
}
},
_updateStages: function() {
var t = this._renderStages, e = [];
t & C.OPAQUE && e.push("opaque");
t & C.TRANSPARENT && e.push("transparent");
this._camera.setStages(e);
},
_init: function() {
if (!this._inited) {
this._inited = !0;
var t = this._camera;
if (t) {
t.setNode(this.node);
t.setClearFlags(this._clearFlags);
t.setPriority(this._depth);
this._updateBackgroundColor();
this._updateCameraMask();
this._updateTargetTexture();
this._updateClippingpPlanes();
this._updateProjection();
this._updateStages();
this._updateRect();
this.beforeDraw();
}
}
},
onLoad: function() {
this._init();
},
onEnable: function() {
if (a.renderType !== a.RENDER_TYPE_CANVAS) {
cc.director.on(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
s.scene.addCamera(this._camera);
}
g.push(this);
},
onDisable: function() {
if (a.renderType !== a.RENDER_TYPE_CANVAS) {
cc.director.off(cc.Director.EVENT_BEFORE_DRAW, this.beforeDraw, this);
s.scene.removeCamera(this._camera);
}
cc.js.array.remove(g, this);
},
getScreenToWorldMatrix2D: function(t) {
this.getWorldToScreenMatrix2D(t);
l.invert(t, t);
return t;
},
getWorldToScreenMatrix2D: function(t) {
this.node.getWorldRT(f);
var e = this.zoomRatio, i = f.m;
i[0] *= e;
i[1] *= e;
i[4] *= e;
i[5] *= e;
var n = i[12], r = i[13], s = cc.visibleRect.center;
i[12] = s.x - (i[0] * n + i[4] * r);
i[13] = s.y - (i[1] * n + i[5] * r);
t !== f && l.copy(t, f);
return t;
},
getScreenToWorldPoint: function(t, e) {
if (this.node.is3DNode) {
e = e || new cc.Vec3();
this._camera.screenToWorld(e, t, cc.visibleRect.width, cc.visibleRect.height);
} else {
e = e || new cc.Vec2();
this.getScreenToWorldMatrix2D(f);
u.transformMat4(e, t, f);
}
return e;
},
getWorldToScreenPoint: function(t, e) {
if (this.node.is3DNode) {
e = e || new cc.Vec3();
this._camera.worldToScreen(e, t, cc.visibleRect.width, cc.visibleRect.height);
} else {
e = e || new cc.Vec2();
this.getWorldToScreenMatrix2D(f);
u.transformMat4(e, t, f);
}
return e;
},
getRay: function(t) {
if (!n.default) return t;
h.set(v, t.x, t.y, 1);
this._camera.screenToWorld(p, v, cc.visibleRect.width, cc.visibleRect.height);
if (this.ortho) {
h.set(v, t.x, t.y, -1);
this._camera.screenToWorld(_, v, cc.visibleRect.width, cc.visibleRect.height);
} else this.node.getWorldPosition(_);
return n.default.Ray.fromPoints(n.default.Ray.create(), _, p);
},
containsNode: function(t) {
return t._cullingMask & this.cullingMask;
},
render: function(t) {
if (!(t = t || cc.director.getScene())) return null;
this.node.getWorldMatrix(f);
this.beforeDraw();
o.render(t);
0;
},
_onAlignWithScreen: function() {
var t = cc.game.canvas.height / cc.view._scaleY;
this._targetTexture && (t = cc.visibleRect.height);
var e = this._fov * cc.macro.RAD;
this.node.z = t / (2 * Math.tan(e / 2));
e = 2 * Math.atan(Math.tan(e / 2) / this.zoomRatio);
this._camera.setFov(e);
this._camera.setOrthoHeight(t / 2 / this.zoomRatio);
this.node.setRotation(0, 0, 0, 1);
},
beforeDraw: function() {
if (this._camera) {
if (this._alignWithScreen) this._onAlignWithScreen(); else {
var t = this._fov * cc.macro.RAD;
t = 2 * Math.atan(Math.tan(t / 2) / this.zoomRatio);
this._camera.setFov(t);
this._camera.setOrthoHeight(this._orthoSize * this.zoomRatio);
}
this._camera.dirty = !0;
}
}
});
cc.js.mixin(T.prototype, {
getNodeToCameraTransform: function(t) {
var e = r.identity();
t.getWorldMatrix(d);
if (this.containsNode(t)) {
this.getWorldToCameraMatrix(f);
l.mul(d, d, f);
}
r.fromMat4(e, d);
return e;
},
getCameraToWorldPoint: function(t, e) {
return this.getScreenToWorldPoint(t, e);
},
getWorldToCameraPoint: function(t, e) {
return this.getWorldToScreenPoint(t, e);
},
getCameraToWorldMatrix: function(t) {
return this.getScreenToWorldMatrix2D(t);
},
getWorldToCameraMatrix: function(t) {
return this.getWorldToScreenMatrix2D(t);
}
});
e.exports = cc.Camera = T;
}), {
"../../renderer/scene/camera": void 0,
"../CCGame": 6,
"../geom-utils": 82,
"../renderer/index": 155,
"../renderer/render-flow": 156,
"../utils/affine-transform": 180
} ],
35: [ (function(t, e, i) {
"use strict";
cc.Collider.Box = cc.Class({
properties: {
_offset: cc.v2(0, 0),
_size: cc.size(100, 100),
offset: {
tooltip: !1,
get: function() {
return this._offset;
},
set: function(t) {
this._offset = t;
},
type: cc.Vec2
},
size: {
tooltip: !1,
get: function() {
return this._size;
},
set: function(t) {
this._size.width = t.width < 0 ? 0 : t.width;
this._size.height = t.height < 0 ? 0 : t.height;
},
type: cc.Size
}
},
resetInEditor: !1
});
var n = cc.Class({
name: "cc.BoxCollider",
extends: cc.Collider,
mixins: [ cc.Collider.Box ],
editor: !1
});
cc.BoxCollider = e.exports = n;
}), {} ],
36: [ (function(t, e, i) {
"use strict";
cc.Collider.Circle = cc.Class({
properties: {
_offset: cc.v2(0, 0),
_radius: 50,
offset: {
get: function() {
return this._offset;
},
set: function(t) {
this._offset = t;
},
type: cc.Vec2
},
radius: {
tooltip: !1,
get: function() {
return this._radius;
},
set: function(t) {
this._radius = t < 0 ? 0 : t;
}
}
},
resetInEditor: !1
});
var n = cc.Class({
name: "cc.CircleCollider",
extends: cc.Collider,
mixins: [ cc.Collider.Circle ],
editor: !1
});
cc.CircleCollider = e.exports = n;
}), {} ],
37: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.Collider",
extends: cc.Component,
properties: {
editing: {
default: !1,
serializable: !1,
tooltip: !1
},
tag: {
tooltip: !1,
default: 0,
range: [ 0, 1e7 ],
type: cc.Integer
}
},
onDisable: function() {
cc.director.getCollisionManager().removeCollider(this);
},
onEnable: function() {
cc.director.getCollisionManager().addCollider(this);
}
});
cc.Collider = e.exports = n;
}), {} ],
38: [ (function(t, e, i) {
"use strict";
var n = t("./CCContact"), r = n.CollisionType, s = t("../CCNode").EventType, o = cc.vmath, a = cc.v2();
function c(t, e, i, n, r, s) {
var o = t.x, a = t.y, c = t.width, l = t.height, u = e.m, h = u[0], f = u[1], d = u[4], _ = u[5], p = h * o + d * a + u[12], v = f * o + _ * a + u[13], g = h * c, m = f * c, y = d * l, E = _ * l;
n.x = p;
n.y = v;
r.x = g + p;
r.y = m + v;
i.x = y + p;
i.y = E + v;
s.x = g + y + p;
s.y = m + E + v;
}
var l = cc.Class({
mixins: [ cc.EventTarget ],
properties: {
enabled: !1,
enabledDrawBoundingBox: !1
},
ctor: function() {
this._contacts = [];
this._colliders = [];
this._debugDrawer = null;
this._enabledDebugDraw = !1;
cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
},
update: function(t) {
if (this.enabled) {
var e = void 0, i = void 0, n = this._colliders;
for (e = 0, i = n.length; e < i; e++) this.updateCollider(n[e]);
var s = this._contacts, o = [];
for (e = 0, i = s.length; e < i; e++) {
var a = s[e].updateState();
a !== r.None && o.push([ a, s[e] ]);
}
for (e = 0, i = o.length; e < i; e++) {
var c = o[e];
this._doCollide(c[0], c[1]);
}
this.drawColliders();
}
},
_doCollide: function(t, e) {
var i = void 0;
switch (t) {
case r.CollisionEnter:
i = "onCollisionEnter";
break;

case r.CollisionStay:
i = "onCollisionStay";
break;

case r.CollisionExit:
i = "onCollisionExit";
}
var n = e.collider1, s = e.collider2, o = n.node._components, a = s.node._components, c = void 0, l = void 0, u = void 0;
for (c = 0, l = o.length; c < l; c++) (u = o[c])[i] && u[i](s, n);
for (c = 0, l = a.length; c < l; c++) (u = a[c])[i] && u[i](n, s);
},
shouldCollide: function(t, e) {
var i = t.node, n = e.node, r = cc.game.collisionMatrix;
return i !== n && r[i.groupIndex][n.groupIndex];
},
initCollider: function(t) {
if (!t.world) {
var e = t.world = {};
e.aabb = cc.rect();
e.preAabb = cc.rect();
e.matrix = o.mat4.create();
e.radius = 0;
if (t instanceof cc.BoxCollider) {
e.position = null;
e.points = [ cc.v2(), cc.v2(), cc.v2(), cc.v2() ];
} else if (t instanceof cc.PolygonCollider) {
e.position = null;
e.points = t.points.map((function(t) {
return cc.v2(t.x, t.y);
}));
} else if (t instanceof cc.CircleCollider) {
e.position = cc.v2();
e.points = null;
}
}
},
updateCollider: function(t) {
var e = t.offset, i = t.world, n = i.aabb, r = i.matrix;
t.node.getWorldMatrix(r);
var s = i.preAabb;
s.x = n.x;
s.y = n.y;
s.width = n.width;
s.height = n.height;
if (t instanceof cc.BoxCollider) {
var l = t.size;
n.x = e.x - l.width / 2;
n.y = e.y - l.height / 2;
n.width = l.width;
n.height = l.height;
var u = i.points, h = u[0], f = u[1], d = u[2], _ = u[3];
c(n, r, h, f, d, _);
var p = Math.min(h.x, f.x, d.x, _.x), v = Math.min(h.y, f.y, d.y, _.y), g = Math.max(h.x, f.x, d.x, _.x), m = Math.max(h.y, f.y, d.y, _.y);
n.x = p;
n.y = v;
n.width = g - p;
n.height = m - v;
} else if (t instanceof cc.CircleCollider) {
o.vec2.transformMat4(a, t.offset, r);
i.position.x = a.x;
i.position.y = a.y;
var y = r.m, E = y[12], C = y[13];
y[12] = y[13] = 0;
a.x = t.radius;
a.y = 0;
o.vec2.transformMat4(a, a, r);
var T = Math.sqrt(a.x * a.x + a.y * a.y);
i.radius = T;
n.x = i.position.x - T;
n.y = i.position.y - T;
n.width = 2 * T;
n.height = 2 * T;
y[12] = E;
y[13] = C;
} else if (t instanceof cc.PolygonCollider) {
var A = t.points, x = i.points;
x.length = A.length;
for (var b = 1e6, S = 1e6, R = -1e6, w = -1e6, L = 0, O = A.length; L < O; L++) {
x[L] || (x[L] = cc.v2());
a.x = A[L].x + e.x;
a.y = A[L].y + e.y;
o.vec2.transformMat4(a, a, r);
var M = a.x, I = a.y;
x[L].x = M;
x[L].y = I;
M > R && (R = M);
M < b && (b = M);
I > w && (w = I);
I < S && (S = I);
}
n.x = b;
n.y = S;
n.width = R - b;
n.height = w - S;
}
},
addCollider: function(t) {
var e = this._colliders;
if (-1 === e.indexOf(t)) {
for (var i = 0, r = e.length; i < r; i++) {
var o = e[i];
if (this.shouldCollide(t, o)) {
var a = new n(t, o);
this._contacts.push(a);
}
}
e.push(t);
this.initCollider(t);
}
t.node.on(s.GROUP_CHANGED, this.onNodeGroupChanged, this);
},
removeCollider: function(t) {
var e = this._colliders, i = e.indexOf(t);
if (i >= 0) {
e.splice(i, 1);
for (var n = this._contacts, o = n.length - 1; o >= 0; o--) {
var a = n[o];
if (a.collider1 === t || a.collider2 === t) {
a.touching && this._doCollide(r.CollisionExit, a);
n.splice(o, 1);
}
}
t.node.off(s.GROUP_CHANGED, this.onNodeGroupChanged, this);
} else cc.errorID(6600);
},
onNodeGroupChanged: function(t) {
for (var e = t.getComponents(cc.Collider), i = 0, n = e.length; i < n; i++) {
var r = e[i];
if (!(cc.PhysicsCollider && r instanceof cc.PhysicsCollider)) {
this.removeCollider(r);
this.addCollider(r);
}
}
},
drawColliders: function() {
if (this._enabledDebugDraw) {
this._checkDebugDrawValid();
var t = this._debugDrawer;
t.clear();
for (var e = this._colliders, i = 0, n = e.length; i < n; i++) {
var r = e[i];
t.strokeColor = cc.Color.WHITE;
if (r instanceof cc.BoxCollider || r instanceof cc.PolygonCollider) {
var s = r.world.points;
if (s.length > 0) {
t.moveTo(s[0].x, s[0].y);
for (var o = 1; o < s.length; o++) t.lineTo(s[o].x, s[o].y);
t.close();
t.stroke();
}
} else if (r instanceof cc.CircleCollider) {
t.circle(r.world.position.x, r.world.position.y, r.world.radius);
t.stroke();
}
if (this.enabledDrawBoundingBox) {
var a = r.world.aabb;
t.strokeColor = cc.Color.BLUE;
t.moveTo(a.xMin, a.yMin);
t.lineTo(a.xMin, a.yMax);
t.lineTo(a.xMax, a.yMax);
t.lineTo(a.xMax, a.yMin);
t.close();
t.stroke();
}
}
}
},
_checkDebugDrawValid: function() {
if (!this._debugDrawer || !this._debugDrawer.isValid) {
var t = new cc.Node("COLLISION_MANAGER_DEBUG_DRAW");
t.zIndex = cc.macro.MAX_ZINDEX;
cc.game.addPersistRootNode(t);
this._debugDrawer = t.addComponent(cc.Graphics);
}
}
});
cc.js.getset(l.prototype, "enabledDebugDraw", (function() {
return this._enabledDebugDraw;
}), (function(t) {
if (t && !this._enabledDebugDraw) {
this._checkDebugDrawValid();
this._debugDrawer.node.active = !0;
} else if (!t && this._enabledDebugDraw) {
this._debugDrawer.clear(!0);
this._debugDrawer.node.active = !1;
}
this._enabledDebugDraw = t;
}));
cc.CollisionManager = e.exports = l;
}), {
"../CCNode": 7,
"./CCContact": 39
} ],
39: [ (function(t, e, i) {
"use strict";
var n = t("./CCIntersection"), r = cc.Enum({
None: 0,
CollisionEnter: 1,
CollisionStay: 2,
CollisionExit: 3
});
function s(t, e) {
this.collider1 = t;
this.collider2 = e;
this.touching = !1;
var i = t instanceof cc.BoxCollider || t instanceof cc.PolygonCollider, r = e instanceof cc.BoxCollider || e instanceof cc.PolygonCollider, s = t instanceof cc.CircleCollider, o = e instanceof cc.CircleCollider;
if (i && r) this.testFunc = n.polygonPolygon; else if (s && o) this.testFunc = n.circleCircle; else if (i && o) this.testFunc = n.polygonCircle; else if (s && r) {
this.testFunc = n.polygonCircle;
this.collider1 = e;
this.collider2 = t;
} else cc.errorID(6601, cc.js.getClassName(t), cc.js.getClassName(e));
}
s.prototype.test = function() {
var t = this.collider1.world, e = this.collider2.world;
return !!t.aabb.intersects(e.aabb) && (this.testFunc === n.polygonPolygon ? this.testFunc(t.points, e.points) : this.testFunc === n.circleCircle ? this.testFunc(t, e) : this.testFunc === n.polygonCircle && this.testFunc(t.points, e));
};
s.prototype.updateState = function() {
var t = this.test(), e = r.None;
if (t && !this.touching) {
this.touching = !0;
e = r.CollisionEnter;
} else if (t && this.touching) e = r.CollisionStay; else if (!t && this.touching) {
this.touching = !1;
e = r.CollisionExit;
}
return e;
};
s.CollisionType = r;
e.exports = s;
}), {
"./CCIntersection": 40
} ],
40: [ (function(t, e, i) {
"use strict";
var n = {};
function r(t, e, i, n) {
var r = (n.x - i.x) * (t.y - i.y) - (n.y - i.y) * (t.x - i.x), s = (e.x - t.x) * (t.y - i.y) - (e.y - t.y) * (t.x - i.x), o = (n.y - i.y) * (e.x - t.x) - (n.x - i.x) * (e.y - t.y);
if (0 !== o) {
var a = r / o, c = s / o;
if (0 <= a && a <= 1 && 0 <= c && c <= 1) return !0;
}
return !1;
}
n.lineLine = r;
n.lineRect = function(t, e, i) {
var n = new cc.Vec2(i.x, i.y), s = new cc.Vec2(i.x, i.yMax), o = new cc.Vec2(i.xMax, i.yMax), a = new cc.Vec2(i.xMax, i.y);
return !!(r(t, e, n, s) || r(t, e, s, o) || r(t, e, o, a) || r(t, e, a, n));
};
function s(t, e, i) {
for (var n = i.length, s = 0; s < n; ++s) {
if (r(t, e, i[s], i[(s + 1) % n])) return !0;
}
return !1;
}
n.linePolygon = s;
n.rectRect = function(t, e) {
var i = t.x, n = t.y, r = t.x + t.width, s = t.y + t.height, o = e.x, a = e.y, c = e.x + e.width, l = e.y + e.height;
return i <= c && r >= o && n <= l && s >= a;
};
n.rectPolygon = function(t, e) {
var i, n, r = new cc.Vec2(t.x, t.y), a = new cc.Vec2(t.x, t.yMax), c = new cc.Vec2(t.xMax, t.yMax), l = new cc.Vec2(t.xMax, t.y);
if (s(r, a, e)) return !0;
if (s(a, c, e)) return !0;
if (s(c, l, e)) return !0;
if (s(l, r, e)) return !0;
for (i = 0, n = e.length; i < n; ++i) if (o(e[i], t)) return !0;
return !!(o(r, e) || o(a, e) || o(c, e) || o(l, e));
};
n.polygonPolygon = function(t, e) {
var i, n;
for (i = 0, n = t.length; i < n; ++i) if (s(t[i], t[(i + 1) % n], e)) return !0;
for (i = 0, n = e.length; i < n; ++i) if (o(e[i], t)) return !0;
for (i = 0, n = t.length; i < n; ++i) if (o(t[i], e)) return !0;
return !1;
};
n.circleCircle = function(t, e) {
return t.position.sub(e.position).mag() < t.radius + e.radius;
};
n.polygonCircle = function(t, e) {
var i = e.position;
if (o(i, t)) return !0;
for (var n = 0, r = t.length; n < r; n++) if (a(i, 0 === n ? t[t.length - 1] : t[n - 1], t[n], !0) < e.radius) return !0;
return !1;
};
function o(t, e) {
for (var i = !1, n = t.x, r = t.y, s = e.length, o = 0, a = s - 1; o < s; a = o++) {
var c = e[o].x, l = e[o].y, u = e[a].x, h = e[a].y;
l > r != h > r && n < (u - c) * (r - l) / (h - l) + c && (i = !i);
}
return i;
}
n.pointInPolygon = o;
function a(t, e, i, n) {
var r, s = i.x - e.x, o = i.y - e.y, a = s * s + o * o, c = ((t.x - e.x) * s + (t.y - e.y) * o) / a;
r = n ? a ? c < 0 ? e : c > 1 ? i : cc.v2(e.x + c * s, e.y + c * o) : e : cc.v2(e.x + c * s, e.y + c * o);
s = t.x - r.x;
o = t.y - r.y;
return Math.sqrt(s * s + o * o);
}
n.pointLineDistance = a;
cc.Intersection = e.exports = n;
}), {} ],
41: [ (function(t, e, i) {
"use strict";
cc.Collider.Polygon = cc.Class({
properties: {
threshold: {
default: 1,
serializable: !1,
visible: !1
},
_offset: cc.v2(0, 0),
offset: {
get: function() {
return this._offset;
},
set: function(t) {
this._offset = t;
},
type: cc.Vec2
},
points: {
tooltip: !1,
default: function() {
return [ cc.v2(-50, -50), cc.v2(50, -50), cc.v2(50, 50), cc.v2(-50, 50) ];
},
type: [ cc.Vec2 ]
}
},
resetPointsByContour: !1
});
var n = cc.Class({
name: "cc.PolygonCollider",
extends: cc.Collider,
mixins: [ cc.Collider.Polygon ],
editor: !1
});
cc.PolygonCollider = e.exports = n;
}), {} ],
42: [ (function(t, e, i) {
"use strict";
t("./CCCollisionManager");
t("./CCCollider");
t("./CCBoxCollider");
t("./CCCircleCollider");
t("./CCPolygonCollider");
}), {
"./CCBoxCollider": 35,
"./CCCircleCollider": 36,
"./CCCollider": 37,
"./CCCollisionManager": 38,
"./CCPolygonCollider": 41
} ],
43: [ (function(t, e, i) {
"use strict";
t("./platform/CCClass");
var n = t("./platform/CCObject").Flags, r = t("./platform/js").array, s = n.IsStartCalled, o = n.IsOnEnableCalled;
n.IsEditorOnEnableCalled;
function a(t, e) {
for (var i = e.constructor._executionOrder, n = e._id, r = 0, s = t.length - 1, o = s >>> 1; r <= s; o = r + s >>> 1) {
var a = t[o], c = a.constructor._executionOrder;
if (c > i) s = o - 1; else if (c < i) r = o + 1; else {
var l = a._id;
if (l > n) s = o - 1; else {
if (!(l < n)) return o;
r = o + 1;
}
}
}
return ~r;
}
function c(t, e) {
for (var i = t.array, n = t.i + 1; n < i.length; ) {
var r = i[n];
if (r._enabled && r.node._activeInHierarchy) ++n; else {
t.removeAt(n);
e && (r._objFlags &= ~e);
}
}
}
var l = cc.Class({
__ctor__: function(t) {
var e = r.MutableForwardIterator;
this._zero = new e([]);
this._neg = new e([]);
this._pos = new e([]);
0;
this._invoke = t;
},
statics: {
stableRemoveInactive: c
},
add: null,
remove: null,
invoke: null
});
function u(t, e) {
return t.constructor._executionOrder - e.constructor._executionOrder;
}
var h = cc.Class({
extends: l,
add: function(t) {
var e = t.constructor._executionOrder;
(0 === e ? this._zero : e < 0 ? this._neg : this._pos).array.push(t);
},
remove: function(t) {
var e = t.constructor._executionOrder;
(0 === e ? this._zero : e < 0 ? this._neg : this._pos).fastRemove(t);
},
cancelInactive: function(t) {
c(this._zero, t);
c(this._neg, t);
c(this._pos, t);
},
invoke: function() {
var t = this._neg;
if (t.array.length > 0) {
t.array.sort(u);
this._invoke(t);
t.array.length = 0;
}
this._invoke(this._zero);
this._zero.array.length = 0;
var e = this._pos;
if (e.array.length > 0) {
e.array.sort(u);
this._invoke(e);
e.array.length = 0;
}
}
}), f = cc.Class({
extends: l,
add: function(t) {
var e = t.constructor._executionOrder;
if (0 === e) this._zero.array.push(t); else {
var i = e < 0 ? this._neg.array : this._pos.array, n = a(i, t);
n < 0 && i.splice(~n, 0, t);
}
},
remove: function(t) {
var e = t.constructor._executionOrder;
if (0 === e) this._zero.fastRemove(t); else {
var i = e < 0 ? this._neg : this._pos, n = a(i.array, t);
n >= 0 && i.removeAt(n);
}
},
invoke: function(t) {
this._neg.array.length > 0 && this._invoke(this._neg, t);
this._invoke(this._zero, t);
this._pos.array.length > 0 && this._invoke(this._pos, t);
}
});
function d(t, e, i, n) {
var r = "var a=it.array;for(it.i=0;it.i<a.length;++it.i){var c=a[it.i];" + t + "}";
n = e ? Function("it", "dt", r) : Function("it", r);
t = Function("c", "dt", t);
return function(e, r) {
try {
n(e, r);
} catch (n) {
cc._throw(n);
var s = e.array;
i && (s[e.i]._objFlags |= i);
++e.i;
for (;e.i < s.length; ++e.i) try {
t(s[e.i], r);
} catch (t) {
cc._throw(t);
i && (s[e.i]._objFlags |= i);
}
}
};
}
var _ = d("c.start();c._objFlags|=" + s, !1, s), p = d("c.update(dt)", !0), v = d("c.lateUpdate(dt)", !0);
function g() {
this.startInvoker = new h(_);
this.updateInvoker = new f(p);
this.lateUpdateInvoker = new f(v);
this.scheduleInNextFrame = [];
this._updating = !1;
}
var m = cc.Class({
ctor: g,
unscheduleAll: g,
statics: {
LifeCycleInvoker: l,
OneOffInvoker: h,
createInvokeImpl: d,
invokeOnEnable: function(t) {
var e = cc.director._compScheduler, i = t.array;
for (t.i = 0; t.i < i.length; ++t.i) {
var n = i[t.i];
if (n._enabled) {
n.onEnable();
!n.node._activeInHierarchy || e._onEnabled(n);
}
}
}
},
_onEnabled: function(t) {
cc.director.getScheduler().resumeTarget(t);
t._objFlags |= o;
this._updating ? this.scheduleInNextFrame.push(t) : this._scheduleImmediate(t);
},
_onDisabled: function(t) {
cc.director.getScheduler().pauseTarget(t);
t._objFlags &= ~o;
var e = this.scheduleInNextFrame.indexOf(t);
if (e >= 0) r.fastRemoveAt(this.scheduleInNextFrame, e); else {
!t.start || t._objFlags & s || this.startInvoker.remove(t);
t.update && this.updateInvoker.remove(t);
t.lateUpdate && this.lateUpdateInvoker.remove(t);
}
},
enableComp: function(t, e) {
if (!(t._objFlags & o)) {
if (t.onEnable) {
if (e) {
e.add(t);
return;
}
t.onEnable();
if (!t.node._activeInHierarchy) return;
}
this._onEnabled(t);
}
},
disableComp: function(t) {
if (t._objFlags & o) {
t.onDisable && t.onDisable();
this._onDisabled(t);
}
},
_scheduleImmediate: function(t) {
!t.start || t._objFlags & s || this.startInvoker.add(t);
t.update && this.updateInvoker.add(t);
t.lateUpdate && this.lateUpdateInvoker.add(t);
},
_deferredSchedule: function() {
for (var t = this.scheduleInNextFrame, e = 0, i = t.length; e < i; e++) {
var n = t[e];
this._scheduleImmediate(n);
}
t.length = 0;
},
startPhase: function() {
this._updating = !0;
this.scheduleInNextFrame.length > 0 && this._deferredSchedule();
this.startInvoker.invoke();
},
updatePhase: function(t) {
this.updateInvoker.invoke(t);
},
lateUpdatePhase: function(t) {
this.lateUpdateInvoker.invoke(t);
this._updating = !1;
}
});
e.exports = m;
}), {
"./platform/CCClass": 110,
"./platform/CCObject": 116,
"./platform/js": 130,
"./utils/misc": 187
} ],
44: [ (function(t, e, i) {
"use strict";
var n = [ "touchstart", "touchmove", "touchend", "mousedown", "mousemove", "mouseup", "mouseenter", "mouseleave", "mousewheel" ];
function r(t) {
t.stopPropagation();
}
var s = cc.Class({
name: "cc.BlockInputEvents",
extends: t("./CCComponent"),
editor: {
menu: "i18n:MAIN_MENU.component.ui/Block Input Events",
inspector: "packages://inspector/inspectors/comps/block-input-events.js",
help: "i18n:COMPONENT.help_url.block_input_events"
},
onEnable: function() {
for (var t = 0; t < n.length; t++) this.node.on(n[t], r, this);
},
onDisable: function() {
for (var t = 0; t < n.length; t++) this.node.off(n[t], r, this);
}
});
cc.BlockInputEvents = e.exports = s;
}), {
"./CCComponent": 47
} ],
45: [ (function(t, e, i) {
"use strict";
var n = t("./CCComponent"), r = t("../utils/gray-sprite-state"), s = cc.Enum({
NONE: 0,
COLOR: 1,
SPRITE: 2,
SCALE: 3
}), o = cc.Enum({
NORMAL: 0,
HOVER: 1,
PRESSED: 2,
DISABLED: 3
}), a = cc.Class({
name: "cc.Button",
extends: n,
mixins: [ r ],
ctor: function() {
this._pressed = !1;
this._hovered = !1;
this._fromColor = null;
this._toColor = null;
this._time = 0;
this._transitionFinished = !0;
this._fromScale = cc.Vec2.ZERO;
this._toScale = cc.Vec2.ZERO;
this._originalScale = null;
this._graySpriteMaterial = null;
this._spriteMaterial = null;
this._sprite = null;
},
editor: !1,
properties: {
interactable: {
default: !0,
tooltip: !1,
notify: function() {
this._updateState();
this.interactable || this._resetState();
},
animatable: !1
},
_resizeToTarget: {
animatable: !1,
set: function(t) {
t && this._resizeNodeToTargetNode();
}
},
enableAutoGrayEffect: {
default: !1,
tooltip: !1,
notify: function() {
this._updateDisabledState();
}
},
transition: {
default: s.NONE,
tooltip: !1,
type: s,
animatable: !1,
notify: function(t) {
this._updateTransition(t);
},
formerlySerializedAs: "transition"
},
normalColor: {
default: cc.Color.WHITE,
displayName: "Normal",
tooltip: !1,
notify: function() {
this.transition === s.Color && this._getButtonState() === o.NORMAL && (this._getTarget().opacity = this.normalColor.a);
this._updateState();
}
},
pressedColor: {
default: cc.color(211, 211, 211),
displayName: "Pressed",
tooltip: !1,
notify: function() {
this.transition === s.Color && this._getButtonState() === o.PRESSED && (this._getTarget().opacity = this.pressedColor.a);
this._updateState();
},
formerlySerializedAs: "pressedColor"
},
hoverColor: {
default: cc.Color.WHITE,
displayName: "Hover",
tooltip: !1,
notify: function() {
this.transition === s.Color && this._getButtonState() === o.HOVER && (this._getTarget().opacity = this.hoverColor.a);
this._updateState();
},
formerlySerializedAs: "hoverColor"
},
disabledColor: {
default: cc.color(124, 124, 124),
displayName: "Disabled",
tooltip: !1,
notify: function() {
this.transition === s.Color && this._getButtonState() === o.DISABLED && (this._getTarget().opacity = this.disabledColor.a);
this._updateState();
}
},
duration: {
default: .1,
range: [ 0, 10 ],
tooltip: !1
},
zoomScale: {
default: 1.2,
tooltip: !1
},
normalSprite: {
default: null,
type: cc.SpriteFrame,
displayName: "Normal",
tooltip: !1,
notify: function() {
this._updateState();
}
},
pressedSprite: {
default: null,
type: cc.SpriteFrame,
displayName: "Pressed",
tooltip: !1,
formerlySerializedAs: "pressedSprite",
notify: function() {
this._updateState();
}
},
hoverSprite: {
default: null,
type: cc.SpriteFrame,
displayName: "Hover",
tooltip: !1,
formerlySerializedAs: "hoverSprite",
notify: function() {
this._updateState();
}
},
disabledSprite: {
default: null,
type: cc.SpriteFrame,
displayName: "Disabled",
tooltip: !1,
notify: function() {
this._updateState();
}
},
target: {
default: null,
type: cc.Node,
tooltip: !1,
notify: function(t) {
this._applyTarget();
t && this.target !== t && this._unregisterTargetEvent(t);
}
},
clickEvents: {
default: [],
type: cc.Component.EventHandler,
tooltip: !1
}
},
statics: {
Transition: s
},
__preload: function() {
this._applyTarget();
this._resetState();
},
_resetState: function() {
this._pressed = !1;
this._hovered = !1;
var t = this._getTarget(), e = this.transition, i = this._originalScale;
e === s.COLOR && this.interactable ? this._setTargetColor(this.normalColor) : e === s.SCALE && i && t.setScale(i.x, i.y);
this._transitionFinished = !0;
},
onEnable: function() {
this.normalSprite && this.normalSprite.ensureLoadTexture();
this.hoverSprite && this.hoverSprite.ensureLoadTexture();
this.pressedSprite && this.pressedSprite.ensureLoadTexture();
this.disabledSprite && this.disabledSprite.ensureLoadTexture();
this._registerNodeEvent();
},
onDisable: function() {
this._resetState();
this._unregisterNodeEvent();
},
_getTarget: function() {
return this.target ? this.target : this.node;
},
_onTargetSpriteFrameChanged: function(t) {
this.transition === s.SPRITE && this._setCurrentStateSprite(t.spriteFrame);
},
_onTargetColorChanged: function(t) {
this.transition === s.COLOR && this._setCurrentStateColor(t);
},
_onTargetScaleChanged: function() {
var t = this._getTarget();
if (this._originalScale && (this.transition !== s.SCALE || this._transitionFinished)) {
this._originalScale.x = t.scaleX;
this._originalScale.y = t.scaleY;
}
},
_setTargetColor: function(t) {
var e = this._getTarget();
e.color = t;
e.opacity = t.a;
},
_getStateColor: function(t) {
switch (t) {
case o.NORMAL:
return this.normalColor;

case o.HOVER:
return this.hoverColor;

case o.PRESSED:
return this.pressedColor;

case o.DISABLED:
return this.disabledColor;
}
},
_getStateSprite: function(t) {
switch (t) {
case o.NORMAL:
return this.normalSprite;

case o.HOVER:
return this.hoverSprite;

case o.PRESSED:
return this.pressedSprite;

case o.DISABLED:
return this.disabledSprite;
}
},
_setCurrentStateColor: function(t) {
switch (this._getButtonState()) {
case o.NORMAL:
this.normalColor = t;
break;

case o.HOVER:
this.hoverColor = t;
break;

case o.PRESSED:
this.pressedColor = t;
break;

case o.DISABLED:
this.disabledColor = t;
}
},
_setCurrentStateSprite: function(t) {
switch (this._getButtonState()) {
case o.NORMAL:
this.normalSprite = t;
break;

case o.HOVER:
this.hoverSprite = t;
break;

case o.PRESSED:
this.pressedSprite = t;
break;

case o.DISABLED:
this.disabledSprite = t;
}
},
update: function(t) {
var e = this._getTarget();
if (!this._transitionFinished && (this.transition === s.COLOR || this.transition === s.SCALE)) {
this.time += t;
var i = 1;
this.duration > 0 && (i = this.time / this.duration);
i >= 1 && (i = 1);
if (this.transition === s.COLOR) {
var n = this._fromColor.lerp(this._toColor, i);
this._setTargetColor(n);
} else this.transition === s.SCALE && this._originalScale && (e.scale = this._fromScale.lerp(this._toScale, i));
1 === i && (this._transitionFinished = !0);
}
},
_registerNodeEvent: function() {
this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
this.node.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
this.node.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
},
_unregisterNodeEvent: function() {
this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancel, this);
this.node.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
this.node.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
},
_registerTargetEvent: function(t) {
0;
t.on(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
},
_unregisterTargetEvent: function(t) {
0;
t.off(cc.Node.EventType.SCALE_CHANGED, this._onTargetScaleChanged, this);
},
_getTargetSprite: function(t) {
var e = null;
t && (e = t.getComponent(cc.Sprite));
return e;
},
_applyTarget: function() {
var t = this._getTarget();
this._sprite = this._getTargetSprite(t);
this._originalScale || (this._originalScale = cc.Vec2.ZERO);
this._originalScale.x = t.scaleX;
this._originalScale.y = t.scaleY;
this._registerTargetEvent(t);
},
_onTouchBegan: function(t) {
if (this.interactable && this.enabledInHierarchy) {
this._pressed = !0;
this._updateState();
t.stopPropagation();
}
},
_onTouchMove: function(t) {
if (this.interactable && this.enabledInHierarchy && this._pressed) {
var e = t.touch, i = this.node._hitTest(e.getLocation()), n = this._getTarget(), r = this._originalScale;
if (this.transition === s.SCALE && r) if (i) {
this._fromScale.x = r.x;
this._fromScale.y = r.y;
this._toScale.x = r.x * this.zoomScale;
this._toScale.y = r.y * this.zoomScale;
this._transitionFinished = !1;
} else {
this.time = 0;
this._transitionFinished = !0;
n.setScale(r.x, r.y);
} else {
var a = void 0;
a = i ? o.PRESSED : o.NORMAL;
this._applyTransition(a);
}
t.stopPropagation();
}
},
_onTouchEnded: function(t) {
if (this.interactable && this.enabledInHierarchy) {
if (this._pressed) {
cc.Component.EventHandler.emitEvents(this.clickEvents, t);
this.node.emit("click", this);
}
this._pressed = !1;
this._updateState();
t.stopPropagation();
}
},
_onTouchCancel: function() {
if (this.interactable && this.enabledInHierarchy) {
this._pressed = !1;
this._updateState();
}
},
_onMouseMoveIn: function() {
if (!this._pressed && this.interactable && this.enabledInHierarchy && (this.transition !== s.SPRITE || this.hoverSprite) && !this._hovered) {
this._hovered = !0;
this._updateState();
}
},
_onMouseMoveOut: function() {
if (this._hovered) {
this._hovered = !1;
this._updateState();
}
},
_updateState: function() {
var t = this._getButtonState();
this._applyTransition(t);
this._updateDisabledState();
},
_getButtonState: function() {
return this.interactable ? this._pressed ? o.PRESSED : this._hovered ? o.HOVER : o.NORMAL : o.DISABLED;
},
_updateColorTransitionImmediately: function(t) {
var e = this._getStateColor(t);
this._setTargetColor(e);
this._fromColor = e.clone();
this._toColor = e;
},
_updateColorTransition: function(t) {
if (t === o.DISABLED) this._updateColorTransitionImmediately(t); else {
var e = this._getTarget(), i = this._getStateColor(t);
this._fromColor = e.color.clone();
this._toColor = i;
this.time = 0;
this._transitionFinished = !1;
}
},
_updateSpriteTransition: function(t) {
var e = this._getStateSprite(t);
this._sprite && e && (this._sprite.spriteFrame = e);
},
_updateScaleTransition: function(t) {
t === o.PRESSED ? this._zoomUp() : this._zoomBack();
},
_zoomUp: function() {
if (this._originalScale) {
this._fromScale.x = this._originalScale.x;
this._fromScale.y = this._originalScale.y;
this._toScale.x = this._originalScale.x * this.zoomScale;
this._toScale.y = this._originalScale.y * this.zoomScale;
this.time = 0;
this._transitionFinished = !1;
}
},
_zoomBack: function() {
if (this._originalScale) {
var t = this._getTarget();
this._fromScale.x = t.scaleX;
this._fromScale.y = t.scaleY;
this._toScale.x = this._originalScale.x;
this._toScale.y = this._originalScale.y;
this.time = 0;
this._transitionFinished = !1;
}
},
_updateTransition: function(t) {
t === s.COLOR ? this._updateColorTransitionImmediately(o.NORMAL) : t === s.SPRITE && this._updateSpriteTransition(o.NORMAL);
this._updateState();
},
_applyTransition: function(t) {
var e = this.transition;
e === s.COLOR ? this._updateColorTransition(t) : e === s.SPRITE ? this._updateSpriteTransition(t) : e === s.SCALE && this._updateScaleTransition(t);
},
_resizeNodeToTargetNode: !1,
_updateDisabledState: function() {
if (this._sprite) {
var t = !1;
this.enableAutoGrayEffect && (this.transition === s.SPRITE && this.disabledSprite || this.interactable || (t = !0));
this._switchGrayMaterial(t, this._sprite);
}
}
});
cc.Button = e.exports = a;
}), {
"../utils/gray-sprite-state": 185,
"./CCComponent": 47
} ],
46: [ (function(t, e, i) {
"use strict";
var n = t("../camera/CCCamera"), r = t("./CCComponent"), s = cc.Class({
name: "cc.Canvas",
extends: r,
editor: !1,
resetInEditor: !1,
statics: {
instance: null
},
properties: {
_designResolution: cc.size(960, 640),
designResolution: {
get: function() {
return cc.size(this._designResolution);
},
set: function(t) {
this._designResolution.width = t.width;
this._designResolution.height = t.height;
this.applySettings();
this.alignWithScreen();
},
tooltip: !1
},
_fitWidth: !1,
_fitHeight: !0,
fitHeight: {
get: function() {
return this._fitHeight;
},
set: function(t) {
if (this._fitHeight !== t) {
this._fitHeight = t;
this.applySettings();
this.alignWithScreen();
}
},
tooltip: !1
},
fitWidth: {
get: function() {
return this._fitWidth;
},
set: function(t) {
if (this._fitWidth !== t) {
this._fitWidth = t;
this.applySettings();
this.alignWithScreen();
}
},
tooltip: !1
}
},
ctor: function() {
this._thisOnResized = this.alignWithScreen.bind(this);
},
__preload: function() {
if (s.instance) return cc.errorID(6700, this.node.name, s.instance.node.name);
s.instance = this;
cc.sys.isMobile ? window.addEventListener("resize", this._thisOnResized) : cc.view.on("canvas-resize", this._thisOnResized);
this.applySettings();
this.alignWithScreen();
var t = cc.find("Main Camera", this.node);
if (!t) {
(t = new cc.Node("Main Camera")).parent = this.node;
t.setSiblingIndex(0);
}
var e = t.getComponent(n);
if (!e) {
e = t.addComponent(n);
var i = n.ClearFlags;
e.clearFlags = i.COLOR | i.DEPTH | i.STENCIL;
e.depth = -1;
}
n.main = e;
},
onDestroy: function() {
cc.sys.isMobile ? window.removeEventListener("resize", this._thisOnResized) : cc.view.off("canvas-resize", this._thisOnResized);
s.instance === this && (s.instance = null);
},
alignWithScreen: function() {
var t, e, i = e = cc.visibleRect;
t = cc.view.getDesignResolutionSize();
var n = 0, r = 0;
if (!this.fitHeight && !this.fitWidth) {
n = .5 * (t.width - i.width);
r = .5 * (t.height - i.height);
}
this.node.setPosition(.5 * i.width + n, .5 * i.height + r);
this.node.width = e.width;
this.node.height = e.height;
},
applySettings: function() {
var t, e = cc.ResolutionPolicy;
t = this.fitHeight && this.fitWidth ? e.SHOW_ALL : this.fitHeight || this.fitWidth ? this.fitWidth ? e.FIXED_WIDTH : e.FIXED_HEIGHT : e.NO_BORDER;
var i = this._designResolution;
cc.view.setDesignResolutionSize(i.width, i.height, t);
}
});
cc.Canvas = e.exports = s;
}), {
"../camera/CCCamera": 34,
"./CCComponent": 47
} ],
47: [ (function(t, e, i) {
"use strict";
var n = t("../platform/CCObject"), r = t("../platform/js"), s = new (t("../platform/id-generater"))("Comp"), o = (n.Flags.IsOnEnableCalled, 
n.Flags.IsOnLoadCalled), a = cc.Class({
name: "cc.Component",
extends: n,
ctor: function() {
this._id = s.getNewId();
this.__eventTargets = [];
},
properties: {
node: {
default: null,
visible: !1
},
name: {
get: function() {
if (this._name) return this._name;
var t = cc.js.getClassName(this), e = t.lastIndexOf(".");
e >= 0 && (t = t.slice(e + 1));
return this.node.name + "<" + t + ">";
},
set: function(t) {
this._name = t;
},
visible: !1
},
uuid: {
get: function() {
return this._id;
},
visible: !1
},
__scriptAsset: !1,
_enabled: !0,
enabled: {
get: function() {
return this._enabled;
},
set: function(t) {
if (this._enabled !== t) {
this._enabled = t;
if (this.node._activeInHierarchy) {
var e = cc.director._compScheduler;
t ? e.enableComp(this) : e.disableComp(this);
}
}
},
visible: !1,
animatable: !0
},
enabledInHierarchy: {
get: function() {
return this._enabled && this.node._activeInHierarchy;
},
visible: !1
},
_isOnLoadCalled: {
get: function() {
return this._objFlags & o;
}
}
},
update: null,
lateUpdate: null,
__preload: null,
onLoad: null,
start: null,
onEnable: null,
onDisable: null,
onDestroy: null,
onFocusInEditor: null,
onLostFocusInEditor: null,
resetInEditor: null,
addComponent: function(t) {
return this.node.addComponent(t);
},
getComponent: function(t) {
return this.node.getComponent(t);
},
getComponents: function(t) {
return this.node.getComponents(t);
},
getComponentInChildren: function(t) {
return this.node.getComponentInChildren(t);
},
getComponentsInChildren: function(t) {
return this.node.getComponentsInChildren(t);
},
_getLocalBounds: null,
onRestore: null,
destroy: function() {
this._super() && this._enabled && this.node._activeInHierarchy && cc.director._compScheduler.disableComp(this);
},
_onPreDestroy: function() {
this.unscheduleAllCallbacks();
for (var t = this.__eventTargets, e = 0, i = t.length; e < i; ++e) {
var n = t[e];
n && n.targetOff(this);
}
t.length = 0;
0;
cc.director._nodeActivator.destroyComp(this);
this.node._removeComponent(this);
},
_instantiate: function(t) {
t || (t = cc.instantiate._clone(this, this));
t.node = null;
return t;
},
schedule: function(t, e, i, n) {
cc.assertID(t, 1619);
cc.assertID(e >= 0, 1620);
e = e || 0;
i = isNaN(i) ? cc.macro.REPEAT_FOREVER : i;
n = n || 0;
var r = cc.director.getScheduler(), s = r.isTargetPaused(this);
r.schedule(t, this, e, i, n, s);
},
scheduleOnce: function(t, e) {
this.schedule(t, 0, 0, e);
},
unschedule: function(t) {
t && cc.director.getScheduler().unschedule(t, this);
},
unscheduleAllCallbacks: function() {
cc.director.getScheduler().unscheduleAllForTarget(this);
}
});
a._requireComponent = null;
a._executionOrder = 0;
0;
r.value(a, "_registerEditorProps", (function(t, e) {
var i = e.requireComponent;
i && (t._requireComponent = i);
var n = e.executionOrder;
n && "number" == typeof n && (t._executionOrder = n);
}));
a.prototype.__scriptUuid = "";
cc.Component = e.exports = a;
}), {
"../platform/CCObject": 116,
"../platform/id-generater": 126,
"../platform/js": 130
} ],
48: [ (function(t, e, i) {
"use strict";
cc.Component.EventHandler = cc.Class({
name: "cc.ClickEvent",
properties: {
target: {
default: null,
type: cc.Node
},
component: "",
_componentId: "",
_componentName: {
get: function() {
this._genCompIdIfNeeded();
return this._compId2Name(this._componentId);
},
set: function(t) {
this._componentId = this._compName2Id(t);
}
},
handler: {
default: ""
},
customEventData: {
default: ""
}
},
statics: {
emitEvents: function(t) {
var e = void 0;
if (arguments.length > 0) for (var i = 0, n = (e = new Array(arguments.length - 1)).length; i < n; i++) e[i] = arguments[i + 1];
for (var r = 0, s = t.length; r < s; r++) {
var o = t[r];
o instanceof cc.Component.EventHandler && o.emit(e);
}
}
},
emit: function(t) {
var e = this.target;
if (cc.isValid(e)) {
this._genCompIdIfNeeded();
var i = cc.js._getClassById(this._componentId), n = e.getComponent(i);
if (cc.isValid(n)) {
var r = n[this.handler];
if ("function" == typeof r) {
null != this.customEventData && "" !== this.customEventData && (t = t.slice()).push(this.customEventData);
r.apply(n, t);
}
}
}
},
_compName2Id: function(t) {
var e = cc.js.getClassByName(t);
return cc.js._getClassId(e);
},
_compId2Name: function(t) {
var e = cc.js._getClassById(t);
return cc.js.getClassName(e);
},
_genCompIdIfNeeded: function() {
if (!this._componentId) {
this._componentName = this.component;
this.component = "";
}
}
});
}), {} ],
49: [ (function(t, e, i) {
"use strict";
var n = t("../platform/CCMacro"), r = t("./CCRenderComponent"), s = t("../assets/material/CCMaterial"), o = t("../renderer/utils/label/label-frame"), a = n.TextAlignment, c = n.VerticalTextAlignment, l = cc.Enum({
NONE: 0,
CLAMP: 1,
SHRINK: 2,
RESIZE_HEIGHT: 3
}), u = cc.Enum({
NONE: 0,
BITMAP: 1,
CHAR: 2
}), h = cc.Class({
name: "cc.Label",
extends: r,
ctor: function() {
0;
this._actualFontSize = 0;
this._assemblerData = null;
this._frame = null;
this._ttfTexture = null;
this._letterTexture = null;
cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? this._activateMaterial = this._activateMaterialCanvas : this._activateMaterial = this._activateMaterialWebgl;
},
editor: !1,
properties: {
_useOriginalSize: !0,
_string: {
default: "",
formerlySerializedAs: "_N$string"
},
string: {
get: function() {
return this._string;
},
set: function(t) {
var e = this._string;
this._string = "" + t;
this.string !== e && this._lazyUpdateRenderData();
this._checkStringEmpty();
},
multiline: !0,
tooltip: !1
},
horizontalAlign: {
default: a.LEFT,
type: a,
tooltip: !1,
notify: function(t) {
this.horizontalAlign !== t && this._lazyUpdateRenderData();
},
animatable: !1
},
verticalAlign: {
default: c.TOP,
type: c,
tooltip: !1,
notify: function(t) {
this.verticalAlign !== t && this._lazyUpdateRenderData();
},
animatable: !1
},
actualFontSize: {
displayName: "Actual Font Size",
animatable: !1,
readonly: !0,
get: function() {
return this._actualFontSize;
},
tooltip: !1
},
_fontSize: 40,
fontSize: {
get: function() {
return this._fontSize;
},
set: function(t) {
if (this._fontSize !== t) {
this._fontSize = t;
this._lazyUpdateRenderData();
}
},
range: [ 0, 512 ],
tooltip: !1
},
fontFamily: {
default: "Arial",
tooltip: !1,
notify: function(t) {
this.fontFamily !== t && this._lazyUpdateRenderData();
},
animatable: !1
},
_lineHeight: 40,
lineHeight: {
get: function() {
return this._lineHeight;
},
set: function(t) {
if (this._lineHeight !== t) {
this._lineHeight = t;
this._lazyUpdateRenderData();
}
},
tooltip: !1
},
overflow: {
default: l.NONE,
type: l,
tooltip: !1,
notify: function(t) {
this.overflow !== t && this._lazyUpdateRenderData();
},
animatable: !1
},
_enableWrapText: !0,
enableWrapText: {
get: function() {
return this._enableWrapText;
},
set: function(t) {
if (this._enableWrapText !== t) {
this._enableWrapText = t;
this._lazyUpdateRenderData();
}
},
animatable: !1,
tooltip: !1
},
_N$file: null,
font: {
get: function() {
return this._N$file;
},
set: function(t) {
if (this.font !== t) {
t || (this._isSystemFontUsed = !0);
0;
this._N$file = t;
t && this._isSystemFontUsed && (this._isSystemFontUsed = !1);
"string" == typeof t && cc.warnID(4e3);
this._resetAssembler();
this._applyFontTexture(!0);
this._lazyUpdateRenderData();
}
},
type: cc.Font,
tooltip: !1,
animatable: !1
},
_isSystemFontUsed: !0,
useSystemFont: {
get: function() {
return this._isSystemFontUsed;
},
set: function(t) {
if (this._isSystemFontUsed !== t) {
this._isSystemFontUsed = !!t;
0;
if (t) {
this.font = null;
this._resetAssembler();
this._applyFontTexture(!0);
this._lazyUpdateRenderData();
this._checkStringEmpty();
}
}
},
animatable: !1,
tooltip: !1
},
_bmFontOriginalSize: {
displayName: "BMFont Original Size",
get: function() {
return this._N$file instanceof cc.BitmapFont ? this._N$file.fontSize : -1;
},
visible: !0,
animatable: !1
},
_spacingX: 0,
spacingX: {
get: function() {
return this._spacingX;
},
set: function(t) {
this._spacingX = t;
this._lazyUpdateRenderData();
},
tooltip: !1
},
_batchAsBitmap: !1,
cacheMode: {
default: u.NONE,
type: u,
tooltip: !1,
notify: function(t) {
if (this.cacheMode !== t) {
t !== u.BITMAP || this.font instanceof cc.BitmapFont || this._frame && this._frame._resetDynamicAtlasFrame();
t === u.CHAR && (this._ttfTexture = null);
this._resetAssembler();
this._applyFontTexture(!0);
this._lazyUpdateRenderData();
}
},
animatable: !1
},
_isBold: {
default: !1,
serializable: !1
},
_isItalic: {
default: !1,
serializable: !1
},
_isUnderline: {
default: !1,
serializable: !1
}
},
statics: {
HorizontalAlign: a,
VerticalAlign: c,
Overflow: l,
CacheMode: u,
_shareAtlas: null,
clearCharCache: function() {
h._shareAtlas && h._shareAtlas.clearAllCache();
}
},
onLoad: function() {
if (this._batchAsBitmap && this.cacheMode === u.NONE) {
this.cacheMode = u.BITMAP;
this._batchAsBitmap = !1;
}
cc.game.renderType === cc.game.RENDER_TYPE_CANVAS && (this.cacheMode = u.NONE);
},
onEnable: function() {
this._super();
this.node.on(cc.Node.EventType.SIZE_CHANGED, this._lazyUpdateRenderData, this);
this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._lazyUpdateRenderData, this);
this._forceUpdateRenderData();
this._checkStringEmpty();
},
onDisable: function() {
this._super();
this.node.off(cc.Node.EventType.SIZE_CHANGED, this._lazyUpdateRenderData, this);
this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._lazyUpdateRenderData, this);
},
onDestroy: function() {
this._assembler && this._assembler._resetAssemblerData && this._assembler._resetAssemblerData(this._assemblerData);
this._assemblerData = null;
this._letterTexture = null;
if (this._ttfTexture) {
this._ttfTexture.destroy();
this._ttfTexture = null;
}
this._super();
},
_updateColor: function() {
this.font instanceof cc.BitmapFont || this._lazyUpdateRenderData();
r.prototype._updateColor.call(this);
},
_resetAssembler: function() {
this._frame = null;
r.prototype._resetAssembler.call(this);
},
_canRender: function() {
var t = this._super(), e = this.font;
if (e instanceof cc.BitmapFont) {
var i = e.spriteFrame;
i && i.textureLoaded() || (t = !1);
}
return t;
},
_checkStringEmpty: function() {
this.markForRender(!!this.string);
},
_on3DNodeChanged: function() {
this._resetAssembler();
this._applyFontTexture(!0);
},
_applyFontTexture: function(t) {
var e = this.font;
if (e instanceof cc.BitmapFont) {
var i = e.spriteFrame;
this._frame = i;
var n = this, r = function() {
n._frame._texture = i._texture;
n._activateMaterial(t);
t && n._assembler && n._assembler.updateRenderData(n);
};
if (i && i.textureLoaded()) r(); else {
this.disableRender();
if (i) {
i.once("load", r, this);
i.ensureLoadTexture();
}
}
} else {
this._frame || (this._frame = new o());
if (this.cacheMode === u.CHAR) {
this._letterTexture = this._assembler._getAssemblerData();
this._frame._refreshTexture(this._letterTexture);
} else if (!this._ttfTexture) {
this._ttfTexture = new cc.Texture2D();
this._assemblerData = this._assembler._getAssemblerData();
this._ttfTexture.initWithElement(this._assemblerData.canvas);
}
if (this.cacheMode !== u.CHAR) {
this._frame._resetDynamicAtlasFrame();
this._frame._refreshTexture(this._ttfTexture);
}
this._activateMaterial(t);
t && this._assembler && this._assembler.updateRenderData(this);
}
},
_activateMaterialCanvas: function(t) {
if (t) {
this._frame._texture.url = this.uuid + "_texture";
this.markForUpdateRenderData(!0);
this.markForRender(!0);
}
},
_activateMaterialWebgl: function(t) {
if (t) if (this._frame) {
var e = this.sharedMaterials[0];
(e = e ? s.getInstantiatedMaterial(e, this) : s.getInstantiatedBuiltinMaterial("2d-sprite", this)).setProperty("texture", this._frame._texture);
this.setMaterial(0, e);
this.markForUpdateRenderData(!0);
this.markForRender(!0);
} else this.disableRender();
},
_lazyUpdateRenderData: function() {
this.setVertsDirty();
this.markForUpdateRenderData(!0);
},
_forceUpdateRenderData: function() {
this.setVertsDirty();
this._resetAssembler();
this._applyFontTexture(!0);
this.markForUpdateRenderData(!0);
},
_enableBold: function(t) {
this._isBold = !!t;
},
_enableItalics: function(t) {
this._isItalic = !!t;
},
_enableUnderline: function(t) {
this._isUnderline = !!t;
}
});
cc.Label = e.exports = h;
}), {
"../assets/material/CCMaterial": 30,
"../platform/CCMacro": 115,
"../renderer/utils/label/label-frame": 160,
"./CCRenderComponent": 54
} ],
50: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.LabelOutline",
extends: t("./CCComponent"),
editor: !1,
properties: {
_color: cc.Color.WHITE,
_width: 1,
color: {
tooltip: !1,
get: function() {
return this._color;
},
set: function(t) {
this._color = t;
this._updateRenderData();
}
},
width: {
tooltip: !1,
get: function() {
return this._width;
},
set: function(t) {
this._width = t;
this._updateRenderData();
},
range: [ 0, 512 ]
}
},
onEnable: function() {
this._updateRenderData();
},
onDisable: function() {
this._updateRenderData();
},
_updateRenderData: function() {
var t = this.node.getComponent(cc.Label);
t && t._lazyUpdateRenderData();
}
});
cc.LabelOutline = e.exports = n;
}), {
"./CCComponent": 47
} ],
51: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.LabelShadow",
extends: t("./CCComponent"),
editor: !1,
properties: {
_color: cc.Color.WHITE,
_offset: cc.v2(2, 2),
_blur: 2,
color: {
tooltip: !1,
get: function() {
return this._color;
},
set: function(t) {
this._color = t;
this._updateRenderData();
}
},
offset: {
tooltip: !1,
get: function() {
return this._offset;
},
set: function(t) {
this._offset = t;
this._updateRenderData();
}
},
blur: {
tooltip: !1,
get: function() {
return this._blur;
},
set: function(t) {
this._blur = t;
this._updateRenderData();
},
range: [ 0, 1024 ]
}
},
onEnable: function() {
this._updateRenderData();
},
onDisable: function() {
this._updateRenderData();
},
_updateRenderData: function() {
var t = this.node.getComponent(cc.Label);
t && t._lazyUpdateRenderData();
}
});
cc.LabelShadow = e.exports = n;
}), {
"./CCComponent": 47
} ],
52: [ (function(t, e, i) {
"use strict";
var n = t("../CCNode").EventType, r = cc.Enum({
NONE: 0,
HORIZONTAL: 1,
VERTICAL: 2,
GRID: 3
}), s = cc.Enum({
NONE: 0,
CONTAINER: 1,
CHILDREN: 2
}), o = cc.Enum({
HORIZONTAL: 0,
VERTICAL: 1
}), a = cc.Enum({
BOTTOM_TO_TOP: 0,
TOP_TO_BOTTOM: 1
}), c = cc.Enum({
LEFT_TO_RIGHT: 0,
RIGHT_TO_LEFT: 1
}), l = cc.Class({
name: "cc.Layout",
extends: t("./CCComponent"),
editor: !1,
properties: {
_layoutSize: cc.size(300, 200),
_layoutDirty: {
default: !0,
serializable: !1
},
_resize: s.NONE,
_N$layoutType: r.NONE,
type: {
type: r,
get: function() {
return this._N$layoutType;
},
set: function(t) {
this._N$layoutType = t;
this._doLayoutDirty();
},
tooltip: !1,
animatable: !1
},
resizeMode: {
type: s,
tooltip: !1,
animatable: !1,
get: function() {
return this._resize;
},
set: function(t) {
if (this.type !== r.NONE || t !== s.CHILDREN) {
this._resize = t;
this._doLayoutDirty();
}
}
},
cellSize: {
default: cc.size(40, 40),
tooltip: !1,
type: cc.Size,
notify: function() {
this._doLayoutDirty();
}
},
startAxis: {
default: o.HORIZONTAL,
tooltip: !1,
type: o,
notify: function() {
this._doLayoutDirty();
},
animatable: !1
},
_N$padding: {
default: 0
},
paddingLeft: {
default: 0,
tooltip: !1,
notify: function() {
this._doLayoutDirty();
}
},
paddingRight: {
default: 0,
tooltip: !1,
notify: function() {
this._doLayoutDirty();
}
},
paddingTop: {
default: 0,
tooltip: !1,
notify: function() {
this._doLayoutDirty();
}
},
paddingBottom: {
default: 0,
tooltip: !1,
notify: function() {
this._doLayoutDirty();
}
},
spacingX: {
default: 0,
notify: function() {
this._doLayoutDirty();
},
tooltip: !1
},
spacingY: {
default: 0,
notify: function() {
this._doLayoutDirty();
},
tooltip: !1
},
verticalDirection: {
default: a.TOP_TO_BOTTOM,
type: a,
notify: function() {
this._doLayoutDirty();
},
tooltip: !1,
animatable: !1
},
horizontalDirection: {
default: c.LEFT_TO_RIGHT,
type: c,
notify: function() {
this._doLayoutDirty();
},
tooltip: !1,
animatable: !1
},
affectedByScale: {
default: !1,
notify: function() {
this._doLayoutDirty();
},
animatable: !1,
tooltip: !1
}
},
statics: {
Type: r,
VerticalDirection: a,
HorizontalDirection: c,
ResizeMode: s,
AxisDirection: o
},
_migratePaddingData: function() {
this.paddingLeft = this._N$padding;
this.paddingRight = this._N$padding;
this.paddingTop = this._N$padding;
this.paddingBottom = this._N$padding;
this._N$padding = 0;
},
onEnable: function() {
this._addEventListeners();
this.node.getContentSize().equals(cc.size(0, 0)) && this.node.setContentSize(this._layoutSize);
0 !== this._N$padding && this._migratePaddingData();
this._doLayoutDirty();
},
onDisable: function() {
this._removeEventListeners();
},
_doLayoutDirty: function() {
this._layoutDirty = !0;
},
_doScaleDirty: function() {
this._layoutDirty = this._layoutDirty || this.affectedByScale;
},
_addEventListeners: function() {
cc.director.on(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
this.node.on(n.SIZE_CHANGED, this._resized, this);
this.node.on(n.ANCHOR_CHANGED, this._doLayoutDirty, this);
this.node.on(n.CHILD_ADDED, this._childAdded, this);
this.node.on(n.CHILD_REMOVED, this._childRemoved, this);
this.node.on(n.CHILD_REORDER, this._doLayoutDirty, this);
this._addChildrenEventListeners();
},
_removeEventListeners: function() {
cc.director.off(cc.Director.EVENT_AFTER_UPDATE, this.updateLayout, this);
this.node.off(n.SIZE_CHANGED, this._resized, this);
this.node.off(n.ANCHOR_CHANGED, this._doLayoutDirty, this);
this.node.off(n.CHILD_ADDED, this._childAdded, this);
this.node.off(n.CHILD_REMOVED, this._childRemoved, this);
this.node.off(n.CHILD_REORDER, this._doLayoutDirty, this);
this._removeChildrenEventListeners();
},
_addChildrenEventListeners: function() {
for (var t = this.node.children, e = 0; e < t.length; ++e) {
var i = t[e];
i.on(n.SCALE_CHANGED, this._doScaleDirty, this);
i.on(n.SIZE_CHANGED, this._doLayoutDirty, this);
i.on(n.POSITION_CHANGED, this._doLayoutDirty, this);
i.on(n.ANCHOR_CHANGED, this._doLayoutDirty, this);
i.on("active-in-hierarchy-changed", this._doLayoutDirty, this);
}
},
_removeChildrenEventListeners: function() {
for (var t = this.node.children, e = 0; e < t.length; ++e) {
var i = t[e];
i.off(n.SCALE_CHANGED, this._doScaleDirty, this);
i.off(n.SIZE_CHANGED, this._doLayoutDirty, this);
i.off(n.POSITION_CHANGED, this._doLayoutDirty, this);
i.off(n.ANCHOR_CHANGED, this._doLayoutDirty, this);
i.off("active-in-hierarchy-changed", this._doLayoutDirty, this);
}
},
_childAdded: function(t) {
t.on(n.SCALE_CHANGED, this._doScaleDirty, this);
t.on(n.SIZE_CHANGED, this._doLayoutDirty, this);
t.on(n.POSITION_CHANGED, this._doLayoutDirty, this);
t.on(n.ANCHOR_CHANGED, this._doLayoutDirty, this);
t.on("active-in-hierarchy-changed", this._doLayoutDirty, this);
this._doLayoutDirty();
},
_childRemoved: function(t) {
t.off(n.SCALE_CHANGED, this._doScaleDirty, this);
t.off(n.SIZE_CHANGED, this._doLayoutDirty, this);
t.off(n.POSITION_CHANGED, this._doLayoutDirty, this);
t.off(n.ANCHOR_CHANGED, this._doLayoutDirty, this);
t.off("active-in-hierarchy-changed", this._doLayoutDirty, this);
this._doLayoutDirty();
},
_resized: function() {
this._layoutSize = this.node.getContentSize();
this._doLayoutDirty();
},
_doLayoutHorizontally: function(t, e, i, n) {
var o = this.node.getAnchorPoint(), l = this.node.children, u = 1, h = this.paddingLeft, f = -o.x * t;
if (this.horizontalDirection === c.RIGHT_TO_LEFT) {
u = -1;
f = (1 - o.x) * t;
h = this.paddingRight;
}
for (var d = f + u * h - u * this.spacingX, _ = 0, p = 0, v = 0, g = 0, m = 0, y = 0, E = 0, C = 0; C < l.length; ++C) {
(A = l[C]).activeInHierarchy && E++;
}
var T = this.cellSize.width;
this.type !== r.GRID && this.resizeMode === s.CHILDREN && (T = (t - (this.paddingLeft + this.paddingRight) - (E - 1) * this.spacingX) / E);
for (C = 0; C < l.length; ++C) {
var A = l[C], x = this._getUsedScaleValue(A.scaleX), b = this._getUsedScaleValue(A.scaleY);
if (A.activeInHierarchy) {
if (this._resize === s.CHILDREN) {
A.width = T / x;
this.type === r.GRID && (A.height = this.cellSize.height / b);
}
var S = A.anchorX, R = A.width * x, w = A.height * b;
v > p && (p = v);
if (w >= p) {
v = p;
p = w;
y = A.getAnchorPoint().y;
}
this.horizontalDirection === c.RIGHT_TO_LEFT && (S = 1 - A.anchorX);
d = d + u * S * R + u * this.spacingX;
var L = u * (1 - S) * R;
if (e) {
var O = d + L + u * (u > 0 ? this.paddingRight : this.paddingLeft), M = this.horizontalDirection === c.LEFT_TO_RIGHT && O > (1 - o.x) * t, I = this.horizontalDirection === c.RIGHT_TO_LEFT && O < -o.x * t;
if (M || I) {
if (w >= p) {
0 === v && (v = p);
_ += v;
v = p;
} else {
_ += p;
v = w;
p = 0;
}
d = f + u * (h + S * R);
g++;
}
}
var D = i(A, _, g);
t >= R + this.paddingLeft + this.paddingRight && n && A.setPosition(cc.v2(d, D));
var N, P = 1, F = 0 === p ? w : p;
if (this.verticalDirection === a.TOP_TO_BOTTOM) {
m = m || this.node._contentSize.height;
(N = D + (P = -1) * (F * y + this.paddingBottom)) < m && (m = N);
} else {
m = m || -this.node._contentSize.height;
(N = D + P * (F * y + this.paddingTop)) > m && (m = N);
}
d += L;
}
}
return m;
},
_getVerticalBaseHeight: function(t) {
var e = 0, i = 0;
if (this.resizeMode === s.CONTAINER) {
for (var n = 0; n < t.length; ++n) {
var r = t[n];
if (r.activeInHierarchy) {
i++;
e += r.height * this._getUsedScaleValue(r.scaleY);
}
}
e += (i - 1) * this.spacingY + this.paddingBottom + this.paddingTop;
} else e = this.node.getContentSize().height;
return e;
},
_doLayoutVertically: function(t, e, i, n) {
var o = this.node.getAnchorPoint(), l = this.node.children, u = 1, h = this.paddingBottom, f = -o.y * t;
if (this.verticalDirection === a.TOP_TO_BOTTOM) {
u = -1;
f = (1 - o.y) * t;
h = this.paddingTop;
}
for (var d = f + u * h - u * this.spacingY, _ = 0, p = 0, v = 0, g = 0, m = 0, y = 0, E = 0, C = 0; C < l.length; ++C) {
(A = l[C]).activeInHierarchy && E++;
}
var T = this.cellSize.height;
this.type !== r.GRID && this.resizeMode === s.CHILDREN && (T = (t - (this.paddingTop + this.paddingBottom) - (E - 1) * this.spacingY) / E);
for (C = 0; C < l.length; ++C) {
var A = l[C], x = this._getUsedScaleValue(A.scaleX), b = this._getUsedScaleValue(A.scaleY);
if (A.activeInHierarchy) {
if (this.resizeMode === s.CHILDREN) {
A.height = T / b;
this.type === r.GRID && (A.width = this.cellSize.width / x);
}
var S = A.anchorY, R = A.width * x, w = A.height * b;
v > p && (p = v);
if (R >= p) {
v = p;
p = R;
y = A.getAnchorPoint().x;
}
this.verticalDirection === a.TOP_TO_BOTTOM && (S = 1 - A.anchorY);
d = d + u * S * w + u * this.spacingY;
var L = u * (1 - S) * w;
if (e) {
var O = d + L + u * (u > 0 ? this.paddingTop : this.paddingBottom), M = this.verticalDirection === a.BOTTOM_TO_TOP && O > (1 - o.y) * t, I = this.verticalDirection === a.TOP_TO_BOTTOM && O < -o.y * t;
if (M || I) {
if (R >= p) {
0 === v && (v = p);
_ += v;
v = p;
} else {
_ += p;
v = R;
p = 0;
}
d = f + u * (h + S * w);
g++;
}
}
var D = i(A, _, g);
t >= w + (this.paddingTop + this.paddingBottom) && n && A.setPosition(cc.v2(D, d));
var N, P = 1, F = 0 === p ? R : p;
if (this.horizontalDirection === c.RIGHT_TO_LEFT) {
P = -1;
m = m || this.node._contentSize.width;
(N = D + P * (F * y + this.paddingLeft)) < m && (m = N);
} else {
m = m || -this.node._contentSize.width;
(N = D + P * (F * y + this.paddingRight)) > m && (m = N);
}
d += L;
}
}
return m;
},
_doLayoutBasic: function() {
for (var t = this.node.children, e = null, i = 0; i < t.length; ++i) {
var n = t[i];
n.activeInHierarchy && (e ? e.union(e, n.getBoundingBoxToWorld()) : e = n.getBoundingBoxToWorld());
}
if (e) {
var r = this.node.convertToNodeSpaceAR(cc.v2(e.x, e.y));
r = cc.v2(r.x - this.paddingLeft, r.y - this.paddingBottom);
var s = this.node.convertToNodeSpaceAR(cc.v2(e.xMax, e.yMax)), o = (s = cc.v2(s.x + this.paddingRight, s.y + this.paddingTop)).sub(r);
if (0 !== (o = cc.size(parseFloat(o.x.toFixed(2)), parseFloat(o.y.toFixed(2)))).width) {
var a = -r.x / o.width;
this.node.anchorX = parseFloat(a.toFixed(2));
}
if (0 !== o.height) {
var c = -r.y / o.height;
this.node.anchorY = parseFloat(c.toFixed(2));
}
this.node.setContentSize(o);
}
},
_doLayoutGridAxisHorizontal: function(t, e) {
var i = e.width, n = 1, r = -t.y * e.height, o = this.paddingBottom;
if (this.verticalDirection === a.TOP_TO_BOTTOM) {
n = -1;
r = (1 - t.y) * e.height;
o = this.paddingTop;
}
var c = function(t, e, i) {
return r + n * (e + t.anchorY * t.height * this._getUsedScaleValue(t.scaleY) + o + i * this.spacingY);
}.bind(this), l = 0;
if (this.resizeMode === s.CONTAINER) {
var u = this._doLayoutHorizontally(i, !0, c, !1);
(l = r - u) < 0 && (l *= -1);
r = -t.y * l;
if (this.verticalDirection === a.TOP_TO_BOTTOM) {
n = -1;
r = (1 - t.y) * l;
}
}
this._doLayoutHorizontally(i, !0, c, !0);
this.resizeMode === s.CONTAINER && this.node.setContentSize(i, l);
},
_doLayoutGridAxisVertical: function(t, e) {
var i = e.height, n = 1, r = -t.x * e.width, o = this.paddingLeft;
if (this.horizontalDirection === c.RIGHT_TO_LEFT) {
n = -1;
r = (1 - t.x) * e.width;
o = this.paddingRight;
}
var a = function(t, e, i) {
return r + n * (e + t.anchorX * t.width * this._getUsedScaleValue(t.scaleX) + o + i * this.spacingX);
}.bind(this), l = 0;
if (this.resizeMode === s.CONTAINER) {
var u = this._doLayoutVertically(i, !0, a, !1);
(l = r - u) < 0 && (l *= -1);
r = -t.x * l;
if (this.horizontalDirection === c.RIGHT_TO_LEFT) {
n = -1;
r = (1 - t.x) * l;
}
}
this._doLayoutVertically(i, !0, a, !0);
this.resizeMode === s.CONTAINER && this.node.setContentSize(l, i);
},
_doLayoutGrid: function() {
var t = this.node.getAnchorPoint(), e = this.node.getContentSize();
this.startAxis === o.HORIZONTAL ? this._doLayoutGridAxisHorizontal(t, e) : this.startAxis === o.VERTICAL && this._doLayoutGridAxisVertical(t, e);
},
_getHorizontalBaseWidth: function(t) {
var e = 0, i = 0;
if (this.resizeMode === s.CONTAINER) {
for (var n = 0; n < t.length; ++n) {
var r = t[n];
if (r.activeInHierarchy) {
i++;
e += r.width * this._getUsedScaleValue(r.scaleX);
}
}
e += (i - 1) * this.spacingX + this.paddingLeft + this.paddingRight;
} else e = this.node.getContentSize().width;
return e;
},
_doLayout: function() {
if (this.type === r.HORIZONTAL) {
var t = this._getHorizontalBaseWidth(this.node.children);
this._doLayoutHorizontally(t, !1, (function(t) {
return t.y;
}), !0);
this.node.width = t;
} else if (this.type === r.VERTICAL) {
var e = this._getVerticalBaseHeight(this.node.children);
this._doLayoutVertically(e, !1, (function(t) {
return t.x;
}), !0);
this.node.height = e;
} else this.type === r.NONE ? this.resizeMode === s.CONTAINER && this._doLayoutBasic() : this.type === r.GRID && this._doLayoutGrid();
},
_getUsedScaleValue: function(t) {
return this.affectedByScale ? Math.abs(t) : 1;
},
updateLayout: function() {
if (this._layoutDirty && this.node.children.length > 0) {
this._doLayout();
this._layoutDirty = !1;
}
}
});
Object.defineProperty(l.prototype, "padding", {
get: function() {
cc.warnID(4100);
return this.paddingLeft;
},
set: function(t) {
this._N$padding = t;
this._migratePaddingData();
this._doLayoutDirty();
}
});
cc.Layout = e.exports = l;
}), {
"../CCNode": 7,
"./CCComponent": 47
} ],
53: [ (function(t, e, i) {
"use strict";
var n = t("../utils/misc"), r = t("./CCComponent"), s = cc.Enum({
HORIZONTAL: 0,
VERTICAL: 1,
FILLED: 2
}), o = cc.Class({
name: "cc.ProgressBar",
extends: r,
editor: !1,
_initBarSprite: function() {
if (this.barSprite) {
var t = this.barSprite.node;
if (!t) return;
var e = this.node.getContentSize(), i = this.node.getAnchorPoint(), n = t.getContentSize();
t.parent === this.node && this.node.setContentSize(n);
this.barSprite.fillType === cc.Sprite.FillType.RADIAL && (this.mode = s.FILLED);
var r = t.getContentSize();
this.mode === s.HORIZONTAL ? this.totalLength = r.width : this.mode === s.VERTICAL ? this.totalLength = r.height : this.totalLength = this.barSprite.fillRange;
if (t.parent === this.node) {
var o = -e.width * i.x;
t.setPosition(cc.v2(o, 0));
}
}
},
_updateBarStatus: function() {
if (this.barSprite) {
var t = this.barSprite.node;
if (!t) return;
var e, i, r, o = t.getAnchorPoint(), a = t.getContentSize(), c = t.getPosition(), l = cc.v2(0, .5), u = n.clamp01(this.progress), h = this.totalLength * u;
switch (this.mode) {
case s.HORIZONTAL:
this.reverse && (l = cc.v2(1, .5));
e = cc.size(h, a.height);
i = this.totalLength;
r = a.height;
break;

case s.VERTICAL:
l = this.reverse ? cc.v2(.5, 1) : cc.v2(.5, 0);
e = cc.size(a.width, h);
i = a.width;
r = this.totalLength;
}
if (this.mode === s.FILLED) if (this.barSprite.type !== cc.Sprite.Type.FILLED) cc.warn("ProgressBar FILLED mode only works when barSprite's Type is FILLED!"); else {
this.reverse && (h *= -1);
this.barSprite.fillRange = h;
} else if (this.barSprite.type !== cc.Sprite.Type.FILLED) {
var f = l.x - o.x, d = l.y - o.y, _ = cc.v2(i * f, r * d);
t.setPosition(c.x + _.x, c.y + _.y);
t.setAnchorPoint(l);
t.setContentSize(e);
} else cc.warn("ProgressBar non-FILLED mode only works when barSprite's Type is non-FILLED!");
}
},
properties: {
barSprite: {
default: null,
type: cc.Sprite,
tooltip: !1,
notify: function() {
this._initBarSprite();
},
animatable: !1
},
mode: {
default: s.HORIZONTAL,
type: s,
tooltip: !1,
notify: function() {
if (this.barSprite) {
var t = this.barSprite.node;
if (!t) return;
var e = t.getContentSize();
this.mode === s.HORIZONTAL ? this.totalLength = e.width : this.mode === s.VERTICAL ? this.totalLength = e.height : this.mode === s.FILLED && (this.totalLength = this.barSprite.fillRange);
}
},
animatable: !1
},
_N$totalLength: 1,
totalLength: {
range: [ 0, Number.MAX_VALUE ],
tooltip: !1,
get: function() {
return this._N$totalLength;
},
set: function(t) {
this.mode === s.FILLED && (t = n.clamp01(t));
this._N$totalLength = t;
this._updateBarStatus();
}
},
progress: {
default: 1,
type: cc.Float,
range: [ 0, 1, .1 ],
slide: !0,
tooltip: !1,
notify: function() {
this._updateBarStatus();
}
},
reverse: {
default: !1,
tooltip: !1,
notify: function() {
this.barSprite && (this.barSprite.fillStart = 1 - this.barSprite.fillStart);
this._updateBarStatus();
},
animatable: !1
}
},
statics: {
Mode: s
}
});
cc.ProgressBar = e.exports = o;
}), {
"../utils/misc": 187,
"./CCComponent": 47
} ],
54: [ (function(t, e, i) {
"use strict";
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../renderer/assembler"));
var r = t("./CCComponent"), s = t("../renderer/render-flow"), o = t("../assets/material/CCMaterial"), a = cc.Class({
name: "RenderComponent",
extends: r,
editor: !1,
properties: {
_materials: {
default: [],
type: o
},
sharedMaterials: {
get: function() {
return this._materials;
},
set: function(t) {
this._materials = t;
this._activateMaterial(!0);
},
type: [ o ],
displayName: "Materials",
animatable: !1
}
},
ctor: function() {
this._vertsDirty = !0;
this._material = null;
this._assembler = null;
},
_resetAssembler: function() {
this.setVertsDirty(!0);
n.default.init(this);
this._updateColor();
},
__preload: function() {
this._resetAssembler();
},
onEnable: function() {
this.node._renderComponent && (this.node._renderComponent.enabled = !1);
this.node._renderComponent = this;
this.node.on(cc.Node.EventType.SIZE_CHANGED, this._onNodeSizeDirty, this);
this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
this.node._renderFlag |= s.FLAG_RENDER | s.FLAG_UPDATE_RENDER_DATA | s.FLAG_OPACITY_COLOR;
},
onDisable: function() {
this.node._renderComponent = null;
this.node.off(cc.Node.EventType.SIZE_CHANGED, this._onNodeSizeDirty, this);
this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._onNodeSizeDirty, this);
this.disableRender();
},
onDestroy: function() {
for (var t = this._materials, e = 0; e < t.length; e++) cc.pool.material.put(t[e]);
t.length = 0;
cc.pool.assembler.put(this._assembler);
},
setVertsDirty: function() {
this._vertsDirty = !0;
this.markForUpdateRenderData(!0);
},
_onNodeSizeDirty: function() {
this.setVertsDirty();
},
_on3DNodeChanged: function() {
this.setVertsDirty();
},
_canRender: function() {
return this._enabled && this.node._activeInHierarchy;
},
markForUpdateRenderData: function(t) {
t && this._canRender() ? this.node._renderFlag |= s.FLAG_UPDATE_RENDER_DATA : t || (this.node._renderFlag &= ~s.FLAG_UPDATE_RENDER_DATA);
},
markForRender: function(t) {
t && this._canRender() ? this.node._renderFlag |= s.FLAG_RENDER : t || (this.node._renderFlag &= ~s.FLAG_RENDER);
},
disableRender: function() {
this.node._renderFlag &= ~(s.FLAG_RENDER | s.FLAG_UPDATE_RENDER_DATA);
},
getMaterial: function(t) {
if (t < 0 || t >= this._materials.length) return null;
var e = this._materials[t];
if (!e) return null;
var i = o.getInstantiatedMaterial(e, this);
i !== e && this.setMaterial(t, i);
return this._materials[t];
},
setMaterial: function(t, e) {
this._materials[t] = e;
e && this.markForUpdateRenderData(!0);
},
_activateMaterial: function(t) {},
_updateColor: function() {
this._assembler.updateColor && this._assembler.updateColor(this);
},
_checkBacth: function(t, e) {
var i = this.sharedMaterials[0];
if (i && i.getHash() !== t.material.getHash() || t.cullingMask !== e) {
t._flush();
t.node = i.getDefine("CC_USE_MODEL") ? this.node : t._dummyNode;
t.material = i;
t.cullingMask = e;
}
}
});
cc.RenderComponent = e.exports = a;
}), {
"../assets/material/CCMaterial": 30,
"../renderer/assembler": 138,
"../renderer/render-flow": 156,
"./CCComponent": 47
} ],
55: [ (function(t, e, i) {
"use strict";
var n = t("../utils/misc"), r = (t("./CCComponent"), cc.Enum({
HORIZONTAL: 0,
VERTICAL: 1
})), s = cc.Class({
name: "cc.Scrollbar",
extends: t("./CCComponent"),
editor: !1,
properties: {
_scrollView: null,
_touching: !1,
_autoHideRemainingTime: {
default: 0,
serializable: !1
},
_opacity: 255,
handle: {
default: null,
type: cc.Sprite,
tooltip: !1,
notify: function() {
this._onScroll(cc.v2(0, 0));
},
animatable: !1
},
direction: {
default: r.HORIZONTAL,
type: r,
tooltip: !1,
notify: function() {
this._onScroll(cc.v2(0, 0));
},
animatable: !1
},
enableAutoHide: {
default: !0,
animatable: !1,
tooltip: !1
},
autoHideTime: {
default: 1,
animatable: !1,
tooltip: !1
}
},
statics: {
Direction: r
},
setTargetScrollView: function(t) {
this._scrollView = t;
},
_convertToScrollViewSpace: function(t) {
var e = this._scrollView.node, i = t.convertToWorldSpaceAR(cc.v2(-t.anchorX * t.width, -t.anchorY * t.height)), n = e.convertToNodeSpaceAR(i);
n.x += e.anchorX * e.width;
n.y += e.anchorY * e.height;
return n;
},
_setOpacity: function(t) {
if (this.handle) {
this.node.opacity = t;
this.handle.node.opacity = t;
}
},
_onScroll: function(t) {
if (this._scrollView) {
var e = this._scrollView.content;
if (e) {
var i = e.getContentSize(), n = this._scrollView.node.getContentSize(), s = this.node.getContentSize();
if (this._conditionalDisableScrollBar(i, n)) return;
if (this.enableAutoHide) {
this._autoHideRemainingTime = this.autoHideTime;
this._setOpacity(this._opacity);
}
var o = 0, a = 0, c = 0, l = 0, u = 0;
if (this.direction === r.HORIZONTAL) {
o = i.width;
a = n.width;
u = s.width;
c = t.x;
l = -this._convertToScrollViewSpace(e).x;
} else if (this.direction === r.VERTICAL) {
o = i.height;
a = n.height;
u = s.height;
c = t.y;
l = -this._convertToScrollViewSpace(e).y;
}
var h = this._calculateLength(o, a, u, c), f = this._calculatePosition(o, a, u, l, c, h);
this._updateLength(h);
this._updateHanlderPosition(f);
}
}
},
_updateHanlderPosition: function(t) {
if (this.handle) {
var e = this._fixupHandlerPosition();
this.handle.node.setPosition(t.x + e.x, t.y + e.y);
}
},
_fixupHandlerPosition: function() {
var t = this.node.getContentSize(), e = this.node.getAnchorPoint(), i = this.handle.node.getContentSize(), n = this.handle.node.parent, s = this.node.convertToWorldSpaceAR(cc.v2(-t.width * e.x, -t.height * e.y)), o = n.convertToNodeSpaceAR(s);
this.direction === r.HORIZONTAL ? o = cc.v2(o.x, o.y + (t.height - i.height) / 2) : this.direction === r.VERTICAL && (o = cc.v2(o.x + (t.width - i.width) / 2, o.y));
this.handle.node.setPosition(o);
return o;
},
_onTouchBegan: function() {
this.enableAutoHide && (this._touching = !0);
},
_conditionalDisableScrollBar: function(t, e) {
return t.width <= e.width && this.direction === r.HORIZONTAL || t.height <= e.height && this.direction === r.VERTICAL;
},
_onTouchEnded: function() {
if (this.enableAutoHide) {
this._touching = !1;
if (!(this.autoHideTime <= 0)) {
if (this._scrollView) {
var t = this._scrollView.content;
if (t) {
var e = t.getContentSize(), i = this._scrollView.node.getContentSize();
if (this._conditionalDisableScrollBar(e, i)) return;
}
}
this._autoHideRemainingTime = this.autoHideTime;
}
}
},
_calculateLength: function(t, e, i, n) {
var r = t;
n && (r += 20 * (n > 0 ? n : -n));
return i * (e / r);
},
_calculatePosition: function(t, e, i, s, o, a) {
var c = t - e;
o && (c += Math.abs(o));
var l = 0;
if (c) {
l = s / c;
l = n.clamp01(l);
}
var u = (i - a) * l;
return this.direction === r.VERTICAL ? cc.v2(0, u) : cc.v2(u, 0);
},
_updateLength: function(t) {
if (this.handle) {
var e = this.handle.node, i = e.getContentSize();
e.setAnchorPoint(cc.v2(0, 0));
this.direction === r.HORIZONTAL ? e.setContentSize(t, i.height) : e.setContentSize(i.width, t);
}
},
_processAutoHide: function(t) {
if (this.enableAutoHide && !(this._autoHideRemainingTime <= 0) && !this._touching) {
this._autoHideRemainingTime -= t;
if (this._autoHideRemainingTime <= this.autoHideTime) {
this._autoHideRemainingTime = Math.max(0, this._autoHideRemainingTime);
var e = this._opacity * (this._autoHideRemainingTime / this.autoHideTime);
this._setOpacity(e);
}
}
},
start: function() {
this.enableAutoHide && this._setOpacity(0);
},
hide: function() {
this._autoHideRemainingTime = 0;
this._setOpacity(0);
},
show: function() {
this._autoHideRemainingTime = this.autoHideTime;
this._setOpacity(this._opacity);
},
update: function(t) {
this._processAutoHide(t);
}
});
cc.Scrollbar = e.exports = s;
}), {
"../utils/misc": 187,
"./CCComponent": 47
} ],
56: [ (function(t, e, i) {
"use strict";
var n = t("../CCNode").EventType, r = function(t) {
return (t -= 1) * t * t * t * t + 1;
}, s = function() {
return new Date().getMilliseconds();
}, o = cc.Enum({
SCROLL_TO_TOP: 0,
SCROLL_TO_BOTTOM: 1,
SCROLL_TO_LEFT: 2,
SCROLL_TO_RIGHT: 3,
SCROLLING: 4,
BOUNCE_TOP: 5,
BOUNCE_BOTTOM: 6,
BOUNCE_LEFT: 7,
BOUNCE_RIGHT: 8,
SCROLL_ENDED: 9,
TOUCH_UP: 10,
AUTOSCROLL_ENDED_WITH_THRESHOLD: 11,
SCROLL_BEGAN: 12
}), a = {
"scroll-to-top": o.SCROLL_TO_TOP,
"scroll-to-bottom": o.SCROLL_TO_BOTTOM,
"scroll-to-left": o.SCROLL_TO_LEFT,
"scroll-to-right": o.SCROLL_TO_RIGHT,
scrolling: o.SCROLLING,
"bounce-bottom": o.BOUNCE_BOTTOM,
"bounce-left": o.BOUNCE_LEFT,
"bounce-right": o.BOUNCE_RIGHT,
"bounce-top": o.BOUNCE_TOP,
"scroll-ended": o.SCROLL_ENDED,
"touch-up": o.TOUCH_UP,
"scroll-ended-with-threshold": o.AUTOSCROLL_ENDED_WITH_THRESHOLD,
"scroll-began": o.SCROLL_BEGAN
}, c = cc.Class({
name: "cc.ScrollView",
extends: t("./CCViewGroup"),
editor: !1,
ctor: function() {
this._topBoundary = 0;
this._bottomBoundary = 0;
this._leftBoundary = 0;
this._rightBoundary = 0;
this._touchMoveDisplacements = [];
this._touchMoveTimeDeltas = [];
this._touchMovePreviousTimestamp = 0;
this._touchMoved = !1;
this._autoScrolling = !1;
this._autoScrollAttenuate = !1;
this._autoScrollStartPosition = cc.v2(0, 0);
this._autoScrollTargetDelta = cc.v2(0, 0);
this._autoScrollTotalTime = 0;
this._autoScrollAccumulatedTime = 0;
this._autoScrollCurrentlyOutOfBoundary = !1;
this._autoScrollBraking = !1;
this._autoScrollBrakingStartPosition = cc.v2(0, 0);
this._outOfBoundaryAmount = cc.v2(0, 0);
this._outOfBoundaryAmountDirty = !0;
this._stopMouseWheel = !1;
this._mouseWheelEventElapsedTime = 0;
this._isScrollEndedWithThresholdEventFired = !1;
this._scrollEventEmitMask = 0;
this._isBouncing = !1;
this._scrolling = !1;
},
properties: {
content: {
default: void 0,
type: cc.Node,
tooltip: !1,
formerlySerializedAs: "content",
notify: function(t) {
this._calculateBoundary();
}
},
horizontal: {
default: !0,
animatable: !1,
tooltip: !1
},
vertical: {
default: !0,
animatable: !1,
tooltip: !1
},
inertia: {
default: !0,
tooltip: !1
},
brake: {
default: .5,
type: cc.Float,
range: [ 0, 1, .1 ],
tooltip: !1
},
elastic: {
default: !0,
animatable: !1,
tooltip: !1
},
bounceDuration: {
default: 1,
range: [ 0, 10 ],
tooltip: !1
},
horizontalScrollBar: {
default: void 0,
type: cc.Scrollbar,
tooltip: !1,
notify: function() {
if (this.horizontalScrollBar) {
this.horizontalScrollBar.setTargetScrollView(this);
this._updateScrollBar(0);
}
},
animatable: !1
},
verticalScrollBar: {
default: void 0,
type: cc.Scrollbar,
tooltip: !1,
notify: function() {
if (this.verticalScrollBar) {
this.verticalScrollBar.setTargetScrollView(this);
this._updateScrollBar(0);
}
},
animatable: !1
},
scrollEvents: {
default: [],
type: cc.Component.EventHandler,
tooltip: !1
},
cancelInnerEvents: {
default: !0,
animatable: !1,
tooltip: !1
},
_view: {
get: function() {
if (this.content) return this.content.parent;
}
}
},
statics: {
EventType: o
},
scrollToBottom: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(0, 0),
applyToHorizontal: !1,
applyToVertical: !0
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i, !0);
},
scrollToTop: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(0, 1),
applyToHorizontal: !1,
applyToVertical: !0
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
},
scrollToLeft: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(0, 0),
applyToHorizontal: !0,
applyToVertical: !1
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
},
scrollToRight: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(1, 0),
applyToHorizontal: !0,
applyToVertical: !1
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
},
scrollToTopLeft: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(0, 1),
applyToHorizontal: !0,
applyToVertical: !0
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
},
scrollToTopRight: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(1, 1),
applyToHorizontal: !0,
applyToVertical: !0
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
},
scrollToBottomLeft: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(0, 0),
applyToHorizontal: !0,
applyToVertical: !0
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
},
scrollToBottomRight: function(t, e) {
var i = this._calculateMovePercentDelta({
anchor: cc.v2(1, 0),
applyToHorizontal: !0,
applyToVertical: !0
});
t ? this._startAutoScroll(i, t, !1 !== e) : this._moveContent(i);
},
scrollToOffset: function(t, e, i) {
var n = this.getMaxScrollOffset(), r = cc.v2(0, 0);
0 === n.x ? r.x = 0 : r.x = t.x / n.x;
0 === n.y ? r.y = 1 : r.y = (n.y - t.y) / n.y;
this.scrollTo(r, e, i);
},
getScrollOffset: function() {
var t = this._getContentTopBoundary() - this._topBoundary, e = this._getContentLeftBoundary() - this._leftBoundary;
return cc.v2(e, t);
},
getMaxScrollOffset: function() {
var t = this._view.getContentSize(), e = this.content.getContentSize(), i = e.width - t.width, n = e.height - t.height;
i = i >= 0 ? i : 0;
n = n >= 0 ? n : 0;
return cc.v2(i, n);
},
scrollToPercentHorizontal: function(t, e, i) {
var n = this._calculateMovePercentDelta({
anchor: cc.v2(t, 0),
applyToHorizontal: !0,
applyToVertical: !1
});
e ? this._startAutoScroll(n, e, !1 !== i) : this._moveContent(n);
},
scrollTo: function(t, e, i) {
var n = this._calculateMovePercentDelta({
anchor: cc.v2(t),
applyToHorizontal: !0,
applyToVertical: !0
});
e ? this._startAutoScroll(n, e, !1 !== i) : this._moveContent(n);
},
scrollToPercentVertical: function(t, e, i) {
var n = this._calculateMovePercentDelta({
anchor: cc.v2(0, t),
applyToHorizontal: !1,
applyToVertical: !0
});
e ? this._startAutoScroll(n, e, !1 !== i) : this._moveContent(n);
},
stopAutoScroll: function() {
this._autoScrolling = !1;
this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
},
setContentPosition: function(t) {
if (!t.fuzzyEquals(this.getContentPosition(), 1e-4)) {
this.content.setPosition(t);
this._outOfBoundaryAmountDirty = !0;
}
},
getContentPosition: function() {
return this.content.getPosition();
},
isScrolling: function() {
return this._scrolling;
},
isAutoScrolling: function() {
return this._autoScrolling;
},
_registerEvent: function() {
this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0);
this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0);
this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0);
this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0);
this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, !0);
},
_unregisterEvent: function() {
this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, !0);
this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, !0);
this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, !0);
this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, !0);
this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, !0);
},
_onMouseWheel: function(t, e) {
if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
var i = cc.v2(0, 0), n = -.1;
n = -7;
this.vertical ? i = cc.v2(0, t.getScrollY() * n) : this.horizontal && (i = cc.v2(t.getScrollY() * n, 0));
this._mouseWheelEventElapsedTime = 0;
this._processDeltaMove(i);
if (!this._stopMouseWheel) {
this._handlePressLogic();
this.schedule(this._checkMouseWheel, 1 / 60);
this._stopMouseWheel = !0;
}
this._stopPropagationIfTargetIsMe(t);
}
},
_checkMouseWheel: function(t) {
if (this._getHowMuchOutOfBoundary().fuzzyEquals(cc.v2(0, 0), 1e-4)) {
this._mouseWheelEventElapsedTime += t;
if (this._mouseWheelEventElapsedTime > .1) {
this._onScrollBarTouchEnded();
this.unschedule(this._checkMouseWheel);
this._stopMouseWheel = !1;
}
} else {
this._processInertiaScroll();
this.unschedule(this._checkMouseWheel);
this._stopMouseWheel = !1;
}
},
_calculateMovePercentDelta: function(t) {
var e = t.anchor, i = t.applyToHorizontal, n = t.applyToVertical;
this._calculateBoundary();
e = e.clampf(cc.v2(0, 0), cc.v2(1, 1));
var r = this._view.getContentSize(), s = this.content.getContentSize(), o = this._getContentBottomBoundary() - this._bottomBoundary;
o = -o;
var a = this._getContentLeftBoundary() - this._leftBoundary;
a = -a;
var c = cc.v2(0, 0), l = 0;
if (i) {
l = s.width - r.width;
c.x = a - l * e.x;
}
if (n) {
l = s.height - r.height;
c.y = o - l * e.y;
}
return c;
},
_moveContentToTopLeft: function(t) {
var e = this.content.getContentSize(), i = this._getContentBottomBoundary() - this._bottomBoundary;
i = -i;
var n = cc.v2(0, 0), r = 0, s = this._getContentLeftBoundary() - this._leftBoundary;
s = -s;
if (e.height < t.height) {
r = e.height - t.height;
n.y = i - r;
}
if (e.width < t.width) {
r = e.width - t.width;
n.x = s;
}
this._updateScrollBarState();
this._moveContent(n);
this._adjustContentOutOfBoundary();
},
_calculateBoundary: function() {
if (this.content) {
var t = this.content.getComponent(cc.Layout);
t && t.enabledInHierarchy && t.updateLayout();
var e = this._view.getContentSize(), i = e.width * this._view.anchorX, n = e.height * this._view.anchorY;
this._leftBoundary = -i;
this._bottomBoundary = -n;
this._rightBoundary = this._leftBoundary + e.width;
this._topBoundary = this._bottomBoundary + e.height;
this._moveContentToTopLeft(e);
}
},
_hasNestedViewGroup: function(t, e) {
if (t.eventPhase === cc.Event.CAPTURING_PHASE) {
if (e) for (var i = 0; i < e.length; ++i) {
var n = e[i];
if (this.node === n) return !!t.target.getComponent(cc.ViewGroup);
if (n.getComponent(cc.ViewGroup)) return !0;
}
return !1;
}
},
_stopPropagationIfTargetIsMe: function(t) {
t.eventPhase === cc.Event.AT_TARGET && t.target === this.node && t.stopPropagation();
},
_onTouchBegan: function(t, e) {
if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
var i = t.touch;
this.content && this._handlePressLogic(i);
this._touchMoved = !1;
this._stopPropagationIfTargetIsMe(t);
}
},
_onTouchMoved: function(t, e) {
if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
var i = t.touch;
this.content && this._handleMoveLogic(i);
if (this.cancelInnerEvents) {
if (i.getLocation().sub(i.getStartLocation()).mag() > 7 && !this._touchMoved && t.target !== this.node) {
var n = new cc.Event.EventTouch(t.getTouches(), t.bubbles);
n.type = cc.Node.EventType.TOUCH_CANCEL;
n.touch = t.touch;
n.simulate = !0;
t.target.dispatchEvent(n);
this._touchMoved = !0;
}
this._stopPropagationIfTargetIsMe(t);
}
}
},
_onTouchEnded: function(t, e) {
if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
this._dispatchEvent("touch-up");
var i = t.touch;
this.content && this._handleReleaseLogic(i);
this._touchMoved ? t.stopPropagation() : this._stopPropagationIfTargetIsMe(t);
}
},
_onTouchCancelled: function(t, e) {
if (this.enabledInHierarchy && !this._hasNestedViewGroup(t, e)) {
if (!t.simulate) {
var i = t.touch;
this.content && this._handleReleaseLogic(i);
}
this._stopPropagationIfTargetIsMe(t);
}
},
_processDeltaMove: function(t) {
this._scrollChildren(t);
this._gatherTouchMove(t);
},
_handleMoveLogic: function(t) {
var e = t.getDelta();
this._processDeltaMove(e);
},
_scrollChildren: function(t) {
var e = t = this._clampDelta(t), i = void 0;
if (this.elastic) {
i = this._getHowMuchOutOfBoundary();
e.x *= 0 === i.x ? 1 : .5;
e.y *= 0 === i.y ? 1 : .5;
}
if (!this.elastic) {
i = this._getHowMuchOutOfBoundary(e);
e = e.add(i);
}
var n = -1;
if (e.y > 0) {
this.content.y - this.content.anchorY * this.content.height + e.y > this._bottomBoundary && (n = "scroll-to-bottom");
} else if (e.y < 0) {
this.content.y - this.content.anchorY * this.content.height + this.content.height + e.y <= this._topBoundary && (n = "scroll-to-top");
}
if (e.x < 0) {
this.content.x - this.content.anchorX * this.content.width + this.content.width + e.x <= this._rightBoundary && (n = "scroll-to-right");
} else if (e.x > 0) {
this.content.x - this.content.anchorX * this.content.width + e.x >= this._leftBoundary && (n = "scroll-to-left");
}
this._moveContent(e, !1);
if (0 !== e.x || 0 !== e.y) {
if (!this._scrolling) {
this._scrolling = !0;
this._dispatchEvent("scroll-began");
}
this._dispatchEvent("scrolling");
}
-1 !== n && this._dispatchEvent(n);
},
_handlePressLogic: function() {
this._autoScrolling && this._dispatchEvent("scroll-ended");
this._autoScrolling = !1;
this._isBouncing = !1;
this._touchMovePreviousTimestamp = s();
this._touchMoveDisplacements.length = 0;
this._touchMoveTimeDeltas.length = 0;
this._onScrollBarTouchBegan();
},
_clampDelta: function(t) {
var e = this.content.getContentSize(), i = this._view.getContentSize();
e.width < i.width && (t.x = 0);
e.height < i.height && (t.y = 0);
return t;
},
_gatherTouchMove: function(t) {
t = this._clampDelta(t);
for (;this._touchMoveDisplacements.length >= 5; ) {
this._touchMoveDisplacements.shift();
this._touchMoveTimeDeltas.shift();
}
this._touchMoveDisplacements.push(t);
var e = s();
this._touchMoveTimeDeltas.push((e - this._touchMovePreviousTimestamp) / 1e3);
this._touchMovePreviousTimestamp = e;
},
_startBounceBackIfNeeded: function() {
if (!this.elastic) return !1;
var t = this._getHowMuchOutOfBoundary();
if ((t = this._clampDelta(t)).fuzzyEquals(cc.v2(0, 0), 1e-4)) return !1;
var e = Math.max(this.bounceDuration, 0);
this._startAutoScroll(t, e, !0);
if (!this._isBouncing) {
t.y > 0 && this._dispatchEvent("bounce-top");
t.y < 0 && this._dispatchEvent("bounce-bottom");
t.x > 0 && this._dispatchEvent("bounce-right");
t.x < 0 && this._dispatchEvent("bounce-left");
this._isBouncing = !0;
}
return !0;
},
_processInertiaScroll: function() {
if (!this._startBounceBackIfNeeded() && this.inertia) {
var t = this._calculateTouchMoveVelocity();
!t.fuzzyEquals(cc.v2(0, 0), 1e-4) && this.brake < 1 && this._startInertiaScroll(t);
}
this._onScrollBarTouchEnded();
},
_handleReleaseLogic: function(t) {
var e = t.getDelta();
this._gatherTouchMove(e);
this._processInertiaScroll();
if (this._scrolling) {
this._scrolling = !1;
this._autoScrolling || this._dispatchEvent("scroll-ended");
}
},
_isOutOfBoundary: function() {
return !this._getHowMuchOutOfBoundary().fuzzyEquals(cc.v2(0, 0), 1e-4);
},
_isNecessaryAutoScrollBrake: function() {
if (this._autoScrollBraking) return !0;
if (this._isOutOfBoundary()) {
if (!this._autoScrollCurrentlyOutOfBoundary) {
this._autoScrollCurrentlyOutOfBoundary = !0;
this._autoScrollBraking = !0;
this._autoScrollBrakingStartPosition = this.getContentPosition();
return !0;
}
} else this._autoScrollCurrentlyOutOfBoundary = !1;
return !1;
},
getScrollEndedEventTiming: function() {
return 1e-4;
},
_processAutoScrolling: function(t) {
var e = this._isNecessaryAutoScrollBrake(), i = e ? .05 : 1;
this._autoScrollAccumulatedTime += t * (1 / i);
var n = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
this._autoScrollAttenuate && (n = r(n));
var s = this._autoScrollStartPosition.add(this._autoScrollTargetDelta.mul(n)), o = Math.abs(n - 1) <= 1e-4;
if (Math.abs(n - 1) <= this.getScrollEndedEventTiming() && !this._isScrollEndedWithThresholdEventFired) {
this._dispatchEvent("scroll-ended-with-threshold");
this._isScrollEndedWithThresholdEventFired = !0;
}
if (this.elastic) {
var a = s.sub(this._autoScrollBrakingStartPosition);
e && (a = a.mul(i));
s = this._autoScrollBrakingStartPosition.add(a);
} else {
var c = s.sub(this.getContentPosition()), l = this._getHowMuchOutOfBoundary(c);
if (!l.fuzzyEquals(cc.v2(0, 0), 1e-4)) {
s = s.add(l);
o = !0;
}
}
o && (this._autoScrolling = !1);
var u = s.sub(this.getContentPosition());
this._moveContent(this._clampDelta(u), o);
this._dispatchEvent("scrolling");
if (!this._autoScrolling) {
this._isBouncing = !1;
this._scrolling = !1;
this._dispatchEvent("scroll-ended");
}
},
_startInertiaScroll: function(t) {
var e = t.mul(.7);
this._startAttenuatingAutoScroll(e, t);
},
_calculateAttenuatedFactor: function(t) {
return this.brake <= 0 ? 1 - this.brake : (1 - this.brake) * (1 / (1 + 14e-6 * t + t * t * 8e-9));
},
_startAttenuatingAutoScroll: function(t, e) {
var i = this._calculateAutoScrollTimeByInitalSpeed(e.mag()), n = t.normalize(), r = this.content.getContentSize(), s = this._view.getContentSize(), o = r.width - s.width, a = r.height - s.height, c = this._calculateAttenuatedFactor(o), l = this._calculateAttenuatedFactor(a);
n = cc.v2(n.x * o * (1 - this.brake) * c, n.y * a * l * (1 - this.brake));
var u = t.mag(), h = n.mag() / u;
n = n.add(t);
if (this.brake > 0 && h > 7) {
h = Math.sqrt(h);
n = t.mul(h).add(t);
}
this.brake > 0 && h > 3 && (i *= h = 3);
0 === this.brake && h > 1 && (i *= h);
this._startAutoScroll(n, i, !0);
},
_calculateAutoScrollTimeByInitalSpeed: function(t) {
return Math.sqrt(Math.sqrt(t / 5));
},
_startAutoScroll: function(t, e, i) {
var n = this._flattenVectorByDirection(t);
this._autoScrolling = !0;
this._autoScrollTargetDelta = n;
this._autoScrollAttenuate = i;
this._autoScrollStartPosition = this.getContentPosition();
this._autoScrollTotalTime = e;
this._autoScrollAccumulatedTime = 0;
this._autoScrollBraking = !1;
this._isScrollEndedWithThresholdEventFired = !1;
this._autoScrollBrakingStartPosition = cc.v2(0, 0);
this._getHowMuchOutOfBoundary().fuzzyEquals(cc.v2(0, 0), 1e-4) || (this._autoScrollCurrentlyOutOfBoundary = !0);
},
_calculateTouchMoveVelocity: function() {
var t = 0;
if ((t = this._touchMoveTimeDeltas.reduce((function(t, e) {
return t + e;
}), t)) <= 0 || t >= .5) return cc.v2(0, 0);
var e = cc.v2(0, 0);
e = this._touchMoveDisplacements.reduce((function(t, e) {
return t.add(e);
}), e);
return cc.v2(e.x * (1 - this.brake) / t, e.y * (1 - this.brake) / t);
},
_flattenVectorByDirection: function(t) {
var e = t;
e.x = this.horizontal ? e.x : 0;
e.y = this.vertical ? e.y : 0;
return e;
},
_moveContent: function(t, e) {
var i = this._flattenVectorByDirection(t), n = this.getContentPosition().add(i);
this.setContentPosition(n);
var r = this._getHowMuchOutOfBoundary();
this._updateScrollBar(r);
this.elastic && e && this._startBounceBackIfNeeded();
},
_getContentLeftBoundary: function() {
return this.getContentPosition().x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
},
_getContentRightBoundary: function() {
var t = this.content.getContentSize();
return this._getContentLeftBoundary() + t.width;
},
_getContentTopBoundary: function() {
var t = this.content.getContentSize();
return this._getContentBottomBoundary() + t.height;
},
_getContentBottomBoundary: function() {
return this.getContentPosition().y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
},
_getHowMuchOutOfBoundary: function(t) {
if ((t = t || cc.v2(0, 0)).fuzzyEquals(cc.v2(0, 0), 1e-4) && !this._outOfBoundaryAmountDirty) return this._outOfBoundaryAmount;
var e = cc.v2(0, 0);
this._getContentLeftBoundary() + t.x > this._leftBoundary ? e.x = this._leftBoundary - (this._getContentLeftBoundary() + t.x) : this._getContentRightBoundary() + t.x < this._rightBoundary && (e.x = this._rightBoundary - (this._getContentRightBoundary() + t.x));
this._getContentTopBoundary() + t.y < this._topBoundary ? e.y = this._topBoundary - (this._getContentTopBoundary() + t.y) : this._getContentBottomBoundary() + t.y > this._bottomBoundary && (e.y = this._bottomBoundary - (this._getContentBottomBoundary() + t.y));
if (t.fuzzyEquals(cc.v2(0, 0), 1e-4)) {
this._outOfBoundaryAmount = e;
this._outOfBoundaryAmountDirty = !1;
}
return e = this._clampDelta(e);
},
_updateScrollBarState: function() {
if (this.content) {
var t = this.content.getContentSize(), e = this._view.getContentSize();
this.verticalScrollBar && (t.height < e.height ? this.verticalScrollBar.hide() : this.verticalScrollBar.show());
this.horizontalScrollBar && (t.width < e.width ? this.horizontalScrollBar.hide() : this.horizontalScrollBar.show());
}
},
_updateScrollBar: function(t) {
this.horizontalScrollBar && this.horizontalScrollBar._onScroll(t);
this.verticalScrollBar && this.verticalScrollBar._onScroll(t);
},
_onScrollBarTouchBegan: function() {
this.horizontalScrollBar && this.horizontalScrollBar._onTouchBegan();
this.verticalScrollBar && this.verticalScrollBar._onTouchBegan();
},
_onScrollBarTouchEnded: function() {
this.horizontalScrollBar && this.horizontalScrollBar._onTouchEnded();
this.verticalScrollBar && this.verticalScrollBar._onTouchEnded();
},
_dispatchEvent: function(t) {
if ("scroll-ended" === t) this._scrollEventEmitMask = 0; else if ("scroll-to-top" === t || "scroll-to-bottom" === t || "scroll-to-left" === t || "scroll-to-right" === t) {
var e = 1 << a[t];
if (this._scrollEventEmitMask & e) return;
this._scrollEventEmitMask |= e;
}
cc.Component.EventHandler.emitEvents(this.scrollEvents, this, a[t]);
this.node.emit(t, this);
},
_adjustContentOutOfBoundary: function() {
this._outOfBoundaryAmountDirty = !0;
if (this._isOutOfBoundary()) {
var t = this._getHowMuchOutOfBoundary(cc.v2(0, 0)), e = this.getContentPosition().add(t);
if (this.content) {
this.content.setPosition(e);
this._updateScrollBar(0);
}
}
},
start: function() {
this._calculateBoundary();
this.content && cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
},
_hideScrollbar: function() {
this.horizontalScrollBar && this.horizontalScrollBar.hide();
this.verticalScrollBar && this.verticalScrollBar.hide();
},
onDisable: function() {
this._unregisterEvent();
if (this.content) {
this.content.off(n.SIZE_CHANGED, this._calculateBoundary, this);
this.content.off(n.SCALE_CHANGED, this._calculateBoundary, this);
if (this._view) {
this._view.off(n.POSITION_CHANGED, this._calculateBoundary, this);
this._view.off(n.SCALE_CHANGED, this._calculateBoundary, this);
this._view.off(n.SIZE_CHANGED, this._calculateBoundary, this);
}
}
this._hideScrollbar();
this.stopAutoScroll();
},
onEnable: function() {
this._registerEvent();
if (this.content) {
this.content.on(n.SIZE_CHANGED, this._calculateBoundary, this);
this.content.on(n.SCALE_CHANGED, this._calculateBoundary, this);
if (this._view) {
this._view.on(n.POSITION_CHANGED, this._calculateBoundary, this);
this._view.on(n.SCALE_CHANGED, this._calculateBoundary, this);
this._view.on(n.SIZE_CHANGED, this._calculateBoundary, this);
}
}
this._updateScrollBarState();
},
update: function(t) {
this._autoScrolling && this._processAutoScrolling(t);
}
});
cc.ScrollView = e.exports = c;
}), {
"../CCNode": 7,
"./CCViewGroup": 62
} ],
57: [ (function(t, e, i) {
"use strict";
var n = t("../utils/misc"), r = (t("../CCNode").EventType, t("./CCRenderComponent")), s = t("../utils/blend-func"), o = (t("../renderer/render-flow"), 
t("../assets/material/CCMaterial")), a = cc.Enum({
SIMPLE: 0,
SLICED: 1,
TILED: 2,
FILLED: 3,
MESH: 4
}), c = cc.Enum({
HORIZONTAL: 0,
VERTICAL: 1,
RADIAL: 2
}), l = cc.Enum({
CUSTOM: 0,
TRIMMED: 1,
RAW: 2
}), u = cc.Enum({
NORMAL: 0,
GRAY: 1
}), h = cc.Class({
name: "cc.Sprite",
extends: r,
mixins: [ s ],
editor: !1,
ctor: function() {
cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? this._activateMaterial = this._activateMaterialCanvas : this._activateMaterial = this._activateMaterialWebgl;
},
properties: {
_spriteFrame: {
default: null,
type: cc.SpriteFrame
},
_type: a.SIMPLE,
_sizeMode: l.TRIMMED,
_fillType: 0,
_fillCenter: cc.v2(0, 0),
_fillStart: 0,
_fillRange: 0,
_isTrimmedMode: !0,
_atlas: {
default: null,
type: cc.SpriteAtlas,
tooltip: !1,
editorOnly: !0,
visible: !0,
animatable: !1
},
spriteFrame: {
get: function() {
return this._spriteFrame;
},
set: function(t, e) {
var i = this._spriteFrame;
if (i !== t) {
this._spriteFrame = t;
this.markForUpdateRenderData(!1);
this._applySpriteFrame(i);
0;
}
},
type: cc.SpriteFrame
},
type: {
get: function() {
return this._type;
},
set: function(t) {
if (this._type !== t) {
this._type = t;
this._resetAssembler();
}
},
type: a,
animatable: !1,
tooltip: !1
},
fillType: {
get: function() {
return this._fillType;
},
set: function(t) {
if (t !== this._fillType) {
this._fillType = t;
this._resetAssembler();
}
},
type: c,
tooltip: !1
},
fillCenter: {
get: function() {
return this._fillCenter;
},
set: function(t) {
this._fillCenter.x = t.x;
this._fillCenter.y = t.y;
this._type === a.FILLED && this.setVertsDirty();
},
tooltip: !1
},
fillStart: {
get: function() {
return this._fillStart;
},
set: function(t) {
this._fillStart = n.clampf(t, -1, 1);
this._type === a.FILLED && this.setVertsDirty();
},
tooltip: !1
},
fillRange: {
get: function() {
return this._fillRange;
},
set: function(t) {
this._fillRange = n.clampf(t, -1, 1);
this._type === a.FILLED && this.setVertsDirty();
},
tooltip: !1
},
trim: {
get: function() {
return this._isTrimmedMode;
},
set: function(t) {
if (this._isTrimmedMode !== t) {
this._isTrimmedMode = t;
this._type !== a.SIMPLE && this._type !== a.MESH || this.setVertsDirty();
}
},
animatable: !1,
tooltip: !1
},
sizeMode: {
get: function() {
return this._sizeMode;
},
set: function(t) {
this._sizeMode = t;
t !== l.CUSTOM && this._applySpriteSize();
},
animatable: !1,
type: l,
tooltip: !1
}
},
statics: {
FillType: c,
Type: a,
SizeMode: l,
State: u
},
setVisible: function(t) {
this.enabled = t;
},
setState: function() {},
getState: function() {},
onEnable: function() {
this._super();
if (this._spriteFrame && this._spriteFrame.textureLoaded()) this._activateMaterial(); else {
this.disableRender();
if (this._spriteFrame) {
this._spriteFrame.once("load", this._onTextureLoaded, this);
this._spriteFrame.ensureLoadTexture();
}
}
},
_on3DNodeChanged: function() {
this._resetAssembler();
},
_activateMaterialCanvas: function() {
this.setVertsDirty();
this.markForUpdateRenderData(!0);
this.markForRender(!0);
},
_activateMaterialWebgl: function() {
var t = this._spriteFrame;
if (t && t.textureLoaded()) {
var e = this.sharedMaterials[0];
(e = e ? o.getInstantiatedMaterial(e, this) : o.getInstantiatedBuiltinMaterial("2d-sprite", this)).setProperty("texture", t.getTexture());
this.setVertsDirty();
this.setMaterial(0, e);
this.markForRender(!0);
} else this.disableRender();
},
_applyAtlas: !1,
_canRender: function() {
if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
if (!this._enabled) return !1;
} else if (!this._enabled || !this.sharedMaterials[0] || !this.node._activeInHierarchy) return !1;
var t = this._spriteFrame;
return !(!t || !t.textureLoaded());
},
_applySpriteSize: function() {
if (this._spriteFrame) {
if (l.RAW === this._sizeMode) {
var t = this._spriteFrame._originalSize;
this.node.setContentSize(t);
} else if (l.TRIMMED === this._sizeMode) {
var e = this._spriteFrame._rect;
this.node.setContentSize(e.width, e.height);
}
this.setVertsDirty();
this._activateMaterial();
}
},
_onTextureLoaded: function() {
this.isValid && this._applySpriteSize();
},
_applySpriteFrame: function(t) {
t && !t.textureLoaded() && t.off("load", this._onTextureLoaded, this);
var e = this._spriteFrame;
if (e) if (e.textureLoaded()) this._applySpriteSize(); else {
this.markForRender(!1);
e.once("load", this._onTextureLoaded, this);
e.ensureLoadTexture();
} else this.markForRender(!1);
0;
},
_resized: !1
});
0;
cc.Sprite = e.exports = h;
}), {
"../CCNode": 7,
"../assets/material/CCMaterial": 30,
"../renderer/render-flow": 156,
"../utils/blend-func": 182,
"../utils/misc": 187,
"./CCRenderComponent": 54
} ],
58: [ (function(t, e, i) {
"use strict";
var n = cc.Enum({
NONE: 0,
CHECKBOX: 1,
TEXT_ATLAS: 2,
SLIDER_BAR: 3,
LIST_VIEW: 4,
PAGE_VIEW: 5
}), r = cc.Enum({
VERTICAL: 0,
HORIZONTAL: 1
}), s = cc.Enum({
TOP: 0,
CENTER: 1,
BOTTOM: 2
}), o = cc.Enum({
LEFT: 0,
CENTER: 1,
RIGHT: 2
}), a = cc.Class({
name: "cc.StudioComponent",
extends: cc.Component,
editor: !1,
properties: !1,
statics: {
ComponentType: n,
ListDirection: r,
VerticalAlign: s,
HorizontalAlign: o
}
}), c = t("../utils/prefab-helper");
a.PlaceHolder = cc.Class({
name: "cc.StudioComponent.PlaceHolder",
extends: cc.Component,
properties: {
_baseUrl: "",
nestedPrefab: cc.Prefab
},
onLoad: function() {
this.nestedPrefab && this._replaceWithNestedPrefab();
},
_replaceWithNestedPrefab: function() {
var t = this.node, e = t._prefab;
e.root = t;
e.asset = this.nestedPrefab;
c.syncWithPrefab(t);
}
});
cc.StudioComponent = e.exports = a;
var l = cc.Class({
name: "cc.StudioWidget",
extends: cc.Widget,
editor: !1,
_validateTargetInDEV: function() {}
});
cc.StudioWidget = e.exports = l;
}), {
"../utils/prefab-helper": 190
} ],
59: [ (function(t, e, i) {
"use strict";
var n = t("../utils/gray-sprite-state"), r = cc.Class({
name: "cc.Toggle",
extends: t("./CCButton"),
mixins: [ n ],
editor: !1,
properties: {
_N$isChecked: !0,
isChecked: {
get: function() {
return this._N$isChecked;
},
set: function(t) {
if (t !== this._N$isChecked) {
var e = this.toggleGroup || this._toggleContainer;
if (!(e && e.enabled && this._N$isChecked) || e.allowSwitchOff) {
this._N$isChecked = t;
this._updateCheckMark();
e && e.enabled && e.updateToggles(this);
this._emitToggleEvents();
}
}
},
tooltip: !1
},
toggleGroup: {
default: null,
tooltip: !1,
type: t("./CCToggleGroup")
},
checkMark: {
default: null,
type: cc.Sprite,
tooltip: !1
},
checkEvents: {
default: [],
type: cc.Component.EventHandler
},
_resizeToTarget: {
animatable: !1,
set: function(t) {
t && this._resizeNodeToTargetNode();
}
}
},
onEnable: function() {
this._super();
this._registerToggleEvent();
this.toggleGroup && this.toggleGroup.enabledInHierarchy && this.toggleGroup.addToggle(this);
},
onDisable: function() {
this._super();
this._unregisterToggleEvent();
this.toggleGroup && this.toggleGroup.enabledInHierarchy && this.toggleGroup.removeToggle(this);
},
_hideCheckMark: function() {
this._N$isChecked = !1;
this._updateCheckMark();
},
toggle: function(t) {
this.isChecked = !this.isChecked;
},
check: function() {
this.isChecked = !0;
},
uncheck: function() {
this.isChecked = !1;
},
_updateCheckMark: function() {
this.checkMark && (this.checkMark.node.active = !!this.isChecked);
},
_updateDisabledState: function() {
this._super();
if (this.enableAutoGrayEffect && this.checkMark) {
var t = !this.interactable;
this._switchGrayMaterial(t, this.checkMark);
}
},
_registerToggleEvent: function() {
this.node.on("click", this.toggle, this);
},
_unregisterToggleEvent: function() {
this.node.off("click", this.toggle, this);
},
_emitToggleEvents: function() {
this.node.emit("toggle", this);
this.checkEvents && cc.Component.EventHandler.emitEvents(this.checkEvents, this);
}
});
cc.Toggle = e.exports = r;
t("../platform/js").get(r.prototype, "_toggleContainer", (function() {
var t = this.node.parent;
return cc.Node.isNode(t) ? t.getComponent(cc.ToggleContainer) : null;
}));
}), {
"../platform/js": 130,
"../utils/gray-sprite-state": 185,
"./CCButton": 45,
"./CCToggleGroup": 61
} ],
60: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.ToggleContainer",
extends: cc.Component,
editor: !1,
properties: {
allowSwitchOff: {
tooltip: !1,
default: !1
},
checkEvents: {
default: [],
type: cc.Component.EventHandler
}
},
updateToggles: function(t) {
if (this.enabledInHierarchy && t.isChecked) {
this.toggleItems.forEach((function(e) {
e !== t && e.isChecked && e.enabled && e._hideCheckMark();
}));
this.checkEvents && cc.Component.EventHandler.emitEvents(this.checkEvents, t);
}
},
_allowOnlyOneToggleChecked: function() {
var t = !1;
this.toggleItems.forEach((function(e) {
t ? e._hideCheckMark() : e.isChecked && (t = !0);
}));
return t;
},
_makeAtLeastOneToggleChecked: function() {
if (!this._allowOnlyOneToggleChecked() && !this.allowSwitchOff) {
var t = this.toggleItems;
t.length > 0 && t[0].check();
}
},
onEnable: function() {
this.node.on("child-added", this._allowOnlyOneToggleChecked, this);
this.node.on("child-removed", this._makeAtLeastOneToggleChecked, this);
},
onDisable: function() {
this.node.off("child-added", this._allowOnlyOneToggleChecked, this);
this.node.off("child-removed", this._makeAtLeastOneToggleChecked, this);
},
start: function() {
this._makeAtLeastOneToggleChecked();
}
});
t("../platform/js").get(n.prototype, "toggleItems", (function() {
return this.node.getComponentsInChildren(cc.Toggle);
}));
cc.ToggleContainer = e.exports = n;
}), {
"../platform/js": 130
} ],
61: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.ToggleGroup",
extends: cc.Component,
ctor: function() {
this._toggleItems = [];
},
editor: !1,
properties: {
allowSwitchOff: {
tooltip: !1,
default: !1
},
toggleItems: {
get: function() {
return this._toggleItems;
}
}
},
updateToggles: function(t) {
this.enabledInHierarchy && this._toggleItems.forEach((function(e) {
t.isChecked && e !== t && e.isChecked && e.enabled && e._hideCheckMark();
}));
},
addToggle: function(t) {
-1 === this._toggleItems.indexOf(t) && this._toggleItems.push(t);
this._allowOnlyOneToggleChecked();
},
removeToggle: function(t) {
var e = this._toggleItems.indexOf(t);
e > -1 && this._toggleItems.splice(e, 1);
this._makeAtLeastOneToggleChecked();
},
_allowOnlyOneToggleChecked: function() {
var t = !1;
this._toggleItems.forEach((function(e) {
t && e.enabled && e._hideCheckMark();
e.isChecked && e.enabled && (t = !0);
}));
return t;
},
_makeAtLeastOneToggleChecked: function() {
this._allowOnlyOneToggleChecked() || this.allowSwitchOff || this._toggleItems.length > 0 && (this._toggleItems[0].isChecked = !0);
},
start: function() {
this._makeAtLeastOneToggleChecked();
}
}), r = !1;
t("../platform/js").get(cc, "ToggleGroup", (function() {
if (!r) {
cc.logID(1405, "cc.ToggleGroup", "cc.ToggleContainer");
r = !0;
}
return n;
}));
e.exports = n;
}), {
"../platform/js": 130
} ],
62: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.ViewGroup",
extends: t("./CCComponent")
});
cc.ViewGroup = e.exports = n;
}), {
"./CCComponent": 47
} ],
63: [ (function(t, e, i) {
"use strict";
var n = t("../base-ui/CCWidgetManager"), r = n.AlignMode, s = n._AlignFlags, o = s.TOP, a = s.MID, c = s.BOT, l = s.LEFT, u = s.CENTER, h = s.RIGHT, f = o | c, d = l | h, _ = cc.Class({
name: "cc.Widget",
extends: t("./CCComponent"),
editor: !1,
properties: {
target: {
get: function() {
return this._target;
},
set: function(t) {
this._target = t;
0;
},
type: cc.Node,
tooltip: !1
},
isAlignTop: {
get: function() {
return (this._alignFlags & o) > 0;
},
set: function(t) {
this._setAlign(o, t);
},
animatable: !1,
tooltip: !1
},
isAlignVerticalCenter: {
get: function() {
return (this._alignFlags & a) > 0;
},
set: function(t) {
if (t) {
this.isAlignTop = !1;
this.isAlignBottom = !1;
this._alignFlags |= a;
} else this._alignFlags &= ~a;
},
animatable: !1,
tooltip: !1
},
isAlignBottom: {
get: function() {
return (this._alignFlags & c) > 0;
},
set: function(t) {
this._setAlign(c, t);
},
animatable: !1,
tooltip: !1
},
isAlignLeft: {
get: function() {
return (this._alignFlags & l) > 0;
},
set: function(t) {
this._setAlign(l, t);
},
animatable: !1,
tooltip: !1
},
isAlignHorizontalCenter: {
get: function() {
return (this._alignFlags & u) > 0;
},
set: function(t) {
if (t) {
this.isAlignLeft = !1;
this.isAlignRight = !1;
this._alignFlags |= u;
} else this._alignFlags &= ~u;
},
animatable: !1,
tooltip: !1
},
isAlignRight: {
get: function() {
return (this._alignFlags & h) > 0;
},
set: function(t) {
this._setAlign(h, t);
},
animatable: !1,
tooltip: !1
},
isStretchWidth: {
get: function() {
return (this._alignFlags & d) === d;
},
visible: !1
},
isStretchHeight: {
get: function() {
return (this._alignFlags & f) === f;
},
visible: !1
},
top: {
get: function() {
return this._top;
},
set: function(t) {
this._top = t;
},
tooltip: !1
},
bottom: {
get: function() {
return this._bottom;
},
set: function(t) {
this._bottom = t;
},
tooltip: !1
},
left: {
get: function() {
return this._left;
},
set: function(t) {
this._left = t;
},
tooltip: !1
},
right: {
get: function() {
return this._right;
},
set: function(t) {
this._right = t;
},
tooltip: !1
},
horizontalCenter: {
get: function() {
return this._horizontalCenter;
},
set: function(t) {
this._horizontalCenter = t;
},
tooltip: !1
},
verticalCenter: {
get: function() {
return this._verticalCenter;
},
set: function(t) {
this._verticalCenter = t;
},
tooltip: !1
},
isAbsoluteHorizontalCenter: {
get: function() {
return this._isAbsHorizontalCenter;
},
set: function(t) {
this._isAbsHorizontalCenter = t;
},
animatable: !1
},
isAbsoluteVerticalCenter: {
get: function() {
return this._isAbsVerticalCenter;
},
set: function(t) {
this._isAbsVerticalCenter = t;
},
animatable: !1
},
isAbsoluteTop: {
get: function() {
return this._isAbsTop;
},
set: function(t) {
this._isAbsTop = t;
},
animatable: !1
},
isAbsoluteBottom: {
get: function() {
return this._isAbsBottom;
},
set: function(t) {
this._isAbsBottom = t;
},
animatable: !1
},
isAbsoluteLeft: {
get: function() {
return this._isAbsLeft;
},
set: function(t) {
this._isAbsLeft = t;
},
animatable: !1
},
isAbsoluteRight: {
get: function() {
return this._isAbsRight;
},
set: function(t) {
this._isAbsRight = t;
},
animatable: !1
},
alignMode: {
default: r.ON_WINDOW_RESIZE,
type: r,
tooltip: !1
},
_wasAlignOnce: {
default: void 0,
formerlySerializedAs: "isAlignOnce"
},
_target: null,
_alignFlags: 0,
_left: 0,
_right: 0,
_top: 0,
_bottom: 0,
_verticalCenter: 0,
_horizontalCenter: 0,
_isAbsLeft: !0,
_isAbsRight: !0,
_isAbsTop: !0,
_isAbsBottom: !0,
_isAbsHorizontalCenter: !0,
_isAbsVerticalCenter: !0,
_originalWidth: 0,
_originalHeight: 0
},
statics: {
AlignMode: r
},
onLoad: function() {
if (void 0 !== this._wasAlignOnce) {
this.alignMode = this._wasAlignOnce ? r.ONCE : r.ALWAYS;
this._wasAlignOnce = void 0;
}
},
onEnable: function() {
n.add(this);
},
onDisable: function() {
n.remove(this);
},
_validateTargetInDEV: !1,
_setAlign: function(t, e) {
if (e !== (this._alignFlags & t) > 0) {
var i = (t & d) > 0;
if (e) {
this._alignFlags |= t;
if (i) {
this.isAlignHorizontalCenter = !1;
if (this.isStretchWidth) {
this._originalWidth = this.node.width;
0;
}
} else {
this.isAlignVerticalCenter = !1;
if (this.isStretchHeight) {
this._originalHeight = this.node.height;
0;
}
}
0;
} else {
i ? this.isStretchWidth && (this.node.width = this._originalWidth) : this.isStretchHeight && (this.node.height = this._originalHeight);
this._alignFlags &= ~t;
}
}
},
updateAlignment: function() {
n.updateAlignment(this.node);
}
});
Object.defineProperty(_.prototype, "isAlignOnce", {
get: function() {
0;
return this.alignMode === r.ONCE;
},
set: function(t) {
0;
this.alignMode = t ? r.ONCE : r.ALWAYS;
}
});
cc.Widget = e.exports = _;
}), {
"../base-ui/CCWidgetManager": 33,
"./CCComponent": 47
} ],
64: [ (function(t, e, i) {
"use strict";
var n = t("../../platform/CCMacro"), r = t("../editbox/EditBoxImplBase"), s = t("../CCLabel"), o = t("./types"), a = o.InputMode, c = o.InputFlag, l = o.KeyboardReturnType;
function u(t) {
return t.replace(/(?:^|\s)\S/g, (function(t) {
return t.toUpperCase();
}));
}
function h(t) {
return t.charAt(0).toUpperCase() + t.slice(1);
}
var f = cc.Class({
name: "cc.EditBox",
extends: cc.Component,
editor: !1,
properties: {
_useOriginalSize: !0,
_string: "",
string: {
tooltip: !1,
get: function() {
return this._string;
},
set: function(t) {
t = "" + t;
this.maxLength >= 0 && t.length >= this.maxLength && (t = t.slice(0, this.maxLength));
this._string = t;
this._updateString(t);
}
},
textLabel: {
tooltip: !1,
default: null,
type: s,
notify: function(t) {
if (this.textLabel && this.textLabel !== t) {
this._updateTextLabel();
this._updateLabels();
}
}
},
placeholderLabel: {
tooltip: !1,
default: null,
type: s,
notify: function(t) {
if (this.placeholderLabel && this.placeholderLabel !== t) {
this._updatePlaceholderLabel();
this._updateLabels();
}
}
},
background: {
tooltip: !1,
default: null,
type: cc.Sprite,
notify: function(t) {
this.background && this.background !== t && this._updateBackgroundSprite();
}
},
_N$backgroundImage: {
default: void 0,
type: cc.SpriteFrame
},
backgroundImage: {
get: function() {
return this.background ? this.background.spriteFrame : null;
},
set: function(t) {
this.background && (this.background.spriteFrame = t);
}
},
returnType: {
default: l.DEFAULT,
tooltip: !1,
displayName: "KeyboardReturnType",
type: l
},
_N$returnType: {
default: void 0,
type: cc.Float
},
inputFlag: {
tooltip: !1,
default: c.DEFAULT,
type: c,
notify: function() {
this._updateString(this._string);
}
},
inputMode: {
tooltip: !1,
default: a.ANY,
type: a,
notify: function(t) {
if (this.inputMode !== t) {
this._updateTextLabel();
this._updatePlaceholderLabel();
}
}
},
fontSize: {
get: function() {
return this.textLabel ? this.textLabel.fontSize : null;
},
set: function(t) {
this.textLabel && (this.textLabel.fontSize = t);
}
},
_N$fontSize: {
default: void 0,
type: cc.Float
},
lineHeight: {
get: function() {
return this.textLabel ? this.textLabel.lineHeight : null;
},
set: function(t) {
this.textLabel && (this.textLabel.lineHeight = t);
}
},
_N$lineHeight: {
default: void 0,
type: cc.Float
},
fontColor: {
get: function() {
return this.textLabel ? this.textLabel.node.color : null;
},
set: function(t) {
if (this.textLabel) {
this.textLabel.node.color = t;
this.textLabel.node.opacity = t.a;
}
}
},
_N$fontColor: void 0,
placeholder: {
tooltip: !1,
get: function() {
return this.placeholderLabel ? this.placeholderLabel.string : "";
},
set: function(t) {
this.placeholderLabel && (this.placeholderLabel.string = t);
}
},
_N$placeholder: {
default: void 0,
type: cc.String
},
placeholderFontSize: {
get: function() {
return this.placeholderLabel ? this.placeholderLabel.fontSize : null;
},
set: function(t) {
this.placeholderLabel && (this.placeholderLabel.fontSize = t);
}
},
_N$placeholderFontSize: {
default: void 0,
type: cc.Float
},
placeholderFontColor: {
get: function() {
return this.placeholderLabel ? this.placeholderLabel.node.color : null;
},
set: function(t) {
if (this.placeholderLabel) {
this.placeholderLabel.node.color = t;
this.placeholderLabel.node.opacity = t.a;
}
}
},
_N$placeholderFontColor: void 0,
maxLength: {
tooltip: !1,
default: 20
},
_N$maxLength: {
default: void 0,
type: cc.Float
},
stayOnTop: {
default: !1,
notify: function() {
cc.warn("editBox.stayOnTop is removed since v2.1.");
}
},
_tabIndex: 0,
tabIndex: {
tooltip: !1,
get: function() {
return this._tabIndex;
},
set: function(t) {
if (this._tabIndex !== t) {
this._tabIndex = t;
this._impl && this._impl.setTabIndex(t);
}
}
},
editingDidBegan: {
default: [],
type: cc.Component.EventHandler
},
textChanged: {
default: [],
type: cc.Component.EventHandler
},
editingDidEnded: {
default: [],
type: cc.Component.EventHandler
},
editingReturn: {
default: [],
type: cc.Component.EventHandler
}
},
statics: {
_ImplClass: r,
KeyboardReturnType: l,
InputFlag: c,
InputMode: a
},
_init: function() {
this._upgradeComp();
this._isLabelVisible = !0;
this.node.on(cc.Node.EventType.SIZE_CHANGED, this._syncSize, this);
(this._impl = new f._ImplClass()).init(this);
this._updateString(this._string);
this._syncSize();
},
_updateBackgroundSprite: function() {
var t = this.background;
if (!t) {
var e = this.node.getChildByName("BACKGROUND_SPRITE");
e || (e = new cc.Node("BACKGROUND_SPRITE"));
(t = e.getComponent(cc.Sprite)) || (t = e.addComponent(cc.Sprite));
e.parent = this.node;
this.background = t;
}
t.type = cc.Sprite.Type.SLICED;
if (void 0 !== this._N$backgroundImage) {
t.spriteFrame = this._N$backgroundImage;
this._N$backgroundImage = void 0;
}
},
_updateTextLabel: function() {
var t = this.textLabel;
if (!t) {
var e = this.node.getChildByName("TEXT_LABEL");
e || (e = new cc.Node("TEXT_LABEL"));
(t = e.getComponent(s)) || (t = e.addComponent(s));
e.parent = this.node;
this.textLabel = t;
}
t.node.setAnchorPoint(0, 1);
t.overflow = s.Overflow.CLAMP;
if (this.inputMode === a.ANY) {
t.verticalAlign = n.VerticalTextAlignment.TOP;
t.enableWrapText = !0;
} else {
t.verticalAlign = n.VerticalTextAlignment.CENTER;
t.enableWrapText = !1;
}
t.string = this._updateLabelStringStyle(this._string);
if (void 0 !== this._N$fontColor) {
t.node.color = this._N$fontColor;
t.node.opacity = this._N$fontColor.a;
this._N$fontColor = void 0;
}
if (void 0 !== this._N$fontSize) {
t.fontSize = this._N$fontSize;
this._N$fontSize = void 0;
}
if (void 0 !== this._N$lineHeight) {
t.lineHeight = this._N$lineHeight;
this._N$lineHeight = void 0;
}
},
_updatePlaceholderLabel: function() {
var t = this.placeholderLabel;
if (!t) {
var e = this.node.getChildByName("PLACEHOLDER_LABEL");
e || (e = new cc.Node("PLACEHOLDER_LABEL"));
(t = e.getComponent(s)) || (t = e.addComponent(s));
e.parent = this.node;
this.placeholderLabel = t;
}
t.node.setAnchorPoint(0, 1);
t.overflow = s.Overflow.CLAMP;
if (this.inputMode === a.ANY) {
t.verticalAlign = n.VerticalTextAlignment.TOP;
t.enableWrapText = !0;
} else {
t.verticalAlign = n.VerticalTextAlignment.CENTER;
t.enableWrapText = !1;
}
t.string = this.placeholder;
if (void 0 !== this._N$placeholderFontColor) {
t.node.color = this._N$placeholderFontColor;
t.node.opacity = this._N$placeholderFontColor.a;
this._N$placeholderFontColor = void 0;
}
if (void 0 !== this._N$placeholderFontSize) {
t.fontSize = this._N$placeholderFontSize;
this._N$placeholderFontSize = void 0;
}
},
_upgradeComp: function() {
if (void 0 !== this._N$returnType) {
this.returnType = this._N$returnType;
this._N$returnType = void 0;
}
if (void 0 !== this._N$maxLength) {
this.maxLength = this._N$maxLength;
this._N$maxLength = void 0;
}
void 0 !== this._N$backgroundImage && this._updateBackgroundSprite();
void 0 === this._N$fontColor && void 0 === this._N$fontSize && void 0 === this._N$lineHeight || this._updateTextLabel();
void 0 === this._N$placeholderFontColor && void 0 === this._N$placeholderFontSize || this._updatePlaceholderLabel();
if (void 0 !== this._N$placeholder) {
this.placeholder = this._N$placeholder;
this._N$placeholder = void 0;
}
},
_syncSize: function() {
if (this._impl) {
var t = this.node.getContentSize();
this._impl.setSize(t.width, t.height);
}
},
_showLabels: function() {
this._isLabelVisible = !0;
this._updateLabels();
},
_hideLabels: function() {
this._isLabelVisible = !1;
this.textLabel && (this.textLabel.node.active = !1);
this.placeholderLabel && (this.placeholderLabel.node.active = !1);
},
_updateLabels: function() {
if (this._isLabelVisible) {
var t = this._string;
this.textLabel && (this.textLabel.node.active = "" !== t);
this.placeholderLabel && (this.placeholderLabel.node.active = "" === t);
}
},
_updateString: function(t) {
var e = this.textLabel;
if (e) {
var i = t;
i && (i = this._updateLabelStringStyle(i));
e.string = i;
this._updateLabels();
}
},
_updateLabelStringStyle: function(t, e) {
var i = this.inputFlag;
if (e || i !== c.PASSWORD) i === c.INITIAL_CAPS_ALL_CHARACTERS ? t = t.toUpperCase() : i === c.INITIAL_CAPS_WORD ? t = u(t) : i === c.INITIAL_CAPS_SENTENCE && (t = h(t)); else {
for (var n = "", r = t.length, s = 0; s < r; ++s) n += "●";
t = n;
}
return t;
},
editBoxEditingDidBegan: function() {
cc.Component.EventHandler.emitEvents(this.editingDidBegan, this);
this.node.emit("editing-did-began", this);
},
editBoxEditingDidEnded: function() {
cc.Component.EventHandler.emitEvents(this.editingDidEnded, this);
this.node.emit("editing-did-ended", this);
},
editBoxTextChanged: function(t) {
t = this._updateLabelStringStyle(t, !0);
this.string = t;
cc.Component.EventHandler.emitEvents(this.textChanged, t, this);
this.node.emit("text-changed", this);
},
editBoxEditingReturn: function() {
cc.Component.EventHandler.emitEvents(this.editingReturn, this);
this.node.emit("editing-return", this);
},
onEnable: function() {
this._registerEvent();
this._impl && this._impl.enable();
},
onDisable: function() {
this._unregisterEvent();
this._impl && this._impl.disable();
},
onDestroy: function() {
this._impl && this._impl.clear();
},
__preload: function() {
this._init();
},
_registerEvent: function() {
this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
},
_unregisterEvent: function() {
this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this);
this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this);
},
_onTouchBegan: function(t) {
t.stopPropagation();
},
_onTouchCancel: function(t) {
t.stopPropagation();
},
_onTouchEnded: function(t) {
this._impl && this._impl.beginEditing();
t.stopPropagation();
},
setFocus: function() {
cc.warnID(1400, "setFocus()", "focus()");
this._impl && this._impl.setFocus(!0);
},
focus: function() {
this._impl && this._impl.setFocus(!0);
},
blur: function() {
this._impl && this._impl.setFocus(!1);
},
isFocused: function() {
return !!this._impl && this._impl.isFocused();
},
update: function() {
this._impl && this._impl.update();
}
});
cc.EditBox = e.exports = f;
cc.sys.isBrowser && t("./WebEditBoxImpl");
}), {
"../../platform/CCMacro": 115,
"../CCLabel": 49,
"../editbox/EditBoxImplBase": 65,
"./WebEditBoxImpl": 66,
"./types": 68
} ],
65: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
ctor: function() {
this._delegate = null;
this._editing = !1;
},
init: function(t) {},
enable: function() {},
disable: function() {
this._editing && this.endEditing();
},
clear: function() {},
update: function() {},
setTabIndex: function(t) {},
setSize: function(t, e) {},
setFocus: function(t) {
t ? this.beginEditing() : this.endEditing();
},
isFocused: function() {
return this._editing;
},
beginEditing: function() {},
endEditing: function() {}
});
e.exports = n;
}), {} ],
66: [ (function(t, e, i) {
"use strict";
var n = t("../../platform/utils"), r = t("../../platform/CCMacro"), s = t("./types"), o = t("../CCLabel"), a = t("./tabIndexUtil"), c = cc.EditBox, l = cc.js, u = s.InputMode, h = s.InputFlag, f = s.KeyboardReturnType, d = cc.vmath, _ = {
zoomInvalid: !1
};
cc.sys.OS_ANDROID !== cc.sys.os || cc.sys.browserType !== cc.sys.BROWSER_TYPE_SOUGOU && cc.sys.browserType !== cc.sys.BROWSER_TYPE_360 || (_.zoomInvalid = !0);
var p = 0, v = cc.v3(), g = null, m = !1, y = !1, E = c._ImplClass;
function C() {
E.call(this);
this._domId = "EditBoxId_" + ++p;
this._placeholderStyleSheet = null;
this._elem = null;
this._isTextArea = !1;
this._worldMat = d.mat4.create();
this._cameraMat = d.mat4.create();
this._m00 = 0;
this._m01 = 0;
this._m04 = 0;
this._m05 = 0;
this._m12 = 0;
this._m13 = 0;
this._w = 0;
this._h = 0;
this._inputMode = null;
this._inputFlag = null;
this._returnType = null;
this._eventListeners = {};
this._textLabelFont = null;
this._textLabelFontSize = null;
this._textLabelFontColor = null;
this._textLabelAlign = null;
this._placeholderLabelFont = null;
this._placeholderLabelFontSize = null;
this._placeholderLabelFontColor = null;
this._placeholderLabelAlign = null;
this._placeholderLineHeight = null;
}
l.extend(C, E);
c._ImplClass = C;
Object.assign(C.prototype, {
init: function(t) {
if (t) {
this._delegate = t;
t.inputMode === u.ANY ? this._createTextArea() : this._createInput();
a.add(this);
this.setTabIndex(t.tabIndex);
this._initStyleSheet();
this._registerEventListeners();
this._addDomToGameContainer();
m = cc.view.isAutoFullScreenEnabled();
y = cc.view._resizeWithBrowserSize;
}
},
clear: function() {
this._removeEventListeners();
this._removeDomFromGameContainer();
a.remove(this);
g === this && (g = null);
},
update: function() {
this._updateMatrix();
},
setTabIndex: function(t) {
this._elem.tabIndex = t;
a.resort();
},
setSize: function(t, e) {
var i = this._elem;
i.style.width = t + "px";
i.style.height = e + "px";
},
beginEditing: function() {
g && g !== this && g.setFocus(!1);
this._editing = !0;
g = this;
this._delegate.editBoxEditingDidBegan();
this._showDom();
this._elem.focus();
},
endEditing: function() {
this._elem && this._elem.blur();
},
_createInput: function() {
this._isTextArea = !1;
this._elem = document.createElement("input");
},
_createTextArea: function() {
this._isTextArea = !0;
this._elem = document.createElement("textarea");
},
_addDomToGameContainer: function() {
cc.game.container.appendChild(this._elem);
document.head.appendChild(this._placeholderStyleSheet);
},
_removeDomFromGameContainer: function() {
n.contains(cc.game.container, this._elem) && cc.game.container.removeChild(this._elem);
n.contains(document.head, this._placeholderStyleSheet) && document.head.removeChild(this._placeholderStyleSheet);
delete this._elem;
delete this._placeholderStyleSheet;
},
_showDom: function() {
this._updateMaxLength();
this._updateInputType();
this._updateStyleSheet();
this._elem.style.display = "";
this._delegate._hideLabels();
cc.sys.isMobile && this._showDomOnMobile();
},
_hideDom: function() {
this._elem.style.display = "none";
this._delegate._showLabels();
cc.sys.isMobile && this._hideDomOnMobile();
},
_showDomOnMobile: function() {
if (cc.sys.os === cc.sys.OS_ANDROID) {
if (m) {
cc.view.enableAutoFullScreen(!1);
cc.screen.exitFullScreen();
}
y && cc.view.resizeWithBrowserSize(!1);
this._adjustWindowScroll();
}
},
_hideDomOnMobile: function() {
cc.sys.os === cc.sys.OS_ANDROID && setTimeout((function() {
if (!g) {
m && cc.view.enableAutoFullScreen(!0);
y && cc.view.resizeWithBrowserSize(!0);
}
}), 800);
this._scrollBackWindow();
},
_adjustWindowScroll: function() {
var t = this;
setTimeout((function() {
window.scrollY < 100 && t._elem.scrollIntoView({
block: "start",
inline: "nearest",
behavior: "smooth"
});
}), 800);
},
_scrollBackWindow: function() {
setTimeout((function() {
var t = cc.sys;
t.browserType !== t.BROWSER_TYPE_WECHAT || t.os !== t.OS_IOS ? window.scrollTo(0, 0) : window.top && window.top.scrollTo(0, 0);
}), 800);
},
_updateMatrix: function() {
var t = this._delegate.node;
t.getWorldMatrix(this._worldMat);
var e = this._worldMat, i = e.m;
if (this._m00 !== i[0] || this._m01 !== i[1] || this._m04 !== i[4] || this._m05 !== i[5] || this._m12 !== i[12] || this._m13 !== i[13] || this._w !== t._contentSize.width || this._h !== t._contentSize.height) {
this._m00 = i[0];
this._m01 = i[1];
this._m04 = i[4];
this._m05 = i[5];
this._m12 = i[12];
this._m13 = i[13];
this._w = t._contentSize.width;
this._h = t._contentSize.height;
var n = cc.view._scaleX, r = cc.view._scaleY, s = cc.view._viewportRect, o = cc.view._devicePixelRatio;
v.x = -t._anchorPoint.x * this._w;
v.y = -t._anchorPoint.y * this._h;
d.mat4.translate(e, e, v);
var a = void 0;
cc.Camera.findCamera(t).getWorldToScreenMatrix2D(this._cameraMat);
a = this._cameraMat;
d.mat4.mul(a, a, e);
n /= o;
r /= o;
var c = cc.game.container, l = a.m, u = l[0] * n, h = l[1], f = l[4], p = l[5] * r, g = c && c.style.paddingLeft && parseInt(c.style.paddingLeft);
g += s.x / o;
var m = c && c.style.paddingBottom && parseInt(c.style.paddingBottom);
m += s.y / o;
var y = l[12] * n + g, E = l[13] * r + m;
if (_.zoomInvalid) {
this.setSize(t.width * u, t.height * p);
u = 1;
p = 1;
}
var C = this._elem, T = "matrix(" + u + "," + -h + "," + -f + "," + p + "," + y + "," + -E + ")";
C.style.transform = T;
C.style["-webkit-transform"] = T;
C.style["transform-origin"] = "0px 100% 0px";
C.style["-webkit-transform-origin"] = "0px 100% 0px";
}
},
_updateInputType: function() {
var t = this._delegate, e = t.inputMode, i = t.inputFlag, n = t.returnType, r = this._elem;
if (this._inputMode !== e || this._inputFlag !== i || this._returnType !== n) {
this._inputMode = e;
this._inputFlag = i;
this._returnType = n;
if (this._isTextArea) {
var s = "none";
i === h.INITIAL_CAPS_ALL_CHARACTERS ? s = "uppercase" : i === h.INITIAL_CAPS_WORD && (s = "capitalize");
r.style.textTransform = s;
} else if (i !== h.PASSWORD) {
var o = r.type;
if (e === u.EMAIL_ADDR) o = "email"; else if (e === u.NUMERIC || e === u.DECIMAL) o = "number"; else if (e === u.PHONE_NUMBER) {
o = "number";
r.pattern = "[0-9]*";
} else if (e === u.URL) o = "url"; else {
o = "text";
n === f.SEARCH && (o = "search");
}
r.type = o;
var a = "none";
i === h.INITIAL_CAPS_ALL_CHARACTERS ? a = "uppercase" : i === h.INITIAL_CAPS_WORD && (a = "capitalize");
r.style.textTransform = a;
} else r.type = "password";
}
},
_updateMaxLength: function() {
var t = this._delegate.maxLength;
t < 0 && (t = 65535);
this._elem.maxLength = t;
},
_initStyleSheet: function() {
var t = this._elem;
t.style.display = "none";
t.style.border = 0;
t.style.background = "transparent";
t.style.width = "100%";
t.style.height = "100%";
t.style.active = 0;
t.style.outline = "medium";
t.style.padding = "0";
t.style.textTransform = "uppercase";
t.style.position = "absolute";
t.style.bottom = "0px";
t.style.left = "2px";
t.className = "cocosEditBox";
t.id = this._domId;
if (this._isTextArea) {
t.style.resize = "none";
t.style.overflow_y = "scroll";
} else {
t.type = "text";
t.style["-moz-appearance"] = "textfield";
}
this._placeholderStyleSheet = document.createElement("style");
},
_updateStyleSheet: function() {
var t = this._delegate, e = this._elem;
e.value = t.string;
e.placeholder = t.placeholder;
this._updateTextLabel(t.textLabel);
this._updatePlaceholderLabel(t.placeholderLabel);
},
_updateTextLabel: function(t) {
if (t) {
var e = t.font;
e = !e || e instanceof cc.BitmapFont ? t.fontFamily : e._fontFamily;
var i = t.fontSize * t.node.scaleY;
if (this._textLabelFont !== e || this._textLabelFontSize !== i || this._textLabelFontColor !== t.fontColor || this._textLabelAlign !== t.horizontalAlign) {
this._textLabelFont = e;
this._textLabelFontSize = i;
this._textLabelFontColor = t.fontColor;
this._textLabelAlign = t.horizontalAlign;
var n = this._elem;
n.style.fontSize = i + "px";
n.style.color = t.node.color.toCSS("rgba");
n.style.fontFamily = e;
switch (t.horizontalAlign) {
case o.HorizontalAlign.LEFT:
n.style.textAlign = "left";
break;

case o.HorizontalAlign.CENTER:
n.style.textAlign = "center";
break;

case o.HorizontalAlign.RIGHT:
n.style.textAlign = "right";
}
}
}
},
_updatePlaceholderLabel: function(t) {
if (t) {
var e = t.font;
e = !e || e instanceof cc.BitmapFont ? t.fontFamily : t.font._fontFamily;
var i = t.fontSize * t.node.scaleY;
if (this._placeholderLabelFont !== e || this._placeholderLabelFontSize !== i || this._placeholderLabelFontColor !== t.fontColor || this._placeholderLabelAlign !== t.horizontalAlign || this._placeholderLineHeight !== t.fontSize) {
this._placeholderLabelFont = e;
this._placeholderLabelFontSize = i;
this._placeholderLabelFontColor = t.fontColor;
this._placeholderLabelAlign = t.horizontalAlign;
this._placeholderLineHeight = t.fontSize;
var n = this._placeholderStyleSheet, r = t.node.color.toCSS("rgba"), s = t.fontSize, a = void 0;
switch (t.horizontalAlign) {
case o.HorizontalAlign.LEFT:
a = "left";
break;

case o.HorizontalAlign.CENTER:
a = "center";
break;

case o.HorizontalAlign.RIGHT:
a = "right";
}
n.innerHTML = "#" + this._domId + "::-webkit-input-placeholder,#" + this._domId + "::-moz-placeholder,#" + this._domId + ":-ms-input-placeholder{text-transform: initial; font-family: " + e + "; font-size: " + i + "px; color: " + r + "; line-height: " + s + "px; text-align: " + a + ";}";
cc.sys.browserType === cc.sys.BROWSER_TYPE_EDGE && (n.innerHTML += "#" + this._domId + "::-ms-clear{display: none;}");
}
}
},
_registerEventListeners: function() {
var t = this, e = this._elem, i = !1, n = this._eventListeners;
n.compositionStart = function() {
i = !0;
};
n.compositionEnd = function() {
i = !1;
t._delegate.editBoxTextChanged(e.value);
};
n.onInput = function() {
i || t._delegate.editBoxTextChanged(e.value);
};
n.onClick = function(e) {
t._editing && cc.sys.isMobile && t._adjustWindowScroll();
};
n.onKeydown = function(i) {
if (i.keyCode === r.KEY.enter) {
i.stopPropagation();
t._delegate.editBoxEditingReturn();
t._isTextArea || e.blur();
} else if (i.keyCode === r.KEY.tab) {
i.stopPropagation();
i.preventDefault();
a.next(t);
}
};
n.onBlur = function() {
t._editing = !1;
g = null;
t._hideDom();
t._delegate.editBoxEditingDidEnded();
};
e.addEventListener("compositionstart", n.compositionStart);
e.addEventListener("compositionend", n.compositionEnd);
e.addEventListener("input", n.onInput);
e.addEventListener("keydown", n.onKeydown);
e.addEventListener("blur", n.onBlur);
e.addEventListener("touchstart", n.onClick);
},
_removeEventListeners: function() {
var t = this._elem, e = this._eventListeners;
t.removeEventListener("compositionstart", e.compositionStart);
t.removeEventListener("compositionend", e.compositionEnd);
t.removeEventListener("input", e.onInput);
t.removeEventListener("keydown", e.onKeydown);
t.removeEventListener("blur", e.onBlur);
t.removeEventListener("touchstart", e.onClick);
e.compositionStart = null;
e.compositionEnd = null;
e.onInput = null;
e.onKeydown = null;
e.onBlur = null;
e.onClick = null;
}
});
}), {
"../../platform/CCMacro": 115,
"../../platform/utils": 134,
"../CCLabel": 49,
"./tabIndexUtil": 67,
"./types": 68
} ],
67: [ (function(t, e, i) {
"use strict";
e.exports = {
_tabIndexList: [],
add: function(t) {
var e = this._tabIndexList;
-1 === e.indexOf(t) && e.push(t);
},
remove: function(t) {
var e = this._tabIndexList, i = e.indexOf(t);
-1 !== i && e.splice(i, 1);
},
resort: function() {
this._tabIndexList.sort((function(t, e) {
return t._delegate._tabIndex - e._delegate._tabIndex;
}));
},
next: function(t) {
var e = this._tabIndexList, i = e.indexOf(t);
t.setFocus(!1);
if (-1 !== i) {
var n = e[i + 1];
n && n._delegate._tabIndex >= 0 && n.setFocus(!0);
}
}
};
}), {} ],
68: [ (function(t, e, i) {
"use strict";
var n = cc.Enum({
DEFAULT: 0,
DONE: 1,
SEND: 2,
SEARCH: 3,
GO: 4,
NEXT: 5
}), r = cc.Enum({
ANY: 0,
EMAIL_ADDR: 1,
NUMERIC: 2,
PHONE_NUMBER: 3,
URL: 4,
DECIMAL: 5,
SINGLE_LINE: 6
}), s = cc.Enum({
PASSWORD: 0,
SENSITIVE: 1,
INITIAL_CAPS_WORD: 2,
INITIAL_CAPS_SENTENCE: 3,
INITIAL_CAPS_ALL_CHARACTERS: 4,
DEFAULT: 5
});
e.exports = {
KeyboardReturnType: n,
InputMode: r,
InputFlag: s
};
}), {} ],
69: [ (function(t, e, i) {
"use strict";
t("./CCComponent");
t("./CCComponentEventHandler");
t("./missing-script");
var n = t("./WXSubContextView"), r = t("./SwanSubContextView");
n || (n = cc.Class({
name: "cc.WXSubContextView",
extends: cc.Component
}));
r || (r = cc.Class({
name: "cc.SwanSubContextView",
extends: cc.Component
}));
var s = [ t("./CCSprite"), t("./CCWidget"), t("./CCCanvas"), t("./CCAudioSource"), t("./CCAnimation"), t("./CCButton"), t("./CCLabel"), t("./CCProgressBar"), t("./CCMask"), t("./CCScrollBar"), t("./CCScrollView"), t("./CCPageViewIndicator"), t("./CCPageView"), t("./CCSlider"), t("./CCLayout"), t("./editbox/CCEditBox"), t("./CCLabelOutline"), t("./CCLabelShadow"), t("./CCRichText"), t("./CCToggleContainer"), t("./CCToggleGroup"), t("./CCToggle"), t("./CCBlockInputEvents"), t("./CCMotionStreak"), n, r ];
e.exports = s;
}), {
"./CCAnimation": void 0,
"./CCAudioSource": void 0,
"./CCBlockInputEvents": 44,
"./CCButton": 45,
"./CCCanvas": 46,
"./CCComponent": 47,
"./CCComponentEventHandler": 48,
"./CCLabel": 49,
"./CCLabelOutline": 50,
"./CCLabelShadow": 51,
"./CCLayout": 52,
"./CCMask": void 0,
"./CCMotionStreak": void 0,
"./CCPageView": void 0,
"./CCPageViewIndicator": void 0,
"./CCProgressBar": 53,
"./CCRichText": void 0,
"./CCScrollBar": 55,
"./CCScrollView": 56,
"./CCSlider": void 0,
"./CCSprite": 57,
"./CCToggle": 59,
"./CCToggleContainer": 60,
"./CCToggleGroup": 61,
"./CCWidget": 63,
"./SwanSubContextView": void 0,
"./WXSubContextView": void 0,
"./editbox/CCEditBox": 64,
"./missing-script": 70
} ],
70: [ (function(t, e, i) {
"use strict";
var n = cc.js, r = t("../utils/misc").BUILTIN_CLASSID_RE, s = cc.Class({
name: "cc.MissingClass",
properties: {
_$erialized: {
default: null,
visible: !1,
editorOnly: !0
}
}
}), o = cc.Class({
name: "cc.MissingScript",
extends: cc.Component,
editor: {
inspector: "packages://inspector/inspectors/comps/missing-script.js"
},
properties: {
compiled: {
default: !1,
serializable: !1
},
_$erialized: {
default: null,
visible: !1,
editorOnly: !0
}
},
ctor: !1,
statics: {
safeFindClass: function(t, e) {
var i = n._getClassById(t);
if (i) return i;
if (t) {
cc.deserialize.reportMissingClass(t);
return o.getMissingWrapper(t, e);
}
return null;
},
getMissingWrapper: function(t, e) {
return e.node && (/^[0-9a-zA-Z+/]{23}$/.test(t) || r.test(t)) ? o : s;
}
},
onLoad: function() {
cc.warnID(4600, this.node.name);
}
});
cc._MissingScript = e.exports = o;
}), {
"../utils/misc": 187
} ],
71: [ (function(t, e, i) {
"use strict";
var n = cc.js;
t("../event/event");
var r = function(t, e) {
cc.Event.call(this, cc.Event.MOUSE, e);
this._eventType = t;
this._button = 0;
this._x = 0;
this._y = 0;
this._prevX = 0;
this._prevY = 0;
this._scrollX = 0;
this._scrollY = 0;
};
n.extend(r, cc.Event);
var s = r.prototype;
s.setScrollData = function(t, e) {
this._scrollX = t;
this._scrollY = e;
};
s.getScrollX = function() {
return this._scrollX;
};
s.getScrollY = function() {
return this._scrollY;
};
s.setLocation = function(t, e) {
this._x = t;
this._y = e;
};
s.getLocation = function() {
return cc.v2(this._x, this._y);
};
s.getLocationInView = function() {
return cc.v2(this._x, cc.view._designResolutionSize.height - this._y);
};
s._setPrevCursor = function(t, e) {
this._prevX = t;
this._prevY = e;
};
s.getPreviousLocation = function() {
return cc.v2(this._prevX, this._prevY);
};
s.getDelta = function() {
return cc.v2(this._x - this._prevX, this._y - this._prevY);
};
s.getDeltaX = function() {
return this._x - this._prevX;
};
s.getDeltaY = function() {
return this._y - this._prevY;
};
s.setButton = function(t) {
this._button = t;
};
s.getButton = function() {
return this._button;
};
s.getLocationX = function() {
return this._x;
};
s.getLocationY = function() {
return this._y;
};
r.NONE = 0;
r.DOWN = 1;
r.UP = 2;
r.MOVE = 3;
r.SCROLL = 4;
r.BUTTON_LEFT = 0;
r.BUTTON_RIGHT = 2;
r.BUTTON_MIDDLE = 1;
r.BUTTON_4 = 3;
r.BUTTON_5 = 4;
r.BUTTON_6 = 5;
r.BUTTON_7 = 6;
r.BUTTON_8 = 7;
var o = function(t, e) {
cc.Event.call(this, cc.Event.TOUCH, e);
this._eventCode = 0;
this._touches = t || [];
this.touch = null;
this.currentTouch = null;
};
n.extend(o, cc.Event);
(s = o.prototype).getEventCode = function() {
return this._eventCode;
};
s.getTouches = function() {
return this._touches;
};
s._setEventCode = function(t) {
this._eventCode = t;
};
s._setTouches = function(t) {
this._touches = t;
};
s.setLocation = function(t, e) {
this.touch && this.touch.setTouchInfo(this.touch.getID(), t, e);
};
s.getLocation = function() {
return this.touch ? this.touch.getLocation() : cc.v2();
};
s.getLocationInView = function() {
return this.touch ? this.touch.getLocationInView() : cc.v2();
};
s.getPreviousLocation = function() {
return this.touch ? this.touch.getPreviousLocation() : cc.v2();
};
s.getStartLocation = function() {
return this.touch ? this.touch.getStartLocation() : cc.v2();
};
s.getID = function() {
return this.touch ? this.touch.getID() : null;
};
s.getDelta = function() {
return this.touch ? this.touch.getDelta() : cc.v2();
};
s.getDeltaX = function() {
return this.touch ? this.touch.getDelta().x : 0;
};
s.getDeltaY = function() {
return this.touch ? this.touch.getDelta().y : 0;
};
s.getLocationX = function() {
return this.touch ? this.touch.getLocationX() : 0;
};
s.getLocationY = function() {
return this.touch ? this.touch.getLocationY() : 0;
};
o.MAX_TOUCHES = 5;
o.BEGAN = 0;
o.MOVED = 1;
o.ENDED = 2;
o.CANCELED = 3;
var a = function(t, e) {
cc.Event.call(this, cc.Event.ACCELERATION, e);
this.acc = t;
};
n.extend(a, cc.Event);
var c = function(t, e, i) {
cc.Event.call(this, cc.Event.KEYBOARD, i);
this.keyCode = t;
this.isPressed = e;
};
n.extend(c, cc.Event);
cc.Event.EventMouse = r;
cc.Event.EventTouch = o;
cc.Event.EventAcceleration = a;
cc.Event.EventKeyboard = c;
e.exports = cc.Event;
}), {
"../event/event": 78
} ],
72: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js");
cc.EventListener = function(t, e, i) {
this._onEvent = i;
this._type = t || 0;
this._listenerID = e || "";
this._registered = !1;
this._fixedPriority = 0;
this._node = null;
this._target = null;
this._paused = !0;
this._isEnabled = !0;
};
cc.EventListener.prototype = {
constructor: cc.EventListener,
_setPaused: function(t) {
this._paused = t;
},
_isPaused: function() {
return this._paused;
},
_setRegistered: function(t) {
this._registered = t;
},
_isRegistered: function() {
return this._registered;
},
_getType: function() {
return this._type;
},
_getListenerID: function() {
return this._listenerID;
},
_setFixedPriority: function(t) {
this._fixedPriority = t;
},
_getFixedPriority: function() {
return this._fixedPriority;
},
_setSceneGraphPriority: function(t) {
this._target = t;
this._node = t;
},
_getSceneGraphPriority: function() {
return this._node;
},
checkAvailable: function() {
return null !== this._onEvent;
},
clone: function() {
return null;
},
setEnabled: function(t) {
this._isEnabled = t;
},
isEnabled: function() {
return this._isEnabled;
},
retain: function() {},
release: function() {}
};
cc.EventListener.UNKNOWN = 0;
cc.EventListener.TOUCH_ONE_BY_ONE = 1;
cc.EventListener.TOUCH_ALL_AT_ONCE = 2;
cc.EventListener.KEYBOARD = 3;
cc.EventListener.MOUSE = 4;
cc.EventListener.ACCELERATION = 6;
cc.EventListener.CUSTOM = 8;
var r = cc.EventListener.ListenerID = {
MOUSE: "__cc_mouse",
TOUCH_ONE_BY_ONE: "__cc_touch_one_by_one",
TOUCH_ALL_AT_ONCE: "__cc_touch_all_at_once",
KEYBOARD: "__cc_keyboard",
ACCELERATION: "__cc_acceleration"
}, s = function(t, e) {
this._onCustomEvent = e;
cc.EventListener.call(this, cc.EventListener.CUSTOM, t, this._callback);
};
n.extend(s, cc.EventListener);
n.mixin(s.prototype, {
_onCustomEvent: null,
_callback: function(t) {
null !== this._onCustomEvent && this._onCustomEvent(t);
},
checkAvailable: function() {
return cc.EventListener.prototype.checkAvailable.call(this) && null !== this._onCustomEvent;
},
clone: function() {
return new s(this._listenerID, this._onCustomEvent);
}
});
var o = function() {
cc.EventListener.call(this, cc.EventListener.MOUSE, r.MOUSE, this._callback);
};
n.extend(o, cc.EventListener);
n.mixin(o.prototype, {
onMouseDown: null,
onMouseUp: null,
onMouseMove: null,
onMouseScroll: null,
_callback: function(t) {
var e = cc.Event.EventMouse;
switch (t._eventType) {
case e.DOWN:
this.onMouseDown && this.onMouseDown(t);
break;

case e.UP:
this.onMouseUp && this.onMouseUp(t);
break;

case e.MOVE:
this.onMouseMove && this.onMouseMove(t);
break;

case e.SCROLL:
this.onMouseScroll && this.onMouseScroll(t);
}
},
clone: function() {
var t = new o();
t.onMouseDown = this.onMouseDown;
t.onMouseUp = this.onMouseUp;
t.onMouseMove = this.onMouseMove;
t.onMouseScroll = this.onMouseScroll;
return t;
},
checkAvailable: function() {
return !0;
}
});
var a = function() {
cc.EventListener.call(this, cc.EventListener.TOUCH_ONE_BY_ONE, r.TOUCH_ONE_BY_ONE, null);
this._claimedTouches = [];
};
n.extend(a, cc.EventListener);
n.mixin(a.prototype, {
constructor: a,
_claimedTouches: null,
swallowTouches: !1,
onTouchBegan: null,
onTouchMoved: null,
onTouchEnded: null,
onTouchCancelled: null,
setSwallowTouches: function(t) {
this.swallowTouches = t;
},
isSwallowTouches: function() {
return this.swallowTouches;
},
clone: function() {
var t = new a();
t.onTouchBegan = this.onTouchBegan;
t.onTouchMoved = this.onTouchMoved;
t.onTouchEnded = this.onTouchEnded;
t.onTouchCancelled = this.onTouchCancelled;
t.swallowTouches = this.swallowTouches;
return t;
},
checkAvailable: function() {
if (!this.onTouchBegan) {
cc.logID(1801);
return !1;
}
return !0;
}
});
var c = function() {
cc.EventListener.call(this, cc.EventListener.TOUCH_ALL_AT_ONCE, r.TOUCH_ALL_AT_ONCE, null);
};
n.extend(c, cc.EventListener);
n.mixin(c.prototype, {
constructor: c,
onTouchesBegan: null,
onTouchesMoved: null,
onTouchesEnded: null,
onTouchesCancelled: null,
clone: function() {
var t = new c();
t.onTouchesBegan = this.onTouchesBegan;
t.onTouchesMoved = this.onTouchesMoved;
t.onTouchesEnded = this.onTouchesEnded;
t.onTouchesCancelled = this.onTouchesCancelled;
return t;
},
checkAvailable: function() {
if (null === this.onTouchesBegan && null === this.onTouchesMoved && null === this.onTouchesEnded && null === this.onTouchesCancelled) {
cc.logID(1802);
return !1;
}
return !0;
}
});
var l = function(t) {
this._onAccelerationEvent = t;
cc.EventListener.call(this, cc.EventListener.ACCELERATION, r.ACCELERATION, this._callback);
};
n.extend(l, cc.EventListener);
n.mixin(l.prototype, {
constructor: l,
_onAccelerationEvent: null,
_callback: function(t) {
this._onAccelerationEvent(t.acc, t);
},
checkAvailable: function() {
cc.assertID(this._onAccelerationEvent, 1803);
return !0;
},
clone: function() {
return new l(this._onAccelerationEvent);
}
});
var u = function() {
cc.EventListener.call(this, cc.EventListener.KEYBOARD, r.KEYBOARD, this._callback);
};
n.extend(u, cc.EventListener);
n.mixin(u.prototype, {
constructor: u,
onKeyPressed: null,
onKeyReleased: null,
_callback: function(t) {
t.isPressed ? this.onKeyPressed && this.onKeyPressed(t.keyCode, t) : this.onKeyReleased && this.onKeyReleased(t.keyCode, t);
},
clone: function() {
var t = new u();
t.onKeyPressed = this.onKeyPressed;
t.onKeyReleased = this.onKeyReleased;
return t;
},
checkAvailable: function() {
if (null === this.onKeyPressed && null === this.onKeyReleased) {
cc.logID(1800);
return !1;
}
return !0;
}
});
cc.EventListener.create = function(t) {
cc.assertID(t && t.event, 1900);
var e = t.event;
delete t.event;
var i = null;
if (e === cc.EventListener.TOUCH_ONE_BY_ONE) i = new a(); else if (e === cc.EventListener.TOUCH_ALL_AT_ONCE) i = new c(); else if (e === cc.EventListener.MOUSE) i = new o(); else if (e === cc.EventListener.CUSTOM) {
i = new s(t.eventName, t.callback);
delete t.eventName;
delete t.callback;
} else if (e === cc.EventListener.KEYBOARD) i = new u(); else if (e === cc.EventListener.ACCELERATION) {
i = new l(t.callback);
delete t.callback;
}
for (var n in t) i[n] = t[n];
return i;
};
e.exports = cc.EventListener;
}), {
"../platform/js": 130
} ],
73: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js");
t("./CCEventListener");
var r = cc.EventListener.ListenerID, s = function() {
this._fixedListeners = [];
this._sceneGraphListeners = [];
this.gt0Index = 0;
};
s.prototype = {
constructor: s,
size: function() {
return this._fixedListeners.length + this._sceneGraphListeners.length;
},
empty: function() {
return 0 === this._fixedListeners.length && 0 === this._sceneGraphListeners.length;
},
push: function(t) {
0 === t._getFixedPriority() ? this._sceneGraphListeners.push(t) : this._fixedListeners.push(t);
},
clearSceneGraphListeners: function() {
this._sceneGraphListeners.length = 0;
},
clearFixedListeners: function() {
this._fixedListeners.length = 0;
},
clear: function() {
this._sceneGraphListeners.length = 0;
this._fixedListeners.length = 0;
},
getFixedPriorityListeners: function() {
return this._fixedListeners;
},
getSceneGraphPriorityListeners: function() {
return this._sceneGraphListeners;
}
};
var o = function(t) {
var e = cc.Event, i = t.type;
if (i === e.ACCELERATION) return r.ACCELERATION;
if (i === e.KEYBOARD) return r.KEYBOARD;
if (i.startsWith(e.MOUSE)) return r.MOUSE;
i.startsWith(e.TOUCH) && cc.logID(2e3);
return "";
}, a = {
DIRTY_NONE: 0,
DIRTY_FIXED_PRIORITY: 1,
DIRTY_SCENE_GRAPH_PRIORITY: 2,
DIRTY_ALL: 3,
_listenersMap: {},
_priorityDirtyFlagMap: {},
_nodeListenersMap: {},
_toAddedListeners: [],
_toRemovedListeners: [],
_dirtyListeners: {},
_inDispatch: 0,
_isEnabled: !1,
_internalCustomListenerIDs: [],
_setDirtyForNode: function(t) {
var e = this._nodeListenersMap[t._id];
if (void 0 !== e) for (var i = 0, n = e.length; i < n; i++) {
var r = e[i]._getListenerID();
null == this._dirtyListeners[r] && (this._dirtyListeners[r] = !0);
}
if (t.getChildren) {
var s = t.getChildren(), o = 0;
for (n = s ? s.length : 0; o < n; o++) this._setDirtyForNode(s[o]);
}
},
pauseTarget: function(t, e) {
if (t instanceof cc._BaseNode) {
var i, n, r = this._nodeListenersMap[t._id];
if (r) for (i = 0, n = r.length; i < n; i++) r[i]._setPaused(!0);
if (!0 === e) {
var s = t.getChildren();
for (i = 0, n = s ? s.length : 0; i < n; i++) this.pauseTarget(s[i], !0);
}
} else cc.warnID(3506);
},
resumeTarget: function(t, e) {
if (t instanceof cc._BaseNode) {
var i, n, r = this._nodeListenersMap[t._id];
if (r) for (i = 0, n = r.length; i < n; i++) r[i]._setPaused(!1);
this._setDirtyForNode(t);
if (!0 === e && t.getChildren) {
var s = t.getChildren();
for (i = 0, n = s ? s.length : 0; i < n; i++) this.resumeTarget(s[i], !0);
}
} else cc.warnID(3506);
},
_addListener: function(t) {
0 === this._inDispatch ? this._forceAddEventListener(t) : this._toAddedListeners.push(t);
},
_forceAddEventListener: function(t) {
var e = t._getListenerID(), i = this._listenersMap[e];
if (!i) {
i = new s();
this._listenersMap[e] = i;
}
i.push(t);
if (0 === t._getFixedPriority()) {
this._setDirty(e, this.DIRTY_SCENE_GRAPH_PRIORITY);
var n = t._getSceneGraphPriority();
null === n && cc.logID(3507);
this._associateNodeAndEventListener(n, t);
n.activeInHierarchy && this.resumeTarget(n);
} else this._setDirty(e, this.DIRTY_FIXED_PRIORITY);
},
_getListeners: function(t) {
return this._listenersMap[t];
},
_updateDirtyFlagForSceneGraph: function() {
var t = this._dirtyListeners;
for (var e in t) this._setDirty(e, this.DIRTY_SCENE_GRAPH_PRIORITY);
this._dirtyListeners = {};
},
_removeAllListenersInVector: function(t) {
if (t) for (var e, i = t.length - 1; i >= 0; i--) {
(e = t[i])._setRegistered(!1);
if (null != e._getSceneGraphPriority()) {
this._dissociateNodeAndEventListener(e._getSceneGraphPriority(), e);
e._setSceneGraphPriority(null);
}
0 === this._inDispatch && cc.js.array.removeAt(t, i);
}
},
_removeListenersForListenerID: function(t) {
var e, i = this._listenersMap[t];
if (i) {
var n = i.getFixedPriorityListeners(), r = i.getSceneGraphPriorityListeners();
this._removeAllListenersInVector(r);
this._removeAllListenersInVector(n);
delete this._priorityDirtyFlagMap[t];
if (!this._inDispatch) {
i.clear();
delete this._listenersMap[t];
}
}
var s, o = this._toAddedListeners;
for (e = o.length - 1; e >= 0; e--) (s = o[e]) && s._getListenerID() === t && cc.js.array.removeAt(o, e);
},
_sortEventListeners: function(t) {
var e = this.DIRTY_NONE, i = this._priorityDirtyFlagMap;
i[t] && (e = i[t]);
if (e !== this.DIRTY_NONE) {
i[t] = this.DIRTY_NONE;
e & this.DIRTY_FIXED_PRIORITY && this._sortListenersOfFixedPriority(t);
if (e & this.DIRTY_SCENE_GRAPH_PRIORITY) {
cc.director.getScene() && this._sortListenersOfSceneGraphPriority(t);
}
}
},
_sortListenersOfSceneGraphPriority: function(t) {
var e = this._getListeners(t);
if (e) {
var i = e.getSceneGraphPriorityListeners();
i && 0 !== i.length && e.getSceneGraphPriorityListeners().sort(this._sortEventListenersOfSceneGraphPriorityDes);
}
},
_sortEventListenersOfSceneGraphPriorityDes: function(t, e) {
var i = t._getSceneGraphPriority(), n = e._getSceneGraphPriority();
if (!(e && n && n._activeInHierarchy && null !== n._parent)) return -1;
if (!t || !i || !i._activeInHierarchy || null === i._parent) return 1;
for (var r = i, s = n, o = !1; r._parent._id !== s._parent._id; ) {
r = null === r._parent._parent ? (o = !0) && n : r._parent;
s = null === s._parent._parent ? (o = !0) && i : s._parent;
}
if (r._id === s._id) {
if (r._id === n._id) return -1;
if (r._id === i._id) return 1;
}
return o ? r._localZOrder - s._localZOrder : s._localZOrder - r._localZOrder;
},
_sortListenersOfFixedPriority: function(t) {
var e = this._listenersMap[t];
if (e) {
var i = e.getFixedPriorityListeners();
if (i && 0 !== i.length) {
i.sort(this._sortListenersOfFixedPriorityAsc);
for (var n = 0, r = i.length; n < r && !(i[n]._getFixedPriority() >= 0); ) ++n;
e.gt0Index = n;
}
}
},
_sortListenersOfFixedPriorityAsc: function(t, e) {
return t._getFixedPriority() - e._getFixedPriority();
},
_onUpdateListeners: function(t) {
var e, i, n, r = t.getFixedPriorityListeners(), s = t.getSceneGraphPriorityListeners(), o = this._toRemovedListeners;
if (s) for (e = s.length - 1; e >= 0; e--) if (!(i = s[e])._isRegistered()) {
cc.js.array.removeAt(s, e);
-1 !== (n = o.indexOf(i)) && o.splice(n, 1);
}
if (r) for (e = r.length - 1; e >= 0; e--) if (!(i = r[e])._isRegistered()) {
cc.js.array.removeAt(r, e);
-1 !== (n = o.indexOf(i)) && o.splice(n, 1);
}
s && 0 === s.length && t.clearSceneGraphListeners();
r && 0 === r.length && t.clearFixedListeners();
},
frameUpdateListeners: function() {
var t = this._listenersMap, e = this._priorityDirtyFlagMap;
for (var i in t) if (t[i].empty()) {
delete e[i];
delete t[i];
}
var n = this._toAddedListeners;
if (0 !== n.length) {
for (var r = 0, s = n.length; r < s; r++) this._forceAddEventListener(n[r]);
n.length = 0;
}
0 !== this._toRemovedListeners.length && this._cleanToRemovedListeners();
},
_updateTouchListeners: function(t) {
var e = this._inDispatch;
cc.assertID(e > 0, 3508);
if (!(e > 1)) {
var i;
(i = this._listenersMap[r.TOUCH_ONE_BY_ONE]) && this._onUpdateListeners(i);
(i = this._listenersMap[r.TOUCH_ALL_AT_ONCE]) && this._onUpdateListeners(i);
cc.assertID(1 === e, 3509);
var n = this._toAddedListeners;
if (0 !== n.length) {
for (var s = 0, o = n.length; s < o; s++) this._forceAddEventListener(n[s]);
this._toAddedListeners.length = 0;
}
0 !== this._toRemovedListeners.length && this._cleanToRemovedListeners();
}
},
_cleanToRemovedListeners: function() {
for (var t = this._toRemovedListeners, e = 0; e < t.length; e++) {
var i = t[e], n = this._listenersMap[i._getListenerID()];
if (n) {
var r, s = n.getFixedPriorityListeners(), o = n.getSceneGraphPriorityListeners();
o && -1 !== (r = o.indexOf(i)) && o.splice(r, 1);
s && -1 !== (r = s.indexOf(i)) && s.splice(r, 1);
}
}
t.length = 0;
},
_onTouchEventCallback: function(t, e) {
if (!t._isRegistered()) return !1;
var i = e.event, n = i.currentTouch;
i.currentTarget = t._node;
var r, s = !1, o = i.getEventCode(), c = cc.Event.EventTouch;
if (o === c.BEGAN) t.onTouchBegan && (s = t.onTouchBegan(n, i)) && t._registered && t._claimedTouches.push(n); else if (t._claimedTouches.length > 0 && -1 !== (r = t._claimedTouches.indexOf(n))) {
s = !0;
if (o === c.MOVED && t.onTouchMoved) t.onTouchMoved(n, i); else if (o === c.ENDED) {
t.onTouchEnded && t.onTouchEnded(n, i);
t._registered && t._claimedTouches.splice(r, 1);
} else if (o === c.CANCELLED) {
t.onTouchCancelled && t.onTouchCancelled(n, i);
t._registered && t._claimedTouches.splice(r, 1);
}
}
if (i.isStopped()) {
a._updateTouchListeners(i);
return !0;
}
if (s && t.swallowTouches) {
e.needsMutableSet && e.touches.splice(n, 1);
return !0;
}
return !1;
},
_dispatchTouchEvent: function(t) {
this._sortEventListeners(r.TOUCH_ONE_BY_ONE);
this._sortEventListeners(r.TOUCH_ALL_AT_ONCE);
var e = this._getListeners(r.TOUCH_ONE_BY_ONE), i = this._getListeners(r.TOUCH_ALL_AT_ONCE);
if (null !== e || null !== i) {
var n = t.getTouches(), s = cc.js.array.copy(n), o = {
event: t,
needsMutableSet: e && i,
touches: s,
selTouch: null
};
if (e) for (var a = 0; a < n.length; a++) {
t.currentTouch = n[a];
t._propagationStopped = t._propagationImmediateStopped = !1;
this._dispatchEventToListeners(e, this._onTouchEventCallback, o);
}
if (i && s.length > 0) {
this._dispatchEventToListeners(i, this._onTouchesEventCallback, {
event: t,
touches: s
});
if (t.isStopped()) return;
}
this._updateTouchListeners(t);
}
},
_onTouchesEventCallback: function(t, e) {
if (!t._registered) return !1;
var i = cc.Event.EventTouch, n = e.event, r = e.touches, s = n.getEventCode();
n.currentTarget = t._node;
s === i.BEGAN && t.onTouchesBegan ? t.onTouchesBegan(r, n) : s === i.MOVED && t.onTouchesMoved ? t.onTouchesMoved(r, n) : s === i.ENDED && t.onTouchesEnded ? t.onTouchesEnded(r, n) : s === i.CANCELLED && t.onTouchesCancelled && t.onTouchesCancelled(r, n);
if (n.isStopped()) {
a._updateTouchListeners(n);
return !0;
}
return !1;
},
_associateNodeAndEventListener: function(t, e) {
var i = this._nodeListenersMap[t._id];
if (!i) {
i = [];
this._nodeListenersMap[t._id] = i;
}
i.push(e);
},
_dissociateNodeAndEventListener: function(t, e) {
var i = this._nodeListenersMap[t._id];
if (i) {
cc.js.array.remove(i, e);
0 === i.length && delete this._nodeListenersMap[t._id];
}
},
_dispatchEventToListeners: function(t, e, i) {
var n, r, s = !1, o = t.getFixedPriorityListeners(), a = t.getSceneGraphPriorityListeners(), c = 0;
if (o && 0 !== o.length) for (;c < t.gt0Index; ++c) if ((r = o[c]).isEnabled() && !r._isPaused() && r._isRegistered() && e(r, i)) {
s = !0;
break;
}
if (a && !s) for (n = 0; n < a.length; n++) if ((r = a[n]).isEnabled() && !r._isPaused() && r._isRegistered() && e(r, i)) {
s = !0;
break;
}
if (o && !s) for (;c < o.length; ++c) if ((r = o[c]).isEnabled() && !r._isPaused() && r._isRegistered() && e(r, i)) {
s = !0;
break;
}
},
_setDirty: function(t, e) {
var i = this._priorityDirtyFlagMap;
null == i[t] ? i[t] = e : i[t] = e | i[t];
},
_sortNumberAsc: function(t, e) {
return t - e;
},
hasEventListener: function(t) {
return !!this._getListeners(t);
},
addListener: function(t, e) {
cc.assertID(t && e, 3503);
if (cc.js.isNumber(e) || e instanceof cc._BaseNode) {
if (t instanceof cc.EventListener) {
if (t._isRegistered()) {
cc.logID(3505);
return;
}
} else {
cc.assertID(!cc.js.isNumber(e), 3504);
t = cc.EventListener.create(t);
}
if (t.checkAvailable()) {
if (cc.js.isNumber(e)) {
if (0 === e) {
cc.logID(3500);
return;
}
t._setSceneGraphPriority(null);
t._setFixedPriority(e);
t._setRegistered(!0);
t._setPaused(!1);
this._addListener(t);
} else {
t._setSceneGraphPriority(e);
t._setFixedPriority(0);
t._setRegistered(!0);
this._addListener(t);
}
return t;
}
} else cc.warnID(3506);
},
addCustomListener: function(t, e) {
var i = new cc.EventListener.create({
event: cc.EventListener.CUSTOM,
eventName: t,
callback: e
});
this.addListener(i, 1);
return i;
},
removeListener: function(t) {
if (null != t) {
var e, i = this._listenersMap;
for (var n in i) {
var r = i[n], s = r.getFixedPriorityListeners(), o = r.getSceneGraphPriorityListeners();
(e = this._removeListenerInVector(o, t)) ? this._setDirty(t._getListenerID(), this.DIRTY_SCENE_GRAPH_PRIORITY) : (e = this._removeListenerInVector(s, t)) && this._setDirty(t._getListenerID(), this.DIRTY_FIXED_PRIORITY);
if (r.empty()) {
delete this._priorityDirtyFlagMap[t._getListenerID()];
delete i[n];
}
if (e) break;
}
if (!e) for (var a = this._toAddedListeners, c = a.length - 1; c >= 0; c--) {
var l = a[c];
if (l === t) {
cc.js.array.removeAt(a, c);
l._setRegistered(!1);
break;
}
}
}
},
_removeListenerInCallback: function(t, e) {
if (null == t) return !1;
for (var i = t.length - 1; i >= 0; i--) {
var n = t[i];
if (n._onCustomEvent === e || n._onEvent === e) {
n._setRegistered(!1);
if (null != n._getSceneGraphPriority()) {
this._dissociateNodeAndEventListener(n._getSceneGraphPriority(), n);
n._setSceneGraphPriority(null);
}
0 === this._inDispatch ? cc.js.array.removeAt(t, i) : this._toRemovedListeners.push(n);
return !0;
}
}
return !1;
},
_removeListenerInVector: function(t, e) {
if (null == t) return !1;
for (var i = t.length - 1; i >= 0; i--) {
var n = t[i];
if (n === e) {
n._setRegistered(!1);
if (null != n._getSceneGraphPriority()) {
this._dissociateNodeAndEventListener(n._getSceneGraphPriority(), n);
n._setSceneGraphPriority(null);
}
0 === this._inDispatch ? cc.js.array.removeAt(t, i) : this._toRemovedListeners.push(n);
return !0;
}
}
return !1;
},
removeListeners: function(t, e) {
var i = this;
if (cc.js.isNumber(t) || t instanceof cc._BaseNode) if (void 0 !== t._id) {
var n, s = i._nodeListenersMap[t._id];
if (s) {
var o = cc.js.array.copy(s);
for (n = 0; n < o.length; n++) i.removeListener(o[n]);
delete i._nodeListenersMap[t._id];
}
var a = i._toAddedListeners;
for (n = 0; n < a.length; ) {
var c = a[n];
if (c._getSceneGraphPriority() === t) {
c._setSceneGraphPriority(null);
c._setRegistered(!1);
a.splice(n, 1);
} else ++n;
}
if (!0 === e) {
var l, u = t.getChildren();
for (n = 0, l = u.length; n < l; n++) i.removeListeners(u[n], !0);
}
} else t === cc.EventListener.TOUCH_ONE_BY_ONE ? i._removeListenersForListenerID(r.TOUCH_ONE_BY_ONE) : t === cc.EventListener.TOUCH_ALL_AT_ONCE ? i._removeListenersForListenerID(r.TOUCH_ALL_AT_ONCE) : t === cc.EventListener.MOUSE ? i._removeListenersForListenerID(r.MOUSE) : t === cc.EventListener.ACCELERATION ? i._removeListenersForListenerID(r.ACCELERATION) : t === cc.EventListener.KEYBOARD ? i._removeListenersForListenerID(r.KEYBOARD) : cc.logID(3501); else cc.warnID(3506);
},
removeCustomListeners: function(t) {
this._removeListenersForListenerID(t);
},
removeAllListeners: function() {
var t = this._listenersMap, e = this._internalCustomListenerIDs;
for (var i in t) -1 === e.indexOf(i) && this._removeListenersForListenerID(i);
},
setPriority: function(t, e) {
if (null != t) {
var i = this._listenersMap;
for (var n in i) {
var r = i[n].getFixedPriorityListeners();
if (r) {
if (-1 !== r.indexOf(t)) {
null != t._getSceneGraphPriority() && cc.logID(3502);
if (t._getFixedPriority() !== e) {
t._setFixedPriority(e);
this._setDirty(t._getListenerID(), this.DIRTY_FIXED_PRIORITY);
}
return;
}
}
}
}
},
setEnabled: function(t) {
this._isEnabled = t;
},
isEnabled: function() {
return this._isEnabled;
},
dispatchEvent: function(t) {
if (this._isEnabled) {
this._updateDirtyFlagForSceneGraph();
this._inDispatch++;
if (t && t.getType) if (t.getType().startsWith(cc.Event.TOUCH)) {
this._dispatchTouchEvent(t);
this._inDispatch--;
} else {
var e = o(t);
this._sortEventListeners(e);
var i = this._listenersMap[e];
if (null != i) {
this._dispatchEventToListeners(i, this._onListenerCallback, t);
this._onUpdateListeners(i);
}
this._inDispatch--;
} else cc.errorID(3511);
}
},
_onListenerCallback: function(t, e) {
e.currentTarget = t._target;
t._onEvent(e);
return e.isStopped();
},
dispatchCustomEvent: function(t, e) {
var i = new cc.Event.EventCustom(t);
i.setUserData(e);
this.dispatchEvent(i);
}
};
n.get(cc, "eventManager", (function() {
cc.warnID(1405, "cc.eventManager", "cc.EventTarget or cc.systemEvent");
return a;
}));
e.exports = a;
}), {
"../platform/js": 130,
"./CCEventListener": 72
} ],
74: [ (function(t, e, i) {
"use strict";
cc.Touch = function(t, e, i) {
this._lastModified = 0;
this.setTouchInfo(i, t, e);
};
cc.Touch.prototype = {
constructor: cc.Touch,
getLocation: function() {
return cc.v2(this._point.x, this._point.y);
},
getLocationX: function() {
return this._point.x;
},
getLocationY: function() {
return this._point.y;
},
getPreviousLocation: function() {
return cc.v2(this._prevPoint.x, this._prevPoint.y);
},
getStartLocation: function() {
return cc.v2(this._startPoint.x, this._startPoint.y);
},
getDelta: function() {
return this._point.sub(this._prevPoint);
},
getLocationInView: function() {
return cc.v2(this._point.x, cc.view._designResolutionSize.height - this._point.y);
},
getPreviousLocationInView: function() {
return cc.v2(this._prevPoint.x, cc.view._designResolutionSize.height - this._prevPoint.y);
},
getStartLocationInView: function() {
return cc.v2(this._startPoint.x, cc.view._designResolutionSize.height - this._startPoint.y);
},
getID: function() {
return this._id;
},
setTouchInfo: function(t, e, i) {
this._prevPoint = this._point;
this._point = cc.v2(e || 0, i || 0);
this._id = t;
if (!this._startPointCaptured) {
this._startPoint = cc.v2(this._point);
cc.view._convertPointWithScale(this._startPoint);
this._startPointCaptured = !0;
}
},
_setPoint: function(t, e) {
if (void 0 === e) {
this._point.x = t.x;
this._point.y = t.y;
} else {
this._point.x = t;
this._point.y = e;
}
},
_setPrevPoint: function(t, e) {
this._prevPoint = void 0 === e ? cc.v2(t.x, t.y) : cc.v2(t || 0, e || 0);
}
};
}), {} ],
75: [ (function(t, e, i) {
"use strict";
t("./CCEvent");
t("./CCTouch");
t("./CCEventListener");
var n = t("./CCEventManager");
e.exports = n;
0;
}), {
"./CCEvent": 71,
"./CCEventListener": 72,
"./CCEventManager": 73,
"./CCTouch": 74
} ],
76: [ (function(t, e, i) {
"use strict";
var n = cc.js, r = t("../platform/callbacks-invoker");
function s() {
r.call(this);
}
n.extend(s, r);
s.prototype.emit = function(t, e) {
var i = t.type, n = this._callbackTable[i];
if (n) {
var r = !n.isInvoking;
n.isInvoking = !0;
for (var s = n.callbackInfos, o = 0, a = s.length; o < a; ++o) {
var c = s[o];
if (c && c.callback) {
c.callback.call(c.target, t, e);
if (t._propagationImmediateStopped) break;
}
}
if (r) {
n.isInvoking = !1;
n.containCanceled && n.purgeCanceled();
}
}
};
e.exports = s;
0;
}), {
"../platform/callbacks-invoker": 123
} ],
77: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js"), r = t("../platform/callbacks-invoker"), s = n.array.fastRemove;
function o() {
r.call(this);
}
n.extend(o, r);
var a = o.prototype;
a.__on = a.on;
a.on = function(t, e, i, n) {
if (e) {
if (!this.hasEventListener(t, e, i)) {
this.__on(t, e, i, n);
i && i.__eventTargets && i.__eventTargets.push(this);
}
return e;
}
cc.errorID(6800);
};
a.__off = a.off;
a.off = function(t, e, i) {
if (e) {
this.__off(t, e, i);
i && i.__eventTargets && s(i.__eventTargets, this);
} else {
var n = this._callbackTable[t];
if (!n) return;
for (var r = n.callbackInfos, o = 0; o < r.length; ++o) {
var a = r[o] && r[o].target;
a && a.__eventTargets && s(a.__eventTargets, this);
}
this.removeAll(t);
}
};
a.targetOff = function(t) {
this.removeAll(t);
t && t.__eventTargets && s(t.__eventTargets, this);
};
a.once = function(t, e, i) {
this.on(t, e, i, !0);
};
a.dispatchEvent = function(t) {
this.emit(t.type, t);
};
cc.EventTarget = e.exports = o;
}), {
"../platform/callbacks-invoker": 123,
"../platform/js": 130
} ],
78: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js");
cc.Event = function(t, e) {
this.type = t;
this.bubbles = !!e;
this.target = null;
this.currentTarget = null;
this.eventPhase = 0;
this._propagationStopped = !1;
this._propagationImmediateStopped = !1;
};
cc.Event.prototype = {
constructor: cc.Event,
unuse: function() {
this.type = cc.Event.NO_TYPE;
this.target = null;
this.currentTarget = null;
this.eventPhase = cc.Event.NONE;
this._propagationStopped = !1;
this._propagationImmediateStopped = !1;
},
reuse: function(t, e) {
this.type = t;
this.bubbles = e || !1;
},
stopPropagation: function() {
this._propagationStopped = !0;
},
stopPropagationImmediate: function() {
this._propagationImmediateStopped = !0;
},
isStopped: function() {
return this._propagationStopped || this._propagationImmediateStopped;
},
getCurrentTarget: function() {
return this.currentTarget;
},
getType: function() {
return this.type;
}
};
cc.Event.NO_TYPE = "no_type";
cc.Event.TOUCH = "touch";
cc.Event.MOUSE = "mouse";
cc.Event.KEYBOARD = "keyboard";
cc.Event.ACCELERATION = "acceleration";
cc.Event.NONE = 0;
cc.Event.CAPTURING_PHASE = 1;
cc.Event.AT_TARGET = 2;
cc.Event.BUBBLING_PHASE = 3;
var r = function(t, e) {
cc.Event.call(this, t, e);
this.detail = null;
};
n.extend(r, cc.Event);
r.prototype.reset = r;
r.prototype.setUserData = function(t) {
this.detail = t;
};
r.prototype.getUserData = function() {
return this.detail;
};
r.prototype.getEventName = cc.Event.prototype.getType;
var s = new n.Pool(10);
r.put = function(t) {
s.put(t);
};
r.get = function(t, e) {
var i = s._get();
i ? i.reset(t, e) : i = new r(t, e);
return i;
};
cc.Event.EventCustom = r;
e.exports = cc.Event;
}), {
"../platform/js": 130
} ],
79: [ (function(t, e, i) {
"use strict";
t("./event");
t("./event-listeners");
t("./event-target");
t("./system-event");
}), {
"./event": 78,
"./event-listeners": 76,
"./event-target": 77,
"./system-event": 80
} ],
80: [ (function(t, e, i) {
"use strict";
var n = t("../event/event-target"), r = t("../event-manager"), s = t("../platform/CCInputManager"), o = cc.Enum({
KEY_DOWN: "keydown",
KEY_UP: "keyup",
DEVICEMOTION: "devicemotion"
}), a = null, c = null, l = cc.Class({
name: "SystemEvent",
extends: n,
statics: {
EventType: o
},
setAccelerometerEnabled: function(t) {
0;
t && window.DeviceMotionEvent && "function" == typeof DeviceMotionEvent.requestPermission ? DeviceMotionEvent.requestPermission().then((function(t) {
console.log("Device Motion Event request permission: " + t);
s.setAccelerometerEnabled("granted" === t);
})) : s.setAccelerometerEnabled(t);
},
setAccelerometerInterval: function(t) {
0;
s.setAccelerometerInterval(t);
},
on: function(t, e, i, n) {
0;
this._super(t, e, i, n);
if (t === o.KEY_DOWN || t === o.KEY_UP) {
a || (a = cc.EventListener.create({
event: cc.EventListener.KEYBOARD,
onKeyPressed: function(t, e) {
e.type = o.KEY_DOWN;
cc.systemEvent.dispatchEvent(e);
},
onKeyReleased: function(t, e) {
e.type = o.KEY_UP;
cc.systemEvent.dispatchEvent(e);
}
}));
r.hasEventListener(cc.EventListener.ListenerID.KEYBOARD) || r.addListener(a, 1);
}
if (t === o.DEVICEMOTION) {
c || (c = cc.EventListener.create({
event: cc.EventListener.ACCELERATION,
callback: function(t, e) {
e.type = o.DEVICEMOTION;
cc.systemEvent.dispatchEvent(e);
}
}));
r.hasEventListener(cc.EventListener.ListenerID.ACCELERATION) || r.addListener(c, 1);
}
},
off: function(t, e, i) {
0;
this._super(t, e, i);
if (a && (t === o.KEY_DOWN || t === o.KEY_UP)) {
var n = this.hasEventListener(o.KEY_DOWN), s = this.hasEventListener(o.KEY_UP);
n || s || r.removeListener(a);
}
c && t === o.DEVICEMOTION && r.removeListener(c);
}
});
cc.SystemEvent = e.exports = l;
cc.systemEvent = new cc.SystemEvent();
}), {
"../event-manager": 75,
"../event/event-target": 77,
"../platform/CCInputManager": 114
} ],
81: [ (function(t, e, i) {
"use strict";
var n = cc.vmath.vec3, r = cc.vmath.mat3, s = n.create(), o = n.create(), a = r.create(), c = function(t, e, i) {
var r = a.m, s = i.m;
r[0] = Math.abs(s[0]);
r[1] = Math.abs(s[1]);
r[2] = Math.abs(s[2]);
r[3] = Math.abs(s[4]);
r[4] = Math.abs(s[5]);
r[5] = Math.abs(s[6]);
r[6] = Math.abs(s[8]);
r[7] = Math.abs(s[9]);
r[8] = Math.abs(s[10]);
n.transformMat3(t, e, a);
};
function l(t, e, i, n, r, s) {
this.center = cc.v3(t, e, i);
this.halfExtents = cc.v3(n, r, s);
}
var u = l.prototype;
u.getBoundary = function(t, e) {
n.sub(t, this.center, this.halfExtents);
n.add(e, this.center, this.halfExtents);
};
u.transform = function(t, e, i, r, s) {
s || (s = this);
n.transformMat4(s.center, this.center, t);
c(s.halfExtents, this.halfExtents, t);
};
l.create = function(t, e, i, n, r, s) {
return new l(t, e, i, n, r, s);
};
l.clone = function(t) {
return new l(t.center.x, t.center.y, t.center.z, t.halfExtents.x, t.halfExtents.y, t.halfExtents.z);
};
l.copy = function(t, e) {
n.copy(t.center, e.center);
n.copy(t.halfExtents, e.halfExtents);
return t;
};
l.fromPoints = function(t, e, i) {
n.scale(t.center, n.add(s, e, i), .5);
n.scale(t.halfExtents, n.sub(o, i, e), .5);
return t;
};
l.set = function(t, e, i, r, s, o, a) {
n.set(t.center, e, i, r);
n.set(t.halfExtents, s, o, a);
return t;
};
e.exports = l;
}), {} ],
82: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
cc.geomUtils = {
Triangle: t("./triangle"),
Aabb: t("./aabb"),
Ray: t("./ray"),
intersect: t("./intersect")
};
i.default = cc.geomUtils;
e.exports = i.default;
}), {
"./aabb": 81,
"./intersect": 83,
"./ray": 84,
"./triangle": 85
} ],
83: [ (function(t, e, i) {
"use strict";
var n = s(t("../../renderer/gfx")), r = s(t("../../renderer/memop/recycle-pool"));
function s(t) {
return t && t.__esModule ? t : {
default: t
};
}
var o = t("./aabb"), a = t("./ray"), c = t("./triangle"), l = cc.vmath.mat4, u = cc.vmath.vec3, h = {};
h.rayAabb = (function() {
var t = u.create(), e = u.create();
return function(i, n) {
var r = i.o, s = i.d, o = 1 / s.x, a = 1 / s.y, c = 1 / s.z;
u.sub(t, n.center, n.halfExtents);
u.add(e, n.center, n.halfExtents);
var l = (t.x - r.x) * o, h = (e.x - r.x) * o, f = (t.y - r.y) * a, d = (e.y - r.y) * a, _ = (t.z - r.z) * c, p = (e.z - r.z) * c, v = Math.max(Math.max(Math.min(l, h), Math.min(f, d)), Math.min(_, p)), g = Math.min(Math.min(Math.max(l, h), Math.max(f, d)), Math.max(_, p));
return g < 0 || v > g ? 0 : v;
};
})();
h.rayTriangle = (function() {
var t = u.create(0, 0, 0), e = u.create(0, 0, 0), i = u.create(0, 0, 0), n = u.create(0, 0, 0), r = u.create(0, 0, 0);
return function(s, o) {
u.sub(t, o.b, o.a);
u.sub(e, o.c, o.a);
u.cross(i, s.d, e);
var a = u.dot(t, i);
if (a <= 0) return 0;
u.sub(n, s.o, o.a);
var c = u.dot(n, i);
if (c < 0 || c > a) return 0;
u.cross(r, n, t);
var l = u.dot(s.d, r);
if (l < 0 || c + l > a) return 0;
var h = u.dot(e, r) / a;
return h < 0 ? 0 : h;
};
})();
h.rayMesh = (function() {
var t = c.create(), e = Infinity, i = {
5120: "getInt8",
5121: "getUint8",
5122: "getInt16",
5123: "getUint16",
5124: "getInt32",
5125: "getUint32",
5126: "getFloat32"
}, r = (function() {
var t = new ArrayBuffer(2);
new DataView(t).setInt16(0, 256, !0);
return 256 === new Int16Array(t)[0];
})();
function s(t, e, i, n, s) {
u.set(t, e[i](s, r), e[i](s += n, r), e[i](s += n, r));
}
return function(r, o) {
e = Infinity;
for (var a = o._subMeshes, c = 0; c < a.length; c++) if (a[c]._primitiveType === n.default.PT_TRIANGLES) for (var l = o._subDatas[c] || o._subDatas[0], u = l.vData, f = new DataView(u.buffer, u.byteOffset, u.byteLength), d = l.getIData(Uint16Array), _ = l.vfm.element(n.default.ATTR_POSITION), p = _.offset, v = _.stride, g = i[_.type], m = 0; m < d.length; m += 3) {
s(t.a, f, g, 4, d[m] * v + p);
s(t.b, f, g, 4, d[m + 1] * v + p);
s(t.c, f, g, 4, d[m + 2] * v + p);
var y = h.rayTriangle(r, t);
y > 0 && y < e && (e = y);
}
return e;
};
})();
h.raycast = (function() {
function t(e, i) {
for (var n = e.children, r = n.length - 1; r >= 0; r--) {
t(n[r], i);
}
i(e);
}
function e(t, e) {
return t.distance - e.distance;
}
function i(t, e, i) {
var n = i.m, r = e.x, s = e.y, o = e.z, a = n[3] * r + n[7] * s + n[11] * o;
a = a ? 1 / a : 1;
t.x = (n[0] * r + n[4] * s + n[8] * o) * a;
t.y = (n[1] * r + n[5] * s + n[9] * o) * a;
t.z = (n[2] * r + n[6] * s + n[10] * o) * a;
return t;
}
var n = new r.default(function() {
return {
distance: 0,
node: null
};
}, 1), s = [], c = o.create(), f = u.create(), d = u.create(), _ = a.create(), p = l.create(), v = l.create(), g = u.create();
function m(t) {
return t > 0 && t < Infinity;
}
return function(r, a, y, E) {
n.reset();
s.length = 0;
t(r = r || cc.director.getScene(), (function(t) {
if (!E || E(t)) {
l.invert(v, t.getWorldMatrix(p));
u.transformMat4(_.o, a.o, v);
u.normalize(_.d, i(_.d, a.d, v));
var e = Infinity, r = t._renderComponent;
if (r instanceof cc.MeshRenderer) e = h.rayAabb(_, r._boundingBox); else if (t.width && t.height) {
u.set(f, -t.width * t.anchorX, -t.height * t.anchorY, t.z);
u.set(d, t.width * (1 - t.anchorX), t.height * (1 - t.anchorY), t.z);
o.fromPoints(c, f, d);
e = h.rayAabb(_, c);
}
if (m(e)) {
y && (e = y(_, t, e));
if (m(e)) {
u.scale(g, _.d, e);
i(g, g, p);
var C = n.add();
C.node = t;
C.distance = cc.vmath.vec3.mag(g);
s.push(C);
}
}
}
}));
s.sort(e);
return s;
};
})();
e.exports = h;
}), {
"../../renderer/gfx": 234,
"../../renderer/memop/recycle-pool": 235,
"./aabb": 81,
"./ray": 84,
"./triangle": 85
} ],
84: [ (function(t, e, i) {
"use strict";
var n = cc.vmath.vec3;
function r(t, e, i, n, r, s) {
this.o = cc.v3(t, e, i);
this.d = cc.v3(n, r, s);
}
r.create = function(t, e, i, n, s, o) {
return new r(t, e, i, n, s, o);
};
r.clone = function(t) {
return new r(t.o.x, t.o.y, t.o.z, t.d.x, t.d.y, t.d.z);
};
r.copy = function(t, e) {
t.o.x = e.o.x;
t.o.y = e.o.y;
t.o.z = e.o.z;
t.d.x = e.d.x;
t.d.y = e.d.y;
t.d.z = e.d.z;
return t;
};
r.set = function(t, e, i, n, r, s, o) {
t.o.x = e;
t.o.y = i;
t.o.z = n;
t.d.x = r;
t.d.y = s;
t.d.z = o;
return t;
};
r.fromPoints = function(t, e, i) {
n.copy(t.o, e);
n.normalize(t.d, n.sub(t.d, i, e));
return t;
};
e.exports = r;
}), {} ],
85: [ (function(t, e, i) {
"use strict";
var n = cc.vmath.vec3;
function r(t, e, i, n, r, s, o, a, c) {
this.a = cc.v3(t, e, i);
this.b = cc.v3(n, r, s);
this.c = cc.v3(o, a, c);
}
r.create = function(t, e, i, n, s, o, a, c, l) {
return new r(t, e, i, n, s, o, a, c, l);
};
r.clone = function(t) {
return new r(t.a.x, t.a.y, t.a.z, t.b.x, t.b.y, t.b.z, t.c.x, t.c.y, t.c.z);
};
r.copy = function(t, e) {
n.copy(t.a, e.a);
n.copy(t.b, e.b);
n.copy(t.c, e.c);
return t;
};
r.fromPoints = function(t, e, i, r) {
n.copy(t.a, e);
n.copy(t.b, i);
n.copy(t.c, r);
return t;
};
r.set = function(t, e, i, n, r, s, o, a, c, l) {
t.a.x = e;
t.a.y = i;
t.a.z = n;
t.b.x = r;
t.b.y = s;
t.b.z = o;
t.c.x = a;
t.c.y = c;
t.c.z = l;
return t;
};
e.exports = r;
}), {} ],
86: [ (function(t, e, i) {
"use strict";
t("./graphics");
}), {
"./graphics": void 0
} ],
87: [ (function(t, e, i) {
"use strict";
t("./platform");
t("./assets");
t("./CCNode");
t("./CCPrivateNode");
t("./CCScene");
t("./components");
t("./graphics");
t("./collider");
t("./collider/CCIntersection");
t("./physics");
t("./camera/CCCamera");
t("./geom-utils");
t("./mesh");
t("./3d");
t("./3d/polyfill-3d");
t("./base-ui/CCWidgetManager");
}), {
"./3d": void 0,
"./3d/polyfill-3d": 3,
"./CCNode": 7,
"./CCPrivateNode": 8,
"./CCScene": 9,
"./assets": 29,
"./base-ui/CCWidgetManager": 33,
"./camera/CCCamera": 34,
"./collider": 42,
"./collider/CCIntersection": 40,
"./components": 69,
"./geom-utils": 82,
"./graphics": 86,
"./mesh": void 0,
"./physics": void 0,
"./platform": 127
} ],
88: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js"), r = t("./pipeline"), s = t("./loading-items"), o = t("./asset-loader"), a = t("./downloader"), c = t("./loader"), l = t("./asset-table"), u = t("../platform/utils").callInNextTick, h = t("./auto-release-utils"), f = Object.create(null);
f.assets = new l();
f.internal = new l();
var d = {
url: null,
raw: !1
};
function _(t) {
var e, i, n;
if ("object" == typeof t) {
i = t;
if (t.url) return i;
e = t.uuid;
} else {
i = {};
e = t;
}
n = i.type ? "uuid" === i.type : cc.AssetLibrary._uuidInSettings(e);
cc.AssetLibrary._getAssetInfoInRuntime(e, d);
i.url = n ? d.url : e;
if (d.url && "uuid" === i.type && d.raw) {
i.type = null;
i.isRawAsset = !0;
} else n || (i.isRawAsset = !0);
return i;
}
var p = [], v = [];
function g() {
var t = new o(), e = new a(), i = new c();
r.call(this, [ t, e, i ]);
this.assetLoader = t;
this.md5Pipe = null;
this.downloader = e;
this.loader = i;
this.onProgress = null;
this._autoReleaseSetting = n.createMap(!0);
0;
}
n.extend(g, r);
var m = g.prototype;
m.init = function(t) {};
m.getXMLHttpRequest = function() {
return window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("MSXML2.XMLHTTP");
};
m.addDownloadHandlers = function(t) {
this.downloader.addHandlers(t);
};
m.addLoadHandlers = function(t) {
this.loader.addHandlers(t);
};
m.load = function(t, e, i) {
0;
if (void 0 === i) {
i = e;
e = this.onProgress || null;
}
var n, r = this, o = !1;
if (!(t instanceof Array)) if (t) {
o = !0;
t = [ t ];
} else t = [];
p.length = 0;
for (var a = 0; a < t.length; ++a) {
var c = t[a];
if (c && c.id) {
cc.warnID(4920, c.id);
c.uuid || c.url || (c.url = c.id);
}
if ((n = _(c)).url || n.uuid) {
var l = this._cache[n.url];
p.push(l || n);
}
}
var h = s.create(this, e, (function(t, e) {
u((function() {
if (i) {
if (o) {
var s = n.url;
i.call(r, t, e.getContent(s));
} else i.call(r, t, e);
i = null;
}
e.destroy();
}));
}));
s.initQueueDeps(h);
h.append(p);
p.length = 0;
};
m.flowInDeps = function(t, e, i) {
v.length = 0;
for (var n = 0; n < e.length; ++n) {
var r = _(e[n]);
if (r.url || r.uuid) {
var o = this._cache[r.url];
o ? v.push(o) : v.push(r);
}
}
var a = s.create(this, t ? function(t, e, i) {
this._ownerQueue && this._ownerQueue.onProgress && this._ownerQueue._childOnProgress(i);
} : null, (function(e, n) {
i(e, n);
t && t.deps && (t.deps.length = 0);
n.destroy();
}));
if (t) {
var c = s.getQueue(t);
a._ownerQueue = c._ownerQueue || c;
}
var l = a.append(v, t);
v.length = 0;
return l;
};
m._assetTables = f;
m._getResUuid = function(t, e, i, n) {
var r = f[i = i || "assets"];
if (!t || !r) return null;
var s = t.indexOf("?");
-1 !== s && (t = t.substr(0, s));
var o = r.getUuid(t, e);
if (!o) {
var a = cc.path.extname(t);
if (a) {
t = t.slice(0, -a.length);
(o = r.getUuid(t, e)) && !n && cc.warnID(4901, t, a);
}
}
return o;
};
m._getReferenceKey = function(t) {
var e;
"object" == typeof t ? e = t._uuid || null : "string" == typeof t && (e = this._getResUuid(t, null, null, !0) || t);
if (!e) {
cc.warnID(4800, t);
return e;
}
cc.AssetLibrary._getAssetInfoInRuntime(e, d);
return this._cache[d.url] ? d.url : e;
};
m._urlNotFound = function(t, e, i) {
u((function() {
t = cc.url.normalize(t);
var r = (e ? n.getClassName(e) : "Asset") + ' in "resources/' + t + '" does not exist.';
i && i(new Error(r), []);
}));
};
m._parseLoadResArgs = function(t, e, i) {
if (void 0 === i) {
var r = t instanceof Array || n.isChildClassOf(t, cc.RawAsset);
if (e) {
i = e;
r && (e = this.onProgress || null);
} else if (void 0 === e && !r) {
i = t;
e = this.onProgress || null;
t = null;
}
if (void 0 !== e && !r) {
e = t;
t = null;
}
}
return {
type: t,
onProgress: e,
onComplete: i
};
};
m.loadRes = function(t, e, i, n, r) {
if (5 !== arguments.length) {
r = n;
n = i;
i = "assets";
}
var s = this._parseLoadResArgs(e, n, r);
e = s.type;
n = s.onProgress;
r = s.onComplete;
var o = this, a = o._getResUuid(t, e, i);
a ? this.load({
type: "uuid",
uuid: a
}, n, (function(t, e) {
e && o.setAutoReleaseRecursively(a, !1);
r && r(t, e);
})) : o._urlNotFound(t, e, r);
};
m._loadResUuids = function(t, e, i, n) {
if (t.length > 0) {
var r = this, s = t.map((function(t) {
return {
type: "uuid",
uuid: t
};
}));
this.load(s, e, (function(t, e) {
if (i) {
for (var o = [], a = n && [], c = 0; c < s.length; ++c) {
var l = s[c].uuid, u = this._getReferenceKey(l), h = e.getContent(u);
if (h) {
r.setAutoReleaseRecursively(l, !1);
o.push(h);
a && a.push(n[c]);
}
}
n ? i(t, o, a) : i(t, o);
}
}));
} else i && u((function() {
n ? i(null, [], []) : i(null, []);
}));
};
m.loadResArray = function(t, e, i, n, r) {
if (5 !== arguments.length) {
r = n;
n = i;
i = "assets";
}
var s = this._parseLoadResArgs(e, n, r);
e = s.type;
n = s.onProgress;
r = s.onComplete;
for (var o = [], a = e instanceof Array, c = 0; c < t.length; c++) {
var l = t[c], u = a ? e[c] : e, h = this._getResUuid(l, u, i);
if (!h) {
this._urlNotFound(l, u, r);
return;
}
o.push(h);
}
this._loadResUuids(o, n, r);
};
m.loadResDir = function(t, e, i, n, r) {
if (5 !== arguments.length) {
r = n;
n = i;
i = "assets";
}
if (f[i]) {
var s = this._parseLoadResArgs(e, n, r);
e = s.type;
n = s.onProgress;
r = s.onComplete;
var o = [], a = f[i].getUuidArray(t, e, o);
this._loadResUuids(a, n, r, o);
}
};
m.getRes = function(t, e) {
var i = this._cache[t];
if (!i) {
var n = this._getResUuid(t, e, null, !0);
if (!n) return null;
var r = this._getReferenceKey(n);
i = this._cache[r];
}
i && i.alias && (i = i.alias);
return i && i.complete ? i.content : null;
};
m.getResCount = function() {
return Object.keys(this._cache).length;
};
m.getDependsRecursively = function(t) {
if (t) {
var e = this._getReferenceKey(t), i = h.getDependsRecursively(e);
i.push(e);
return i;
}
return [];
};
m.release = function(t) {
if (Array.isArray(t)) for (var e = 0; e < t.length; e++) {
var i = t[e];
this.release(i);
} else if (t) {
var n = this._getReferenceKey(t);
if (n && n in cc.AssetLibrary.getBuiltinDeps()) return;
var r = this.getItem(n);
if (r) {
this.removeItem(n);
t = r.content;
0;
}
if (t instanceof cc.Asset) {
var s = t.nativeUrl;
s && this.release(s);
t.destroy();
}
}
};
m.releaseAsset = function(t) {
var e = t._uuid;
e && this.release(e);
};
m.releaseRes = function(t, e, i) {
var n = this._getResUuid(t, e, i);
n ? this.release(n) : cc.errorID(4914, t);
};
m.releaseResDir = function(t, e, i) {
if (f[i = i || "assets"]) for (var n = f[i].getUuidArray(t, e), r = 0; r < n.length; r++) {
var s = n[r];
this.release(s);
}
};
m.releaseAll = function() {
for (var t in this._cache) this.release(t);
};
m.removeItem = function(t) {
var e = r.prototype.removeItem.call(this, t);
delete this._autoReleaseSetting[t];
return e;
};
m.setAutoRelease = function(t, e) {
var i = this._getReferenceKey(t);
i && (this._autoReleaseSetting[i] = !!e);
};
m.setAutoReleaseRecursively = function(t, e) {
e = !!e;
var i = this._getReferenceKey(t);
if (i) {
this._autoReleaseSetting[i] = e;
for (var n = h.getDependsRecursively(i), r = 0; r < n.length; r++) {
var s = n[r];
this._autoReleaseSetting[s] = e;
}
} else 0;
};
m.isAutoRelease = function(t) {
var e = this._getReferenceKey(t);
return !!e && !!this._autoReleaseSetting[e];
};
cc.loader = new g();
0;
e.exports = cc.loader;
}), {
"../platform/js": 130,
"../platform/utils": 134,
"./asset-loader": 89,
"./asset-table": 90,
"./auto-release-utils": 92,
"./downloader": 94,
"./loader": 97,
"./loading-items": 98,
"./pipeline": 101,
"./released-asset-checker": 102
} ],
89: [ (function(t, e, i) {
"use strict";
t("../utils/CCPath");
var n = t("../CCDebug"), r = t("./pipeline"), s = t("./loading-items"), o = "AssetLoader", a = function(t) {
this.id = o;
this.async = !0;
this.pipeline = null;
};
a.ID = o;
var c = [];
a.prototype.handle = function(t, e) {
var i = t.uuid;
if (!i) return t.content || null;
cc.AssetLibrary.queryAssetInfo(i, (function(r, o, a) {
if (r) e(r); else {
t.url = t.rawUrl = o;
t.isRawAsset = a;
if (a) {
var l = cc.path.extname(o).toLowerCase();
if (!l) {
e(new Error(n.getError(4931, i, o)));
return;
}
l = l.substr(1);
var u = s.getQueue(t);
c[0] = {
queueId: t.queueId,
id: o,
url: o,
type: l,
error: null,
alias: t,
complete: !0
};
0;
u.append(c);
t.type = l;
e(null, t.content);
} else {
t.type = "uuid";
e(null, t.content);
}
}
}));
};
r.AssetLoader = e.exports = a;
}), {
"../CCDebug": 4,
"../utils/CCPath": 179,
"./loading-items": 98,
"./pipeline": 101
} ],
90: [ (function(t, e, i) {
"use strict";
var n = t("../utils/misc").pushToMap, r = t("../platform/js");
function s(t, e) {
this.uuid = t;
this.type = e;
}
function o() {
this._pathToUuid = r.createMap(!0);
}
function a(t, e) {
if (t.length > e.length) {
var i = t.charCodeAt(e.length);
return 46 === i || 47 === i;
}
return !0;
}
var c = o.prototype;
c.getUuid = function(t, e) {
t = cc.url.normalize(t);
var i = this._pathToUuid[t];
if (i) if (Array.isArray(i)) {
if (!e) return i[0].uuid;
for (var n = 0; n < i.length; n++) {
var s = i[n];
if (r.isChildClassOf(s.type, e)) return s.uuid;
}
} else {
if (!e || r.isChildClassOf(i.type, e)) return i.uuid;
0;
}
return "";
};
c.getUuidArray = function(t, e, i) {
"/" === (t = cc.url.normalize(t))[t.length - 1] && (t = t.slice(0, -1));
var n = this._pathToUuid, s = [], o = r.isChildClassOf;
for (var c in n) if (c.startsWith(t) && a(c, t) || !t) {
var l = n[c];
if (Array.isArray(l)) for (var u = 0; u < l.length; u++) {
var h = l[u];
if (!e || o(h.type, e)) {
s.push(h.uuid);
i && i.push(c);
} else 0;
} else if (!e || o(l.type, e)) {
s.push(l.uuid);
i && i.push(c);
} else 0;
}
0;
return s;
};
c.add = function(t, e, i, r) {
t = t.substring(0, t.length - cc.path.extname(t).length);
var o = new s(e, i);
n(this._pathToUuid, t, o, r);
};
c._getInfo_DEBUG = !1;
c.reset = function() {
this._pathToUuid = r.createMap(!0);
};
e.exports = o;
}), {
"../platform/js": 130,
"../utils/misc": 187
} ],
91: [ (function(t, e, i) {
"use strict";
var n = t("../platform/CCSys"), r = t("../CCDebug"), s = n.__audioSupport, o = s.format, a = s.context;
function c(t, e) {
var i = document.createElement("audio");
i.src = t.url;
var n = function() {
clearTimeout(r);
i.removeEventListener("canplaythrough", o, !1);
i.removeEventListener("error", a, !1);
s.USE_LOADER_EVENT && i.removeEventListener(s.USE_LOADER_EVENT, o, !1);
}, r = setTimeout((function() {
0 === i.readyState ? a() : o();
}), 8e3), o = function() {
n();
e(null, i);
}, a = function() {
n();
var i = "load audio failure - " + t.url;
cc.log(i);
e(i);
};
i.addEventListener("canplaythrough", o, !1);
i.addEventListener("error", a, !1);
s.USE_LOADER_EVENT && i.addEventListener(s.USE_LOADER_EVENT, o, !1);
}
function l(t, e) {
a || e(new Error(r.getError(4926)));
var i = cc.loader.getXMLHttpRequest();
i.open("GET", t.url, !0);
i.responseType = "arraybuffer";
i.onload = function() {
a.decodeAudioData(i.response, (function(t) {
e(null, t);
}), (function() {
e("decode error - " + t.id, null);
}));
};
i.onerror = function() {
e("request error - " + t.id, null);
};
i.send();
}
e.exports = function(t, e) {
if (0 === o.length) return new Error(r.getError(4927));
var i;
i = s.WEB_AUDIO ? t._owner instanceof cc.AudioClip ? t._owner.loadMode === cc.AudioClip.LoadMode.WEB_AUDIO ? l : c : t.urlParam && t.urlParam.useDom ? c : l : c;
i(t, e);
};
}), {
"../CCDebug": 4,
"../platform/CCSys": 119
} ],
92: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js");
function r(t, e) {
var i = cc.loader.getItem(t);
if (i) {
var n = i.dependKeys;
if (n) for (var s = 0; s < n.length; s++) {
var o = n[s];
if (!e[o]) {
e[o] = !0;
r(o, e);
}
}
}
}
function s(t, e) {
if (t._uuid) {
var i = cc.loader._getReferenceKey(t);
if (!e[i]) {
e[i] = !0;
r(i, e);
}
}
}
function o(t, e) {
for (var i = Object.getOwnPropertyNames(t), n = 0; n < i.length; n++) {
var r = t[i[n]];
if ("object" == typeof r && r) if (Array.isArray(r)) for (var o = 0; o < r.length; o++) {
var a = r[o];
a instanceof cc.RawAsset && s(a, e);
} else if (r.constructor && r.constructor !== Object) r instanceof cc.RawAsset && s(r, e); else for (var c = Object.getOwnPropertyNames(r), l = 0; l < c.length; l++) {
var u = r[c[l]];
u instanceof cc.RawAsset && s(u, e);
}
}
}
function a(t, e) {
for (var i = 0; i < t._components.length; i++) o(t._components[i], e);
for (var n = 0; n < t._children.length; n++) a(t._children[n], e);
}
e.exports = {
autoRelease: function(t, e, i) {
var r = cc.loader._autoReleaseSetting, s = n.createMap();
if (e) for (var o = 0; o < e.length; o++) s[e[o]] = !0;
for (var c = 0; c < i.length; c++) a(i[c], s);
if (t) for (var l = 0; l < t.length; l++) {
var u = t[l];
!1 === r[u] || s[u] || cc.loader.release(u);
}
for (var h = Object.keys(r), f = 0; f < h.length; f++) {
var d = h[f];
!0 !== r[d] || s[d] || cc.loader.release(d);
}
},
getDependsRecursively: function(t) {
var e = {};
r(t, e);
return Object.keys(e);
}
};
}), {
"../platform/js": 130
} ],
93: [ (function(t, e, i) {
"use strict";
e.exports = function(t, e) {
var i = t.url, n = cc.loader.getXMLHttpRequest(), r = "Load binary data failed: " + i;
n.open("GET", i, !0);
n.responseType = "arraybuffer";
n.onload = function() {
var t = n.response;
if (t) {
var i = new Uint8Array(t);
e(null, i);
} else e({
status: n.status,
errorMessage: r + "(no response)"
});
};
n.onerror = function() {
e({
status: n.status,
errorMessage: r + "(error)"
});
};
n.ontimeout = function() {
e({
status: n.status,
errorMessage: r + "(time out)"
});
};
n.send(null);
};
}), {} ],
94: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js"), r = t("../CCDebug");
t("../utils/CCPath");
var s, o = t("./pipeline"), a = t("./pack-downloader"), c = t("./binary-downloader"), l = t("./text-downloader"), u = t("./utils").urlAppendTimestamp;
function h() {
return null;
}
function f(t, e, i) {
var n = t.url, s = document, o = document.createElement("script");
"file:" !== window.location.protocol && (o.crossOrigin = "anonymous");
o.async = i;
o.src = u(n);
function a() {
o.parentNode.removeChild(o);
o.removeEventListener("load", a, !1);
o.removeEventListener("error", c, !1);
e(null, n);
}
function c() {
o.parentNode.removeChild(o);
o.removeEventListener("load", a, !1);
o.removeEventListener("error", c, !1);
e(new Error(r.getError(4928, n)));
}
o.addEventListener("load", a, !1);
o.addEventListener("error", c, !1);
s.body.appendChild(o);
}
function d(t, e, i, n) {
void 0 === i && (i = !0);
var s = u(t.url);
n = n || new Image();
i && "file:" !== window.location.protocol ? n.crossOrigin = "anonymous" : n.crossOrigin = null;
if (n.complete && n.naturalWidth > 0 && n.src === s) return n;
var o = function i() {
n.removeEventListener("load", i);
n.removeEventListener("error", a);
n.id = t.id;
e(null, n);
}, a = function i() {
n.removeEventListener("load", o);
n.removeEventListener("error", i);
"https:" !== window.location.protocol && n.crossOrigin && "anonymous" === n.crossOrigin.toLowerCase() ? d(t, e, !1, n) : e(new Error(r.getError(4930, s)));
};
n.addEventListener("load", o);
n.addEventListener("error", a);
n.src = s;
}
var _ = {
js: f,
png: d,
jpg: d,
bmp: d,
jpeg: d,
gif: d,
ico: d,
tiff: d,
webp: d,
image: d,
pvr: c,
pkm: c,
mp3: s = t("./audio-downloader"),
ogg: s,
wav: s,
m4a: s,
txt: l,
xml: l,
vsh: l,
fsh: l,
atlas: l,
tmx: l,
tsx: l,
json: l,
ExportJson: l,
plist: l,
fnt: l,
font: h,
eot: h,
ttf: h,
woff: h,
svg: h,
ttc: h,
uuid: function(t, e) {
var i = a.load(t, e);
return void 0 === i ? this.extMap.json(t, e) : i || void 0;
},
binary: c,
bin: c,
dbbin: c,
default: l
}, p = "Downloader", v = function(t) {
this.id = p;
this.async = !0;
this.pipeline = null;
this._curConcurrent = 0;
this._loadQueue = [];
this._subpackages = {};
this.extMap = n.mixin(t, _);
};
v.ID = p;
v.PackDownloader = a;
v.prototype.addHandlers = function(t) {
n.mixin(this.extMap, t);
};
v.prototype._handleLoadQueue = function() {
for (;this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT; ) {
var t = this._loadQueue.shift();
if (!t) break;
var e = this.handle(t.item, t.callback);
void 0 !== e && (e instanceof Error ? t.callback(e) : t.callback(null, e));
}
};
v.prototype.handle = function(t, e) {
var i = this, n = this.extMap[t.type] || this.extMap.default, r = void 0;
if (this._curConcurrent < cc.macro.DOWNLOAD_MAX_CONCURRENT) {
this._curConcurrent++;
if (void 0 !== (r = n.call(this, t, (function(t, n) {
i._curConcurrent = Math.max(0, i._curConcurrent - 1);
i._handleLoadQueue();
e && e(t, n);
})))) {
this._curConcurrent = Math.max(0, this._curConcurrent - 1);
this._handleLoadQueue();
return r;
}
} else if (t.ignoreMaxConcurrency) {
if (void 0 !== (r = n.call(this, t, e))) return r;
} else this._loadQueue.push({
item: t,
callback: e
});
};
v.prototype.loadSubpackage = function(t, e) {
var i = this._subpackages[t];
i ? i.loaded ? e && e() : f({
url: i.path + "index.js"
}, (function(t) {
t || (i.loaded = !0);
e && e(t);
})) : e && e(new Error("Can't find subpackage " + t));
};
o.Downloader = e.exports = v;
}), {
"../CCDebug": 4,
"../platform/js": 130,
"../utils/CCPath": 179,
"./audio-downloader": 91,
"./binary-downloader": 93,
"./pack-downloader": 100,
"./pipeline": 101,
"./text-downloader": 104,
"./utils": 106
} ],
95: [ (function(t, e, i) {
"use strict";
var n = t("../utils/text-utils"), r = null, s = "BES bswy:->@123丁ぁᄁ", o = {}, a = -1, c = [], l = 3e3, u = (function() {
var t = void 0;
return function() {
if (void 0 === t) if (window.FontFace) {
var e = /Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent), i = /OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent) && /Apple/.exec(window.navigator.vendor);
t = e ? parseInt(e[1], 10) > 42 : !i;
} else t = !1;
return t;
};
})();
function h() {
for (var t = !0, e = Date.now(), i = c.length - 1; i >= 0; i--) {
var o = c[i], u = o.fontFamilyName;
if (e - o.startTime > l) {
cc.warnID(4933, u);
o.callback(null, u);
c.splice(i, 1);
} else {
var h = o.refWidth;
r.font = "40px " + u;
if (h !== n.safeMeasureText(r, s)) {
c.splice(i, 1);
o.callback(null, u);
} else t = !1;
}
}
if (t) {
clearInterval(a);
a = -1;
}
}
function f(t, e, i) {
var n = new Promise(function(i, n) {
(function r() {
Date.now() - t >= l ? n() : document.fonts.load("40px " + e).then((function(t) {
t.length >= 1 ? i() : setTimeout(r, 100);
}), (function() {
n();
}));
})();
}), r = null, s = new Promise(function(t, e) {
r = setTimeout(e, l);
});
Promise.race([ s, n ]).then((function() {
if (r) {
clearTimeout(r);
r = null;
}
i(null, e);
}), (function() {
cc.warnID(4933, e);
i(null, e);
}));
}
var d = {
loadFont: function(t, e) {
var i = t.url, l = d._getFontFamily(i);
if (o[l]) return l;
if (!r) {
var _ = document.createElement("canvas");
_.width = 100;
_.height = 100;
r = _.getContext("2d");
}
var p = "40px " + l;
r.font = p;
var v = n.safeMeasureText(r, s), g = document.createElement("style");
g.type = "text/css";
var m = "";
isNaN(l - 0) ? m += "@font-face { font-family:" + l + "; src:" : m += "@font-face { font-family:'" + l + "'; src:";
m += "url('" + i + "');";
g.textContent = m + "}";
document.body.appendChild(g);
var y = document.createElement("div"), E = y.style;
E.fontFamily = l;
y.innerHTML = ".";
E.position = "absolute";
E.left = "-100px";
E.top = "-100px";
document.body.appendChild(y);
if (u()) f(Date.now(), l, e); else {
var C = {
fontFamilyName: l,
refWidth: v,
callback: e,
startTime: Date.now()
};
c.push(C);
-1 === a && (a = setInterval(h, 100));
}
o[l] = g;
},
_getFontFamily: function(t) {
var e = t.lastIndexOf(".ttf");
if (-1 === e) return t;
var i, n = t.lastIndexOf("/");
-1 !== (i = -1 === n ? t.substring(0, e) + "_LABEL" : t.substring(n + 1, e) + "_LABEL").indexOf(" ") && (i = '"' + i + '"');
return i;
}
};
e.exports = d;
}), {
"../utils/text-utils": 194
} ],
96: [ (function(t, e, i) {
"use strict";
t("./downloader");
t("./loader");
t("./loading-items");
t("./pipeline");
t("./CCLoader");
}), {
"./CCLoader": 88,
"./downloader": 94,
"./loader": 97,
"./loading-items": 98,
"./pipeline": 101
} ],
97: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js"), r = t("../platform/CCSAXParser").plistParser, s = t("./pipeline"), o = t("../assets/CCTexture2D"), a = t("./uuid-loader"), c = t("./font-loader");
function l(t) {
if ("string" != typeof t.content) return new Error("JSON Loader: Input item doesn't contain string content");
try {
return JSON.parse(t.content);
} catch (e) {
return new Error("JSON Loader: Parse json [" + t.id + "] failed : " + e);
}
}
function u(t) {
if (t._owner instanceof cc.Asset) return null;
var e = t.content;
if (cc.sys.platform !== cc.sys.FB_PLAYABLE_ADS && !(e instanceof Image)) return new Error("Image Loader: Input item doesn't contain Image content");
var i = t.texture || new o();
i._uuid = t.uuid;
i.url = t.url;
i._setRawAsset(t.rawUrl, !1);
i._nativeAsset = e;
return i;
}
function h(t, e) {
if (t._owner instanceof cc.Asset) return null;
var i = new cc.AudioClip();
i._setRawAsset(t.rawUrl, !1);
i._nativeAsset = t.content;
i.url = t.url;
return i;
}
function f(t) {
return t.load ? t.load(t.content) : null;
}
var d = 13, _ = 55727696, p = 0, v = 6, g = 7, m = 12;
var y = 16, E = 6, C = 8, T = 10, A = 12, x = 14, b = 0, S = 1, R = 3;
function w(t, e) {
return t[e] << 8 | t[e + 1];
}
var L = {
png: u,
jpg: u,
bmp: u,
jpeg: u,
gif: u,
ico: u,
tiff: u,
webp: u,
image: u,
pvr: function(t) {
var e = t.content instanceof ArrayBuffer ? t.content : t.content.buffer, i = new Int32Array(e, 0, d);
if (i[p] != _) return new Error("Invalid magic number in PVR header");
var n = i[g], r = i[v], s = i[m] + 52;
return {
_data: new Uint8Array(e, s),
_compressed: !0,
width: n,
height: r
};
},
pkm: function(t) {
var e = t.content instanceof ArrayBuffer ? t.content : t.content.buffer, i = new Uint8Array(e), n = w(i, E);
if (n !== b && n !== S && n !== R) return new Error("Invalid magic number in ETC header");
var r = w(i, A), s = w(i, x);
w(i, C), w(i, T);
return {
_data: new Uint8Array(e, y),
_compressed: !0,
width: r,
height: s
};
},
mp3: h,
ogg: h,
wav: h,
m4a: h,
json: l,
ExportJson: l,
plist: function(t) {
if ("string" != typeof t.content) return new Error("Plist Loader: Input item doesn't contain string content");
var e = r.parse(t.content);
return e || new Error("Plist Loader: Parse [" + t.id + "] failed");
},
uuid: a,
prefab: a,
fire: a,
scene: a,
binary: f,
dbbin: f,
bin: f,
font: c.loadFont,
eot: c.loadFont,
ttf: c.loadFont,
woff: c.loadFont,
svg: c.loadFont,
ttc: c.loadFont,
default: function() {
return null;
}
}, O = function(t) {
this.id = "Loader";
this.async = !0;
this.pipeline = null;
this.extMap = n.mixin(t, L);
};
O.ID = "Loader";
O.prototype.addHandlers = function(t) {
this.extMap = n.mixin(this.extMap, t);
};
O.prototype.handle = function(t, e) {
return (this.extMap[t.type] || this.extMap.default).call(this, t, e);
};
s.Loader = e.exports = O;
}), {
"../assets/CCTexture2D": 28,
"../platform/CCSAXParser": 117,
"../platform/js": 130,
"./font-loader": 95,
"./pipeline": 101,
"./uuid-loader": 107
} ],
98: [ (function(t, e, i) {
"use strict";
var n = t("../platform/callbacks-invoker");
t("../utils/CCPath");
var r = t("../platform/js"), s = 0 | 998 * Math.random(), o = r.createMap(!0), a = [], c = {
WORKING: 1,
COMPLETE: 2,
ERROR: 3
}, l = r.createMap(!0);
function u(t) {
return "string" == typeof (t.url || t);
}
function h(t) {
if (t) {
var e = t.split("?");
if (e && e[0] && e[1]) {
var i = {};
e[1].split("&").forEach((function(t) {
var e = t.split("=");
i[e[0]] = e[1];
}));
return i;
}
}
}
function f(t, e) {
var i = "object" == typeof t ? t.url : t, n = {
queueId: e,
id: i,
url: i,
rawUrl: void 0,
urlParam: h(i),
type: "",
error: null,
content: null,
complete: !1,
states: {},
deps: null
};
if ("object" == typeof t) {
r.mixin(n, t);
if (t.skips) for (var s = 0; s < t.skips.length; s++) {
var o = t.skips[s];
n.states[o] = c.COMPLETE;
}
}
n.rawUrl = n.url;
i && !n.type && (n.type = cc.path.extname(i).toLowerCase().substr(1));
return n;
}
var d = [];
function _(t, e, i) {
if (!t || !e) return !1;
var n = !1;
d.push(e.id);
if (e.deps) {
var r, s, o = e.deps;
for (r = 0; r < o.length; r++) {
if ((s = o[r]).id === t.id) {
n = !0;
break;
}
if (!(d.indexOf(s.id) >= 0) && (s.deps && _(t, s, !0))) {
n = !0;
break;
}
}
}
i || (d.length = 0);
return n;
}
var p = function(t, e, i, a) {
n.call(this);
this._id = ++s;
o[this._id] = this;
this._pipeline = t;
this._errorUrls = r.createMap(!0);
this._appending = !1;
this._ownerQueue = null;
this.onProgress = i;
this.onComplete = a;
this.map = r.createMap(!0);
this.completed = {};
this.totalCount = 0;
this.completedCount = 0;
this._pipeline ? this.active = !0 : this.active = !1;
e && (e.length > 0 ? this.append(e) : this.allComplete());
};
p.ItemState = new cc.Enum(c);
p.create = function(t, e, i, n) {
if (void 0 === i) {
if ("function" == typeof e) {
n = e;
e = i = null;
}
} else if (void 0 === n) if ("function" == typeof e) {
n = i;
i = e;
e = null;
} else {
n = i;
i = null;
}
var r = a.pop();
if (r) {
r._pipeline = t;
r.onProgress = i;
r.onComplete = n;
o[r._id] = r;
r._pipeline && (r.active = !0);
e && r.append(e);
} else r = new p(t, e, i, n);
return r;
};
p.getQueue = function(t) {
return t.queueId ? o[t.queueId] : null;
};
p.itemComplete = function(t) {
var e = o[t.queueId];
e && e.itemComplete(t.id);
};
p.initQueueDeps = function(t) {
var e = l[t._id];
if (e) {
e.completed.length = 0;
e.deps.length = 0;
} else e = l[t._id] = {
completed: [],
deps: []
};
};
p.registerQueueDep = function(t, e) {
var i = t.queueId || t;
if (!i) return !1;
var n = l[i];
if (n) -1 === n.deps.indexOf(e) && n.deps.push(e); else if (t.id) for (var r in l) {
var s = l[r];
-1 !== s.deps.indexOf(t.id) && -1 === s.deps.indexOf(e) && s.deps.push(e);
}
};
p.finishDep = function(t) {
for (var e in l) {
var i = l[e];
-1 !== i.deps.indexOf(t) && -1 === i.completed.indexOf(t) && i.completed.push(t);
}
};
var v = p.prototype;
r.mixin(v, n.prototype);
v.append = function(t, e) {
if (!this.active) return [];
e && !e.deps && (e.deps = []);
this._appending = !0;
var i, n, r, s = [];
for (i = 0; i < t.length; ++i) if (!(n = t[i]).queueId || this.map[n.id]) {
if (u(n)) {
var a = (r = f(n, this._id)).id;
if (!this.map[a]) {
this.map[a] = r;
this.totalCount++;
e && e.deps.push(r);
p.registerQueueDep(e || this._id, a);
s.push(r);
}
}
} else {
this.map[n.id] = n;
e && e.deps.push(n);
if (n.complete || _(e, n)) {
this.totalCount++;
this.itemComplete(n.id);
continue;
}
var c = this, l = o[n.queueId];
if (l) {
this.totalCount++;
p.registerQueueDep(e || this._id, n.id);
l.addListener(n.id, (function(t) {
c.itemComplete(t.id);
}));
}
}
this._appending = !1;
this.completedCount === this.totalCount ? this.allComplete() : this._pipeline.flowIn(s);
return s;
};
v._childOnProgress = function(t) {
if (this.onProgress) {
var e = l[this._id];
this.onProgress(e ? e.completed.length : this.completedCount, e ? e.deps.length : this.totalCount, t);
}
};
v.allComplete = function() {
var t = r.isEmptyObject(this._errorUrls) ? null : this._errorUrls;
this.onComplete && this.onComplete(t, this);
};
v.isCompleted = function() {
return this.completedCount >= this.totalCount;
};
v.isItemCompleted = function(t) {
return !!this.completed[t];
};
v.exists = function(t) {
return !!this.map[t];
};
v.getContent = function(t) {
var e = this.map[t], i = null;
e && (e.content ? i = e.content : e.alias && (i = e.alias.content));
return i;
};
v.getError = function(t) {
var e = this.map[t], i = null;
e && (e.error ? i = e.error : e.alias && (i = e.alias.error));
return i;
};
v.addListener = n.prototype.on;
v.hasListener = n.prototype.hasEventListener;
v.removeListener = n.prototype.off;
v.removeAllListeners = n.prototype.removeAll;
v.removeItem = function(t) {
var e = this.map[t];
if (e && this.completed[e.alias || t]) {
delete this.completed[t];
delete this.map[t];
if (e.alias) {
delete this.completed[e.alias.id];
delete this.map[e.alias.id];
}
this.completedCount--;
this.totalCount--;
}
};
v.itemComplete = function(t) {
var e = this.map[t];
if (e) {
var i = t in this._errorUrls;
e.error instanceof Error || r.isString(e.error) ? this._errorUrls[t] = e.error : e.error ? r.mixin(this._errorUrls, e.error) : !e.error && i && delete this._errorUrls[t];
this.completed[t] = e;
this.completedCount++;
p.finishDep(e.id);
if (this.onProgress) {
var n = l[this._id];
this.onProgress(n ? n.completed.length : this.completedCount, n ? n.deps.length : this.totalCount, e);
}
this.emit(t, e);
this.removeAll(t);
!this._appending && this.completedCount >= this.totalCount && this.allComplete();
}
};
v.destroy = function() {
this.active = !1;
this._appending = !1;
this._pipeline = null;
this._ownerQueue = null;
r.clear(this._errorUrls);
this.onProgress = null;
this.onComplete = null;
this.map = r.createMap(!0);
this.completed = {};
this.totalCount = 0;
this.completedCount = 0;
n.call(this);
if (l[this._id]) {
l[this._id].completed.length = 0;
l[this._id].deps.length = 0;
}
delete o[this._id];
delete l[this._id];
-1 === a.indexOf(this) && a.length < 10 && a.push(this);
};
cc.LoadingItems = e.exports = p;
}), {
"../platform/callbacks-invoker": 123,
"../platform/js": 130,
"../utils/CCPath": 179
} ],
99: [ (function(t, e, i) {
"use strict";
var n = t("./pipeline"), r = "MD5Pipe", s = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/, o = function(t, e, i) {
this.id = r;
this.async = !1;
this.pipeline = null;
this.md5AssetsMap = t;
this.md5NativeAssetsMap = e;
this.libraryBase = i;
};
o.ID = r;
o.prototype.handle = function(t) {
t.url = this.transformURL(t.url);
return null;
};
o.prototype.transformURL = function(t) {
var e = !t.startsWith(this.libraryBase) ? this.md5NativeAssetsMap : this.md5AssetsMap;
return t = t.replace(s, (function(t, i) {
var n = e[i];
return n ? t + "." + n : t;
}));
};
n.MD5Pipe = e.exports = o;
}), {
"./pipeline": 101
} ],
100: [ (function(t, e, i) {
"use strict";
var n = t("./unpackers"), r = t("../utils/misc").pushToMap, s = {
Invalid: 0,
Removed: 1,
Downloading: 2,
Loaded: 3
};
function o() {
this.unpacker = null;
this.state = s.Invalid;
this.duration = 0;
}
var a = {}, c = {}, l = {}, u = [], h = null;
function f(t, e) {
return new Error("Can not retrieve " + t + " from packer " + e);
}
e.exports = {
msToRelease: 12e4,
initPacks: function(t) {
c = t;
a = {};
for (var e in t) for (var i = t[e], n = 0; n < i.length; n++) {
var s = i[n], o = 1 === i.length;
r(a, s, e, o);
}
},
_loadNewPack: function(t, e, i) {
var n = this, r = cc.AssetLibrary.getLibUrlNoExt(e) + ".json";
cc.loader.load({
url: r,
ignoreMaxConcurrency: !0
}, (function(s, o) {
if (s) {
cc.errorID(4916, t);
return i(s);
}
l[e].url = r;
var a = n._doLoadNewPack(t, e, o);
a ? i(null, a) : i(f(t, e));
}));
},
_doPreload: function(t, e) {
var i = l[t];
i || ((i = l[t] = new o()).state = s.Downloading);
if (i.state !== s.Loaded) {
i.unpacker = new n.JsonUnpacker();
i.unpacker.load(c[t], e);
i.state = s.Loaded;
}
},
_doLoadNewPack: function(t, e, i) {
var r = l[e];
if (r.state !== s.Loaded) {
"string" == typeof i && (i = JSON.parse(i));
Array.isArray(i) ? r.unpacker = new n.JsonUnpacker() : i.type === n.TextureUnpacker.ID && (r.unpacker = new n.TextureUnpacker());
r.unpacker.load(c[e], i);
r.state = s.Loaded;
r.duration = 0;
u.push(e);
var o = this;
h || (h = setInterval((function() {
for (var t = o.msToRelease / 5e3, e = u.length - 1; e >= 0; e--) {
var i = u[e];
++l[i].duration > t && o.release(i);
}
if (0 === u.length) {
clearInterval(h);
h = null;
}
}), 5e3));
}
return r.unpacker.retrieve(t);
},
_selectLoadedPack: function(t) {
for (var e = s.Invalid, i = "", n = 0; n < t.length; n++) {
var r = t[n], o = l[r];
if (o) {
var a = o.state;
if (a === s.Loaded) return r;
if (a > e) {
e = a;
i = r;
}
}
}
return e !== s.Invalid ? i : t[0];
},
load: function(t, e) {
var i = t.uuid, n = a[i];
if (n) {
Array.isArray(n) && (n = this._selectLoadedPack(n));
var r = l[n];
if (r && r.state === s.Loaded) {
r.duration = 0;
var c = r.unpacker.retrieve(i);
return c || f(i, n);
}
if (!r) {
console.log("Create unpacker %s for %s", n, i);
(r = l[n] = new o()).state = s.Downloading;
}
this._loadNewPack(i, n, e);
return null;
}
},
release: function(t) {
var e = l[t];
if (e) {
cc.loader.release(e.url);
delete l[t];
cc.js.array.fastRemove(u, t);
}
}
};
0;
}), {
"../utils/misc": 187,
"./unpackers": 105
} ],
101: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js"), r = t("./loading-items"), s = r.ItemState;
function o(t, e) {
var i = t.id, n = e.states[i], r = t.next, a = t.pipeline;
if (!e.error && n !== s.WORKING && n !== s.ERROR) if (n === s.COMPLETE) r ? o(r, e) : a.flowOut(e); else {
e.states[i] = s.WORKING;
var c = t.handle(e, (function(t, n) {
if (t) {
e.error = t;
e.states[i] = s.ERROR;
a.flowOut(e);
} else {
n && (e.content = n);
e.states[i] = s.COMPLETE;
r ? o(r, e) : a.flowOut(e);
}
}));
if (c instanceof Error) {
e.error = c;
e.states[i] = s.ERROR;
a.flowOut(e);
} else if (void 0 !== c) {
null !== c && (e.content = c);
e.states[i] = s.COMPLETE;
r ? o(r, e) : a.flowOut(e);
}
}
}
var a = function(t) {
this._pipes = t;
this._cache = n.createMap(!0);
for (var e = 0; e < t.length; ++e) {
var i = t[e];
if (i.handle && i.id) {
i.pipeline = this;
i.next = e < t.length - 1 ? t[e + 1] : null;
}
}
};
a.ItemState = s;
var c = a.prototype;
c.insertPipe = function(t, e) {
if (!t.handle || !t.id || e > this._pipes.length) cc.warnID(4921); else if (this._pipes.indexOf(t) > 0) cc.warnID(4922); else {
t.pipeline = this;
var i = null;
e < this._pipes.length && (i = this._pipes[e]);
var n = null;
e > 0 && (n = this._pipes[e - 1]);
n && (n.next = t);
t.next = i;
this._pipes.splice(e, 0, t);
}
};
c.insertPipeAfter = function(t, e) {
var i = this._pipes.indexOf(t);
i < 0 || this.insertPipe(e, i + 1);
};
c.appendPipe = function(t) {
if (t.handle && t.id) {
t.pipeline = this;
t.next = null;
this._pipes.length > 0 && (this._pipes[this._pipes.length - 1].next = t);
this._pipes.push(t);
}
};
c.flowIn = function(t) {
var e, i, n = this._pipes[0];
if (n) {
for (e = 0; e < t.length; e++) {
i = t[e];
this._cache[i.id] = i;
}
for (e = 0; e < t.length; e++) o(n, i = t[e]);
} else for (e = 0; e < t.length; e++) this.flowOut(t[e]);
};
c.flowInDeps = function(t, e, i) {
return r.create(this, (function(t, e) {
i(t, e);
e.destroy();
})).append(e, t);
};
c.flowOut = function(t) {
t.error ? delete this._cache[t.id] : this._cache[t.id] || (this._cache[t.id] = t);
t.complete = !0;
r.itemComplete(t);
};
c.copyItemStates = function(t, e) {
if (e instanceof Array) for (var i = 0; i < e.length; ++i) e[i].states = t.states; else e.states = t.states;
};
c.getItem = function(t) {
var e = this._cache[t];
if (!e) return e;
e.alias && (e = e.alias);
return e;
};
c.removeItem = function(t) {
var e = this._cache[t];
e && e.complete && delete this._cache[t];
return e;
};
c.clear = function() {
for (var t in this._cache) {
var e = this._cache[t];
delete this._cache[t];
if (!e.complete) {
e.error = new Error("Canceled manually");
this.flowOut(e);
}
}
};
cc.Pipeline = e.exports = a;
}), {
"../platform/js": 130,
"./loading-items": 98
} ],
102: [ (function(t, e, i) {
"use strict";
}), {
"../platform/js": 130
} ],
103: [ (function(t, e, i) {
"use strict";
var n = t("./pipeline"), r = "SubPackPipe", s = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-]{8,})/;
function o(t) {
var e = t.match(s);
return e ? e[1] : "";
}
var a = Object.create(null), c = function(t) {
this.id = r;
this.async = !1;
this.pipeline = null;
for (var e in t) {
var i = t[e];
i.uuids && i.uuids.forEach((function(t) {
a[t] = i.path;
}));
}
};
c.ID = r;
c.prototype.handle = function(t) {
t.url = this.transformURL(t.url);
return null;
};
c.prototype.transformURL = function(t) {
var e = o(t);
if (e) {
var i = a[e];
if (i) return t.replace("res/raw-assets/", i + "raw-assets/");
}
return t;
};
n.SubPackPipe = e.exports = c;
}), {
"./pipeline": 101
} ],
104: [ (function(t, e, i) {
"use strict";
var n = t("./utils").urlAppendTimestamp;
e.exports = function(t, e) {
var i = t.url;
i = n(i);
var r = cc.loader.getXMLHttpRequest(), s = "Load text file failed: " + i;
r.open("GET", i, !0);
r.overrideMimeType && r.overrideMimeType("text/plain; charset=utf-8");
r.onload = function() {
4 === r.readyState ? 200 === r.status || 0 === r.status ? e(null, r.responseText) : e({
status: r.status,
errorMessage: s + "(wrong status)"
}) : e({
status: r.status,
errorMessage: s + "(wrong readyState)"
});
};
r.onerror = function() {
e({
status: r.status,
errorMessage: s + "(error)"
});
};
r.ontimeout = function() {
e({
status: r.status,
errorMessage: s + "(time out)"
});
};
r.send(null);
};
}), {
"./utils": 106
} ],
105: [ (function(t, e, i) {
"use strict";
var n = t("../assets/CCTexture2D"), r = t("../platform/js");
function s() {
this.jsons = {};
}
s.prototype.load = function(t, e) {
e.length !== t.length && cc.errorID(4915);
for (var i = 0; i < t.length; i++) {
var n = t[i], r = e[i];
this.jsons[n] = r;
}
};
s.prototype.retrieve = function(t) {
return this.jsons[t] || null;
};
function o() {
this.contents = {};
}
o.ID = r._getClassId(n);
o.prototype.load = function(t, e) {
var i = e.data.split("|");
i.length !== t.length && cc.errorID(4915);
for (var n = 0; n < t.length; n++) this.contents[t[n]] = i[n];
};
o.prototype.retrieve = function(t) {
var e = this.contents[t];
return e ? {
__type__: o.ID,
content: e
} : null;
};
0;
e.exports = {
JsonUnpacker: s,
TextureUnpacker: o
};
}), {
"../assets/CCTexture2D": 28,
"../platform/js": 130
} ],
106: [ (function(t, e, i) {
"use strict";
var n = /\?/;
e.exports = {
urlAppendTimestamp: function(t) {
cc.game.config.noCache && "string" == typeof t && (n.test(t) ? t += "&_t=" + (new Date() - 0) : t += "?_t=" + (new Date() - 0));
return t;
}
};
}), {} ],
107: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js"), r = t("../CCDebug");
t("../platform/deserialize");
var s = t("./loading-items");
function o(t) {
return t && (t[0] && "cc.Scene" === t[0].__type__ || t[1] && "cc.Scene" === t[1].__type__ || t[0] && "cc.Prefab" === t[0].__type__);
}
function a(t, e, i, n) {
var r, s, o, a = i.uuidList, c = i.uuidObjList, l = i.uuidPropList, u = i._stillUseUrl, h = t.dependKeys = [];
if (n) {
r = [];
for (s = 0; s < a.length; s++) {
o = a[s];
var f = c[s], d = l[s], _ = cc.AssetLibrary._getAssetInfoInRuntime(o);
if (_.raw) {
var p = _.url;
f[d] = p;
h.push(p);
} else r.push({
type: "uuid",
uuid: o,
deferredLoadRaw: !0,
_owner: f,
_ownerProp: d,
_stillUseUrl: u[s]
});
}
} else {
r = new Array(a.length);
for (s = 0; s < a.length; s++) {
o = a[s];
r[s] = {
type: "uuid",
uuid: o,
_owner: c[s],
_ownerProp: l[s],
_stillUseUrl: u[s]
};
}
e._native && !e.constructor.preventPreloadNativeObject && r.push({
url: e.nativeUrl,
_owner: e,
_ownerProp: "_nativeAsset"
});
}
return r;
}
function c(t, e, i, n, r) {
e.content = i;
var o = e.dependKeys;
t.flowInDeps(e, n, (function(t, e) {
var a, c = e.map;
for (var l in c) (a = c[l]).uuid && a.content && (a.content._uuid = a.uuid);
function u(t) {
var e = t.content;
this._stillUseUrl && (e = e && cc.RawAsset.wasRawAssetType(e.constructor) ? e.nativeUrl : t.rawUrl);
"_nativeAsset" === this._ownerProp && (this._owner.url = t.url);
this._owner[this._ownerProp] = e;
t.uuid !== i._uuid && o.indexOf(t.id) < 0 && o.push(t.id);
}
for (var h = 0; h < n.length; h++) {
var f = n[h], d = f.uuid, _ = f.url;
f._owner, f._ownerProp;
if (a = c[_]) {
var p = f;
if (a.complete || a.content) if (a.error) {
cc._throw(a.error.message || a.error.errorMessage || a.error);
} else u.call(p, a); else {
var v = s.getQueue(a), g = v._callbackTable[d];
g ? g.unshift(u, p) : v.addListener(d, u, p);
}
}
}
if (!t && i.onLoad) try {
i.onLoad();
} catch (t) {
cc._throw(t);
}
r(t, i);
}));
}
function l(t, e, i) {
0;
var n = e.deferredLoadRaw;
n ? t instanceof cc.Asset && t.constructor.preventDeferredLoadDependents && (n = !1) : i && (t instanceof cc.SceneAsset || t instanceof cc.Prefab) && (n = t.asyncLoadAssets);
return n;
}
function u(t, e) {
var i, s;
if ("string" == typeof t.content) try {
i = JSON.parse(t.content);
} catch (e) {
return new Error(r.getError(4923, t.id, e.stack));
} else {
if ("object" != typeof t.content) return new Error(r.getError(4924));
i = t.content;
}
var u = o(i);
s = u ? cc._MissingScript.safeFindClass : function(t) {
var e = n._getClassById(t);
if (e) return e;
cc.warnID(4903, t);
return Object;
};
var h, f = cc.deserialize.Details.pool.get();
try {
h = cc.deserialize(i, f, {
classFinder: s,
target: t.existingAsset,
customEnv: t
});
} catch (e) {
cc.deserialize.Details.pool.put(f);
var d = e + "\n" + e.stack;
return new Error(r.getError(4925, t.id, d));
}
h._uuid = t.uuid;
h.url = h.nativeUrl;
0;
var _ = a(t, h, f, l(h, t, u));
cc.deserialize.Details.pool.put(f);
if (0 === _.length) {
h.onLoad && h.onLoad();
return e(null, h);
}
c(this.pipeline, t, h, _, e);
}
e.exports = u;
u.isSceneObj = o;
}), {
"../CCDebug": 4,
"../platform/deserialize": 125,
"../platform/js": 130,
"./loading-items": 98
} ],
108: [ (function(t, e, i) {
"use strict";
var n = t("./component-scheduler"), r = t("./platform/CCObject").Flags, s = t("./platform/js"), o = r.IsPreloadStarted, a = r.IsOnLoadStarted, c = r.IsOnLoadCalled, l = r.Deactivating, u = cc.Class({
extends: n.LifeCycleInvoker,
add: function(t) {
this._zero.array.push(t);
},
remove: function(t) {
this._zero.fastRemove(t);
},
cancelInactive: function(t) {
n.LifeCycleInvoker.stableRemoveInactive(this._zero, t);
},
invoke: function() {
this._invoke(this._zero);
this._zero.array.length = 0;
}
}), h = n.createInvokeImpl("c.__preload();"), f = n.createInvokeImpl("c.onLoad();c._objFlags|=" + c, !1, c), d = new s.Pool(4);
d.get = function() {
var t = this._get() || {
preload: new u(h),
onLoad: new n.OneOffInvoker(f),
onEnable: new n.OneOffInvoker(n.invokeOnEnable)
};
t.preload._zero.i = -1;
var e = t.onLoad;
e._zero.i = -1;
e._neg.i = -1;
e._pos.i = -1;
(e = t.onEnable)._zero.i = -1;
e._neg.i = -1;
e._pos.i = -1;
return t;
};
function _(t, e, i) {
0;
e ? t._removeComponent(e) : s.array.removeAt(t._components, i);
}
function p() {
this._activatingStack = [];
}
var v = cc.Class({
ctor: p,
reset: p,
_activateNodeRecursively: function(t, e, i, n) {
if (t._objFlags & l) cc.errorID(3816, t.name); else {
t._activeInHierarchy = !0;
for (var r = t._components.length, s = 0; s < r; ++s) {
var o = t._components[s];
if (o instanceof cc.Component) this.activateComp(o, e, i, n); else {
_(t, o, s);
--s;
--r;
}
}
t._childArrivalOrder = t._children.length;
for (var a = 0, c = t._children.length; a < c; ++a) {
var u = t._children[a];
u._localZOrder = 4294901760 & u._localZOrder | a + 1;
u._active && this._activateNodeRecursively(u, e, i, n);
}
t._onPostActivated(!0);
}
},
_deactivateNodeRecursively: function(t) {
0;
t._objFlags |= l;
t._activeInHierarchy = !1;
for (var e = t._components.length, i = 0; i < e; ++i) {
var n = t._components[i];
if (n._enabled) {
cc.director._compScheduler.disableComp(n);
if (t._activeInHierarchy) {
t._objFlags &= ~l;
return;
}
}
}
for (var r = 0, s = t._children.length; r < s; ++r) {
var o = t._children[r];
if (o._activeInHierarchy) {
this._deactivateNodeRecursively(o);
if (t._activeInHierarchy) {
t._objFlags &= ~l;
return;
}
}
}
t._onPostActivated(!1);
t._objFlags &= ~l;
},
activateNode: function(t, e) {
if (e) {
var i = d.get();
this._activatingStack.push(i);
this._activateNodeRecursively(t, i.preload, i.onLoad, i.onEnable);
i.preload.invoke();
i.onLoad.invoke();
i.onEnable.invoke();
this._activatingStack.pop();
d.put(i);
} else {
this._deactivateNodeRecursively(t);
for (var n = this._activatingStack, r = 0; r < n.length; r++) {
var s = n[r];
s.preload.cancelInactive(o);
s.onLoad.cancelInactive(a);
s.onEnable.cancelInactive();
}
}
t.emit("active-in-hierarchy-changed", t);
},
activateComp: function(t, e, i, n) {
if (cc.isValid(t, !0)) {
if (!(t._objFlags & o)) {
t._objFlags |= o;
t.__preload && (e ? e.add(t) : t.__preload());
}
if (!(t._objFlags & a)) {
t._objFlags |= a;
if (t.onLoad) if (i) i.add(t); else {
t.onLoad();
t._objFlags |= c;
} else t._objFlags |= c;
}
if (t._enabled) {
if (!t.node._activeInHierarchy) return;
cc.director._compScheduler.enableComp(t, n);
}
}
},
destroyComp: function(t) {
cc.director._compScheduler.disableComp(t);
t.onDestroy && t._objFlags & c && t.onDestroy();
},
resetComp: !1
});
e.exports = v;
}), {
"./component-scheduler": 43,
"./platform/CCObject": 116,
"./platform/js": 130,
"./utils/misc": 187
} ],
109: [ (function(t, e, i) {
"use strict";
t("../assets/CCAsset");
var n = t("./utils").callInNextTick, r = t("../load-pipeline/CCLoader"), s = t("../load-pipeline/asset-table"), o = t("../load-pipeline/pack-downloader"), a = t("../load-pipeline/auto-release-utils"), c = t("../utils/decode-uuid"), l = t("../load-pipeline/md5-pipe"), u = t("../load-pipeline/subpackage-pipe"), h = t("./js"), f = "", d = "", _ = h.createMap(!0);
function p(t) {
return t && (t.constructor === cc.SceneAsset || t instanceof cc.Scene);
}
function v(t, e) {
this.url = t;
this.type = e;
}
var g = {
loadAsset: function(t, e, i) {
if ("string" != typeof t) return n(e, new Error("[AssetLibrary] uuid must be string"), null);
var s = {
uuid: t,
type: "uuid"
};
i && i.existingAsset && (s.existingAsset = i.existingAsset);
r.load(s, (function(i, n) {
if (i || !n) {
var s = "string" == typeof i ? i : i ? i.message || i.errorMessage || JSON.stringify(i) : "Unknown error";
i = new Error("[AssetLibrary] loading JSON or dependencies failed:" + s);
} else {
if (n.constructor === cc.SceneAsset) {
var o = cc.loader._getReferenceKey(t);
n.scene.dependAssets = a.getDependsRecursively(o);
}
if (p(n)) {
var c = cc.loader._getReferenceKey(t);
r.removeItem(c);
}
}
e && e(i, n);
}));
},
getLibUrlNoExt: function(t, e) {
t = c(t);
return (e ? d + "assets/" : f) + t.slice(0, 2) + "/" + t;
},
_queryAssetInfoInEditor: function(t, e) {
0;
},
_getAssetInfoInRuntime: function(t, e) {
e = e || {
url: null,
raw: !1
};
var i = _[t];
if (i && !h.isChildClassOf(i.type, cc.Asset)) {
e.url = d + i.url;
e.raw = !0;
} else {
e.url = this.getLibUrlNoExt(t) + ".json";
e.raw = !1;
}
return e;
},
_uuidInSettings: function(t) {
return t in _;
},
queryAssetInfo: function(t, e) {
var i = this._getAssetInfoInRuntime(t);
e(null, i.url, i.raw);
},
parseUuidInEditor: function(t) {},
loadJson: function(t, e) {
var i = "" + (new Date().getTime() + Math.random()), n = {
uuid: i,
type: "uuid",
content: t,
skips: [ r.assetLoader.id, r.downloader.id ]
};
r.load(n, (function(t, n) {
if (t) t = new Error("[AssetLibrary] loading JSON or dependencies failed: " + t.message); else {
if (n.constructor === cc.SceneAsset) {
var s = cc.loader._getReferenceKey(i);
n.scene.dependAssets = a.getDependsRecursively(s);
}
if (p(n)) {
var o = cc.loader._getReferenceKey(i);
r.removeItem(o);
}
}
n._uuid = "";
e && e(t, n);
}));
},
getAssetByUuid: function(t) {
return g._uuidToAsset[t] || null;
},
init: function(t) {
0;
var e = t.libraryPath;
e = e.replace(/\\/g, "/");
f = cc.path.stripSep(e) + "/";
d = t.rawAssetsBase;
if (t.subpackages) {
var i = new u(t.subpackages);
cc.loader.insertPipeAfter(cc.loader.assetLoader, i);
cc.loader.subPackPipe = i;
}
var n = t.md5AssetsMap;
if (n && n.import) {
var a = 0, p = 0, g = h.createMap(!0), m = n.import;
for (a = 0; a < m.length; a += 2) g[p = c(m[a])] = m[a + 1];
var y = h.createMap(!0);
m = n["raw-assets"];
for (a = 0; a < m.length; a += 2) y[p = c(m[a])] = m[a + 1];
var E = new l(g, y, f);
cc.loader.insertPipeAfter(cc.loader.assetLoader, E);
cc.loader.md5Pipe = E;
}
var C = r._assetTables;
for (var T in C) C[T].reset();
var A = t.rawAssets;
if (A) for (var x in A) {
var b = A[x];
for (var p in b) {
var S = b[p], R = S[0], w = S[1], L = cc.js._getClassById(w);
if (L) {
_[p] = new v(x + "/" + R, L);
var O = cc.path.extname(R);
O && (R = R.slice(0, -O.length));
var M = 1 === S[2];
C[x] || (C[x] = new s());
C[x].add(R, p, L, !M);
} else cc.error("Cannot get", w);
}
}
t.packedAssets && o.initPacks(t.packedAssets);
cc.url._init(t.mountPaths && t.mountPaths.assets || d + "assets");
},
_uuidToAsset: {}
}, m = {
effect: {},
material: {}
}, y = {};
function E(t, e, i) {
var n = t + "s", r = m[t] = {}, s = "internal";
0;
cc.loader.loadResDir(n, e, s, (function() {}), (function(t, e) {
if (t) cc.error(t); else for (var n = 0; n < e.length; n++) {
var s = e[n];
cc.loader.getDependsRecursively(s).forEach((function(t) {
return y[t] = !0;
}));
r["" + s.name] = s;
}
i();
}));
}
g._loadBuiltins = function(t) {
if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) return t && t();
E("effect", cc.EffectAsset, (function() {
E("material", cc.Material, t);
}));
};
g.getBuiltin = function(t, e) {
return m[t][e];
};
g.getBuiltins = function(t) {
return t ? m[t] : m;
};
g.resetBuiltins = function() {
m = {
effect: {},
material: {}
};
y = {};
};
g.getBuiltinDeps = function() {
return y;
};
e.exports = cc.AssetLibrary = g;
}), {
"../assets/CCAsset": 11,
"../load-pipeline/CCLoader": 88,
"../load-pipeline/asset-table": 90,
"../load-pipeline/auto-release-utils": 92,
"../load-pipeline/md5-pipe": 99,
"../load-pipeline/pack-downloader": 100,
"../load-pipeline/subpackage-pipe": 103,
"../utils/decode-uuid": 183,
"./js": 130,
"./utils": 134
} ],
110: [ (function(t, e, i) {
"use strict";
var n = t("./js"), r = t("./CCEnum"), s = t("./utils"), o = (s.isPlainEmptyObj_DEV, 
s.cloneable_DEV, t("./attribute")), a = o.DELIMETER, c = t("./preprocess-class");
t("./requiring-frame");
var l = [ "name", "extends", "mixins", "ctor", "__ctor__", "properties", "statics", "editor", "__ES6__" ];
function u(t, e) {
t.indexOf(e) < 0 && t.push(e);
}
var h = {
datas: null,
push: function(t) {
if (this.datas) this.datas.push(t); else {
this.datas = [ t ];
var e = this;
setTimeout((function() {
e.init();
}), 0);
}
},
init: function() {
var t = this.datas;
if (t) {
for (var e = 0; e < t.length; ++e) {
var i = t[e], r = i.cls, s = i.props;
"function" == typeof s && (s = s());
var o = n.getClassName(r);
s ? w(r, o, s, r.$super, i.mixins) : cc.errorID(3633, o);
}
this.datas = null;
}
}
};
function f(t, e) {
0;
u(t.__props__, e);
}
function d(t, e, i, n, r) {
var s = n.default;
0;
o.setClassAttr(t, i, "default", s);
f(t, i);
M(t, n, e, i, !1);
}
function _(t, e, i, r, s) {
var a = r.get, c = r.set, l = t.prototype, u = Object.getOwnPropertyDescriptor(l, i), h = !u;
if (a) {
0;
M(t, r, e, i, !0);
0;
o.setClassAttr(t, i, "serializable", !1);
0;
s || n.get(l, i, a, h, h);
0;
}
if (c) {
if (!s) {
0;
n.set(l, i, c, h, h);
}
0;
}
}
function p(t) {
return "function" == typeof t ? t() : t;
}
function v(t, e, i) {
for (var r in e) t.hasOwnProperty(r) || i && !i(r) || Object.defineProperty(t, r, n.getPropertyDescriptor(e, r));
}
function g(t, e, i, r) {
var s, a, c = r.__ctor__, l = r.ctor, u = r.__ES6__;
if (u) {
s = [ l ];
a = l;
} else {
s = c ? [ c ] : b(e, i, r);
a = x(s, e, t, r);
n.value(a, "extend", (function(t) {
t.extends = this;
return L(t);
}), !0);
}
n.value(a, "__ctors__", s.length > 0 ? s : null, !0);
var h = a.prototype;
if (e) {
if (!u) {
n.extend(a, e);
h = a.prototype;
}
a.$super = e;
0;
}
if (i) {
for (var f = i.length - 1; f >= 0; f--) {
var d = i[f];
v(h, d.prototype);
v(a, d, (function(t) {
return d.hasOwnProperty(t) && !0;
}));
L._isCCClass(d) && v(o.getClassAttrs(a), o.getClassAttrs(d));
}
h.constructor = a;
}
u || (h.__initProps__ = A);
n.setClassName(t, a);
return a;
}
function m(t, e, i, r) {
var s = cc.Component, o = cc._RF.peek();
if (o && n.isChildClassOf(e, s)) {
if (n.isChildClassOf(o.cls, s)) {
cc.errorID(3615);
return null;
}
0;
t = t || o.script;
}
var a = g(t, e, i, r);
if (o) if (n.isChildClassOf(e, s)) {
var c = o.uuid;
if (c) {
n._setClassId(c, a);
0;
}
o.cls = a;
} else n.isChildClassOf(o.cls, s) || (o.cls = a);
return a;
}
function y(t) {
for (var e = n.getClassName(t), i = t.constructor, r = "new " + e + "(", s = 0; s < i.__props__.length; s++) {
var o = t[i.__props__[s]];
0;
r += o;
s < i.__props__.length - 1 && (r += ",");
}
return r + ")";
}
function E(t) {
return JSON.stringify(t).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}
function C(t, e) {
for (var i = [], n = "", r = 0; r < e.length; r++) {
var s = e[r], o = s + a + "default";
if (o in t) {
var c, l;
c = T.test(s) ? "this." + s + "=" : "this[" + E(s) + "]=";
var u = t[o];
if ("object" == typeof u && u) l = u instanceof cc.ValueType ? y(u) : Array.isArray(u) ? "[]" : "{}"; else if ("function" == typeof u) {
var h = i.length;
i.push(u);
l = "F[" + h + "]()";
0;
} else l = "string" == typeof u ? E(u) : u;
n += c = c + l + ";\n";
}
}
return 0 === i.length ? Function(n) : Function("F", "return (function(){\n" + n + "})")(i);
}
var T = /^[A-Za-z_$][0-9A-Za-z_$]*$/;
function A(t) {
var e = o.getClassAttrs(t), i = t.__props__;
if (null === i) {
h.init();
i = t.__props__;
}
var n = C(e, i);
t.prototype.__initProps__ = n;
n.call(this);
}
var x = function(t, e, i, n) {
var r = "return function CCClass(){\n";
e && R(e, n, i) && (r += "this._super=null;\n");
r += "this.__initProps__(CCClass);\n";
var s = t.length;
if (s > 0) {
0;
var o = "].apply(this,arguments);\n";
if (1 === s) r += "CCClass.__ctors__[0" + o; else {
r += "var cs=CCClass.__ctors__;\n";
for (var a = 0; a < s; a++) r += "cs[" + a + o;
}
0;
}
r += "}";
return Function(r)();
};
function b(t, e, i) {
function n(t) {
return L._isCCClass(t) ? t.__ctors__ || [] : [ t ];
}
for (var r = [], s = [ t ].concat(e), o = 0; o < s.length; o++) {
var a = s[o];
if (a) for (var c = n(a), l = 0; l < c.length; l++) u(r, c[l]);
}
var h = i.ctor;
h && r.push(h);
return r;
}
var S = /xyz/.test((function() {
xyz;
})) ? /\b\._super\b/ : /.*/;
/xyz/.test((function() {
xyz;
}));
function R(t, e, i) {
var r = !1;
for (var s in e) if (!(l.indexOf(s) >= 0)) {
var o = e[s];
if ("function" == typeof o) {
var a = n.getPropertyDescriptor(t.prototype, s);
if (a) {
var c = a.value;
if ("function" == typeof c) {
if (S.test(o)) {
r = !0;
e[s] = (function(t, e) {
return function() {
var i = this._super;
this._super = t;
var n = e.apply(this, arguments);
this._super = i;
return n;
};
})(c, o);
}
continue;
}
}
0;
}
}
return r;
}
function w(t, e, i, n, r, s) {
t.__props__ = [];
n && n.__props__ && (t.__props__ = n.__props__.slice());
if (r) for (var l = 0; l < r.length; ++l) {
var u = r[l];
u.__props__ && (t.__props__ = t.__props__.concat(u.__props__.filter((function(e) {
return t.__props__.indexOf(e) < 0;
}))));
}
if (i) {
c.preprocessAttrs(i, e, t, s);
for (var h in i) {
var f = i[h];
"default" in f ? d(t, e, h, f) : _(t, e, h, f, s);
}
}
var p = o.getClassAttrs(t);
t.__values__ = t.__props__.filter((function(t) {
return !1 !== p[t + a + "serializable"];
}));
}
function L(t) {
var e = (t = t || {}).name, i = t.extends, r = t.mixins, s = m(e, i, r, t);
e || (e = cc.js.getClassName(s));
s._sealed = !0;
i && (i._sealed = !1);
var o = t.properties;
if ("function" == typeof o || i && null === i.__props__ || r && r.some((function(t) {
return null === t.__props__;
}))) {
h.push({
cls: s,
props: o,
mixins: r
});
s.__props__ = s.__values__ = null;
} else w(s, e, o, i, t.mixins, t.__ES6__);
var a = t.statics;
if (a) {
var u;
0;
for (u in a) s[u] = a[u];
}
for (var f in t) if (!(l.indexOf(f) >= 0)) {
var d = t[f];
c.validateMethodWithProps(d, f, e, s, i) && n.value(s.prototype, f, d, !0, !0);
}
var _ = t.editor;
_ && n.isChildClassOf(i, cc.Component) && cc.Component._registerEditorProps(s, _);
return s;
}
L._isCCClass = function(t) {
return t && t.hasOwnProperty("__ctors__");
};
L._fastDefine = function(t, e, i) {
n.setClassName(t, e);
for (var r = e.__props__ = e.__values__ = Object.keys(i), s = o.getClassAttrs(e), c = 0; c < r.length; c++) {
var l = r[c];
s[l + a + "visible"] = !1;
s[l + a + "default"] = i[l];
}
};
L.Attr = o;
L.attr = o.attr;
L.getInheritanceChain = function(t) {
for (var e = []; t = n.getSuper(t); ) t !== Object && e.push(t);
return e;
};
var O = {
Integer: "Number",
Float: "Number",
Boolean: "Boolean",
String: "String"
};
function M(t, e, i, n, s) {
var c = null, l = "";
function u() {
l = n + a;
return c = o.getClassAttrs(t);
}
0;
var h = e.type;
if (h) {
var f = O[h];
if (f) {
(c || u())[l + "type"] = h;
0;
} else if ("Object" === h) 0; else if (h === o.ScriptUuid) {
(c || u())[l + "type"] = "Script";
c[l + "ctor"] = cc.ScriptAsset;
} else if ("object" == typeof h) if (r.isEnum(h)) {
(c || u())[l + "type"] = "Enum";
c[l + "enumList"] = r.getList(h);
} else 0; else if ("function" == typeof h) {
(c || u())[l + "type"] = "Object";
c[l + "ctor"] = h;
0;
} else 0;
}
function d(t, i) {
if (t in e) {
var n = e[t];
typeof n === i && ((c || u())[l + t] = n);
}
}
e.editorOnly && ((c || u())[l + "editorOnly"] = !0);
0;
e.url && ((c || u())[l + "saveUrlAsAsset"] = !0);
!1 === e.serializable && ((c || u())[l + "serializable"] = !1);
d("formerlySerializedAs", "string");
0;
var _ = e.range;
if (_) if (Array.isArray(_)) if (_.length >= 2) {
(c || u())[l + "min"] = _[0];
c[l + "max"] = _[1];
_.length > 2 && (c[l + "step"] = _[2]);
} else 0; else 0;
d("min", "number");
d("max", "number");
d("step", "number");
}
cc.Class = L;
e.exports = {
isArray: function(t) {
t = p(t);
return Array.isArray(t);
},
fastDefine: L._fastDefine,
getNewValueTypeCode: y,
IDENTIFIER_RE: T,
escapeForJS: E,
getDefault: p
};
0;
}), {
"./CCEnum": 112,
"./attribute": 122,
"./js": 130,
"./preprocess-class": 131,
"./requiring-frame": 132,
"./utils": 134
} ],
111: [ (function(t, e, i) {
"use strict";
t("./CCClass");
var n = t("./preprocess-class"), r = t("./js"), s = "__ccclassCache__";
function o(t) {
return t;
}
function a(t, e) {
return t[e] || (t[e] = {});
}
function c(t) {
return function(e) {
return "function" == typeof e ? t(e) : function(i) {
return t(i, e);
};
};
}
function l(t, e, i) {
return function(t) {
0;
return function(i) {
return e(i, t);
};
};
}
var u = l.bind(null, !1);
function h(t) {
return l.bind(null, !1);
}
var f = h(), d = h();
function _(t, e) {
0;
return a(t, s);
}
function p(t) {
var e;
try {
e = t();
} catch (e) {
return t;
}
return "object" != typeof e || null === e ? e : t;
}
function v(t) {
var e;
try {
e = new t();
} catch (t) {
0;
return {};
}
return e;
}
function g(t, e, i, s, o, a) {
var c;
s && (c = n.getFullFormOfProperty(s));
var l = e[i], u = r.mixin(l || {}, c || s || {});
if (o && (o.get || o.set)) {
o.get && (u.get = o.get);
o.set && (u.set = o.set);
} else {
0;
var h = void 0;
if (o) {
if (o.initializer) {
h = p(o.initializer);
!0;
}
} else {
var f = a.default || (a.default = v(t));
if (f.hasOwnProperty(i)) {
h = f[i];
!0;
}
}
0;
u.default = h;
}
e[i] = u;
}
var m = c((function(t, e) {
var i = r.getSuper(t);
i === Object && (i = null);
var n = {
name: e,
extends: i,
ctor: t,
__ES6__: !0
}, o = t[s];
if (o) {
var a = o.proto;
a && r.mixin(n, a);
t[s] = void 0;
}
return cc.Class(n);
}));
function y(t, e, i) {
return t((function(t, n) {
var r = _(t);
if (r) {
var s = void 0 !== i ? i : n;
a(a(r, "proto"), "editor")[e] = s;
}
}), e);
}
function E(t) {
return t(o);
}
var C = E(c), T = y(u, "requireComponent"), A = E(f), x = y(d, "executionOrder"), b = E(c), S = E(c), R = E(f), w = E(f), L = E(f);
cc._decorator = e.exports = {
ccclass: m,
property: function(t, e, i) {
var n = null;
function r(t, e, i) {
var r = _(t.constructor);
if (r) {
var s = a(a(r, "proto"), "properties");
g(t.constructor, s, e, n, i, r);
}
}
if ("undefined" == typeof e) {
n = t;
return r;
}
r(t, e, i);
},
executeInEditMode: C,
requireComponent: T,
menu: A,
executionOrder: x,
disallowMultiple: b,
playOnFocus: S,
inspector: R,
icon: w,
help: L,
mixins: function() {
for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
return function(e) {
var i = _(e);
i && (a(i, "proto").mixins = t);
};
}
};
}), {
"./CCClass": 110,
"./js": 130,
"./preprocess-class": 131,
"./utils": 134
} ],
112: [ (function(t, e, i) {
"use strict";
var n = t("./js");
function r(t) {
if ("__enums__" in t) return t;
n.value(t, "__enums__", null, !0);
for (var e = -1, i = Object.keys(t), r = 0; r < i.length; r++) {
var s = i[r], o = t[s];
if (-1 === o) {
o = ++e;
t[s] = o;
} else if ("number" == typeof o) e = o; else if ("string" == typeof o && Number.isInteger(parseFloat(s))) continue;
var a = "" + o;
if (s !== a) {
0;
n.value(t, a, s);
}
}
return t;
}
r.isEnum = function(t) {
return t && t.hasOwnProperty("__enums__");
};
r.getList = function(t) {
if (t.__enums__) return t.__enums__;
var e = t.__enums__ = [];
for (var i in t) {
var n = t[i];
Number.isInteger(n) && e.push({
name: i,
value: n
});
}
e.sort((function(t, e) {
return t.value - e.value;
}));
return e;
};
e.exports = cc.Enum = r;
}), {
"./js": 130
} ],
113: [ (function(t, e, i) {
"use strict";
var n = t("../event-manager"), r = t("./CCInputManager"), s = void 0;
cc.Acceleration = function(t, e, i, n) {
this.x = t || 0;
this.y = e || 0;
this.z = i || 0;
this.timestamp = n || 0;
};
r.setAccelerometerEnabled = function(t) {
var e = this;
if (e._accelEnabled !== t) {
e._accelEnabled = t;
var i = cc.director.getScheduler();
i.enableForTarget(e);
if (e._accelEnabled) {
e._registerAccelerometerEvent();
e._accelCurTime = 0;
i.scheduleUpdate(e);
} else {
e._unregisterAccelerometerEvent();
e._accelCurTime = 0;
i.unscheduleUpdate(e);
}
jsb.device.setMotionEnabled(t);
}
};
r.setAccelerometerInterval = function(t) {
if (this._accelInterval !== t) {
this._accelInterval = t;
jsb.device.setMotionInterval(t);
}
};
r._registerKeyboardEvent = function() {
cc.game.canvas.addEventListener("keydown", (function(t) {
n.dispatchEvent(new cc.Event.EventKeyboard(t.keyCode, !0));
t.stopPropagation();
t.preventDefault();
}), !1);
cc.game.canvas.addEventListener("keyup", (function(t) {
n.dispatchEvent(new cc.Event.EventKeyboard(t.keyCode, !1));
t.stopPropagation();
t.preventDefault();
}), !1);
};
r._registerAccelerometerEvent = function() {
var t = window, e = this;
e._acceleration = new cc.Acceleration();
e._accelDeviceEvent = t.DeviceMotionEvent || t.DeviceOrientationEvent;
cc.sys.browserType === cc.sys.BROWSER_TYPE_MOBILE_QQ && (e._accelDeviceEvent = window.DeviceOrientationEvent);
var i = e._accelDeviceEvent === t.DeviceMotionEvent ? "devicemotion" : "deviceorientation", n = navigator.userAgent;
(/Android/.test(n) || /Adr/.test(n) && cc.sys.browserType === cc.BROWSER_TYPE_UC) && (e._minus = -1);
s = e.didAccelerate.bind(e);
t.addEventListener(i, s, !1);
};
r._unregisterAccelerometerEvent = function() {
var t = window, e = this._accelDeviceEvent === t.DeviceMotionEvent ? "devicemotion" : "deviceorientation";
s && t.removeEventListener(e, s, !1);
};
r.didAccelerate = function(t) {
var e = this, i = window;
if (e._accelEnabled) {
var n = e._acceleration, r = void 0, s = void 0, o = void 0;
if (e._accelDeviceEvent === window.DeviceMotionEvent) {
var a = t.accelerationIncludingGravity;
r = e._accelMinus * a.x * .1;
s = e._accelMinus * a.y * .1;
o = .1 * a.z;
} else {
r = t.gamma / 90 * .981;
s = -t.beta / 90 * .981;
o = t.alpha / 90 * .981;
}
if (cc.view._isRotated) {
var c = r;
r = -s;
s = c;
}
n.x = r;
n.y = s;
n.z = o;
n.timestamp = t.timeStamp || Date.now();
var l = n.x;
if (90 === i.orientation) {
n.x = -n.y;
n.y = l;
} else if (-90 === i.orientation) {
n.x = n.y;
n.y = -l;
} else if (180 === i.orientation) {
n.x = -n.x;
n.y = -n.y;
}
if (cc.sys.os === cc.sys.OS_ANDROID && cc.sys.browserType !== cc.sys.BROWSER_TYPE_MOBILE_QQ) {
n.x = -n.x;
n.y = -n.y;
}
}
};
}), {
"../event-manager": 75,
"./CCInputManager": 114
} ],
114: [ (function(t, e, i) {
"use strict";
var n = t("./CCMacro"), r = t("./CCSys"), s = t("../event-manager"), o = n.TOUCH_TIMEOUT, a = cc.v2(), c = {
_mousePressed: !1,
_isRegisterEvent: !1,
_preTouchPoint: cc.v2(0, 0),
_prevMousePoint: cc.v2(0, 0),
_preTouchPool: [],
_preTouchPoolPointer: 0,
_touches: [],
_touchesIntegerDict: {},
_indexBitsUsed: 0,
_maxTouches: 8,
_accelEnabled: !1,
_accelInterval: .2,
_accelMinus: 1,
_accelCurTime: 0,
_acceleration: null,
_accelDeviceEvent: null,
_canvasBoundingRect: {
left: 0,
top: 0,
adjustedLeft: 0,
adjustedTop: 0,
width: 0,
height: 0
},
_getUnUsedIndex: function() {
for (var t = this._indexBitsUsed, e = cc.sys.now(), i = 0; i < this._maxTouches; i++) {
if (!(1 & t)) {
this._indexBitsUsed |= 1 << i;
return i;
}
var n = this._touches[i];
if (e - n._lastModified > o) {
this._removeUsedIndexBit(i);
delete this._touchesIntegerDict[n.getID()];
return i;
}
t >>= 1;
}
return -1;
},
_removeUsedIndexBit: function(t) {
if (!(t < 0 || t >= this._maxTouches)) {
var e = 1 << t;
e = ~e;
this._indexBitsUsed &= e;
}
},
_glView: null,
_updateCanvasBoundingRect: function() {
var t = cc.game.canvas, e = this._canvasBoundingRect, i = document.documentElement, n = window.pageXOffset - i.clientLeft, r = window.pageYOffset - i.clientTop;
if (t.getBoundingClientRect) {
var s = t.getBoundingClientRect();
e.left = s.left + n;
e.top = s.top + r;
e.width = s.width;
e.height = s.height;
} else if (t instanceof HTMLCanvasElement) {
e.left = n;
e.top = r;
e.width = t.width;
e.height = t.height;
} else {
e.left = n;
e.top = r;
e.width = parseInt(t.style.width);
e.height = parseInt(t.style.height);
}
},
handleTouchesBegin: function(t) {
for (var e = void 0, i = void 0, n = void 0, o = [], a = this._touchesIntegerDict, c = r.now(), l = 0, u = t.length; l < u; l++) if (null == a[n = (e = t[l]).getID()]) {
var h = this._getUnUsedIndex();
if (-1 === h) {
cc.logID(2300, h);
continue;
}
(i = this._touches[h] = new cc.Touch(e._point.x, e._point.y, e.getID()))._lastModified = c;
i._setPrevPoint(e._prevPoint);
a[n] = h;
o.push(i);
}
if (o.length > 0) {
this._glView._convertTouchesWithScale(o);
var f = new cc.Event.EventTouch(o);
f._eventCode = cc.Event.EventTouch.BEGAN;
s.dispatchEvent(f);
}
},
handleTouchesMove: function(t) {
for (var e = void 0, i = void 0, n = void 0, o = [], a = this._touches, c = r.now(), l = 0, u = t.length; l < u; l++) {
n = (e = t[l]).getID();
if (null != (i = this._touchesIntegerDict[n]) && a[i]) {
a[i]._setPoint(e._point);
a[i]._setPrevPoint(e._prevPoint);
a[i]._lastModified = c;
o.push(a[i]);
}
}
if (o.length > 0) {
this._glView._convertTouchesWithScale(o);
var h = new cc.Event.EventTouch(o);
h._eventCode = cc.Event.EventTouch.MOVED;
s.dispatchEvent(h);
}
},
handleTouchesEnd: function(t) {
var e = this.getSetOfTouchesEndOrCancel(t);
if (e.length > 0) {
this._glView._convertTouchesWithScale(e);
var i = new cc.Event.EventTouch(e);
i._eventCode = cc.Event.EventTouch.ENDED;
s.dispatchEvent(i);
}
this._preTouchPool.length = 0;
},
handleTouchesCancel: function(t) {
var e = this.getSetOfTouchesEndOrCancel(t);
if (e.length > 0) {
this._glView._convertTouchesWithScale(e);
var i = new cc.Event.EventTouch(e);
i._eventCode = cc.Event.EventTouch.CANCELLED;
s.dispatchEvent(i);
}
this._preTouchPool.length = 0;
},
getSetOfTouchesEndOrCancel: function(t) {
for (var e = void 0, i = void 0, n = void 0, r = [], s = this._touches, o = this._touchesIntegerDict, a = 0, c = t.length; a < c; a++) if (null != (i = o[n = (e = t[a]).getID()]) && s[i]) {
s[i]._setPoint(e._point);
s[i]._setPrevPoint(e._prevPoint);
r.push(s[i]);
this._removeUsedIndexBit(i);
delete o[n];
}
return r;
},
getPreTouch: function(t) {
for (var e = null, i = this._preTouchPool, n = t.getID(), r = i.length - 1; r >= 0; r--) if (i[r].getID() === n) {
e = i[r];
break;
}
e || (e = t);
return e;
},
setPreTouch: function(t) {
for (var e = !1, i = this._preTouchPool, n = t.getID(), r = i.length - 1; r >= 0; r--) if (i[r].getID() === n) {
i[r] = t;
e = !0;
break;
}
if (!e) if (i.length <= 50) i.push(t); else {
i[this._preTouchPoolPointer] = t;
this._preTouchPoolPointer = (this._preTouchPoolPointer + 1) % 50;
}
},
getTouchByXY: function(t, e, i) {
var n = this._preTouchPoint, r = this._glView.convertToLocationInView(t, e, i), s = new cc.Touch(r.x, r.y, 0);
s._setPrevPoint(n.x, n.y);
n.x = r.x;
n.y = r.y;
return s;
},
getMouseEvent: function(t, e, i) {
var n = this._prevMousePoint, r = new cc.Event.EventMouse(i);
r._setPrevCursor(n.x, n.y);
n.x = t.x;
n.y = t.y;
this._glView._convertMouseToLocationInView(n, e);
r.setLocation(n.x, n.y);
return r;
},
getPointByEvent: function(t, e) {
if (null != t.pageX) return {
x: t.pageX,
y: t.pageY
};
e.left -= document.body.scrollLeft;
e.top -= document.body.scrollTop;
return {
x: t.clientX,
y: t.clientY
};
},
getTouchesByEvent: function(t, e) {
for (var i = [], n = this._glView, s = void 0, o = void 0, c = void 0, l = this._preTouchPoint, u = t.changedTouches.length, h = 0; h < u; h++) if (s = t.changedTouches[h]) {
var f = void 0;
f = r.BROWSER_TYPE_FIREFOX === r.browserType ? n.convertToLocationInView(s.pageX, s.pageY, e, a) : n.convertToLocationInView(s.clientX, s.clientY, e, a);
if (null != s.identifier) {
o = new cc.Touch(f.x, f.y, s.identifier);
c = this.getPreTouch(o).getLocation();
o._setPrevPoint(c.x, c.y);
this.setPreTouch(o);
} else (o = new cc.Touch(f.x, f.y))._setPrevPoint(l.x, l.y);
l.x = f.x;
l.y = f.y;
i.push(o);
}
return i;
},
registerSystemEvent: function(t) {
if (!this._isRegisterEvent) {
this._glView = cc.view;
var e = this, i = this._canvasBoundingRect;
window.addEventListener("resize", this._updateCanvasBoundingRect.bind(this));
var n = r.isMobile, o = "mouse" in r.capabilities, a = "touches" in r.capabilities;
if (o) {
if (!n) {
window.addEventListener("mousedown", (function() {
e._mousePressed = !0;
}), !1);
window.addEventListener("mouseup", (function(t) {
if (e._mousePressed) {
e._mousePressed = !1;
var n = e.getPointByEvent(t, i);
if (!cc.rect(i.left, i.top, i.width, i.height).contains(n)) {
e.handleTouchesEnd([ e.getTouchByXY(n.x, n.y, i) ]);
var r = e.getMouseEvent(n, i, cc.Event.EventMouse.UP);
r.setButton(t.button);
s.dispatchEvent(r);
}
}
}), !1);
}
for (var c = cc.Event.EventMouse, l = [ !n && [ "mousedown", c.DOWN, function(i, n, r, s) {
e._mousePressed = !0;
e.handleTouchesBegin([ e.getTouchByXY(r.x, r.y, s) ]);
t.focus();
} ], !n && [ "mouseup", c.UP, function(t, i, n, r) {
e._mousePressed = !1;
e.handleTouchesEnd([ e.getTouchByXY(n.x, n.y, r) ]);
} ], !n && [ "mousemove", c.MOVE, function(t, i, n, r) {
e.handleTouchesMove([ e.getTouchByXY(n.x, n.y, r) ]);
e._mousePressed || i.setButton(null);
} ], [ "mousewheel", c.SCROLL, function(t, e) {
e.setScrollData(0, t.wheelDelta);
} ], [ "DOMMouseScroll", c.SCROLL, function(t, e) {
e.setScrollData(0, -120 * t.detail);
} ] ], u = 0; u < l.length; ++u) {
var h = l[u];
h && (function() {
var n = h[0], r = h[1], o = h[2];
t.addEventListener(n, (function(t) {
var n = e.getPointByEvent(t, i), a = e.getMouseEvent(n, i, r);
a.setButton(t.button);
o(t, a, n, i);
s.dispatchEvent(a);
t.stopPropagation();
t.preventDefault();
}), !1);
})();
}
}
if (window.navigator.msPointerEnabled) {
var f = {
MSPointerDown: e.handleTouchesBegin,
MSPointerMove: e.handleTouchesMove,
MSPointerUp: e.handleTouchesEnd,
MSPointerCancel: e.handleTouchesCancel
}, d = function(n) {
var r = f[n];
t.addEventListener(n, (function(t) {
var n = document.documentElement;
i.adjustedLeft = i.left - n.scrollLeft;
i.adjustedTop = i.top - n.scrollTop;
r.call(e, [ e.getTouchByXY(t.clientX, t.clientY, i) ]);
t.stopPropagation();
}), !1);
};
for (var _ in f) d(_);
}
if (a) {
var p = {
touchstart: function(i) {
e.handleTouchesBegin(i);
t.focus();
},
touchmove: function(t) {
e.handleTouchesMove(t);
},
touchend: function(t) {
e.handleTouchesEnd(t);
},
touchcancel: function(t) {
e.handleTouchesCancel(t);
}
}, v = function(n) {
var r = p[n];
t.addEventListener(n, (function(t) {
if (t.changedTouches) {
var n = document.body;
i.adjustedLeft = i.left - (n.scrollLeft || 0);
i.adjustedTop = i.top - (n.scrollTop || 0);
r(e.getTouchesByEvent(t, i));
t.stopPropagation();
t.preventDefault();
}
}), !1);
};
for (var _ in p) v(_);
}
this._registerKeyboardEvent();
this._isRegisterEvent = !0;
}
},
_registerKeyboardEvent: function() {},
_registerAccelerometerEvent: function() {},
update: function(t) {
if (this._accelCurTime > this._accelInterval) {
this._accelCurTime -= this._accelInterval;
s.dispatchEvent(new cc.Event.EventAcceleration(this._acceleration));
}
this._accelCurTime += t;
}
};
e.exports = _cc.inputManager = c;
}), {
"../event-manager": 75,
"./CCMacro": 115,
"./CCSys": 119
} ],
115: [ (function(t, e, i) {
"use strict";
cc.macro = {
RAD: Math.PI / 180,
DEG: 180 / Math.PI,
REPEAT_FOREVER: Number.MAX_VALUE - 1,
FLT_EPSILON: 1.192092896e-7,
MIN_ZINDEX: -Math.pow(2, 15),
MAX_ZINDEX: Math.pow(2, 15) - 1,
ONE: 1,
ZERO: 0,
SRC_ALPHA: 770,
SRC_ALPHA_SATURATE: 776,
SRC_COLOR: 768,
DST_ALPHA: 772,
DST_COLOR: 774,
ONE_MINUS_SRC_ALPHA: 771,
ONE_MINUS_SRC_COLOR: 769,
ONE_MINUS_DST_ALPHA: 773,
ONE_MINUS_DST_COLOR: 775,
ONE_MINUS_CONSTANT_ALPHA: 32772,
ONE_MINUS_CONSTANT_COLOR: 32770,
ORIENTATION_PORTRAIT: 1,
ORIENTATION_LANDSCAPE: 2,
ORIENTATION_AUTO: 3,
DENSITYDPI_DEVICE: "device-dpi",
DENSITYDPI_HIGH: "high-dpi",
DENSITYDPI_MEDIUM: "medium-dpi",
DENSITYDPI_LOW: "low-dpi",
FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX: !0,
DIRECTOR_STATS_POSITION: cc.v2(0, 0),
ENABLE_STACKABLE_ACTIONS: !0,
TOUCH_TIMEOUT: 5e3,
BATCH_VERTEX_COUNT: 2e4,
ENABLE_TILEDMAP_CULLING: !0,
DOWNLOAD_MAX_CONCURRENT: 64,
ENABLE_TRANSPARENT_CANVAS: !1,
ENABLE_WEBGL_ANTIALIAS: !1,
ENABLE_CULLING: !1,
CLEANUP_IMAGE_CACHE: !1,
SHOW_MESH_WIREFRAME: !1,
ROTATE_ACTION_CCW: !1
};
cc.macro.SUPPORT_TEXTURE_FORMATS = [ ".pkm", ".pvr", ".webp", ".jpg", ".jpeg", ".bmp", ".png" ];
cc.macro.KEY = {
none: 0,
back: 6,
menu: 18,
backspace: 8,
tab: 9,
enter: 13,
shift: 16,
ctrl: 17,
alt: 18,
pause: 19,
capslock: 20,
escape: 27,
space: 32,
pageup: 33,
pagedown: 34,
end: 35,
home: 36,
left: 37,
up: 38,
right: 39,
down: 40,
select: 41,
insert: 45,
Delete: 46,
0: 48,
1: 49,
2: 50,
3: 51,
4: 52,
5: 53,
6: 54,
7: 55,
8: 56,
9: 57,
a: 65,
b: 66,
c: 67,
d: 68,
e: 69,
f: 70,
g: 71,
h: 72,
i: 73,
j: 74,
k: 75,
l: 76,
m: 77,
n: 78,
o: 79,
p: 80,
q: 81,
r: 82,
s: 83,
t: 84,
u: 85,
v: 86,
w: 87,
x: 88,
y: 89,
z: 90,
num0: 96,
num1: 97,
num2: 98,
num3: 99,
num4: 100,
num5: 101,
num6: 102,
num7: 103,
num8: 104,
num9: 105,
"*": 106,
"+": 107,
"-": 109,
numdel: 110,
"/": 111,
f1: 112,
f2: 113,
f3: 114,
f4: 115,
f5: 116,
f6: 117,
f7: 118,
f8: 119,
f9: 120,
f10: 121,
f11: 122,
f12: 123,
numlock: 144,
scrolllock: 145,
";": 186,
semicolon: 186,
equal: 187,
"=": 187,
",": 188,
comma: 188,
dash: 189,
".": 190,
period: 190,
forwardslash: 191,
grave: 192,
"[": 219,
openbracket: 219,
backslash: 220,
"]": 221,
closebracket: 221,
quote: 222,
dpadLeft: 1e3,
dpadRight: 1001,
dpadUp: 1003,
dpadDown: 1004,
dpadCenter: 1005
};
cc.macro.ImageFormat = cc.Enum({
JPG: 0,
PNG: 1,
TIFF: 2,
WEBP: 3,
PVR: 4,
ETC: 5,
S3TC: 6,
ATITC: 7,
TGA: 8,
RAWDATA: 9,
UNKNOWN: 10
});
cc.macro.BlendFactor = cc.Enum({
ONE: 1,
ZERO: 0,
SRC_ALPHA: 770,
SRC_COLOR: 768,
DST_ALPHA: 772,
DST_COLOR: 774,
ONE_MINUS_SRC_ALPHA: 771,
ONE_MINUS_SRC_COLOR: 769,
ONE_MINUS_DST_ALPHA: 773,
ONE_MINUS_DST_COLOR: 775
});
cc.macro.TextAlignment = cc.Enum({
LEFT: 0,
CENTER: 1,
RIGHT: 2
});
cc.macro.VerticalTextAlignment = cc.Enum({
TOP: 0,
CENTER: 1,
BOTTOM: 2
});
e.exports = cc.macro;
}), {} ],
116: [ (function(t, e, i) {
"use strict";
var n = t("./js"), r = t("./CCClass"), s = 1;
function o() {
this._name = "";
this._objFlags = 0;
}
r.fastDefine("cc.Object", o, {
_name: "",
_objFlags: 0
});
n.value(o, "Flags", {
Destroyed: s,
DontSave: 8,
EditorOnly: 16,
Dirty: 32,
DontDestroy: 64,
PersistentMask: -4192741,
Destroying: 128,
Deactivating: 256,
LockedInEditor: 512,
HideInHierarchy: 1024,
IsPreloadStarted: 8192,
IsOnLoadStarted: 32768,
IsOnLoadCalled: 16384,
IsOnEnableCalled: 2048,
IsStartCalled: 65536,
IsEditorOnEnableCalled: 4096,
IsPositionLocked: 1 << 21,
IsRotationLocked: 1 << 17,
IsScaleLocked: 1 << 18,
IsAnchorLocked: 1 << 19,
IsSizeLocked: 1 << 20
});
var a = [];
function c() {
for (var t = a.length, e = 0; e < t; ++e) {
var i = a[e];
i._objFlags & s || i._destroyImmediate();
}
t === a.length ? a.length = 0 : a.splice(0, t);
0;
}
n.value(o, "_deferredDestroy", c);
0;
var l = o.prototype;
n.getset(l, "name", (function() {
return this._name;
}), (function(t) {
this._name = t;
}), !0);
n.get(l, "isValid", (function() {
return !(this._objFlags & s);
}), !0);
0;
l.destroy = function() {
if (this._objFlags & s) {
cc.warnID(5e3);
return !1;
}
if (4 & this._objFlags) return !1;
this._objFlags |= 4;
a.push(this);
0;
return !0;
};
0;
function u(t, e) {
var i, n = t instanceof cc._BaseNode || t instanceof cc.Component, s = n ? "_id" : null, o = {};
for (i in t) if (t.hasOwnProperty(i)) {
if (i === s) continue;
switch (typeof t[i]) {
case "string":
o[i] = "";
break;

case "object":
case "function":
o[i] = null;
}
}
if (cc.Class._isCCClass(e)) for (var a = cc.Class.Attr.getClassAttrs(e), c = e.__props__, l = 0; l < c.length; l++) {
var u = (i = c[l]) + cc.Class.Attr.DELIMETER + "default";
if (u in a) {
if (n && "_id" === i) continue;
switch (typeof a[u]) {
case "string":
o[i] = "";
break;

case "object":
case "function":
o[i] = null;
break;

case "undefined":
o[i] = void 0;
}
}
}
var h = "";
for (i in o) {
var f;
f = r.IDENTIFIER_RE.test(i) ? "o." + i + "=" : "o[" + r.escapeForJS(i) + "]=";
var d = o[i];
"" === d && (d = '""');
h += f + d + ";\n";
}
return Function("o", h);
}
l._destruct = function() {
var t = this.constructor, e = t.__destruct__;
if (!e) {
e = u(this, t);
n.value(t, "__destruct__", e, !0);
}
e(this);
};
l._onPreDestroy = null;
l._destroyImmediate = function() {
if (this._objFlags & s) cc.errorID(5e3); else {
this._onPreDestroy && this._onPreDestroy();
this._destruct();
this._objFlags |= s;
}
};
0;
l._deserialize = null;
cc.isValid = function(t, e) {
return "object" == typeof t ? !(!t || t._objFlags & (e ? 4 | s : s)) : "undefined" != typeof t;
};
0;
cc.Object = e.exports = o;
}), {
"./CCClass": 110,
"./js": 130
} ],
117: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js");
cc.SAXParser = function() {
if (window.DOMParser) {
this._isSupportDOMParser = !0;
this._parser = new DOMParser();
} else {
this._isSupportDOMParser = !1;
this._parser = null;
}
};
cc.SAXParser.prototype = {
constructor: cc.SAXParser,
parse: function(t) {
return this._parseXML(t);
},
_parseXML: function(t) {
var e;
if (this._isSupportDOMParser) e = this._parser.parseFromString(t, "text/xml"); else {
(e = new ActiveXObject("Microsoft.XMLDOM")).async = "false";
e.loadXML(t);
}
return e;
}
};
cc.PlistParser = function() {
cc.SAXParser.call(this);
};
n.extend(cc.PlistParser, cc.SAXParser);
n.mixin(cc.PlistParser.prototype, {
parse: function(t) {
var e = this._parseXML(t), i = e.documentElement;
if ("plist" !== i.tagName) {
cc.warnID(5100);
return {};
}
for (var n = null, r = 0, s = i.childNodes.length; r < s && 1 !== (n = i.childNodes[r]).nodeType; r++) ;
e = null;
return this._parseNode(n);
},
_parseNode: function(t) {
var e = null, i = t.tagName;
if ("dict" === i) e = this._parseDict(t); else if ("array" === i) e = this._parseArray(t); else if ("string" === i) if (1 === t.childNodes.length) e = t.firstChild.nodeValue; else {
e = "";
for (var n = 0; n < t.childNodes.length; n++) e += t.childNodes[n].nodeValue;
} else "false" === i ? e = !1 : "true" === i ? e = !0 : "real" === i ? e = parseFloat(t.firstChild.nodeValue) : "integer" === i && (e = parseInt(t.firstChild.nodeValue, 10));
return e;
},
_parseArray: function(t) {
for (var e = [], i = 0, n = t.childNodes.length; i < n; i++) {
var r = t.childNodes[i];
1 === r.nodeType && e.push(this._parseNode(r));
}
return e;
},
_parseDict: function(t) {
for (var e = {}, i = null, n = 0, r = t.childNodes.length; n < r; n++) {
var s = t.childNodes[n];
1 === s.nodeType && ("key" === s.tagName ? i = s.firstChild.nodeValue : e[i] = this._parseNode(s));
}
return e;
}
});
cc.saxParser = new cc.SAXParser();
cc.plistParser = new cc.PlistParser();
e.exports = {
saxParser: cc.saxParser,
plistParser: cc.plistParser
};
}), {
"../platform/js": 130
} ],
118: [ (function(t, e, i) {
"use strict";
cc.screen = {
_supportsFullScreen: !1,
_onfullscreenchange: null,
_onfullscreenerror: null,
_preOnFullScreenChange: null,
_preOnFullScreenError: null,
_preOnTouch: null,
_touchEvent: "",
_fn: null,
_fnMap: [ [ "requestFullscreen", "exitFullscreen", "fullscreenchange", "fullscreenEnabled", "fullscreenElement", "fullscreenerror" ], [ "requestFullScreen", "exitFullScreen", "fullScreenchange", "fullScreenEnabled", "fullScreenElement", "fullscreenerror" ], [ "webkitRequestFullScreen", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitIsFullScreen", "webkitCurrentFullScreenElement", "webkitfullscreenerror" ], [ "mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozFullScreen", "mozFullScreenElement", "mozfullscreenerror" ], [ "msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "msFullscreenEnabled", "msFullscreenElement", "msfullscreenerror" ] ],
init: function() {
this._fn = {};
var t, e, i, n, r = this._fnMap;
for (t = 0, e = r.length; t < e; t++) if ((i = r[t]) && "undefined" != typeof document[i[1]]) {
for (t = 0, n = i.length; t < n; t++) this._fn[r[0][t]] = i[t];
break;
}
this._supportsFullScreen = void 0 !== this._fn.requestFullscreen;
this._touchEvent = "ontouchend" in window ? "touchend" : "mousedown";
},
fullScreen: function() {
return !!this._supportsFullScreen && !!(document[this._fn.fullscreenElement] || document[this._fn.webkitFullscreenElement] || document[this._fn.mozFullScreenElement]);
},
requestFullScreen: function(t, e, i) {
if (t && "video" === t.tagName.toLowerCase()) {
if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser && t.readyState > 0) {
t.webkitEnterFullscreen && t.webkitEnterFullscreen();
return;
}
t.setAttribute("x5-video-player-fullscreen", "true");
}
if (this._supportsFullScreen) {
t = t || document.documentElement;
if (e) {
var n = this._fn.fullscreenchange;
this._onfullscreenchange && document.removeEventListener(n, this._onfullscreenchange);
this._onfullscreenchange = e;
document.addEventListener(n, e, !1);
}
if (i) {
var r = this._fn.fullscreenerror;
this._onfullscreenerror && document.removeEventListener(r, this._onfullscreenerror);
this._onfullscreenerror = i;
document.addEventListener(r, i, {
once: !0
});
}
t[this._fn.requestFullscreen]();
}
},
exitFullScreen: function(t) {
if (t && "video" === t.tagName.toLowerCase()) {
if (cc.sys.os === cc.sys.OS_IOS && cc.sys.isBrowser) {
t.webkitExitFullscreen && t.webkitExitFullscreen();
return;
}
t.setAttribute("x5-video-player-fullscreen", "false");
}
return !this._supportsFullScreen || document[this._fn.exitFullscreen]();
},
autoFullScreen: function(t, e) {
t = t || document.body;
this._ensureFullScreen(t, e);
this.requestFullScreen(t, e);
},
disableAutoFullScreen: function(t) {
var e = cc.game.canvas || t, i = this._touchEvent;
if (this._preOnTouch) {
e.removeEventListener(i, this._preOnTouch);
this._preOnTouch = null;
}
},
_ensureFullScreen: function(t, e) {
var i = this, n = cc.game.canvas || t, r = this._fn.fullscreenerror, s = this._touchEvent;
function o() {
i._preOnFullScreenError = null;
i._preOnTouch && n.removeEventListener(s, i._preOnTouch);
i._preOnTouch = function() {
i._preOnTouch = null;
i.requestFullScreen(t, e);
};
n.addEventListener(s, i._preOnTouch, {
once: !0
});
}
this._preOnFullScreenError && t.removeEventListener(r, this._preOnFullScreenError);
this._preOnFullScreenError = o;
t.addEventListener(r, o, {
once: !0
});
}
};
cc.screen.init();
}), {} ],
119: [ (function(t, e, i) {
"use strict";
var n = void 0, r = "qgame" === (n = window._CCSettings ? _CCSettings.platform : void 0), s = "quickgame" === n, o = "huawei" === n, a = "jkw-game" === n, c = "undefined" == typeof window ? global : window;
var l = cc && cc.sys ? cc.sys : (function() {
cc.sys = {};
var t = cc.sys;
t.LANGUAGE_ENGLISH = "en";
t.LANGUAGE_CHINESE = "zh";
t.LANGUAGE_FRENCH = "fr";
t.LANGUAGE_ITALIAN = "it";
t.LANGUAGE_GERMAN = "de";
t.LANGUAGE_SPANISH = "es";
t.LANGUAGE_DUTCH = "du";
t.LANGUAGE_RUSSIAN = "ru";
t.LANGUAGE_KOREAN = "ko";
t.LANGUAGE_JAPANESE = "ja";
t.LANGUAGE_HUNGARIAN = "hu";
t.LANGUAGE_PORTUGUESE = "pt";
t.LANGUAGE_ARABIC = "ar";
t.LANGUAGE_NORWEGIAN = "no";
t.LANGUAGE_POLISH = "pl";
t.LANGUAGE_TURKISH = "tr";
t.LANGUAGE_UKRAINIAN = "uk";
t.LANGUAGE_ROMANIAN = "ro";
t.LANGUAGE_BULGARIAN = "bg";
t.LANGUAGE_UNKNOWN = "unknown";
t.OS_IOS = "iOS";
t.OS_ANDROID = "Android";
t.OS_WINDOWS = "Windows";
t.OS_MARMALADE = "Marmalade";
t.OS_LINUX = "Linux";
t.OS_BADA = "Bada";
t.OS_BLACKBERRY = "Blackberry";
t.OS_OSX = "OS X";
t.OS_WP8 = "WP8";
t.OS_WINRT = "WINRT";
t.OS_UNKNOWN = "Unknown";
t.UNKNOWN = -1;
t.WIN32 = 0;
t.LINUX = 1;
t.MACOS = 2;
t.ANDROID = 3;
t.IPHONE = 4;
t.IPAD = 5;
t.BLACKBERRY = 6;
t.NACL = 7;
t.EMSCRIPTEN = 8;
t.TIZEN = 9;
t.WINRT = 10;
t.WP8 = 11;
t.MOBILE_BROWSER = 100;
t.DESKTOP_BROWSER = 101;
t.EDITOR_PAGE = 102;
t.EDITOR_CORE = 103;
t.WECHAT_GAME = 104;
t.QQ_PLAY = 105;
t.FB_PLAYABLE_ADS = 106;
t.BAIDU_GAME = 107;
t.VIVO_GAME = 108;
t.OPPO_GAME = 109;
t.HUAWEI_GAME = 110;
t.XIAOMI_GAME = 111;
t.JKW_GAME = 112;
t.ALIPAY_GAME = 113;
t.WECHAT_GAME_SUB = 114;
t.BAIDU_GAME_SUB = 115;
t.BROWSER_TYPE_WECHAT = "wechat";
t.BROWSER_TYPE_WECHAT_GAME = "wechatgame";
t.BROWSER_TYPE_WECHAT_GAME_SUB = "wechatgamesub";
t.BROWSER_TYPE_BAIDU_GAME = "baidugame";
t.BROWSER_TYPE_BAIDU_GAME_SUB = "baidugamesub";
t.BROWSER_TYPE_XIAOMI_GAME = "xiaomigame";
t.BROWSER_TYPE_ALIPAY_GAME = "alipaygame";
t.BROWSER_TYPE_QQ_PLAY = "qqplay";
t.BROWSER_TYPE_ANDROID = "androidbrowser";
t.BROWSER_TYPE_IE = "ie";
t.BROWSER_TYPE_EDGE = "edge";
t.BROWSER_TYPE_QQ = "qqbrowser";
t.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
t.BROWSER_TYPE_UC = "ucbrowser";
t.BROWSER_TYPE_UCBS = "ucbs";
t.BROWSER_TYPE_360 = "360browser";
t.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
t.BROWSER_TYPE_BAIDU = "baidubrowser";
t.BROWSER_TYPE_MAXTHON = "maxthon";
t.BROWSER_TYPE_OPERA = "opera";
t.BROWSER_TYPE_OUPENG = "oupeng";
t.BROWSER_TYPE_MIUI = "miuibrowser";
t.BROWSER_TYPE_FIREFOX = "firefox";
t.BROWSER_TYPE_SAFARI = "safari";
t.BROWSER_TYPE_CHROME = "chrome";
t.BROWSER_TYPE_LIEBAO = "liebao";
t.BROWSER_TYPE_QZONE = "qzone";
t.BROWSER_TYPE_SOUGOU = "sogou";
t.BROWSER_TYPE_UNKNOWN = "unknown";
t.isNative = !0;
t.isBrowser = "object" == typeof window && "object" == typeof document && !1;
t.glExtension = function(t) {
return !!cc.renderer.device.ext(t);
};
t.getMaxJointMatrixSize = function() {
if (!t._maxJointMatrixSize) {
var e = cc.game._renderContext, i = Math.floor(e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS) / 4) - 10;
t._maxJointMatrixSize = i < 50 ? 0 : 50;
}
return t._maxJointMatrixSize;
};
if (c.__globalAdapter && c.__globalAdapter.adaptSys) c.__globalAdapter.adaptSys(t); else {
var e, i = void 0;
i = r ? t.VIVO_GAME : s ? t.OPPO_GAME : o ? t.HUAWEI_GAME : a ? t.JKW_GAME : __getPlatform();
t.platform = i;
t.isMobile = i === t.ANDROID || i === t.IPAD || i === t.IPHONE || i === t.WP8 || i === t.TIZEN || i === t.BLACKBERRY || i === t.XIAOMI_GAME || r || s || o || a;
t.os = __getOS();
t.language = __getCurrentLanguage();
e = __getCurrentLanguageCode();
t.languageCode = e ? e.toLowerCase() : void 0;
t.osVersion = __getOSVersion();
t.osMainVersion = parseInt(t.osVersion);
t.browserType = null;
t.browserVersion = null;
var n, l = window.innerWidth, u = window.innerHeight, h = window.devicePixelRatio || 1;
t.windowPixelResolution = {
width: h * l,
height: h * u
};
t.localStorage = window.localStorage;
n = t.capabilities = {
canvas: !1,
opengl: !0,
webp: !0
};
if (t.isMobile) {
n.accelerometer = !0;
n.touches = !0;
} else {
n.keyboard = !0;
n.mouse = !0;
n.touches = !1;
}
t.__audioSupport = {
ONLY_ONE: !1,
WEB_AUDIO: !1,
DELAY_CREATE_CTX: !1,
format: [ ".mp3" ]
};
}
t.NetworkType = {
NONE: 0,
LAN: 1,
WWAN: 2
};
t.getNetworkType = function() {
return t.NetworkType.LAN;
};
t.getBatteryLevel = function() {
return 1;
};
t.garbageCollect = function() {};
t.restartVM = function() {};
t.getSafeAreaRect = function() {
var t = cc.view.getVisibleSize();
return cc.rect(0, 0, t.width, t.height);
};
t.isObjectValid = function(t) {
return !!t;
};
t.dump = function() {
var t = "";
t += "isMobile : " + this.isMobile + "\r\n";
t += "language : " + this.language + "\r\n";
t += "browserType : " + this.browserType + "\r\n";
t += "browserVersion : " + this.browserVersion + "\r\n";
t += "capabilities : " + JSON.stringify(this.capabilities) + "\r\n";
t += "os : " + this.os + "\r\n";
t += "osVersion : " + this.osVersion + "\r\n";
t += "platform : " + this.platform + "\r\n";
t += "Using " + (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? "WEBGL" : "CANVAS") + " renderer.\r\n";
cc.log(t);
};
t.openURL = function(t) {
jsb.openURL(t);
};
t.now = function() {
return Date.now ? Date.now() : +new Date();
};
return t;
})();
e.exports = l;
}), {} ],
120: [ (function(t, e, i) {
"use strict";
var n = t("../event/event-target"), r = t("../platform/js"), s = t("../renderer");
t("../platform/CCClass");
var o = {
init: function() {
this.html = document.getElementsByTagName("html")[0];
},
availWidth: function(t) {
return t && t !== this.html ? t.clientWidth : window.innerWidth;
},
availHeight: function(t) {
return t && t !== this.html ? t.clientHeight : window.innerHeight;
},
meta: {
width: "device-width"
},
adaptationType: cc.sys.browserType
};
cc.sys.os === cc.sys.OS_IOS && (o.adaptationType = cc.sys.BROWSER_TYPE_SAFARI);
switch (o.adaptationType) {
case cc.sys.BROWSER_TYPE_SAFARI:
o.meta["minimal-ui"] = "true";

case cc.sys.BROWSER_TYPE_SOUGOU:
case cc.sys.BROWSER_TYPE_UC:
o.availWidth = function(t) {
return t.clientWidth;
};
o.availHeight = function(t) {
return t.clientHeight;
};
}
var a = null, c = function() {
n.call(this);
var t = this, e = cc.ContainerStrategy, i = cc.ContentStrategy;
o.init(this);
t._frameSize = cc.size(0, 0);
t._designResolutionSize = cc.size(0, 0);
t._originalDesignResolutionSize = cc.size(0, 0);
t._scaleX = 1;
t._scaleY = 1;
t._viewportRect = cc.rect(0, 0, 0, 0);
t._visibleRect = cc.rect(0, 0, 0, 0);
t._autoFullScreen = !1;
t._devicePixelRatio = 1;
t._maxPixelRatio = 2;
t._retinaEnabled = !1;
t._resizeCallback = null;
t._resizing = !1;
t._resizeWithBrowserSize = !1;
t._orientationChanging = !0;
t._isRotated = !1;
t._orientation = cc.macro.ORIENTATION_AUTO;
t._isAdjustViewport = !0;
t._antiAliasEnabled = !1;
t._resolutionPolicy = null;
t._rpExactFit = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.EXACT_FIT);
t._rpShowAll = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.SHOW_ALL);
t._rpNoBorder = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.NO_BORDER);
t._rpFixedHeight = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.FIXED_HEIGHT);
t._rpFixedWidth = new cc.ResolutionPolicy(e.EQUAL_TO_FRAME, i.FIXED_WIDTH);
cc.game.once(cc.game.EVENT_ENGINE_INITED, this.init, this);
};
cc.js.extend(c, n);
cc.js.mixin(c.prototype, {
init: function() {
this._initFrameSize();
this.enableAntiAlias(!0);
var t = cc.game.canvas.width, e = cc.game.canvas.height;
this._designResolutionSize.width = t;
this._designResolutionSize.height = e;
this._originalDesignResolutionSize.width = t;
this._originalDesignResolutionSize.height = e;
this._viewportRect.width = t;
this._viewportRect.height = e;
this._visibleRect.width = t;
this._visibleRect.height = e;
cc.winSize.width = this._visibleRect.width;
cc.winSize.height = this._visibleRect.height;
cc.visibleRect && cc.visibleRect.init(this._visibleRect);
},
_resizeEvent: function(t) {
var e, i = (e = this.setDesignResolutionSize ? this : cc.view)._frameSize.width, n = e._frameSize.height, r = e._isRotated;
if (cc.sys.isMobile) {
var s = cc.game.container.style, o = s.margin;
s.margin = "0";
s.display = "none";
e._initFrameSize();
s.margin = o;
s.display = "block";
} else e._initFrameSize();
if (!0 === t || e._isRotated !== r || e._frameSize.width !== i || e._frameSize.height !== n) {
var a = e._originalDesignResolutionSize.width, c = e._originalDesignResolutionSize.height;
e._resizing = !0;
a > 0 && e.setDesignResolutionSize(a, c, e._resolutionPolicy);
e._resizing = !1;
e.emit("canvas-resize");
e._resizeCallback && e._resizeCallback.call();
}
},
_orientationChange: function() {
cc.view._orientationChanging = !0;
cc.view._resizeEvent();
},
resizeWithBrowserSize: function(t) {
if (t) {
if (!this._resizeWithBrowserSize) {
this._resizeWithBrowserSize = !0;
window.addEventListener("resize", this._resizeEvent);
window.addEventListener("orientationchange", this._orientationChange);
}
} else if (this._resizeWithBrowserSize) {
this._resizeWithBrowserSize = !1;
window.removeEventListener("resize", this._resizeEvent);
window.removeEventListener("orientationchange", this._orientationChange);
}
},
setResizeCallback: function(t) {
0;
"function" != typeof t && null != t || (this._resizeCallback = t);
},
setOrientation: function(t) {
if ((t &= cc.macro.ORIENTATION_AUTO) && this._orientation !== t) {
this._orientation = t;
var e = this._originalDesignResolutionSize.width, i = this._originalDesignResolutionSize.height;
this.setDesignResolutionSize(e, i, this._resolutionPolicy);
}
},
_initFrameSize: function() {
var t = this._frameSize, e = o.availWidth(cc.game.frame), i = o.availHeight(cc.game.frame), n = e >= i;
if (!cc.sys.isMobile || n && this._orientation & cc.macro.ORIENTATION_LANDSCAPE || !n && this._orientation & cc.macro.ORIENTATION_PORTRAIT) {
t.width = e;
t.height = i;
cc.game.container.style["-webkit-transform"] = "rotate(0deg)";
cc.game.container.style.transform = "rotate(0deg)";
this._isRotated = !1;
} else {
t.width = i;
t.height = e;
cc.game.container.style["-webkit-transform"] = "rotate(90deg)";
cc.game.container.style.transform = "rotate(90deg)";
cc.game.container.style["-webkit-transform-origin"] = "0px 0px 0px";
cc.game.container.style.transformOrigin = "0px 0px 0px";
this._isRotated = !0;
}
this._orientationChanging && setTimeout((function() {
cc.view._orientationChanging = !1;
}), 1e3);
},
_setViewportMeta: function(t, e) {
var i = document.getElementById("cocosMetaElement");
i && e && document.head.removeChild(i);
var n, r, s, o = document.getElementsByName("viewport"), a = o ? o[0] : null;
n = a ? a.content : "";
(i = i || document.createElement("meta")).id = "cocosMetaElement";
i.name = "viewport";
i.content = "";
for (r in t) if (-1 == n.indexOf(r)) n += "," + r + "=" + t[r]; else if (e) {
s = new RegExp(r + "s*=s*[^,]+");
n.replace(s, r + "=" + t[r]);
}
/^,/.test(n) && (n = n.substr(1));
i.content = n;
a && (a.content = n);
document.head.appendChild(i);
},
_adjustViewportMeta: function() {
this._isAdjustViewport, 0;
},
adjustViewportMeta: function(t) {
this._isAdjustViewport = t;
},
enableRetina: function(t) {
this._retinaEnabled = !!t;
},
isRetinaEnabled: function() {
return this._retinaEnabled;
},
enableAntiAlias: function(t) {
if (this._antiAliasEnabled !== t) {
this._antiAliasEnabled = t;
if (cc.game.renderType === cc.game.RENDER_TYPE_WEBGL) {
var e = cc.loader._cache;
for (var i in e) {
var n = e[i], r = n && n.content instanceof cc.Texture2D ? n.content : null;
if (r) {
var s = cc.Texture2D.Filter;
t ? r.setFilters(s.LINEAR, s.LINEAR) : r.setFilters(s.NEAREST, s.NEAREST);
}
}
} else if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
var o = cc.game.canvas.getContext("2d");
o.imageSmoothingEnabled = t;
o.mozImageSmoothingEnabled = t;
}
}
},
isAntiAliasEnabled: function() {
return this._antiAliasEnabled;
},
enableAutoFullScreen: function(t) {
if (t && t !== this._autoFullScreen && cc.sys.isMobile) {
this._autoFullScreen = !0;
cc.screen.autoFullScreen(cc.game.frame);
} else {
this._autoFullScreen = !1;
cc.screen.disableAutoFullScreen(cc.game.frame);
}
},
isAutoFullScreenEnabled: function() {
return this._autoFullScreen;
},
setCanvasSize: function(t, e) {
var i = cc.game.canvas, n = cc.game.container;
i.width = t * this._devicePixelRatio;
i.height = e * this._devicePixelRatio;
i.style.width = t + "px";
i.style.height = e + "px";
n.style.width = t + "px";
n.style.height = e + "px";
this._resizeEvent();
},
getCanvasSize: function() {
return cc.size(cc.game.canvas.width, cc.game.canvas.height);
},
getFrameSize: function() {
return cc.size(this._frameSize.width, this._frameSize.height);
},
setFrameSize: function(t, e) {
this._frameSize.width = t;
this._frameSize.height = e;
cc.game.frame.style.width = t + "px";
cc.game.frame.style.height = e + "px";
this._resizeEvent(!0);
},
getVisibleSize: function() {
return cc.size(this._visibleRect.width, this._visibleRect.height);
},
getVisibleSizeInPixel: function() {
return cc.size(this._visibleRect.width * this._scaleX, this._visibleRect.height * this._scaleY);
},
getVisibleOrigin: function() {
return cc.v2(this._visibleRect.x, this._visibleRect.y);
},
getVisibleOriginInPixel: function() {
return cc.v2(this._visibleRect.x * this._scaleX, this._visibleRect.y * this._scaleY);
},
getResolutionPolicy: function() {
return this._resolutionPolicy;
},
setResolutionPolicy: function(t) {
var e = this;
if (t instanceof cc.ResolutionPolicy) e._resolutionPolicy = t; else {
var i = cc.ResolutionPolicy;
t === i.EXACT_FIT && (e._resolutionPolicy = e._rpExactFit);
t === i.SHOW_ALL && (e._resolutionPolicy = e._rpShowAll);
t === i.NO_BORDER && (e._resolutionPolicy = e._rpNoBorder);
t === i.FIXED_HEIGHT && (e._resolutionPolicy = e._rpFixedHeight);
t === i.FIXED_WIDTH && (e._resolutionPolicy = e._rpFixedWidth);
}
},
setDesignResolutionSize: function(t, e, i) {
if (t > 0 || e > 0) {
this.setResolutionPolicy(i);
var n = this._resolutionPolicy;
n && n.preApply(this);
cc.sys.isMobile && this._adjustViewportMeta();
this._orientationChanging = !0;
this._resizing || this._initFrameSize();
if (n) {
this._originalDesignResolutionSize.width = this._designResolutionSize.width = t;
this._originalDesignResolutionSize.height = this._designResolutionSize.height = e;
var r = n.apply(this, this._designResolutionSize);
if (r.scale && 2 === r.scale.length) {
this._scaleX = r.scale[0];
this._scaleY = r.scale[1];
}
if (r.viewport) {
var o = this._viewportRect, a = this._visibleRect, c = r.viewport;
o.x = c.x;
o.y = c.y;
o.width = c.width;
o.height = c.height;
a.x = 0;
a.y = 0;
a.width = c.width / this._scaleX;
a.height = c.height / this._scaleY;
}
n.postApply(this);
cc.winSize.width = this._visibleRect.width;
cc.winSize.height = this._visibleRect.height;
cc.visibleRect && cc.visibleRect.init(this._visibleRect);
s.updateCameraViewport();
_cc.inputManager._updateCanvasBoundingRect();
this.emit("design-resolution-changed");
} else cc.logID(2201);
} else cc.logID(2200);
},
getDesignResolutionSize: function() {
return cc.size(this._designResolutionSize.width, this._designResolutionSize.height);
},
setRealPixelResolution: function(t, e, i) {
0;
this.setDesignResolutionSize(t, e, i);
},
setViewportInPoints: function(t, e, i, n) {
var r = this._scaleX, s = this._scaleY;
cc.game._renderContext.viewport(t * r + this._viewportRect.x, e * s + this._viewportRect.y, i * r, n * s);
},
setScissorInPoints: function(t, e, i, n) {
var r = this._scaleX, s = this._scaleY, o = Math.ceil(t * r + this._viewportRect.x), c = Math.ceil(e * s + this._viewportRect.y), l = Math.ceil(i * r), u = Math.ceil(n * s), h = cc.game._renderContext;
if (!a) {
var f = h.getParameter(h.SCISSOR_BOX);
a = cc.rect(f[0], f[1], f[2], f[3]);
}
if (a.x !== o || a.y !== c || a.width !== l || a.height !== u) {
a.x = o;
a.y = c;
a.width = l;
a.height = u;
h.scissor(o, c, l, u);
}
},
isScissorEnabled: function() {
return cc.game._renderContext.isEnabled(gl.SCISSOR_TEST);
},
getScissorRect: function() {
if (!a) {
var t = gl.getParameter(gl.SCISSOR_BOX);
a = cc.rect(t[0], t[1], t[2], t[3]);
}
var e = 1 / this._scaleX, i = 1 / this._scaleY;
return cc.rect((a.x - this._viewportRect.x) * e, (a.y - this._viewportRect.y) * i, a.width * e, a.height * i);
},
getViewportRect: function() {
return this._viewportRect;
},
getScaleX: function() {
return this._scaleX;
},
getScaleY: function() {
return this._scaleY;
},
getDevicePixelRatio: function() {
return this._devicePixelRatio;
},
convertToLocationInView: function(t, e, i, n) {
var r = n || cc.v2(), s = i.adjustedLeft ? i.adjustedLeft : i.left, o = i.adjustedTop ? i.adjustedTop : i.top, a = this._devicePixelRatio * (t - s), c = this._devicePixelRatio * (o + i.height - e);
if (this._isRotated) {
r.x = cc.game.canvas.width - c;
r.y = a;
} else {
r.x = a;
r.y = c;
}
return r;
},
_convertMouseToLocationInView: function(t, e) {
var i = this._viewportRect;
t.x = (this._devicePixelRatio * (t.x - e.left) - i.x) / this._scaleX;
t.y = (this._devicePixelRatio * (e.top + e.height - t.y) - i.y) / this._scaleY;
},
_convertPointWithScale: function(t) {
var e = this._viewportRect;
t.x = (t.x - e.x) / this._scaleX;
t.y = (t.y - e.y) / this._scaleY;
},
_convertTouchesWithScale: function(t) {
for (var e, i, n, r = this._viewportRect, s = this._scaleX, o = this._scaleY, a = 0; a < t.length; a++) {
i = (e = t[a])._point;
n = e._prevPoint;
i.x = (i.x - r.x) / s;
i.y = (i.y - r.y) / o;
n.x = (n.x - r.x) / s;
n.y = (n.y - r.y) / o;
}
}
});
cc.ContainerStrategy = cc.Class({
name: "ContainerStrategy",
preApply: function(t) {},
apply: function(t, e) {},
postApply: function(t) {},
_setupContainer: function(t, e, i) {
var n = cc.game.canvas;
this._setupStyle(t, e, i);
var r = t._devicePixelRatio = 1;
t.isRetinaEnabled() && (r = t._devicePixelRatio = Math.min(t._maxPixelRatio, window.devicePixelRatio || 1));
n.width = e * r;
n.height = i * r;
},
_setupStyle: function(t, e, i) {
var n = cc.game.canvas, r = cc.game.container;
if (cc.sys.os === cc.sys.OS_ANDROID) {
document.body.style.width = (t._isRotated ? i : e) + "px";
document.body.style.height = (t._isRotated ? e : i) + "px";
}
r.style.width = n.style.width = e + "px";
r.style.height = n.style.height = i + "px";
},
_fixContainer: function() {
document.body.insertBefore(cc.game.container, document.body.firstChild);
var t = document.body.style;
t.width = window.innerWidth + "px";
t.height = window.innerHeight + "px";
t.overflow = "hidden";
var e = cc.game.container.style;
e.position = "fixed";
e.left = e.top = "0px";
document.body.scrollTop = 0;
}
});
cc.ContentStrategy = cc.Class({
name: "ContentStrategy",
ctor: function() {
this._result = {
scale: [ 1, 1 ],
viewport: null
};
},
_buildResult: function(t, e, i, n, r, s) {
Math.abs(t - i) < 2 && (i = t);
Math.abs(e - n) < 2 && (n = e);
var o = cc.rect((t - i) / 2, (e - n) / 2, i, n);
cc.game.renderType, cc.game.RENDER_TYPE_CANVAS;
this._result.scale = [ r, s ];
this._result.viewport = o;
return this._result;
},
preApply: function(t) {},
apply: function(t, e) {
return {
scale: [ 1, 1 ]
};
},
postApply: function(t) {}
});
(function() {
var t = cc.Class({
name: "EqualToFrame",
extends: cc.ContainerStrategy,
apply: function(t) {
var e = t._frameSize.height, i = cc.game.container.style;
this._setupContainer(t, t._frameSize.width, t._frameSize.height);
t._isRotated ? i.margin = "0 0 0 " + e + "px" : i.margin = "0px";
i.padding = "0px";
}
}), e = cc.Class({
name: "ProportionalToFrame",
extends: cc.ContainerStrategy,
apply: function(t, e) {
var i, n, r = t._frameSize.width, s = t._frameSize.height, o = cc.game.container.style, a = e.width, c = e.height, l = r / a, u = s / c;
l < u ? (i = r, n = c * l) : (i = a * u, n = s);
var h = Math.round((r - i) / 2), f = Math.round((s - n) / 2);
i = r - 2 * h;
n = s - 2 * f;
this._setupContainer(t, i, n);
t._isRotated ? o.margin = "0 0 0 " + s + "px" : o.margin = "0px";
o.paddingLeft = h + "px";
o.paddingRight = h + "px";
o.paddingTop = f + "px";
o.paddingBottom = f + "px";
}
}), i = (cc.Class({
name: "EqualToWindow",
extends: t,
preApply: function(t) {
this._super(t);
cc.game.frame = document.documentElement;
},
apply: function(t) {
this._super(t);
this._fixContainer();
}
}), cc.Class({
name: "ProportionalToWindow",
extends: e,
preApply: function(t) {
this._super(t);
cc.game.frame = document.documentElement;
},
apply: function(t, e) {
this._super(t, e);
this._fixContainer();
}
}), cc.Class({
name: "OriginalContainer",
extends: cc.ContainerStrategy,
apply: function(t) {
this._setupContainer(t, cc.game.canvas.width, cc.game.canvas.height);
}
})), n = ("undefined" == typeof window ? global : window).__globalAdapter;
if (n) {
n.adaptContainerStrategy && n.adaptContainerStrategy(cc.ContainerStrategy.prototype);
n.adaptView && n.adaptView(c.prototype);
}
cc.ContainerStrategy.EQUAL_TO_FRAME = new t();
cc.ContainerStrategy.PROPORTION_TO_FRAME = new e();
cc.ContainerStrategy.ORIGINAL_CONTAINER = new i();
var r = cc.Class({
name: "ExactFit",
extends: cc.ContentStrategy,
apply: function(t, e) {
var i = cc.game.canvas.width, n = cc.game.canvas.height, r = i / e.width, s = n / e.height;
return this._buildResult(i, n, i, n, r, s);
}
}), s = cc.Class({
name: "ShowAll",
extends: cc.ContentStrategy,
apply: function(t, e) {
var i, n, r = cc.game.canvas.width, s = cc.game.canvas.height, o = e.width, a = e.height, c = r / o, l = s / a, u = 0;
c < l ? (i = r, n = a * (u = c)) : (i = o * (u = l), n = s);
return this._buildResult(r, s, i, n, u, u);
}
}), o = cc.Class({
name: "NoBorder",
extends: cc.ContentStrategy,
apply: function(t, e) {
var i, n, r, s = cc.game.canvas.width, o = cc.game.canvas.height, a = e.width, c = e.height, l = s / a, u = o / c;
l < u ? (n = a * (i = u), r = o) : (n = s, r = c * (i = l));
return this._buildResult(s, o, n, r, i, i);
}
}), a = cc.Class({
name: "FixedHeight",
extends: cc.ContentStrategy,
apply: function(t, e) {
var i = cc.game.canvas.width, n = cc.game.canvas.height, r = n / e.height, s = i, o = n;
return this._buildResult(i, n, s, o, r, r);
}
}), l = cc.Class({
name: "FixedWidth",
extends: cc.ContentStrategy,
apply: function(t, e) {
var i = cc.game.canvas.width, n = cc.game.canvas.height, r = i / e.width, s = i, o = n;
return this._buildResult(i, n, s, o, r, r);
}
});
cc.ContentStrategy.EXACT_FIT = new r();
cc.ContentStrategy.SHOW_ALL = new s();
cc.ContentStrategy.NO_BORDER = new o();
cc.ContentStrategy.FIXED_HEIGHT = new a();
cc.ContentStrategy.FIXED_WIDTH = new l();
})();
cc.ResolutionPolicy = cc.Class({
name: "cc.ResolutionPolicy",
ctor: function(t, e) {
this._containerStrategy = null;
this._contentStrategy = null;
this.setContainerStrategy(t);
this.setContentStrategy(e);
},
preApply: function(t) {
this._containerStrategy.preApply(t);
this._contentStrategy.preApply(t);
},
apply: function(t, e) {
this._containerStrategy.apply(t, e);
return this._contentStrategy.apply(t, e);
},
postApply: function(t) {
this._containerStrategy.postApply(t);
this._contentStrategy.postApply(t);
},
setContainerStrategy: function(t) {
t instanceof cc.ContainerStrategy && (this._containerStrategy = t);
},
setContentStrategy: function(t) {
t instanceof cc.ContentStrategy && (this._contentStrategy = t);
}
});
r.get(cc.ResolutionPolicy.prototype, "canvasSize", (function() {
return cc.v2(cc.game.canvas.width, cc.game.canvas.height);
}));
cc.ResolutionPolicy.EXACT_FIT = 0;
cc.ResolutionPolicy.NO_BORDER = 1;
cc.ResolutionPolicy.SHOW_ALL = 2;
cc.ResolutionPolicy.FIXED_HEIGHT = 3;
cc.ResolutionPolicy.FIXED_WIDTH = 4;
cc.ResolutionPolicy.UNKNOWN = 5;
cc.view = new c();
cc.winSize = cc.size();
e.exports = cc.view;
}), {
"../event/event-target": 77,
"../platform/CCClass": 110,
"../platform/js": 130,
"../renderer": 155
} ],
121: [ (function(t, e, i) {
"use strict";
cc.visibleRect = {
topLeft: cc.v2(0, 0),
topRight: cc.v2(0, 0),
top: cc.v2(0, 0),
bottomLeft: cc.v2(0, 0),
bottomRight: cc.v2(0, 0),
bottom: cc.v2(0, 0),
center: cc.v2(0, 0),
left: cc.v2(0, 0),
right: cc.v2(0, 0),
width: 0,
height: 0,
init: function(t) {
var e = this.width = t.width, i = this.height = t.height, n = t.x, r = t.y, s = r + i, o = n + e;
this.topLeft.x = n;
this.topLeft.y = s;
this.topRight.x = o;
this.topRight.y = s;
this.top.x = n + e / 2;
this.top.y = s;
this.bottomLeft.x = n;
this.bottomLeft.y = r;
this.bottomRight.x = o;
this.bottomRight.y = r;
this.bottom.x = n + e / 2;
this.bottom.y = r;
this.center.x = n + e / 2;
this.center.y = r + i / 2;
this.left.x = n;
this.left.y = r + i / 2;
this.right.x = o;
this.right.y = r + i / 2;
}
};
}), {} ],
122: [ (function(t, e, i) {
"use strict";
var n = t("./js"), r = (t("./utils").isPlainEmptyObj_DEV, "$_$");
function s(t, e) {
var i = e ? Object.create(e) : {};
n.value(t, "__attrs__", i);
return i;
}
function o(t) {
if ("function" != typeof t) {
return s(t, c(t.constructor));
}
for (var e, i = cc.Class.getInheritanceChain(t), n = i.length - 1; n >= 0; n--) {
var r = i[n];
r.hasOwnProperty("__attrs__") && r.__attrs__ || s(r, (e = i[n + 1]) && e.__attrs__);
}
s(t, (e = i[0]) && e.__attrs__);
return t.__attrs__;
}
function a(t, e, i) {
var n = c(t), s = e + r, o = {};
for (var a in n) a.startsWith(s) && (o[a.slice(s.length)] = n[a]);
return o;
}
function c(t) {
return t.hasOwnProperty("__attrs__") && t.__attrs__ || o(t);
}
function l(t, e) {
this.name = t;
this.default = e;
}
l.prototype.toString = function() {
return this.name;
};
cc.Integer = new l("Integer", 0);
cc.Float = new l("Float", 0);
0;
cc.Boolean = new l("Boolean", !1);
cc.String = new l("String", "");
e.exports = {
PrimitiveType: l,
attr: a,
getClassAttrs: c,
setClassAttr: function(t, e, i, n) {
c(t)[e + r + i] = n;
},
DELIMETER: r,
getTypeChecker_ET: !1,
getObjTypeChecker_ET: !1,
ScriptUuid: {}
};
}), {
"./CCClass": 110,
"./js": 130,
"./utils": 134
} ],
123: [ (function(t, e, i) {
"use strict";
var n = t("./js"), r = n.array.fastRemoveAt;
function s() {}
function o() {
this.callback = s;
this.target = void 0;
this.once = !1;
}
o.prototype.set = function(t, e, i) {
this.callback = t;
this.target = e;
this.once = !!i;
};
var a = new n.Pool(function(t) {
t.callback = s;
t.target = void 0;
t.once = !1;
return !0;
}, 32);
a.get = function() {
return this._get() || new o();
};
function c() {
this.callbackInfos = [];
this.isInvoking = !1;
this.containCanceled = !1;
}
var l = c.prototype;
l.removeByCallback = function(t) {
for (var e = 0; e < this.callbackInfos.length; ++e) {
var i = this.callbackInfos[e];
if (i && i.callback === t) {
a.put(i);
r(this.callbackInfos, e);
--e;
}
}
};
l.removeByTarget = function(t) {
for (var e = 0; e < this.callbackInfos.length; ++e) {
var i = this.callbackInfos[e];
if (i && i.target === t) {
a.put(i);
r(this.callbackInfos, e);
--e;
}
}
};
l.cancel = function(t) {
var e = this.callbackInfos[t];
if (e) {
a.put(e);
this.callbackInfos[t] = null;
}
this.containCanceled = !0;
};
l.cancelAll = function() {
for (var t = 0; t < this.callbackInfos.length; t++) {
var e = this.callbackInfos[t];
if (e) {
a.put(e);
this.callbackInfos[t] = null;
}
}
this.containCanceled = !0;
};
l.purgeCanceled = function() {
for (var t = this.callbackInfos.length - 1; t >= 0; --t) {
this.callbackInfos[t] || r(this.callbackInfos, t);
}
this.containCanceled = !1;
};
l.clear = function() {
this.cancelAll();
this.callbackInfos.length = 0;
this.isInvoking = !1;
this.containCanceled = !1;
};
var u = new n.Pool(function(t) {
t.callback = s;
t.target = void 0;
t.once = !1;
return !0;
}, 16);
u.get = function() {
return this._get() || new c();
};
function h() {
this._callbackTable = n.createMap(!0);
}
(l = h.prototype).on = function(t, e, i, n) {
var r = this._callbackTable[t];
r || (r = this._callbackTable[t] = u.get());
var s = a.get();
s.set(e, i, n);
r.callbackInfos.push(s);
};
l.hasEventListener = function(t, e, i) {
var n = this._callbackTable[t];
if (!n) return !1;
var r = n.callbackInfos;
if (!e) {
if (n.isInvoking) {
for (var s = 0; s < r.length; ++s) if (r[s]) return !0;
return !1;
}
return r.length > 0;
}
for (var o = 0; o < r.length; ++o) {
var a = r[o];
if (a && a.callback === e && a.target === i) return !0;
}
return !1;
};
l.removeAll = function(t) {
if ("string" == typeof t) {
var e = this._callbackTable[t];
if (e) if (e.isInvoking) e.cancelAll(); else {
e.clear();
u.put(e);
delete this._callbackTable[t];
}
} else if (t) for (var i in this._callbackTable) {
var n = this._callbackTable[i];
if (n.isInvoking) for (var r = n.callbackInfos, s = 0; s < r.length; ++s) {
var o = r[s];
o && o.target === t && n.cancel(s);
} else n.removeByTarget(t);
}
};
l.off = function(t, e, i) {
var n = this._callbackTable[t];
if (n) for (var s = n.callbackInfos, o = 0; o < s.length; ++o) {
var c = s[o];
if (c && c.callback === e && c.target === i) {
if (n.isInvoking) n.cancel(o); else {
r(s, o);
a.put(c);
}
break;
}
}
};
l.emit = function(t, e, i, n, r, s) {
var o = this._callbackTable[t];
if (o) {
var a = !o.isInvoking;
o.isInvoking = !0;
for (var c = o.callbackInfos, l = 0, u = c.length; l < u; ++l) {
var h = c[l];
if (h) {
var f = h.target, d = h.callback;
h.once && this.off(t, d, f);
f ? d.call(f, e, i, n, r, s) : d(e, i, n, r, s);
}
}
if (a) {
o.isInvoking = !1;
o.containCanceled && o.purgeCanceled();
}
}
};
0;
e.exports = h;
}), {
"./js": 130
} ],
124: [ (function(t, e, i) {
"use strict";
function n(t, e) {
for (var i = 0; i < e.length; i++) {
var r = e[i];
Array.isArray(r) ? n(t, r) : t.push(r);
}
}
e.exports = {
flattenCodeArray: function(t) {
var e = [];
n(e, t);
return e.join("");
}
};
}), {} ],
125: [ (function(t, e, i) {
"use strict";
var n = t("./js"), r = t("./attribute"), s = t("./CCClass"), o = t("../utils/misc"), a = function() {
this.uuidList = [];
this.uuidObjList = [];
this.uuidPropList = [];
this._stillUseUrl = n.createMap(!0);
};
a.prototype.reset = function() {
this.uuidList.length = 0;
this.uuidObjList.length = 0;
this.uuidPropList.length = 0;
n.clear(this._stillUseUrl);
};
0;
a.prototype.push = function(t, e, i, n) {
n && (this._stillUseUrl[this.uuidList.length] = !0);
this.uuidList.push(i);
this.uuidObjList.push(t);
this.uuidPropList.push(e);
};
(a.pool = new n.Pool(function(t) {
t.reset();
}, 10)).get = function() {
return this._get() || new a();
};
var c = (function() {
function t(t, e, i, n, r) {
this.result = t;
this.customEnv = n;
this.deserializedList = [];
this.deserializedData = null;
this._classFinder = i;
0;
this._idList = [];
this._idObjList = [];
this._idPropList = [];
}
function e(t) {
var e, i, n, r = t.deserializedList, s = t._idPropList, o = t._idList, a = t._idObjList;
t._classFinder && t._classFinder.onDereferenced;
for (e = 0; e < o.length; e++) {
i = s[e];
n = o[e];
a[e][i] = r[n];
}
}
var i = t.prototype;
i.deserialize = function(t) {
if (Array.isArray(t)) {
var i = t, n = i.length;
this.deserializedList.length = n;
for (var r = 0; r < n; r++) if (i[r]) {
this.deserializedList[r] = this._deserializeObject(i[r], !1);
}
this.deserializedData = n > 0 ? this.deserializedList[0] : [];
} else {
this.deserializedList.length = 1;
this.deserializedData = t ? this._deserializeObject(t, !1) : null;
this.deserializedList[0] = this.deserializedData;
}
e(this);
return this.deserializedData;
};
i._deserializeObject = function(t, e, i, r, s) {
var o, a = null, c = null, u = t.__type__;
if ("TypedArray" === u) {
var h = t.array;
a = new window[t.ctor](h.length);
for (var f = 0; f < h.length; ++f) a[f] = h[f];
return a;
}
if (u) {
if (!(c = this._classFinder(u, t, r, s))) {
this._classFinder === n._getClassById && cc.deserialize.reportMissingClass(u);
return null;
}
if ((a = new c())._deserialize) {
a._deserialize(t.content, this);
return a;
}
cc.Class._isCCClass(c) ? l(this, a, t, c, i) : this._deserializeTypedObject(a, t, c);
} else if (Array.isArray(t)) {
a = new Array(t.length);
for (var d = 0; d < t.length; d++) "object" == typeof (o = t[d]) && o ? this._deserializeObjField(a, o, "" + d, null, e) : a[d] = o;
} else {
a = {};
this._deserializePrimitiveObject(a, t);
}
return a;
};
i._deserializeObjField = function(t, e, i, n, r) {
var s = e.__id__;
if (void 0 === s) {
var o = e.__uuid__;
o ? this.result.push(t, i, o, r) : t[i] = this._deserializeObject(e, r);
} else {
var a = this.deserializedList[s];
if (a) t[i] = a; else {
this._idList.push(s);
this._idObjList.push(t);
this._idPropList.push(i);
}
}
};
i._deserializePrimitiveObject = function(t, e) {
for (var i in e) if (e.hasOwnProperty(i)) {
var n = e[i];
"object" != typeof n ? "__type__" !== i && (t[i] = n) : n ? this._deserializeObjField(t, n, i) : t[i] = null;
}
};
i._deserializeTypedObject = function(t, e, i) {
if (i !== cc.Vec2) if (i !== cc.Vec3) if (i !== cc.Color) if (i !== cc.Size) for (var n = r.DELIMETER + "default", o = r.getClassAttrs(i), a = i.__props__ || Object.keys(t), c = 0; c < a.length; c++) {
var l = a[c], u = e[l];
void 0 !== u && e.hasOwnProperty(l) || (u = s.getDefault(o[l + n]));
"object" != typeof u ? t[l] = u : u ? this._deserializeObjField(t, u, l) : t[l] = null;
} else {
t.width = e.width || 0;
t.height = e.height || 0;
} else {
t.r = e.r || 0;
t.g = e.g || 0;
t.b = e.b || 0;
var h = e.a;
t.a = void 0 === h ? 255 : h;
} else {
t.x = e.x || 0;
t.y = e.y || 0;
t.z = e.z || 0;
} else {
t.x = e.x || 0;
t.y = e.y || 0;
}
};
function a(t, e, i, r, s, o) {
if (e instanceof cc.ValueType) {
s || t.push("if(prop){");
var a = n.getClassName(e);
t.push("s._deserializeTypedObject(o" + i + ",prop," + a + ");");
s || t.push("}else o" + i + "=null;");
} else {
t.push("if(prop){");
t.push("s._deserializeObjField(o,prop," + r + ",null," + !!o + ");");
t.push("}else o" + i + "=null;");
}
}
var c = function(t, e) {
for (var i = r.DELIMETER + "type", c = (r.DELIMETER, r.DELIMETER + "default"), l = r.DELIMETER + "saveUrlAsAsset", u = r.DELIMETER + "formerlySerializedAs", h = r.getClassAttrs(e), f = e.__values__, d = [ "var prop;" ], _ = o.BUILTIN_CLASSID_RE.test(n._getClassId(e)), p = 0; p < f.length; p++) {
var v, g, m = f[p];
0;
if (s.IDENTIFIER_RE.test(m)) {
g = '"' + m + '"';
v = "." + m;
} else v = "[" + (g = s.escapeForJS(m)) + "]";
var y = v;
if (h[m + u]) {
var E = h[m + u];
y = s.IDENTIFIER_RE.test(E) ? "." + E : "[" + s.escapeForJS(E) + "]";
}
d.push("prop=d" + y + ";");
d.push('if(typeof (prop)!=="undefined"){');
var C = h[m + l], T = s.getDefault(h[m + c]);
if (_) {
var A, x = h[m + i];
if (void 0 === T && x) A = x instanceof r.PrimitiveType; else {
var b = typeof T;
A = "string" === b && !C || "number" === b || "boolean" === b;
}
A ? d.push("o" + v + "=prop;") : a(d, T, v, g, !0, C);
} else {
d.push('if(typeof (prop)!=="object"){o' + v + "=prop;}else{");
a(d, T, v, g, !1, C);
d.push("}");
}
d.push("}");
}
if (cc.js.isChildClassOf(e, cc._BaseNode) || cc.js.isChildClassOf(e, cc.Component)) {
d.push("d._id&&(o._id=d._id);");
}
if ("_$erialized" === f[f.length - 1]) {
d.push("o._$erialized=JSON.parse(JSON.stringify(d));");
d.push("s._deserializePrimitiveObject(o._$erialized,d);");
}
return Function("s", "o", "d", "k", "t", d.join(""));
};
function l(t, e, i, r, s) {
var o;
if (r.hasOwnProperty("__deserialize__")) o = r.__deserialize__; else {
o = c(t, r);
n.value(r, "__deserialize__", o, !0);
}
o(t, e, i, r, s);
0;
}
t.pool = new n.Pool(function(t) {
t.result = null;
t.customEnv = null;
t.deserializedList.length = 0;
t.deserializedData = null;
t._classFinder = null;
0;
t._idList.length = 0;
t._idObjList.length = 0;
t._idPropList.length = 0;
}, 1);
t.pool.get = function(e, i, n, r, s) {
var o = this._get();
if (o) {
o.result = e;
o.customEnv = r;
o._classFinder = n;
0;
return o;
}
return new t(e, i, n, r, s);
};
return t;
})();
cc.deserialize = function(t, e, i) {
var r = (i = i || {}).classFinder || n._getClassById, s = i.createAssetRefs || cc.sys.platform === cc.sys.EDITOR_CORE, o = i.customEnv, l = i.ignoreEditorOnly;
0;
"string" == typeof t && (t = JSON.parse(t));
var u = !e;
e = e || a.pool.get();
var h = c.pool.get(e, !1, r, o, l);
cc.game._isCloning = !0;
var f = h.deserialize(t);
cc.game._isCloning = !1;
c.pool.put(h);
s && e.assignAssetsBy(Editor.serialize.asAsset);
u && a.pool.put(e);
return f;
};
cc.deserialize.Details = a;
cc.deserialize.reportMissingClass = function(t) {
cc.warnID(5302, t);
};
}), {
"../utils/misc": 187,
"./CCClass": 110,
"./attribute": 122,
"./js": 130
} ],
126: [ (function(t, e, i) {
"use strict";
var n = ".";
function r(t) {
this.id = 0 | 998 * Math.random();
this.prefix = t ? t + n : "";
}
r.prototype.getNewId = function() {
return this.prefix + ++this.id;
};
r.global = new r("global");
e.exports = r;
}), {} ],
127: [ (function(t, e, i) {
"use strict";
t("./js");
t("./CCClass");
t("./CCClassDecorator");
t("./CCEnum");
t("./CCObject");
t("./callbacks-invoker");
t("./url");
t("./deserialize");
t("./instantiate");
t("./instantiate-jit");
t("./requiring-frame");
t("./CCSys");
t("./CCMacro");
t("./CCAssetLibrary");
t("./CCVisibleRect");
}), {
"./CCAssetLibrary": 109,
"./CCClass": 110,
"./CCClassDecorator": 111,
"./CCEnum": 112,
"./CCMacro": 115,
"./CCObject": 116,
"./CCSys": 119,
"./CCVisibleRect": 121,
"./callbacks-invoker": 123,
"./deserialize": 125,
"./instantiate": 129,
"./instantiate-jit": 128,
"./js": 130,
"./requiring-frame": 132,
"./url": 133
} ],
128: [ (function(t, e, i) {
"use strict";
var n = t("./CCObject"), r = n.Flags.Destroyed, s = n.Flags.PersistentMask, o = t("./attribute"), a = t("./js"), c = t("./CCClass"), l = t("./compiler"), u = o.DELIMETER + "default", h = c.IDENTIFIER_RE, f = c.escapeForJS, d = "var ", _ = "o", p = "t", v = {
"cc.Node": "cc.Node",
"cc.Sprite": "cc.Sprite",
"cc.Label": "cc.Label",
"cc.Button": "cc.Button",
"cc.Widget": "cc.Widget",
"cc.Animation": "cc.Animation",
"cc.ClickEvent": !1,
"cc.PrefabInfo": !1
};
try {
!Float32Array.name && (Float32Array.name = "Float32Array");
!Float64Array.name && (Float64Array.name = "Float64Array");
!Int8Array.name && (Int8Array.name = "Int8Array");
!Int16Array.name && (Int16Array.name = "Int16Array");
!Int32Array.name && (Int32Array.name = "Int32Array");
!Uint8Array.name && (Uint8Array.name = "Uint8Array");
!Uint16Array.name && (Uint16Array.name = "Uint16Array");
!Uint32Array.name && (Uint32Array.name = "Uint32Array");
} catch (t) {}
function g(t) {
if (t === Float32Array) return "Float32Array";
if (t === Float64Array) return "Float64Array";
if (t === Int8Array) return "Int8Array";
if (t === Int16Array) return "Int16Array";
if (t === Int32Array) return "Int32Array";
if (t === Uint8Array) return "Uint8Array";
if (t === Uint16Array) return "Uint16Array";
if (t === Uint32Array) return "Uint32Array";
throw new Error("Unknown TypedArray could not be instantiated: " + t);
}
function m(t, e) {
this.varName = t;
this.expression = e;
}
m.prototype.toString = function() {
return d + this.varName + "=" + this.expression + ";";
};
function y(t, e) {
return e instanceof m ? new m(e.varName, t + e.expression) : t + e;
}
function E(t, e, i) {
if (Array.isArray(i)) {
i[0] = y(e, i[0]);
t.push(i);
} else t.push(y(e, i) + ";");
}
function C(t) {
this._exps = [];
this._targetExp = t;
}
C.prototype.append = function(t, e) {
this._exps.push([ t, e ]);
};
C.prototype.writeCode = function(t) {
var e;
if (this._exps.length > 1) {
t.push(p + "=" + this._targetExp + ";");
e = p;
} else {
if (1 !== this._exps.length) return;
e = this._targetExp;
}
for (var i = 0; i < this._exps.length; i++) {
var n = this._exps[i];
E(t, e + A(n[0]) + "=", n[1]);
}
};
C.pool = new a.Pool(function(t) {
t._exps.length = 0;
t._targetExp = null;
}, 1);
C.pool.get = function(t) {
var e = this._get() || new C();
e._targetExp = t;
return e;
};
function T(t, e) {
if ("function" == typeof t) try {
t = t();
} catch (t) {
return !1;
}
if (t === e) return !0;
if (t && e) {
if (t instanceof cc.ValueType && t.equals(e)) return !0;
if (Array.isArray(t) && Array.isArray(e) || t.constructor === Object && e.constructor === Object) try {
return Array.isArray(t) && Array.isArray(e) && 0 === t.length && 0 === e.length;
} catch (t) {}
}
return !1;
}
function A(t) {
return h.test(t) ? "." + t : "[" + f(t) + "]";
}
function x(t, e) {
this.parent = e;
this.objsToClear_iN$t = [];
this.codeArray = [];
this.objs = [];
this.funcs = [];
this.funcModuleCache = a.createMap();
a.mixin(this.funcModuleCache, v);
this.globalVariables = [];
this.globalVariableId = 0;
this.localVariableId = 0;
this.codeArray.push(d + _ + "," + p + ";", "if(R){", _ + "=R;", "}else{", _ + "=R=new " + this.getFuncModule(t.constructor, !0) + "();", "}");
a.value(t, "_iN$t", {
globalVar: "R"
}, !0);
this.objsToClear_iN$t.push(t);
this.enumerateObject(this.codeArray, t);
var i;
this.globalVariables.length > 0 && (i = d + this.globalVariables.join(",") + ";");
var n = l.flattenCodeArray([ "return (function(R){", i || [], this.codeArray, "return o;", "})" ]);
this.result = Function("O", "F", n)(this.objs, this.funcs);
for (var r = 0, s = this.objsToClear_iN$t.length; r < s; ++r) this.objsToClear_iN$t[r]._iN$t = null;
this.objsToClear_iN$t.length = 0;
}
var b = x.prototype;
b.getFuncModule = function(t, e) {
var i = a.getClassName(t);
if (i) {
var n = this.funcModuleCache[i];
if (n) return n;
if (void 0 === n) {
var r = -1 !== i.indexOf(".");
if (r) try {
if (r = t === Function("return " + i)()) {
this.funcModuleCache[i] = i;
return i;
}
} catch (t) {}
}
}
var s = this.funcs.indexOf(t);
if (s < 0) {
s = this.funcs.length;
this.funcs.push(t);
}
var o = "F[" + s + "]";
e && (o = "(" + o + ")");
this.funcModuleCache[i] = o;
return o;
};
b.getObjRef = function(t) {
var e = this.objs.indexOf(t);
if (e < 0) {
e = this.objs.length;
this.objs.push(t);
}
return "O[" + e + "]";
};
b.setValueType = function(t, e, i, n) {
var r = C.pool.get(n), s = e.constructor.__props__;
s || (s = Object.keys(e));
for (var o = 0; o < s.length; o++) {
var a = s[o], c = i[a];
if (e[a] !== c) {
var l = this.enumerateField(i, a, c);
r.append(a, l);
}
}
r.writeCode(t);
C.pool.put(r);
};
b.enumerateCCClass = function(t, e, i) {
for (var n = i.__values__, r = o.getClassAttrs(i), s = 0; s < n.length; s++) {
var a = n[s], l = e[a], h = r[a + u];
if (!T(h, l)) if ("object" == typeof l && l instanceof cc.ValueType && (h = c.getDefault(h)) && h.constructor === l.constructor) {
var f = _ + A(a);
this.setValueType(t, h, l, f);
} else this.setObjProp(t, e, a, l);
}
};
b.instantiateArray = function(t) {
if (0 === t.length) return "[]";
var e = "a" + ++this.localVariableId, i = [ new m(e, "new Array(" + t.length + ")") ];
a.value(t, "_iN$t", {
globalVar: "",
source: i
}, !0);
this.objsToClear_iN$t.push(t);
for (var n = 0; n < t.length; ++n) {
E(i, e + "[" + n + "]=", this.enumerateField(t, n, t[n]));
}
return i;
};
b.instantiateTypedArray = function(t) {
var e = t.constructor.name || g(t.constructor);
if (0 === t.length) return "new " + e;
var i = "a" + ++this.localVariableId, n = [ new m(i, "new " + e + "(" + t.length + ")") ];
t._iN$t = {
globalVar: "",
source: n
};
this.objsToClear_iN$t.push(t);
for (var r = 0; r < t.length; ++r) if (0 !== t[r]) {
E(n, i + "[" + r + "]=", t[r]);
}
return n;
};
b.enumerateField = function(t, e, i) {
if ("object" == typeof i && i) {
var r = i._iN$t;
if (r) {
var o = r.globalVar;
if (!o) {
o = r.globalVar = "v" + ++this.globalVariableId;
this.globalVariables.push(o);
var a = r.source[0];
r.source[0] = y(o + "=", a);
}
return o;
}
return ArrayBuffer.isView(i) ? this.instantiateTypedArray(i) : Array.isArray(i) ? this.instantiateArray(i) : this.instantiateObj(i);
}
if ("function" == typeof i) return this.getFuncModule(i);
if ("string" == typeof i) return f(i);
"_objFlags" === e && t instanceof n && (i &= s);
return i;
};
b.setObjProp = function(t, e, i, n) {
E(t, _ + A(i) + "=", this.enumerateField(e, i, n));
};
b.enumerateObject = function(t, e) {
var i = e.constructor;
if (cc.Class._isCCClass(i)) this.enumerateCCClass(t, e, i); else for (var n in e) if (e.hasOwnProperty(n) && (95 !== n.charCodeAt(0) || 95 !== n.charCodeAt(1) || "__type__" === n)) {
var r = e[n];
"object" == typeof r && r && r === e._iN$t || this.setObjProp(t, e, n, r);
}
};
b.instantiateObj = function(t) {
if (t instanceof cc.ValueType) return c.getNewValueTypeCode(t);
if (t instanceof cc.Asset) return this.getObjRef(t);
if (t._objFlags & r) return null;
var e, i = t.constructor;
if (cc.Class._isCCClass(i)) {
if (this.parent) if (this.parent instanceof cc.Component) {
if (t instanceof cc._BaseNode || t instanceof cc.Component) return this.getObjRef(t);
} else if (this.parent instanceof cc._BaseNode) if (t instanceof cc._BaseNode) {
if (!t.isChildOf(this.parent)) return this.getObjRef(t);
} else if (t instanceof cc.Component && !t.node.isChildOf(this.parent)) return this.getObjRef(t);
e = new m(_, "new " + this.getFuncModule(i, !0) + "()");
} else if (i === Object) e = new m(_, "{}"); else {
if (i) return this.getObjRef(t);
e = new m(_, "Object.create(null)");
}
var n = [ e ];
a.value(t, "_iN$t", {
globalVar: "",
source: n
}, !0);
this.objsToClear_iN$t.push(t);
this.enumerateObject(n, t);
return [ "(function(){", n, "return o;})();" ];
};
e.exports = {
compile: function(t) {
return new x(t, t instanceof cc._BaseNode && t).result;
},
equalsToDefault: T
};
0;
}), {
"./CCClass": 110,
"./CCObject": 116,
"./attribute": 122,
"./compiler": 124,
"./js": 130
} ],
129: [ (function(t, e, i) {
"use strict";
var n = t("./CCObject"), r = t("../value-types/value-type"), s = n.Flags.Destroyed, o = n.Flags.PersistentMask, a = t("./utils").isDomNode, c = t("./js");
function l(t, e) {
if (!e) {
if ("object" != typeof t || Array.isArray(t)) {
0;
return null;
}
if (!t) {
0;
return null;
}
if (!cc.isValid(t)) {
0;
return null;
}
0;
}
var i;
if (t instanceof n) {
if (t._instantiate) {
cc.game._isCloning = !0;
i = t._instantiate();
cc.game._isCloning = !1;
return i;
}
if (t instanceof cc.Asset) {
0;
return null;
}
}
cc.game._isCloning = !0;
i = h(t);
cc.game._isCloning = !1;
return i;
}
var u = [];
function h(t, e) {
if (Array.isArray(t)) {
0;
return null;
}
if (a && a(t)) {
0;
return null;
}
var i;
if (t._iN$t) i = t._iN$t; else if (t.constructor) {
i = new (0, t.constructor)();
} else i = Object.create(null);
d(t, i, e);
for (var n = 0, r = u.length; n < r; ++n) u[n]._iN$t = null;
u.length = 0;
return i;
}
function f(t, e, i, n) {
for (var s = t.__values__, o = 0; o < s.length; o++) {
var a = s[o], c = e[a];
if ("object" == typeof c && c) {
var l = i[a];
l instanceof r && l.constructor === c.constructor ? l.set(c) : i[a] = c._iN$t || _(c, n);
} else i[a] = c;
}
}
function d(t, e, i) {
c.value(t, "_iN$t", e, !0);
u.push(t);
var r = t.constructor;
if (cc.Class._isCCClass(r)) f(r, t, e, i); else for (var s in t) if (t.hasOwnProperty(s) && (95 !== s.charCodeAt(0) || 95 !== s.charCodeAt(1) || "__type__" === s)) {
var a = t[s];
if ("object" == typeof a && a) {
if (a === e) continue;
e[s] = a._iN$t || _(a, i);
} else e[s] = a;
}
t instanceof n && (e._objFlags &= o);
}
function _(t, e) {
if (t instanceof r) return t.clone();
if (t instanceof cc.Asset) return t;
var i;
if (ArrayBuffer.isView(t)) {
var n = t.length;
i = new t.constructor(n);
t._iN$t = i;
u.push(t);
for (var o = 0; o < n; ++o) i[o] = t[o];
return i;
}
if (Array.isArray(t)) {
var a = t.length;
i = new Array(a);
c.value(t, "_iN$t", i, !0);
u.push(t);
for (var l = 0; l < a; ++l) {
var h = t[l];
i[l] = "object" == typeof h && h ? h._iN$t || _(h, e) : h;
}
return i;
}
if (t._objFlags & s) return null;
var f = t.constructor;
if (cc.Class._isCCClass(f)) {
if (e) if (e instanceof cc.Component) {
if (t instanceof cc._BaseNode || t instanceof cc.Component) return t;
} else if (e instanceof cc._BaseNode) if (t instanceof cc._BaseNode) {
if (!t.isChildOf(e)) return t;
} else if (t instanceof cc.Component && !t.node.isChildOf(e)) return t;
i = new f();
} else if (f === Object) i = {}; else {
if (f) return t;
i = Object.create(null);
}
d(t, i, e);
return i;
}
l._clone = h;
cc.instantiate = l;
e.exports = l;
}), {
"../value-types/value-type": 207,
"./CCObject": 116,
"./js": 130,
"./utils": 134
} ],
130: [ (function(t, e, i) {
"use strict";
var n = new (t("./id-generater"))("TmpCId.");
function r(t, e) {
for (;t; ) {
var i = Object.getOwnPropertyDescriptor(t, e);
if (i) return i;
t = Object.getPrototypeOf(t);
}
return null;
}
function s(t, e, i) {
var n = r(e, t);
Object.defineProperty(i, t, n);
}
var o = {
isNumber: function(t) {
return "number" == typeof t || t instanceof Number;
},
isString: function(t) {
return "string" == typeof t || t instanceof String;
},
addon: function(t) {
t = t || {};
for (var e = 1, i = arguments.length; e < i; e++) {
var n = arguments[e];
if (n) {
if ("object" != typeof n) {
cc.errorID(5402, n);
continue;
}
for (var r in n) r in t || s(r, n, t);
}
}
return t;
},
mixin: function(t) {
t = t || {};
for (var e = 1, i = arguments.length; e < i; e++) {
var n = arguments[e];
if (n) {
if ("object" != typeof n) {
cc.errorID(5403, n);
continue;
}
for (var r in n) s(r, n, t);
}
}
return t;
},
extend: function(t, e) {
0;
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
t.prototype = Object.create(e.prototype, {
constructor: {
value: t,
writable: !0,
configurable: !0
}
});
return t;
},
getSuper: function(t) {
var e = t.prototype, i = e && Object.getPrototypeOf(e);
return i && i.constructor;
},
isChildClassOf: function(t, e) {
if (t && e) {
if ("function" != typeof t) return !1;
if ("function" != typeof e) {
0;
return !1;
}
if (t === e) return !0;
for (;;) {
if (!(t = o.getSuper(t))) return !1;
if (t === e) return !0;
}
}
return !1;
},
clear: function(t) {
for (var e = Object.keys(t), i = 0; i < e.length; i++) delete t[e[i]];
},
isEmptyObject: function(t) {
for (var e in t) return !1;
return !0;
},
getPropertyDescriptor: r
}, a = {
value: void 0,
enumerable: !1,
writable: !1,
configurable: !0
};
o.value = function(t, e, i, n, r) {
a.value = i;
a.writable = n;
a.enumerable = r;
Object.defineProperty(t, e, a);
a.value = void 0;
};
var c = {
get: null,
set: null,
enumerable: !1
};
o.getset = function(t, e, i, n, r, s) {
if ("function" != typeof n) {
r = n;
n = void 0;
}
c.get = i;
c.set = n;
c.enumerable = r;
c.configurable = s;
Object.defineProperty(t, e, c);
c.get = null;
c.set = null;
};
var l = {
get: null,
enumerable: !1,
configurable: !1
};
o.get = function(t, e, i, n, r) {
l.get = i;
l.enumerable = n;
l.configurable = r;
Object.defineProperty(t, e, l);
l.get = null;
};
var u = {
set: null,
enumerable: !1,
configurable: !1
};
o.set = function(t, e, i, n, r) {
u.set = i;
u.enumerable = n;
u.configurable = r;
Object.defineProperty(t, e, u);
u.set = null;
};
o.getClassName = function(t) {
if ("function" == typeof t) {
var e = t.prototype;
if (e && e.hasOwnProperty("__classname__") && e.__classname__) return e.__classname__;
var i = "";
t.name && (i = t.name);
if (t.toString) {
var n, r = t.toString();
(n = "[" === r.charAt(0) ? r.match(/\[\w+\s*(\w+)\]/) : r.match(/function\s*(\w+)/)) && 2 === n.length && (i = n[1]);
}
return "Object" !== i ? i : "";
}
return t && t.constructor ? o.getClassName(t.constructor) : "";
};
(function() {
var t = {}, e = {};
function i(t, e, i) {
o.getset(o, e, (function() {
return Object.assign({}, i);
}), (function(t) {
o.clear(i);
Object.assign(i, t);
}));
return function(e, n) {
n.prototype.hasOwnProperty(t) && delete i[n.prototype[t]];
o.value(n.prototype, t, e);
if (e) {
var r = i[e];
if (r && r !== n) {
var s = "A Class already exists with the same " + t + ' : "' + e + '".';
0;
cc.error(s);
} else i[e] = n;
}
};
}
o._setClassId = i("__cid__", "_registeredClassIds", t);
var r = i("__classname__", "_registeredClassNames", e);
o.setClassName = function(t, e) {
r(t, e);
if (!e.prototype.hasOwnProperty("__cid__")) {
var i = t || n.getNewId();
i && o._setClassId(i, e);
}
};
o.unregisterClass = function() {
for (var i = 0; i < arguments.length; i++) {
var n = arguments[i].prototype, r = n.__cid__;
r && delete t[r];
var s = n.__classname__;
s && delete e[s];
}
};
o._getClassById = function(e) {
return t[e];
};
o.getClassByName = function(t) {
return e[t];
};
o._getClassId = function(t, e) {
e = "undefined" == typeof e || e;
if ("function" == typeof t && t.prototype.hasOwnProperty("__cid__")) {
0;
return t.prototype.__cid__;
}
if (t && t.constructor) {
var i = t.constructor.prototype;
if (i && i.hasOwnProperty("__cid__")) {
0;
return t.__cid__;
}
}
return "";
};
})();
o.obsolete = function(t, e, i, n) {
var r = /([^.]+)$/, s = r.exec(e)[0], a = r.exec(i)[0];
function c() {
0;
return this[a];
}
n ? o.getset(t, s, c, (function(t) {
0;
this[a] = t;
})) : o.get(t, s, c);
};
o.obsoletes = function(t, e, i, n) {
for (var r in i) {
var s = i[r];
o.obsolete(t, e + "." + r, s, n);
}
};
var h = /(%d)|(%s)/, f = /%s/;
o.formatStr = function() {
var t = arguments.length;
if (0 === t) return "";
var e = arguments[0];
if (1 === t) return "" + e;
if ("string" == typeof e && h.test(e)) for (var i = 1; i < t; ++i) {
var n = arguments[i], r = "number" == typeof n ? h : f;
r.test(e) ? e = e.replace(r, n) : e += " " + n;
} else for (var s = 1; s < t; ++s) e += " " + arguments[s];
return e;
};
o.shiftArguments = function() {
for (var t = arguments.length - 1, e = new Array(t), i = 0; i < t; ++i) e[i] = arguments[i + 1];
return e;
};
o.createMap = function(t) {
var e = Object.create(null);
if (t) {
e["."] = !0;
e["/"] = !0;
delete e["."];
delete e["/"];
}
return e;
};
function d(t, e) {
t.splice(e, 1);
}
function _(t, e) {
var i = t.indexOf(e);
if (i >= 0) {
d(t, i);
return !0;
}
return !1;
}
var p = Array.prototype.indexOf;
o.array = {
remove: _,
fastRemove: function(t, e) {
var i = t.indexOf(e);
if (i >= 0) {
t[i] = t[t.length - 1];
--t.length;
}
},
removeAt: d,
fastRemoveAt: function(t, e) {
var i = t.length;
if (!(e < 0 || e >= i)) {
t[e] = t[i - 1];
t.length = i - 1;
}
},
contains: function(t, e) {
return t.indexOf(e) >= 0;
},
verifyType: function(t, e) {
if (t && t.length > 0) for (var i = 0; i < t.length; i++) if (!(t[i] instanceof e)) {
cc.logID(1300);
return !1;
}
return !0;
},
removeArray: function(t, e) {
for (var i = 0, n = e.length; i < n; i++) _(t, e[i]);
},
appendObjectsAt: function(t, e, i) {
t.splice.apply(t, [ i, 0 ].concat(e));
return t;
},
copy: function(t) {
var e, i = t.length, n = new Array(i);
for (e = 0; e < i; e += 1) n[e] = t[e];
return n;
},
indexOf: p,
MutableForwardIterator: t("../utils/mutable-forward-iterator")
};
function v(t, e) {
if (void 0 === e) {
e = t;
t = null;
}
this.get = null;
this.count = 0;
this._pool = new Array(e);
this._cleanup = t;
}
v.prototype._get = function() {
if (this.count > 0) {
--this.count;
var t = this._pool[this.count];
this._pool[this.count] = null;
return t;
}
return null;
};
v.prototype.put = function(t) {
var e = this._pool;
if (this.count < e.length) {
if (this._cleanup && !1 === this._cleanup(t)) return;
e[this.count] = t;
++this.count;
}
};
v.prototype.resize = function(t) {
if (t >= 0) {
this._pool.length = t;
this.count > t && (this.count = t);
}
};
o.Pool = v;
cc.js = o;
e.exports = o;
}), {
"../utils/mutable-forward-iterator": 188,
"./id-generater": 126
} ],
131: [ (function(t, e, i) {
"use strict";
var n = t("./js"), r = t("./attribute"), s = {
url: {
canUsedInGet: !0
},
default: {},
serializable: {},
editorOnly: {},
formerlySerializedAs: {}
};
function o(t, e, i, n) {
if (t.get || t.set) 0; else if (t.hasOwnProperty("default")) {
var r = "_N$" + e;
t.get = function() {
return this[r];
};
t.set = function(t) {
var e = this[r];
this[r] = t;
i.call(this, e);
};
0;
var o = {};
n[r] = o;
for (var a in s) {
var c = s[a];
if (t.hasOwnProperty(a)) {
o[a] = t[a];
c.canUsedInGet || delete t[a];
}
}
} else 0;
}
function a(t, e, i, n) {
Array.isArray(n) && n.length > 0 && (n = n[0]);
0;
t.type = n;
}
function c(t, e, i, n) {
if (Array.isArray(e)) {
if (!(e.length > 0)) return cc.errorID(5508, i, n);
if (cc.RawAsset.isRawAssetType(e[0])) {
t.url = e[0];
delete t.type;
return;
}
t.type = e = e[0];
}
if ("function" == typeof e) if (e === String) {
t.type = cc.String;
0;
} else if (e === Boolean) {
t.type = cc.Boolean;
0;
} else if (e === Number) {
t.type = cc.Float;
0;
} else 0; else 0;
}
i.getFullFormOfProperty = function(t, e, i) {
if (t && t.constructor === Object) return null;
if (Array.isArray(t) && t.length > 0) {
t[0];
0;
return {
default: [],
type: t,
_short: !0
};
}
if ("function" == typeof t) {
var s = t;
if (!cc.RawAsset.isRawAssetType(s)) {
if (!cc.RawAsset.wasRawAssetType(s)) return {
default: n.isChildClassOf(s, cc.ValueType) ? new s() : null,
type: s,
_short: !0
};
0;
}
return {
default: "",
url: s,
_short: !0
};
}
return t instanceof r.PrimitiveType ? {
default: t.default,
_short: !0
} : {
default: t,
_short: !0
};
};
i.preprocessAttrs = function(t, e, n, r) {
for (var s in t) {
var l = t[s], u = i.getFullFormOfProperty(l, s, e);
u && (l = t[s] = u);
if (l) {
var h = l.notify;
h && o(l, s, h, t);
"type" in l && c(l, l.type, e, s);
"url" in l && a(l, 0, 0, l.url);
"type" in l && l.type;
}
}
};
i.validateMethodWithProps = function(t, e, i, n, r) {
0;
if ("function" != typeof t && null !== t) {
return !1;
}
0;
return !0;
};
}), {
"./CCClass": 110,
"./attribute": 122,
"./js": 130
} ],
132: [ (function(t, e, i) {
"use strict";
var n = [];
cc._RF = {
push: function(t, e, i) {
if (void 0 === i) {
i = e;
e = "";
}
n.push({
uuid: e,
script: i,
module: t,
exports: t.exports,
beh: null
});
},
pop: function() {
var t = n.pop(), e = t.module, i = e.exports;
if (i === t.exports) {
for (var r in i) return;
e.exports = i = t.cls;
}
},
peek: function() {
return n[n.length - 1];
}
};
0;
}), {} ],
133: [ (function(t, e, i) {
"use strict";
cc.url = {
_rawAssets: "",
normalize: function(t) {
t && (46 === t.charCodeAt(0) && 47 === t.charCodeAt(1) ? t = t.slice(2) : 47 === t.charCodeAt(0) && (t = t.slice(1)));
return t;
},
raw: function(t) {
0;
if ((t = this.normalize(t)).startsWith("resources/")) {
var e = cc.loader._getResUuid(t.slice(10), cc.Asset, null, !0);
if (e) return cc.AssetLibrary.getLibUrlNoExt(e, !0) + cc.path.extname(t);
} else cc.errorID(7002, t);
return this._rawAssets + t;
},
_init: function(t) {
this._rawAssets = cc.path.stripSep(t) + "/";
}
};
e.exports = cc.url;
}), {} ],
134: [ (function(t, e, i) {
"use strict";
t("./js");
e.exports = {
contains: function(t, e) {
if ("function" == typeof t.contains) return t.contains(e);
if ("function" == typeof t.compareDocumentPosition) return !!(16 & t.compareDocumentPosition(e));
var i = e.parentNode;
if (i) do {
if (i === t) return !0;
i = i.parentNode;
} while (null !== i);
return !1;
},
isDomNode: "object" == typeof window && ("function" == typeof Node ? function(t) {
return t instanceof Node;
} : function(t) {
return t && "object" == typeof t && "number" == typeof t.nodeType && "string" == typeof t.nodeName;
}),
callInNextTick: function(t, e, i) {
t && setTimeout((function() {
t(e, i);
}), 0);
}
};
0;
0;
}), {
"./js": 130
} ],
135: [ (function(t, e, i) {
"use strict";
t("./platform/js");
t("./value-types");
t("./utils");
t("./platform/CCInputManager");
t("./platform/CCInputExtension");
t("./event");
t("./platform/CCSys");
t("./platform/CCMacro");
t("./load-pipeline");
t("./CCDirector");
t("./renderer");
t("./platform/CCView");
t("./platform/CCScreen");
t("./CCScheduler");
t("./event-manager");
}), {
"./CCDirector": 5,
"./CCScheduler": 10,
"./event": 79,
"./event-manager": 75,
"./load-pipeline": 96,
"./platform/CCInputExtension": 113,
"./platform/CCInputManager": 114,
"./platform/CCMacro": 115,
"./platform/CCScreen": 118,
"./platform/CCSys": 119,
"./platform/CCView": 120,
"./platform/js": 130,
"./renderer": 155,
"./utils": 186,
"./value-types": 202
} ],
136: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function() {
function t(t, e) {
for (var i = 0; i < e.length; i++) {
var n = e[i];
n.enumerable = n.enumerable || !1;
n.configurable = !0;
"value" in n && (n.writable = !0);
Object.defineProperty(t, n.key, n);
}
}
return function(e, i, n) {
i && t(e.prototype, i);
n && t(e, n);
return e;
};
})(), r = a(t("./assembler")), s = a(t("./utils/dynamic-atlas/manager")), o = a(t("./webgl/render-data"));
function a(t) {
return t && t.__esModule ? t : {
default: t
};
}
function c(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function l(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function u(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var h = (function(t) {
u(e, t);
function e() {
c(this, e);
var i = l(this, t.call(this));
i._renderData = new o.default();
i._renderData.init(i);
i.initData();
i.initLocal();
return i;
}
e.prototype.initData = function() {
this._renderData.createQuadData(0, this.verticesFloats, this.indicesCount);
};
e.prototype.initLocal = function() {
this._local = [];
this._local.length = 4;
};
e.prototype.updateColor = function(t, e) {
var i = this._renderData.uintVDatas[0];
if (i) {
e = e || t.node.color._val;
for (var n = this.floatsPerVert, r = this.colorOffset, s = i.length; r < s; r += n) i[r] = e;
}
};
e.prototype.getBuffer = function() {
return cc.renderer._handle._meshBuffer;
};
e.prototype.updateWorldVerts = function(t) {
var e = this._local, i = this._renderData.vDatas[0], n = t.node._worldMatrix.m, r = n[0], s = n[1], o = n[4], a = n[5], c = n[12], l = n[13], u = e[0], h = e[2], f = e[1], d = e[3];
if (1 === r && 0 === s && 0 === o && 1 === a) {
i[0] = u + c;
i[1] = f + l;
i[5] = h + c;
i[6] = f + l;
i[10] = u + c;
i[11] = d + l;
i[15] = h + c;
i[16] = d + l;
} else {
var _ = r * u, p = r * h, v = s * u, g = s * h, m = o * f, y = o * d, E = a * f, C = a * d;
i[0] = _ + m + c;
i[1] = v + E + l;
i[5] = p + m + c;
i[6] = g + E + l;
i[10] = _ + y + c;
i[11] = v + C + l;
i[15] = p + y + c;
i[16] = g + C + l;
}
};
e.prototype.fillBuffers = function(t, e) {
e.worldMatDirty && this.updateWorldVerts(t);
var i = this._renderData, n = i.vDatas[0], r = i.iDatas[0], s = this.getBuffer(e), o = s.request(this.verticesCount, this.indicesCount), a = o.byteOffset >> 2, c = s._vData;
n.length + a > c.length ? c.set(n.subarray(0, c.length - a), a) : c.set(n, a);
for (var l = s._iData, u = o.indiceOffset, h = o.vertexOffset, f = 0, d = r.length; f < d; f++) l[u++] = h + r[f];
};
e.prototype.packToDynamicAtlas = function(t, e) {
if (e) {
if (!e._original && s.default && e._texture.packable) {
var i = s.default.insertSpriteFrame(e);
i && e._setDynamicAtlasFrame(i);
}
var n = t.sharedMaterials[0];
if (!n) return;
if (n.getProperty("texture") !== e._texture) {
t._vertsDirty = !0;
t._activateMaterial(!0);
}
}
};
n(e, [ {
key: "verticesFloats",
get: function() {
return this.verticesCount * this.floatsPerVert;
}
} ]);
return e;
})(r.default);
i.default = h;
cc.js.addon(h.prototype, {
floatsPerVert: 5,
verticesCount: 4,
indicesCount: 6,
uvOffset: 2,
colorOffset: 4
});
cc.Assembler2D = h;
e.exports = i.default;
}), {
"./assembler": 138,
"./utils/dynamic-atlas/manager": 158,
"./webgl/render-data": 177
} ],
137: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../utils/pool"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = 0;
function c(t) {
Object.getOwnPropertyDescriptor(t, "__assemblerId__") || (t.__assemblerId__ = ++a);
return t.__assemblerId__;
}
var l = new (function(t) {
o(e, t);
function e() {
var i, n, o;
r(this, e);
for (var a = arguments.length, c = Array(a), l = 0; l < a; l++) c[l] = arguments[l];
return o = (i = n = s(this, t.call.apply(t, [ this ].concat(c))), n._pool = {}, 
i), s(n, o);
}
e.prototype.put = function(t) {
if (t) if (this.enabled) {
var e = c(t.constructor), i = this._pool;
i[e] || (i[e] = []);
if (!(this.count > this.maxSize)) {
this._clean(t);
i[e].push(t);
this.count++;
}
} else t.destroy && t.destroy();
};
e.prototype.get = function(t) {
var e = void 0;
if (this.enabled) {
var i = this._pool, n = c(t);
e = i[n] && i[n].pop();
}
e ? this.count-- : e = new t();
return e;
};
e.prototype.clear = function() {
var t = this._pool;
for (var e in t) {
var i = t[e];
if (i) for (var n = 0; n < i.length; n++) i[n].destroy && i[n].destroy();
}
this._pool = {};
this.count = 0;
};
e.prototype._clean = function(t) {
t.reset();
t._renderComp = null;
};
return e;
}(n.default))();
n.default.register("assembler", l);
i.default = l;
e.exports = i.default;
}), {
"../utils/pool": 189
} ],
138: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = t("./webgl/vertex-format"), r = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("./assembler-pool"));
function s(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var o = (function() {
function t() {
s(this, t);
this._extendNative && this._extendNative();
}
t.prototype.init = function(t) {
this._renderComp = t;
};
t.prototype.updateRenderData = function(t) {};
t.prototype.fillBuffers = function(t, e) {};
t.prototype.getVfmt = function() {
return n.vfmtPosUvColor;
};
return t;
})();
i.default = o;
o.register = function(t, e) {
t.__assembler__ = e;
};
o.init = function(t) {
for (var e = t.constructor, i = e.__assembler__; !i; ) {
if (!(e = e.$super)) {
cc.warn("Can not find assembler for render component : [" + cc.js.getClassName(t) + "]");
return;
}
i = e.__assembler__;
}
i.getConstructor && (i = i.getConstructor(t));
if (!t._assembler || t._assembler.constructor !== i) {
var n = r.default.get(i);
n.init(t);
t._assembler = n;
}
};
cc.Assembler = o;
e.exports = i.default;
}), {
"./assembler-pool": 137,
"./webgl/vertex-format": 178
} ],
139: [ (function(t, e, i) {
"use strict";
var n = function(t) {
var e;
try {
e = t.getContext("2d");
} catch (t) {
console.error(t);
return;
}
this._canvas = t;
this._ctx = e;
this._caps = {};
this._stats = {
drawcalls: 0
};
this._vx = this._vy = this._vw = this._vh = 0;
this._sx = this._sy = this._sw = this._sh = 0;
};
n.prototype._restoreTexture = function(t) {};
n.prototype.setViewport = function(t, e, i, n) {
if (this._vx !== t || this._vy !== e || this._vw !== i || this._vh !== n) {
this._vx = t;
this._vy = e;
this._vw = i;
this._vh = n;
}
};
n.prototype.setScissor = function(t, e, i, n) {
if (this._sx !== t || this._sy !== e || this._sw !== i || this._sh !== n) {
this._sx = t;
this._sy = e;
this._sw = i;
this._sh = n;
}
};
n.prototype.clear = function(t) {
var e = this._ctx;
e.clearRect(this._vx, this._vy, this._vw, this._vh);
if (t && (0 !== t[0] || 0 !== t[1] || 0 !== t[2])) {
e.fillStyle = "rgb(" + t[0] + "," + t[1] + "," + t[2] + ")";
e.globalAlpha = t[3];
e.fillRect(this._vx, this._vy, this._vw, this._vh);
}
};
n.prototype.resetDrawCalls = function() {
this._stats.drawcalls = 0;
};
n.prototype.getDrawCalls = function() {
return this._stats.drawcalls;
};
e.exports = n;
}), {} ],
140: [ (function(t, e, i) {
"use strict";
var n = function(t, e) {
this._device = t;
this._width = 4;
this._height = 4;
this._image = null;
if (e) {
void 0 !== e.width && (this._width = e.width);
void 0 !== e.height && (this._height = e.height);
this.updateImage(e);
}
};
n.prototype.update = function(t) {
this.updateImage(t);
};
n.prototype.updateImage = function(t) {
if (t.images && t.images[0]) {
var e = t.images[0];
e && e !== this._image && (this._image = e);
}
};
n.prototype.destroy = function() {
this._image = null;
};
e.exports = n;
}), {} ],
141: [ (function(t, e, i) {
"use strict";
var n = function() {};
n.prototype = {
constructor: n,
clear: function() {},
render: function() {}
};
e.exports = n;
}), {} ],
142: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
t("./render-flow");
t("./renderers");
var n = s(t("./forward-renderer")), r = s(t("./render-component-handle"));
function s(t) {
return t && t.__esModule ? t : {
default: t
};
}
i.default = {
ForwardRenderer: n.default,
RenderComponentHandle: r.default
};
e.exports = i.default;
}), {
"./forward-renderer": 141,
"./render-component-handle": 143,
"./render-flow": 144,
"./renderers": 145
} ],
143: [ (function(t, e, i) {
"use strict";
var n = t("./renderers/utils"), r = function(t, e) {
this._device = t;
this._camera = e;
this.parentOpacity = 1;
this.parentOpacityDirty = 0;
this.worldMatDirty = 0;
this.walking = !1;
};
r.prototype = {
constructor: r,
reset: function() {
var t = this._device._ctx, e = this._device._canvas, i = cc.Camera.main ? cc.Camera.main.backgroundColor : cc.color(), r = "rgba(" + i.r + ", " + i.g + ", " + i.b + ", " + i.a / 255 + ")";
t.fillStyle = r;
t.setTransform(1, 0, 0, 1, 0, 0);
t.clearRect(0, 0, e.width, e.height);
t.fillRect(0, 0, e.width, e.height);
this._device._stats.drawcalls = 0;
n.context.reset();
},
terminate: function() {}
};
e.exports = r;
}), {
"./renderers/utils": 154
} ],
144: [ (function(t, e, i) {
"use strict";
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../render-flow"));
n.default.prototype._draw = function(t, e) {
var i = n.default.getBachther(), r = i._device._ctx, s = i._camera;
r.setTransform(s.a, s.b, s.c, s.d, s.tx, s.ty);
r.scale(1, -1);
var o = t._renderComponent;
o._assembler[e](r, o);
this._next._func(t);
};
n.default.prototype._render = function(t) {
this._draw(t, "draw");
};
n.default.prototype._postRender = function(t) {
this._draw(t, "postDraw");
};
}), {
"../render-flow": 156
} ],
145: [ (function(t, e, i) {
"use strict";
t("../../../components/CCSprite");
t("../../../components/CCLabel");
t("../../../components/CCMask");
t("../../../graphics/graphics");
t("./sprite");
t("./label");
t("./graphics");
t("./mask");
}), {
"../../../components/CCLabel": 49,
"../../../components/CCMask": void 0,
"../../../components/CCSprite": 57,
"../../../graphics/graphics": void 0,
"./graphics": void 0,
"./label": 147,
"./mask": void 0,
"./sprite": 150
} ],
146: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = o(t("../../../utils/label/bmfont")), r = o(t("../render-data")), s = o(t("../utils"));
function o(t) {
return t && t.__esModule ? t : {
default: t
};
}
function a(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function c(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function l(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var u = (function(t) {
l(e, t);
function e() {
a(this, e);
return c(this, t.apply(this, arguments));
}
e.prototype.init = function() {
this._renderData = new r.default();
};
e.prototype.updateColor = function() {};
e.prototype.appendQuad = function(t, e, i, n, r, s, o) {
var a = this._renderData, c = a.dataLength;
a.dataLength += 2;
var l = a.vertices, u = i.width, h = i.height, f = void 0, d = void 0, _ = void 0, p = void 0;
if (n) {
f = i.x;
_ = i.x + h;
d = i.y;
p = i.y + u;
l[c].u = f;
l[c].v = p;
l[c + 1].u = f;
l[c + 1].v = d;
} else {
f = i.x;
_ = i.x + u;
d = i.y;
p = i.y + h;
l[c].u = f;
l[c].v = d;
l[c + 1].u = _;
l[c + 1].v = p;
}
l[c].x = r;
l[c].y = s - h * o;
l[c + 1].x = r + u * o;
l[c + 1].y = s;
};
e.prototype.draw = function(t, e) {
var i = e.node, n = i._worldMatrix.m, r = n[0], o = n[1], a = n[4], c = n[5], l = n[12], u = n[13];
t.transform(r, o, a, c, l, u);
t.scale(1, -1);
s.default.context.setGlobalAlpha(t, i.opacity / 255);
for (var h = e._frame._texture, f = this._renderData.vertices, d = s.default.getColorizedImage(h, i._color), _ = 0, p = f.length; _ < p; _ += 2) {
var v = f[_].x, g = f[_].y, m = f[_ + 1].x - v, y = f[_ + 1].y - g;
g = -g - y;
var E = f[_].u, C = f[_].v, T = f[_ + 1].u - E, A = f[_ + 1].v - C;
t.drawImage(d, E, C, T, A, v, g, m, y);
}
return 1;
};
return e;
})(n.default);
i.default = u;
e.exports = i.default;
}), {
"../../../utils/label/bmfont": 159,
"../render-data": 149,
"../utils": 154
} ],
147: [ (function(t, e, i) {
"use strict";
var n = a(t("../../../assembler")), r = a(t("../../../../components/CCLabel")), s = a(t("./ttf")), o = a(t("./bmfont"));
function a(t) {
return t && t.__esModule ? t : {
default: t
};
}
var c = {
pool: [],
get: function() {
var t = this.pool.pop();
if (!t) {
var e = document.createElement("canvas");
t = {
canvas: e,
context: e.getContext("2d")
};
}
return t;
},
put: function(t) {
this.pool.length >= 32 || this.pool.push(t);
}
};
r.default._canvasPool = c;
n.default.register(r.default, {
getConstructor: function(t) {
var e = s.default;
t.font instanceof cc.BitmapFont ? e = o.default : t.cacheMode === r.default.CacheMode.CHAR && cc.warn("sorry, canvas mode does not support CHAR mode currently!");
return e;
},
TTF: s.default,
Bmfont: o.default
});
}), {
"../../../../components/CCLabel": 49,
"../../../assembler": 138,
"./bmfont": 146,
"./ttf": 148
} ],
148: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = o(t("../../../utils/label/ttf")), r = o(t("../render-data")), s = o(t("../utils"));
function o(t) {
return t && t.__esModule ? t : {
default: t
};
}
function a(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function c(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function l(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var u = (function(t) {
l(e, t);
function e() {
a(this, e);
return c(this, t.apply(this, arguments));
}
e.prototype.init = function() {
this._renderData = new r.default();
this._renderData.dataLength = 2;
};
e.prototype.updateColor = function() {};
e.prototype.updateVerts = function(t) {
var e = this._renderData, i = t.node, n = i.width, r = i.height, s = i.anchorX * n, o = i.anchorY * r, a = e.vertices;
a[0].x = -s;
a[0].y = -o;
a[1].x = n - s;
a[1].y = r - o;
};
e.prototype._updateTexture = function(t) {
n.default.prototype._updateTexture.call(this, t);
var e = t._frame._texture;
s.default.dropColorizedImage(e, t.node.color);
};
e.prototype.draw = function(t, e) {
var i = e.node, n = i._worldMatrix.m, r = n[0], o = n[1], a = n[4], c = n[5], l = n[12], u = n[13];
t.transform(r, o, a, c, l, u);
t.scale(1, -1);
s.default.context.setGlobalAlpha(t, i.opacity / 255);
var h = e._frame._texture, f = this._renderData.vertices, d = h.getHtmlElementObj(), _ = f[0].x, p = f[0].y, v = f[1].x - _, g = f[1].y - p;
p = -p - g;
t.drawImage(d, _, p, v, g);
return 1;
};
return e;
})(n.default);
i.default = u;
e.exports = i.default;
}), {
"../../../utils/label/ttf": 162,
"../render-data": 149,
"../utils": 154
} ],
149: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = (function() {
function t(t, e) {
for (var i = 0; i < e.length; i++) {
var n = e[i];
n.enumerable = n.enumerable || !1;
n.configurable = !0;
"value" in n && (n.writable = !0);
Object.defineProperty(t, n.key, n);
}
}
return function(e, i, n) {
i && t(e.prototype, i);
n && t(e, n);
return e;
};
})();
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
r(this, t);
this.vertices = [];
}
n(t, [ {
key: "dataLength",
get: function() {
return this.vertices.length;
},
set: function(t) {
var e = this.vertices.length;
this.vertices.length = t;
for (var i = e; i < t; i++) this.vertices[i] = {
x: 0,
y: 0,
u: 0,
v: 0
};
}
} ]);
return t;
})();
i.default = s;
e.exports = i.default;
}), {} ],
150: [ (function(t, e, i) {
"use strict";
var n = c(t("../../../assembler")), r = t("../../../../components/CCSprite"), s = c(t("./simple")), o = c(t("./sliced")), a = c(t("./tiled"));
function c(t) {
return t && t.__esModule ? t : {
default: t
};
}
var l = {
getConstructor: function(t) {
var e = s.default;
switch (t.type) {
case r.Type.SLICED:
e = o.default;
break;

case r.Type.TILED:
e = a.default;
}
return e;
},
Simple: s.default,
Sliced: o.default,
Tiled: a.default
};
n.default.register(cc.Sprite, l);
}), {
"../../../../components/CCSprite": 57,
"../../../assembler": 138,
"./simple": 151,
"./sliced": 152,
"./tiled": 153
} ],
151: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = s(t("../../../assembler")), r = s(t("../render-data"));
function s(t) {
return t && t.__esModule ? t : {
default: t
};
}
function o(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function a(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function c(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var l = t("../utils"), u = (function(t) {
c(e, t);
function e() {
o(this, e);
return a(this, t.apply(this, arguments));
}
e.prototype.init = function() {
this._renderData = new r.default();
this._renderData.dataLength = 2;
};
e.prototype.updateRenderData = function(t) {
if (t._vertsDirty) {
this.updateUVs(t);
this.updateVerts(t);
t._vertsDirty = !1;
}
};
e.prototype.updateUVs = function(t) {
var e = t.spriteFrame, i = this._renderData.vertices, n = e._rect;
if (e._rotated) {
var r = n.x, s = n.width, o = n.y, a = n.height;
i[0].u = r;
i[0].v = o;
i[1].u = a;
i[1].v = s;
} else {
var c = n.x, l = n.width, u = n.y, h = n.height;
i[0].u = c;
i[0].v = u;
i[1].u = l;
i[1].v = h;
}
};
e.prototype.updateVerts = function(t) {
var e = this._renderData, i = t.node, n = e.vertices, r = t.spriteFrame, s = i.width, o = i.height, a = i.anchorX * s, c = i.anchorY * o, l = void 0, u = void 0, h = void 0, f = void 0;
if (t.trim) {
l = -a;
u = -c;
h = s;
f = o;
} else {
var d = r._originalSize.width, _ = r._originalSize.height, p = r._rect.width, v = r._rect.height, g = r._offset, m = s / d, y = o / _, E = g.x + (d - p) / 2, C = g.y + (_ - v) / 2;
l = E * m - a;
u = C * y - c;
h = s;
f = o;
}
if (r._rotated) {
n[0].y = l;
n[0].x = u;
n[1].y = h;
n[1].x = f;
} else {
n[0].x = l;
n[0].y = u;
n[1].x = h;
n[1].y = f;
}
e.vertDirty = !1;
};
e.prototype.draw = function(t, e) {
var i = e.node, n = e._spriteFrame, r = i._worldMatrix.m, s = r[0], o = r[1], a = r[4], c = r[5], u = r[12], h = r[13];
t.transform(s, o, a, c, u, h);
t.scale(1, -1);
n._rotated && t.rotate(-Math.PI / 2);
l.context.setGlobalAlpha(t, i.opacity / 255);
var f = n._texture, d = this._renderData.vertices, _ = l.getColorizedImage(f, i._color), p = d[0].x, v = d[0].y, g = d[1].x, m = d[1].y;
v = -v - m;
var y = d[0].u, E = d[0].v, C = d[1].u, T = d[1].v;
t.drawImage(_, y, E, C, T, p, v, g, m);
return 1;
};
return e;
})(n.default);
i.default = u;
e.exports = i.default;
}), {
"../../../assembler": 138,
"../render-data": 149,
"../utils": 154
} ],
152: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
s(t("../../../assembler"));
var n = s(t("../render-data")), r = s(t("./simple"));
function s(t) {
return t && t.__esModule ? t : {
default: t
};
}
function o(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function a(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function c(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var l = t("../utils"), u = (function(t) {
c(e, t);
function e() {
o(this, e);
return a(this, t.apply(this, arguments));
}
e.prototype.init = function() {
this._renderData = new n.default();
this._renderData.dataLength = 4;
};
e.prototype.updateUVs = function(t) {
var e = t.spriteFrame, i = this._renderData, n = e._rect, r = e.insetLeft, s = e.insetRight, o = n.width - r - s, a = e.insetTop, c = e.insetBottom, l = n.height - a - c, u = i.vertices;
if (e._rotated) {
u[0].u = n.x;
u[1].u = c + n.x;
u[2].u = c + l + n.x;
u[3].u = n.x + n.height;
u[3].v = n.y;
u[2].v = r + n.y;
u[1].v = r + o + n.y;
u[0].v = n.y + n.width;
} else {
u[0].u = n.x;
u[1].u = r + n.x;
u[2].u = r + o + n.x;
u[3].u = n.x + n.width;
u[3].v = n.y;
u[2].v = a + n.y;
u[1].v = a + l + n.y;
u[0].v = n.y + n.height;
}
};
e.prototype.updateVerts = function(t) {
var e = this._renderData.vertices, i = t.node, n = i.width, r = i.height, s = i.anchorX * n, o = i.anchorY * r, a = t.spriteFrame, c = a.insetLeft, l = a.insetRight, u = a.insetTop, h = a.insetBottom, f = n - c - l, d = r - u - h, _ = n / (c + l), p = r / (u + h);
_ = isNaN(_) || _ > 1 ? 1 : _;
p = isNaN(p) || p > 1 ? 1 : p;
f = f < 0 ? 0 : f;
d = d < 0 ? 0 : d;
if (a._rotated) {
e[0].y = -s;
e[0].x = -o;
e[1].y = l * _ - s;
e[1].x = h * p - o;
e[2].y = e[1].y + f;
e[2].x = e[1].x + d;
e[3].y = n - s;
e[3].x = r - o;
} else {
e[0].x = -s;
e[0].y = -o;
e[1].x = c * _ - s;
e[1].y = h * p - o;
e[2].x = e[1].x + f;
e[2].y = e[1].y + d;
e[3].x = n - s;
e[3].y = r - o;
}
t._vertsDirty = !1;
};
e.prototype.draw = function(t, e) {
var i = e.node, n = e._spriteFrame, r = i._worldMatrix.m, s = r[0], o = r[1], a = r[4], c = r[5], u = r[12], h = r[13];
t.transform(s, o, a, c, u, h);
t.scale(1, -1);
n._rotated && t.rotate(-Math.PI / 2);
l.context.setGlobalAlpha(t, i.opacity / 255);
for (var f = n._texture, d = this._renderData.vertices, _ = l.getColorizedImage(f, i._color), p = 0, v = void 0, g = void 0, m = void 0, y = void 0, E = void 0, C = void 0, T = void 0, A = void 0, x = void 0, b = void 0, S = void 0, R = void 0, w = 0; w < 3; ++w) {
y = d[w];
m = d[w + 1];
for (var L = 0; L < 3; ++L) {
v = d[L];
g = d[L + 1];
E = v.x;
C = y.y;
T = g.x - E;
C = -C - (A = m.y - C);
x = v.u;
b = m.v;
S = g.u - x;
R = y.v - b;
if (S > 0 && R > 0 && T > 0 && A > 0) {
t.drawImage(_, x, b, S, R, E, C, T, A);
p++;
}
}
}
return p;
};
return e;
})(r.default);
i.default = u;
e.exports = i.default;
}), {
"../../../assembler": 138,
"../render-data": 149,
"../utils": 154,
"./simple": 151
} ],
153: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../../assembler"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = t("../utils"), c = (function(t) {
o(e, t);
function e() {
r(this, e);
return s(this, t.apply(this, arguments));
}
e.prototype.draw = function(t, e) {
var i = e.node, n = i._worldMatrix.m, r = n[0], s = n[1], o = n[4], c = n[5], l = n[12], u = n[13];
t.transform(r, s, o, c, l, u);
t.scale(1, -1);
a.context.setGlobalAlpha(t, i.opacity / 255);
var h = e.spriteFrame, f = h._rect, d = h._texture, _ = f.x, p = f.y, v = h._rotated ? f.height : f.width, g = h._rotated ? f.width : f.height, m = a.getFrameCache(d, i._color, _, p, v, g), y = i.width, E = i.height, C = -i.anchorX * y, T = -i.anchorY * E;
T = -T - E;
t.translate(C, T);
t.fillStyle = t.createPattern(m, "repeat");
t.fillRect(0, 0, y, E);
return 1;
};
return e;
})(n.default);
i.default = c;
e.exports = i.default;
}), {
"../../../assembler": 138,
"../utils": 154
} ],
154: [ (function(t, e, i) {
"use strict";
function n(t, e, i, n, r, s, o) {
var a = e._image, c = t.getContext("2d");
t.width = s;
t.height = o;
c.globalCompositeOperation = "source-over";
c.fillStyle = "rgb(" + i.r + "," + i.g + "," + i.b + ")";
c.fillRect(0, 0, s, o);
c.globalCompositeOperation = "multiply";
c.drawImage(a, n, r, s, o, 0, 0, s, o);
c.globalCompositeOperation = "destination-atop";
c.drawImage(a, n, r, s, o, 0, 0, s, o);
return t;
}
var r = {
canvasMap: {},
canvasUsed: {},
canvasPool: [],
checking: !1,
check: function() {
var t = !1;
for (var e in this.canvasUsed) {
t = !0;
if (this.canvasUsed[e]) this.canvasUsed[e] = !1; else {
var i = this.canvasMap[e];
i.width = 0;
i.height = 0;
this.canvasPool.length < 32 && this.canvasPool.push(i);
delete this.canvasMap[e];
delete this.canvasUsed[e];
}
}
if (!t) {
cc.director.off(cc.Director.EVENT_AFTER_DRAW, this.check, this);
this.checking = !1;
}
},
startCheck: function() {
cc.director.on(cc.Director.EVENT_AFTER_DRAW, this.check, this);
this.checking = !0;
},
getCanvas: function(t) {
this.canvasUsed[t] = !0;
return this.canvasMap[t];
},
cacheCanvas: function(t, e) {
this.canvasMap[e] = t;
this.canvasUsed[e] = !0;
this.checking || this.startCheck();
},
dropImage: function(t) {
this.canvasMap[t] && delete this.canvasMap[t];
}
};
e.exports = {
getColorizedImage: function(t, e) {
if (!t) return null;
if (0 === t.width || 0 === t.height) return t._image;
var i = 16777215 & e._val;
if (16777215 === i) return t._image;
var s = t.url + i, o = r.getCanvas(s);
if (!o) {
n(o = r.canvasPool.pop() || document.createElement("canvas"), t, e, 0, 0, t.width, t.height);
r.cacheCanvas(o, s);
}
return o;
},
getFrameCache: function(t, e, i, s, o, a) {
if (!t || !t.url || i < 0 || s < 0 || o <= 0 || a <= 0) return null;
var c = t.url, l = !1, u = 16777215 & e._val;
if (16777215 !== u) {
c += u;
l = !0;
}
if (0 !== i || 0 !== s && o !== t.width && a !== t.height) {
c += "_" + i + "_" + s + "_" + o + "_" + a;
l = !0;
}
if (!l) return t._image;
var h = r.getCanvas(c);
if (!h) {
n(h = r.canvasPool.pop() || document.createElement("canvas"), t, e, i, s, o, a);
r.cacheCanvas(h, c);
}
return h;
},
dropColorizedImage: function(t, e) {
var i = t.url + (16777215 & e._val);
r.dropImage(i);
}
};
var s = -1, o = {
setGlobalAlpha: function(t, e) {
if (s !== e) {
s = e;
t.globalAlpha = s;
}
},
reset: function() {
s = -1;
}
};
e.exports.context = o;
}), {} ],
155: [ (function(t, e, i) {
"use strict";
var n = a(t("../../renderer/config")), r = a(t("../../renderer/gfx")), s = a(t("../../renderer/core/input-assembler")), o = a(t("../../renderer/core/pass"));
function a(t) {
return t && t.__esModule ? t : {
default: t
};
}
function c(t) {
return {
defaultTexture: new r.default.Texture2D(t, {
images: [],
width: 128,
height: 128,
wrapS: r.default.WRAP_REPEAT,
wrapT: r.default.WRAP_REPEAT,
format: r.default.TEXTURE_FMT_RGB8,
mipmap: !1
}),
programTemplates: [],
programChunks: {}
};
}
cc.renderer = e.exports = {
Texture2D: null,
InputAssembler: s.default,
Pass: o.default,
renderEngine: null,
canvas: null,
device: null,
scene: null,
drawCalls: 0,
_handle: null,
_cameraNode: null,
_camera: null,
_forward: null,
_flow: null,
initWebGL: function(e, i) {
t("./webgl/assemblers");
t("./webgl/model-batcher");
this.Texture2D = r.default.Texture2D;
this.canvas = e;
this._flow = cc.RenderFlow;
this.device = r.default.Device.getInstance();
this.scene = new renderer.Scene();
var s = c(this.device);
this._forward = new renderer.ForwardRenderer(this.device, s);
var o = new renderer.RenderFlow(this.device, this.scene, this._forward);
this._flow.init(o);
n.default.addStage("shadowcast");
n.default.addStage("opaque");
n.default.addStage("transparent");
},
initCanvas: function(e) {
var i = t("./canvas"), n = t("./canvas/Texture2D"), r = t("./canvas/Device");
this.Device = r;
this.Texture2D = n;
this.canvas = e;
this.device = new r(e);
this._camera = {
a: 1,
b: 0,
c: 0,
d: 1,
tx: 0,
ty: 0
};
this._handle = new i.RenderComponentHandle(this.device, this._camera);
this._forward = new i.ForwardRenderer();
this._flow = cc.RenderFlow;
this._flow.init(this._handle, this._forward);
},
updateCameraViewport: function() {
if (cc.director) {
var t = cc.director.getScene();
t && t.setScale(1, 1, 1);
}
if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
var e = cc.view.getViewportRect();
this.device.setViewport(e.x, e.y, e.width, e.height);
this._camera.a = cc.view.getScaleX();
this._camera.d = cc.view.getScaleY();
this._camera.tx = e.x;
this._camera.ty = e.y + e.height;
}
},
render: function(t, e) {
this.device.resetDrawCalls();
if (t) {
this._flow.render(t, e);
this.drawCalls = this.device.getDrawCalls();
}
},
clear: function() {
this._handle.reset();
this._forward.clear();
}
};
}), {
"../../renderer/config": 228,
"../../renderer/core/input-assembler": 230,
"../../renderer/core/pass": 231,
"../../renderer/gfx": 234,
"../../renderer/renderers/forward-renderer": void 0,
"../../renderer/scene/scene": void 0,
"./canvas": 142,
"./canvas/Device": 139,
"./canvas/Texture2D": 140,
"./webgl/assemblers": 164,
"./webgl/model-batcher": void 0
} ],
156: [ (function(t, e, i) {
"use strict";
var n = 0, r = 1 << n++, s = 1 << n++, o = 1 << n++, a = 1 << n++, c = o | a, l = 1 << n++, u = 1 << n++, h = 1 << n++, f = u | h, d = 1 << n++, _ = 1 << n++, p = 1 << n++, v = 1 << n++, g = void 0, m = void 0, y = 0;
function E() {
this._func = S;
this._next = null;
}
var C = E.prototype;
C._doNothing = function() {};
C._localTransform = function(t) {
t._updateLocalMatrix();
t._renderFlag &= ~o;
this._next._func(t);
};
C._worldTransform = function(t) {
g.worldMatDirty++;
var e = t._matrix, i = t._trs, n = e.m;
n[12] = i[0];
n[13] = i[1];
n[14] = i[2];
t._mulMat(t._worldMatrix, t._parent._worldMatrix, e);
t._renderFlag &= ~a;
this._next._func(t);
g.worldMatDirty--;
};
C._opacity = function(t) {
g.parentOpacityDirty++;
t._renderFlag &= ~u;
this._next._func(t);
g.parentOpacityDirty--;
};
C._color = function(t) {
var e = t._renderComponent;
e && e._updateColor();
t._renderFlag &= ~h;
this._next._func(t);
};
C._updateRenderData = function(t) {
var e = t._renderComponent;
e._assembler.updateRenderData(e);
t._renderFlag &= ~l;
this._next._func(t);
};
C._render = function(t) {
var e = t._renderComponent;
e._checkBacth(g, t._cullingMask);
e._assembler.fillBuffers(e, g);
this._next._func(t);
};
C._children = function(t) {
for (var e = y, i = g, n = i.parentOpacity, r = i.parentOpacity *= t._opacity / 255, s = (i.worldMatDirty ? a : 0) | (i.parentOpacityDirty ? f : 0), o = t._children, c = 0, l = o.length; c < l; c++) {
var u = o[c];
u._renderFlag |= s;
if (u._activeInHierarchy && 0 !== u._opacity) {
y = u._cullingMask = 0 === u.groupIndex ? e : 1 << u.groupIndex;
var h = u._color._val;
u._color._fastSetA(u._opacity * r);
A[u._renderFlag]._func(u);
u._color._val = h;
}
}
i.parentOpacity = n;
this._next._func(t);
};
C._postRender = function(t) {
var e = t._renderComponent;
e._checkBacth(g, t._cullingMask);
e._assembler.postFillBuffers(e, g);
this._next._func(t);
};
var T = new E();
T._func = T._doNothing;
T._next = T;
var A = {};
function x(t, e) {
var i = new E();
i._next = e || T;
switch (t) {
case r:
case s:
i._func = i._doNothing;
break;

case o:
i._func = i._localTransform;
break;

case a:
i._func = i._worldTransform;
break;

case u:
i._func = i._opacity;
break;

case h:
i._func = i._color;
break;

case l:
i._func = i._updateRenderData;
break;

case d:
i._func = i._render;
break;

case _:
i._func = i._children;
break;

case p:
i._func = i._postRender;
}
return i;
}
function b(t) {
for (var e = null, i = v; i > 0; ) {
i & t && (e = x(i, e));
i >>= 1;
}
return e;
}
function S(t) {
var e = t._renderFlag;
(A[e] = b(e))._func(t);
}
E.flows = A;
E.createFlow = x;
E.visitRootNode = function(t) {
y = 1 << t.groupIndex;
if (t._renderFlag & a) {
g.worldMatDirty++;
t._calculWorldMatrix();
t._renderFlag &= ~a;
A[t._renderFlag]._func(t);
g.worldMatDirty--;
} else A[t._renderFlag]._func(t);
};
E.render = function(t, e) {
g.reset();
g.walking = !0;
E.visitRootNode(t);
g.terminate();
g.walking = !1;
m.render(g._renderScene, e);
};
E.init = function(t, e) {
g = t;
m = e;
A[0] = T;
for (var i = 1; i < v; i++) A[i] = new E();
};
E.getBachther = function() {
return g;
};
E.FLAG_DONOTHING = r;
E.FLAG_BREAK_FLOW = s;
E.FLAG_LOCAL_TRANSFORM = o;
E.FLAG_WORLD_TRANSFORM = a;
E.FLAG_TRANSFORM = c;
E.FLAG_OPACITY = u;
E.FLAG_COLOR = h;
E.FLAG_OPACITY_COLOR = f;
E.FLAG_UPDATE_RENDER_DATA = l;
E.FLAG_RENDER = d;
E.FLAG_CHILDREN = _;
E.FLAG_POST_RENDER = p;
E.FLAG_FINAL = v;
e.exports = cc.RenderFlow = E;
}), {} ],
157: [ (function(t, e, i) {
"use strict";
var n = t("../../../assets/CCRenderTexture"), r = 2;
function s(t, e) {
var i = new n();
i.initWithSize(t, e);
i.update();
this._texture = i;
this._x = r;
this._y = r;
this._nexty = r;
this._width = t;
this._height = e;
this._innerTextureInfos = {};
this._innerSpriteFrames = [];
}
s.DEFAULT_HASH = new n()._getHash();
cc.js.mixin(s.prototype, {
insertSpriteFrame: function(t) {
var e = t._rect, i = t._texture, n = this._innerTextureInfos[i._id], s = e.x, o = e.y;
if (n) {
s += n.x;
o += n.y;
} else {
var a = i.width, c = i.height;
if (this._x + a + r > this._width) {
this._x = r;
this._y = this._nexty;
}
this._y + c + r > this._nexty && (this._nexty = this._y + c + r);
if (this._nexty > this._height) return null;
if (cc.dynamicAtlasManager.textureBleeding) {
this._texture.drawTextureAt(i, this._x - 1, this._y);
this._texture.drawTextureAt(i, this._x + 1, this._y);
this._texture.drawTextureAt(i, this._x, this._y - 1);
this._texture.drawTextureAt(i, this._x, this._y + 1);
}
this._texture.drawTextureAt(i, this._x, this._y);
this._innerTextureInfos[i._id] = {
x: this._x,
y: this._y,
texture: i
};
s += this._x;
o += this._y;
this._x += a + r;
this._dirty = !0;
}
var l = {
x: s,
y: o,
texture: this._texture
};
this._innerSpriteFrames.push(t);
return l;
},
update: function() {
if (this._dirty) {
this._texture.update();
this._dirty = !1;
}
},
deleteInnerTexture: function(t) {
t && delete this._innerTextureInfos[t._id];
},
reset: function() {
this._x = r;
this._y = r;
this._nexty = r;
for (var t = this._innerSpriteFrames, e = 0, i = t.length; e < i; e++) {
var n = t[e];
n.isValid && n._resetDynamicAtlasFrame();
}
this._innerSpriteFrames.length = 0;
this._innerTextureInfos = {};
},
destroy: function() {
this.reset();
this._texture.destroy();
}
});
e.exports = s;
}), {
"../../../assets/CCRenderTexture": 21
} ],
158: [ (function(t, e, i) {
"use strict";
var n = t("./atlas"), r = [], s = -1, o = 5, a = 2048, c = 8, l = 512, u = !0;
function h() {
var t = r[++s];
if (!t) {
t = new n(a, a);
r.push(t);
}
return t;
}
function f() {
_.reset();
}
var d = !1, _ = {
Atlas: n,
get enabled() {
return d;
},
set enabled(t) {
if (d !== t) {
if (t) {
this.reset();
cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, f);
} else cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, f);
d = t;
}
},
get maxAtlasCount() {
return o;
},
set maxAtlasCount(t) {
o = t;
},
get textureBleeding() {
return u;
},
set textureBleeding(t) {
u = t;
},
get textureSize() {
return a;
},
set textureSize(t) {
a = t;
},
get maxFrameSize() {
return l;
},
set maxFrameSize(t) {
l = t;
},
get minFrameSize() {
return c;
},
set minFrameSize(t) {
c = t;
},
insertSpriteFrame: function(t) {
0;
if (!d || s === o || !t || t._original) return null;
if (!t._texture.packable) return null;
var e = r[s];
e || (e = h());
var i = e.insertSpriteFrame(t);
return i || s === o ? i : (e = h()).insertSpriteFrame(t);
},
reset: function() {
for (var t = 0, e = r.length; t < e; t++) r[t].destroy();
r.length = 0;
s = -1;
},
deleteAtlasTexture: function(t) {
if (t._original) {
var e = t._original._texture;
if (e) for (var i = 0, n = r.length; i < n; i++) r[i].deleteInnerTexture(e);
}
},
showDebug: !1,
update: function() {
if (this.enabled) for (var t = 0; t <= s; t++) r[t].update();
}
};
e.exports = cc.dynamicAtlasManager = _;
}), {
"./atlas": 157
} ],
159: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../assembler-2d"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = t("../../../utils/text-utils"), c = t("../../../platform/CCMacro"), l = t("../../../components/CCLabel").Overflow, u = t("../utils").shareLabelInfo, h = function() {
this.char = "";
this.valid = !0;
this.x = 0;
this.y = 0;
this.line = 0;
this.hash = "";
}, f = cc.rect(), d = null, _ = [], p = [], v = [], g = [], m = null, y = 0, E = 0, C = 0, T = 0, A = 0, x = 1, b = null, S = cc.size(), R = "", w = 0, L = 0, O = 0, M = 0, I = 0, D = 0, N = 0, P = !1, F = 0, B = 0, z = 0, U = (function(t) {
o(e, t);
function e() {
r(this, e);
return s(this, t.apply(this, arguments));
}
e.prototype.updateRenderData = function(t) {
if (t._vertsDirty && d !== t) {
d = t;
this._reserveQuads(t, t.string.toString().length);
this._updateFontFamily(t);
this._updateProperties(t);
this._updateLabelInfo(t);
this._updateContent();
this.updateWorldVerts(t);
d._actualFontSize = w;
d.node.setContentSize(S);
d._vertsDirty = !1;
d = null;
this._resetProperties();
}
};
e.prototype._updateFontScale = function() {
x = w / L;
};
e.prototype._updateFontFamily = function(t) {
var e = t.font;
b = e.spriteFrame;
m = e._fntConfig;
u.fontAtlas = e._fontDefDictionary;
};
e.prototype._updateLabelInfo = function() {
u.hash = "";
u.margin = 0;
};
e.prototype._updateProperties = function(t) {
R = t.string.toString();
w = t.fontSize;
L = m ? m.fontSize : t.fontSize;
O = t.horizontalAlign;
M = t.verticalAlign;
I = t.spacingX;
N = t.overflow;
D = t._lineHeight;
S.width = t.node.width;
S.height = t.node.height;
if (N === l.NONE) {
P = !1;
S.width += 2 * u.margin;
S.height += 2 * u.margin;
} else if (N === l.RESIZE_HEIGHT) {
P = !0;
S.height += 2 * u.margin;
} else P = t.enableWrapText;
u.lineHeight = D;
u.fontSize = w;
this._setupBMFontOverflowMetrics();
};
e.prototype._resetProperties = function() {
m = null;
b = null;
u.hash = "";
u.margin = 0;
};
e.prototype._updateContent = function() {
this._updateFontScale();
this._computeHorizontalKerningForText();
this._alignText();
};
e.prototype._computeHorizontalKerningForText = function() {
for (var t = R, e = t.length, i = m.kerningDict, n = _, r = -1, s = 0; s < e; ++s) {
var o = t.charCodeAt(s), a = i[r << 16 | 65535 & o] || 0;
n[s] = s < e - 1 ? a : 0;
r = o;
}
};
e.prototype._multilineTextWrap = function(t) {
for (var e = R.length, i = 0, n = 0, r = 0, s = 0, o = 0, c = 0, l = 0, h = null, f = cc.v2(0, 0), d = 0; d < e; ) {
var p = R.charAt(d);
if ("\n" !== p) {
for (var g = t(R, d, e), C = c, b = l, w = o, L = n, O = !1, M = 0; M < g; ++M) {
var N = d + M;
if ("\r" !== (p = R.charAt(N))) if (h = u.fontAtlas.getLetterDefinitionForChar(p, u)) {
var U = L + h.offsetX * x - u.margin;
if (P && z > 0 && n > 0 && U + h.w * x > z && !a.isUnicodeSpace(p)) {
v.push(o);
o = 0;
i++;
n = 0;
r -= D * x + 0;
O = !0;
break;
}
f.x = U;
f.y = r - h.offsetY * x + u.margin;
this._recordLetterInfo(f, p, N, i);
N + 1 < _.length && N < e - 1 && (L += _[N + 1]);
L += h.xAdvance * x + I - 2 * u.margin;
w = f.x + h.w * x - u.margin;
C < f.y && (C = f.y);
b > f.y - h.h * x && (b = f.y - h.h * x);
} else {
this._recordPlaceholderInfo(N, p);
console.log("Can't find letter definition in texture atlas " + m.atlasName + " for letter:" + p);
} else this._recordPlaceholderInfo(N, p);
}
if (!O) {
n = L;
o = w;
c < C && (c = C);
l > b && (l = b);
s < o && (s = o);
d += g;
}
} else {
v.push(o);
o = 0;
i++;
n = 0;
r -= D * x + 0;
this._recordPlaceholderInfo(d, p);
d++;
}
}
v.push(o);
E = (y = i + 1) * D * x;
y > 1 && (E += 0 * (y - 1));
S.width = F;
S.height = B;
F <= 0 && (S.width = parseFloat(s.toFixed(2)) + 2 * u.margin);
B <= 0 && (S.height = parseFloat(E.toFixed(2)) + 2 * u.margin);
T = S.height;
A = 0;
c > 0 && (T = S.height + c);
l < -E && (A = E + l);
return !0;
};
e.prototype._getFirstCharLen = function() {
return 1;
};
e.prototype._getFirstWordLen = function(t, e, i) {
var n = t.charAt(e);
if (a.isUnicodeCJK(n) || "\n" === n || a.isUnicodeSpace(n)) return 1;
var r = 1, s = u.fontAtlas.getLetterDefinitionForChar(n, u);
if (!s) return r;
for (var o = s.xAdvance * x + I, c = e + 1; c < i; ++c) {
n = t.charAt(c);
if (!(s = u.fontAtlas.getLetterDefinitionForChar(n, u))) break;
if (o + s.offsetX * x + s.w * x > z && !a.isUnicodeSpace(n) && z > 0) return r;
o += s.xAdvance * x + I;
if ("\n" === n || a.isUnicodeSpace(n) || a.isUnicodeCJK(n)) break;
r++;
}
return r;
};
e.prototype._multilineTextWrapByWord = function() {
return this._multilineTextWrap(this._getFirstWordLen);
};
e.prototype._multilineTextWrapByChar = function() {
return this._multilineTextWrap(this._getFirstCharLen);
};
e.prototype._recordPlaceholderInfo = function(t, e) {
if (t >= p.length) {
var i = new h();
p.push(i);
}
p[t].char = e;
p[t].hash = e.charCodeAt(0) + u.hash;
p[t].valid = !1;
};
e.prototype._recordLetterInfo = function(t, e, i, n) {
if (i >= p.length) {
var r = new h();
p.push(r);
}
var s = e.charCodeAt(0) + u.hash;
p[i].line = n;
p[i].char = e;
p[i].hash = s;
p[i].valid = u.fontAtlas.getLetter(s).valid;
p[i].x = t.x;
p[i].y = t.y;
};
e.prototype._alignText = function() {
E = 0;
v.length = 0;
this._multilineTextWrapByWord();
this._computeAlignmentOffset();
N === l.SHRINK && w > 0 && this._isVerticalClamp() && this._shrinkLabelToContentSize(this._isVerticalClamp);
this._updateQuads() || N === l.SHRINK && this._shrinkLabelToContentSize(this._isHorizontalClamp);
};
e.prototype._scaleFontSizeDown = function(t) {
var e = !0;
if (!t) {
t = .1;
e = !1;
}
w = t;
e && this._updateContent();
};
e.prototype._shrinkLabelToContentSize = function(t) {
for (var e = w, i = 0, n = !0; t(); ) {
var r = e - ++i;
n = !1;
if (r <= 0) break;
x = r / L;
this._multilineTextWrapByWord();
this._computeAlignmentOffset();
}
n || e - i >= 0 && this._scaleFontSizeDown(e - i);
};
e.prototype._isVerticalClamp = function() {
return E > S.height;
};
e.prototype._isHorizontalClamp = function() {
for (var t = !1, e = 0, i = R.length; e < i; ++e) {
var n = p[e];
if (n.valid) {
var r = u.fontAtlas.getLetter(n.hash), s = n.x + r.w * x, o = n.line;
if (F > 0) if (P) {
if (v[o] > S.width && (s > S.width || s < 0)) {
t = !0;
break;
}
} else if (s > S.width) {
t = !0;
break;
}
}
}
return t;
};
e.prototype._isHorizontalClamped = function(t, e) {
var i = v[e], n = t > S.width || t < 0;
return P ? i > S.width && n : n;
};
e.prototype._updateQuads = function() {
var t = u.fontAtlas.getTexture(), e = d.node;
this.verticesCount = this.indicesCount = 0;
this._renderData && (this._renderData.dataLength = 0);
for (var i = S, n = e._anchorPoint.x * i.width, r = e._anchorPoint.y * i.height, s = !0, o = 0, a = R.length; o < a; ++o) {
var c = p[o];
if (c.valid) {
var h = u.fontAtlas.getLetter(c.hash);
f.height = h.h;
f.width = h.w;
f.x = h.u;
f.y = h.v;
var _ = c.y + C;
if (B > 0) {
if (_ > T) {
var v = _ - T;
f.y += v;
f.height -= v;
_ -= v;
}
_ - h.h * x < A && N === l.CLAMP && (f.height = _ < A ? 0 : _ - A);
}
var m = c.line, y = c.x + h.w / 2 * x + g[m];
if (F > 0 && this._isHorizontalClamped(y, m)) if (N === l.CLAMP) f.width = 0; else if (N === l.SHRINK) {
if (S.width > h.w) {
s = !1;
break;
}
f.width = 0;
}
if (f.height > 0 && f.width > 0) {
var E = this._determineRect(f), b = c.x + g[c.line];
this.appendQuad(d, t, f, E, b - n, _ - r, x);
}
}
}
this._quadsUpdated(d);
return s;
};
e.prototype._determineRect = function(t) {
var e = b.isRotated(), i = b._originalSize, n = b._rect, r = b._offset, s = r.x + (i.width - n.width) / 2, o = r.y - (i.height - n.height) / 2;
if (e) {
var a = t.x;
t.x = n.x + n.height - t.y - t.height - o;
t.y = a + n.y - s;
t.y < 0 && (t.height = t.height + o);
} else {
t.x += n.x - s;
t.y += n.y + o;
}
return e;
};
e.prototype._computeAlignmentOffset = function() {
g.length = 0;
switch (O) {
case c.TextAlignment.LEFT:
for (var t = 0; t < y; ++t) g.push(0);
break;

case c.TextAlignment.CENTER:
for (var e = 0, i = v.length; e < i; e++) g.push((S.width - v[e]) / 2);
break;

case c.TextAlignment.RIGHT:
for (var n = 0, r = v.length; n < r; n++) g.push(S.width - v[n]);
}
C = S.height;
if (M !== c.VerticalTextAlignment.TOP) {
var s = S.height - E + (D - L) * x;
M === c.VerticalTextAlignment.BOTTOM ? C -= s : C -= s / 2;
}
};
e.prototype._setupBMFontOverflowMetrics = function() {
var t = S.width, e = S.height;
N === l.RESIZE_HEIGHT && (e = 0);
if (N === l.NONE) {
t = 0;
e = 0;
}
F = t;
B = e;
z = t;
};
e.prototype.updateWorldVerts = function() {};
e.prototype.appendQuad = function(t, e, i, n, r, s, o) {};
e.prototype._quadsUpdated = function(t) {};
e.prototype._reserveQuads = function() {};
return e;
})(n.default);
i.default = U;
e.exports = i.default;
}), {
"../../../components/CCLabel": 49,
"../../../platform/CCMacro": 115,
"../../../utils/text-utils": 194,
"../../assembler-2d": 136,
"../utils": 163
} ],
160: [ (function(t, e, i) {
"use strict";
function n() {
this._rect = null;
this.uv = [];
this._texture = null;
this._original = null;
}
n.prototype = {
constructor: n,
getRect: function() {
return cc.rect(this._rect);
},
setRect: function(t) {
this._rect = t;
this._texture && this._calculateUV();
},
_setDynamicAtlasFrame: function(t) {
if (t) {
this._original = {
_texture: this._texture,
_x: this._rect.x,
_y: this._rect.y
};
this._texture = t.texture;
this._rect.x = t.x;
this._rect.y = t.y;
this._calculateUV();
}
},
_resetDynamicAtlasFrame: function() {
if (this._original) {
this._rect.x = this._original._x;
this._rect.y = this._original._y;
this._texture = this._original._texture;
this._original = null;
this._calculateUV();
}
},
_refreshTexture: function(t) {
this._texture = t;
this._rect = cc.rect(0, 0, t.width, t.height);
this._calculateUV();
},
_calculateUV: function() {
var t = this._rect, e = this._texture, i = this.uv, n = e.width, r = e.height, s = 0 === n ? 0 : t.x / n, o = 0 === n ? 0 : (t.x + t.width) / n, a = 0 === r ? 0 : (t.y + t.height) / r, c = 0 === r ? 0 : t.y / r;
i[0] = s;
i[1] = a;
i[2] = o;
i[3] = a;
i[4] = s;
i[5] = c;
i[6] = o;
i[7] = c;
}
};
e.exports = n;
}), {} ],
161: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../webgl/assemblers/label/2d/bmfont"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = t("../../../components/CCLabel"), c = t("../../../components/CCLabelOutline"), l = t("../../../utils/text-utils"), u = t("../../../components/CCComponent"), h = t("../../../assets/CCRenderTexture"), f = cc.js.isChildClassOf(c, u), d = t("../utils").getFontFamily, _ = t("../utils").shareLabelInfo, p = cc.BitmapFont.FontLetterDefinition, v = cc.BitmapFont.FontAtlas, g = cc.Color.WHITE, m = 2, y = (1 / 255).toFixed(3);
function E(t, e) {
this._texture = null;
this._labelInfo = e;
this._char = t;
this._hash = null;
this._data = null;
this._canvas = null;
this._context = null;
this._width = 0;
this._height = 0;
this._offsetY = 0;
this._hash = t.charCodeAt(0) + e.hash;
}
E.prototype = {
constructor: E,
updateRenderData: function() {
this._updateProperties();
this._updateTexture();
},
_updateProperties: function() {
this._texture = new cc.Texture2D();
this._data = a._canvasPool.get();
this._canvas = this._data.canvas;
this._context = this._data.context;
this._context.font = this._labelInfo.fontDesc;
var t = l.safeMeasureText(this._context, this._char);
this._width = parseFloat(t.toFixed(2)) + 2 * this._labelInfo.margin;
this._height = (1 + l.BASELINE_RATIO) * this._labelInfo.fontSize + 2 * this._labelInfo.margin;
this._offsetY = -this._labelInfo.fontSize * l.BASELINE_RATIO / 2;
this._canvas.width !== this._width && (this._canvas.width = this._width);
this._canvas.height !== this._height && (this._canvas.height = this._height);
this._texture.initWithElement(this._canvas);
},
_updateTexture: function() {
var t = this._context, e = this._labelInfo, i = this._canvas.width, n = this._canvas.height, r = i / 2, s = n / 2 + this._labelInfo.fontSize * l.MIDDLE_RATIO, o = e.color;
t.textAlign = "center";
t.textBaseline = "alphabetic";
t.clearRect(0, 0, i, n);
t.fillStyle = "rgba(" + o.r + ", " + o.g + ", " + o.b + ", " + y + ")";
t.fillRect(0, 0, i, n);
t.font = e.fontDesc;
t.lineJoin = "round";
t.fillStyle = "rgba(" + o.r + ", " + o.g + ", " + o.b + ", 1)";
if (e.isOutlined) {
var a = e.out || g;
t.strokeStyle = "rgba(" + a.r + ", " + a.g + ", " + a.b + ", " + a.a / 255 + ")";
t.lineWidth = 2 * e.margin;
t.strokeText(this._char, r, s);
}
t.fillText(this._char, r, s);
this._texture.handleLoadedTexture();
},
destroy: function() {
this._texture.destroy();
this._texture = null;
a._canvasPool.put(this._data);
}
};
function C(t, e) {
var i = new h();
i.initWithSize(t, e);
i.update();
this._fontDefDictionary = new v(i);
this._x = m;
this._y = m;
this._nexty = m;
this._width = t;
this._height = e;
cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, this.beforeSceneLoad, this);
}
cc.js.mixin(C.prototype, {
insertLetterTexture: function(t) {
var e = t._texture, i = e.width, n = e.height;
if (this._x + i + m > this._width) {
this._x = m;
this._y = this._nexty;
}
this._y + n > this._nexty && (this._nexty = this._y + n + m);
if (this._nexty > this._height) return null;
this._fontDefDictionary._texture.drawTextureAt(e, this._x, this._y);
this._dirty = !0;
var r = new p();
r.u = this._x;
r.v = this._y;
r.texture = this._fontDefDictionary._texture;
r.valid = !0;
r.w = t._width;
r.h = t._height;
r.xAdvance = t._width;
r.offsetY = t._offsetY;
this._x += i + m;
this._fontDefDictionary.addLetterDefinitions(t._hash, r);
return r;
},
update: function() {
if (this._dirty) {
this._fontDefDictionary._texture.update();
this._dirty = !1;
}
},
reset: function() {
this._x = m;
this._y = m;
this._nexty = m;
for (var t = this._fontDefDictionary._letterDefinitions, e = 0, i = t.length; e < i; e++) {
var n = t[e];
n.isValid && n.destroy();
}
this._fontDefDictionary.clear();
},
destroy: function() {
this.reset();
this._fontDefDictionary._texture.destroy();
this._fontDefDictionary._texture = null;
},
beforeSceneLoad: function() {
this.clearAllCache();
},
clearAllCache: function() {
this.destroy();
var t = new h();
t.initWithSize(this._width, this._height);
t.update();
this._fontDefDictionary._texture = t;
},
getLetter: function(t) {
return this._fontDefDictionary._letterDefinitions[t];
},
getTexture: function() {
return this._fontDefDictionary.getTexture();
},
getLetterDefinitionForChar: function(t, e) {
var i = t.charCodeAt(0) + e.hash, n = this._fontDefDictionary._letterDefinitions[i];
if (!n) {
var r = new E(t, e);
r.updateRenderData();
n = this.insertLetterTexture(r);
r.destroy();
}
return n;
}
});
function T(t) {
var e = t.color.toHEX("#rrggbb"), i = "";
t.isOutlined && (i = i + t.margin + t.out.toHEX("#rrggbb"));
return "" + t.fontSize + t.fontFamily + e + i;
}
var A = null, x = (function(t) {
o(e, t);
function e() {
r(this, e);
return s(this, t.apply(this, arguments));
}
e.prototype._getAssemblerData = function() {
if (!A) {
A = new C(2048, 2048);
cc.Label._shareAtlas = A;
}
return A.getTexture();
};
e.prototype._updateFontFamily = function(t) {
_.fontAtlas = A;
_.fontFamily = d(t);
var e = f && t.getComponent(c);
if (e && e.enabled) {
_.isOutlined = !0;
_.margin = e.width;
_.out = e.color.clone();
_.out.a = e.color.a * t.node.color.a / 255;
} else {
_.isOutlined = !1;
_.margin = 0;
}
};
e.prototype._updateLabelInfo = function(t) {
_.fontDesc = this._getFontDesc();
_.color = t.node.color;
_.hash = T(_);
};
e.prototype._getFontDesc = function() {
var t = _.fontSize.toString() + "px ";
0;
return t += _.fontFamily;
};
e.prototype._computeHorizontalKerningForText = function() {};
e.prototype._determineRect = function(t) {
return !1;
};
return e;
})(n.default);
i.default = x;
e.exports = i.default;
}), {
"../../../assets/CCRenderTexture": 21,
"../../../components/CCComponent": 47,
"../../../components/CCLabel": 49,
"../../../components/CCLabelOutline": 50,
"../../../utils/text-utils": 194,
"../../webgl/assemblers/label/2d/bmfont": 165,
"../utils": 163
} ],
162: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../assembler-2d"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = t("../../../utils/text-utils"), c = t("../../../platform/CCMacro"), l = t("../../../components/CCLabel"), u = t("../../../components/CCLabelOutline"), h = t("../../../components/CCLabelShadow"), f = l.Overflow, d = t("../utils").deleteFromDynamicAtlas, _ = t("../utils").getFontFamily, p = (1 / 255).toFixed(3), v = null, g = null, m = null, y = "", E = "", C = 0, T = 0, A = [], x = cc.Size.ZERO, b = 0, S = 0, R = 0, w = null, L = "", O = f.NONE, M = !1, I = null, D = cc.Color.WHITE, N = null, P = cc.Color.BLACK, F = cc.rect(), B = cc.Size.ZERO, z = cc.Size.ZERO, U = !1, k = !1, H = !1, G = 0, V = cc.Vec2.ZERO, j = 0, W = void 0, Y = (function(t) {
o(e, t);
function e() {
r(this, e);
return s(this, t.apply(this, arguments));
}
e.prototype._getAssemblerData = function() {
(W = l._canvasPool.get()).canvas.width = W.canvas.height = 1;
return W;
};
e.prototype._resetAssemblerData = function(t) {
t && l._canvasPool.put(t);
};
e.prototype.updateRenderData = function(e) {
t.prototype.updateRenderData.call(this, e);
if (e._vertsDirty) {
this._updateFontFamily(e);
this._updateProperties(e);
this._calculateLabelFont();
this._calculateSplitedStrings();
this._updateLabelDimensions();
this._calculateTextBaseline();
this._updateTexture(e);
this._calDynamicAtlas(e);
e._actualFontSize = C;
e.node.setContentSize(z);
this.updateVerts(e);
e._vertsDirty = !1;
v = null;
g = null;
m = null;
}
};
e.prototype.updateVerts = function() {};
e.prototype._updatePaddingRect = function() {
var t = 0, e = 0, i = 0, n = 0, r = 0;
B.width = B.height = 0;
if (I) {
t = e = i = n = r = I.width;
B.width = B.height = 2 * r;
}
if (N) {
var s = N.blur + r;
i = Math.max(i, -N._offset.x + s);
n = Math.max(n, N._offset.x + s);
t = Math.max(t, N._offset.y + s);
e = Math.max(e, -N._offset.y + s);
}
if (k) {
var o = T * Math.tan(.20943951);
n += o;
B.width += o;
}
F.x = i;
F.y = t;
F.width = i + n;
F.height = t + e;
};
e.prototype._updateFontFamily = function(t) {
L = _(t);
};
e.prototype._updateProperties = function(t) {
var e = t._assemblerData;
v = e.context;
g = e.canvas;
m = t._frame._original ? t._frame._original._texture : t._frame._texture;
E = t.string.toString();
C = t._fontSize;
G = (T = C) / 8;
O = t.overflow;
x.width = t.node.width;
x.height = t.node.height;
z = t.node.getContentSize();
b = t._lineHeight;
S = t.horizontalAlign;
R = t.verticalAlign;
w = t.node.color;
U = t._isBold;
k = t._isItalic;
H = t._isUnderline;
M = O !== f.NONE && (O === f.RESIZE_HEIGHT || t.enableWrapText);
(I = (I = u && t.getComponent(u)) && I.enabled && I.width > 0 ? I : null) && D.set(I.color);
if (N = (N = h && t.getComponent(h)) && N.enabled ? N : null) {
P.set(N.color);
P.a = P.a * t.node.color.a / 255;
}
this._updatePaddingRect();
};
e.prototype._calculateFillTextStartPosition = function() {
var t = 0;
S === c.TextAlignment.RIGHT ? t = x.width - F.width : S === c.TextAlignment.CENTER && (t = (x.width - F.width) / 2);
var e = this._getLineHeight() * (A.length - 1), i = C * (1 - a.BASELINE_RATIO / 2);
if (R !== c.VerticalTextAlignment.TOP) {
var n = e + F.height + C - x.height;
R === c.VerticalTextAlignment.BOTTOM ? i -= n : i -= n / 2;
}
return cc.v2(t + F.x, i + F.y);
};
e.prototype._setupOutline = function() {
v.strokeStyle = "rgba(" + D.r + ", " + D.g + ", " + D.b + ", " + D.a / 255 + ")";
v.lineWidth = 2 * I.width;
};
e.prototype._setupShadow = function() {
v.shadowColor = "rgba(" + P.r + ", " + P.g + ", " + P.b + ", " + P.a / 255 + ")";
v.shadowBlur = N.blur;
v.shadowOffsetX = N.offset.x;
v.shadowOffsetY = -N.offset.y;
};
e.prototype._drawUnderline = function(t) {
if (I) {
this._setupOutline();
v.strokeRect(V.x, V.y, t, G);
}
v.lineWidth = G;
v.fillStyle = "rgba(" + w.r + ", " + w.g + ", " + w.b + ", " + w.a / 255 + ")";
v.fillRect(V.x, V.y, t, G);
};
e.prototype._updateTexture = function() {
v.clearRect(0, 0, g.width, g.height);
var t = I ? D : w;
v.fillStyle = "rgba(" + t.r + ", " + t.g + ", " + t.b + ", " + p + ")";
v.fillRect(0, 0, g.width, g.height);
v.font = y;
var e = this._calculateFillTextStartPosition(), i = this._getLineHeight();
v.lineJoin = "round";
v.fillStyle = "rgba(" + w.r + ", " + w.g + ", " + w.b + ", 1)";
var n = A.length > 1, r = this._measureText(v), s = 0, o = 0;
N && this._setupShadow();
I && this._setupOutline();
for (var a = 0; a < A.length; ++a) {
s = e.x;
o = e.y + a * i;
if (N && n) {
I && v.strokeText(A[a], s, o);
v.fillText(A[a], s, o);
}
if (H) {
j = r(A[a]);
S === c.TextAlignment.RIGHT ? V.x = e.x - j : S === c.TextAlignment.CENTER ? V.x = e.x - j / 2 : V.x = e.x;
V.y = o;
this._drawUnderline(j);
}
}
N && n && (v.shadowColor = "transparent");
for (var l = 0; l < A.length; ++l) {
s = e.x;
o = e.y + l * i;
I && v.strokeText(A[l], s, o);
v.fillText(A[l], s, o);
}
N && (v.shadowColor = "transparent");
m.handleLoadedTexture();
};
e.prototype._calDynamicAtlas = function(t) {
if (t.cacheMode === l.CacheMode.BITMAP) {
var e = t._frame;
d(t, e);
e._original || e.setRect(cc.rect(0, 0, g.width, g.height));
this.packToDynamicAtlas(t, e);
}
};
e.prototype._updateLabelDimensions = function() {
var t = E.split("\n");
if (O === f.RESIZE_HEIGHT) {
var e = (A.length + a.BASELINE_RATIO) * this._getLineHeight();
x.height = e + F.height;
z.height = e + B.height;
} else if (O === f.NONE) {
A = t;
for (var i = 0, n = 0, r = 0; r < t.length; ++r) {
var s = a.safeMeasureText(v, t[r]);
i = i > s ? i : s;
}
n = (A.length + a.BASELINE_RATIO) * this._getLineHeight();
var o = parseFloat(i.toFixed(2)), c = parseFloat(n.toFixed(2));
x.width = o + F.width;
x.height = c + F.height;
z.width = o + B.width;
z.height = c + B.height;
}
x.width = Math.min(x.width, 2048);
x.height = Math.min(x.height, 2048);
g.width !== x.width && (g.width = x.width);
g.height !== x.height && (g.height = x.height);
};
e.prototype._calculateTextBaseline = function() {
var t = void 0;
t = S === c.TextAlignment.RIGHT ? "right" : S === c.TextAlignment.CENTER ? "center" : "left";
v.textAlign = t;
v.textBaseline = "alphabetic";
};
e.prototype._calculateSplitedStrings = function() {
var t = E.split("\n");
if (M) {
A = [];
for (var e = z.width, i = 0; i < t.length; ++i) {
var n = a.safeMeasureText(v, t[i]), r = a.fragmentText(t[i], n, e, this._measureText(v));
A = A.concat(r);
}
} else A = t;
};
e.prototype._getFontDesc = function() {
var t = C.toString() + "px ";
t += L;
U && (t = "bold " + t);
k && (t = "italic " + t);
return t;
};
e.prototype._getLineHeight = function() {
var t = b;
return 0 | (t = 0 === t ? C : t * C / T);
};
e.prototype._calculateParagraphLength = function(t, e) {
for (var i = [], n = 0; n < t.length; ++n) {
var r = a.safeMeasureText(e, t[n]);
i.push(r);
}
return i;
};
e.prototype._measureText = function(t) {
return function(e) {
return a.safeMeasureText(t, e);
};
};
e.prototype._calculateLabelFont = function() {
y = this._getFontDesc();
v.font = y;
if (O === f.SHRINK) {
var t = E.split("\n"), e = this._calculateParagraphLength(t, v), i = 0, n = 0, r = 0;
if (M) {
var s = z.width, o = z.height;
if (s < 0 || o < 0) {
y = this._getFontDesc();
v.font = y;
return;
}
n = o + 1;
r = s + 1;
for (var c = C + 1, l = "", u = !0, h = 0 | c; n > o || r > s; ) {
u ? c = h / 2 | 0 : h = c = h - 1;
if (c <= 0) {
cc.logID(4003);
break;
}
C = c;
y = this._getFontDesc();
v.font = y;
n = 0;
for (i = 0; i < t.length; ++i) {
var d = 0, _ = a.safeMeasureText(v, t[i]);
l = a.fragmentText(t[i], _, s, this._measureText(v));
for (;d < l.length; ) {
r = a.safeMeasureText(v, l[d]);
n += this._getLineHeight();
++d;
}
}
if (u) if (n > o) h = 0 | c; else {
u = !1;
n = o + 1;
}
}
} else {
n = t.length * this._getLineHeight();
for (i = 0; i < t.length; ++i) r < e[i] && (r = e[i]);
var p = (x.width - F.width) / r, g = x.height / n;
C = T * Math.min(1, p, g) | 0;
y = this._getFontDesc();
v.font = y;
}
}
};
return e;
})(n.default);
i.default = Y;
e.exports = i.default;
}), {
"../../../components/CCLabel": 49,
"../../../components/CCLabelOutline": 50,
"../../../components/CCLabelShadow": 51,
"../../../platform/CCMacro": 115,
"../../../utils/text-utils": 194,
"../../assembler-2d": 136,
"../utils": 163
} ],
163: [ (function(t, e, i) {
"use strict";
var n = t("./dynamic-atlas/manager"), r = cc.Color.WHITE, s = {
fontAtlas: null,
fontSize: 0,
lineHeight: 0,
hAlign: 0,
vAlign: 0,
hash: "",
fontFamily: "",
fontDesc: "Arial",
color: r,
isOutlined: !1,
out: r,
margin: 0
};
e.exports = {
deleteFromDynamicAtlas: function(t, e) {
if (e && e._original && n) {
n.deleteAtlasTexture(e);
e._resetDynamicAtlasFrame();
}
},
getFontFamily: function(t) {
if (t.useSystemFont) return t.fontFamily || "Arial";
if (t.font) {
if (t.font._nativeAsset) return t.font._nativeAsset;
cc.loader.load(t.font.nativeUrl, (function(e, i) {
t.font._nativeAsset = i;
t._lazyUpdateRenderData();
}));
return "Arial";
}
return "Arial";
},
shareLabelInfo: s
};
}), {
"./dynamic-atlas/manager": 158
} ],
164: [ (function(t, e, i) {
"use strict";
cc.assemblers = {};
t("./sprite");
t("./mask-assembler");
t("./graphics");
t("./label");
t("./motion-streak");
}), {
"./graphics": void 0,
"./label": 168,
"./mask-assembler": void 0,
"./motion-streak": void 0,
"./sprite": 175
} ],
165: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function r(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function s(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var o = 0, a = (function(t) {
s(e, t);
function e() {
n(this, e);
return r(this, t.apply(this, arguments));
}
e.prototype.initData = function() {
this._renderData.createFlexData(0, 4, 6, this.getVfmt());
};
e.prototype._reserveQuads = function(t, e) {
var i = 4 * e, n = 6 * e, r = this._renderData._flexBuffer;
r.reserve(i, n);
r.used(i, n);
for (var s = this._renderData.iDatas[0], a = 0, c = 0, l = n; a < l; a += 6, c += 4) {
s[a] = c;
s[a + 1] = c + 1;
s[a + 2] = c + 2;
s[a + 3] = c + 1;
s[a + 4] = c + 3;
s[a + 5] = c + 2;
}
o = 0;
};
e.prototype._quadsUpdated = function(t) {
o = 0;
this._renderData._flexBuffer.used(this.verticesCount, this.indicesCount);
};
e.prototype._getColor = function(t) {
return t.node._color._val;
};
e.prototype.appendQuad = function(t, e, i, n, r, s, a) {
var c = this._renderData, l = c.vDatas[0], u = c.uintVDatas[0];
this.verticesCount += 4;
this.indicesCount = this.verticesCount / 2 * 3;
var h = e.width, f = e.height, d = i.width, _ = i.height, p = this._getColor(t), v = void 0, g = void 0, m = void 0, y = void 0, E = this.floatsPerVert, C = o + this.uvOffset;
if (n) {
v = i.x / h;
m = (i.x + _) / h;
g = (i.y + d) / f;
y = i.y / f;
l[C] = v;
l[C + 1] = y;
l[C += E] = v;
l[C + 1] = g;
l[C += E] = m;
l[C + 1] = y;
l[C += E] = m;
l[C + 1] = g;
} else {
v = i.x / h;
m = (i.x + d) / h;
g = (i.y + _) / f;
y = i.y / f;
l[C] = v;
l[C + 1] = g;
l[C += E] = m;
l[C + 1] = g;
l[C += E] = v;
l[C + 1] = y;
l[C += E] = m;
l[C + 1] = y;
}
v = r;
m = r + d * a;
g = s - _ * a;
y = s;
this.appendVerts(t, o, v, m, g, y);
for (var T = o + this.colorOffset, A = 0; A < 4; A++) {
u[T] = p;
T += E;
}
o += 4 * this.floatsPerVert;
};
e.prototype.appendVerts = function(t, e, i, n, r, s) {
var o = this._local, a = this.floatsPerVert;
o[e] = i;
o[e + 1] = r;
o[e += a] = n;
o[e + 1] = r;
o[e += a] = i;
o[e + 1] = s;
o[e += a] = n;
o[e + 1] = s;
};
e.prototype.updateWorldVerts = function(t) {
for (var e = t.node._worldMatrix.m, i = e[0], n = e[1], r = e[4], s = e[5], o = e[12], a = e[13], c = this._local, l = this._renderData.vDatas[0], u = this.floatsPerVert, h = 0; h < c.length; h += u) {
var f = c[h], d = c[h + 1];
l[h] = f * i + d * r + o;
l[h + 1] = f * n + d * s + a;
}
};
return e;
})(function(t) {
return t && t.__esModule ? t : {
default: t
};
}(t("../../../../utils/label/bmfont")).default);
i.default = a;
e.exports = i.default;
}), {
"../../../../utils/label/bmfont": 159
} ],
166: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function r(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function s(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
t("../../../../../platform/js"), t("./bmfont");
var o = t("../../../../utils/label/letter-font"), a = cc.color(255, 255, 255, 255), c = (function(t) {
s(e, t);
function e() {
n(this, e);
return r(this, t.apply(this, arguments));
}
e.prototype.createData = function(t) {
return t.requestRenderData();
};
e.prototype._getColor = function(t) {
a._fastSetA(t.node._color.a);
return a._val;
};
e.prototype.updateColor = function(e) {
var i = this._getColor(e);
t.prototype.updateColor.call(this, e, i);
};
return e;
})(o);
i.default = c;
e.exports = i.default;
}), {
"../../../../../platform/js": 130,
"../../../../utils/label/letter-font": 161,
"./bmfont": 165
} ],
167: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../../../utils/label/ttf"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = t("../../../../../components/CCLabelShadow"), c = cc.color(255, 255, 255, 255), l = (function(t) {
o(e, t);
function e() {
r(this, e);
return s(this, t.apply(this, arguments));
}
e.prototype.updateUVs = function(t) {
for (var e = this._renderData.vDatas[0], i = t._frame.uv, n = this.uvOffset, r = this.floatsPerVert, s = 0; s < 4; s++) {
var o = 2 * s, a = r * s + n;
e[a] = i[o];
e[a + 1] = i[o + 1];
}
};
e.prototype.updateColor = function(e) {
c._fastSetA(e.node._color.a);
var i = c._val;
t.prototype.updateColor.call(this, e, i);
};
e.prototype.updateVerts = function(t) {
var e = t.node, i = t._ttfTexture.width, n = t._ttfTexture.height, r = e.anchorX * e.width, s = e.anchorY * e.height, o = a && t.getComponent(a);
if (o && o._enabled) {
var c = (i - e.width) / 2, l = (n - e.height) / 2, u = o.offset;
-u.x > c ? r += i - e.width : c > u.x && (r += c - u.x);
-u.y > l ? s += n - e.height : l > u.y && (s += l - u.y);
}
var h = this._local;
h[0] = -r;
h[1] = -s;
h[2] = i - r;
h[3] = n - s;
this.updateUVs(t);
this.updateWorldVerts(t);
};
return e;
})(n.default);
i.default = l;
e.exports = i.default;
}), {
"../../../../../components/CCLabelShadow": 51,
"../../../../utils/label/ttf": 162
} ],
168: [ (function(t, e, i) {
"use strict";
var n = h(t("../../../assembler")), r = h(t("../../../../components/CCLabel")), s = h(t("./2d/ttf")), o = h(t("./2d/bmfont")), a = h(t("./2d/letter")), c = h(t("./3d/ttf")), l = h(t("./3d/bmfont")), u = h(t("./3d/letter"));
function h(t) {
return t && t.__esModule ? t : {
default: t
};
}
r.default._canvasPool = {
pool: [],
get: function() {
var t = this.pool.pop();
if (!t) {
var e = document.createElement("canvas");
t = {
canvas: e,
context: e.getContext("2d")
};
}
return t;
},
put: function(t) {
this.pool.length >= 32 || this.pool.push(t);
}
};
n.default.register(cc.Label, {
getConstructor: function(t) {
var e = t.node.is3DNode, i = e ? c.default : s.default;
t.font instanceof cc.BitmapFont ? i = e ? l.default : o.default : t.cacheMode === r.default.CacheMode.CHAR && (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB ? cc.warn("sorry, subdomain does not support CHAR mode currently!") : i = e ? u.default : a.default);
return i;
},
TTF: s.default,
Bmfont: o.default,
Letter: a.default,
TTF3D: c.default,
Bmfont3D: l.default,
Letter3D: u.default
});
}), {
"../../../../components/CCLabel": 49,
"../../../assembler": 138,
"./2d/bmfont": 165,
"./2d/letter": 166,
"./2d/ttf": 167,
"./3d/bmfont": void 0,
"./3d/letter": void 0,
"./3d/ttf": void 0
} ],
169: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../../../assembler-2d"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = t("../../../../../components/CCSprite").FillType, c = (function(t) {
o(e, t);
function e() {
r(this, e);
return s(this, t.apply(this, arguments));
}
e.prototype.updateRenderData = function(t) {
var e = t._spriteFrame;
if (e) {
this.packToDynamicAtlas(t, e);
if (t._vertsDirty) {
var i = t._fillStart, n = t._fillRange;
if (n < 0) {
i += n;
n = -n;
}
n = i + n;
i = (i = i > 1 ? 1 : i) < 0 ? 0 : i;
n = (n = n > 1 ? 1 : n) < 0 ? 0 : n;
var r = i + (n = (n -= i) < 0 ? 0 : n);
r = r > 1 ? 1 : r;
this.updateUVs(t, i, r);
this.updateVerts(t, i, r);
t._vertsDirty = !1;
}
}
};
e.prototype.updateUVs = function(t, e, i) {
var n = t._spriteFrame, r = n._texture.width, s = n._texture.height, o = n._rect, c = void 0, l = void 0, u = void 0, h = void 0, f = void 0, d = void 0, _ = void 0, p = void 0, v = void 0, g = void 0, m = void 0, y = void 0;
if (n._rotated) {
c = o.x / r;
l = (o.y + o.width) / s;
u = (o.x + o.height) / r;
h = o.y / s;
f = _ = c;
v = m = u;
p = y = l;
d = g = h;
} else {
c = o.x / r;
l = (o.y + o.height) / s;
u = (o.x + o.width) / r;
h = o.y / s;
f = v = c;
_ = m = u;
d = p = l;
g = y = h;
}
var E = this._renderData.vDatas[0], C = this.uvOffset, T = this.floatsPerVert;
switch (t._fillType) {
case a.HORIZONTAL:
E[C] = f + (_ - f) * e;
E[C + 1] = d + (p - d) * e;
E[C + T] = f + (_ - f) * i;
E[C + T + 1] = d + (p - d) * i;
E[C + 2 * T] = v + (m - v) * e;
E[C + 2 * T + 1] = g + (y - g) * e;
E[C + 3 * T] = v + (m - v) * i;
E[C + 3 * T + 1] = g + (y - g) * i;
break;

case a.VERTICAL:
E[C] = f + (v - f) * e;
E[C + 1] = d + (g - d) * e;
E[C + T] = _ + (m - _) * e;
E[C + T + 1] = p + (y - p) * e;
E[C + 2 * T] = f + (v - f) * i;
E[C + 2 * T + 1] = d + (g - d) * i;
E[C + 3 * T] = _ + (m - _) * i;
E[C + 3 * T + 1] = p + (y - p) * i;
break;

default:
cc.errorID(2626);
}
};
e.prototype.updateVerts = function(t, e, i) {
var n = t.node, r = n.width, s = n.height, o = n.anchorX * r, c = n.anchorY * s, l = -o, u = -c, h = r - o, f = s - c, d = void 0;
switch (t._fillType) {
case a.HORIZONTAL:
d = l + (h - l) * i;
l = l + (h - l) * e;
h = d;
break;

case a.VERTICAL:
d = u + (f - u) * i;
u = u + (f - u) * e;
f = d;
break;

default:
cc.errorID(2626);
}
var _ = this._local;
_[0] = l;
_[1] = u;
_[2] = h;
_[3] = f;
this.updateWorldVerts(t);
};
return e;
})(n.default);
i.default = c;
e.exports = i.default;
}), {
"../../../../../components/CCSprite": 57,
"../../../../assembler-2d": 136
} ],
170: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function r(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function s(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var o = (function(t) {
s(e, t);
function e() {
n(this, e);
return r(this, t.apply(this, arguments));
}
e.prototype.initData = function(t) {
this._renderData.createFlexData(0, 4, 6, this.getVfmt());
};
e.prototype.updateRenderData = function(t) {
this.packToDynamicAtlas(t, t._spriteFrame);
var e = t.spriteFrame;
if (e) {
var i = e.vertices;
if (i) {
this.verticesCount = i.x.length;
this.indicesCount = i.triangles.length;
var n = this._renderData._flexBuffer;
if (n.reserve(this.verticesCount, this.indicesCount)) {
this.updateColor(t);
t._vertsDirty = !0;
}
n.used(this.verticesCount, this.indicesCount);
this.updateIndices(i.triangles);
if (t._vertsDirty) {
this.updateUVs(t);
this.updateVerts(t);
this.updateWorldVerts(t);
t._vertsDirty = !1;
}
}
}
};
e.prototype.updateIndices = function(t) {
this._renderData.iDatas[0].set(t);
};
e.prototype.updateUVs = function(t) {
for (var e = t.spriteFrame.vertices, i = e.nu, n = e.nv, r = this.uvOffset, s = this.floatsPerVert, o = this._renderData.vDatas[0], a = 0; a < i.length; a++) {
var c = s * a + r;
o[c] = i[a];
o[c + 1] = n[a];
}
};
e.prototype.updateVerts = function(t) {
var e = t.node, i = Math.abs(e.width), n = Math.abs(e.height), r = e.anchorX * i, s = e.anchorY * n, o = t.spriteFrame, a = o.vertices, c = a.x, l = a.y, u = o._originalSize.width, h = o._originalSize.height, f = o._rect.width, d = o._rect.height, _ = o._offset.x + (u - f) / 2, p = o._offset.y + (h - d) / 2, v = i / (t.trim ? f : u), g = n / (t.trim ? d : h), m = this._local;
if (t.trim) for (var y = 0, E = c.length; y < E; y++) {
var C = 2 * y;
m[C] = (c[y] - _) * v - r;
m[C + 1] = (h - l[y] - p) * g - s;
} else for (var T = 0, A = c.length; T < A; T++) {
var x = 2 * T;
m[x] = c[T] * v - r;
m[x + 1] = (h - l[T]) * g - s;
}
};
e.prototype.updateWorldVerts = function(t) {
for (var e = t.node._worldMatrix.m, i = e[0], n = e[1], r = e[4], s = e[5], o = e[12], a = e[13], c = this._local, l = this._renderData.vDatas[0], u = this.floatsPerVert, h = 0, f = this.verticesCount; h < f; h++) {
var d = c[2 * h], _ = c[2 * h + 1];
l[u * h] = d * i + _ * r + o;
l[u * h + 1] = d * n + _ * s + a;
}
};
return e;
})(function(t) {
return t && t.__esModule ? t : {
default: t
};
}(t("../../../../assembler-2d")).default);
i.default = o;
e.exports = i.default;
}), {
"../../../../assembler-2d": 136
} ],
171: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../../../assembler-2d"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function s(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function o(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var a = 2 * Math.PI, c = [ cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0) ], l = [ 0, 0, 0, 0 ], u = [ 0, 0, 0, 0, 0, 0, 0, 0 ], h = [ cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0) ], f = [ cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0), cc.v2(0, 0) ], d = cc.v2(0, 0), _ = [];
function p(t, e, i, n, r, s, o) {
var a = Math.sin(s), c = Math.cos(s), l = void 0, u = void 0;
if (0 !== Math.cos(s)) {
l = a / c;
if ((t - r.x) * c > 0) {
var h = r.y + l * (t - r.x);
o[0].x = t;
o[0].y = h;
}
if ((e - r.x) * c > 0) {
var f = r.y + l * (e - r.x);
o[2].x = e;
o[2].y = f;
}
}
if (0 !== Math.sin(s)) {
u = c / a;
if ((n - r.y) * a > 0) {
var d = r.x + u * (n - r.y);
o[3].x = d;
o[3].y = n;
}
if ((i - r.y) * a > 0) {
var _ = r.x + u * (i - r.y);
o[1].x = _;
o[1].y = i;
}
}
}
function v(t) {
var e = t.node, i = e.width, n = e.height, r = e.anchorX * i, s = e.anchorY * n, o = -r, a = -s, u = i - r, h = n - s, f = l;
f[0] = o;
f[1] = a;
f[2] = u;
f[3] = h;
var p = t._fillCenter, v = d.x = Math.min(Math.max(0, p.x), 1) * (u - o) + o, g = d.y = Math.min(Math.max(0, p.y), 1) * (h - a) + a;
c[0].x = c[3].x = o;
c[1].x = c[2].x = u;
c[0].y = c[1].y = a;
c[2].y = c[3].y = h;
_.length = 0;
v !== f[0] && (_[0] = [ 3, 0 ]);
v !== f[2] && (_[2] = [ 1, 2 ]);
g !== f[1] && (_[1] = [ 0, 1 ]);
g !== f[3] && (_[3] = [ 2, 3 ]);
}
function g(t) {
var e = t._texture.width, i = t._texture.height, n = t._rect, r = void 0, s = void 0, o = void 0, a = void 0, c = u;
if (t._rotated) {
r = n.x / e;
s = (n.x + n.height) / e;
o = n.y / i;
a = (n.y + n.width) / i;
c[0] = c[2] = r;
c[4] = c[6] = s;
c[3] = c[7] = a;
c[1] = c[5] = o;
} else {
r = n.x / e;
s = (n.x + n.width) / e;
o = n.y / i;
a = (n.y + n.height) / i;
c[0] = c[4] = r;
c[2] = c[6] = s;
c[1] = c[3] = a;
c[5] = c[7] = o;
}
}
function m(t, e) {
var i, n;
i = e.x - t.x;
n = e.y - t.y;
if (0 !== i || 0 !== n) {
if (0 === i) return n > 0 ? .5 * Math.PI : 1.5 * Math.PI;
var r = Math.atan(n / i);
i < 0 && (r += Math.PI);
return r;
}
}
var y = (function(t) {
o(e, t);
function e() {
r(this, e);
return s(this, t.apply(this, arguments));
}
e.prototype.initData = function(t) {
this._renderData.createFlexData(0, 4, 6, this.getVfmt());
this.updateIndices();
};
e.prototype.updateRenderData = function(e) {
t.prototype.updateRenderData.call(this, e);
var i = e.spriteFrame;
if (i) {
this.packToDynamicAtlas(e, i);
if (e._vertsDirty) {
var n = e._fillStart, r = e._fillRange;
if (r < 0) {
n += r;
r = -r;
}
for (;n >= 1; ) n -= 1;
for (;n < 0; ) n += 1;
n *= a;
r *= a;
v(e);
g(i);
p(l[0], l[2], l[1], l[3], d, n, h);
p(l[0], l[2], l[1], l[3], d, n + r, f);
this.updateVerts(e, n, r);
e._vertsDirty = !1;
}
}
};
e.prototype.updateVerts = function(t, e, i) {
for (var n = e + i, r = this._local, s = 0, o = 3 * this.floatsPerVert, l = 0; l < 4; ++l) {
var u = _[l];
if (u) if (i >= a) {
r.length = s + o;
this._generateTriangle(r, s, d, c[u[0]], c[u[1]]);
s += o;
} else {
var p = m(d, c[u[0]]), v = m(d, c[u[1]]);
v < p && (v += a);
p -= a;
v -= a;
for (var g = 0; g < 3; ++g) {
if (p >= n) ; else if (p >= e) {
r.length = s + o;
v >= n ? this._generateTriangle(r, s, d, c[u[0]], f[l]) : this._generateTriangle(r, s, d, c[u[0]], c[u[1]]);
s += o;
} else if (v <= e) ; else if (v <= n) {
r.length = s + o;
this._generateTriangle(r, s, d, h[l], c[u[1]]);
s += o;
} else {
r.length = s + o;
this._generateTriangle(r, s, d, h[l], f[l]);
s += o;
}
p += a;
v += a;
}
}
}
this.allocWorldVerts(t);
this.updateWorldVerts(t);
};
e.prototype.allocWorldVerts = function(t) {
var e = t.node._color._val, i = this._renderData, n = this.floatsPerVert, r = this._local, s = r.length / n;
this.verticesCount = this.indicesCount = s;
var o = i._flexBuffer;
o.reserve(s, s) && this.updateIndices();
o.used(this.verticesCount, this.indicesCount);
for (var a = i.vDatas[0], c = i.uintVDatas[0], l = this.uvOffset, u = 0; u < r.length; u += n) {
var h = u + l;
a[h] = r[h];
a[h + 1] = r[h + 1];
c[h + 2] = e;
}
};
e.prototype.updateIndices = function() {
for (var t = this._renderData.iDatas[0], e = 0; e < t.length; e++) t[e] = e;
};
e.prototype.updateWorldVerts = function(t) {
for (var e = t.node._worldMatrix.m, i = e[0], n = e[1], r = e[4], s = e[5], o = e[12], a = e[13], c = this._local, l = this._renderData.vDatas[0], u = this.floatsPerVert, h = 0; h < c.length; h += u) {
var f = c[h], d = c[h + 1];
l[h] = f * i + d * r + o;
l[h + 1] = f * n + d * s + a;
}
};
e.prototype._generateTriangle = function(t, e, i, n, r) {
var s = l, o = s[0], a = s[1], c = s[2], u = s[3], h = this.floatsPerVert;
t[e] = i.x;
t[e + 1] = i.y;
t[e + h] = n.x;
t[e + h + 1] = n.y;
t[e + 2 * h] = r.x;
t[e + 2 * h + 1] = r.y;
var f = this.uvOffset, d = void 0, _ = void 0;
d = (i.x - o) / (c - o);
_ = (i.y - a) / (u - a);
this._generateUV(d, _, t, e + f);
d = (n.x - o) / (c - o);
_ = (n.y - a) / (u - a);
this._generateUV(d, _, t, e + h + f);
d = (r.x - o) / (c - o);
_ = (r.y - a) / (u - a);
this._generateUV(d, _, t, e + 2 * h + f);
};
e.prototype._generateUV = function(t, e, i, n) {
var r = u, s = r[0] + (r[2] - r[0]) * t, o = r[4] + (r[6] - r[4]) * t, a = r[1] + (r[3] - r[1]) * t, c = r[5] + (r[7] - r[5]) * t;
i[n] = s + (o - s) * e;
i[n + 1] = a + (c - a) * e;
};
return e;
})(n.default);
i.default = y;
e.exports = i.default;
}), {
"../../../../assembler-2d": 136
} ],
172: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function r(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function s(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var o = (function(t) {
s(e, t);
function e() {
n(this, e);
return r(this, t.apply(this, arguments));
}
e.prototype.updateRenderData = function(t) {
var e = t._spriteFrame;
if (e) {
this.packToDynamicAtlas(t, e);
if (t._vertsDirty) {
this.updateUVs(t);
this.updateVerts(t);
t._vertsDirty = !1;
}
}
};
e.prototype.updateUVs = function(t) {
for (var e = t._spriteFrame.uv, i = this.uvOffset, n = this.floatsPerVert, r = this._renderData.vDatas[0], s = 0; s < 4; s++) {
var o = 2 * s, a = n * s + i;
r[a] = e[o];
r[a + 1] = e[o + 1];
}
};
e.prototype.updateVerts = function(t) {
var e = t.node, i = e.width, n = e.height, r = e.anchorX * i, s = e.anchorY * n, o = void 0, a = void 0, c = void 0, l = void 0;
if (t.trim) {
o = -r;
a = -s;
c = i - r;
l = n - s;
} else {
var u = t.spriteFrame, h = u._originalSize.width, f = u._originalSize.height, d = u._rect.width, _ = u._rect.height, p = u._offset, v = i / h, g = n / f, m = p.x + (h - d) / 2, y = p.x - (h - d) / 2, E = p.y + (f - _) / 2, C = p.y - (f - _) / 2;
o = m * v - r;
a = E * g - s;
c = i + y * v - r;
l = n + C * g - s;
}
var T = this._local;
T[0] = o;
T[1] = a;
T[2] = c;
T[3] = l;
this.updateWorldVerts(t);
};
return e;
})(function(t) {
return t && t.__esModule ? t : {
default: t
};
}(t("../../../../assembler-2d")).default);
i.default = o;
e.exports = i.default;
}), {
"../../../../assembler-2d": 136
} ],
173: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function r(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function s(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var o = (function(t) {
s(e, t);
function e() {
n(this, e);
return r(this, t.apply(this, arguments));
}
e.prototype.initData = function(t) {
if (!(this._renderData.meshCount > 0)) {
this._renderData.createData(0, this.verticesFloats, this.indicesCount);
for (var e = this._renderData.iDatas[0], i = 0, n = 0; n < 3; ++n) for (var r = 0; r < 3; ++r) {
var s = 4 * n + r;
e[i++] = s;
e[i++] = s + 1;
e[i++] = s + 4;
e[i++] = s + 1;
e[i++] = s + 5;
e[i++] = s + 4;
}
}
};
e.prototype.initLocal = function() {
this._local = [];
this._local.length = 8;
};
e.prototype.updateRenderData = function(t) {
var e = t._spriteFrame;
if (e) {
this.packToDynamicAtlas(t, e);
if (t._vertsDirty) {
this.updateUVs(t);
this.updateVerts(t);
t._vertsDirty = !1;
}
}
};
e.prototype.updateVerts = function(t) {
var e = t.node, i = e.width, n = e.height, r = e.anchorX * i, s = e.anchorY * n, o = t.spriteFrame, a = o.insetLeft, c = o.insetRight, l = o.insetTop, u = o.insetBottom, h = i - a - c, f = n - l - u, d = i / (a + c), _ = n / (l + u);
d = isNaN(d) || d > 1 ? 1 : d;
_ = isNaN(_) || _ > 1 ? 1 : _;
h = h < 0 ? 0 : h;
f = f < 0 ? 0 : f;
var p = this._local;
p[0] = -r;
p[1] = -s;
p[2] = a * d - r;
p[3] = u * _ - s;
p[4] = p[2] + h;
p[5] = p[3] + f;
p[6] = i - r;
p[7] = n - s;
this.updateWorldVerts(t);
};
e.prototype.updateUVs = function(t) {
for (var e = this._renderData.vDatas[0], i = t.spriteFrame.uvSliced, n = this.uvOffset, r = this.floatsPerVert, s = 0; s < 4; ++s) for (var o = 0; o < 4; ++o) {
var a = 4 * s + o, c = i[a], l = a * r;
e[l + n] = c.u;
e[l + n + 1] = c.v;
}
};
e.prototype.updateWorldVerts = function(t) {
for (var e = t.node._worldMatrix.m, i = e[0], n = e[1], r = e[4], s = e[5], o = e[12], a = e[13], c = this._local, l = this._renderData.vDatas[0], u = this.floatsPerVert, h = 0; h < 4; ++h) for (var f = c[2 * h + 1], d = 0; d < 4; ++d) {
var _ = c[2 * d], p = (4 * h + d) * u;
l[p] = _ * i + f * r + o;
l[p + 1] = _ * n + f * s + a;
}
};
return e;
})(function(t) {
return t && t.__esModule ? t : {
default: t
};
}(t("../../../../assembler-2d")).default);
i.default = o;
Object.assign(o.prototype, {
verticesCount: 16,
indicesCount: 54
});
e.exports = i.default;
}), {
"../../../../assembler-2d": 136
} ],
174: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function r(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function s(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var o = (function(t) {
s(e, t);
function e() {
n(this, e);
return r(this, t.apply(this, arguments));
}
e.prototype.initData = function(t) {
this.verticesCount = 0;
this.contentWidth = 0;
this.contentHeight = 0;
this.rectWidth = 0;
this.rectHeight = 0;
this.hRepeat = 0;
this.vRepeat = 0;
this.row = 0;
this.col = 0;
this._renderData.createFlexData(0, 4, 6, this.getVfmt());
this._updateIndices();
};
e.prototype.initLocal = function() {
this._local = {
x: [],
y: []
};
};
e.prototype._updateIndices = function() {
for (var t = this._renderData.iDatas[0], e = 0, i = 0, n = t.length; e < n; e += 6, 
i += 4) {
t[e] = i;
t[e + 1] = i + 1;
t[e + 2] = i + 2;
t[e + 3] = i + 1;
t[e + 4] = i + 3;
t[e + 5] = i + 2;
}
};
e.prototype.updateRenderData = function(t) {
var e = t._spriteFrame;
if (e) {
this.packToDynamicAtlas(t, e);
var i = t.node, n = this.contentWidth = Math.abs(i.width), r = this.contentHeight = Math.abs(i.height), s = e._rect, o = this.rectWidth = s.width, a = this.rectHeight = s.height, c = this.hRepeat = n / o, l = this.vRepeat = r / a, u = (this.row = Math.ceil(l)) * (this.col = Math.ceil(c));
this.verticesCount = 4 * u;
this.indicesCount = 6 * u;
var h = this._renderData._flexBuffer;
if (h.reserve(this.verticesCount, this.indicesCount)) {
this._updateIndices();
this.updateColor(t);
}
h.used(this.verticesCount, this.indicesCount);
if (t._vertsDirty) {
this.updateUVs(t);
this.updateVerts(t);
t._vertsDirty = !1;
}
}
};
e.prototype.updateVerts = function(t) {
var e = t.node, i = e.anchorX * e.width, n = e.anchorY * e.height, r = this.row, s = this.col, o = this.rectWidth, a = this.rectHeight, c = this.contentWidth, l = this.contentHeight, u = this._local, h = u.x, f = u.y;
h.length = f.length = 0;
for (var d = 0; d <= s; ++d) h[d] = Math.min(o * d, c) - i;
for (var _ = 0; _ <= r; ++_) f[_] = Math.min(a * _, l) - n;
this.updateWorldVerts(t);
};
e.prototype.updateWorldVerts = function(t) {
for (var e = this._renderData, i = this._local, n = i.x, r = i.y, s = e.vDatas[0], o = this.row, a = this.col, c = t.node._worldMatrix.m, l = c[0], u = c[1], h = c[4], f = c[5], d = c[12], _ = c[13], p = void 0, v = void 0, g = void 0, m = void 0, y = this.floatsPerVert, E = 0, C = 0, T = o; C < T; ++C) {
g = r[C];
m = r[C + 1];
for (var A = 0, x = a; A < x; ++A) {
p = n[A];
v = n[A + 1];
s[E] = p * l + g * h + d;
s[E + 1] = p * u + g * f + _;
s[E += y] = v * l + g * h + d;
s[E + 1] = v * u + g * f + _;
s[E += y] = p * l + m * h + d;
s[E + 1] = p * u + m * f + _;
s[E += y] = v * l + m * h + d;
s[E + 1] = v * u + m * f + _;
E += y;
}
}
};
e.prototype.updateUVs = function(t) {
var e = this._renderData.vDatas[0];
if (e) for (var i = this.row, n = this.col, r = this.hRepeat, s = this.vRepeat, o = t.spriteFrame.uv, a = t.spriteFrame._rotated, c = this.floatsPerVert, l = this.uvOffset, u = 0, h = i; u < h; ++u) for (var f = Math.min(1, s - u), d = 0, _ = n; d < _; ++d) {
var p = Math.min(1, r - d);
if (a) {
e[l] = o[0];
e[l + 1] = o[1];
e[l += c] = o[0];
e[l + 1] = o[1] + (o[7] - o[1]) * p;
e[l += c] = o[0] + (o[6] - o[0]) * f;
e[l + 1] = o[1];
e[l += c] = e[l - c];
e[l + 1] = e[l + 1 - 2 * c];
l += c;
} else {
e[l] = o[0];
e[l + 1] = o[1];
e[l += c] = o[0] + (o[6] - o[0]) * p;
e[l + 1] = o[1];
e[l += c] = o[0];
e[l + 1] = o[1] + (o[7] - o[1]) * f;
e[l += c] = e[l - 2 * c];
e[l + 1] = e[l + 1 - c];
l += c;
}
}
};
return e;
})(function(t) {
return t && t.__esModule ? t : {
default: t
};
}(t("../../../../assembler-2d")).default);
i.default = o;
e.exports = i.default;
}), {
"../../../../assembler-2d": 136
} ],
175: [ (function(t, e, i) {
"use strict";
var n = g(t("../../../assembler")), r = t("../../../../components/CCSprite"), s = g(t("./2d/simple")), o = g(t("./2d/sliced")), a = g(t("./2d/tiled")), c = g(t("./2d/radial-filled")), l = g(t("./2d/bar-filled")), u = g(t("./2d/mesh")), h = g(t("./3d/simple")), f = g(t("./3d/sliced")), d = g(t("./3d/tiled")), _ = g(t("./3d/radial-filled")), p = g(t("./3d/bar-filled")), v = g(t("./3d/mesh"));
function g(t) {
return t && t.__esModule ? t : {
default: t
};
}
var m = {
getConstructor: function(t) {
var e = t.node.is3DNode, i = e ? h.default : s.default;
switch (t.type) {
case r.Type.SLICED:
i = e ? f.default : o.default;
break;

case r.Type.TILED:
i = e ? d.default : a.default;
break;

case r.Type.FILLED:
i = t._fillType === r.FillType.RADIAL ? e ? _.default : c.default : e ? p.default : l.default;
break;

case r.Type.MESH:
i = e ? v.default : u.default;
}
return i;
},
Simple: s.default,
Sliced: o.default,
Tiled: a.default,
RadialFilled: c.default,
BarFilled: l.default,
Mesh: u.default,
Simple3D: h.default,
Sliced3D: f.default,
Tiled3D: d.default,
RadialFilled3D: _.default,
BarFilled3D: p.default,
Mesh3D: v.default
};
n.default.register(cc.Sprite, m);
}), {
"../../../../components/CCSprite": 57,
"../../../assembler": 138,
"./2d/bar-filled": 169,
"./2d/mesh": 170,
"./2d/radial-filled": 171,
"./2d/simple": 172,
"./2d/sliced": 173,
"./2d/tiled": 174,
"./3d/bar-filled": void 0,
"./3d/mesh": void 0,
"./3d/radial-filled": void 0,
"./3d/simple": void 0,
"./3d/sliced": void 0,
"./3d/tiled": void 0
} ],
176: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var r = (function() {
function t(e, i, r, s, o) {
n(this, t);
this._handler = e;
this._index = i;
this._vfmt = o;
this._verticesBytes = o._bytes;
this._initVerticesCount = r;
this._initIndicesCount = s;
this.reset();
}
t.prototype._reallocVData = function(t, e) {
this.vData = new Float32Array(t);
this.uintVData = new Uint32Array(this.vData.buffer);
e && this.vData.set(e);
this._handler.updateMesh(this._index, this.vData, this.iData);
};
t.prototype._reallocIData = function(t, e) {
this.iData = new Uint16Array(t);
e && this.iData.set(e);
this._handler.updateMesh(this._index, this.vData, this.iData);
};
t.prototype.reserve = function(t, e) {
var i = t * this._verticesBytes >> 2, n = this.vData.length, r = !1;
if (i > n) {
for (;n < i; ) n *= 2;
this._reallocVData(n, this.vData);
r = !0;
}
var s = this.iData.length;
if (e > s) {
for (;s < e; ) s *= 2;
this._reallocIData(e, this.iData);
r = !0;
}
return r;
};
t.prototype.used = function(t, e) {
this.usedVertices = t;
this.usedIndices = e;
this.usedVerticesFloats = t * this._verticesBytes >> 2;
this._handler.updateMeshRange(t, e);
};
t.prototype.reset = function() {
var t = this._initVerticesCount * this._verticesBytes >> 2;
this._reallocVData(t);
this._reallocIData(this._initIndicesCount);
this.usedVertices = 0;
this.usedVerticesFloats = 0;
this.usedIndices = 0;
};
return t;
})();
i.default = r;
cc.FlexBuffer = r;
e.exports = i.default;
}), {} ],
177: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = s;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("./flex-buffer")), r = t("./vertex-format");
function s() {
this.vDatas = [];
this.uintVDatas = [];
this.iDatas = [];
this.meshCount = 0;
this._infos = null;
this._flexBuffer = null;
}
cc.js.mixin(s.prototype, {
init: function(t) {},
clear: function() {
this.vDatas.length = 0;
this.iDatas.length = 0;
this.uintVDatas.length = 0;
this.meshCount = 0;
this._infos = null;
this._flexBuffer && this._flexBuffer.reset();
},
updateMesh: function(t, e, i) {
this.vDatas[t] = e;
this.uintVDatas[t] = new Uint32Array(e.buffer, 0, e.length);
this.iDatas[t] = i;
this.meshCount = this.vDatas.length;
},
updateMeshRange: function(t, e) {},
createData: function(t, e, i) {
var n = new Float32Array(e), r = new Uint16Array(i);
this.updateMesh(t, n, r);
},
createQuadData: function(t, e, i) {
this.createData(t, e, i);
this.initQuadIndices(this.iDatas[t]);
},
createFlexData: function(t, e, i, s) {
s = s || r.vfmtPosUvColor;
this._flexBuffer = new n.default(this, t, e, i, s);
},
initQuadIndices: function(t) {
for (var e = t.length / 6, i = 0, n = 0; i < e; i++) {
var r = 4 * i;
t[n++] = r;
t[n++] = r + 1;
t[n++] = r + 2;
t[n++] = r + 1;
t[n++] = r + 3;
t[n++] = r + 2;
}
}
});
cc.RenderData = s;
e.exports = i.default;
}), {
"./flex-buffer": 176,
"./vertex-format": 178
} ],
178: [ (function(t, e, i) {
"use strict";
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../../../renderer/gfx"));
var r = new n.default.VertexFormat([ {
name: n.default.ATTR_POSITION,
type: n.default.ATTR_TYPE_FLOAT32,
num: 3
}, {
name: n.default.ATTR_UV0,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: n.default.ATTR_COLOR,
type: n.default.ATTR_TYPE_UINT8,
num: 4,
normalize: !0
} ]);
r.name = "vfmt3D";
n.default.VertexFormat.XYZ_UV_Color = r;
var s = new n.default.VertexFormat([ {
name: n.default.ATTR_POSITION,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: n.default.ATTR_UV0,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: n.default.ATTR_COLOR,
type: n.default.ATTR_TYPE_UINT8,
num: 4,
normalize: !0
} ]);
s.name = "vfmtPosUvColor";
n.default.VertexFormat.XY_UV_Color = s;
var o = new n.default.VertexFormat([ {
name: n.default.ATTR_POSITION,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: n.default.ATTR_UV0,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: n.default.ATTR_COLOR,
type: n.default.ATTR_TYPE_UINT8,
num: 4,
normalize: !0
}, {
name: n.default.ATTR_COLOR0,
type: n.default.ATTR_TYPE_UINT8,
num: 4,
normalize: !0
} ]);
o.name = "vfmtPosUvTwoColor";
n.default.VertexFormat.XY_UV_Two_Color = o;
var a = new n.default.VertexFormat([ {
name: n.default.ATTR_POSITION,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: n.default.ATTR_UV0,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
} ]);
a.name = "vfmtPosUv";
n.default.VertexFormat.XY_UV = a;
var c = new n.default.VertexFormat([ {
name: n.default.ATTR_POSITION,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
}, {
name: n.default.ATTR_COLOR,
type: n.default.ATTR_TYPE_UINT8,
num: 4,
normalize: !0
} ]);
c.name = "vfmtPosColor";
n.default.VertexFormat.XY_Color = c;
var l = new n.default.VertexFormat([ {
name: n.default.ATTR_POSITION,
type: n.default.ATTR_TYPE_FLOAT32,
num: 2
} ]);
l.name = "vfmtPos";
n.default.VertexFormat.XY = l;
e.exports = {
vfmt3D: r,
vfmtPosUvColor: s,
vfmtPosUvTwoColor: o,
vfmtPosUv: a,
vfmtPosColor: c,
vfmtPos: l
};
}), {
"../../../renderer/gfx": 234
} ],
179: [ (function(t, e, i) {
"use strict";
t("../platform/CCSys");
var n = /(\.[^\.\/\?\\]*)(\?.*)?$/, r = /((.*)(\/|\\|\\\\))?(.*?\..*$)?/, s = /[^\.\/]+\/\.\.\//;
cc.path = {
join: function() {
for (var t = arguments.length, e = "", i = 0; i < t; i++) e = (e + ("" === e ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
return e;
},
extname: function(t) {
var e = n.exec(t);
return e ? e[1] : "";
},
mainFileName: function(t) {
if (t) {
var e = t.lastIndexOf(".");
if (-1 !== e) return t.substring(0, e);
}
return t;
},
basename: function(t, e) {
var i = t.indexOf("?");
i > 0 && (t = t.substring(0, i));
var n = /(\/|\\)([^\/\\]+)$/g.exec(t.replace(/(\/|\\)$/, ""));
if (!n) return null;
var r = n[2];
return e && t.substring(t.length - e.length).toLowerCase() === e.toLowerCase() ? r.substring(0, r.length - e.length) : r;
},
dirname: function(t) {
var e = r.exec(t);
return e ? e[2] : "";
},
changeExtname: function(t, e) {
e = e || "";
var i = t.indexOf("?"), n = "";
if (i > 0) {
n = t.substring(i);
t = t.substring(0, i);
}
return (i = t.lastIndexOf(".")) < 0 ? t + e + n : t.substring(0, i) + e + n;
},
changeBasename: function(t, e, i) {
if (0 === e.indexOf(".")) return this.changeExtname(t, e);
var n = t.indexOf("?"), r = "", s = i ? this.extname(t) : "";
if (n > 0) {
r = t.substring(n);
t = t.substring(0, n);
}
n = (n = t.lastIndexOf("/")) <= 0 ? 0 : n + 1;
return t.substring(0, n) + e + s + r;
},
_normalize: function(t) {
var e = t = String(t);
do {
e = t;
t = t.replace(s, "");
} while (e.length !== t.length);
return t;
},
sep: cc.sys.os === cc.sys.OS_WINDOWS ? "\\" : "/",
stripSep: function(t) {
return t.replace(/[\/\\]$/, "");
}
};
e.exports = cc.path;
}), {
"../platform/CCSys": 119
} ],
180: [ (function(t, e, i) {
"use strict";
var n = function(t, e, i, n, r, s) {
this.a = t;
this.b = e;
this.c = i;
this.d = n;
this.tx = r;
this.ty = s;
};
n.create = function(t, e, i, n, r, s) {
return {
a: t,
b: e,
c: i,
d: n,
tx: r,
ty: s
};
};
n.identity = function() {
return {
a: 1,
b: 0,
c: 0,
d: 1,
tx: 0,
ty: 0
};
};
n.clone = function(t) {
return {
a: t.a,
b: t.b,
c: t.c,
d: t.d,
tx: t.tx,
ty: t.ty
};
};
n.concat = function(t, e, i) {
var n = e.a, r = e.b, s = e.c, o = e.d, a = e.tx, c = e.ty;
t.a = n * i.a + r * i.c;
t.b = n * i.b + r * i.d;
t.c = s * i.a + o * i.c;
t.d = s * i.b + o * i.d;
t.tx = a * i.a + c * i.c + i.tx;
t.ty = a * i.b + c * i.d + i.ty;
return t;
};
n.invert = function(t, e) {
var i = e.a, n = e.b, r = e.c, s = e.d, o = 1 / (i * s - n * r), a = e.tx, c = e.ty;
t.a = o * s;
t.b = -o * n;
t.c = -o * r;
t.d = o * i;
t.tx = o * (r * c - s * a);
t.ty = o * (n * a - i * c);
return t;
};
n.fromMat4 = function(t, e) {
var i = e.m;
t.a = i[0];
t.b = i[1];
t.c = i[4];
t.d = i[5];
t.tx = i[12];
t.ty = i[13];
return t;
};
n.transformVec2 = function(t, e, i, n) {
var r, s;
if (void 0 === n) {
n = i;
r = e.x;
s = e.y;
} else {
r = e;
s = i;
}
t.x = n.a * r + n.c * s + n.tx;
t.y = n.b * r + n.d * s + n.ty;
return t;
};
n.transformSize = function(t, e, i) {
t.width = i.a * e.width + i.c * e.height;
t.height = i.b * e.width + i.d * e.height;
return t;
};
n.transformRect = function(t, e, i) {
var n = e.x, r = e.y, s = n + e.width, o = r + e.height, a = i.a * n + i.c * r + i.tx, c = i.b * n + i.d * r + i.ty, l = i.a * s + i.c * r + i.tx, u = i.b * s + i.d * r + i.ty, h = i.a * n + i.c * o + i.tx, f = i.b * n + i.d * o + i.ty, d = i.a * s + i.c * o + i.tx, _ = i.b * s + i.d * o + i.ty, p = Math.min(a, l, h, d), v = Math.max(a, l, h, d), g = Math.min(c, u, f, _), m = Math.max(c, u, f, _);
t.x = p;
t.y = g;
t.width = v - p;
t.height = m - g;
return t;
};
n.transformObb = function(t, e, i, n, r, s) {
var o = r.x, a = r.y, c = r.width, l = r.height, u = s.a * o + s.c * a + s.tx, h = s.b * o + s.d * a + s.ty, f = s.a * c, d = s.b * c, _ = s.c * l, p = s.d * l;
e.x = u;
e.y = h;
i.x = f + u;
i.y = d + h;
t.x = _ + u;
t.y = p + h;
n.x = f + _ + u;
n.y = d + p + h;
};
cc.AffineTransform = e.exports = n;
}), {} ],
181: [ (function(t, e, i) {
"use strict";
var n = t("../platform/CCObject").Flags, r = t("./misc"), s = t("../platform/js"), o = t("../platform/id-generater"), a = t("../event-manager"), c = t("../renderer/render-flow"), l = n.Destroying, u = n.DontDestroy, h = n.Deactivating, f = new o("Node");
function d(t) {
if (!t) {
cc.errorID(3804);
return null;
}
return "string" == typeof t ? s.getClassByName(t) : t;
}
function _(t, e) {
if (e._sealed) for (var i = 0; i < t._components.length; ++i) {
var n = t._components[i];
if (n.constructor === e) return n;
} else for (var r = 0; r < t._components.length; ++r) {
var s = t._components[r];
if (s instanceof e) return s;
}
return null;
}
function p(t, e, i) {
if (e._sealed) for (var n = 0; n < t._components.length; ++n) {
var r = t._components[n];
r.constructor === e && i.push(r);
} else for (var s = 0; s < t._components.length; ++s) {
var o = t._components[s];
o instanceof e && i.push(o);
}
}
function v(t, e) {
for (var i = 0; i < t.length; ++i) {
var n = t[i], r = _(n, e);
if (r) return r;
if (n._children.length > 0 && (r = v(n._children, e))) return r;
}
return null;
}
function g(t, e, i) {
for (var n = 0; n < t.length; ++n) {
var r = t[n];
p(r, e, i);
r._children.length > 0 && g(r._children, e, i);
}
}
var m = cc.Class({
name: "cc._BaseNode",
extends: cc.Object,
properties: {
_parent: null,
_children: [],
_active: !0,
_components: [],
_prefab: null,
_persistNode: {
get: function() {
return (this._objFlags & u) > 0;
},
set: function(t) {
t ? this._objFlags |= u : this._objFlags &= ~u;
}
},
name: {
get: function() {
return this._name;
},
set: function(t) {
0;
this._name = t;
this._proxy.setName(this._name);
}
},
uuid: {
get: function() {
return this._id;
}
},
children: {
get: function() {
return this._children;
}
},
childrenCount: {
get: function() {
return this._children.length;
}
},
active: {
get: function() {
return this._active;
},
set: function(t) {
t = !!t;
if (this._active !== t) {
this._active = t;
var e = this._parent;
if (e) {
e._activeInHierarchy && cc.director._nodeActivator.activateNode(this, t);
}
}
}
},
activeInHierarchy: {
get: function() {
return this._activeInHierarchy;
}
}
},
ctor: function(t) {
this._name = void 0 !== t ? t : "New Node";
this._activeInHierarchy = !1;
this._id = f.getNewId();
cc.director._scheduler && cc.director._scheduler.enableForTarget(this);
this.__eventTargets = [];
},
getParent: function() {
return this._parent;
},
setParent: function(t) {
if (this._parent !== t) {
0;
var e = this._parent;
0;
this._parent = t || null;
this._onSetParent(t);
if (t) {
0;
a._setDirtyForNode(this);
t._children.push(this);
t.emit && t.emit("child-added", this);
t._renderFlag |= c.FLAG_CHILDREN;
}
if (e) {
if (!(e._objFlags & l)) {
var i = e._children.indexOf(this);
0;
e._children.splice(i, 1);
e.emit && e.emit("child-removed", this);
this._onHierarchyChanged(e);
0 === e._children.length && (e._renderFlag &= ~c.FLAG_CHILDREN);
}
} else t && this._onHierarchyChanged(null);
}
},
attr: function(t) {
s.mixin(this, t);
},
getChildByUuid: function(t) {
if (!t) {
cc.log("Invalid uuid");
return null;
}
for (var e = this._children, i = 0, n = e.length; i < n; i++) if (e[i]._id === t) return e[i];
return null;
},
getChildByName: function(t) {
if (!t) {
cc.log("Invalid name");
return null;
}
for (var e = this._children, i = 0, n = e.length; i < n; i++) if (e[i]._name === t) return e[i];
return null;
},
addChild: function(t) {
0;
cc.assertID(t, 1606);
cc.assertID(null === t._parent, 1605);
t.setParent(this);
},
insertChild: function(t, e) {
t.parent = this;
t.setSiblingIndex(e);
},
getSiblingIndex: function() {
return this._parent ? this._parent._children.indexOf(this) : 0;
},
setSiblingIndex: function(t) {
if (this._parent) if (this._parent._objFlags & h) cc.errorID(3821); else {
var e = this._parent._children;
t = -1 !== t ? t : e.length - 1;
var i = e.indexOf(this);
if (t !== i) {
e.splice(i, 1);
t < e.length ? e.splice(t, 0, this) : e.push(this);
this._onSiblingIndexChanged && this._onSiblingIndexChanged(t);
}
}
},
walk: function(t, e) {
var i, n, r, s, o = cc._BaseNode, a = 1, c = o._stacks[o._stackId];
if (!c) {
c = [];
o._stacks.push(c);
}
o._stackId++;
c.length = 0;
c[0] = this;
var l = null;
s = !1;
for (;a; ) if (n = c[--a]) {
!s && t ? t(n) : s && e && e(n);
c[a] = null;
if (s) {
s = !1;
if (i) if (i[++r]) {
c[a] = i[r];
a++;
} else if (l) {
c[a] = l;
a++;
s = !0;
if (l._parent) {
r = (i = l._parent._children).indexOf(l);
l = l._parent;
} else {
l = null;
i = null;
}
if (r < 0) break;
}
} else if (n._children.length > 0) {
l = n;
i = n._children;
r = 0;
c[a] = i[r];
a++;
} else {
c[a] = n;
a++;
s = !0;
}
}
c.length = 0;
o._stackId--;
},
cleanup: function() {},
removeFromParent: function(t) {
if (this._parent) {
void 0 === t && (t = !0);
this._parent.removeChild(this, t);
}
},
removeChild: function(t, e) {
if (this._children.indexOf(t) > -1) {
(e || void 0 === e) && t.cleanup();
t.parent = null;
}
},
removeAllChildren: function(t) {
var e = this._children;
void 0 === t && (t = !0);
for (var i = e.length - 1; i >= 0; i--) {
var n = e[i];
if (n) {
t && n.cleanup();
n.parent = null;
}
}
this._children.length = 0;
},
isChildOf: function(t) {
var e = this;
do {
if (e === t) return !0;
e = e._parent;
} while (e);
return !1;
},
getComponent: function(t) {
var e = d(t);
return e ? _(this, e) : null;
},
getComponents: function(t) {
var e = d(t), i = [];
e && p(this, e, i);
return i;
},
getComponentInChildren: function(t) {
var e = d(t);
return e ? v(this._children, e) : null;
},
getComponentsInChildren: function(t) {
var e = d(t), i = [];
if (e) {
p(this, e, i);
g(this._children, e, i);
}
return i;
},
_checkMultipleComp: !1,
addComponent: function(t) {
0;
var e;
if ("string" == typeof t) {
if (!(e = s.getClassByName(t))) {
cc.errorID(3807, t);
cc._RFpeek() && cc.errorID(3808, t);
return null;
}
} else {
if (!t) {
cc.errorID(3804);
return null;
}
e = t;
}
if ("function" != typeof e) {
cc.errorID(3809);
return null;
}
if (!s.isChildClassOf(e, cc.Component)) {
cc.errorID(3810);
return null;
}
0;
var i = e._requireComponent;
if (i && !this.getComponent(i)) {
if (!this.addComponent(i)) return null;
}
var n = new e();
n.node = this;
this._components.push(n);
0;
this._activeInHierarchy && cc.director._nodeActivator.activateComp(n);
return n;
},
_addComponentAt: !1,
removeComponent: function(t) {
if (t) {
t instanceof cc.Component || (t = this.getComponent(t));
t && t.destroy();
} else cc.errorID(3813);
},
_getDependComponent: !1,
_removeComponent: function(t) {
if (t) {
if (!(this._objFlags & l)) {
var e = this._components.indexOf(t);
if (-1 !== e) {
this._components.splice(e, 1);
0;
} else t.node !== this && cc.errorID(3815);
}
} else cc.errorID(3814);
},
destroy: function() {
cc.Object.prototype.destroy.call(this) && (this.active = !1);
},
destroyAllChildren: function() {
for (var t = this._children, e = 0; e < t.length; ++e) t[e].destroy();
},
_onSetParent: function(t) {},
_onPostActivated: function() {},
_onBatchRestored: function() {},
_onBatchCreated: function() {},
_onHierarchyChanged: function(t) {
var e = this._parent;
if (this._persistNode && !(e instanceof cc.Scene)) {
cc.game.removePersistRootNode(this);
0;
}
var i = this._active && !(!e || !e._activeInHierarchy);
this._activeInHierarchy !== i && cc.director._nodeActivator.activateNode(this, i);
},
_instantiate: function(t) {
t || (t = cc.instantiate._clone(this, this));
var e = this._prefab;
e && this === e.root && e.sync;
t._parent = null;
t._onBatchRestored();
return t;
},
_registerIfAttached: !1,
_onPreDestroy: function() {
var t, e;
this._objFlags |= l;
var i = this._parent, n = i && i._objFlags & l;
0;
var r = this._children;
for (t = 0, e = r.length; t < e; ++t) r[t]._destroyImmediate();
for (t = 0, e = this._components.length; t < e; ++t) {
this._components[t]._destroyImmediate();
}
var s = this.__eventTargets;
for (t = 0, e = s.length; t < e; ++t) {
var o = s[t];
o && o.targetOff(this);
}
s.length = 0;
this._persistNode && cc.game.removePersistRootNode(this);
if (!n && i) {
var a = i._children.indexOf(this);
i._children.splice(a, 1);
i.emit && i.emit("child-removed", this);
}
return n;
},
onRestore: !1
});
m.idGenerater = f;
m._stacks = [ [] ];
m._stackId = 0;
m.prototype._onPreDestroyBase = m.prototype._onPreDestroy;
0;
m.prototype._onHierarchyChangedBase = m.prototype._onHierarchyChanged;
0;
r.propertyDefine(m, [ "parent", "name", "children", "childrenCount" ], {});
0;
cc._BaseNode = e.exports = m;
}), {
"../event-manager": 75,
"../platform/CCObject": 116,
"../platform/id-generater": 126,
"../platform/js": 130,
"../renderer/render-flow": 156,
"./misc": 187
} ],
182: [ (function(t, e, i) {
"use strict";
var n = t("../components/CCRenderComponent"), r = t("../platform/CCMacro").BlendFactor, s = t("../../renderer/gfx"), o = cc.Class({
properties: {
_srcBlendFactor: r.SRC_ALPHA,
_dstBlendFactor: r.ONE_MINUS_SRC_ALPHA,
srcBlendFactor: {
get: function() {
return this._srcBlendFactor;
},
set: function(t) {
if (this._srcBlendFactor !== t) {
this._srcBlendFactor = t;
this._updateBlendFunc();
}
},
animatable: !1,
type: r,
tooltip: !1,
visible: !0
},
dstBlendFactor: {
get: function() {
return this._dstBlendFactor;
},
set: function(t) {
if (this._dstBlendFactor !== t) {
this._dstBlendFactor = t;
this._updateBlendFunc();
}
},
animatable: !1,
type: r,
tooltip: !1,
visible: !0
}
},
setMaterial: function(t, e) {
if (this._materials[t] !== e) {
n.prototype.setMaterial.call(this, t, e);
e && this._updateMaterialBlendFunc(e);
}
},
_updateBlendFunc: function() {
for (var t = this._materials, e = 0; e < t.length; e++) {
var i = t[e];
this._updateMaterialBlendFunc(i);
}
},
_updateMaterialBlendFunc: function(t) {
t.effect.setBlend(!0, s.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor, s.BLEND_FUNC_ADD, this._srcBlendFactor, this._dstBlendFactor);
t.setDirty(!0);
}
});
e.exports = cc.BlendFunc = o;
}), {
"../../renderer/gfx": 234,
"../components/CCRenderComponent": 54,
"../platform/CCMacro": 115
} ],
183: [ (function(t, e, i) {
"use strict";
var n = t("./misc").BASE64_VALUES, r = "0123456789abcdef".split(""), s = [ "", "", "", "" ], o = s.concat(s, "-", s, "-", s, "-", s, "-", s, s, s), a = o.map((function(t, e) {
return "-" === t ? NaN : e;
})).filter(isFinite);
e.exports = function(t) {
if (22 !== t.length) return t;
o[0] = t[0];
o[1] = t[1];
for (var e = 2, i = 2; e < 22; e += 2) {
var s = n[t.charCodeAt(e)], c = n[t.charCodeAt(e + 1)];
o[a[i++]] = r[s >> 2];
o[a[i++]] = r[(3 & s) << 2 | c >> 4];
o[a[i++]] = r[15 & c];
}
return o.join("");
};
0;
}), {
"./misc": 187
} ],
184: [ (function(t, e, i) {
"use strict";
cc.find = e.exports = function(t, e) {
if (null == t) {
cc.errorID(5600);
return null;
}
if (e) 0; else {
var i = cc.director.getScene();
if (!i) {
0;
return null;
}
0;
e = i;
}
for (var n = e, r = "/" !== t[0] ? 0 : 1, s = t.split("/"), o = r; o < s.length; o++) {
var a = s[o], c = n._children;
n = null;
for (var l = 0, u = c.length; l < u; ++l) {
var h = c[l];
if (h.name === a) {
n = h;
break;
}
}
if (!n) return null;
}
return n;
};
}), {} ],
185: [ (function(t, e, i) {
"use strict";
var n = t("../assets/material/CCMaterial"), r = cc.Class({
properties: {
_normalMaterial: null,
normalMaterial: {
get: function() {
return this._normalMaterial;
},
set: function(t) {
this._normalMaterial = t;
this._updateDisabledState && this._updateDisabledState();
},
type: n,
tooltip: !1,
animatable: !1
},
_grayMaterial: null,
grayMaterial: {
get: function() {
return this._grayMaterial;
},
set: function(t) {
this._grayMaterial = t;
this._updateDisabledState && this._updateDisabledState();
},
type: n,
tooltip: !1,
animatable: !1
}
},
_switchGrayMaterial: function(t, e) {
if (cc.game.renderType !== cc.game.RENDER_TYPE_CANVAS) {
var i = void 0;
if (t) {
(i = this._grayMaterial) || (i = n.getBuiltinMaterial("2d-gray-sprite"));
i = this._grayMaterial = n.getInstantiatedMaterial(i, e);
} else {
(i = this._normalMaterial) || (i = n.getBuiltinMaterial("2d-sprite", e));
i = this._normalMaterial = n.getInstantiatedMaterial(i, e);
}
e.setMaterial(0, i);
}
}
});
e.exports = r;
}), {
"../assets/material/CCMaterial": 30
} ],
186: [ (function(t, e, i) {
"use strict";
t("./CCPath");
t("./profiler/CCProfiler");
t("./find");
t("./mutable-forward-iterator");
}), {
"./CCPath": 179,
"./find": 184,
"./mutable-forward-iterator": 188,
"./profiler/CCProfiler": 191
} ],
187: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js"), r = {
propertyDefine: function(t, e, i) {
function r(t, e, i, r) {
var s = Object.getOwnPropertyDescriptor(t, e);
if (s) {
s.get && (t[i] = s.get);
s.set && r && (t[r] = s.set);
} else {
var o = t[i];
n.getset(t, e, o, t[r]);
}
}
for (var s, o = t.prototype, a = 0; a < e.length; a++) {
var c = (s = e[a])[0].toUpperCase() + s.slice(1);
r(o, s, "get" + c, "set" + c);
}
for (s in i) {
var l = i[s];
r(o, s, l[0], l[1]);
}
},
NextPOT: function(t) {
t -= 1;
t |= t >> 1;
t |= t >> 2;
t |= t >> 4;
t |= t >> 8;
return (t |= t >> 16) + 1;
}
};
0;
r.BUILTIN_CLASSID_RE = /^(?:cc|dragonBones|sp|ccsg)\..+/;
for (var s = new Array(123), o = 0; o < 123; ++o) s[o] = 64;
for (var a = 0; a < 64; ++a) s["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charCodeAt(a)] = a;
r.BASE64_VALUES = s;
r.pushToMap = function(t, e, i, n) {
var r = t[e];
if (r) if (Array.isArray(r)) if (n) {
r.push(r[0]);
r[0] = i;
} else r.push(i); else t[e] = n ? [ i, r ] : [ r, i ]; else t[e] = i;
};
r.clampf = function(t, e, i) {
if (e > i) {
var n = e;
e = i;
i = n;
}
return t < e ? e : t < i ? t : i;
};
r.clamp01 = function(t) {
return t < 0 ? 0 : t < 1 ? t : 1;
};
r.lerp = function(t, e, i) {
return t + (e - t) * i;
};
r.degreesToRadians = function(t) {
return t * cc.macro.RAD;
};
r.radiansToDegrees = function(t) {
return t * cc.macro.DEG;
};
cc.misc = e.exports = r;
}), {
"../platform/js": 130
} ],
188: [ (function(t, e, i) {
"use strict";
function n(t) {
this.i = 0;
this.array = t;
}
var r = n.prototype;
r.remove = function(t) {
var e = this.array.indexOf(t);
e >= 0 && this.removeAt(e);
};
r.removeAt = function(t) {
this.array.splice(t, 1);
t <= this.i && --this.i;
};
r.fastRemove = function(t) {
var e = this.array.indexOf(t);
e >= 0 && this.fastRemoveAt(e);
};
r.fastRemoveAt = function(t) {
var e = this.array;
e[t] = e[e.length - 1];
--e.length;
t <= this.i && --this.i;
};
r.push = function(t) {
this.array.push(t);
};
e.exports = n;
}), {} ],
189: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var r = (function() {
function t() {
n(this, t);
this.enabled = !0;
this.count = 0;
this.maxSize = 1024;
}
t.prototype.get = function() {};
t.prototype.put = function() {};
t.prototype.clear = function() {};
return t;
})();
i.default = r;
cc.pool = {};
r.register = function(t, e) {
cc.pool[t] = e;
};
e.exports = i.default;
}), {} ],
190: [ (function(t, e, i) {
"use strict";
t("../vmath");
cc._PrefabInfo = cc.Class({
name: "cc.PrefabInfo",
properties: {
root: null,
asset: null,
fileId: "",
sync: !1,
_synced: {
default: !1,
serializable: !1
}
}
});
e.exports = {
syncWithPrefab: function(t) {
var e = t._prefab;
e._synced = !0;
if (e.asset) {
var i = t._objFlags, n = t._parent, r = t._id, s = t._name, o = t._active, a = t._eulerAngles.x, c = t._eulerAngles.y, l = t._eulerAngles.z, u = t._localZOrder, h = t._globalZOrder, f = t._trs, d = f[0], _ = f[1], p = f[2];
cc.game._isCloning = !0;
e.asset._doInstantiate(t);
cc.game._isCloning = !1;
t._objFlags = i;
t._parent = n;
t._id = r;
t._prefab = e;
t._name = s;
t._active = o;
t._localZOrder = u;
t._globalZOrder = h;
(f = t._trs)[0] = d;
f[1] = _;
f[2] = p;
t._eulerAngles.x = a;
t._eulerAngles.y = c;
t._eulerAngles.z = l;
} else {
cc.errorID(3701, t.name);
t._prefab = null;
}
}
};
}), {
"../vmath": 213
} ],
191: [ (function(t, e, i) {
"use strict";
var n = t("../../platform/CCMacro"), r = t("./perf-counter"), s = !1, o = 15, a = null, c = null, l = null;
function u() {
if (!a) {
a = {
frame: {
desc: "Frame time (ms)",
min: 0,
max: 50,
average: 500
},
fps: {
desc: "Framerate (FPS)",
below: 30,
average: 500
},
draws: {
desc: "Draw call"
},
logic: {
desc: "Game Logic (ms)",
min: 0,
max: 50,
average: 500,
color: "#080"
},
render: {
desc: "Renderer (ms)",
min: 0,
max: 50,
average: 500,
color: "#f90"
},
mode: {
desc: cc.game.renderType === cc.game.RENDER_TYPE_WEBGL ? "WebGL" : "Canvas",
min: 1
}
};
var t = performance.now();
for (var e in a) a[e]._counter = new r(e, a[e], t);
}
}
function h() {
if (!c || !c.isValid) {
(c = new cc.Node("PROFILER-NODE")).x = c.y = 10;
c.groupIndex = cc.Node.BuiltinGroupIndex.DEBUG;
cc.Camera._setupDebugCamera();
c.zIndex = n.MAX_ZINDEX;
cc.game.addPersistRootNode(c);
var t = new cc.Node("LEFT-PANEL");
t.anchorX = t.anchorY = 0;
var e = t.addComponent(cc.Label);
e.fontSize = o;
e.lineHeight = o;
t.parent = c;
var i = new cc.Node("RIGHT-PANEL");
i.anchorX = 1;
i.anchorY = 0;
i.x = 200;
var r = i.addComponent(cc.Label);
r.horizontalAlign = cc.Label.HorizontalAlign.RIGHT;
r.fontSize = o;
r.lineHeight = o;
i.parent = c;
if (cc.sys.browserType !== cc.sys.BROWSER_TYPE_BAIDU_GAME_SUB && cc.sys.browserType !== cc.sys.BROWSER_TYPE_WECHAT_GAME_SUB) {
e.cacheMode = cc.Label.CacheMode.CHAR;
r.cacheMode = cc.Label.CacheMode.CHAR;
}
l = {
left: e,
right: r
};
}
}
function f() {
h();
var t = cc.director._lastUpdate;
a.frame._counter.start(t);
a.logic._counter.start(t);
}
function d() {
var t = performance.now();
cc.director.isPaused() ? a.frame._counter.start(t) : a.logic._counter.end(t);
a.render._counter.start(t);
}
function _() {
var t = performance.now();
a.render._counter.end(t);
a.draws._counter.value = cc.renderer.drawCalls;
a.frame._counter.end(t);
a.fps._counter.frame(t);
var e = "", i = "";
for (var n in a) {
var r = a[n];
r._counter.sample(t);
e += r.desc + "\n";
i += r._counter.human() + "\n";
}
if (l) {
l.left.string = e;
l.right.string = i;
}
}
cc.profiler = e.exports = {
isShowingStats: function() {
return s;
},
hideStats: function() {
if (s) {
c && (c.active = !1);
cc.director.off(cc.Director.EVENT_BEFORE_UPDATE, f);
cc.director.off(cc.Director.EVENT_AFTER_UPDATE, d);
cc.director.off(cc.Director.EVENT_AFTER_DRAW, _);
s = !1;
}
},
showStats: function() {
if (!s) {
u();
c && (c.active = !0);
cc.director.on(cc.Director.EVENT_BEFORE_UPDATE, f);
cc.director.on(cc.Director.EVENT_AFTER_UPDATE, d);
cc.director.on(cc.Director.EVENT_AFTER_DRAW, _);
s = !0;
}
}
};
}), {
"../../platform/CCMacro": 115,
"./perf-counter": 193
} ],
192: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.Counter",
ctor: function(t, e, i) {
this._id = t;
this._opts = e || {};
this._value = 0;
this._total = 0;
this._averageValue = 0;
this._accumValue = 0;
this._accumSamples = 0;
this._accumStart = i;
},
properties: {
value: {
get: function() {
return this._value;
},
set: function(t) {
this._value = t;
}
}
},
_average: function(t, e) {
if (this._opts.average) {
this._accumValue += t;
++this._accumSamples;
var i = e;
if (i - this._accumStart >= this._opts.average) {
this._averageValue = this._accumValue / this._accumSamples;
this._accumValue = 0;
this._accumStart = i;
this._accumSamples = 0;
}
}
},
sample: function(t) {
this._average(this._value, t);
},
human: function() {
var t = this._opts.average ? this._averageValue : this._value;
return Math.round(100 * t) / 100;
},
alarm: function() {
return this._opts.below && this._value < this._opts.below || this._opts.over && this._value > this._opts.over;
}
});
e.exports = n;
}), {} ],
193: [ (function(t, e, i) {
"use strict";
var n = t("./counter"), r = cc.Class({
name: "cc.PerfCounter",
extends: n,
ctor: function(t, e, i) {
this._time = i;
},
start: function(t) {
this._time = t;
},
end: function(t) {
this._value = t - this._time;
this._average(this._value);
},
tick: function() {
this.end();
this.start();
},
frame: function(t) {
var e = t, i = e - this._time;
this._total++;
if (i > (this._opts.average || 1e3)) {
this._value = 1e3 * this._total / i;
this._total = 0;
this._time = e;
this._average(this._value);
}
}
});
e.exports = r;
}), {
"./counter": 192
} ],
194: [ (function(t, e, i) {
"use strict";
var n = .26;
0;
var r = {
BASELINE_RATIO: n,
MIDDLE_RATIO: (n + 1) / 2 - n,
label_wordRex: /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûа-яА-ЯЁё]+|\S)/,
label_symbolRex: /^[!,.:;'}\]%\?>、‘“》？。，！]/,
label_lastWordRex: /([a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]+|\S)$/,
label_lastEnglish: /[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]+$/,
label_firstEnglish: /^[a-zA-Z0-9ÄÖÜäöüßéèçàùêâîôûаíìÍÌïÁÀáàÉÈÒÓòóŐőÙÚŰúűñÑæÆœŒÃÂãÔõěščřžýáíéóúůťďňĚŠČŘŽÁÍÉÓÚŤżźśóńłęćąŻŹŚÓŃŁĘĆĄ-яА-ЯЁё]/,
label_firstEmoji: /^[\uD83C\uDF00-\uDFFF\uDC00-\uDE4F]/,
label_lastEmoji: /([\uDF00-\uDFFF\uDC00-\uDE4F]+|\S)$/,
label_wrapinspection: !0,
__CHINESE_REG: /^[\u4E00-\u9FFF\u3400-\u4DFF]+$/,
__JAPANESE_REG: /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g,
__KOREAN_REG: /^[\u1100-\u11FF]|[\u3130-\u318F]|[\uA960-\uA97F]|[\uAC00-\uD7AF]|[\uD7B0-\uD7FF]+$/,
isUnicodeCJK: function(t) {
return this.__CHINESE_REG.test(t) || this.__JAPANESE_REG.test(t) || this.__KOREAN_REG.test(t);
},
isUnicodeSpace: function(t) {
return (t = t.charCodeAt(0)) >= 9 && t <= 13 || 32 === t || 133 === t || 160 === t || 5760 === t || t >= 8192 && t <= 8202 || 8232 === t || 8233 === t || 8239 === t || 8287 === t || 12288 === t;
},
safeMeasureText: function(t, e) {
var i = t.measureText(e);
return i && i.width || 0;
},
fragmentText: function(t, e, i, n) {
var r = [];
if (0 === t.length || i < 0) {
r.push("");
return r;
}
for (var s = t; e > i && s.length > 1; ) {
for (var o = s.length * (i / e) | 0, a = s.substring(o), c = e - n(a), l = a, u = 0, h = 0; c > i && h++ < 10; ) {
o *= i / c;
o |= 0;
c = e - n(a = s.substring(o));
}
h = 0;
for (;c <= i && h++ < 10; ) {
if (a) {
var f = this.label_wordRex.exec(a);
u = f ? f[0].length : 1;
l = a;
}
o += u;
c = e - n(a = s.substring(o));
}
if (0 === (o -= u)) {
o = 1;
l = l.substring(1);
}
var d, _ = s.substring(0, 0 + o);
if (this.label_wrapinspection && this.label_symbolRex.test(l || a)) {
0 === (o -= (d = this.label_lastWordRex.exec(_)) ? d[0].length : 0) && (o = 1);
l = s.substring(o);
_ = s.substring(0, 0 + o);
}
if (this.label_firstEmoji.test(l) && (d = this.label_lastEmoji.exec(_)) && _ !== d[0]) {
o -= d[0].length;
l = s.substring(o);
_ = s.substring(0, 0 + o);
}
if (this.label_firstEnglish.test(l) && (d = this.label_lastEnglish.exec(_)) && _ !== d[0]) {
o -= d[0].length;
l = s.substring(o);
_ = s.substring(0, 0 + o);
}
0 === r.length ? r.push(_) : (_ = _.trimLeft()).length > 0 && r.push(_);
e = n(s = l || a);
}
0 === r.length ? r.push(s) : (s = s.trimLeft()).length > 0 && r.push(s);
return r;
}
};
cc.textUtils = e.exports = r;
}), {} ],
195: [ (function(t, e, i) {
"use strict";
var n = t("../assets/CCTexture2D"), r = {
loadImage: function(t, e, i) {
cc.assertID(t, 3103);
var r = cc.loader.getRes(t);
if (r) {
if (r.loaded) {
e && e.call(i, null, r);
return r;
}
r.once("load", (function() {
e && e.call(i, null, r);
}), i);
return r;
}
(r = new n()).url = t;
cc.loader.load({
url: t,
texture: r
}, (function(t, n) {
if (t) return e && e.call(i, t || new Error("Unknown error"));
n.handleLoadedTexture();
e && e.call(i, null, n);
}));
return r;
},
cacheImage: function(t, e) {
if (t && e) {
var i = new n();
i.initWithElement(e);
var r = {
id: t,
url: t,
error: null,
content: i,
complete: !1
};
cc.loader.flowOut(r);
return i;
}
},
postLoadTexture: function(t, e) {
t.loaded ? e && e() : t.url ? cc.loader.load({
url: t.url,
skips: [ "Loader" ]
}, (function(i, n) {
if (n) {
0;
t.loaded || (t._nativeAsset = n);
}
e && e(i);
})) : e && e();
}
};
cc.textureUtil = e.exports = r;
}), {
"../assets/CCTexture2D": 28
} ],
196: [ (function(t, e, i) {
"use strict";
var n = t("./node-unit"), r = t("./node-mem-pool");
e.exports = {
NodeMemPool: new r(n)
};
}), {
"./node-mem-pool": 198,
"./node-unit": 199
} ],
197: [ (function(t, e, i) {
"use strict";
var n = function(t) {
this._unitClass = t;
this._pool = [];
this._findOrder = [];
this._initNative();
}, r = n.prototype;
r._initNative = function() {
this._nativeMemPool = new renderer.MemPool();
};
r._buildUnit = function(t) {
var e = new this._unitClass(t, this);
this._nativeMemPool.updateCommonData(t, e._data, e._signData);
return e;
};
r._destroyUnit = function(t) {
this._pool[t] = null;
for (var e = 0, i = this._findOrder.length; e < i; e++) {
var n = this._findOrder[e];
if (n && n.unitID == t) {
this._findOrder.splice(e, 1);
break;
}
}
this._nativeMemPool.removeCommonData(t);
};
r._findUnitID = function() {
for (var t = 0, e = this._pool; e[t]; ) t++;
return t;
};
r.pop = function() {
for (var t = null, e = 0, i = this._findOrder, n = this._pool, r = i.length; e < r; e++) {
var s = i[e];
if (s && s.hasSpace()) {
t = s;
break;
}
}
if (!t) {
var o = this._findUnitID();
t = this._buildUnit(o);
n[o] = t;
i.push(t);
e = i.length - 1;
}
var a = i[0];
if (a !== t) {
i[0] = t;
i[e] = a;
}
return t.pop();
};
r.push = function(t) {
var e = this._pool[t.unitID];
e.push(t.index);
this._findOrder.length > 1 && e.isAllFree() && this._destroyUnit(t.unitID);
return e;
};
e.exports = n;
}), {} ],
198: [ (function(t, e, i) {
"use strict";
var n = t("./mem-pool"), r = function(t) {
n.call(this, t);
};
(function() {
var t = function() {};
t.prototype = n.prototype;
r.prototype = new t();
})();
var s = r.prototype;
s._initNative = function() {
this._nativeMemPool = new renderer.NodeMemPool();
};
s._destroyUnit = function(t) {
n.prototype._destroyUnit.call(this, t);
this._nativeMemPool.removeNodeData(t);
};
e.exports = r;
}), {
"./mem-pool": 197
} ],
199: [ (function(t, e, i) {
"use strict";
var n = t("../../vmath/utils"), r = Uint32Array, s = 10 * n.FLOAT_BYTES, o = 16 * n.FLOAT_BYTES, a = 16 * n.FLOAT_BYTES, c = Uint32Array, l = Uint32Array, u = Int32Array, h = Uint8Array, f = Uint8Array, d = Uint32Array, _ = 2 * n.FLOAT_BYTES, p = t("./unit-base"), v = function(t, e) {
p.call(this, t, e);
var i = this._contentNum;
this.trsList = new n.FLOAT_ARRAY_TYPE(10 * i);
this.localMatList = new n.FLOAT_ARRAY_TYPE(16 * i);
this.worldMatList = new n.FLOAT_ARRAY_TYPE(16 * i);
this.dirtyList = new r(1 * i);
this.parentList = new c(2 * i);
this.zOrderList = new l(1 * i);
this.cullingMaskList = new u(1 * i);
this.opacityList = new h(1 * i);
this.is3DList = new f(1 * i);
this.nodeList = new d(2 * i);
this.skewList = new n.FLOAT_ARRAY_TYPE(2 * i);
this._memPool._nativeMemPool.updateNodeData(t, this.dirtyList, this.trsList, this.localMatList, this.worldMatList, this.parentList, this.zOrderList, this.cullingMaskList, this.opacityList, this.is3DList, this.nodeList, this.skewList);
for (var v = 0; v < i; v++) {
var g = this._spacesData[v];
g.trs = new n.FLOAT_ARRAY_TYPE(this.trsList.buffer, v * s, 10);
g.localMat = new n.FLOAT_ARRAY_TYPE(this.localMatList.buffer, v * o, 16);
g.worldMat = new n.FLOAT_ARRAY_TYPE(this.worldMatList.buffer, v * a, 16);
g.dirty = new r(this.dirtyList.buffer, 4 * v, 1);
g.parent = new c(this.parentList.buffer, 8 * v, 2);
g.zOrder = new l(this.zOrderList.buffer, 4 * v, 1);
g.cullingMask = new u(this.cullingMaskList.buffer, 4 * v, 1);
g.opacity = new h(this.opacityList.buffer, 1 * v, 1);
g.is3D = new f(this.is3DList.buffer, 1 * v, 1);
g.skew = new n.FLOAT_ARRAY_TYPE(this.skewList.buffer, v * _, 2);
}
};
(function() {
var t = function() {};
t.prototype = p.prototype;
v.prototype = new t();
})();
e.exports = v;
}), {
"../../vmath/utils": 220,
"./unit-base": 200
} ],
200: [ (function(t, e, i) {
"use strict";
var n = function(t, e, i) {
i = i || 128;
this.unitID = t;
this._memPool = e;
this._data = new Uint16Array(2);
this._data[0] = 0;
this._data[1] = 0;
this._contentNum = i;
this._signData = new Uint16Array(2 * this._contentNum);
this._spacesData = [];
for (var n = 0; n < i; n++) {
var r = 2 * n;
this._signData[r + 0] = n + 1;
this._signData[r + 1] = 0;
this._spacesData[n] = {
index: n,
unitID: t
};
}
this._signData[2 * (i - 1)] = 65535;
}, r = n.prototype;
r.hasSpace = function() {
return 65535 !== this._data[0];
};
r.isAllFree = function() {
return 0 == this._data[1];
};
r.pop = function() {
var t = this._data[0];
if (65535 === t) return null;
var e = t, i = 2 * e, n = this._spacesData[e];
this._signData[i + 1] = 1;
this._data[0] = this._signData[i + 0];
this._data[1]++;
return n;
};
r.push = function(t) {
var e = 2 * t;
this._signData[e + 1] = 0;
this._signData[e + 0] = this._data[0];
this._data[0] = t;
this._data[1]--;
};
r.dump = function() {
for (var t = 0, e = this._data[0], i = ""; 65535 != e; ) {
t++;
i += e + "->";
e = this._signData[2 * e + 0];
}
for (var n = 0, r = "", s = this._contentNum, o = 0; o < s; o++) {
if (1 == this._signData[2 * o + 1]) {
n++;
r += o + "->";
}
}
var a = t + n;
console.log("unitID:", this.unitID, "spaceNum:", t, "calc using num:", n, "store using num:", this._data[1], "calc total num:", a, "actually total num:", this._contentNum);
console.log("free info:", i);
console.log("using info:", r);
n != this._data[1] && cc.error("using num error", "calc using num:", n, "store using num:", this._data[1]);
t + n != this._contentNum && cc.error("total num error", "calc total num:", a, "actually total num:", this._contentNum);
};
e.exports = n;
}), {} ],
201: [ (function(t, e, i) {
"use strict";
var n = t("../vmath"), r = t("./value-type"), s = t("../platform/js"), o = (function() {
function e(t, e, i, n) {
if ("object" == typeof t) {
e = t.g;
i = t.b;
n = t.a;
t = t.r;
}
t = t || 0;
e = e || 0;
i = i || 0;
n = "number" == typeof n ? n : 255;
this._val = (n << 24 >>> 0) + (i << 16) + (e << 8) + t;
}
s.extend(e, r);
t("../platform/CCClass").fastDefine("cc.Color", e, {
r: 0,
g: 0,
b: 0,
a: 255
});
var i = {
WHITE: [ 255, 255, 255, 255 ],
BLACK: [ 0, 0, 0, 255 ],
TRANSPARENT: [ 0, 0, 0, 0 ],
GRAY: [ 127.5, 127.5, 127.5 ],
RED: [ 255, 0, 0 ],
GREEN: [ 0, 255, 0 ],
BLUE: [ 0, 0, 255 ],
YELLOW: [ 255, 235, 4 ],
ORANGE: [ 255, 127, 0 ],
CYAN: [ 0, 255, 255 ],
MAGENTA: [ 255, 0, 255 ]
};
for (var o in i) s.get(e, o, (function(t) {
return function() {
return new e(t[0], t[1], t[2], t[3]);
};
})(i[o]));
var a = e.prototype;
a.clone = function() {
var t = new e();
t._val = this._val;
return t;
};
a.equals = function(t) {
return t && this._val === t._val;
};
a.lerp = function(t, i, n) {
n = n || new e();
var r = this.r, s = this.g, o = this.b, a = this.a;
n.r = r + (t.r - r) * i;
n.g = s + (t.g - s) * i;
n.b = o + (t.b - o) * i;
n.a = a + (t.a - a) * i;
return n;
};
a.toString = function() {
return "rgba(" + this.r.toFixed() + ", " + this.g.toFixed() + ", " + this.b.toFixed() + ", " + this.a.toFixed() + ")";
};
a.getR = function() {
return 255 & this._val;
};
a.setR = function(t) {
t = ~~cc.misc.clampf(t, 0, 255);
this._val = (4294967040 & this._val | t) >>> 0;
return this;
};
a.getG = function() {
return (65280 & this._val) >> 8;
};
a.setG = function(t) {
t = ~~cc.misc.clampf(t, 0, 255);
this._val = (4294902015 & this._val | t << 8) >>> 0;
return this;
};
a.getB = function() {
return (16711680 & this._val) >> 16;
};
a.setB = function(t) {
t = ~~cc.misc.clampf(t, 0, 255);
this._val = (4278255615 & this._val | t << 16) >>> 0;
return this;
};
a.getA = function() {
return (4278190080 & this._val) >>> 24;
};
a.setA = function(t) {
t = ~~cc.misc.clampf(t, 0, 255);
this._val = (16777215 & this._val | t << 24) >>> 0;
return this;
};
a._fastSetA = function(t) {
this._val = (16777215 & this._val | t << 24) >>> 0;
};
s.getset(a, "r", a.getR, a.setR, !0);
s.getset(a, "g", a.getG, a.setG, !0);
s.getset(a, "b", a.getB, a.setB, !0);
s.getset(a, "a", a.getA, a.setA, !0);
a.toCSS = function(t) {
return "rgba" === t ? "rgba(" + (0 | this.r) + "," + (0 | this.g) + "," + (0 | this.b) + "," + (this.a / 255).toFixed(2) + ")" : "rgb" === t ? "rgb(" + (0 | this.r) + "," + (0 | this.g) + "," + (0 | this.b) + ")" : "#" + this.toHEX(t);
};
a.fromHEX = function(t) {
t = 0 === t.indexOf("#") ? t.substring(1) : t;
var e = parseInt(t.substr(0, 2), 16) || 0, i = parseInt(t.substr(2, 2), 16) || 0, n = parseInt(t.substr(4, 2), 16) || 0, r = parseInt(t.substr(6, 2), 16) || 255;
this._val = (r << 24 >>> 0) + (n << 16) + (i << 8) + e;
return this;
};
a.toHEX = function(t) {
var e = [ (this.r < 16 ? "0" : "") + (0 | this.r).toString(16), (this.g < 16 ? "0" : "") + (0 | this.g).toString(16), (this.b < 16 ? "0" : "") + (0 | this.b).toString(16) ], i = -1;
if ("#rgb" === t) for (i = 0; i < e.length; ++i) e[i].length > 1 && (e[i] = e[i][0]); else if ("#rrggbb" === t) for (i = 0; i < e.length; ++i) 1 === e[i].length && (e[i] = "0" + e[i]); else "#rrggbbaa" === t && e.push((this.a < 16 ? "0" : "") + (0 | this.a).toString(16));
return e.join("");
};
a.toRGBValue = function() {
return 16777215 & this._val;
};
a.fromHSV = function(t, e, i) {
var n, r, s;
if (0 === e) n = r = s = i; else if (0 === i) n = r = s = 0; else {
1 === t && (t = 0);
t *= 6;
e = e;
i = i;
var o = Math.floor(t), a = t - o, c = i * (1 - e), l = i * (1 - e * a), u = i * (1 - e * (1 - a));
switch (o) {
case 0:
n = i;
r = u;
s = c;
break;

case 1:
n = l;
r = i;
s = c;
break;

case 2:
n = c;
r = i;
s = u;
break;

case 3:
n = c;
r = l;
s = i;
break;

case 4:
n = u;
r = c;
s = i;
break;

case 5:
n = i;
r = c;
s = l;
}
}
n *= 255;
r *= 255;
s *= 255;
this._val = (this.a << 24 >>> 0) + (s << 16) + (r << 8) + n;
return this;
};
a.toHSV = function() {
var t = this.r / 255, e = this.g / 255, i = this.b / 255, n = {
h: 0,
s: 0,
v: 0
}, r = Math.max(t, e, i), s = Math.min(t, e, i), o = 0;
n.v = r;
n.s = r ? (r - s) / r : 0;
if (n.s) {
o = r - s;
n.h = t === r ? (e - i) / o : e === r ? 2 + (i - t) / o : 4 + (t - e) / o;
n.h /= 6;
n.h < 0 && (n.h += 1);
} else n.h = 0;
return n;
};
a.set = function(t) {
if (t._val) this._val = t._val; else {
this.r = t.r;
this.g = t.g;
this.b = t.b;
this.a = t.a;
}
};
a.array = function(t) {
n.color4.array(t, this);
};
return e;
})();
cc.Color = o;
cc.color = function(t, e, i, n) {
if ("string" == typeof t) {
return new cc.Color().fromHEX(t);
}
return "object" == typeof t ? new cc.Color(t.r, t.g, t.b, t.a) : new cc.Color(t, e, i, n);
};
e.exports = cc.Color;
}), {
"../platform/CCClass": 110,
"../platform/js": 130,
"../vmath": 213,
"./value-type": 207
} ],
202: [ (function(t, e, i) {
"use strict";
t("./value-type");
cc.vmath = t("../vmath").default;
e.exports = {
Vec2: t("./vec2"),
Vec3: t("./vec3"),
Vec4: t("./vec4"),
Quat: t("./quat"),
Mat4: t("./mat4"),
Size: t("./size"),
Rect: t("./rect"),
Color: t("./color")
};
}), {
"../vmath": 213,
"./color": 201,
"./mat4": 203,
"./quat": 204,
"./rect": 205,
"./size": 206,
"./value-type": 207,
"./vec2": 208,
"./vec3": 209,
"./vec4": 210
} ],
203: [ (function(t, e, i) {
"use strict";
var n = t("../vmath"), r = t("../vmath/utils"), s = t("./value-type"), o = t("../platform/js"), a = t("../platform/CCClass");
function c(t, e, i, n, s, o, a, c, l, u, h, f, d, _, p, v) {
this.m = new r.FLOAT_ARRAY_TYPE(16);
var g = this.m;
g[0] = t;
g[1] = e;
g[2] = i;
g[3] = n;
g[4] = s;
g[5] = o;
g[6] = a;
g[7] = c;
g[8] = l;
g[9] = u;
g[10] = h;
g[11] = f;
g[12] = d;
g[13] = _;
g[14] = p;
g[15] = v;
}
o.extend(c, s);
a.fastDefine("cc.Mat4", c, {
m00: 1,
m01: 0,
m02: 0,
m03: 0,
m04: 0,
m05: 1,
m06: 0,
m07: 0,
m08: 0,
m09: 0,
m10: 1,
m11: 0,
m12: 0,
m13: 0,
m14: 0,
m15: 1
});
for (var l = function(t) {
Object.defineProperty(c.prototype, "m" + t, {
get: function() {
return this.m[t];
},
set: function(e) {
this.m[t] = e;
}
});
}, u = 0; u < 16; u++) l(u);
o.mixin(c.prototype, {
clone: function() {
var t = this.m;
return new c(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]);
},
set: function(t) {
var e = this.m, i = t.m;
e[0] = i[0];
e[1] = i[1];
e[2] = i[2];
e[3] = i[3];
e[4] = i[4];
e[5] = i[5];
e[6] = i[6];
e[7] = i[7];
e[8] = i[8];
e[9] = i[9];
e[10] = i[10];
e[11] = i[11];
e[12] = i[12];
e[13] = i[13];
e[14] = i[14];
e[15] = i[15];
return this;
},
equals: function(t) {
return n.mat4.exactEquals(this, t);
},
fuzzyEquals: function(t) {
return n.mat4.equals(this, t);
},
toString: function() {
var t = this.m;
return t ? "[\n" + t[0] + ", " + t[1] + ", " + t[2] + ", " + t[3] + ",\n" + t[4] + ", " + t[5] + ", " + t[6] + ", " + t[7] + ",\n" + t[8] + ", " + t[9] + ", " + t[10] + ", " + t[11] + ",\n" + t[12] + ", " + t[13] + ", " + t[14] + ", " + t[15] + "\n]" : "[\n1, 0, 0, 0\n0, 1, 0, 0\n0, 0, 1, 0\n0, 0, 0, 1\n]";
},
identity: function() {
return n.mat4.identity(this);
},
transpose: function(t) {
t = t || new cc.Mat4();
return n.mat4.transpose(t, this);
},
invert: function(t) {
t = t || new cc.Mat4();
return n.mat4.invert(t, this);
},
adjoint: function(t) {
t = t || new cc.Mat4();
return n.mat4.adjoint(t, this);
},
determinant: function() {
return n.mat4.determinant(this);
},
add: function(t, e) {
e = e || new cc.Mat4();
return n.mat4.add(e, this, t);
},
sub: function(t, e) {
e = e || new cc.Mat4();
return n.mat4.subtract(e, this, t);
},
mul: function(t, e) {
e = e || new cc.Mat4();
return n.mat4.multiply(e, this, t);
},
mulScalar: function(t, e) {
e = e || new cc.Mat4();
return n.mat4.mulScalar(e, this, t);
},
translate: function(t, e) {
e = e || new cc.Mat4();
return n.mat4.translate(e, this, t);
},
scale: function(t, e) {
e = e || new cc.Mat4();
return n.mat4.scale(e, this, t);
},
rotate: function(t, e, i) {
i = i || new cc.Mat4();
return n.mat4.rotate(i, this, t, e);
},
getTranslation: function(t) {
t = t || new cc.Vec3();
return n.mat4.getTranslation(t, this);
},
getScale: function(t) {
t = t || new cc.Vec3();
return n.mat4.getScaling(t, this);
},
getRotation: function(t) {
t = t || new cc.Quat();
return n.mat4.getRotation(t, this);
},
fromRTS: function(t, e, i) {
return n.mat4.fromRTS(this, t, e, i);
},
fromQuat: function(t) {
return n.mat4.fromQuat(this, t);
},
array: function(t) {
return n.mat4.array(t, this);
}
});
cc.mat4 = function(t, e, i, r, s, o, a, l, u, h, f, d, _, p, v, g) {
var m = new c(t, e, i, r, s, o, a, l, u, h, f, d, _, p, v, g);
void 0 === t && n.mat4.identity(m);
return m;
};
e.exports = cc.Mat4 = c;
}), {
"../platform/CCClass": 110,
"../platform/js": 130,
"../vmath": 213,
"../vmath/utils": 220,
"./value-type": 207
} ],
204: [ (function(t, e, i) {
"use strict";
var n = t("./value-type"), r = t("../platform/js"), s = t("../platform/CCClass"), o = t("../vmath/quat");
function a(t, e, i, n) {
if (t && "object" == typeof t) {
i = t.z;
e = t.y;
n = t.w;
t = t.x;
}
this.x = t || 0;
this.y = e || 0;
this.z = i || 0;
this.w = n || 1;
}
r.extend(a, n);
s.fastDefine("cc.Quat", a, {
x: 0,
y: 0,
z: 0,
w: 1
});
var c = a.prototype;
c.clone = function() {
return new a(this.x, this.y, this.z, this.w);
};
c.set = function(t) {
this.x = t.x;
this.y = t.y;
this.z = t.z;
this.w = t.w;
return this;
};
c.equals = function(t) {
return t && this.x === t.x && this.y === t.y && this.z === t.z && this.w === t.w;
};
c.toEuler = function(t) {
o.toEuler(t, this);
return t;
};
c.fromEuler = function(t) {
o.fromEuler(this, t.x, t.y, t.z);
return this;
};
c.lerp = function(t, e, i) {
i = i || new cc.Quat();
o.slerp(i, this, t, e);
return i;
};
c.mul = function(t, e) {
e = e || new cc.Quat();
o.mul(e, this, t);
return e;
};
c.array = function(t) {
o.array(t, this);
};
c.rotateAround = function(t, e, i, n) {
n = n || new cc.Quat();
return o.rotateAround(n, t, e, i);
};
cc.quat = function(t, e, i, n) {
return new a(t, e, i, n);
};
e.exports = cc.Quat = a;
}), {
"../platform/CCClass": 110,
"../platform/js": 130,
"../vmath/quat": 218,
"./value-type": 207
} ],
205: [ (function(t, e, i) {
"use strict";
var n = t("./value-type"), r = t("../platform/js");
function s(t, e, i, n) {
if (t && "object" == typeof t) {
e = t.y;
i = t.width;
n = t.height;
t = t.x;
}
this.x = t || 0;
this.y = e || 0;
this.width = i || 0;
this.height = n || 0;
}
r.extend(s, n);
t("../platform/CCClass").fastDefine("cc.Rect", s, {
x: 0,
y: 0,
width: 0,
height: 0
});
s.fromMinMax = function(t, e) {
var i = Math.min(t.x, e.x), n = Math.min(t.y, e.y);
return new s(i, n, Math.max(t.x, e.x) - i, Math.max(t.y, e.y) - n);
};
var o = s.prototype;
o.clone = function() {
return new s(this.x, this.y, this.width, this.height);
};
o.equals = function(t) {
return t && this.x === t.x && this.y === t.y && this.width === t.width && this.height === t.height;
};
o.lerp = function(t, e, i) {
i = i || new s();
var n = this.x, r = this.y, o = this.width, a = this.height;
i.x = n + (t.x - n) * e;
i.y = r + (t.y - r) * e;
i.width = o + (t.width - o) * e;
i.height = a + (t.height - a) * e;
return i;
};
o.set = function(t) {
this.x = t.x;
this.y = t.y;
this.width = t.width;
this.height = t.height;
};
o.intersects = function(t) {
var e = this.x + this.width, i = this.y + this.height, n = t.x + t.width, r = t.y + t.height;
return !(e < t.x || n < this.x || i < t.y || r < this.y);
};
o.intersection = function(t, e) {
var i = this.x, n = this.y, r = this.x + this.width, s = this.y + this.height, o = e.x, a = e.y, c = e.x + e.width, l = e.y + e.height;
t.x = Math.max(i, o);
t.y = Math.max(n, a);
t.width = Math.min(r, c) - t.x;
t.height = Math.min(s, l) - t.y;
return t;
};
o.contains = function(t) {
return this.x <= t.x && this.x + this.width >= t.x && this.y <= t.y && this.y + this.height >= t.y;
};
o.containsRect = function(t) {
return this.x <= t.x && this.x + this.width >= t.x + t.width && this.y <= t.y && this.y + this.height >= t.y + t.height;
};
o.union = function(t, e) {
var i = this.x, n = this.y, r = this.width, s = this.height, o = e.x, a = e.y, c = e.width, l = e.height;
t.x = Math.min(i, o);
t.y = Math.min(n, a);
t.width = Math.max(i + r, o + c) - t.x;
t.height = Math.max(n + s, a + l) - t.y;
return t;
};
o.transformMat4 = function(t, e) {
var i = this.x, n = this.y, r = i + this.width, s = n + this.height, o = e.m, a = o[0] * i + o[4] * n + o[12], c = o[1] * i + o[5] * n + o[13], l = o[0] * r + o[4] * n + o[12], u = o[1] * r + o[5] * n + o[13], h = o[0] * i + o[4] * s + o[12], f = o[1] * i + o[5] * s + o[13], d = o[0] * r + o[4] * s + o[12], _ = o[1] * r + o[5] * s + o[13], p = Math.min(a, l, h, d), v = Math.max(a, l, h, d), g = Math.min(c, u, f, _), m = Math.max(c, u, f, _);
t.x = p;
t.y = g;
t.width = v - p;
t.height = m - g;
return t;
};
o.toString = function() {
return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.width.toFixed(2) + ", " + this.height.toFixed(2) + ")";
};
r.getset(o, "xMin", (function() {
return this.x;
}), (function(t) {
this.width += this.x - t;
this.x = t;
}));
r.getset(o, "yMin", (function() {
return this.y;
}), (function(t) {
this.height += this.y - t;
this.y = t;
}));
r.getset(o, "xMax", (function() {
return this.x + this.width;
}), (function(t) {
this.width = t - this.x;
}));
r.getset(o, "yMax", (function() {
return this.y + this.height;
}), (function(t) {
this.height = t - this.y;
}));
r.getset(o, "center", (function() {
return new cc.Vec2(this.x + .5 * this.width, this.y + .5 * this.height);
}), (function(t) {
this.x = t.x - .5 * this.width;
this.y = t.y - .5 * this.height;
}));
r.getset(o, "origin", (function() {
return new cc.Vec2(this.x, this.y);
}), (function(t) {
this.x = t.x;
this.y = t.y;
}));
r.getset(o, "size", (function() {
return new cc.Size(this.width, this.height);
}), (function(t) {
this.width = t.width;
this.height = t.height;
}));
cc.Rect = s;
cc.rect = function(t, e, i, n) {
return new s(t, e, i, n);
};
e.exports = cc.Rect;
}), {
"../platform/CCClass": 110,
"../platform/js": 130,
"./value-type": 207
} ],
206: [ (function(t, e, i) {
"use strict";
var n = t("./value-type"), r = t("../platform/js");
function s(t, e) {
if (t && "object" == typeof t) {
e = t.height;
t = t.width;
}
this.width = t || 0;
this.height = e || 0;
}
r.extend(s, n);
t("../platform/CCClass").fastDefine("cc.Size", s, {
width: 0,
height: 0
});
r.get(s, "ZERO", (function() {
return new s(0, 0);
}));
var o = s.prototype;
o.clone = function() {
return new s(this.width, this.height);
};
o.equals = function(t) {
return t && this.width === t.width && this.height === t.height;
};
o.lerp = function(t, e, i) {
i = i || new s();
var n = this.width, r = this.height;
i.width = n + (t.width - n) * e;
i.height = r + (t.height - r) * e;
return i;
};
o.set = function(t) {
this.width = t.width;
this.height = t.height;
};
o.toString = function() {
return "(" + this.width.toFixed(2) + ", " + this.height.toFixed(2) + ")";
};
cc.size = function(t, e) {
return new s(t, e);
};
cc.Size = e.exports = s;
}), {
"../platform/CCClass": 110,
"../platform/js": 130,
"./value-type": 207
} ],
207: [ (function(t, e, i) {
"use strict";
var n = t("../platform/js");
function r() {}
n.setClassName("cc.ValueType", r);
var s = r.prototype;
0;
s.toString = function() {
return "" + {};
};
cc.ValueType = e.exports = r;
}), {
"../platform/js": 130
} ],
208: [ (function(t, e, i) {
"use strict";
var n = t("../vmath"), r = t("./value-type"), s = t("../platform/js"), o = t("../platform/CCClass"), a = t("../utils/misc");
function c(t, e) {
if (t && "object" == typeof t) {
e = t.y;
t = t.x;
}
this.x = t || 0;
this.y = e || 0;
}
s.extend(c, r);
o.fastDefine("cc.Vec2", c, {
x: 0,
y: 0
});
var l = c.prototype;
s.value(l, "z", 0, !0);
l.clone = function() {
return new c(this.x, this.y);
};
l.set = function(t) {
this.x = t.x;
this.y = t.y;
return this;
};
l.equals = function(t) {
return t && this.x === t.x && this.y === t.y;
};
l.fuzzyEquals = function(t, e) {
return this.x - e <= t.x && t.x <= this.x + e && this.y - e <= t.y && t.y <= this.y + e;
};
l.toString = function() {
return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")";
};
l.lerp = function(t, e, i) {
i = i || new c();
var n = this.x, r = this.y;
i.x = n + (t.x - n) * e;
i.y = r + (t.y - r) * e;
return i;
};
l.clampf = function(t, e) {
this.x = a.clampf(this.x, t.x, e.x);
this.y = a.clampf(this.y, t.y, e.y);
return this;
};
l.addSelf = function(t) {
this.x += t.x;
this.y += t.y;
return this;
};
l.add = function(t, e) {
(e = e || new c()).x = this.x + t.x;
e.y = this.y + t.y;
return e;
};
l.subSelf = function(t) {
this.x -= t.x;
this.y -= t.y;
return this;
};
l.sub = function(t, e) {
(e = e || new c()).x = this.x - t.x;
e.y = this.y - t.y;
return e;
};
l.mulSelf = function(t) {
this.x *= t;
this.y *= t;
return this;
};
l.mul = function(t, e) {
(e = e || new c()).x = this.x * t;
e.y = this.y * t;
return e;
};
l.scaleSelf = function(t) {
this.x *= t.x;
this.y *= t.y;
return this;
};
l.scale = function(t, e) {
(e = e || new c()).x = this.x * t.x;
e.y = this.y * t.y;
return e;
};
l.divSelf = function(t) {
this.x /= t;
this.y /= t;
return this;
};
l.div = function(t, e) {
(e = e || new c()).x = this.x / t;
e.y = this.y / t;
return e;
};
l.negSelf = function() {
this.x = -this.x;
this.y = -this.y;
return this;
};
l.neg = function(t) {
(t = t || new c()).x = -this.x;
t.y = -this.y;
return t;
};
l.dot = function(t) {
return this.x * t.x + this.y * t.y;
};
l.cross = function(t) {
return this.x * t.y - this.y * t.x;
};
l.mag = function() {
return Math.sqrt(this.x * this.x + this.y * this.y);
};
l.magSqr = function() {
return this.x * this.x + this.y * this.y;
};
l.normalizeSelf = function() {
var t = this.x * this.x + this.y * this.y;
if (1 === t) return this;
if (0 === t) return this;
var e = 1 / Math.sqrt(t);
this.x *= e;
this.y *= e;
return this;
};
l.normalize = function(t) {
(t = t || new c()).x = this.x;
t.y = this.y;
t.normalizeSelf();
return t;
};
l.angle = function(t) {
var e = this.magSqr(), i = t.magSqr();
if (0 === e || 0 === i) {
console.warn("Can't get angle between zero vector");
return 0;
}
var n = this.dot(t) / Math.sqrt(e * i);
n = a.clampf(n, -1, 1);
return Math.acos(n);
};
l.signAngle = function(t) {
var e = this.angle(t);
return this.cross(t) < 0 ? -e : e;
};
l.rotate = function(t, e) {
(e = e || new c()).x = this.x;
e.y = this.y;
return e.rotateSelf(t);
};
l.rotateSelf = function(t) {
var e = Math.sin(t), i = Math.cos(t), n = this.x;
this.x = i * n - e * this.y;
this.y = e * n + i * this.y;
return this;
};
l.project = function(t) {
return t.mul(this.dot(t) / t.dot(t));
};
l.transformMat4 = function(t, e) {
e = e || new c();
n.vec2.transformMat4(e, this, t);
};
l.fromTranslation = function(t) {
this.x = t[0];
this.y = t[1];
return this;
};
l.toTranslation = function(t) {
t[0] = this.x;
t[1] = this.y;
};
l.fromScale = function(t) {
this.x = t[7];
this.y = t[8];
return this;
};
l.toScale = function(t) {
t[7] = this.x;
t[8] = this.y;
};
l.array = function(t) {
n.vec2.array(t, this);
};
s.get(c, "ONE", (function() {
return new c(1, 1);
}));
s.get(c, "ZERO", (function() {
return new c(0, 0);
}));
s.get(c, "UP", (function() {
return new c(0, 1);
}));
s.get(c, "RIGHT", (function() {
return new c(1, 0);
}));
cc.Vec2 = c;
cc.v2 = function(t, e) {
return new c(t, e);
};
cc.p = cc.v2;
e.exports = cc.Vec2;
}), {
"../platform/CCClass": 110,
"../platform/js": 130,
"../utils/misc": 187,
"../vmath": 213,
"./value-type": 207
} ],
209: [ (function(t, e, i) {
"use strict";
var n = t("../vmath"), r = t("./value-type"), s = t("../platform/js"), o = t("../platform/CCClass"), a = t("../utils/misc"), c = t("./vec2").prototype;
function l(t, e, i) {
if (t && "object" == typeof t) {
i = t.z;
e = t.y;
t = t.x;
}
this.x = t || 0;
this.y = e || 0;
this.z = i || 0;
}
s.extend(l, r);
o.fastDefine("cc.Vec3", l, {
x: 0,
y: 0,
z: 0
});
var u = l.prototype;
u.clone = function() {
return new l(this.x, this.y, this.z);
};
u.set = function(t) {
this.x = t.x;
this.y = t.y;
this.z = t.z;
return this;
};
u.equals = function(t) {
return t && this.x === t.x && this.y === t.y && this.z === t.z;
};
u.fuzzyEquals = function(t, e) {
return this.x - e <= t.x && t.x <= this.x + e && this.y - e <= t.y && t.y <= this.y + e && this.z - e <= t.z && t.z <= this.z + e;
};
u.toString = function() {
return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ")";
};
u.lerp = function(t, e, i) {
i = i || new l();
n.vec3.lerp(i, this, t, e);
return i;
};
u.clampf = function(t, e) {
this.x = a.clampf(this.x, t.x, e.x);
this.y = a.clampf(this.y, t.y, e.y);
this.z = a.clampf(this.z, t.z, e.z);
return this;
};
u.addSelf = function(t) {
this.x += t.x;
this.y += t.y;
this.z += t.z;
return this;
};
u.add = function(t, e) {
(e = e || new l()).x = this.x + t.x;
e.y = this.y + t.y;
e.z = this.z + t.z;
return e;
};
u.subSelf = function(t) {
this.x -= t.x;
this.y -= t.y;
this.z -= t.z;
return this;
};
u.sub = function(t, e) {
(e = e || new l()).x = this.x - t.x;
e.y = this.y - t.y;
e.z = this.z - t.z;
return e;
};
u.mulSelf = function(t) {
this.x *= t;
this.y *= t;
this.z *= t;
return this;
};
u.mul = function(t, e) {
(e = e || new l()).x = this.x * t;
e.y = this.y * t;
e.z = this.z * t;
return e;
};
u.scaleSelf = function(t) {
this.x *= t.x;
this.y *= t.y;
this.z *= t.z;
return this;
};
u.scale = function(t, e) {
(e = e || new l()).x = this.x * t.x;
e.y = this.y * t.y;
e.z = this.z * t.z;
return e;
};
u.divSelf = function(t) {
this.x /= t;
this.y /= t;
this.z /= t;
return this;
};
u.div = function(t, e) {
(e = e || new l()).x = this.x / t;
e.y = this.y / t;
e.z = this.z / t;
return e;
};
u.negSelf = function() {
this.x = -this.x;
this.y = -this.y;
this.z = -this.z;
return this;
};
u.neg = function(t) {
(t = t || new l()).x = -this.x;
t.y = -this.y;
t.z = -this.z;
return t;
};
u.dot = function(t) {
return this.x * t.x + this.y * t.y + this.z * t.z;
};
u.cross = function(t, e) {
e = e || new l();
n.vec3.cross(e, this, t);
return e;
};
u.mag = function() {
return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
};
u.magSqr = function() {
return this.x * this.x + this.y * this.y + this.z * this.z;
};
u.normalizeSelf = function() {
n.vec3.normalize(this, this);
return this;
};
u.normalize = function(t) {
t = t || new l();
n.vec3.normalize(t, this);
return t;
};
u.transformMat4 = function(t, e) {
e = e || new l();
n.vec3.transformMat4(e, this, t);
};
u.angle = c.angle;
u.project = c.project;
u.signAngle = function(t) {
cc.warnID(1408, "vec3.signAngle", "v2.1", "cc.v2(selfVector).signAngle(vector)");
var e = new cc.Vec2(this.x, this.y), i = new cc.Vec2(t.x, t.y);
return e.signAngle(i);
};
u.rotate = function(t, e) {
cc.warnID(1408, "vec3.rotate", "v2.1", "cc.v2(selfVector).rotate(radians, out)");
return c.rotate.call(this, t, e);
};
u.rotateSelf = function(t) {
cc.warnID(1408, "vec3.rotateSelf", "v2.1", "cc.v2(selfVector).rotateSelf(radians)");
return c.rotateSelf.call(this, t);
};
u.array = function(t) {
n.vec3.array(t, this);
};
s.get(l, "ONE", (function() {
return new l(1, 1, 1);
}));
s.get(l, "ZERO", (function() {
return new l(0, 0, 0);
}));
s.get(l, "UP", (function() {
return new l(0, 1, 0);
}));
s.get(l, "RIGHT", (function() {
return new l(1, 0, 0);
}));
s.get(l, "FRONT", (function() {
return new l(0, 0, 1);
}));
cc.v3 = function(t, e, i) {
return new l(t, e, i);
};
e.exports = cc.Vec3 = l;
}), {
"../platform/CCClass": 110,
"../platform/js": 130,
"../utils/misc": 187,
"../vmath": 213,
"./value-type": 207,
"./vec2": 208
} ],
210: [ (function(t, e, i) {
"use strict";
var n = a(t("./value-type")), r = a(t("../platform/CCClass")), s = t("../vmath"), o = t("../utils/misc");
function a(t) {
return t && t.__esModule ? t : {
default: t
};
}
function c(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function l(t, e) {
if (!t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
return !e || "object" != typeof e && "function" != typeof e ? t : e;
}
function u(t, e) {
if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function, not " + typeof e);
t.prototype = Object.create(e && e.prototype, {
constructor: {
value: t,
enumerable: !1,
writable: !0,
configurable: !0
}
});
e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var h = (function(t) {
u(e, t);
function e(i, n, r, s) {
c(this, e);
var o = l(this, t.call(this));
if (i && "object" == typeof i) {
s = i.w;
r = i.z;
n = i.y;
i = i.x;
}
o.x = i || 0;
o.y = n || 0;
o.z = r || 0;
o.w = s || 0;
return o;
}
e.prototype.clone = function() {
return new e(this.x, this.y, this.z, this.w);
};
e.prototype.set = function(t) {
this.x = t.x;
this.y = t.y;
this.z = t.z;
this.w = t.w;
return this;
};
e.prototype.equals = function(t) {
return t && this.x === t.x && this.y === t.y && this.z === t.z && this.w === t.w;
};
e.prototype.fuzzyEquals = function(t, e) {
return this.x - e <= t.x && t.x <= this.x + e && this.y - e <= t.y && t.y <= this.y + e && this.z - e <= t.z && t.z <= this.z + e && this.w - e <= t.w && t.w <= this.w + e;
};
e.prototype.toString = function() {
return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.z.toFixed(2) + ", " + this.w.toFixed(2) + ")";
};
e.prototype.lerp = function(t, i, n) {
n = n || new e();
s.vec4.lerp(n, this, t, i);
return n;
};
e.prototype.clampf = function(t, e) {
this.x = (0, o.clampf)(this.x, t.x, e.x);
this.y = (0, o.clampf)(this.y, t.y, e.y);
this.z = (0, o.clampf)(this.z, t.z, e.z);
this.w = (0, o.clampf)(this.w, t.w, e.w);
return this;
};
e.prototype.addSelf = function(t) {
this.x += t.x;
this.y += t.y;
this.z += t.z;
this.w += t.w;
return this;
};
e.prototype.add = function(t, i) {
(i = i || new e()).x = this.x + t.x;
i.y = this.y + t.y;
i.z = this.z + t.z;
i.w = this.w + t.w;
return i;
};
e.prototype.subSelf = function(t) {
this.x -= t.x;
this.y -= t.y;
this.z -= t.z;
this.w -= t.w;
return this;
};
e.prototype.sub = function(t, i) {
(i = i || new e()).x = this.x - t.x;
i.y = this.y - t.y;
i.z = this.z - t.z;
i.w = this.w - t.w;
return i;
};
e.prototype.mulSelf = function(t) {
this.x *= t;
this.y *= t;
this.z *= t;
this.w *= t;
return this;
};
e.prototype.mul = function(t, i) {
(i = i || new e()).x = this.x * t;
i.y = this.y * t;
i.z = this.z * t;
i.w = this.w * t;
return i;
};
e.prototype.scaleSelf = function(t) {
this.x *= t.x;
this.y *= t.y;
this.z *= t.z;
this.w *= t.w;
return this;
};
e.prototype.scale = function(t, i) {
(i = i || new e()).x = this.x * t.x;
i.y = this.y * t.y;
i.z = this.z * t.z;
i.w = this.w * t.w;
return i;
};
e.prototype.divSelf = function(t) {
this.x /= t;
this.y /= t;
this.z /= t;
this.w /= t;
return this;
};
e.prototype.div = function(t, i) {
(i = i || new e()).x = this.x / t;
i.y = this.y / t;
i.z = this.z / t;
i.w = this.w / t;
return i;
};
e.prototype.negSelf = function() {
this.x = -this.x;
this.y = -this.y;
this.z = -this.z;
this.w = -this.w;
return this;
};
e.prototype.neg = function(t) {
(t = t || new e()).x = -this.x;
t.y = -this.y;
t.z = -this.z;
t.w = -this.w;
return t;
};
e.prototype.dot = function(t) {
return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w;
};
e.prototype.cross = function(t, i) {
i = i || new e();
s.vec4.cross(i, this, t);
return i;
};
e.prototype.mag = function() {
var t = this.x, e = this.y, i = this.z, n = this.w;
return Math.sqrt(t * t + e * e + i * i + n * n);
};
e.prototype.magSqr = function() {
var t = this.x, e = this.y, i = this.z, n = this.w;
return t * t + e * e + i * i + n * n;
};
e.prototype.normalizeSelf = function() {
s.vec4.normalize(this, this);
return this;
};
e.prototype.normalize = function(t) {
t = t || new e();
s.vec4.normalize(t, this);
return t;
};
e.prototype.transformMat4 = function(t, i) {
i = i || new e();
s.vec4.transformMat4(i, this, t);
return i;
};
e.prototype.array = function(t) {
s.vec4.array(t, this);
};
return e;
})(n.default);
r.default.fastDefine("cc.Vec4", h, {
x: 0,
y: 0,
z: 0,
w: 0
});
cc.v4 = function(t, e, i, n) {
return new h(t, e, i, n);
};
e.exports = cc.Vec4 = h;
}), {
"../platform/CCClass": 110,
"../utils/misc": 187,
"../vmath": 213,
"./value-type": 207
} ],
211: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
r(this, t);
this.r = e;
this.g = i;
this.b = n;
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1);
};
t.clone = function(e) {
return new t(e.r, e.g, e.b);
};
t.copy = function(t, e) {
t.r = e.r;
t.g = e.g;
t.b = e.b;
return t;
};
t.set = function(t, e, i, n) {
t.r = e;
t.g = i;
t.b = n;
return t;
};
t.fromHex = function(t, e) {
var i = (e >> 16) / 255, n = (e >> 8 & 255) / 255, r = (255 & e) / 255;
t.r = i;
t.g = n;
t.b = r;
return t;
};
t.add = function(t, e, i) {
t.r = e.r + i.r;
t.g = e.g + i.g;
t.b = e.b + i.b;
return t;
};
t.subtract = function(t, e, i) {
t.r = e.r - i.r;
t.g = e.g - i.g;
t.b = e.b - i.b;
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiply = function(t, e, i) {
t.r = e.r * i.r;
t.g = e.g * i.g;
t.b = e.b * i.b;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.divide = function(t, e, i) {
t.r = e.r / i.r;
t.g = e.g / i.g;
t.b = e.b / i.b;
return t;
};
t.div = function(e, i, n) {
return t.divide(e, i, n);
};
t.scale = function(t, e, i) {
t.r = e.r * i;
t.g = e.g * i;
t.b = e.b * i;
return t;
};
t.lerp = function(t, e, i, n) {
var r = e.r, s = e.g, o = e.b;
t.r = r + n * (i.r - r);
t.g = s + n * (i.g - s);
t.b = o + n * (i.b - o);
return t;
};
t.str = function(t) {
return "color3(" + t.r + ", " + t.g + ", " + t.b + ")";
};
t.array = function(t, e) {
var i = e instanceof cc.Color ? 1 / 255 : 1;
t[0] = e.r * i;
t[1] = e.g * i;
t[2] = e.b * i;
return t;
};
t.exactEquals = function(t, e) {
return t.r === e.r && t.g === e.g && t.b === e.b;
};
t.equals = function(t, e) {
var i = t.r, r = t.g, s = t.b, o = e.r, a = e.g, c = e.b;
return Math.abs(i - o) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(r - a) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(a)) && Math.abs(s - c) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(c));
};
t.hex = function(t) {
return 255 * t.r << 16 | 255 * t.g << 8 | 255 * t.b;
};
return t;
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
212: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, s = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
r(this, t);
this.r = e;
this.g = i;
this.b = n;
this.a = s;
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1);
};
t.clone = function(e) {
return new t(e.r, e.g, e.b, e.a);
};
t.copy = function(t, e) {
t.r = e.r;
t.g = e.g;
t.b = e.b;
t.a = e.a;
return t;
};
t.set = function(t, e, i, n, r) {
t.r = e;
t.g = i;
t.b = n;
t.a = r;
return t;
};
t.fromHex = function(t, e) {
var i = (e >> 24) / 255, n = (e >> 16 & 255) / 255, r = (e >> 8 & 255) / 255, s = (255 & e) / 255;
t.r = i;
t.g = n;
t.b = r;
t.a = s;
return t;
};
t.add = function(t, e, i) {
t.r = e.r + i.r;
t.g = e.g + i.g;
t.b = e.b + i.b;
t.a = e.a + i.a;
return t;
};
t.subtract = function(t, e, i) {
t.r = e.r - i.r;
t.g = e.g - i.g;
t.b = e.b - i.b;
t.a = e.a - i.a;
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiply = function(t, e, i) {
t.r = e.r * i.r;
t.g = e.g * i.g;
t.b = e.b * i.b;
t.a = e.a * i.a;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.divide = function(t, e, i) {
t.r = e.r / i.r;
t.g = e.g / i.g;
t.b = e.b / i.b;
t.a = e.a / i.a;
return t;
};
t.div = function(e, i, n) {
return t.divide(e, i, n);
};
t.scale = function(t, e, i) {
t.r = e.r * i;
t.g = e.g * i;
t.b = e.b * i;
t.a = e.a * i;
return t;
};
t.lerp = function(t, e, i, n) {
var r = e.r, s = e.g, o = e.b, a = e.a;
t.r = r + n * (i.r - r);
t.g = s + n * (i.g - s);
t.b = o + n * (i.b - o);
t.a = a + n * (i.a - a);
return t;
};
t.str = function(t) {
return "color4(" + t.r + ", " + t.g + ", " + t.b + ", " + t.a + ")";
};
t.array = function(t, e) {
var i = e instanceof cc.Color || e.a > 1 ? 1 / 255 : 1;
t[0] = e.r * i;
t[1] = e.g * i;
t[2] = e.b * i;
t[3] = e.a * i;
return t;
};
t.exactEquals = function(t, e) {
return t.r === e.r && t.g === e.g && t.b === e.b && t.a === e.a;
};
t.equals = function(t, e) {
var i = t.r, r = t.g, s = t.b, o = t.a, a = e.r, c = e.g, l = e.b, u = e.a;
return Math.abs(i - a) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(r - c) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(c)) && Math.abs(s - l) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(l)) && Math.abs(o - u) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(u));
};
t.hex = function(t) {
return (255 * t.r << 24 | 255 * t.g << 16 | 255 * t.b << 8 | 255 * t.a) >>> 0;
};
return t;
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
213: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.color4 = i.color3 = i.mat4 = i.mat3 = i.mat23 = i.mat2 = i.trs = i.quat = i.vec4 = i.vec3 = i.vec2 = void 0;
var n = t("./utils");
Object.keys(n).forEach((function(t) {
"default" !== t && "__esModule" !== t && Object.defineProperty(i, t, {
enumerable: !0,
get: function() {
return n[t];
}
});
}));
var r = p(t("./vec2")), s = p(t("./vec3")), o = p(t("./vec4")), a = p(t("./quat")), c = p(t("./trs")), l = p(t("./mat2")), u = p(t("./mat23")), h = p(t("./mat3")), f = p(t("./mat4")), d = p(t("./color3")), _ = p(t("./color4"));
function p(t) {
return t && t.__esModule ? t : {
default: t
};
}
i.vec2 = r.default;
i.vec3 = s.default;
i.vec4 = o.default;
i.quat = a.default;
i.trs = c.default;
i.mat2 = l.default;
i.mat23 = u.default;
i.mat3 = h.default;
i.mat4 = f.default;
i.color3 = d.default;
i.color4 = _.default;
i.default = {
vec2: r.default,
vec3: s.default,
vec4: o.default,
quat: a.default,
trs: c.default,
mat2: l.default,
mat23: u.default,
mat3: h.default,
mat4: f.default,
color3: d.default,
color4: _.default
};
}), {
"./color3": 211,
"./color4": 212,
"./mat2": 214,
"./mat23": 215,
"./mat3": 216,
"./mat4": 217,
"./quat": 218,
"./trs": 219,
"./utils": 220,
"./vec2": 221,
"./vec3": 222,
"./vec4": 223
} ],
214: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
r(this, t);
if ("object" == typeof e) if (i) {
this.m = new e.constructor(4);
this.m.set(e);
} else this.m = e; else {
this.m = new n.FLOAT_ARRAY_TYPE(4);
var a = this.m;
a[0] = e;
a[1] = i;
a[2] = s;
a[3] = o;
}
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1);
};
t.clone = function(e) {
var i = e.m;
return new t(i[0], i[1], i[2], i[3]);
};
t.copy = function(t, e) {
t.m.set(e.m);
return t;
};
t.identity = function(t) {
var e = t.m;
e[0] = 1;
e[1] = 0;
e[2] = 0;
e[3] = 1;
return t;
};
t.set = function(t, e, i, n, r) {
var s = t.m;
s[0] = e;
s[1] = i;
s[2] = n;
s[3] = r;
return t;
};
t.transpose = function(t, e) {
var i = t.m, n = e.m;
if (t === e) {
var r = n[1];
i[1] = n[2];
i[2] = r;
} else {
i[0] = n[0];
i[1] = n[2];
i[2] = n[1];
i[3] = n[3];
}
return t;
};
t.invert = function(t, e) {
var i = e.m, n = t.m, r = i[0], s = i[1], o = i[2], a = i[3], c = r * a - o * s;
if (!c) return null;
c = 1 / c;
n[0] = a * c;
n[1] = -s * c;
n[2] = -o * c;
n[3] = r * c;
return t;
};
t.adjoint = function(t, e) {
var i = t.m, n = e.m, r = n[0];
i[0] = n[3];
i[1] = -n[1];
i[2] = -n[2];
i[3] = r;
return t;
};
t.determinant = function(t) {
var e = t.m;
return e[0] * e[3] - e[2] * e[1];
};
t.multiply = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = bm[0], u = bm[1], h = bm[2], f = bm[3];
r[0] = s * l + a * u;
r[1] = o * l + c * u;
r[2] = s * h + a * f;
r[3] = o * h + c * f;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.rotate = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = Math.sin(i), u = Math.cos(i);
r[0] = s * u + a * l;
r[1] = o * u + c * l;
r[2] = s * -l + a * u;
r[3] = o * -l + c * u;
return t;
};
t.scale = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = i.x, u = i.y;
r[0] = s * l;
r[1] = o * l;
r[2] = a * u;
r[3] = c * u;
return t;
};
t.fromRotation = function(t, e) {
var i = t.m, n = Math.sin(e), r = Math.cos(e);
i[0] = r;
i[1] = n;
i[2] = -n;
i[3] = r;
return t;
};
t.fromScaling = function(t, e) {
var i = t.m;
i[0] = e.x;
i[1] = 0;
i[2] = 0;
i[3] = e.y;
return t;
};
t.str = function(t) {
var e = t.m;
return "mat2(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
};
t.array = function(t, e) {
var i = e.m;
t[0] = i[0];
t[1] = i[1];
t[2] = i[2];
t[3] = i[3];
return t;
};
t.frob = function(t) {
var e = t.m;
return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2));
};
t.LDU = function(t, e, i, n) {
var r = t.m, s = i.m, o = n.m;
r[2] = o[2] / o[0];
s[0] = o[0];
s[1] = o[1];
s[3] = o[3] - r[2] * s[1];
};
t.add = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] + r[0];
s[1] = n[1] + r[1];
s[2] = n[2] + r[2];
s[3] = n[3] + r[3];
return t;
};
t.subtract = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] - r[0];
s[1] = n[1] - r[1];
s[2] = n[2] - r[2];
s[3] = n[3] - r[3];
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.exactEquals = function(t, e) {
var i = t.m, n = e.m;
return i[0] === n[0] && i[1] === n[1] && i[2] === n[2] && i[3] === n[3];
};
t.equals = function(t, e) {
var i = t.m, r = e.m, s = i[0], o = i[1], a = i[2], c = i[3], l = r[0], u = r[1], h = r[2], f = r[3];
return Math.abs(s - l) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(l)) && Math.abs(o - u) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(u)) && Math.abs(a - h) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(h)) && Math.abs(c - f) <= n.EPSILON * Math.max(1, Math.abs(c), Math.abs(f));
};
t.multiplyScalar = function(t, e, i) {
var n = e.m, r = t.m;
r[0] = n[0] * i;
r[1] = n[1] * i;
r[2] = n[2] * i;
r[3] = n[3] * i;
return t;
};
t.multiplyScalarAndAdd = function(t, e, i, n) {
var r = e.m, s = i.m, o = t.m;
o[0] = r[0] + s[0] * n;
o[1] = r[1] + s[1] * n;
o[2] = r[2] + s[2] * n;
o[3] = r[3] + s[3] * n;
return t;
};
return t;
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
215: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, c = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0;
r(this, t);
if ("object" == typeof e) if (i) {
this.m = new e.constructor(6);
this.m.set(e);
} else this.m = e; else {
this.m = new n.FLOAT_ARRAY_TYPE(6);
var l = this.m;
l[0] = e;
l[1] = i;
l[2] = s;
l[3] = o;
l[4] = a;
l[5] = c;
}
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1, arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0);
};
t.clone = function(e) {
var i = e.m;
return new t(i[0], i[1], i[2], i[3], i[4], i[5]);
};
t.copy = function(t, e) {
t.m.set(e.m);
return t;
};
t.identity = function(t) {
var e = t.m;
e[0] = 1;
e[1] = 0;
e[2] = 0;
e[3] = 1;
e[4] = 0;
e[5] = 0;
return t;
};
t.set = function(t, e, i, n, r, s, o) {
var a = t.m;
a[0] = e;
a[1] = i;
a[2] = n;
a[3] = r;
a[4] = s;
a[5] = o;
return t;
};
t.invert = function(t, e) {
var i = e.m, n = t.m, r = i[0], s = i[1], o = i[2], a = i[3], c = i[4], l = i[5], u = r * a - s * o;
if (!u) return null;
u = 1 / u;
n[0] = a * u;
n[1] = -s * u;
n[2] = -o * u;
n[3] = r * u;
n[4] = (o * l - a * c) * u;
n[5] = (s * c - r * l) * u;
return t;
};
t.determinant = function(t) {
var e = t.m;
return e[0] * e[3] - e[1] * e[2];
};
t.multiply = function(t, e, i) {
var n = e.m, r = i.m, s = t.m, o = n[0], a = n[1], c = n[2], l = n[3], u = n[4], h = n[5], f = r[0], d = r[1], _ = r[2], p = r[3], v = r[4], g = r[5];
s[0] = o * f + c * d;
s[1] = a * f + l * d;
s[2] = o * _ + c * p;
s[3] = a * _ + l * p;
s[4] = o * v + c * g + u;
s[5] = a * v + l * g + h;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.rotate = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = n[4], u = n[5], h = Math.sin(i), f = Math.cos(i);
r[0] = s * f + a * h;
r[1] = o * f + c * h;
r[2] = s * -h + a * f;
r[3] = o * -h + c * f;
r[4] = l;
r[5] = u;
return t;
};
t.scale = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = n[4], u = n[5], h = i.x, f = i.y;
r[0] = s * h;
r[1] = o * h;
r[2] = a * f;
r[3] = c * f;
r[4] = l;
r[5] = u;
return t;
};
t.translate = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = n[4], u = n[5], h = i.x, f = i.y;
r[0] = s;
r[1] = o;
r[2] = a;
r[3] = c;
r[4] = s * h + a * f + l;
r[5] = o * h + c * f + u;
return t;
};
t.fromRotation = function(t, e) {
var i = t.m, n = Math.sin(e), r = Math.cos(e);
i[0] = r;
i[1] = n;
i[2] = -n;
i[3] = r;
i[4] = 0;
i[5] = 0;
return t;
};
t.fromScaling = function(t, e) {
var i = e.m, n = t.m;
n[0] = i[0];
n[1] = 0;
n[2] = 0;
n[3] = i[1];
n[4] = 0;
n[5] = 0;
return t;
};
t.fromTranslation = function(t, e) {
var i = t.m;
i[0] = 1;
i[1] = 0;
i[2] = 0;
i[3] = 1;
i[4] = e.x;
i[5] = e.y;
return t;
};
t.fromRTS = function(t, e, i, n) {
var r = t.m, s = Math.sin(e), o = Math.cos(e);
r[0] = o * n.x;
r[1] = s * n.x;
r[2] = -s * n.y;
r[3] = o * n.y;
r[4] = i.x;
r[5] = i.y;
return t;
};
t.str = function(t) {
var e = t.m;
return "mat23(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ")";
};
t.array = function(t, e) {
var i = e.m;
t[0] = i[0];
t[1] = i[1];
t[2] = i[2];
t[3] = i[3];
t[4] = i[4];
t[5] = i[5];
return t;
};
t.array4x4 = function(t, e) {
var i = e.m;
t[0] = i[0];
t[1] = i[1];
t[2] = 0;
t[3] = 0;
t[4] = i[2];
t[5] = i[3];
t[6] = 0;
t[7] = 0;
t[8] = 0;
t[9] = 0;
t[10] = 1;
t[11] = 0;
t[12] = i[4];
t[13] = i[5];
t[14] = 0;
t[15] = 1;
return t;
};
t.frob = function(t) {
var e = t.m;
return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + 1);
};
t.add = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] + r[0];
s[1] = n[1] + r[1];
s[2] = n[2] + r[2];
s[3] = n[3] + r[3];
s[4] = n[4] + r[4];
s[5] = n[5] + r[5];
return t;
};
t.subtract = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] - r[0];
s[1] = n[1] - r[1];
s[2] = n[2] - r[2];
s[3] = n[3] - r[3];
s[4] = n[4] - r[4];
s[5] = n[5] - r[5];
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiplyScalar = function(t, e, i) {
var n = e.m, r = t.m;
r[0] = n[0] * i;
r[1] = n[1] * i;
r[2] = n[2] * i;
r[3] = n[3] * i;
r[4] = n[4] * i;
r[5] = n[5] * i;
return t;
};
t.multiplyScalarAndAdd = function(t, e, i, n) {
var r = e.m, s = i.m, o = t.m;
o[0] = r[0] + s[0] * n;
o[1] = r[1] + s[1] * n;
o[2] = r[2] + s[2] * n;
o[3] = r[3] + s[3] * n;
o[4] = r[4] + s[4] * n;
o[5] = r[5] + s[5] * n;
return t;
};
t.exactEquals = function(t, e) {
var i = t.m, n = e.m;
return i[0] === n[0] && i[1] === n[1] && i[2] === n[2] && i[3] === n[3] && i[4] === n[4] && i[5] === n[5];
};
t.equals = function(t, e) {
var i = t.m, r = e.m, s = i[0], o = i[1], a = i[2], c = i[3], l = i[4], u = i[5], h = r[0], f = r[1], d = r[2], _ = r[3], p = r[4], v = r[5];
return Math.abs(s - h) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(h)) && Math.abs(o - f) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(f)) && Math.abs(a - d) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(d)) && Math.abs(c - _) <= n.EPSILON * Math.max(1, Math.abs(c), Math.abs(_)) && Math.abs(l - p) <= n.EPSILON * Math.max(1, Math.abs(l), Math.abs(p)) && Math.abs(u - v) <= n.EPSILON * Math.max(1, Math.abs(u), Math.abs(v));
};
return t;
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
216: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils"), r = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("./vec3"));
function s(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var o = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0, a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1, c = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0, l = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 0, u = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 0, h = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 1;
s(this, t);
if ("object" == typeof e) if (i) {
this.m = new e.constructor(9);
this.m.set(e);
} else this.m = e; else {
this.m = new n.FLOAT_ARRAY_TYPE(9);
var f = this.m;
f[0] = e;
f[1] = i;
f[2] = r;
f[3] = o;
f[4] = a;
f[5] = c;
f[6] = l;
f[7] = u;
f[8] = h;
}
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0, arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1, arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 0, arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 0, arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 0, arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 1);
};
t.clone = function(e) {
var i = e.m;
return new t(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
};
t.copy = function(t, e) {
t.m.set(e.m);
return t;
};
t.set = function(t, e, i, n, r, s, o, a, c, l) {
var u = t.m;
u[0] = e;
u[1] = i;
u[2] = n;
u[3] = r;
u[4] = s;
u[5] = o;
u[6] = a;
u[7] = c;
u[8] = l;
return t;
};
t.identity = function(t) {
var e = t.m;
e[0] = 1;
e[1] = 0;
e[2] = 0;
e[3] = 0;
e[4] = 1;
e[5] = 0;
e[6] = 0;
e[7] = 0;
e[8] = 1;
return t;
};
t.transpose = function(t, e) {
var i = e.m, n = t.m;
if (t === e) {
var r = i[1], s = i[2], o = i[5];
n[1] = i[3];
n[2] = i[6];
n[3] = r;
n[5] = i[7];
n[6] = s;
n[7] = o;
} else {
n[0] = i[0];
n[1] = i[3];
n[2] = i[6];
n[3] = i[1];
n[4] = i[4];
n[5] = i[7];
n[6] = i[2];
n[7] = i[5];
n[8] = i[8];
}
return t;
};
t.invert = function(t, e) {
var i = e.m, n = t.m, r = i[0], s = i[1], o = i[2], a = i[3], c = i[4], l = i[5], u = i[6], h = i[7], f = i[8], d = f * c - l * h, _ = -f * a + l * u, p = h * a - c * u, v = r * d + s * _ + o * p;
if (!v) return null;
v = 1 / v;
n[0] = d * v;
n[1] = (-f * s + o * h) * v;
n[2] = (l * s - o * c) * v;
n[3] = _ * v;
n[4] = (f * r - o * u) * v;
n[5] = (-l * r + o * a) * v;
n[6] = p * v;
n[7] = (-h * r + s * u) * v;
n[8] = (c * r - s * a) * v;
return t;
};
t.adjoint = function(t, e) {
var i = e.m, n = t.m, r = i[0], s = i[1], o = i[2], a = i[3], c = i[4], l = i[5], u = i[6], h = i[7], f = i[8];
n[0] = c * f - l * h;
n[1] = o * h - s * f;
n[2] = s * l - o * c;
n[3] = l * u - a * f;
n[4] = r * f - o * u;
n[5] = o * a - r * l;
n[6] = a * h - c * u;
n[7] = s * u - r * h;
n[8] = r * c - s * a;
return t;
};
t.determinant = function(t) {
var e = t.m, i = e[0], n = e[1], r = e[2], s = e[3], o = e[4], a = e[5], c = e[6], l = e[7], u = e[8];
return i * (u * o - a * l) + n * (-u * s + a * c) + r * (l * s - o * c);
};
t.multiply = function(t, e, i) {
var n = e.m, r = i.m, s = t.m, o = n[0], a = n[1], c = n[2], l = n[3], u = n[4], h = n[5], f = n[6], d = n[7], _ = n[8], p = r[0], v = r[1], g = r[2], m = r[3], y = r[4], E = r[5], C = r[6], T = r[7], A = r[8];
s[0] = p * o + v * l + g * f;
s[1] = p * a + v * u + g * d;
s[2] = p * c + v * h + g * _;
s[3] = m * o + y * l + E * f;
s[4] = m * a + y * u + E * d;
s[5] = m * c + y * h + E * _;
s[6] = C * o + T * l + A * f;
s[7] = C * a + T * u + A * d;
s[8] = C * c + T * h + A * _;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.translate = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = n[4], u = n[5], h = n[6], f = n[7], d = n[8], _ = i.x, p = i.y;
r[0] = s;
r[1] = o;
r[2] = a;
r[3] = c;
r[4] = l;
r[5] = u;
r[6] = _ * s + p * c + h;
r[7] = _ * o + p * l + f;
r[8] = _ * a + p * u + d;
return t;
};
t.rotate = function(t, e, i) {
var n = e.m, r = t.m, s = n[0], o = n[1], a = n[2], c = n[3], l = n[4], u = n[5], h = n[6], f = n[7], d = n[8], _ = Math.sin(i), p = Math.cos(i);
r[0] = p * s + _ * c;
r[1] = p * o + _ * l;
r[2] = p * a + _ * u;
r[3] = p * c - _ * s;
r[4] = p * l - _ * o;
r[5] = p * u - _ * a;
r[6] = h;
r[7] = f;
r[8] = d;
return t;
};
t.scale = function(t, e, i) {
var n = i.x, r = i.y, s = e.m, o = t.m;
o[0] = n * s[0];
o[1] = n * s[1];
o[2] = n * s[2];
o[3] = r * s[3];
o[4] = r * s[4];
o[5] = r * s[5];
o[6] = s[6];
o[7] = s[7];
o[8] = s[8];
return t;
};
t.fromMat4 = function(t, e) {
var i = e.m, n = t.m;
n[0] = i[0];
n[1] = i[1];
n[2] = i[2];
n[3] = i[4];
n[4] = i[5];
n[5] = i[6];
n[6] = i[8];
n[7] = i[9];
n[8] = i[10];
return t;
};
t.fromTranslation = function(t, e) {
var i = t.m;
i[0] = 1;
i[1] = 0;
i[2] = 0;
i[3] = 0;
i[4] = 1;
i[5] = 0;
i[6] = e.x;
i[7] = e.y;
i[8] = 1;
return t;
};
t.fromRotation = function(t, e) {
var i = Math.sin(e), n = Math.cos(e), r = t.m;
r[0] = n;
r[1] = i;
r[2] = 0;
r[3] = -i;
r[4] = n;
r[5] = 0;
r[6] = 0;
r[7] = 0;
r[8] = 1;
return t;
};
t.fromScaling = function(t, e) {
var i = t.m;
i[0] = e.x;
i[1] = 0;
i[2] = 0;
i[3] = 0;
i[4] = e.y;
i[5] = 0;
i[6] = 0;
i[7] = 0;
i[8] = 1;
return t;
};
t.fromMat2d = function(t, e) {
var i = e.m, n = t.m;
n[0] = i[0];
n[1] = i[1];
n[2] = 0;
n[3] = i[2];
n[4] = i[3];
n[5] = 0;
n[6] = i[4];
n[7] = i[5];
n[8] = 1;
return t;
};
t.fromQuat = function(t, e) {
var i = t.m, n = e.x, r = e.y, s = e.z, o = e.w, a = n + n, c = r + r, l = s + s, u = n * a, h = r * a, f = r * c, d = s * a, _ = s * c, p = s * l, v = o * a, g = o * c, m = o * l;
i[0] = 1 - f - p;
i[3] = h - m;
i[6] = d + g;
i[1] = h + m;
i[4] = 1 - u - p;
i[7] = _ - v;
i[2] = d - g;
i[5] = _ + v;
i[8] = 1 - u - f;
return t;
};
t.fromViewUp = function(e, i, s) {
return (function() {
var e = r.default.create(0, 1, 0), i = r.default.create(0, 0, 0), s = r.default.create(0, 0, 0);
return function(o, a, c) {
if (r.default.sqrMag(a) < n.EPSILON * n.EPSILON) {
t.identity(o);
return o;
}
c = c || e;
r.default.normalize(i, r.default.cross(i, c, a));
if (r.default.sqrMag(i) < n.EPSILON * n.EPSILON) {
t.identity(o);
return o;
}
r.default.cross(s, a, i);
t.set(o, i.x, i.y, i.z, s.x, s.y, s.z, a.x, a.y, a.z);
return o;
};
})()(e, i, s);
};
t.normalFromMat4 = function(t, e) {
var i = e.m, n = t.m, r = i[0], s = i[1], o = i[2], a = i[3], c = i[4], l = i[5], u = i[6], h = i[7], f = i[8], d = i[9], _ = i[10], p = i[11], v = i[12], g = i[13], m = i[14], y = i[15], E = r * l - s * c, C = r * u - o * c, T = r * h - a * c, A = s * u - o * l, x = s * h - a * l, b = o * h - a * u, S = f * g - d * v, R = f * m - _ * v, w = f * y - p * v, L = d * m - _ * g, O = d * y - p * g, M = _ * y - p * m, I = E * M - C * O + T * L + A * w - x * R + b * S;
if (!I) return null;
I = 1 / I;
n[0] = (l * M - u * O + h * L) * I;
n[1] = (u * w - c * M - h * R) * I;
n[2] = (c * O - l * w + h * S) * I;
n[3] = (o * O - s * M - a * L) * I;
n[4] = (r * M - o * w + a * R) * I;
n[5] = (s * w - r * O - a * S) * I;
n[6] = (g * b - m * x + y * A) * I;
n[7] = (m * T - v * b - y * C) * I;
n[8] = (v * x - g * T + y * E) * I;
return t;
};
t.str = function(t) {
var e = t.m;
return "mat3(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ")";
};
t.array = function(t, e) {
var i = e.m;
t[0] = i[0];
t[1] = i[1];
t[2] = i[2];
t[3] = i[3];
t[4] = i[4];
t[5] = i[5];
t[6] = i[6];
t[7] = i[7];
t[8] = i[8];
return t;
};
t.frob = function(t) {
var e = t.m;
return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2));
};
t.add = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] + r[0];
s[1] = n[1] + r[1];
s[2] = n[2] + r[2];
s[3] = n[3] + r[3];
s[4] = n[4] + r[4];
s[5] = n[5] + r[5];
s[6] = n[6] + r[6];
s[7] = n[7] + r[7];
s[8] = n[8] + r[8];
return t;
};
t.subtract = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] - r[0];
s[1] = n[1] - r[1];
s[2] = n[2] - r[2];
s[3] = n[3] - r[3];
s[4] = n[4] - r[4];
s[5] = n[5] - r[5];
s[6] = n[6] - r[6];
s[7] = n[7] - r[7];
s[8] = n[8] - r[8];
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiplyScalar = function(t, e, i) {
var n = e.m, r = t.m;
r[0] = n[0] * i;
r[1] = n[1] * i;
r[2] = n[2] * i;
r[3] = n[3] * i;
r[4] = n[4] * i;
r[5] = n[5] * i;
r[6] = n[6] * i;
r[7] = n[7] * i;
r[8] = n[8] * i;
return t;
};
t.multiplyScalarAndAdd = function(t, e, i, n) {
var r = e.m, s = i.m, o = t.m;
o[0] = r[0] + s[0] * n;
o[1] = r[1] + s[1] * n;
o[2] = r[2] + s[2] * n;
o[3] = r[3] + s[3] * n;
o[4] = r[4] + s[4] * n;
o[5] = r[5] + s[5] * n;
o[6] = r[6] + s[6] * n;
o[7] = r[7] + s[7] * n;
o[8] = r[8] + s[8] * n;
return t;
};
t.exactEquals = function(t, e) {
var i = t.m, n = e.m;
return i[0] === n[0] && i[1] === n[1] && i[2] === n[2] && i[3] === n[3] && i[4] === n[4] && i[5] === n[5] && i[6] === n[6] && i[7] === n[7] && i[8] === n[8];
};
t.equals = function(t, e) {
var i = t.m, r = e.m, s = i[0], o = i[1], a = i[2], c = i[3], l = i[4], u = i[5], h = i[6], f = i[7], d = i[8], _ = r[0], p = r[1], v = r[2], g = r[3], m = r[4], y = r[5], E = r[6], C = r[7], T = r[8];
return Math.abs(s - _) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(_)) && Math.abs(o - p) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(p)) && Math.abs(a - v) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(v)) && Math.abs(c - g) <= n.EPSILON * Math.max(1, Math.abs(c), Math.abs(g)) && Math.abs(l - m) <= n.EPSILON * Math.max(1, Math.abs(l), Math.abs(m)) && Math.abs(u - y) <= n.EPSILON * Math.max(1, Math.abs(u), Math.abs(y)) && Math.abs(h - E) <= n.EPSILON * Math.max(1, Math.abs(h), Math.abs(E)) && Math.abs(f - C) <= n.EPSILON * Math.max(1, Math.abs(f), Math.abs(C)) && Math.abs(d - T) <= n.EPSILON * Math.max(1, Math.abs(d), Math.abs(T));
};
return t;
})();
i.default = o;
e.exports = i.default;
}), {
"./utils": 220,
"./vec3": 222
} ],
217: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, s = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0, a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, c = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 1, l = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 0, u = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 0, h = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 0, f = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : 0, d = arguments.length > 10 && void 0 !== arguments[10] ? arguments[10] : 1, _ = arguments.length > 11 && void 0 !== arguments[11] ? arguments[11] : 0, p = arguments.length > 12 && void 0 !== arguments[12] ? arguments[12] : 0, v = arguments.length > 13 && void 0 !== arguments[13] ? arguments[13] : 0, g = arguments.length > 14 && void 0 !== arguments[14] ? arguments[14] : 0, m = arguments.length > 15 && void 0 !== arguments[15] ? arguments[15] : 1;
r(this, t);
if ("object" == typeof e) if (i) {
this.m = new e.constructor(16);
this.m.set(e);
} else this.m = e; else {
this.m = new n.FLOAT_ARRAY_TYPE(16);
var y = this.m;
y[0] = e;
y[1] = i;
y[2] = s;
y[3] = o;
y[4] = a;
y[5] = c;
y[6] = l;
y[7] = u;
y[8] = h;
y[9] = f;
y[10] = d;
y[11] = _;
y[12] = p;
y[13] = v;
y[14] = g;
y[15] = m;
}
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0, arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0, arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 1, arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 0, arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 0, arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 0, arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : 0, arguments.length > 10 && void 0 !== arguments[10] ? arguments[10] : 1, arguments.length > 11 && void 0 !== arguments[11] ? arguments[11] : 0, arguments.length > 12 && void 0 !== arguments[12] ? arguments[12] : 0, arguments.length > 13 && void 0 !== arguments[13] ? arguments[13] : 0, arguments.length > 14 && void 0 !== arguments[14] ? arguments[14] : 0, arguments.length > 15 && void 0 !== arguments[15] ? arguments[15] : 1);
};
t.clone = function(e) {
var i = e.m;
return new t(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], i[11], i[12], i[13], i[14], i[15]);
};
t.copy = function(t, e) {
t.m.set(e.m);
return t;
};
t.set = function(t, e, i, n, r, s, o, a, c, l, u, h, f, d, _, p, v) {
var g = t.m;
g[0] = e;
g[1] = i;
g[2] = n;
g[3] = r;
g[4] = s;
g[5] = o;
g[6] = a;
g[7] = c;
g[8] = l;
g[9] = u;
g[10] = h;
g[11] = f;
g[12] = d;
g[13] = _;
g[14] = p;
g[15] = v;
return t;
};
t.identity = function(t) {
var e = t.m;
e[0] = 1;
e[1] = 0;
e[2] = 0;
e[3] = 0;
e[4] = 0;
e[5] = 1;
e[6] = 0;
e[7] = 0;
e[8] = 0;
e[9] = 0;
e[10] = 1;
e[11] = 0;
e[12] = 0;
e[13] = 0;
e[14] = 0;
e[15] = 1;
return t;
};
t.transpose = function(t, e) {
var i = e.m, n = t.m;
if (t === e) {
var r = i[1], s = i[2], o = i[3], a = i[6], c = i[7], l = i[11];
n[1] = i[4];
n[2] = i[8];
n[3] = i[12];
n[4] = r;
n[6] = i[9];
n[7] = i[13];
n[8] = s;
n[9] = a;
n[11] = i[14];
n[12] = o;
n[13] = c;
n[14] = l;
} else {
n[0] = i[0];
n[1] = i[4];
n[2] = i[8];
n[3] = i[12];
n[4] = i[1];
n[5] = i[5];
n[6] = i[9];
n[7] = i[13];
n[8] = i[2];
n[9] = i[6];
n[10] = i[10];
n[11] = i[14];
n[12] = i[3];
n[13] = i[7];
n[14] = i[11];
n[15] = i[15];
}
return t;
};
t.invert = function(t, e) {
var i = e.m, n = t.m, r = i[0], s = i[1], o = i[2], a = i[3], c = i[4], l = i[5], u = i[6], h = i[7], f = i[8], d = i[9], _ = i[10], p = i[11], v = i[12], g = i[13], m = i[14], y = i[15], E = r * l - s * c, C = r * u - o * c, T = r * h - a * c, A = s * u - o * l, x = s * h - a * l, b = o * h - a * u, S = f * g - d * v, R = f * m - _ * v, w = f * y - p * v, L = d * m - _ * g, O = d * y - p * g, M = _ * y - p * m, I = E * M - C * O + T * L + A * w - x * R + b * S;
if (!I) return null;
I = 1 / I;
n[0] = (l * M - u * O + h * L) * I;
n[1] = (o * O - s * M - a * L) * I;
n[2] = (g * b - m * x + y * A) * I;
n[3] = (_ * x - d * b - p * A) * I;
n[4] = (u * w - c * M - h * R) * I;
n[5] = (r * M - o * w + a * R) * I;
n[6] = (m * T - v * b - y * C) * I;
n[7] = (f * b - _ * T + p * C) * I;
n[8] = (c * O - l * w + h * S) * I;
n[9] = (s * w - r * O - a * S) * I;
n[10] = (v * x - g * T + y * E) * I;
n[11] = (d * T - f * x - p * E) * I;
n[12] = (l * R - c * L - u * S) * I;
n[13] = (r * L - s * R + o * S) * I;
n[14] = (g * C - v * A - m * E) * I;
n[15] = (f * A - d * C + _ * E) * I;
return t;
};
t.adjoint = function(t, e) {
var i = e.m, n = t.m, r = i[0], s = i[1], o = i[2], a = i[3], c = i[4], l = i[5], u = i[6], h = i[7], f = i[8], d = i[9], _ = i[10], p = i[11], v = i[12], g = i[13], m = i[14], y = i[15];
n[0] = l * (_ * y - p * m) - d * (u * y - h * m) + g * (u * p - h * _);
n[1] = -(s * (_ * y - p * m) - d * (o * y - a * m) + g * (o * p - a * _));
n[2] = s * (u * y - h * m) - l * (o * y - a * m) + g * (o * h - a * u);
n[3] = -(s * (u * p - h * _) - l * (o * p - a * _) + d * (o * h - a * u));
n[4] = -(c * (_ * y - p * m) - f * (u * y - h * m) + v * (u * p - h * _));
n[5] = r * (_ * y - p * m) - f * (o * y - a * m) + v * (o * p - a * _);
n[6] = -(r * (u * y - h * m) - c * (o * y - a * m) + v * (o * h - a * u));
n[7] = r * (u * p - h * _) - c * (o * p - a * _) + f * (o * h - a * u);
n[8] = c * (d * y - p * g) - f * (l * y - h * g) + v * (l * p - h * d);
n[9] = -(r * (d * y - p * g) - f * (s * y - a * g) + v * (s * p - a * d));
n[10] = r * (l * y - h * g) - c * (s * y - a * g) + v * (s * h - a * l);
n[11] = -(r * (l * p - h * d) - c * (s * p - a * d) + f * (s * h - a * l));
n[12] = -(c * (d * m - _ * g) - f * (l * m - u * g) + v * (l * _ - u * d));
n[13] = r * (d * m - _ * g) - f * (s * m - o * g) + v * (s * _ - o * d);
n[14] = -(r * (l * m - u * g) - c * (s * m - o * g) + v * (s * u - o * l));
n[15] = r * (l * _ - u * d) - c * (s * _ - o * d) + f * (s * u - o * l);
return t;
};
t.determinant = function(t) {
var e = t.m, i = e[0], n = e[1], r = e[2], s = e[3], o = e[4], a = e[5], c = e[6], l = e[7], u = e[8], h = e[9], f = e[10], d = e[11], _ = e[12], p = e[13], v = e[14], g = e[15];
return (i * a - n * o) * (f * g - d * v) - (i * c - r * o) * (h * g - d * p) + (i * l - s * o) * (h * v - f * p) + (n * c - r * a) * (u * g - d * _) - (n * l - s * a) * (u * v - f * _) + (r * l - s * c) * (u * p - h * _);
};
t.multiply = function(t, e, i) {
var n = e.m, r = i.m, s = t.m, o = n[0], a = n[1], c = n[2], l = n[3], u = n[4], h = n[5], f = n[6], d = n[7], _ = n[8], p = n[9], v = n[10], g = n[11], m = n[12], y = n[13], E = n[14], C = n[15], T = r[0], A = r[1], x = r[2], b = r[3];
s[0] = T * o + A * u + x * _ + b * m;
s[1] = T * a + A * h + x * p + b * y;
s[2] = T * c + A * f + x * v + b * E;
s[3] = T * l + A * d + x * g + b * C;
T = r[4];
A = r[5];
x = r[6];
b = r[7];
s[4] = T * o + A * u + x * _ + b * m;
s[5] = T * a + A * h + x * p + b * y;
s[6] = T * c + A * f + x * v + b * E;
s[7] = T * l + A * d + x * g + b * C;
T = r[8];
A = r[9];
x = r[10];
b = r[11];
s[8] = T * o + A * u + x * _ + b * m;
s[9] = T * a + A * h + x * p + b * y;
s[10] = T * c + A * f + x * v + b * E;
s[11] = T * l + A * d + x * g + b * C;
T = r[12];
A = r[13];
x = r[14];
b = r[15];
s[12] = T * o + A * u + x * _ + b * m;
s[13] = T * a + A * h + x * p + b * y;
s[14] = T * c + A * f + x * v + b * E;
s[15] = T * l + A * d + x * g + b * C;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.translate = function(t, e, i) {
var n = e.m, r = t.m, s = i.x, o = i.y, a = i.z, c = void 0, l = void 0, u = void 0, h = void 0, f = void 0, d = void 0, _ = void 0, p = void 0, v = void 0, g = void 0, m = void 0, y = void 0;
if (e === t) {
r[12] = n[0] * s + n[4] * o + n[8] * a + n[12];
r[13] = n[1] * s + n[5] * o + n[9] * a + n[13];
r[14] = n[2] * s + n[6] * o + n[10] * a + n[14];
r[15] = n[3] * s + n[7] * o + n[11] * a + n[15];
} else {
c = n[0];
l = n[1];
u = n[2];
h = n[3];
f = n[4];
d = n[5];
_ = n[6];
p = n[7];
v = n[8];
g = n[9];
m = n[10];
y = n[11];
r[0] = c;
r[1] = l;
r[2] = u;
r[3] = h;
r[4] = f;
r[5] = d;
r[6] = _;
r[7] = p;
r[8] = v;
r[9] = g;
r[10] = m;
r[11] = y;
r[12] = c * s + f * o + v * a + n[12];
r[13] = l * s + d * o + g * a + n[13];
r[14] = u * s + _ * o + m * a + n[14];
r[15] = h * s + p * o + y * a + n[15];
}
return t;
};
t.scale = function(t, e, i) {
var n = i.x, r = i.y, s = i.z, o = e.m, a = t.m;
a[0] = o[0] * n;
a[1] = o[1] * n;
a[2] = o[2] * n;
a[3] = o[3] * n;
a[4] = o[4] * r;
a[5] = o[5] * r;
a[6] = o[6] * r;
a[7] = o[7] * r;
a[8] = o[8] * s;
a[9] = o[9] * s;
a[10] = o[10] * s;
a[11] = o[11] * s;
a[12] = o[12];
a[13] = o[13];
a[14] = o[14];
a[15] = o[15];
return t;
};
t.rotate = function(t, e, i, r) {
var s, o, a, c, l, u, h, f, d, _, p, v, g, m, y, E, C, T, A, x, b, S, R, w, L = e.m, O = t.m, M = r.x, I = r.y, D = r.z, N = Math.sqrt(M * M + I * I + D * D);
if (Math.abs(N) < n.EPSILON) return null;
M *= N = 1 / N;
I *= N;
D *= N;
s = Math.sin(i);
a = 1 - (o = Math.cos(i));
c = L[0];
l = L[1];
u = L[2];
h = L[3];
f = L[4];
d = L[5];
_ = L[6];
p = L[7];
v = L[8];
g = L[9];
m = L[10];
y = L[11];
E = M * M * a + o;
C = I * M * a + D * s;
T = D * M * a - I * s;
A = M * I * a - D * s;
x = I * I * a + o;
b = D * I * a + M * s;
S = M * D * a + I * s;
R = I * D * a - M * s;
w = D * D * a + o;
O[0] = c * E + f * C + v * T;
O[1] = l * E + d * C + g * T;
O[2] = u * E + _ * C + m * T;
O[3] = h * E + p * C + y * T;
O[4] = c * A + f * x + v * b;
O[5] = l * A + d * x + g * b;
O[6] = u * A + _ * x + m * b;
O[7] = h * A + p * x + y * b;
O[8] = c * S + f * R + v * w;
O[9] = l * S + d * R + g * w;
O[10] = u * S + _ * R + m * w;
O[11] = h * S + p * R + y * w;
if (e !== t) {
O[12] = L[12];
O[13] = L[13];
O[14] = L[14];
O[15] = L[15];
}
return t;
};
t.rotateX = function(t, e, i) {
var n = e.m, r = t.m, s = Math.sin(i), o = Math.cos(i), a = n[4], c = n[5], l = n[6], u = n[7], h = n[8], f = n[9], d = n[10], _ = n[11];
if (e !== t) {
r[0] = n[0];
r[1] = n[1];
r[2] = n[2];
r[3] = n[3];
r[12] = n[12];
r[13] = n[13];
r[14] = n[14];
r[15] = n[15];
}
r[4] = a * o + h * s;
r[5] = c * o + f * s;
r[6] = l * o + d * s;
r[7] = u * o + _ * s;
r[8] = h * o - a * s;
r[9] = f * o - c * s;
r[10] = d * o - l * s;
r[11] = _ * o - u * s;
return t;
};
t.rotateY = function(t, e, i) {
var n = e.m, r = t.m, s = Math.sin(i), o = Math.cos(i), a = n[0], c = n[1], l = n[2], u = n[3], h = n[8], f = n[9], d = n[10], _ = n[11];
if (e !== t) {
r[4] = n[4];
r[5] = n[5];
r[6] = n[6];
r[7] = n[7];
r[12] = n[12];
r[13] = n[13];
r[14] = n[14];
r[15] = n[15];
}
r[0] = a * o - h * s;
r[1] = c * o - f * s;
r[2] = l * o - d * s;
r[3] = u * o - _ * s;
r[8] = a * s + h * o;
r[9] = c * s + f * o;
r[10] = l * s + d * o;
r[11] = u * s + _ * o;
return t;
};
t.rotateZ = function(t, e, i) {
var n = e.m, r = t.m, s = Math.sin(i), o = Math.cos(i), a = n[0], c = n[1], l = n[2], u = n[3], h = n[4], f = n[5], d = n[6], _ = n[7];
if (e !== t) {
r[8] = n[8];
r[9] = n[9];
r[10] = n[10];
r[11] = n[11];
r[12] = n[12];
r[13] = n[13];
r[14] = n[14];
r[15] = n[15];
}
r[0] = a * o + h * s;
r[1] = c * o + f * s;
r[2] = l * o + d * s;
r[3] = u * o + _ * s;
r[4] = h * o - a * s;
r[5] = f * o - c * s;
r[6] = d * o - l * s;
r[7] = _ * o - u * s;
return t;
};
t.fromTranslation = function(t, e) {
var i = t.m;
i[0] = 1;
i[1] = 0;
i[2] = 0;
i[3] = 0;
i[4] = 0;
i[5] = 1;
i[6] = 0;
i[7] = 0;
i[8] = 0;
i[9] = 0;
i[10] = 1;
i[11] = 0;
i[12] = e.x;
i[13] = e.y;
i[14] = e.z;
i[15] = 1;
return t;
};
t.fromScaling = function(t, e) {
var i = t.m;
i[0] = e.x;
i[1] = 0;
i[2] = 0;
i[3] = 0;
i[4] = 0;
i[5] = e.y;
i[6] = 0;
i[7] = 0;
i[8] = 0;
i[9] = 0;
i[10] = e.z;
i[11] = 0;
i[12] = 0;
i[13] = 0;
i[14] = 0;
i[15] = 1;
return t;
};
t.fromRotation = function(t, e, i) {
var r, s, o, a = t.m, c = i.x, l = i.y, u = i.z, h = Math.sqrt(c * c + l * l + u * u);
if (Math.abs(h) < n.EPSILON) return null;
c *= h = 1 / h;
l *= h;
u *= h;
r = Math.sin(e);
o = 1 - (s = Math.cos(e));
a[0] = c * c * o + s;
a[1] = l * c * o + u * r;
a[2] = u * c * o - l * r;
a[3] = 0;
a[4] = c * l * o - u * r;
a[5] = l * l * o + s;
a[6] = u * l * o + c * r;
a[7] = 0;
a[8] = c * u * o + l * r;
a[9] = l * u * o - c * r;
a[10] = u * u * o + s;
a[11] = 0;
a[12] = 0;
a[13] = 0;
a[14] = 0;
a[15] = 1;
return t;
};
t.fromXRotation = function(t, e) {
var i = t.m, n = Math.sin(e), r = Math.cos(e);
i[0] = 1;
i[1] = 0;
i[2] = 0;
i[3] = 0;
i[4] = 0;
i[5] = r;
i[6] = n;
i[7] = 0;
i[8] = 0;
i[9] = -n;
i[10] = r;
i[11] = 0;
i[12] = 0;
i[13] = 0;
i[14] = 0;
i[15] = 1;
return t;
};
t.fromYRotation = function(t, e) {
var i = t.m, n = Math.sin(e), r = Math.cos(e);
i[0] = r;
i[1] = 0;
i[2] = -n;
i[3] = 0;
i[4] = 0;
i[5] = 1;
i[6] = 0;
i[7] = 0;
i[8] = n;
i[9] = 0;
i[10] = r;
i[11] = 0;
i[12] = 0;
i[13] = 0;
i[14] = 0;
i[15] = 1;
return t;
};
t.fromZRotation = function(t, e) {
var i = t.m, n = Math.sin(e), r = Math.cos(e);
i[0] = r;
i[1] = n;
i[2] = 0;
i[3] = 0;
i[4] = -n;
i[5] = r;
i[6] = 0;
i[7] = 0;
i[8] = 0;
i[9] = 0;
i[10] = 1;
i[11] = 0;
i[12] = 0;
i[13] = 0;
i[14] = 0;
i[15] = 1;
return t;
};
t.fromRT = function(t, e, i) {
var n = t.m, r = e.x, s = e.y, o = e.z, a = e.w, c = r + r, l = s + s, u = o + o, h = r * c, f = r * l, d = r * u, _ = s * l, p = s * u, v = o * u, g = a * c, m = a * l, y = a * u;
n[0] = 1 - (_ + v);
n[1] = f + y;
n[2] = d - m;
n[3] = 0;
n[4] = f - y;
n[5] = 1 - (h + v);
n[6] = p + g;
n[7] = 0;
n[8] = d + m;
n[9] = p - g;
n[10] = 1 - (h + _);
n[11] = 0;
n[12] = i.x;
n[13] = i.y;
n[14] = i.z;
n[15] = 1;
return t;
};
t.fromTRSArray = function(t, e) {
var i = t.m, n = e[3], r = e[4], s = e[5], o = e[6], a = n + n, c = r + r, l = s + s, u = n * a, h = n * c, f = n * l, d = r * c, _ = r * l, p = s * l, v = o * a, g = o * c, m = o * l, y = e[7], E = e[8], C = e[9];
i[0] = (1 - (d + p)) * y;
i[1] = (h + m) * y;
i[2] = (f - g) * y;
i[3] = 0;
i[4] = (h - m) * E;
i[5] = (1 - (u + p)) * E;
i[6] = (_ + v) * E;
i[7] = 0;
i[8] = (f + g) * C;
i[9] = (_ - v) * C;
i[10] = (1 - (u + d)) * C;
i[11] = 0;
i[12] = e[0];
i[13] = e[1];
i[14] = e[2];
i[15] = 1;
return t;
};
t.getTranslation = function(t, e) {
var i = e.m;
t.x = i[12];
t.y = i[13];
t.z = i[14];
return t;
};
t.getScaling = function(t, e) {
var i = e.m, n = i[0], r = i[1], s = i[2], o = i[4], a = i[5], c = i[6], l = i[8], u = i[9], h = i[10];
t.x = Math.sqrt(n * n + r * r + s * s);
t.y = Math.sqrt(o * o + a * a + c * c);
t.z = Math.sqrt(l * l + u * u + h * h);
return t;
};
t.getRotation = function(t, e) {
var i = e.m, n = i[0] + i[5] + i[10], r = 0;
if (n > 0) {
r = 2 * Math.sqrt(n + 1);
t.w = .25 * r;
t.x = (i[6] - i[9]) / r;
t.y = (i[8] - i[2]) / r;
t.z = (i[1] - i[4]) / r;
} else if (i[0] > i[5] & i[0] > i[10]) {
r = 2 * Math.sqrt(1 + i[0] - i[5] - i[10]);
t.w = (i[6] - i[9]) / r;
t.x = .25 * r;
t.y = (i[1] + i[4]) / r;
t.z = (i[8] + i[2]) / r;
} else if (i[5] > i[10]) {
r = 2 * Math.sqrt(1 + i[5] - i[0] - i[10]);
t.w = (i[8] - i[2]) / r;
t.x = (i[1] + i[4]) / r;
t.y = .25 * r;
t.z = (i[6] + i[9]) / r;
} else {
r = 2 * Math.sqrt(1 + i[10] - i[0] - i[5]);
t.w = (i[1] - i[4]) / r;
t.x = (i[8] + i[2]) / r;
t.y = (i[6] + i[9]) / r;
t.z = .25 * r;
}
return t;
};
t.fromRTS = function(t, e, i, n) {
var r = t.m, s = e.x, o = e.y, a = e.z, c = e.w, l = s + s, u = o + o, h = a + a, f = s * l, d = s * u, _ = s * h, p = o * u, v = o * h, g = a * h, m = c * l, y = c * u, E = c * h, C = n.x, T = n.y, A = n.z;
r[0] = (1 - (p + g)) * C;
r[1] = (d + E) * C;
r[2] = (_ - y) * C;
r[3] = 0;
r[4] = (d - E) * T;
r[5] = (1 - (f + g)) * T;
r[6] = (v + m) * T;
r[7] = 0;
r[8] = (_ + y) * A;
r[9] = (v - m) * A;
r[10] = (1 - (f + p)) * A;
r[11] = 0;
r[12] = i.x;
r[13] = i.y;
r[14] = i.z;
r[15] = 1;
return t;
};
t.fromRTSOrigin = function(t, e, i, n, r) {
var s = t.m, o = e.x, a = e.y, c = e.z, l = e.w, u = o + o, h = a + a, f = c + c, d = o * u, _ = o * h, p = o * f, v = a * h, g = a * f, m = c * f, y = l * u, E = l * h, C = l * f, T = n.x, A = n.y, x = n.z, b = r.x, S = r.y, R = r.z;
s[0] = (1 - (v + m)) * T;
s[1] = (_ + C) * T;
s[2] = (p - E) * T;
s[3] = 0;
s[4] = (_ - C) * A;
s[5] = (1 - (d + m)) * A;
s[6] = (g + y) * A;
s[7] = 0;
s[8] = (p + E) * x;
s[9] = (g - y) * x;
s[10] = (1 - (d + v)) * x;
s[11] = 0;
s[12] = i.x + b - (s[0] * b + s[4] * S + s[8] * R);
s[13] = i.y + S - (s[1] * b + s[5] * S + s[9] * R);
s[14] = i.z + R - (s[2] * b + s[6] * S + s[10] * R);
s[15] = 1;
return t;
};
t.fromQuat = function(t, e) {
var i = t.m, n = e.x, r = e.y, s = e.z, o = e.w, a = n + n, c = r + r, l = s + s, u = n * a, h = r * a, f = r * c, d = s * a, _ = s * c, p = s * l, v = o * a, g = o * c, m = o * l;
i[0] = 1 - f - p;
i[1] = h + m;
i[2] = d - g;
i[3] = 0;
i[4] = h - m;
i[5] = 1 - u - p;
i[6] = _ + v;
i[7] = 0;
i[8] = d + g;
i[9] = _ - v;
i[10] = 1 - u - f;
i[11] = 0;
i[12] = 0;
i[13] = 0;
i[14] = 0;
i[15] = 1;
return t;
};
t.frustum = function(t, e, i, n, r, s, o) {
var a = t.m, c = 1 / (i - e), l = 1 / (r - n), u = 1 / (s - o);
a[0] = 2 * s * c;
a[1] = 0;
a[2] = 0;
a[3] = 0;
a[4] = 0;
a[5] = 2 * s * l;
a[6] = 0;
a[7] = 0;
a[8] = (i + e) * c;
a[9] = (r + n) * l;
a[10] = (o + s) * u;
a[11] = -1;
a[12] = 0;
a[13] = 0;
a[14] = o * s * 2 * u;
a[15] = 0;
return t;
};
t.perspective = function(t, e, i, n, r) {
var s = t.m, o = 1 / Math.tan(e / 2), a = 1 / (n - r);
s[0] = o / i;
s[1] = 0;
s[2] = 0;
s[3] = 0;
s[4] = 0;
s[5] = o;
s[6] = 0;
s[7] = 0;
s[8] = 0;
s[9] = 0;
s[10] = (r + n) * a;
s[11] = -1;
s[12] = 0;
s[13] = 0;
s[14] = 2 * r * n * a;
s[15] = 0;
return t;
};
t.perspectiveFromFieldOfView = function(t, e, i, n) {
var r = t.m, s = Math.tan(e.upDegrees * Math.PI / 180), o = Math.tan(e.downDegrees * Math.PI / 180), a = Math.tan(e.leftDegrees * Math.PI / 180), c = Math.tan(e.rightDegrees * Math.PI / 180), l = 2 / (a + c), u = 2 / (s + o);
r[0] = l;
r[1] = 0;
r[2] = 0;
r[3] = 0;
r[4] = 0;
r[5] = u;
r[6] = 0;
r[7] = 0;
r[8] = -(a - c) * l * .5;
r[9] = (s - o) * u * .5;
r[10] = n / (i - n);
r[11] = -1;
r[12] = 0;
r[13] = 0;
r[14] = n * i / (i - n);
r[15] = 0;
return t;
};
t.ortho = function(t, e, i, n, r, s, o) {
var a = t.m, c = 1 / (e - i), l = 1 / (n - r), u = 1 / (s - o);
a[0] = -2 * c;
a[1] = 0;
a[2] = 0;
a[3] = 0;
a[4] = 0;
a[5] = -2 * l;
a[6] = 0;
a[7] = 0;
a[8] = 0;
a[9] = 0;
a[10] = 2 * u;
a[11] = 0;
a[12] = (e + i) * c;
a[13] = (r + n) * l;
a[14] = (o + s) * u;
a[15] = 1;
return t;
};
t.lookAt = function(t, e, i, n) {
var r, s, o, a = t.m, c = void 0, l = void 0, u = void 0, h = void 0, f = void 0, d = void 0, _ = void 0, p = e.x, v = e.y, g = e.z, m = n.x, y = n.y, E = n.z, C = i.x, T = i.y, A = i.z;
h = p - C;
f = v - T;
d = g - A;
c = y * (d *= _ = 1 / Math.sqrt(h * h + f * f + d * d)) - E * (f *= _);
l = E * (h *= _) - m * d;
u = m * f - y * h;
r = f * (u *= _ = 1 / Math.sqrt(c * c + l * l + u * u)) - d * (l *= _);
s = d * (c *= _) - h * u;
o = h * l - f * c;
a[0] = c;
a[1] = r;
a[2] = h;
a[3] = 0;
a[4] = l;
a[5] = s;
a[6] = f;
a[7] = 0;
a[8] = u;
a[9] = o;
a[10] = d;
a[11] = 0;
a[12] = -(c * p + l * v + u * g);
a[13] = -(r * p + s * v + o * g);
a[14] = -(h * p + f * v + d * g);
a[15] = 1;
return t;
};
t.str = function(t) {
var e = t.m;
return "mat4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ", " + e[4] + ", " + e[5] + ", " + e[6] + ", " + e[7] + ", " + e[8] + ", " + e[9] + ", " + e[10] + ", " + e[11] + ", " + e[12] + ", " + e[13] + ", " + e[14] + ", " + e[15] + ")";
};
t.array = function(t, e) {
var i = e.m;
t[0] = i[0];
t[1] = i[1];
t[2] = i[2];
t[3] = i[3];
t[4] = i[4];
t[5] = i[5];
t[6] = i[6];
t[7] = i[7];
t[8] = i[8];
t[9] = i[9];
t[10] = i[10];
t[11] = i[11];
t[12] = i[12];
t[13] = i[13];
t[14] = i[14];
t[15] = i[15];
return t;
};
t.frob = function(t) {
var e = t.m;
return Math.sqrt(Math.pow(e[0], 2) + Math.pow(e[1], 2) + Math.pow(e[2], 2) + Math.pow(e[3], 2) + Math.pow(e[4], 2) + Math.pow(e[5], 2) + Math.pow(e[6], 2) + Math.pow(e[7], 2) + Math.pow(e[8], 2) + Math.pow(e[9], 2) + Math.pow(e[10], 2) + Math.pow(e[11], 2) + Math.pow(e[12], 2) + Math.pow(e[13], 2) + Math.pow(e[14], 2) + Math.pow(e[15], 2));
};
t.add = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] + r[0];
s[1] = n[1] + r[1];
s[2] = n[2] + r[2];
s[3] = n[3] + r[3];
s[4] = n[4] + r[4];
s[5] = n[5] + r[5];
s[6] = n[6] + r[6];
s[7] = n[7] + r[7];
s[8] = n[8] + r[8];
s[9] = n[9] + r[9];
s[10] = n[10] + r[10];
s[11] = n[11] + r[11];
s[12] = n[12] + r[12];
s[13] = n[13] + r[13];
s[14] = n[14] + r[14];
s[15] = n[15] + r[15];
return t;
};
t.subtract = function(t, e, i) {
var n = e.m, r = i.m, s = t.m;
s[0] = n[0] - r[0];
s[1] = n[1] - r[1];
s[2] = n[2] - r[2];
s[3] = n[3] - r[3];
s[4] = n[4] - r[4];
s[5] = n[5] - r[5];
s[6] = n[6] - r[6];
s[7] = n[7] - r[7];
s[8] = n[8] - r[8];
s[9] = n[9] - r[9];
s[10] = n[10] - r[10];
s[11] = n[11] - r[11];
s[12] = n[12] - r[12];
s[13] = n[13] - r[13];
s[14] = n[14] - r[14];
s[15] = n[15] - r[15];
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiplyScalar = function(t, e, i) {
var n = e.m, r = t.m;
r[0] = n[0] * i;
r[1] = n[1] * i;
r[2] = n[2] * i;
r[3] = n[3] * i;
r[4] = n[4] * i;
r[5] = n[5] * i;
r[6] = n[6] * i;
r[7] = n[7] * i;
r[8] = n[8] * i;
r[9] = n[9] * i;
r[10] = n[10] * i;
r[11] = n[11] * i;
r[12] = n[12] * i;
r[13] = n[13] * i;
r[14] = n[14] * i;
r[15] = n[15] * i;
return t;
};
t.multiplyScalarAndAdd = function(t, e, i, n) {
var r = e.m, s = i.m, o = t.m;
o[0] = r[0] + s[0] * n;
o[1] = r[1] + s[1] * n;
o[2] = r[2] + s[2] * n;
o[3] = r[3] + s[3] * n;
o[4] = r[4] + s[4] * n;
o[5] = r[5] + s[5] * n;
o[6] = r[6] + s[6] * n;
o[7] = r[7] + s[7] * n;
o[8] = r[8] + s[8] * n;
o[9] = r[9] + s[9] * n;
o[10] = r[10] + s[10] * n;
o[11] = r[11] + s[11] * n;
o[12] = r[12] + s[12] * n;
o[13] = r[13] + s[13] * n;
o[14] = r[14] + s[14] * n;
o[15] = r[15] + s[15] * n;
return t;
};
t.exactEquals = function(t, e) {
var i = t.m, n = e.m;
return i[0] === n[0] && i[1] === n[1] && i[2] === n[2] && i[3] === n[3] && i[4] === n[4] && i[5] === n[5] && i[6] === n[6] && i[7] === n[7] && i[8] === n[8] && i[9] === n[9] && i[10] === n[10] && i[11] === n[11] && i[12] === n[12] && i[13] === n[13] && i[14] === n[14] && i[15] === n[15];
};
t.equals = function(t, e) {
var i = t.m, r = e.m, s = i[0], o = i[1], a = i[2], c = i[3], l = i[4], u = i[5], h = i[6], f = i[7], d = i[8], _ = i[9], p = i[10], v = i[11], g = i[12], m = i[13], y = i[14], E = i[15], C = r[0], T = r[1], A = r[2], x = r[3], b = r[4], S = r[5], R = r[6], w = r[7], L = r[8], O = r[9], M = r[10], I = r[11], D = r[12], N = r[13], P = r[14], F = r[15];
return Math.abs(s - C) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(C)) && Math.abs(o - T) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(T)) && Math.abs(a - A) <= n.EPSILON * Math.max(1, Math.abs(a), Math.abs(A)) && Math.abs(c - x) <= n.EPSILON * Math.max(1, Math.abs(c), Math.abs(x)) && Math.abs(l - b) <= n.EPSILON * Math.max(1, Math.abs(l), Math.abs(b)) && Math.abs(u - S) <= n.EPSILON * Math.max(1, Math.abs(u), Math.abs(S)) && Math.abs(h - R) <= n.EPSILON * Math.max(1, Math.abs(h), Math.abs(R)) && Math.abs(f - w) <= n.EPSILON * Math.max(1, Math.abs(f), Math.abs(w)) && Math.abs(d - L) <= n.EPSILON * Math.max(1, Math.abs(d), Math.abs(L)) && Math.abs(_ - O) <= n.EPSILON * Math.max(1, Math.abs(_), Math.abs(O)) && Math.abs(p - M) <= n.EPSILON * Math.max(1, Math.abs(p), Math.abs(M)) && Math.abs(v - I) <= n.EPSILON * Math.max(1, Math.abs(v), Math.abs(I)) && Math.abs(g - D) <= n.EPSILON * Math.max(1, Math.abs(g), Math.abs(D)) && Math.abs(m - N) <= n.EPSILON * Math.max(1, Math.abs(m), Math.abs(N)) && Math.abs(y - P) <= n.EPSILON * Math.max(1, Math.abs(y), Math.abs(P)) && Math.abs(E - F) <= n.EPSILON * Math.max(1, Math.abs(E), Math.abs(F));
};
return t;
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
218: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = a(t("./vec3")), r = a(t("./vec4")), s = a(t("./mat3")), o = t("./utils");
function a(t) {
return t && t.__esModule ? t : {
default: t
};
}
function c(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var l = .5 * Math.PI / 180, u = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
c(this, t);
this.x = e;
this.y = i;
this.z = n;
this.w = r;
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1);
};
t.clone = function(e) {
return new t(e.x, e.y, e.z, e.w);
};
t.copy = function(t, e) {
return r.default.copy(t, e);
};
t.set = function(t, e, i, n, r) {
t.x = e;
t.y = i;
t.z = n;
t.w = r;
return t;
};
t.identity = function(t) {
t.x = 0;
t.y = 0;
t.z = 0;
t.w = 1;
return t;
};
t.rotationTo = function(e, i, r) {
return (function() {
var e = n.default.create(0, 0, 0), i = n.default.create(1, 0, 0), r = n.default.create(0, 1, 0);
return function(s, o, a) {
var c = n.default.dot(o, a);
if (c < -.999999) {
n.default.cross(e, i, o);
n.default.magnitude(e) < 1e-6 && n.default.cross(e, r, o);
n.default.normalize(e, e);
t.fromAxisAngle(s, e, Math.PI);
return s;
}
if (c > .999999) {
s.x = 0;
s.y = 0;
s.z = 0;
s.w = 1;
return s;
}
n.default.cross(e, o, a);
s.x = e.x;
s.y = e.y;
s.z = e.z;
s.w = 1 + c;
return t.normalize(s, s);
};
})()(e, i, r);
};
t.getAxisAngle = function(t, e) {
var i = 2 * Math.acos(e.w), n = Math.sin(i / 2);
if (0 != n) {
t.x = e.x / n;
t.y = e.y / n;
t.z = e.z / n;
} else {
t.x = 1;
t.y = 0;
t.z = 0;
}
return i;
};
t.multiply = function(t, e, i) {
var n = e.x, r = e.y, s = e.z, o = e.w, a = i.x, c = i.y, l = i.z, u = i.w;
t.x = n * u + o * a + r * l - s * c;
t.y = r * u + o * c + s * a - n * l;
t.z = s * u + o * l + n * c - r * a;
t.w = o * u - n * a - r * c - s * l;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.scale = function(t, e, i) {
t.x = e.x * i;
t.y = e.y * i;
t.z = e.z * i;
t.w = e.w * i;
return t;
};
t.rotateX = function(t, e, i) {
i *= .5;
var n = e.x, r = e.y, s = e.z, o = e.w, a = Math.sin(i), c = Math.cos(i);
t.x = n * c + o * a;
t.y = r * c + s * a;
t.z = s * c - r * a;
t.w = o * c - n * a;
return t;
};
t.rotateY = function(t, e, i) {
i *= .5;
var n = e.x, r = e.y, s = e.z, o = e.w, a = Math.sin(i), c = Math.cos(i);
t.x = n * c - s * a;
t.y = r * c + o * a;
t.z = s * c + n * a;
t.w = o * c - r * a;
return t;
};
t.rotateZ = function(t, e, i) {
i *= .5;
var n = e.x, r = e.y, s = e.z, o = e.w, a = Math.sin(i), c = Math.cos(i);
t.x = n * c + r * a;
t.y = r * c - n * a;
t.z = s * c + o * a;
t.w = o * c - s * a;
return t;
};
t.rotateAround = function(e, i, r, s) {
return (function() {
var e = n.default.create(0, 0, 0), i = t.create();
return function(r, s, o, a) {
t.invert(i, s);
n.default.transformQuat(e, o, i);
t.fromAxisAngle(i, e, a);
t.mul(r, s, i);
return r;
};
})()(e, i, r, s);
};
t.rotateAroundLocal = function(e, i, n, r) {
return (function() {
var e = t.create();
return function(i, n, r, s) {
t.fromAxisAngle(e, r, s);
t.mul(i, n, e);
return i;
};
})()(e, i, n, r);
};
t.calculateW = function(t, e) {
var i = e.x, n = e.y, r = e.z;
t.x = i;
t.y = n;
t.z = r;
t.w = Math.sqrt(Math.abs(1 - i * i - n * n - r * r));
return t;
};
t.dot = function(t, e) {
return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
};
t.lerp = function(t, e, i, n) {
var r = e.x, s = e.y, o = e.z, a = e.w;
t.x = r + n * (i.x - r);
t.y = s + n * (i.y - s);
t.z = o + n * (i.z - o);
t.w = a + n * (i.w - a);
return t;
};
t.slerp = function(t, e, i, n) {
var r = e.x, s = e.y, o = e.z, a = e.w, c = i.x, l = i.y, u = i.z, h = i.w, f = void 0, d = void 0, _ = void 0, p = void 0, v = void 0;
if ((d = r * c + s * l + o * u + a * h) < 0) {
d = -d;
c = -c;
l = -l;
u = -u;
h = -h;
}
if (1 - d > 1e-6) {
f = Math.acos(d);
_ = Math.sin(f);
p = Math.sin((1 - n) * f) / _;
v = Math.sin(n * f) / _;
} else {
p = 1 - n;
v = n;
}
t.x = p * r + v * c;
t.y = p * s + v * l;
t.z = p * o + v * u;
t.w = p * a + v * h;
return t;
};
t.sqlerp = function(e, i, n, r, s, o) {
return (function() {
var e = t.create(), i = t.create();
return function(n, r, s, o, a, c) {
t.slerp(e, r, a, c);
t.slerp(i, s, o, c);
t.slerp(n, e, i, 2 * c * (1 - c));
return n;
};
})()(e, i, n, r, s, o);
};
t.invert = function(t, e) {
var i = e.x, n = e.y, r = e.z, s = e.w, o = i * i + n * n + r * r + s * s, a = o ? 1 / o : 0;
t.x = -i * a;
t.y = -n * a;
t.z = -r * a;
t.w = s * a;
return t;
};
t.conjugate = function(t, e) {
t.x = -e.x;
t.y = -e.y;
t.z = -e.z;
t.w = e.w;
return t;
};
t.magnitude = function(t) {
var e = t.x, i = t.y, n = t.z, r = t.w;
return Math.sqrt(e * e + i * i + n * n + r * r);
};
t.mag = function(e) {
return t.magnitude(e);
};
t.squaredMagnitude = function(t) {
var e = t.x, i = t.y, n = t.z, r = t.w;
return e * e + i * i + n * n + r * r;
};
t.sqrMag = function(e) {
return t.squaredMagnitude(e);
};
t.normalize = function(t, e) {
var i = e.x, n = e.y, r = e.z, s = e.w, o = i * i + n * n + r * r + s * s;
if (o > 0) {
o = 1 / Math.sqrt(o);
t.x = i * o;
t.y = n * o;
t.z = r * o;
t.w = s * o;
}
return t;
};
t.fromAxes = function(e, i, n, r) {
return (function() {
var e = s.default.create();
return function(i, n, r, o) {
s.default.set(e, n.x, n.y, n.z, r.x, r.y, r.z, o.x, o.y, o.z);
return t.normalize(i, t.fromMat3(i, e));
};
})()(e, i, n, r);
};
t.fromViewUp = function(e, i, n) {
return (function() {
var e = s.default.create();
return function(i, n, r) {
s.default.fromViewUp(e, n, r);
return e ? t.normalize(i, t.fromMat3(i, e)) : null;
};
})()(e, i, n);
};
t.fromAxisAngle = function(t, e, i) {
i *= .5;
var n = Math.sin(i);
t.x = n * e.x;
t.y = n * e.y;
t.z = n * e.z;
t.w = Math.cos(i);
return t;
};
t.fromMat3 = function(t, e) {
var i = e.m, n = i[0], r = i[3], s = i[6], o = i[1], a = i[4], c = i[7], l = i[2], u = i[5], h = i[8], f = n + a + h;
if (f > 0) {
var d = .5 / Math.sqrt(f + 1);
t.w = .25 / d;
t.x = (u - c) * d;
t.y = (s - l) * d;
t.z = (o - r) * d;
} else if (n > a && n > h) {
var _ = 2 * Math.sqrt(1 + n - a - h);
t.w = (u - c) / _;
t.x = .25 * _;
t.y = (r + o) / _;
t.z = (s + l) / _;
} else if (a > h) {
var p = 2 * Math.sqrt(1 + a - n - h);
t.w = (s - l) / p;
t.x = (r + o) / p;
t.y = .25 * p;
t.z = (c + u) / p;
} else {
var v = 2 * Math.sqrt(1 + h - n - a);
t.w = (o - r) / v;
t.x = (s + l) / v;
t.y = (c + u) / v;
t.z = .25 * v;
}
return t;
};
t.fromEuler = function(t, e, i, n) {
e *= l;
i *= l;
n *= l;
var r = Math.sin(e), s = Math.cos(e), o = Math.sin(i), a = Math.cos(i), c = Math.sin(n), u = Math.cos(n);
t.x = r * a * u + s * o * c;
t.y = s * o * u + r * a * c;
t.z = s * a * c - r * o * u;
t.w = s * a * u - r * o * c;
return t;
};
t.fromAngleZ = function(t, e) {
e *= l;
t.x = t.y = 0;
t.z = Math.sin(e);
t.w = Math.cos(e);
};
t.toEuler = function(t, e) {
var i = e.x, n = e.y, r = e.z, s = e.w, a = void 0, c = void 0, l = void 0, u = i * n + r * s;
if (u > .499) {
a = 2 * Math.atan2(i, s);
c = Math.PI / 2;
l = 0;
}
if (u < -.499) {
a = -2 * Math.atan2(i, s);
c = -Math.PI / 2;
l = 0;
}
if (isNaN(a)) {
var h = i * i, f = n * n, d = r * r;
a = Math.atan2(2 * n * s - 2 * i * r, 1 - 2 * f - 2 * d);
c = Math.asin(2 * u);
l = Math.atan2(2 * i * s - 2 * n * r, 1 - 2 * h - 2 * d);
}
t.y = (0, o.toDegree)(a);
t.z = (0, o.toDegree)(c);
t.x = (0, o.toDegree)(l);
return t;
};
t.str = function(t) {
return "quat(" + t.x + ", " + t.y + ", " + t.z + ", " + t.w + ")";
};
t.array = function(t, e) {
t[0] = e.x;
t[1] = e.y;
t[2] = e.z;
t[3] = e.w;
return t;
};
t.exactEquals = function(t, e) {
return r.default.exactEquals(t, e);
};
t.equals = function(t, e) {
return r.default.equals(t, e);
};
return t;
})();
i.default = u;
e.exports = i.default;
}), {
"./mat3": 216,
"./utils": 220,
"./vec3": 222,
"./vec4": 223
} ],
219: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("./quat"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = n.default.create(), o = (function() {
function t() {
r(this, t);
}
t.toRotation = function(t, e) {
t.x = e[3];
t.y = e[4];
t.z = e[5];
t.w = e[6];
return t;
};
t.fromRotation = function(t, e) {
t[3] = e.x;
t[4] = e.y;
t[5] = e.z;
t[6] = e.w;
return t;
};
t.toEuler = function(e, i) {
t.toRotation(s, i);
n.default.toEuler(e, s);
return e;
};
t.fromEuler = function(e, i) {
n.default.fromEuler(s, i.x, i.y, i.z);
t.fromRotation(e, s);
return e;
};
t.fromEulerNumber = function(e, i, r, o) {
n.default.fromEuler(s, i, r, o);
t.fromRotation(e, s);
return e;
};
t.toScale = function(t, e) {
t.x = e[7];
t.y = e[8];
t.z = e[9];
return t;
};
t.fromScale = function(t, e) {
t[7] = e.x;
t[8] = e.y;
t[9] = e.z;
return t;
};
t.toPosition = function(t, e) {
t.x = e[0];
t.y = e[1];
t.z = e[2];
return t;
};
t.fromPosition = function(t, e) {
t[0] = e.x;
t[1] = e.y;
t[2] = e.z;
return t;
};
t.fromAngleZ = function(e, i) {
n.default.fromAngleZ(s, i);
t.fromRotation(e, s);
return e;
};
return t;
})();
i.default = o;
e.exports = i.default;
}), {
"./quat": 218
} ],
220: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.equals = function(t, e) {
return Math.abs(t - e) <= s * Math.max(1, Math.abs(t), Math.abs(e));
};
i.approx = function(t, e, i) {
i = i || s;
return Math.abs(t - e) <= i;
};
i.clamp = function(t, e, i) {
return t < e ? e : t > i ? i : t;
};
i.clamp01 = function(t) {
return t < 0 ? 0 : t > 1 ? 1 : t;
};
i.lerp = function(t, e, i) {
return t + (e - t) * i;
};
i.toRadian = function(t) {
return t * n;
};
i.toDegree = function(t) {
return t * r;
};
i.randomRange = o;
i.randomRangeInt = function(t, e) {
return Math.floor(o(t, e));
};
i.pseudoRandom = a;
i.pseudoRandomRange = c;
i.pseudoRandomRangeInt = function(t, e, i) {
return Math.floor(c(t, e, i));
};
i.nextPow2 = function(t) {
t = (t = (t = (t = (t = --t >> 1 | t) >> 2 | t) >> 4 | t) >> 8 | t) >> 16 | t;
return ++t;
};
i.repeat = l;
i.pingPong = function(t, e) {
t = l(t, 2 * e);
return t = e - Math.abs(t - e);
};
i.inverseLerp = function(t, e, i) {
return (i - t) / (e - t);
};
var n = Math.PI / 180, r = 180 / Math.PI, s = i.EPSILON = 1e-6;
i.FLOAT_ARRAY_TYPE = Float32Array, i.FLOAT_BYTES = 4;
i.random = Math.random;
function o(t, e) {
return Math.random() * (e - t) + t;
}
function a(t) {
return (t = (9301 * t + 49297) % 233280) / 233280;
}
function c(t, e, i) {
return a(t) * (i - e) + e;
}
function l(t, e) {
return t - Math.floor(t / e) * e;
}
}), {} ],
221: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
r(this, t);
this.x = e;
this.y = i;
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0);
};
t.zero = function(t) {
t.x = 0;
t.y = 0;
return t;
};
t.clone = function(e) {
return new t(e.x, e.y);
};
t.copy = function(t, e) {
t.x = e.x;
t.y = e.y;
return t;
};
t.set = function(t, e, i) {
t.x = e;
t.y = i;
return t;
};
t.add = function(t, e, i) {
t.x = e.x + i.x;
t.y = e.y + i.y;
return t;
};
t.subtract = function(t, e, i) {
t.x = e.x - i.x;
t.y = e.y - i.y;
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiply = function(t, e, i) {
t.x = e.x * i.x;
t.y = e.y * i.y;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.divide = function(t, e, i) {
t.x = e.x / i.x;
t.y = e.y / i.y;
return t;
};
t.div = function(e, i, n) {
return t.divide(e, i, n);
};
t.ceil = function(t, e) {
t.x = Math.ceil(e.x);
t.y = Math.ceil(e.y);
return t;
};
t.floor = function(t, e) {
t.x = Math.floor(e.x);
t.y = Math.floor(e.y);
return t;
};
t.min = function(t, e, i) {
t.x = Math.min(e.x, i.x);
t.y = Math.min(e.y, i.y);
return t;
};
t.max = function(t, e, i) {
t.x = Math.max(e.x, i.x);
t.y = Math.max(e.y, i.y);
return t;
};
t.round = function(t, e) {
t.x = Math.round(e.x);
t.y = Math.round(e.y);
return t;
};
t.scale = function(t, e, i) {
t.x = e.x * i;
t.y = e.y * i;
return t;
};
t.scaleAndAdd = function(t, e, i, n) {
t.x = e.x + i.x * n;
t.y = e.y + i.y * n;
return t;
};
t.distance = function(t, e) {
var i = e.x - t.x, n = e.y - t.y;
return Math.sqrt(i * i + n * n);
};
t.dist = function(e, i) {
return t.distance(e, i);
};
t.squaredDistance = function(t, e) {
var i = e.x - t.x, n = e.y - t.y;
return i * i + n * n;
};
t.sqrDist = function(e, i) {
return t.squaredDistance(e, i);
};
t.magnitude = function(t) {
var e = t.x, i = t.y;
return Math.sqrt(e * e + i * i);
};
t.mag = function(e) {
return t.magnitude(e);
};
t.squaredMagnitude = function(t) {
var e = t.x, i = t.y;
return e * e + i * i;
};
t.sqrMag = function(e) {
return t.squaredMagnitude(e);
};
t.negate = function(t, e) {
t.x = -e.x;
t.y = -e.y;
return t;
};
t.inverse = function(t, e) {
t.x = 1 / e.x;
t.y = 1 / e.y;
return t;
};
t.inverseSafe = function(t, e) {
var i = e.x, r = e.y;
Math.abs(i) < n.EPSILON ? t.x = 0 : t.x = 1 / i;
Math.abs(r) < n.EPSILON ? t.y = 0 : t.y = 1 / e.y;
return t;
};
t.normalize = function(t, e) {
var i = e.x, n = e.y, r = i * i + n * n;
if (r > 0) {
r = 1 / Math.sqrt(r);
t.x = e.x * r;
t.y = e.y * r;
}
return t;
};
t.dot = function(t, e) {
return t.x * e.x + t.y * e.y;
};
t.cross = function(t, e, i) {
var n = e.x * i.y - e.y * i.x;
t.x = t.y = 0;
t.z = n;
return t;
};
t.lerp = function(t, e, i, n) {
var r = e.x, s = e.y;
t.x = r + n * (i.x - r);
t.y = s + n * (i.y - s);
return t;
};
t.random = function(t, e) {
e = e || 1;
var i = 2 * (0, n.random)() * Math.PI;
t.x = Math.cos(i) * e;
t.y = Math.sin(i) * e;
return t;
};
t.transformMat2 = function(t, e, i) {
var n = i.m, r = e.x, s = e.y;
t.x = n[0] * r + n[2] * s;
t.y = n[1] * r + n[3] * s;
return t;
};
t.transformMat23 = function(t, e, i) {
var n = i.m, r = e.x, s = e.y;
t.x = n[0] * r + n[2] * s + n[4];
t.y = n[1] * r + n[3] * s + n[5];
return t;
};
t.transformMat3 = function(t, e, i) {
var n = i.m, r = e.x, s = e.y;
t.x = n[0] * r + n[3] * s + n[6];
t.y = n[1] * r + n[4] * s + n[7];
return t;
};
t.transformMat4 = function(t, e, i) {
var n = i.m, r = e.x, s = e.y;
t.x = n[0] * r + n[4] * s + n[12];
t.y = n[1] * r + n[5] * s + n[13];
return t;
};
t.forEach = function(e, i, n, r, s, o) {
return t._forEach(e, i, n, r, s, o);
};
t.str = function(t) {
return "vec2(" + t.x + ", " + t.y + ")";
};
t.array = function(t, e) {
t[0] = e.x;
t[1] = e.y;
return t;
};
t.exactEquals = function(t, e) {
return t.x === e.x && t.y === e.y;
};
t.equals = function(t, e) {
var i = t.x, r = t.y, s = e.x, o = e.y;
return Math.abs(i - s) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(s)) && Math.abs(r - o) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(o));
};
t.angle = function(e, i) {
return t._angle(e, i);
};
return t;
})();
s._forEach = (function() {
var t = s.create(0, 0);
return function(e, i, n, r, s, o) {
var a = void 0, c = void 0;
i || (i = 2);
n || (n = 0);
c = r ? Math.min(r * i + n, e.length) : e.length;
for (a = n; a < c; a += i) {
t.x = e[a];
t.y = e[a + 1];
s(t, t, o);
e[a] = t.x;
e[a + 1] = t.y;
}
return e;
};
})();
s._angle = (function() {
var t = s.create(0, 0), e = s.create(0, 0);
return function(i, n) {
s.normalize(t, i);
s.normalize(e, n);
var r = s.dot(t, e);
return r > 1 ? 0 : r < -1 ? Math.PI : Math.acos(r);
};
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
222: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
r(this, t);
this.x = e;
this.y = i;
this.z = n;
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0);
};
t.zero = function(t) {
t.x = 0;
t.y = 0;
t.z = 0;
return t;
};
t.clone = function(e) {
return new t(e.x, e.y, e.z);
};
t.copy = function(t, e) {
t.x = e.x;
t.y = e.y;
t.z = e.z;
return t;
};
t.set = function(t, e, i, n) {
t.x = e;
t.y = i;
t.z = n;
return t;
};
t.add = function(t, e, i) {
t.x = e.x + i.x;
t.y = e.y + i.y;
t.z = e.z + i.z;
return t;
};
t.subtract = function(t, e, i) {
t.x = e.x - i.x;
t.y = e.y - i.y;
t.z = e.z - i.z;
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiply = function(t, e, i) {
t.x = e.x * i.x;
t.y = e.y * i.y;
t.z = e.z * i.z;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.divide = function(t, e, i) {
t.x = e.x / i.x;
t.y = e.y / i.y;
t.z = e.z / i.z;
return t;
};
t.div = function(e, i, n) {
return t.divide(e, i, n);
};
t.ceil = function(t, e) {
t.x = Math.ceil(e.x);
t.y = Math.ceil(e.y);
t.z = Math.ceil(e.z);
return t;
};
t.floor = function(t, e) {
t.x = Math.floor(e.x);
t.y = Math.floor(e.y);
t.z = Math.floor(e.z);
return t;
};
t.min = function(t, e, i) {
t.x = Math.min(e.x, i.x);
t.y = Math.min(e.y, i.y);
t.z = Math.min(e.z, i.z);
return t;
};
t.max = function(t, e, i) {
t.x = Math.max(e.x, i.x);
t.y = Math.max(e.y, i.y);
t.z = Math.max(e.z, i.z);
return t;
};
t.round = function(t, e) {
t.x = Math.round(e.x);
t.y = Math.round(e.y);
t.z = Math.round(e.z);
return t;
};
t.scale = function(t, e, i) {
t.x = e.x * i;
t.y = e.y * i;
t.z = e.z * i;
return t;
};
t.scaleAndAdd = function(t, e, i, n) {
t.x = e.x + i.x * n;
t.y = e.y + i.y * n;
t.z = e.z + i.z * n;
return t;
};
t.distance = function(t, e) {
var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z;
return Math.sqrt(i * i + n * n + r * r);
};
t.dist = function(e, i) {
return t.distance(e, i);
};
t.squaredDistance = function(t, e) {
var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z;
return i * i + n * n + r * r;
};
t.sqrDist = function(e, i) {
return t.squaredDistance(e, i);
};
t.magnitude = function(t) {
var e = t.x, i = t.y, n = t.z;
return Math.sqrt(e * e + i * i + n * n);
};
t.mag = function(e) {
return t.magnitude(e);
};
t.squaredMagnitude = function(t) {
var e = t.x, i = t.y, n = t.z;
return e * e + i * i + n * n;
};
t.sqrMag = function(e) {
return t.squaredMagnitude(e);
};
t.negate = function(t, e) {
t.x = -e.x;
t.y = -e.y;
t.z = -e.z;
return t;
};
t.inverse = function(t, e) {
t.x = 1 / e.x;
t.y = 1 / e.y;
t.z = 1 / e.z;
return t;
};
t.inverseSafe = function(t, e) {
var i = e.x, r = e.y, s = e.z;
Math.abs(i) < n.EPSILON ? t.x = 0 : t.x = 1 / i;
Math.abs(r) < n.EPSILON ? t.y = 0 : t.y = 1 / r;
Math.abs(s) < n.EPSILON ? t.z = 0 : t.z = 1 / s;
return t;
};
t.normalize = function(t, e) {
var i = e.x, n = e.y, r = e.z, s = i * i + n * n + r * r;
if (s > 0) {
s = 1 / Math.sqrt(s);
t.x = i * s;
t.y = n * s;
t.z = r * s;
}
return t;
};
t.dot = function(t, e) {
return t.x * e.x + t.y * e.y + t.z * e.z;
};
t.cross = function(t, e, i) {
var n = e.x, r = e.y, s = e.z, o = i.x, a = i.y, c = i.z;
t.x = r * c - s * a;
t.y = s * o - n * c;
t.z = n * a - r * o;
return t;
};
t.lerp = function(t, e, i, n) {
var r = e.x, s = e.y, o = e.z;
t.x = r + n * (i.x - r);
t.y = s + n * (i.y - s);
t.z = o + n * (i.z - o);
return t;
};
t.hermite = function(t, e, i, n, r, s) {
var o = s * s, a = o * (2 * s - 3) + 1, c = o * (s - 2) + s, l = o * (s - 1), u = o * (3 - 2 * s);
t.x = e.x * a + i.x * c + n.x * l + r.x * u;
t.y = e.y * a + i.y * c + n.y * l + r.y * u;
t.z = e.z * a + i.z * c + n.z * l + r.z * u;
return t;
};
t.bezier = function(t, e, i, n, r, s) {
var o = 1 - s, a = o * o, c = s * s, l = a * o, u = 3 * s * a, h = 3 * c * o, f = c * s;
t.x = e.x * l + i.x * u + n.x * h + r.x * f;
t.y = e.y * l + i.y * u + n.y * h + r.y * f;
t.z = e.z * l + i.z * u + n.z * h + r.z * f;
return t;
};
t.random = function(t, e) {
e = e || 1;
var i = 2 * (0, n.random)() * Math.PI, r = Math.acos(2 * (0, n.random)() - 1);
t.x = Math.sin(r) * Math.cos(i) * e;
t.y = Math.sin(r) * Math.sin(i) * e;
t.z = Math.cos(r) * e;
return t;
};
t.transformMat4 = function(t, e, i) {
var n = i.m, r = e.x, s = e.y, o = e.z, a = n[3] * r + n[7] * s + n[11] * o + n[15];
a = a ? 1 / a : 1;
t.x = (n[0] * r + n[4] * s + n[8] * o + n[12]) * a;
t.y = (n[1] * r + n[5] * s + n[9] * o + n[13]) * a;
t.z = (n[2] * r + n[6] * s + n[10] * o + n[14]) * a;
return t;
};
t.transformMat4Normal = function(t, e, i) {
var n = i.m, r = e.x, s = e.y, o = e.z, a = n[3] * r + n[7] * s + n[11] * o;
a = a ? 1 / a : 1;
t.x = (n[0] * r + n[4] * s + n[8] * o) * a;
t.y = (n[1] * r + n[5] * s + n[9] * o) * a;
t.z = (n[2] * r + n[6] * s + n[10] * o) * a;
return t;
};
t.transformMat3 = function(t, e, i) {
var n = i.m, r = e.x, s = e.y, o = e.z;
t.x = r * n[0] + s * n[3] + o * n[6];
t.y = r * n[1] + s * n[4] + o * n[7];
t.z = r * n[2] + s * n[5] + o * n[8];
return t;
};
t.transformQuat = function(t, e, i) {
var n = e.x, r = e.y, s = e.z, o = i.x, a = i.y, c = i.z, l = i.w, u = l * n + a * s - c * r, h = l * r + c * n - o * s, f = l * s + o * r - a * n, d = -o * n - a * r - c * s;
t.x = u * l + d * -o + h * -c - f * -a;
t.y = h * l + d * -a + f * -o - u * -c;
t.z = f * l + d * -c + u * -a - h * -o;
return t;
};
t.rotateX = function(t, e, i, n) {
var r = e.x - i.x, s = e.y - i.y, o = e.z - i.z, a = r, c = s * Math.cos(n) - o * Math.sin(n), l = s * Math.sin(n) + o * Math.cos(n);
t.x = a + i.x;
t.y = c + i.y;
t.z = l + i.z;
return t;
};
t.rotateY = function(t, e, i, n) {
var r = e.x - i.x, s = e.y - i.y, o = e.z - i.z, a = o * Math.sin(n) + r * Math.cos(n), c = s, l = o * Math.cos(n) - r * Math.sin(n);
t.x = a + i.x;
t.y = c + i.y;
t.z = l + i.z;
return t;
};
t.rotateZ = function(t, e, i, n) {
var r = e.x - i.x, s = e.y - i.y, o = e.z - i.z, a = r * Math.cos(n) - s * Math.sin(n), c = r * Math.sin(n) + s * Math.cos(n), l = o;
t.x = a + i.x;
t.y = c + i.y;
t.z = l + i.z;
return t;
};
t.str = function(t) {
return "vec3(" + t.x + ", " + t.y + ", " + t.z + ")";
};
t.array = function(t, e) {
t[0] = e.x;
t[1] = e.y;
t[2] = e.z;
return t;
};
t.exactEquals = function(t, e) {
return t.x === e.x && t.y === e.y && t.z === e.z;
};
t.equals = function(t, e) {
var i = t.x, r = t.y, s = t.z, o = e.x, a = e.y, c = e.z;
return Math.abs(i - o) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(o)) && Math.abs(r - a) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(a)) && Math.abs(s - c) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(c));
};
t.forEach = function(e, i, n, r, s, o) {
return t._forEach(e, i, n, r, s, o);
};
t.angle = function(e, i) {
return t._angle(e, i);
};
t.projectOnPlane = function(e, i, n) {
return t.sub(e, i, t.project(e, i, n));
};
t.project = function(e, i, n) {
var r = t.squaredMagnitude(n);
return r < 1e-6 ? t.set(e, 0, 0, 0) : t.scale(e, n, t.dot(i, n) / r);
};
return t;
})();
s._forEach = (function() {
var t = s.create(0, 0, 0);
return function(e, i, n, r, s, o) {
var a = void 0, c = void 0;
i || (i = 3);
n || (n = 0);
c = r ? Math.min(r * i + n, e.length) : e.length;
for (a = n; a < c; a += i) {
t.x = e[a];
t.y = e[a + 1];
t.z = e[a + 2];
s(t, t, o);
e[a] = t.x;
e[a + 1] = t.y;
e[a + 2] = t.z;
}
return e;
};
})();
s._angle = (function() {
var t = s.create(0, 0, 0), e = s.create(0, 0, 0);
return function(i, n) {
s.copy(t, i);
s.copy(e, n);
s.normalize(t, t);
s.normalize(e, e);
var r = s.dot(t, e);
return r > 1 ? 0 : r < -1 ? Math.PI : Math.acos(r);
};
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
223: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./utils");
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t() {
var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, s = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1;
r(this, t);
this.x = e;
this.y = i;
this.z = n;
this.w = s;
}
t.create = function() {
return new t(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0, arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0, arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1);
};
t.zero = function(t) {
t.x = 0;
t.y = 0;
t.z = 0;
t.w = 0;
return t;
};
t.clone = function(e) {
return new t(e.x, e.y, e.z, e.w);
};
t.copy = function(t, e) {
t.x = e.x;
t.y = e.y;
t.z = e.z;
t.w = e.w;
return t;
};
t.set = function(t, e, i, n, r) {
t.x = e;
t.y = i;
t.z = n;
t.w = r;
return t;
};
t.add = function(t, e, i) {
t.x = e.x + i.x;
t.y = e.y + i.y;
t.z = e.z + i.z;
t.w = e.w + i.w;
return t;
};
t.subtract = function(t, e, i) {
t.x = e.x - i.x;
t.y = e.y - i.y;
t.z = e.z - i.z;
t.w = e.w - i.w;
return t;
};
t.sub = function(e, i, n) {
return t.subtract(e, i, n);
};
t.multiply = function(t, e, i) {
t.x = e.x * i.x;
t.y = e.y * i.y;
t.z = e.z * i.z;
t.w = e.w * i.w;
return t;
};
t.mul = function(e, i, n) {
return t.multiply(e, i, n);
};
t.divide = function(t, e, i) {
t.x = e.x / i.x;
t.y = e.y / i.y;
t.z = e.z / i.z;
t.w = e.w / i.w;
return t;
};
t.div = function(e, i, n) {
return t.divide(e, i, n);
};
t.ceil = function(t, e) {
t.x = Math.ceil(e.x);
t.y = Math.ceil(e.y);
t.z = Math.ceil(e.z);
t.w = Math.ceil(e.w);
return t;
};
t.floor = function(t, e) {
t.x = Math.floor(e.x);
t.y = Math.floor(e.y);
t.z = Math.floor(e.z);
t.w = Math.floor(e.w);
return t;
};
t.min = function(t, e, i) {
t.x = Math.min(e.x, i.x);
t.y = Math.min(e.y, i.y);
t.z = Math.min(e.z, i.z);
t.w = Math.min(e.w, i.w);
return t;
};
t.max = function(t, e, i) {
t.x = Math.max(e.x, i.x);
t.y = Math.max(e.y, i.y);
t.z = Math.max(e.z, i.z);
t.w = Math.max(e.w, i.w);
return t;
};
t.round = function(t, e) {
t.x = Math.round(e.x);
t.y = Math.round(e.y);
t.z = Math.round(e.z);
t.w = Math.round(e.w);
return t;
};
t.scale = function(t, e, i) {
t.x = e.x * i;
t.y = e.y * i;
t.z = e.z * i;
t.w = e.w * i;
return t;
};
t.scaleAndAdd = function(t, e, i, n) {
t.x = e.x + i.x * n;
t.y = e.y + i.y * n;
t.z = e.z + i.z * n;
t.w = e.w + i.w * n;
return t;
};
t.distance = function(t, e) {
var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z, s = e.w - t.w;
return Math.sqrt(i * i + n * n + r * r + s * s);
};
t.dist = function(e, i) {
return t.distance(e, i);
};
t.squaredDistance = function(t, e) {
var i = e.x - t.x, n = e.y - t.y, r = e.z - t.z, s = e.w - t.w;
return i * i + n * n + r * r + s * s;
};
t.sqrDist = function(e, i) {
return t.squaredDistance(e, i);
};
t.magnitude = function(t) {
var e = t.x, i = t.y, n = t.z, r = t.w;
return Math.sqrt(e * e + i * i + n * n + r * r);
};
t.mag = function(e) {
return t.magnitude(e);
};
t.squaredMagnitude = function(t) {
var e = t.x, i = t.y, n = t.z, r = t.w;
return e * e + i * i + n * n + r * r;
};
t.sqrMag = function(e) {
return t.squaredMagnitude(e);
};
t.negate = function(t, e) {
t.x = -e.x;
t.y = -e.y;
t.z = -e.z;
t.w = -e.w;
return t;
};
t.inverse = function(t, e) {
t.x = 1 / e.x;
t.y = 1 / e.y;
t.z = 1 / e.z;
t.w = 1 / e.w;
return t;
};
t.inverseSafe = function(t, e) {
var i = e.x, r = e.y, s = e.z, o = e.w;
Math.abs(i) < n.EPSILON ? t.x = 0 : t.x = 1 / i;
Math.abs(r) < n.EPSILON ? t.y = 0 : t.y = 1 / r;
Math.abs(s) < n.EPSILON ? t.z = 0 : t.z = 1 / s;
Math.abs(o) < n.EPSILON ? t.w = 0 : t.w = 1 / o;
return t;
};
t.normalize = function(t, e) {
var i = e.x, n = e.y, r = e.z, s = e.w, o = i * i + n * n + r * r + s * s;
if (o > 0) {
o = 1 / Math.sqrt(o);
t.x = i * o;
t.y = n * o;
t.z = r * o;
t.w = s * o;
}
return t;
};
t.dot = function(t, e) {
return t.x * e.x + t.y * e.y + t.z * e.z + t.w * e.w;
};
t.lerp = function(t, e, i, n) {
var r = e.x, s = e.y, o = e.z, a = e.w;
t.x = r + n * (i.x - r);
t.y = s + n * (i.y - s);
t.z = o + n * (i.z - o);
t.w = a + n * (i.w - a);
return t;
};
t.random = function(t, e) {
e = e || 1;
var i = 2 * (0, n.random)() * Math.PI, r = Math.acos(2 * (0, n.random)() - 1);
t.x = Math.sin(r) * Math.cos(i) * e;
t.y = Math.sin(r) * Math.sin(i) * e;
t.z = Math.cos(r) * e;
t.w = 0;
return t;
};
t.transformMat4 = function(t, e, i) {
var n = i.m, r = e.x, s = e.y, o = e.z, a = e.w;
t.x = n[0] * r + n[4] * s + n[8] * o + n[12] * a;
t.y = n[1] * r + n[5] * s + n[9] * o + n[13] * a;
t.z = n[2] * r + n[6] * s + n[10] * o + n[14] * a;
t.w = n[3] * r + n[7] * s + n[11] * o + n[15] * a;
return t;
};
t.transformQuat = function(t, e, i) {
var n = e.x, r = e.y, s = e.z, o = i.x, a = i.y, c = i.z, l = i.w, u = l * n + a * s - c * r, h = l * r + c * n - o * s, f = l * s + o * r - a * n, d = -o * n - a * r - c * s;
t.x = u * l + d * -o + h * -c - f * -a;
t.y = h * l + d * -a + f * -o - u * -c;
t.z = f * l + d * -c + u * -a - h * -o;
t.w = e.w;
return t;
};
t.str = function(t) {
return "vec4(" + t.x + ", " + t.y + ", " + t.z + ", " + t.w + ")";
};
t.array = function(t, e) {
t[0] = e.x;
t[1] = e.y;
t[2] = e.z;
t[3] = e.w;
return t;
};
t.exactEquals = function(t, e) {
return t.x === e.x && t.y === e.y && t.z === e.z && t.w === e.w;
};
t.equals = function(t, e) {
var i = t.x, r = t.y, s = t.z, o = t.w, a = e.x, c = e.y, l = e.z, u = e.w;
return Math.abs(i - a) <= n.EPSILON * Math.max(1, Math.abs(i), Math.abs(a)) && Math.abs(r - c) <= n.EPSILON * Math.max(1, Math.abs(r), Math.abs(c)) && Math.abs(s - l) <= n.EPSILON * Math.max(1, Math.abs(s), Math.abs(l)) && Math.abs(o - u) <= n.EPSILON * Math.max(1, Math.abs(o), Math.abs(u));
};
t.forEach = function(e, i, n, r, s, o) {
return t._forEach(e, i, n, r, s, o);
};
return t;
})();
s._forEach = (function() {
var t = s.create(0, 0, 0, 0);
return function(e, i, n, r, s, o) {
var a = void 0, c = void 0;
i || (i = 4);
n || (n = 0);
c = r ? Math.min(r * i + n, e.length) : e.length;
for (a = n; a < c; a += i) {
t.x = e[a];
t.y = e[a + 1];
t.z = e[a + 2];
t.w = e[a + 3];
s(t, t, o);
e[a] = t.x;
e[a + 1] = t.y;
e[a + 2] = t.z;
e[a + 3] = t.w;
}
return e;
};
})();
i.default = s;
e.exports = i.default;
}), {
"./utils": 220
} ],
224: [ (function(t, e, i) {
"use strict";
cc.js;
}), {} ],
225: [ (function(t, e, i) {
"use strict";
t("./core/CCGame");
t("./actions");
}), {
"./actions": void 0,
"./core/CCGame": 6
} ],
226: [ (function(t, e, i) {
"use strict";
var n = t("../core/assets/CCAsset"), r = t("../core/assets/CCSpriteFrame"), s = cc.Class({
name: "cc.ParticleAsset",
extends: n,
properties: {
spriteFrame: {
default: null,
type: r
}
}
});
cc.ParticleAsset = e.exports = s;
}), {
"../core/assets/CCAsset": 11,
"../core/assets/CCSpriteFrame": 25
} ],
227: [ (function(t, e, i) {
"use strict";
var n, r, s, o = 512, a = 513, c = 514, l = 515, u = 516, h = 517, f = 518, d = 519, _ = 32774, p = 32778, v = 32779, g = 0, m = 1, y = 768, E = 769, C = 774, T = 775, A = 770, x = 771, b = 772, S = 773, R = 32769, w = 32770, L = 32771, O = 32772, M = 776, I = 7680, D = 7681, N = 7682, P = 34055, F = 7683, B = 34056, z = 5386, U = 0, k = 1028, H = 1029;
(function(t) {
t[t.COMPRESSED_RGB_S3TC_DXT1_EXT = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT";
t[t.COMPRESSED_RGBA_S3TC_DXT1_EXT = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT";
t[t.COMPRESSED_RGBA_S3TC_DXT3_EXT = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT";
t[t.COMPRESSED_RGBA_S3TC_DXT5_EXT = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT";
t[t.COMPRESSED_SRGB_S3TC_DXT1_EXT = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT";
t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT";
t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT";
t[t.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT";
t[t.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG";
t[t.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG";
t[t.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG";
t[t.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG";
t[t.COMPRESSED_RGB_ETC1_WEBGL = 36196] = "COMPRESSED_RGB_ETC1_WEBGL";
})(n || (n = {}));
(function(t) {
t[t.UNKNOWN = 0] = "UNKNOWN";
t[t.BUFFER = 1] = "BUFFER";
t[t.TEXTURE = 2] = "TEXTURE";
t[t.TEXTURE_VIEW = 3] = "TEXTURE_VIEW";
t[t.RENDER_PASS = 4] = "RENDER_PASS";
t[t.FRAMEBUFFER = 5] = "FRAMEBUFFER";
t[t.SAMPLER = 6] = "SAMPLER";
t[t.SHADER = 7] = "SHADER";
t[t.PIPELINE_LAYOUT = 8] = "PIPELINE_LAYOUT";
t[t.PIPELINE_STATE = 9] = "PIPELINE_STATE";
t[t.BINDING_LAYOUT = 10] = "BINDING_LAYOUT";
t[t.INPUT_ASSEMBLER = 11] = "INPUT_ASSEMBLER";
t[t.COMMAND_ALLOCATOR = 12] = "COMMAND_ALLOCATOR";
t[t.COMMAND_BUFFER = 13] = "COMMAND_BUFFER";
t[t.QUEUE = 14] = "QUEUE";
t[t.WINDOW = 15] = "WINDOW";
})(r || (r = {}));
(function(t) {
t[t.UNREADY = 0] = "UNREADY";
t[t.FAILED = 1] = "FAILED";
t[t.SUCCESS = 2] = "SUCCESS";
})(s || (s = {}));
var G, V, j, W, Y, X, q, K, Z, $, Q, J, tt, et, it, nt, rt, st, ot, at, ct, lt, ut, ht, ft, dt, _t, pt, vt, gt, mt, yt, Et, Ct, Tt;
(function() {
function t(t) {
this._gfxType = r.UNKNOWN;
this._status = s.UNREADY;
this._gfxType = t;
}
Object.defineProperty(t.prototype, "gfxType", {
get: function() {
return this._gfxType;
},
enumerable: !0,
configurable: !0
});
Object.defineProperty(t.prototype, "status", {
get: function() {
return this._status;
},
enumerable: !0,
configurable: !0
});
})();
(function(t) {
t.ATTR_POSITION = "a_position";
t.ATTR_NORMAL = "a_normal";
t.ATTR_TANGENT = "a_tangent";
t.ATTR_BITANGENT = "a_bitangent";
t.ATTR_WEIGHTS = "a_weights";
t.ATTR_JOINTS = "a_joints";
t.ATTR_COLOR = "a_color";
t.ATTR_COLOR1 = "a_color1";
t.ATTR_COLOR2 = "a_color2";
t.ATTR_TEX_COORD = "a_texCoord";
t.ATTR_TEX_COORD1 = "a_texCoord1";
t.ATTR_TEX_COORD2 = "a_texCoord2";
t.ATTR_TEX_COORD3 = "a_texCoord3";
t.ATTR_TEX_COORD4 = "a_texCoord4";
t.ATTR_TEX_COORD5 = "a_texCoord5";
t.ATTR_TEX_COORD6 = "a_texCoord6";
t.ATTR_TEX_COORD7 = "a_texCoord7";
t.ATTR_TEX_COORD8 = "a_texCoord8";
})(G || (G = {}));
(function(t) {
t[t.UNKNOWN = 0] = "UNKNOWN";
t[t.BOOL = 1] = "BOOL";
t[t.BOOL2 = 2] = "BOOL2";
t[t.BOOL3 = 3] = "BOOL3";
t[t.BOOL4 = 4] = "BOOL4";
t[t.INT = 5] = "INT";
t[t.INT2 = 6] = "INT2";
t[t.INT3 = 7] = "INT3";
t[t.INT4 = 8] = "INT4";
t[t.UINT = 9] = "UINT";
t[t.UINT2 = 10] = "UINT2";
t[t.UINT3 = 11] = "UINT3";
t[t.UINT4 = 12] = "UINT4";
t[t.FLOAT = 13] = "FLOAT";
t[t.FLOAT2 = 14] = "FLOAT2";
t[t.FLOAT3 = 15] = "FLOAT3";
t[t.FLOAT4 = 16] = "FLOAT4";
t[t.COLOR4 = 17] = "COLOR4";
t[t.MAT2 = 18] = "MAT2";
t[t.MAT2X3 = 19] = "MAT2X3";
t[t.MAT2X4 = 20] = "MAT2X4";
t[t.MAT3X2 = 21] = "MAT3X2";
t[t.MAT3 = 22] = "MAT3";
t[t.MAT3X4 = 23] = "MAT3X4";
t[t.MAT4X2 = 24] = "MAT4X2";
t[t.MAT4X3 = 25] = "MAT4X3";
t[t.MAT4 = 26] = "MAT4";
t[t.SAMPLER1D = 27] = "SAMPLER1D";
t[t.SAMPLER1D_ARRAY = 28] = "SAMPLER1D_ARRAY";
t[t.SAMPLER2D = 29] = "SAMPLER2D";
t[t.SAMPLER2D_ARRAY = 30] = "SAMPLER2D_ARRAY";
t[t.SAMPLER3D = 31] = "SAMPLER3D";
t[t.SAMPLER_CUBE = 32] = "SAMPLER_CUBE";
t[t.COUNT = 33] = "COUNT";
})(V || (V = {}));
(function(t) {
t[t.UNKNOWN = 0] = "UNKNOWN";
t[t.A8 = 1] = "A8";
t[t.L8 = 2] = "L8";
t[t.LA8 = 3] = "LA8";
t[t.R8 = 4] = "R8";
t[t.R8SN = 5] = "R8SN";
t[t.R8UI = 6] = "R8UI";
t[t.R8I = 7] = "R8I";
t[t.R16F = 8] = "R16F";
t[t.R16UI = 9] = "R16UI";
t[t.R16I = 10] = "R16I";
t[t.R32F = 11] = "R32F";
t[t.R32UI = 12] = "R32UI";
t[t.R32I = 13] = "R32I";
t[t.RG8 = 14] = "RG8";
t[t.RG8SN = 15] = "RG8SN";
t[t.RG8UI = 16] = "RG8UI";
t[t.RG8I = 17] = "RG8I";
t[t.RG16F = 18] = "RG16F";
t[t.RG16UI = 19] = "RG16UI";
t[t.RG16I = 20] = "RG16I";
t[t.RG32F = 21] = "RG32F";
t[t.RG32UI = 22] = "RG32UI";
t[t.RG32I = 23] = "RG32I";
t[t.RGB8 = 24] = "RGB8";
t[t.SRGB8 = 25] = "SRGB8";
t[t.RGB8SN = 26] = "RGB8SN";
t[t.RGB8UI = 27] = "RGB8UI";
t[t.RGB8I = 28] = "RGB8I";
t[t.RGB16F = 29] = "RGB16F";
t[t.RGB16UI = 30] = "RGB16UI";
t[t.RGB16I = 31] = "RGB16I";
t[t.RGB32F = 32] = "RGB32F";
t[t.RGB32UI = 33] = "RGB32UI";
t[t.RGB32I = 34] = "RGB32I";
t[t.RGBA8 = 35] = "RGBA8";
t[t.SRGB8_A8 = 36] = "SRGB8_A8";
t[t.RGBA8SN = 37] = "RGBA8SN";
t[t.RGBA8UI = 38] = "RGBA8UI";
t[t.RGBA8I = 39] = "RGBA8I";
t[t.RGBA16F = 40] = "RGBA16F";
t[t.RGBA16UI = 41] = "RGBA16UI";
t[t.RGBA16I = 42] = "RGBA16I";
t[t.RGBA32F = 43] = "RGBA32F";
t[t.RGBA32UI = 44] = "RGBA32UI";
t[t.RGBA32I = 45] = "RGBA32I";
t[t.R5G6B5 = 46] = "R5G6B5";
t[t.R11G11B10F = 47] = "R11G11B10F";
t[t.RGB5A1 = 48] = "RGB5A1";
t[t.RGBA4 = 49] = "RGBA4";
t[t.RGB10A2 = 50] = "RGB10A2";
t[t.RGB10A2UI = 51] = "RGB10A2UI";
t[t.RGB9E5 = 52] = "RGB9E5";
t[t.D16 = 53] = "D16";
t[t.D16S8 = 54] = "D16S8";
t[t.D24 = 55] = "D24";
t[t.D24S8 = 56] = "D24S8";
t[t.D32F = 57] = "D32F";
t[t.D32F_S8 = 58] = "D32F_S8";
t[t.BC1 = 59] = "BC1";
t[t.BC1_ALPHA = 60] = "BC1_ALPHA";
t[t.BC1_SRGB = 61] = "BC1_SRGB";
t[t.BC1_SRGB_ALPHA = 62] = "BC1_SRGB_ALPHA";
t[t.BC2 = 63] = "BC2";
t[t.BC2_SRGB = 64] = "BC2_SRGB";
t[t.BC3 = 65] = "BC3";
t[t.BC3_SRGB = 66] = "BC3_SRGB";
t[t.BC4 = 67] = "BC4";
t[t.BC4_SNORM = 68] = "BC4_SNORM";
t[t.BC5 = 69] = "BC5";
t[t.BC5_SNORM = 70] = "BC5_SNORM";
t[t.BC6H_UF16 = 71] = "BC6H_UF16";
t[t.BC6H_SF16 = 72] = "BC6H_SF16";
t[t.BC7 = 73] = "BC7";
t[t.BC7_SRGB = 74] = "BC7_SRGB";
t[t.ETC_RGB8 = 75] = "ETC_RGB8";
t[t.ETC2_RGB8 = 76] = "ETC2_RGB8";
t[t.ETC2_SRGB8 = 77] = "ETC2_SRGB8";
t[t.ETC2_RGB8_A1 = 78] = "ETC2_RGB8_A1";
t[t.ETC2_SRGB8_A1 = 79] = "ETC2_SRGB8_A1";
t[t.ETC2_RGBA8 = 80] = "ETC2_RGBA8";
t[t.ETC2_SRGB8_A8 = 81] = "ETC2_SRGB8_A8";
t[t.EAC_R11 = 82] = "EAC_R11";
t[t.EAC_R11SN = 83] = "EAC_R11SN";
t[t.EAC_RG11 = 84] = "EAC_RG11";
t[t.EAC_RG11SN = 85] = "EAC_RG11SN";
t[t.PVRTC_RGB2 = 86] = "PVRTC_RGB2";
t[t.PVRTC_RGBA2 = 87] = "PVRTC_RGBA2";
t[t.PVRTC_RGB4 = 88] = "PVRTC_RGB4";
t[t.PVRTC_RGBA4 = 89] = "PVRTC_RGBA4";
t[t.PVRTC2_2BPP = 90] = "PVRTC2_2BPP";
t[t.PVRTC2_4BPP = 91] = "PVRTC2_4BPP";
})(j || (j = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.TRANSFER_SRC = 1] = "TRANSFER_SRC";
t[t.TRANSFER_DST = 2] = "TRANSFER_DST";
t[t.INDEX = 4] = "INDEX";
t[t.VERTEX = 8] = "VERTEX";
t[t.UNIFORM = 16] = "UNIFORM";
t[t.STORAGE = 32] = "STORAGE";
t[t.INDIRECT = 64] = "INDIRECT";
})(W || (W = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.DEVICE = 1] = "DEVICE";
t[t.HOST = 2] = "HOST";
})(Y || (Y = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.READ = 1] = "READ";
t[t.WRITE = 2] = "WRITE";
})(X || (X = {}));
(function(t) {
t[t.POINT_LIST = 0] = "POINT_LIST";
t[t.LINE_LIST = 1] = "LINE_LIST";
t[t.LINE_STRIP = 2] = "LINE_STRIP";
t[t.LINE_LOOP = 3] = "LINE_LOOP";
t[t.LINE_LIST_ADJACENCY = 4] = "LINE_LIST_ADJACENCY";
t[t.LINE_STRIP_ADJACENCY = 5] = "LINE_STRIP_ADJACENCY";
t[t.ISO_LINE_LIST = 6] = "ISO_LINE_LIST";
t[t.TRIANGLE_LIST = 7] = "TRIANGLE_LIST";
t[t.TRIANGLE_STRIP = 8] = "TRIANGLE_STRIP";
t[t.TRIANGLE_FAN = 9] = "TRIANGLE_FAN";
t[t.TRIANGLE_LIST_ADJACENCY = 10] = "TRIANGLE_LIST_ADJACENCY";
t[t.TRIANGLE_STRIP_ADJACENCY = 11] = "TRIANGLE_STRIP_ADJACENCY";
t[t.TRIANGLE_PATCH_ADJACENCY = 12] = "TRIANGLE_PATCH_ADJACENCY";
t[t.QUAD_PATCH_LIST = 13] = "QUAD_PATCH_LIST";
})(q || (q = {}));
(function(t) {
t[t.FILL = 0] = "FILL";
t[t.POINT = 1] = "POINT";
t[t.LINE = 2] = "LINE";
})(K || (K = {}));
(function(t) {
t[t.GOURAND = 0] = "GOURAND";
t[t.FLAT = 1] = "FLAT";
})(Z || (Z = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.FRONT = 1] = "FRONT";
t[t.BACK = 2] = "BACK";
})($ || ($ = {}));
(function(t) {
t[t.NEVER = 0] = "NEVER";
t[t.LESS = 1] = "LESS";
t[t.EQUAL = 2] = "EQUAL";
t[t.LESS_EQUAL = 3] = "LESS_EQUAL";
t[t.GREATER = 4] = "GREATER";
t[t.NOT_EQUAL = 5] = "NOT_EQUAL";
t[t.GREATER_EQUAL = 6] = "GREATER_EQUAL";
t[t.ALWAYS = 7] = "ALWAYS";
})(Q || (Q = {}));
(function(t) {
t[t.ZERO = 0] = "ZERO";
t[t.KEEP = 1] = "KEEP";
t[t.REPLACE = 2] = "REPLACE";
t[t.INCR = 3] = "INCR";
t[t.DECR = 4] = "DECR";
t[t.INVERT = 5] = "INVERT";
t[t.INCR_WRAP = 6] = "INCR_WRAP";
t[t.DECR_WRAP = 7] = "DECR_WRAP";
})(J || (J = {}));
(function(t) {
t[t.ADD = 0] = "ADD";
t[t.SUB = 1] = "SUB";
t[t.REV_SUB = 2] = "REV_SUB";
t[t.MIN = 3] = "MIN";
t[t.MAX = 4] = "MAX";
})(tt || (tt = {}));
(function(t) {
t[t.ZERO = 0] = "ZERO";
t[t.ONE = 1] = "ONE";
t[t.SRC_ALPHA = 2] = "SRC_ALPHA";
t[t.DST_ALPHA = 3] = "DST_ALPHA";
t[t.ONE_MINUS_SRC_ALPHA = 4] = "ONE_MINUS_SRC_ALPHA";
t[t.ONE_MINUS_DST_ALPHA = 5] = "ONE_MINUS_DST_ALPHA";
t[t.SRC_COLOR = 6] = "SRC_COLOR";
t[t.DST_COLOR = 7] = "DST_COLOR";
t[t.ONE_MINUS_SRC_COLOR = 8] = "ONE_MINUS_SRC_COLOR";
t[t.ONE_MINUS_DST_COLOR = 9] = "ONE_MINUS_DST_COLOR";
t[t.SRC_ALPHA_SATURATE = 10] = "SRC_ALPHA_SATURATE";
t[t.CONSTANT_COLOR = 11] = "CONSTANT_COLOR";
t[t.ONE_MINUS_CONSTANT_COLOR = 12] = "ONE_MINUS_CONSTANT_COLOR";
t[t.CONSTANT_ALPHA = 13] = "CONSTANT_ALPHA";
t[t.ONE_MINUS_CONSTANT_ALPHA = 14] = "ONE_MINUS_CONSTANT_ALPHA";
})(et || (et = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.R = 1] = "R";
t[t.G = 2] = "G";
t[t.B = 4] = "B";
t[t.A = 8] = "A";
t[t.ALL = 15] = "ALL";
})(it || (it = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.POINT = 1] = "POINT";
t[t.LINEAR = 2] = "LINEAR";
t[t.ANISOTROPIC = 3] = "ANISOTROPIC";
})(nt || (nt = {}));
(function(t) {
t[t.WRAP = 0] = "WRAP";
t[t.MIRROR = 1] = "MIRROR";
t[t.CLAMP = 2] = "CLAMP";
t[t.BORDER = 3] = "BORDER";
})(rt || (rt = {}));
(function(t) {
t[t.TEX1D = 0] = "TEX1D";
t[t.TEX2D = 1] = "TEX2D";
t[t.TEX3D = 2] = "TEX3D";
})(st || (st = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.TRANSFER_SRC = 1] = "TRANSFER_SRC";
t[t.TRANSFER_DST = 2] = "TRANSFER_DST";
t[t.SAMPLED = 4] = "SAMPLED";
t[t.STORAGE = 8] = "STORAGE";
t[t.COLOR_ATTACHMENT = 16] = "COLOR_ATTACHMENT";
t[t.DEPTH_STENCIL_ATTACHMENT = 32] = "DEPTH_STENCIL_ATTACHMENT";
t[t.TRANSIENT_ATTACHMENT = 64] = "TRANSIENT_ATTACHMENT";
t[t.INPUT_ATTACHMENT = 128] = "INPUT_ATTACHMENT";
})(ot || (ot = {}));
(function(t) {
t[t.X1 = 0] = "X1";
t[t.X2 = 1] = "X2";
t[t.X4 = 2] = "X4";
t[t.X8 = 3] = "X8";
t[t.X16 = 4] = "X16";
t[t.X32 = 5] = "X32";
t[t.X64 = 6] = "X64";
})(at || (at = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.GEN_MIPMAP = 1] = "GEN_MIPMAP";
t[t.CUBEMAP = 2] = "CUBEMAP";
t[t.BAKUP_BUFFER = 4] = "BAKUP_BUFFER";
})(ct || (ct = {}));
(function(t) {
t[t.TV1D = 0] = "TV1D";
t[t.TV2D = 1] = "TV2D";
t[t.TV3D = 2] = "TV3D";
t[t.CUBE = 3] = "CUBE";
t[t.TV1D_ARRAY = 4] = "TV1D_ARRAY";
t[t.TV2D_ARRAY = 5] = "TV2D_ARRAY";
})(lt || (lt = {}));
(function(t) {
t[t.VERTEX = 0] = "VERTEX";
t[t.HULL = 1] = "HULL";
t[t.DOMAIN = 2] = "DOMAIN";
t[t.GEOMETRY = 3] = "GEOMETRY";
t[t.FRAGMENT = 4] = "FRAGMENT";
t[t.COMPUTE = 5] = "COMPUTE";
t[t.COUNT = 6] = "COUNT";
})(ut || (ut = {}));
(function(t) {
t[t.UNKNOWN = 0] = "UNKNOWN";
t[t.UNIFORM_BUFFER = 1] = "UNIFORM_BUFFER";
t[t.SAMPLER = 2] = "SAMPLER";
t[t.STORAGE_BUFFER = 3] = "STORAGE_BUFFER";
})(ht || (ht = {}));
(function(t) {
t[t.PRIMARY = 0] = "PRIMARY";
t[t.SECONDARY = 1] = "SECONDARY";
})(ft || (ft = {}));
(function(t) {
t[t.LOAD = 0] = "LOAD";
t[t.CLEAR = 1] = "CLEAR";
t[t.DISCARD = 2] = "DISCARD";
})(dt || (dt = {}));
(function(t) {
t[t.STORE = 0] = "STORE";
t[t.DISCARD = 1] = "DISCARD";
})(_t || (_t = {}));
(function(t) {
t[t.UNDEFINED = 0] = "UNDEFINED";
t[t.GENERAL = 1] = "GENERAL";
t[t.COLOR_ATTACHMENT_OPTIMAL = 2] = "COLOR_ATTACHMENT_OPTIMAL";
t[t.DEPTH_STENCIL_ATTACHMENT_OPTIMAL = 3] = "DEPTH_STENCIL_ATTACHMENT_OPTIMAL";
t[t.DEPTH_STENCIL_READONLY_OPTIMAL = 4] = "DEPTH_STENCIL_READONLY_OPTIMAL";
t[t.SHADER_READONLY_OPTIMAL = 5] = "SHADER_READONLY_OPTIMAL";
t[t.TRANSFER_SRC_OPTIMAL = 6] = "TRANSFER_SRC_OPTIMAL";
t[t.TRANSFER_DST_OPTIMAL = 7] = "TRANSFER_DST_OPTIMAL";
t[t.PREINITIALIZED = 8] = "PREINITIALIZED";
t[t.PRESENT_SRC = 9] = "PRESENT_SRC";
})(pt || (pt = {}));
(function(t) {
t[t.GRAPHICS = 0] = "GRAPHICS";
t[t.COMPUTE = 1] = "COMPUTE";
t[t.RAY_TRACING = 2] = "RAY_TRACING";
})(vt || (vt = {}));
(function(t) {
t[t.VIEWPORT = 0] = "VIEWPORT";
t[t.SCISSOR = 1] = "SCISSOR";
t[t.LINE_WIDTH = 2] = "LINE_WIDTH";
t[t.DEPTH_BIAS = 3] = "DEPTH_BIAS";
t[t.BLEND_CONSTANTS = 4] = "BLEND_CONSTANTS";
t[t.DEPTH_BOUNDS = 5] = "DEPTH_BOUNDS";
t[t.STENCIL_WRITE_MASK = 6] = "STENCIL_WRITE_MASK";
t[t.STENCIL_COMPARE_MASK = 7] = "STENCIL_COMPARE_MASK";
})(gt || (gt = {}));
(function(t) {
t[t.FRONT = 0] = "FRONT";
t[t.BACK = 1] = "BACK";
t[t.ALL = 2] = "ALL";
})(mt || (mt = {}));
(function(t) {
t[t.GRAPHICS = 0] = "GRAPHICS";
t[t.COMPUTE = 1] = "COMPUTE";
t[t.TRANSFER = 2] = "TRANSFER";
})(yt || (yt = {}));
(function(t) {
t[t.NONE = 0] = "NONE";
t[t.COLOR = 1] = "COLOR";
t[t.DEPTH = 2] = "DEPTH";
t[t.STENCIL = 4] = "STENCIL";
t[t.DEPTH_STENCIL = 6] = "DEPTH_STENCIL";
t[t.ALL = 7] = "ALL";
})(Et || (Et = {}));
(function(t) {
t[t.DEFAULT = 100] = "DEFAULT";
})(Ct || (Ct = {}));
(function(t) {
t[t.MIN = 0] = "MIN";
t[t.MAX = 255] = "MAX";
t[t.DEFAULT = 128] = "DEFAULT";
})(Tt || (Tt = {}));
var At, xt, bt, St;
(function(t) {
t[t.UBO_GLOBAL = 23] = "UBO_GLOBAL";
t[t.UBO_SHADOW = 22] = "UBO_SHADOW";
t[t.UBO_LOCAL = 21] = "UBO_LOCAL";
t[t.UBO_FORWARD_LIGHTS = 20] = "UBO_FORWARD_LIGHTS";
t[t.UBO_SKINNING = 19] = "UBO_SKINNING";
t[t.UBO_SKINNING_TEXTURE = 18] = "UBO_SKINNING_TEXTURE";
t[t.UBO_UI = 17] = "UBO_UI";
t[t.SAMPLER_JOINTS = 25] = "SAMPLER_JOINTS";
t[t.SAMPLER_ENVIRONMENT = 26] = "SAMPLER_ENVIRONMENT";
t[t.CUSTUM_UBO_BINDING_END_POINT = 17] = "CUSTUM_UBO_BINDING_END_POINT";
t[t.CUSTOM_SAMPLER_BINDING_START_POINT = 30] = "CUSTOM_SAMPLER_BINDING_START_POINT";
})(At || (At = {}));
(function(t) {
t[t.minFilter = 0] = "minFilter";
t[t.magFilter = 1] = "magFilter";
t[t.mipFilter = 2] = "mipFilter";
t[t.addressU = 3] = "addressU";
t[t.addressV = 4] = "addressV";
t[t.addressW = 5] = "addressW";
t[t.maxAnisotropy = 6] = "maxAnisotropy";
t[t.cmpFunc = 7] = "cmpFunc";
t[t.minLOD = 8] = "minLOD";
t[t.maxLOD = 9] = "maxLOD";
t[t.mipLODBias = 10] = "mipLODBias";
t[t.borderColor = 11] = "borderColor";
t[t.total = 15] = "total";
})(St || (St = {}));
var Rt = {};
Rt[Rt.bool = V.BOOL] = "bool";
Rt[Rt.int = V.INT] = "int";
Rt[Rt.ivec2 = V.INT2] = "ivec2invTypeParams";
Rt[Rt.ivec3 = V.INT3] = "ivec3";
Rt[Rt.ivec4 = V.INT4] = "ivec4";
Rt[Rt.float = V.FLOAT] = "float";
Rt[Rt.vec2 = V.FLOAT2] = "vec2";
Rt[Rt.vec3 = V.FLOAT3] = "vec3";
Rt[Rt.vec4 = V.FLOAT4] = "vec4";
Rt[Rt.mat2 = V.MAT2] = "mat2";
Rt[Rt.mat3 = V.MAT3] = "mat3";
Rt[Rt.mat4 = V.MAT4] = "mat4";
Rt[Rt.sampler2D = V.SAMPLER2D] = "sampler2D";
Rt[Rt.samplerCube = V.SAMPLER_CUBE] = "samplerCube";
var wt = ((xt = {})[V.BOOL] = 4, xt[V.INT] = 4, xt[V.INT2] = 8, xt[V.INT3] = 12, 
xt[V.INT4] = 16, xt[V.FLOAT] = 4, xt[V.FLOAT2] = 8, xt[V.FLOAT3] = 12, xt[V.FLOAT4] = 16, 
xt[V.MAT2] = 16, xt[V.MAT3] = 36, xt[V.MAT4] = 64, xt[V.SAMPLER2D] = 4, xt[V.SAMPLER_CUBE] = 4, 
xt), Lt = ((bt = {})[V.BOOL] = j.R32I, bt[V.INT] = j.R32I, bt[V.INT2] = j.RG32I, 
bt[V.INT3] = j.RGB32I, bt[V.INT4] = j.RGBA32I, bt[V.FLOAT] = j.R32F, bt[V.FLOAT2] = j.RG32F, 
bt[V.FLOAT3] = j.RGB32F, bt[V.FLOAT4] = j.RGBA32F, bt), Ot = {
BACK: H,
FRONT: k,
NONE: U,
ADD: _,
SUB: p,
REV_SUB: v,
ZERO: g,
ONE: m,
SRC_COLOR: y,
ONE_MINUS_SRC_COLOR: E,
DST_COLOR: C,
ONE_MINUS_DST_COLOR: T,
SRC_ALPHA: A,
ONE_MINUS_SRC_ALPHA: x,
DST_ALPHA: b,
ONE_MINUS_DST_ALPHA: S,
CONSTANT_COLOR: R,
ONE_MINUS_CONSTANT_COLOR: w,
CONSTANT_ALPHA: L,
ONE_MINUS_CONSTANT_ALPHA: O,
SRC_ALPHA_SATURATE: M,
NEVER: o,
LESS: a,
EQUAL: c,
LEQUAL: l,
GREATER: u,
NOTEQUAL: h,
GEQUAL: f,
ALWAYS: d,
KEEP: I,
REPLACE: D,
INCR: N,
INCR_WRAP: P,
DECR: F,
DECR_WRAP: B,
INVERT: z
};
Object.assign(Ot, Ct);
var Mt = {
murmurhash2_32_gc: function(t, e) {
for (var i, n = t.length, r = e ^ n, s = 0; n >= 4; ) {
i = 1540483477 * (65535 & (i = 255 & t.charCodeAt(s) | (255 & t.charCodeAt(++s)) << 8 | (255 & t.charCodeAt(++s)) << 16 | (255 & t.charCodeAt(++s)) << 24)) + ((1540483477 * (i >>> 16) & 65535) << 16);
r = 1540483477 * (65535 & r) + ((1540483477 * (r >>> 16) & 65535) << 16) ^ (i = 1540483477 * (65535 & (i ^= i >>> 24)) + ((1540483477 * (i >>> 16) & 65535) << 16));
n -= 4;
++s;
}
switch (n) {
case 3:
r ^= (255 & t.charCodeAt(s + 2)) << 16;

case 2:
r ^= (255 & t.charCodeAt(s + 1)) << 8;

case 1:
r = 1540483477 * (65535 & (r ^= 255 & t.charCodeAt(s))) + ((1540483477 * (r >>> 16) & 65535) << 16);
}
r = 1540483477 * (65535 & (r ^= r >>> 13)) + ((1540483477 * (r >>> 16) & 65535) << 16);
return (r ^= r >>> 15) >>> 0;
},
SamplerInfoIndex: St,
effectStructure: {
$techniques: [ {
$passes: [ {
depthStencilState: {},
rasterizerState: {},
blendState: {
targets: [ {} ]
},
properties: {
any: {
sampler: {},
inspector: {}
}
}
} ]
} ]
},
typeMap: Rt,
sizeMap: wt,
formatMap: Lt,
passParams: Ot,
RenderQueue: {
OPAQUE: 0,
TRANSPARENT: 1,
OVERLAY: 2
},
RenderPriority: Tt,
GFXGetTypeSize: function(t) {
switch (t) {
case V.BOOL:
case V.INT:
case V.UINT:
case V.FLOAT:
return 4;

case V.BOOL2:
case V.INT2:
case V.UINT2:
case V.FLOAT2:
return 8;

case V.BOOL3:
case V.INT3:
case V.UINT3:
case V.FLOAT3:
return 12;

case V.BOOL4:
case V.INT4:
case V.UINT4:
case V.FLOAT4:
case V.MAT2:
return 16;

case V.MAT2X3:
return 24;

case V.MAT2X4:
return 32;

case V.MAT3X2:
return 24;

case V.MAT3:
return 36;

case V.MAT3X4:
return 48;

case V.MAT4X2:
case V.MAT4X2:
return 32;

case V.MAT4:
return 64;

case V.SAMPLER1D:
case V.SAMPLER1D_ARRAY:
case V.SAMPLER2D:
case V.SAMPLER2D_ARRAY:
case V.SAMPLER3D:
case V.SAMPLER_CUBE:
return 4;

default:
return 0;
}
},
UniformBinding: At
};
e.exports = Mt;
}), {} ],
228: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = 0, r = {};
i.default = {
addStage: function(t) {
if (void 0 === r[t]) {
var e = 1 << n;
r[t] = e;
n += 1;
window.renderer.addStage(t);
}
},
stageID: function(t) {
var e = r[t];
return void 0 === e ? -1 : e;
},
stageIDs: function(t) {
for (var e = 0, i = 0; i < t.length; ++i) {
var n = r[t[i]];
void 0 !== n && (e |= n);
}
return e;
}
};
e.exports = i.default;
}), {} ],
229: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = c(t("../config")), r = c(t("../core/pass")), s = c(t("../core/technique")), o = t("../types"), a = c(t("../enums"));
c(t("../gfx"));
function c(t) {
return t && t.__esModule ? t : {
default: t
};
}
function l(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var u = (function() {
function t(e, i) {
var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}, r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {}, s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : [];
l(this, t);
this._name = e;
this._techniques = i;
this._properties = n;
this._defines = r;
this._dependencies = s;
}
t.prototype.clear = function() {
this._techniques.length = 0;
this._properties = {};
this._defines = {};
};
t.prototype.setCullMode = function(t) {
for (var e = this._techniques[0].passes, i = 0; i < e.length; i++) e[i].setCullMode(t);
};
t.prototype.setDepth = function(t, e, i) {
for (var n = this._techniques[0].passes, r = 0; r < n.length; r++) n[r].setDepth(t, e, i);
};
t.prototype.setBlend = function(t, e, i, n, r, s, o, a) {
for (var c = this._techniques[0].passes, l = 0; l < c.length; l++) {
c[l].setBlend(t, e, i, n, r, s, o, a);
}
};
t.prototype.setStencilEnabled = function(t) {
for (var e = this._techniques[0].passes, i = 0; i < e.length; i++) e[i].setStencilEnabled(t);
};
t.prototype.setStencil = function(t, e, i, n, r, s, o, a) {
for (var c = this._techniques[0].passes, l = 0; l < c.length; ++l) {
var u = c[l];
u.setStencilFront(t, e, i, n, r, s, o, a);
u.setStencilBack(t, e, i, n, r, s, o, a);
}
};
t.prototype.getTechnique = function(t) {
var e = n.default.stageID(t);
if (-1 === e) return null;
for (var i = 0; i < this._techniques.length; ++i) {
var r = this._techniques[i];
if (r.stageIDs & e) return r;
}
return null;
};
t.prototype.getProperty = function(t) {
if (!this._properties[t]) {
cc.warn(this._name + " : Failed to get property " + t + ", property not found.");
return null;
}
return this._properties[t].value;
};
t.prototype.setProperty = function(t, e) {
var i = this._properties[t];
if (i) if (Array.isArray(e)) {
var n = i.value;
if (n.length !== e.length) {
cc.warn(this._name + " : Failed to set property " + t + ", property length not correct.");
return;
}
for (var r = 0; r < e.length; r++) n[r] = e[r];
} else if (i.type === a.default.PARAM_TEXTURE_2D) i.value = e ? e.getImpl() : null; else if (e.array) e.array(i.value); else {
e && "object" == typeof e && cc.warn("Set effect property " + this._name + " warning : should transform object to ArrayBuffer");
i.value = e;
} else cc.warn(this._name + " : Failed to set property " + t + ", property not found.");
};
t.prototype.updateHash = function(t) {};
t.prototype.getDefine = function(t) {
var e = this._defines[t];
void 0 === e && cc.warn(this._name + " : Failed to get define " + t + ", define not found.");
return e;
};
t.prototype.define = function(t, e) {
void 0 !== this._defines[t] ? this._defines[t] = e : cc.warn(this._name + " : Failed to set define " + t + ", define not found.");
};
t.prototype.extractProperties = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
Object.assign(t, this._properties);
return t;
};
t.prototype.extractDefines = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
Object.assign(t, this._defines);
return t;
};
t.prototype.extractDependencies = function() {
for (var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, e = 0; e < this._dependencies.length; ++e) {
var i = this._dependencies[e];
t[i.define] = i.extension;
}
return t;
};
t.prototype.clone = function() {
var t = this.extractDefines({}), e = this.extractDependencies({}), i = {}, n = this._properties;
for (var r in n) {
var s = n[r], o = i[r] = {}, a = s.value;
Array.isArray(a) ? o.value = a.concat() : ArrayBuffer.isView(a) ? o.value = new a.__proto__.constructor(a) : o.value = a;
for (var c in s) "value" !== c && (o[c] = s[c]);
}
for (var l = [], u = 0; u < this._techniques.length; u++) l.push(this._techniques[u].clone());
return new cc.Effect(this._name, l, i, t, e);
};
return t;
})(), h = function(t) {
var e = [], i = cc.renderer._forward._programLib;
t.techniques.forEach((function(t) {
t.passes.forEach((function(t) {
e.push(i.getTemplate(t.program));
}));
}));
return e;
};
function f(t, e) {
var i = {}, n = {};
t.techniques.forEach((function(t) {
t.passes.forEach((function(t) {
Object.assign(n, t.properties);
}));
}));
var r = function(r) {
for (var s = n[r], o = void 0, c = 0; c < e.length && !(o = e[c].uniforms.find((function(t) {
return t.name === r;
}))); c++) ;
if (!o) {
cc.warn(t.name + " : illegal property: " + r + ", myabe defined a not used property");
return "continue";
}
i[r] = Object.assign({}, s);
i[r].value = s.type === a.default.PARAM_TEXTURE_2D ? null : new Float32Array(s.value);
};
for (var s in n) r(s);
return i;
}
u.parseTechniques = function(t) {
for (var e = t.techniques.length, i = new Array(e), n = 0; n < e; ++n) {
var o = t.techniques[n];
o.stages || (o.stages = [ "opaque" ]);
for (var a = o.passes.length, c = new Array(a), l = 0; l < a; ++l) {
var u = o.passes[l];
c[l] = new r.default(u.program);
u.rasterizerState && c[l].setCullMode(u.rasterizerState.cullMode);
var h = u.blendState && u.blendState.targets[0];
h && c[l].setBlend(h.blend, h.blendEq, h.blendSrc, h.blendDst, h.blendAlphaEq, h.blendSrcAlpha, h.blendDstAlpha, h.blendColor);
var f = u.depthStencilState;
if (f) {
c[l].setDepth(f.depthTest, f.depthWrite, f.depthFunc);
c[l].setStencilFront(f.stencilTest, f.stencilFuncFront, f.stencilRefFront, f.stencilMaskFront, f.stencilFailOpFront, f.stencilZFailOpFront, f.stencilZPassOpFront, f.stencilWriteMaskFront);
c[l].setStencilBack(f.stencilTest, f.stencilFuncBack, f.stencilRefBack, f.stencilMaskBack, f.stencilFailOpBack, f.stencilZFailOpBack, f.stencilZPassOpBack, f.stencilWriteMaskBack);
}
}
i[n] = new s.default(o.stages, c, o.layer);
}
return i;
};
u.parseEffect = function(t) {
var e = u.parseTechniques(t), i = h(t), n = f(t, i), r = {}, s = {};
i.forEach((function(t) {
t.uniforms.forEach((function(t) {
var e = t.name, i = r[e] = Object.assign({}, t);
n[e] ? i.value = n[e].value : i.value = o.enums2default[t.type];
}));
t.defines.forEach((function(t) {
s[t.name] = o.enums2default[t.type];
}));
}));
var a = i.reduce((function(t, e) {
return t.concat(e.extensions);
}), []);
a = a.map((function(t) {
return Object.assign({}, t);
}));
return new cc.Effect(t.name, e, r, s, a, t);
};
0;
cc.Effect = u;
i.default = u;
e.exports = i.default;
}), {
"../config": 228,
"../core/pass": 231,
"../core/technique": 232,
"../enums": 233,
"../gfx": 234,
"../types": 238
} ],
230: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function() {
function t(t, e) {
for (var i = 0; i < e.length; i++) {
var n = e[i];
n.enumerable = n.enumerable || !1;
n.configurable = !0;
"value" in n && (n.writable = !0);
Object.defineProperty(t, n.key, n);
}
}
return function(e, i, n) {
i && t(e.prototype, i);
n && t(e, n);
return e;
};
})(), r = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../gfx"));
function s(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var o = (function() {
function t(e, i) {
var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : r.default.PT_TRIANGLES;
s(this, t);
this._vertexBuffer = e;
this._indexBuffer = i;
this._primitiveType = n;
this._start = 0;
this._count = -1;
}
n(t, [ {
key: "count",
get: function() {
return -1 !== this._count ? this._count : this._indexBuffer ? this._indexBuffer.count : this._vertexBuffer ? this._vertexBuffer.count : 0;
}
} ]);
return t;
})();
i.default = o;
e.exports = i.default;
}), {
"../gfx": 234
} ],
231: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../gfx"));
function r(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var s = (function() {
function t(e) {
r(this, t);
this._programName = e;
this._cullMode = n.default.CULL_BACK;
this._blend = !1;
this._blendEq = n.default.BLEND_FUNC_ADD;
this._blendAlphaEq = n.default.BLEND_FUNC_ADD;
this._blendSrc = n.default.BLEND_SRC_ALPHA;
this._blendDst = n.default.BLEND_ONE_MINUS_SRC_ALPHA;
this._blendSrcAlpha = n.default.BLEND_SRC_ALPHA;
this._blendDstAlpha = n.default.BLEND_ONE_MINUS_SRC_ALPHA;
this._blendColor = 4294967295;
this._depthTest = !1;
this._depthWrite = !1;
this._depthFunc = n.default.DS_FUNC_LESS, this._stencilTest = n.default.STENCIL_INHERIT;
this._stencilFuncFront = n.default.DS_FUNC_ALWAYS;
this._stencilRefFront = 0;
this._stencilMaskFront = 255;
this._stencilFailOpFront = n.default.STENCIL_OP_KEEP;
this._stencilZFailOpFront = n.default.STENCIL_OP_KEEP;
this._stencilZPassOpFront = n.default.STENCIL_OP_KEEP;
this._stencilWriteMaskFront = 255;
this._stencilFuncBack = n.default.DS_FUNC_ALWAYS;
this._stencilRefBack = 0;
this._stencilMaskBack = 255;
this._stencilFailOpBack = n.default.STENCIL_OP_KEEP;
this._stencilZFailOpBack = n.default.STENCIL_OP_KEEP;
this._stencilZPassOpBack = n.default.STENCIL_OP_KEEP;
this._stencilWriteMaskBack = 255;
}
t.prototype.setCullMode = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.default.CULL_BACK;
this._cullMode = t;
};
t.prototype.setBlend = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.default.BLEND_FUNC_ADD, i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : n.default.BLEND_SRC_ALPHA, r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : n.default.BLEND_ONE_MINUS_SRC_ALPHA, s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : n.default.BLEND_FUNC_ADD, o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : n.default.BLEND_SRC_ALPHA, a = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : n.default.BLEND_ONE_MINUS_SRC_ALPHA, c = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 4294967295;
this._blend = t;
this._blendEq = e;
this._blendSrc = i;
this._blendDst = r;
this._blendAlphaEq = s;
this._blendSrcAlpha = o;
this._blendDstAlpha = a;
this._blendColor = c;
};
t.prototype.setDepth = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : n.default.DS_FUNC_LESS;
this._depthTest = t;
this._depthWrite = e;
this._depthFunc = i;
};
t.prototype.setStencilFront = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.default.STENCIL_INHERIT, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.default.DS_FUNC_ALWAYS, i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 255, s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : n.default.STENCIL_OP_KEEP, o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : n.default.STENCIL_OP_KEEP, a = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : n.default.STENCIL_OP_KEEP, c = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 255;
this._stencilTest = t;
this._stencilFuncFront = e;
this._stencilRefFront = i;
this._stencilMaskFront = r;
this._stencilFailOpFront = s;
this._stencilZFailOpFront = o;
this._stencilZPassOpFront = a;
this._stencilWriteMaskFront = c;
};
t.prototype.setStencilEnabled = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.default.STENCIL_INHERIT;
this._stencilTest = t;
};
t.prototype.setStencilBack = function() {
var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n.default.STENCIL_INHERIT, e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : n.default.DS_FUNC_ALWAYS, i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0, r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 255, s = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : n.default.STENCIL_OP_KEEP, o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : n.default.STENCIL_OP_KEEP, a = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : n.default.STENCIL_OP_KEEP, c = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 255;
this._stencilTest = t;
this._stencilFuncBack = e;
this._stencilRefBack = i;
this._stencilMaskBack = r;
this._stencilFailOpBack = s;
this._stencilZFailOpBack = o;
this._stencilZPassOpBack = a;
this._stencilWriteMaskBack = c;
};
t.prototype.clone = function() {
var e = new t(this._programName);
Object.assign(e, this);
return e;
};
return t;
})();
i.default = s;
e.exports = i.default;
}), {
"../gfx": 234
} ],
232: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function() {
function t(t, e) {
for (var i = 0; i < e.length; i++) {
var n = e[i];
n.enumerable = n.enumerable || !1;
n.configurable = !0;
"value" in n && (n.writable = !0);
Object.defineProperty(t, n.key, n);
}
}
return function(e, i, n) {
i && t(e.prototype, i);
n && t(e, n);
return e;
};
})(), r = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("../config"));
function s(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var o = 0, a = (function() {
function t(e, i) {
var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
s(this, t);
this._id = o++;
this._stages = e;
this._stageIDs = r.default.stageIDs(e);
this._passes = i;
this._layer = n;
}
t.prototype.setStages = function(t) {
this._stageIDs = r.default.stageIDs(t);
};
t.prototype.clone = function() {
for (var e = [], i = 0; i < this._passes.length; i++) e.push(this._passes[i].clone());
return new t(this._stages, e, this._layer);
};
n(t, [ {
key: "passes",
get: function() {
return this._passes;
}
}, {
key: "stageIDs",
get: function() {
return this._stageIDs;
}
} ]);
return t;
})();
i.default = a;
e.exports = i.default;
}), {
"../config": 228
} ],
233: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
var n = t("./build/mappings");
i.default = {
PROJ_PERSPECTIVE: 0,
PROJ_ORTHO: 1,
LIGHT_DIRECTIONAL: 0,
LIGHT_POINT: 1,
LIGHT_SPOT: 2,
LIGHT_AMBIENT: 3,
SHADOW_NONE: 0,
SHADOW_HARD: 1,
SHADOW_SOFT: 2,
PARAM_INT: n.typeMap.int,
PARAM_INT2: n.typeMap.ivec2,
PARAM_INT3: n.typeMap.ivec3,
PARAM_INT4: n.typeMap.ivec4,
PARAM_FLOAT: n.typeMap.float,
PARAM_FLOAT2: n.typeMap.vec2,
PARAM_FLOAT3: n.typeMap.vec3,
PARAM_FLOAT4: n.typeMap.vec4,
PARAM_MAT2: n.typeMap.mat2,
PARAM_MAT3: n.typeMap.mat3,
PARAM_MAT4: n.typeMap.mat4,
PARAM_TEXTURE_2D: n.typeMap.sampler2D,
PARAM_TEXTURE_CUBE: n.typeMap.samplerCube,
CLEAR_COLOR: 1,
CLEAR_DEPTH: 2,
CLEAR_STENCIL: 4,
CLEAR_SKYBOX: 8,
BUFFER_VIEW_INT8: 0,
BUFFER_VIEW_UINT8: 1,
BUFFER_VIEW_INT16: 2,
BUFFER_VIEW_UINT16: 3,
BUFFER_VIEW_INT32: 4,
BUFFER_VIEW_UINT32: 5,
BUFFER_VIEW_FLOAT32: 6
};
e.exports = i.default;
}), {
"./build/mappings": 227
} ],
234: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
t("./enums");
var n = null;
n = window.gfx;
i.default = n;
cc.gfx = n;
e.exports = i.default;
}), {
"./device": void 0,
"./enums": void 0,
"./frame-buffer": void 0,
"./index-buffer": void 0,
"./program": void 0,
"./render-buffer": void 0,
"./texture": void 0,
"./texture-2d": void 0,
"./texture-cube": void 0,
"./vertex-buffer": void 0,
"./vertex-format": void 0
} ],
235: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = void 0;
var n = (function() {
function t(t, e) {
for (var i = 0; i < e.length; i++) {
var n = e[i];
n.enumerable = n.enumerable || !1;
n.configurable = !0;
"value" in n && (n.writable = !0);
Object.defineProperty(t, n.key, n);
}
}
return function(e, i, n) {
i && t(e.prototype, i);
n && t(e, n);
return e;
};
})(), r = (function(t) {
return t && t.__esModule ? t : {
default: t
};
})(t("./timsort"));
function s(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var o = (function() {
function t(e, i) {
s(this, t);
this._fn = e;
this._count = 0;
this._data = new Array(i);
for (var n = 0; n < i; ++n) this._data[n] = e();
}
t.prototype.reset = function() {
this._count = 0;
};
t.prototype.resize = function(t) {
if (t > this._data.length) for (var e = this._data.length; e < t; ++e) this._data[e] = this._fn();
};
t.prototype.add = function() {
this._count >= this._data.length && this.resize(2 * this._data.length);
return this._data[this._count++];
};
t.prototype.remove = function(t) {
if (!(t >= this._count)) {
var e = this._count - 1, i = this._data[t];
this._data[t] = this._data[e];
this._data[e] = i;
this._count -= 1;
}
};
t.prototype.sort = function(t) {
return (0, r.default)(this._data, 0, this._count, t);
};
n(t, [ {
key: "length",
get: function() {
return this._count;
}
}, {
key: "data",
get: function() {
return this._data;
}
} ]);
return t;
})();
i.default = o;
e.exports = i.default;
}), {
"./timsort": 236
} ],
236: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = function(t, e, i, n) {
if (!Array.isArray(t)) throw new TypeError("Can only sort arrays");
void 0 === e && (e = 0);
void 0 === i && (i = t.length);
void 0 === n && (n = l);
var s = i - e;
if (!(s < 2)) {
var o = 0;
if (s < r) d(t, e, i, e + (o = h(t, e, i, n)), n); else {
var a = new v(t, n), c = u(s);
do {
if ((o = h(t, e, i, n)) < c) {
var f = s;
f > c && (f = c);
d(t, e, e + f, e + o, n);
o = f;
}
a.pushRun(e, o);
a.mergeRuns();
s -= o;
e += o;
} while (0 !== s);
a.forceMergeRuns();
}
}
};
function n(t, e) {
if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
var r = 32, s = 7, o = 256, a = [ 1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9 ];
function c(t) {
return t < 1e5 ? t < 100 ? t < 10 ? 0 : 1 : t < 1e4 ? t < 1e3 ? 2 : 3 : 4 : t < 1e7 ? t < 1e6 ? 5 : 6 : t < 1e9 ? t < 1e8 ? 7 : 8 : 9;
}
function l(t, e) {
if (t === e) return 0;
if (~~t === t && ~~e === e) {
if (0 === t || 0 === e) return t < e ? -1 : 1;
if (t < 0 || e < 0) {
if (e >= 0) return -1;
if (t >= 0) return 1;
t = -t;
e = -e;
}
var i = c(t), n = c(e), r = 0;
if (i < n) {
t *= a[n - i - 1];
e /= 10;
r = -1;
} else if (i > n) {
e *= a[i - n - 1];
t /= 10;
r = 1;
}
return t === e ? r : t < e ? -1 : 1;
}
var s = String(t), o = String(e);
return s === o ? 0 : s < o ? -1 : 1;
}
function u(t) {
for (var e = 0; t >= r; ) {
e |= 1 & t;
t >>= 1;
}
return t + e;
}
function h(t, e, i, n) {
var r = e + 1;
if (r === i) return 1;
if (n(t[r++], t[e]) < 0) {
for (;r < i && n(t[r], t[r - 1]) < 0; ) r++;
f(t, e, r);
} else for (;r < i && n(t[r], t[r - 1]) >= 0; ) r++;
return r - e;
}
function f(t, e, i) {
i--;
for (;e < i; ) {
var n = t[e];
t[e++] = t[i];
t[i--] = n;
}
}
function d(t, e, i, n, r) {
n === e && n++;
for (;n < i; n++) {
for (var s = t[n], o = e, a = n; o < a; ) {
var c = o + a >>> 1;
r(s, t[c]) < 0 ? a = c : o = c + 1;
}
var l = n - o;
switch (l) {
case 3:
t[o + 3] = t[o + 2];

case 2:
t[o + 2] = t[o + 1];

case 1:
t[o + 1] = t[o];
break;

default:
for (;l > 0; ) {
t[o + l] = t[o + l - 1];
l--;
}
}
t[o] = s;
}
}
function _(t, e, i, n, r, s) {
var o = 0, a = 0, c = 1;
if (s(t, e[i + r]) > 0) {
a = n - r;
for (;c < a && s(t, e[i + r + c]) > 0; ) {
o = c;
(c = 1 + (c << 1)) <= 0 && (c = a);
}
c > a && (c = a);
o += r;
c += r;
} else {
a = r + 1;
for (;c < a && s(t, e[i + r - c]) <= 0; ) {
o = c;
(c = 1 + (c << 1)) <= 0 && (c = a);
}
c > a && (c = a);
var l = o;
o = r - c;
c = r - l;
}
o++;
for (;o < c; ) {
var u = o + (c - o >>> 1);
s(t, e[i + u]) > 0 ? o = u + 1 : c = u;
}
return c;
}
function p(t, e, i, n, r, s) {
var o = 0, a = 0, c = 1;
if (s(t, e[i + r]) < 0) {
a = r + 1;
for (;c < a && s(t, e[i + r - c]) < 0; ) {
o = c;
(c = 1 + (c << 1)) <= 0 && (c = a);
}
c > a && (c = a);
var l = o;
o = r - c;
c = r - l;
} else {
a = n - r;
for (;c < a && s(t, e[i + r + c]) >= 0; ) {
o = c;
(c = 1 + (c << 1)) <= 0 && (c = a);
}
c > a && (c = a);
o += r;
c += r;
}
o++;
for (;o < c; ) {
var u = o + (c - o >>> 1);
s(t, e[i + u]) < 0 ? c = u : o = u + 1;
}
return c;
}
var v = (function() {
function t(e, i) {
n(this, t);
this.array = e;
this.compare = i;
this.minGallop = s;
this.length = e.length;
this.tmpStorageLength = o;
this.length < 2 * o && (this.tmpStorageLength = this.length >>> 1);
this.tmp = new Array(this.tmpStorageLength);
this.stackLength = this.length < 120 ? 5 : this.length < 1542 ? 10 : this.length < 119151 ? 19 : 40;
this.runStart = new Array(this.stackLength);
this.runLength = new Array(this.stackLength);
this.stackSize = 0;
}
t.prototype.pushRun = function(t, e) {
this.runStart[this.stackSize] = t;
this.runLength[this.stackSize] = e;
this.stackSize += 1;
};
t.prototype.mergeRuns = function() {
for (;this.stackSize > 1; ) {
var t = this.stackSize - 2;
if (t >= 1 && this.runLength[t - 1] <= this.runLength[t] + this.runLength[t + 1] || t >= 2 && this.runLength[t - 2] <= this.runLength[t] + this.runLength[t - 1]) this.runLength[t - 1] < this.runLength[t + 1] && t--; else if (this.runLength[t] > this.runLength[t + 1]) break;
this.mergeAt(t);
}
};
t.prototype.forceMergeRuns = function() {
for (;this.stackSize > 1; ) {
var t = this.stackSize - 2;
t > 0 && this.runLength[t - 1] < this.runLength[t + 1] && t--;
this.mergeAt(t);
}
};
t.prototype.mergeAt = function(t) {
var e = this.compare, i = this.array, n = this.runStart[t], r = this.runLength[t], s = this.runStart[t + 1], o = this.runLength[t + 1];
this.runLength[t] = r + o;
if (t === this.stackSize - 3) {
this.runStart[t + 1] = this.runStart[t + 2];
this.runLength[t + 1] = this.runLength[t + 2];
}
this.stackSize--;
var a = p(i[s], i, n, r, 0, e);
n += a;
0 !== (r -= a) && 0 !== (o = _(i[n + r - 1], i, s, o, o - 1, e)) && (r <= o ? this.mergeLow(n, r, s, o) : this.mergeHigh(n, r, s, o));
};
t.prototype.mergeLow = function(t, e, i, n) {
var r = this.compare, o = this.array, a = this.tmp, c = 0;
for (c = 0; c < e; c++) a[c] = o[t + c];
var l = 0, u = i, h = t;
o[h++] = o[u++];
if (0 != --n) if (1 !== e) {
for (var f = this.minGallop; ;) {
var d = 0, v = 0, g = !1;
do {
if (r(o[u], a[l]) < 0) {
o[h++] = o[u++];
v++;
d = 0;
if (0 == --n) {
g = !0;
break;
}
} else {
o[h++] = a[l++];
d++;
v = 0;
if (1 == --e) {
g = !0;
break;
}
}
} while ((d | v) < f);
if (g) break;
do {
if (0 !== (d = p(o[u], a, l, e, 0, r))) {
for (c = 0; c < d; c++) o[h + c] = a[l + c];
h += d;
l += d;
if ((e -= d) <= 1) {
g = !0;
break;
}
}
o[h++] = o[u++];
if (0 == --n) {
g = !0;
break;
}
if (0 !== (v = _(a[l], o, u, n, 0, r))) {
for (c = 0; c < v; c++) o[h + c] = o[u + c];
h += v;
u += v;
if (0 === (n -= v)) {
g = !0;
break;
}
}
o[h++] = a[l++];
if (1 == --e) {
g = !0;
break;
}
f--;
} while (d >= s || v >= s);
if (g) break;
f < 0 && (f = 0);
f += 2;
}
this.minGallop = f;
f < 1 && (this.minGallop = 1);
if (1 === e) {
for (c = 0; c < n; c++) o[h + c] = o[u + c];
o[h + n] = a[l];
} else {
if (0 === e) throw new Error("mergeLow preconditions were not respected");
for (c = 0; c < e; c++) o[h + c] = a[l + c];
}
} else {
for (c = 0; c < n; c++) o[h + c] = o[u + c];
o[h + n] = a[l];
} else for (c = 0; c < e; c++) o[h + c] = a[l + c];
};
t.prototype.mergeHigh = function(t, e, i, n) {
var r = this.compare, o = this.array, a = this.tmp, c = 0;
for (c = 0; c < n; c++) a[c] = o[i + c];
var l = t + e - 1, u = n - 1, h = i + n - 1, f = 0, d = 0;
o[h--] = o[l--];
if (0 != --e) if (1 !== n) {
for (var v = this.minGallop; ;) {
var g = 0, m = 0, y = !1;
do {
if (r(a[u], o[l]) < 0) {
o[h--] = o[l--];
g++;
m = 0;
if (0 == --e) {
y = !0;
break;
}
} else {
o[h--] = a[u--];
m++;
g = 0;
if (1 == --n) {
y = !0;
break;
}
}
} while ((g | m) < v);
if (y) break;
do {
if (0 !== (g = e - p(a[u], o, t, e, e - 1, r))) {
e -= g;
d = (h -= g) + 1;
f = (l -= g) + 1;
for (c = g - 1; c >= 0; c--) o[d + c] = o[f + c];
if (0 === e) {
y = !0;
break;
}
}
o[h--] = a[u--];
if (1 == --n) {
y = !0;
break;
}
if (0 !== (m = n - _(o[l], a, 0, n, n - 1, r))) {
n -= m;
d = (h -= m) + 1;
f = (u -= m) + 1;
for (c = 0; c < m; c++) o[d + c] = a[f + c];
if (n <= 1) {
y = !0;
break;
}
}
o[h--] = o[l--];
if (0 == --e) {
y = !0;
break;
}
v--;
} while (g >= s || m >= s);
if (y) break;
v < 0 && (v = 0);
v += 2;
}
this.minGallop = v;
v < 1 && (this.minGallop = 1);
if (1 === n) {
d = (h -= e) + 1;
f = (l -= e) + 1;
for (c = e - 1; c >= 0; c--) o[d + c] = o[f + c];
o[h] = a[u];
} else {
if (0 === n) throw new Error("mergeHigh preconditions were not respected");
f = h - (n - 1);
for (c = 0; c < n; c++) o[f + c] = a[c];
}
} else {
d = (h -= e) + 1;
f = (l -= e) + 1;
for (c = e - 1; c >= 0; c--) o[d + c] = o[f + c];
o[h] = a[u];
} else {
f = h - (n - 1);
for (c = 0; c < n; c++) o[f + c] = a[c];
}
};
return t;
})();
e.exports = i.default;
}), {} ],
237: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.default = function(t, e) {
var i, n = t.length, r = e ^ n, s = 0;
for (;n >= 4; ) {
i = 1540483477 * (65535 & (i = 255 & t.charCodeAt(s) | (255 & t.charCodeAt(++s)) << 8 | (255 & t.charCodeAt(++s)) << 16 | (255 & t.charCodeAt(++s)) << 24)) + ((1540483477 * (i >>> 16) & 65535) << 16);
r = 1540483477 * (65535 & r) + ((1540483477 * (r >>> 16) & 65535) << 16) ^ (i = 1540483477 * (65535 & (i ^= i >>> 24)) + ((1540483477 * (i >>> 16) & 65535) << 16));
n -= 4;
++s;
}
switch (n) {
case 3:
r ^= (255 & t.charCodeAt(s + 2)) << 16;

case 2:
r ^= (255 & t.charCodeAt(s + 1)) << 8;

case 1:
r = 1540483477 * (65535 & (r ^= 255 & t.charCodeAt(s))) + ((1540483477 * (r >>> 16) & 65535) << 16);
}
r = 1540483477 * (65535 & (r ^= r >>> 13)) + ((1540483477 * (r >>> 16) & 65535) << 16);
return (r ^= r >>> 15) >>> 0;
};
e.exports = i.default;
}), {} ],
238: [ (function(t, e, i) {
"use strict";
i.__esModule = !0;
i.getClassName = i.getInstanceCtor = i.getInstanceType = i.enums2default = i.ctor2enums = void 0;
var n, r, s, o;
i.getInspectorProps = function(t) {
var e = {
type: t.type
};
Object.assign(e, t.inspector);
e.defines = t.defines;
e.value = v(e.type)(t.value);
var i = g(e.type);
e.typeName = m[i] || i;
if ("cc.Texture2D" == e.typeName) {
e.typeName = "cc.Asset";
e.assetType = "cc.Texture2D";
}
return e;
};
var a = u(t("./enums")), c = t("../core/value-types"), l = u(t("../core/assets/CCTexture2D"));
function u(t) {
return t && t.__esModule ? t : {
default: t
};
}
var h = null;
h = gfx.Texture2D;
var f = cc.Object, d = ((n = {})[Boolean] = function(t) {
return t || !1;
}, n[Number] = function(t) {
return t ? ArrayBuffer.isView(t) ? t[0] : t : 0;
}, n[c.Vec2] = function(t) {
return t ? cc.v2(t[0], t[1]) : cc.v2();
}, n[c.Vec3] = function(t) {
return t ? cc.v3(t[0], t[1], t[2]) : cc.v3();
}, n[c.Vec4] = function(t) {
return t ? cc.v4(t[0], t[1], t[2], t[3]) : cc.v4();
}, n[c.Color] = function(t) {
return t ? cc.color(255 * t[0], 255 * t[1], 255 * t[2], 255 * (t[3] || 1)) : cc.color();
}, n[c.Mat4] = function(t) {
return t ? cc.mat4(t[0], t[1], t[2], t[3], t[4], t[5], t[6], t[7], t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15]) : cc.mat4();
}, n[l.default] = function() {
return null;
}, n[f] = function() {
return null;
}, n), _ = ((r = {})[a.default.PARAM_INT] = Number, r[a.default.PARAM_INT2] = c.Vec2, 
r[a.default.PARAM_INT3] = c.Vec3, r[a.default.PARAM_INT4] = c.Vec4, r[a.default.PARAM_FLOAT] = Number, 
r[a.default.PARAM_FLOAT2] = c.Vec2, r[a.default.PARAM_FLOAT3] = c.Vec3, r[a.default.PARAM_FLOAT4] = c.Vec4, 
r[a.default.PARAM_MAT4] = c.Mat4, r[a.default.PARAM_TEXTURE_2D] = l.default, r.color = c.Color, 
r.number = Number, r.boolean = Boolean, r.default = f, r), p = (i.ctor2enums = ((s = {})[Number] = a.default.PARAM_FLOAT, 
s[c.Vec2] = a.default.PARAM_FLOAT2, s[c.Vec3] = a.default.PARAM_FLOAT3, s[c.Vec4] = a.default.PARAM_FLOAT4, 
s[c.Color] = a.default.PARAM_COLOR3, s[c.Color] = a.default.PARAM_COLOR4, s[c.Mat4] = a.default.PARAM_MAT4, 
s[l.default] = a.default.PARAM_TEXTURE_2D, s[h] = a.default.PARAM_TEXTURE_2D, s), 
i.enums2default = ((o = {})[a.default.PARAM_INT] = new Uint32Array([ 0 ]), o[a.default.PARAM_INT2] = new Uint32Array([ 0, 0 ]), 
o[a.default.PARAM_INT3] = new Uint32Array([ 0, 0, 0 ]), o[a.default.PARAM_INT4] = new Uint32Array([ 0, 0, 0, 0 ]), 
o[a.default.PARAM_FLOAT] = new Float32Array([ 0 ]), o[a.default.PARAM_FLOAT2] = new Float32Array([ 0, 0 ]), 
o[a.default.PARAM_FLOAT3] = new Float32Array([ 0, 0, 0 ]), o[a.default.PARAM_FLOAT4] = new Float32Array([ 0, 0, 0, 0 ]), 
o[a.default.PARAM_MAT4] = cc.mat4().m, o[a.default.PARAM_TEXTURE_2D] = null, o.number = 0, 
o.boolean = !1, o), i.getInstanceType = function(t) {
return _[t] || _.default;
}), v = i.getInstanceCtor = function(t) {
return d[p(t)];
}, g = i.getClassName = function(t) {
return cc.js.getClassName(p(t));
}, m = {
Number: "number",
Boolean: "boolean"
};
}), {
"../core/assets/CCTexture2D": 28,
"../core/value-types": 202,
"./enums": 233,
"./gfx/texture-2d": void 0
} ],
239: [ (function(t, e, i) {
"use strict";
var n = cc.Class({
name: "cc.TiledMapAsset",
extends: cc.Asset,
properties: {
tmxXmlStr: "",
textures: {
default: [],
type: [ cc.Texture2D ]
},
textureNames: [ cc.String ],
imageLayerTextures: {
default: [],
type: [ cc.Texture2D ]
},
imageLayerTextureNames: [ cc.String ],
tsxFiles: [ cc.TextAsset ],
tsxFileNames: [ cc.String ]
},
statics: {
preventDeferredLoadDependents: !0
},
createNode: !1
});
cc.TiledMapAsset = n;
e.exports = n;
}), {} ],
240: [ (function(t, e, i) {
"use strict";
t("./cocos2d/core");
t("./cocos2d/animation");
t("./cocos2d/particle");
t("./cocos2d/tilemap");
t("./cocos2d/videoplayer/CCVideoPlayer");
t("./cocos2d/webview/CCWebView");
t("./cocos2d/core/components/CCStudioComponent");
t("./extensions/ccpool/CCNodePool");
t("./cocos2d/actions");
t("./extensions/spine");
t("./extensions/dragonbones");
t("./cocos2d/deprecated");
}), {
"./cocos2d/actions": void 0,
"./cocos2d/animation": void 0,
"./cocos2d/core": 87,
"./cocos2d/core/components/CCStudioComponent": 58,
"./cocos2d/deprecated": 224,
"./cocos2d/particle": void 0,
"./cocos2d/particle/CCParticleAsset": 226,
"./cocos2d/tilemap": void 0,
"./cocos2d/tilemap/CCTiledMapAsset": 239,
"./cocos2d/videoplayer/CCVideoPlayer": void 0,
"./cocos2d/webview/CCWebView": void 0,
"./extensions/ccpool/CCNodePool": void 0,
"./extensions/dragonbones": void 0,
"./extensions/spine": void 0
} ],
241: [ (function(t, e, i) {
"use strict";
var n = "undefined" == typeof window ? global : window;
n.cc = n.cc || {};
n._cc = n._cc || {};
t("./predefine");
t("./polyfill/string");
t("./polyfill/misc");
t("./polyfill/array");
t("./polyfill/object");
t("./polyfill/array-buffer");
t("./polyfill/number");
t("./polyfill/typescript");
t("./cocos2d/core/predefine");
t("./cocos2d");
t("./extends");
0;
e.exports = n.cc;
}), {
"./cocos2d": 225,
"./cocos2d/core/predefine": 135,
"./extends": 240,
"./package": void 0,
"./polyfill/array": 243,
"./polyfill/array-buffer": 242,
"./polyfill/misc": 244,
"./polyfill/number": 245,
"./polyfill/object": 246,
"./polyfill/string": 247,
"./polyfill/typescript": void 0,
"./predefine": 248
} ],
242: [ (function(t, e, i) {
"use strict";
if (!ArrayBuffer.isView) {
var n = Object.getPrototypeOf(Int8Array);
ArrayBuffer.isView = "function" == typeof n ? function(t) {
return t instanceof n;
} : function(t) {
if ("object" != typeof t) return !1;
var e = t.constructor;
return e === Float32Array || e === Uint8Array || e === Uint32Array || e === Int8Array;
};
}
}), {} ],
243: [ (function(t, e, i) {
"use strict";
Array.isArray || (Array.isArray = function(t) {
return "[object Array]" === Object.prototype.toString.call(t);
});
Array.prototype.find || (Array.prototype.find = function(t) {
for (var e = this.length, i = 0; i < e; i++) {
var n = this[i];
if (t.call(this, n, i, this)) return n;
}
});
Array.prototype.includes || (Array.prototype.includes = function(t) {
return -1 !== this.indexOf(t);
});
}), {} ],
244: [ (function(t, e, i) {
"use strict";
Math.sign || (Math.sign = function(t) {
return 0 === (t = +t) || isNaN(t) ? t : t > 0 ? 1 : -1;
});
Math.log2 || (Math.log2 = function(t) {
return Math.log(t) * Math.LOG2E;
});
Number.isInteger || (Number.isInteger = function(t) {
return "number" == typeof t && isFinite(t) && Math.floor(t) === t;
});
var n = window.performance || Date, r = Object.create(null);
console.time = function(t) {
r[t] = n.now();
};
console.timeEnd = function(t) {
var e = r[t], i = n.now() - e;
console.log(t + ": " + i + "ms");
};
}), {} ],
245: [ (function(t, e, i) {
"use strict";
Number.parseFloat = Number.parseFloat || parseFloat;
Number.parseInt = Number.parseInt || parseInt;
}), {} ],
246: [ (function(t, e, i) {
"use strict";
Object.assign || (Object.assign = function(t, e) {
return cc.js.mixin(t, e);
});
Object.getOwnPropertyDescriptors || (Object.getOwnPropertyDescriptors = function(t) {
var e = {}, i = Object.getOwnPropertyNames(t);
Object.getOwnPropertySymbols && (i = i.concat(Object.getOwnPropertySymbols(t)));
for (var n = 0; n < i.length; ++n) {
var r = i[n];
e[r] = Object.getOwnPropertyDescriptor(t, r);
}
return e;
});
}), {} ],
247: [ (function(t, e, i) {
"use strict";
String.prototype.startsWith || (String.prototype.startsWith = function(t, e) {
e = e || 0;
return this.lastIndexOf(t, e) === e;
});
String.prototype.endsWith || (String.prototype.endsWith = function(t, e) {
("undefined" == typeof e || e > this.length) && (e = this.length);
e -= t.length;
var i = this.indexOf(t, e);
return -1 !== i && i === e;
});
String.prototype.trimLeft || (String.prototype.trimLeft = function() {
return this.replace(/^\s+/, "");
});
}), {} ],
248: [ (function(t, e, i) {
"use strict";
var n = "undefined" == typeof window ? global : window;
function r(t, e) {
"undefined" == typeof n[t] && (n[t] = e);
}
function s(t, e) {
"undefined" == typeof n[t] && Object.defineProperty(n, t, {
get: function() {
var i = void 0;
"CC_WECHATGAMESUB" === t ? i = "cc.sys.platform === cc.sys.WECHAT_GAME_SUB" : "CC_WECHATGAME" === t ? i = "cc.sys.platform === cc.sys.WECHAT_GAME" : "CC_QQPLAY" === t && (i = "cc.sys.platform === cc.sys.QQ_PLAY");
cc.warnID(1400, t, i);
return e;
}
});
}
function o(t) {
return "object" == typeof n[t];
}
r("CC_BUILD", !1);
n.CC_BUILD = !0;
n.CC_DEV = !1;
n.CC_DEBUG = !1;
n.CC_JSB = !0;
n.CC_NATIVERENDERER = !0;
n.CC_SUPPORT_JIT = !0;
r("CC_TEST", o("tap") || o("QUnit"));
r("CC_EDITOR", o("Editor") && o("process") && "electron" in process.versions);
r("CC_PREVIEW", !0);
r("CC_RUNTIME", "function" == typeof loadRuntime);
r("CC_JSB", o("jsb") && !0);
var a = !(!o("wx") || !wx.getSharedCanvas), c = !(!o("wx") || !wx.getSystemInfoSync && !wx.getSharedCanvas), l = o("bk");
s("CC_WECHATGAMESUB", a);
s("CC_WECHATGAME", c);
s("CC_QQPLAY", l);
0;
n.CocosEngine = cc.ENGINE_VERSION = "2.2.1";
}), {} ]
}, {}, [ 241 ]);
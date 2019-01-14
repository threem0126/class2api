"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.runTime = exports.isVersionALargeThanVersionB = exports.setCookie = exports.getCookie = exports.getLocatinGeo = exports.topWindow = exports.formatRemainTime = exports.maskMobile = exports.hashcode = exports.delayRun = exports.crash = exports.sleep = exports.checkPhoneFormat = exports.getNonceStr = exports.getClientIp = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//浏览器信息
var getBrowserInfo = function getBrowserInfo(userAgent) {
    var agent = userAgent.toLowerCase();
    //ie
    if (agent.indexOf("compatible") > -1 && agent.indexOf("msie" > -1)) {
        var reIE = new RegExp("msie (\\d+\\.\\d+);");
        reIE.test(agent);
        var fIEVersion = parseFloat(RegExp["$1"]);
        if (fIEVersion == 7) {
            return "IE/7";
        } else if (fIEVersion == 8) {
            return "IE/8";
        } else if (fIEVersion == 9) {
            return "IE/9";
        } else if (fIEVersion == 10) {
            return "IE/10";
        }
    } //isIE end
    if (agent.indexOf('trident') > -1 && agent.indexOf("rv:11.0") > -1) {
        return "IE/11";
    }
    //firefox
    if (agent.indexOf("firefox") > 0) {
        return agent.match(/firefox\/[\d.]+/gi);
    }
    //Safari
    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        return agent.match(/safari\/[\d.]+/gi);
    }
    //Chrome
    if (agent.indexOf("chrome") > 0) {
        return agent.match(/chrome\/[\d.]+/gi);
    }
};

//用户浏览器的设备信息
var getDeviceInfo = function getDeviceInfo(userAgent) {
    var UA = userAgent || window.navigator.userAgent;
    try {
        var browser = getBrowserInfo(userAgent);
        var browserName = (browser + "").replace(/[0-9./]/ig, "");
        var browserVersion = parseInt((browser + "").replace(/[^0-9.]/ig, ""));

        var platform = '其他';
        if (/ipad/i.test(userAgent)) {
            if (/gankao/i.test(userAgent)) platform = 'ipad app';else platform = 'ipad';
        } else if (/iphone os/i.test(userAgent)) {
            if (/gankao/i.test(userAgent)) platform = 'iphone app';else platform = 'iphone';
        } else if (/android/i.test(userAgent)) {
            if (/gankao/i.test(userAgent)) platform = 'android app';else platform = 'android';
        } else if (/mac os/i.test(userAgent)) {
            platform = 'mac';
        } else if (/windows nt 5.1/i.test(userAgent)) {
            platform = 'win XP';
        } else if (/windows nt 6.0/i.test(userAgent)) {
            platform = 'win Vista';
        } else if (/windows nt 6.1/i.test(userAgent)) {
            platform = 'win 7';
        } else if (/windows nt 6.2/i.test(userAgent)) {
            platform = 'win 8';
        } else if (/windows nt 6.3/i.test(userAgent)) {
            platform = 'win 8.1';
        } else if (/windows nt 10/i.test(userAgent)) {
            platform = 'win 10';
        } else {
            platform = '其他';
        }

        return {
            browserName: browserName,
            browserVersion: browserVersion,
            platform: platform
        };
    } catch (e) {
        return {
            browserName: '未知',
            browserVersion: '未知',
            platform: '未知'
        };
    }
};

/**
 * 从express的request中获取请求方的IP地址
 * @param req
 * @returns {*}
 */
var getClientIp = exports.getClientIp = function getClientIp(req) {
    try {
        return req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    } catch (err) {
        return "-not-get-ip";
    }
};

/**
 * 产生指定长度的随机乱码字符串
 * @param len
 * @returns {string}
 */
var getNonceStr = exports.getNonceStr = function getNonceStr() {
    var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;

    var seed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var str = "";
    while (len--) {
        str += seed.split("")[Math.floor(Math.random() * seed.length)];
    }
    return str;
};

/**
 * 验证
 * @param phone
 * @returns {boolean}
 */
var checkPhoneFormat = exports.checkPhoneFormat = function checkPhoneFormat(phone) {
    return (/^1[1234567890]\d{9}$/.test(phone)
    );
};

/**
 * 等待指定毫秒时间后再继续执行
 * @param ms
 * @returns {Promise}
 */
var sleep = exports.sleep = function sleep(ms) {
    return new Promise(function (resolve, reject) {
        setTimeout(function (_) {
            return resolve(ms);
        }, ms);
    });
};

/**
 * 主动制造一个奔溃，让程序马上停止下来，内部时setTime机制，所以不受外围的try-catch的限制
 * @param title
 */
var crash = exports.crash = function crash(title) {
    setTimeout(function () {
        throw title || '主动crash';
    }, 20);
};

/**
 * 延迟指定时间执行函数，并捕获错误
 * @param fun
 * @param ms
 * @param errerhandle
 */
var delayRun = exports.delayRun = function delayRun(fun, ms, errerhandle) {
    setTimeout(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return fun();

                    case 3:
                        _context.next = 8;
                        break;

                    case 5:
                        _context.prev = 5;
                        _context.t0 = _context["catch"](0);

                        if (errerhandle) errerhandle(_context.t0);else {
                            console.error("error in delayRun:");
                            console.error(_context.t0);
                        }

                    case 8:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 5]]);
    })), ms || 0);
};

/**
 * 获取给定字符串的hashcode值
 * @param str
 * @returns {number}
 */
var hashcode = exports.hashcode = function hashcode(str) {
    var hash = 0,
        i,
        chr,
        len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

/**
 * 将手机号中间的4位打掩码
 * @param mobile
 * @returns {string}
 */
var maskMobile = exports.maskMobile = function maskMobile(mobile) {
    return mobile.substr(0, 3) + '****' + mobile.substr(7, 4);
};

/**
 * 获取剩余时间的时间段表达法
 * @param leftMiSecond
 * @returns {string}
 */
var formatRemainTime = exports.formatRemainTime = function formatRemainTime(leftMiSecond) {
    var days = parseInt(leftMiSecond / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
    var hours = parseInt(leftMiSecond / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
    var minutes = parseInt(leftMiSecond / 1000 / 60 % 60, 10); //计算剩余的分钟
    var seconds = parseInt(leftMiSecond / 1000 % 60, 10); //计算剩余的秒数
    days = checkTime(days);
    hours = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    return (days > 0 ? days + "天" : '') + (hours > 0 ? hours + "小时" : "") + (minutes > 0 ? minutes + "分" : '') + seconds + "秒";
};

/**
 * 获取顶层窗口
 * @returns {Window}
 */
var topWindow = exports.topWindow = function topWindow() {
    try {
        //试探是否有跨域错误
        var link = window.top.document.location.href;
        return window.top;
    } catch (err) {
        if (err.message.indexOf("cross-origin frame") !== -1) {
            console.warn("\u672C\u4EE3\u7801\u5728iframe\u5185\u90E8\u9875\u9762\u4E2D\u8FD0\u884C\uFF0C\u5728\u83B7\u53D6window.top\u65F6\u62A5\u9519\uFF0C\u6D89\u53CA\u8DE8\u57DF,\u76F8\u5173\u4FE1\u606F\u4F9D\u7136\u4ECEwindow\u83B7\u53D6\u3002\u5982\u662F\u9876\u5C42frame\u9875\u9762\u662Fgankao\u4E8C\u7EA7\u57DF\u540D\uFF0C\u8BF7\u786E\u4FDD\u5C06document.domain\u8BBE\u7F6E\u4E3A gankao.com");
        }
        return window;
    }
};

/**
 * 获取当前网页的地理位置，内部兼容微信环境
 * @returns {Promise}
 */
var getLocatinGeo = exports.getLocatinGeo = function getLocatinGeo() {
    return new Promise(function (resolve, reject) {
        if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== "object") {
            reject("非客户端环境，无法获取经纬度");
            return;
        }
        if (false && window.wx) {
            window.wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: function success(res) {
                    var lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    var lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    resolve({ lng: lng, lat: lat });
                },
                fail: function fail(res) {
                    resolve({ lng: 0, lat: 0 });
                }
            });
        } else if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = parseFloat(position.coords.latitude); // 纬度，浮点数，范围为90 ~ -90
                var lng = parseFloat(position.coords.longitude); // 经度，浮点数，范围为180 ~ -180。
                resolve({ lng: lng, lat: lat });
            }, function (error) {
                var errMsg = "";
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errMsg = "用户拒绝对获取地理位置的请求。";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errMsg = "位置信息是不可用的。";
                        break;
                    case error.TIMEOUT:
                        errMsg = "请求用户地理位置超时。";
                        break;
                    case error.UNKNOWN_ERROR:
                        errMsg = "未知错误。";
                        break;
                    default:
                        errMsg = "未知错误。";
                }
                reject(errMsg);
            });
        } else {
            reject('没有获得经纬度信息的接口');
        }
    });
};

/**
 * 读取cookie
 * @param name
 * @returns {*}
 */
var getCookie = exports.getCookie = function getCookie(name) {
    if ((typeof document === "undefined" ? "undefined" : _typeof(document)) !== "object") {
        return null;
    }
    var arr = void 0,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);else return null;
};

/**
 * 设置cookie
 * @param name
 * @param value
 */
var setCookie = exports.setCookie = function setCookie(name, value) {
    if ((typeof document === "undefined" ? "undefined" : _typeof(document)) !== "object") {
        return;
    }
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};

/**
* 比较A、B两个版本号的大小; 比如 (1.2.3, 1.3.3)
* @param versionA
* @param versionB
* @returns {boolean}
*/
var isVersionALargeThanVersionB = exports.isVersionALargeThanVersionB = function isVersionALargeThanVersionB(versionA, versionB) {
    var curs = (versionA || '').split(".").map(function (m) {
        return parseInt(m);
    });
    var tragets = (versionB || '').split(".").map(function (m) {
        return parseInt(m);
    });
    var retValue = false;
    for (var i = 0; i < curs.length; i++) {
        var curItem = curs[i];
        var targetItem = tragets[i];
        // console.error(`${curItem} / ${targetItem}`)
        if (curItem > targetItem) {
            //直接出结果，当前版本更大
            retValue = true;
            break;
        } else if (curItem < targetItem) {
            //直接出结果，当前版本更小
            retValue = false;
            break;
        } else {
            //本轮势均力敌，进入下一回合
        }
    }
    return retValue;
};

var _isWxMiniDetected = false;
var _isWxMini = false;
var _runTime_result = void 0;

var isWxMini = function isWxMini() {
    return new Promise(function (resolve, reject) {
        try {
            if (_isWxMiniDetected) return _isWxMini;else {
                if (window.top.wx) {
                    //部分浏览器内，getEnv不会触发回调，假设正常回调不会超过300毫秒，超过300毫秒的，视为非小程序环境
                    var _isWxMini_timer = setTimeout(function () {
                        resolve(false);
                    }, 300);
                    // 检测是否为小程序环境
                    window.top.wx.miniProgram.getEnv(function (res) {
                        clearTimeout(_isWxMini_timer);
                        _isWxMiniDetected = true;
                        // true or false
                        _isWxMini = res.miniprogram;
                        resolve(_isWxMini);
                    });
                } else {
                    resolve(false);
                }
            }
        } catch (err) {
            if (err.message.indexOf("cross-origin frame") !== -1) {
                console.warn("\u672C\u4EE3\u7801\u5728iframe\u5185\u90E8\u9875\u9762\u4E2D\u8FD0\u884C\uFF0C\u5224\u65ADisWxMini\u65F6\uFF0C\u5728\u83B7\u53D6window.top.wx\u65F6\u62A5\u9519\uFF0C\u6D89\u53CA\u8DE8\u57DF\u3002\u5982\u662F\u9876\u5C42frame\u9875\u9762\u662Fgankao\u4E8C\u7EA7\u57DF\u540D\uFF0C\u8BF7\u786E\u4FDD\u5C06document.domain\u8BBE\u7F6E\u4E3A gankao.com");
            }
            resolve(false);
        }
    });
};

/**
 * 判断当前浏览器的运行环境，内置赶考APp、小程序、世纪守护等判断
 * @returns {isServer, inapp, inxiaozhuliapp, inWeixin, isQQ, isAndroid, isOnPc, iOS, isSJSH, isMiniProgram, isWeizhan, _deviceInfo}
 */
var runTime = exports.runTime = function runTime() {
    var ret = {};
    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") {
        if (_runTime_result) return _runTime_result;
        var UA = window.navigator.userAgent;
        ret.isServer = false;
        ret.inapp = UA.indexOf("gankao") !== -1;
        ret.inxiaozhuliapp = UA.indexOf("gkagent") !== -1;
        ret.inWeixin = UA.indexOf("MicroMessenger") !== -1;
        ret.isQQ = UA.indexOf("QQ") !== -1;
        ret.isAndroid = UA.toLowerCase().indexOf("android") !== -1;
        ret.iOS = UA.indexOf("iPad") !== -1 || UA.indexOf("iPhone") !== -1;
        ret.isOnPc = !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        //ret.isSJSH = (getCookie('PARTNER_APP_ID') ==='sjsh');
        ret.isSJSH = UA.toLowerCase().indexOf("sjsh") !== -1;
        if (!ret.inWeixin) {
            ret.isMiniProgram = false;
        } else {
            //部分安卓机型会显示miniprogram
            ret.isMiniProgram = UA.toLowerCase().indexOf("miniprogram") > -1;
            if (!ret.isMiniProgram) {
                ret.isMiniProgram = window.__wxjs_environment === 'miniprogram';
                if (!ret.isMiniProgram) {
                    _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                        return _regenerator2.default.wrap(function _callee2$(_context2) {
                            while (1) {
                                switch (_context2.prev = _context2.next) {
                                    case 0:
                                        _context2.next = 2;
                                        return isWxMini();

                                    case 2:
                                        ret.isMiniProgram = _context2.sent;

                                    case 3:
                                    case "end":
                                        return _context2.stop();
                                }
                            }
                        }, _callee2, undefined);
                    }))();
                }
            }
        }
        try {
            ret.isWeizhan = (window.top.document.location.href || '').toLowerCase().indexOf("weizhan.") > -1;
        } catch (e) {
            if (e.message.indexOf("cross-origin frame") !== -1) {
                console.warn("\u83B7\u53D6window.top.document.location.href\u65F6\u62A5\u9519\uFF0C\u6D89\u53CA\u8DE8\u57DF\u3002\u5982\u662F\u9876\u5C42frame\u9875\u9762\u662Fgankao\u4E8C\u7EA7\u57DF\u540D\uFF0C\u8BF7\u786E\u4FDD\u5C06document.domain\u8BBE\u7F6E\u4E3A gankao.com");
            }
            ret.isWeizhan = false;
        }
        ret._deviceInfo = getDeviceInfo(UA);
        _runTime_result = ret;
    } else {
        ret.isServer = true;
    }
    return ret;
};
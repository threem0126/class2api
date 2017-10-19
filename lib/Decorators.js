'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.crashAfterMe = exports.ipwhitelist = exports.clearCache = exports.cacheAble = exports.authAccess = exports.definedStaticField = exports.modelSetting = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redisClient = require('./redisClient');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var config = (0, _redisClient.getting_redisConfig)();
var _config$cache_prefx = config.cache_prefx,
    redis_cache_key_prefx = _config$cache_prefx === undefined ? "redis_cache_key_prefx_" : _config$cache_prefx,
    _config$defaultExpire = config.defaultExpireSecond,
    defaultExpireSecond = _config$defaultExpire === undefined ? 10 * 60 : _config$defaultExpire;
var modelSetting = exports.modelSetting = function modelSetting(props) {
    Object.keys(props).map(function (key, value) {
        if (key.indexOf("__") !== 0) {
            throw '动态添加的静态属性名不符合约定格式（__****）';
        }
    });
    return function (target) {
        target.__modelSetting = function () {
            return _extends({}, props);
        };
    };
};

var definedStaticField = exports.definedStaticField = function definedStaticField(props) {
    Object.keys(props).map(function (key, value) {
        if (key.indexOf("__") !== 0) {
            throw '动态添加的静态属性名不符合约定格式（__****）';
        }
    });
    return function (target) {
        Object.keys(props).map(function (key, value) {
            if (target[key]) {
                throw '动态添加的静态属性名已被先定义，无法重复（__****）';
            } else {
                target[key] = value;
            }
        });
    };
};

var authAccess = exports.authAccess = function authAccess(accessValidateFun, userIdentifyFieldName) {
    return function (target, name, descriptor) {
        if (!accessValidateFun) {
            //修饰器的报错，级别更高，直接抛出终止程序
            setTimeout(function () {
                throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u6743\u9650\u63A7\u5236\u5668\u7684accessValidateFun\u53C2\u6570\u672A\u5B9A\u4E49';
            });
        }
        var oldValue = descriptor.value;
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var uid,
                canAccess,
                _args = arguments;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            if (_args.length === 0 || _typeof(_args[0]) !== "object") {
                                //修饰器的报错，级别更高，直接抛出终止程序
                                setTimeout(function () {
                                    throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u7F3A\u5C11\u8EAB\u4EFD\u53C2\u6570\uFF0C\u65E0\u6CD5\u9A8C\u8BC1\u6743\u9650';
                                });
                            }
                            uid = _args[0][userIdentifyFieldName || 'uid'];
                            canAccess = accessValidateFun(uid);

                            if (canAccess) {
                                _context.next = 5;
                                break;
                            }

                            throw '\u60A8\u65E0\u6743\u8BBF\u95EE';

                        case 5:
                            _context.next = 7;
                            return oldValue.apply(undefined, _args);

                        case 7:
                            return _context.abrupt('return', _context.sent);

                        case 8:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));
        return descriptor;
    };
};

var ____cache = {
    get: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(akey) {
            var avalue;
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            akey = redis_cache_key_prefx + akey;
                            _context2.next = 3;
                            return (0, _redisClient.getRedisClient)().getAsync(akey);

                        case 3:
                            avalue = _context2.sent;

                            if (!avalue) {
                                _context2.next = 15;
                                break;
                            }

                            _context2.prev = 5;
                            return _context2.abrupt('return', JSON.parse(avalue));

                        case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2['catch'](5);

                            console.log('redis\u7F13\u5B58[' + akey + ']\u5220\u9664\u5931\u8D25\uFF1A' + _context2.t0);
                            //解析错误，则删除key
                            _context2.next = 14;
                            return (0, _redisClient.getRedisClient)().delAsync(akey);

                        case 14:
                            return _context2.abrupt('return', null);

                        case 15:
                            return _context2.abrupt('return', avalue);

                        case 16:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined, [[5, 9]]);
        }));

        return function get(_x) {
            return _ref2.apply(this, arguments);
        };
    }(),
    set: function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(akey, avalue, expireTimeSeconds) {
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            console.log('set cachekey .......' + akey + '...');
                            akey = redis_cache_key_prefx + akey;
                            (0, _util.delayRun)(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.next = 2;
                                                return (0, _redisClient.getRedisClient)().setAsync(akey, JSON.stringify(avalue), 'EX', expireTimeSeconds || defaultExpireSecond);

                                            case 2:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, undefined);
                            })), 0, function (err) {
                                console.log('redis\u7F13\u5B58[' + akey + ']\u5EFA\u7ACB\u5931\u8D25\uFF1A' + err);
                            });

                        case 3:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        }));

        return function set(_x2, _x3, _x4) {
            return _ref3.apply(this, arguments);
        };
    }(),
    delete: function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(akey) {
            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            akey = redis_cache_key_prefx + akey;
                            (0, _util.delayRun)(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
                                return _regenerator2.default.wrap(function _callee5$(_context5) {
                                    while (1) {
                                        switch (_context5.prev = _context5.next) {
                                            case 0:
                                                _context5.next = 2;
                                                return (0, _redisClient.getRedisClient)().delAsync(akey);

                                            case 2:
                                                console.log('delete cachekey .......' + akey + '...');

                                            case 3:
                                            case 'end':
                                                return _context5.stop();
                                        }
                                    }
                                }, _callee5, undefined);
                            })), 0, function (err) {
                                console.log('redis\u7F13\u5B58[' + akey + ']\u5220\u9664\u5931\u8D25\uFF1A' + err);
                            });

                        case 2:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, undefined);
        }));

        return function _delete(_x5) {
            return _ref5.apply(this, arguments);
        };
    }()

    /**
     * 默认缓存60秒
     *
     * @param cacheKeyGene
     * @returns {Function}
     */
};var cacheAble = exports.cacheAble = function cacheAble(_ref7) {
    var cacheKeyGene = _ref7.cacheKeyGene;

    return function (target, name, descriptor) {
        //修饰器的报错，级别更高，直接抛出终止程序
        if (!cacheKeyGene) {
            setTimeout(function () {
                throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u8C03\u7528cacheAble\u4FEE\u9970\u5668\u65F6\u672A\u6307\u5B9A\u6709\u6548\u7684cacheKeyGene\u53C2\u6570';
            });
        }
        var oldValue = descriptor.value;
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            var __nocache,
                key,
                Obj,
                _result,
                result,
                _args7 = arguments;

            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            __nocache = _args7[0].__nocache;

                            if (!__nocache) {
                                _context7.next = 6;
                                break;
                            }

                            console.log('force skip cache ........ ' + target.name + '.' + name);
                            _context7.next = 5;
                            return oldValue.apply(undefined, _args7);

                        case 5:
                            return _context7.abrupt('return', _context7.sent);

                        case 6:
                            key = '';

                            if (!cacheKeyGene) {
                                _context7.next = 17;
                                break;
                            }

                            key = cacheKeyGene(_args7);
                            //返回空字符串时，忽略

                            if (!key) {
                                _context7.next = 17;
                                break;
                            }

                            _context7.next = 12;
                            return ____cache.get(key);

                        case 12:
                            Obj = _context7.sent;

                            if (!Obj) {
                                _context7.next = 17;
                                break;
                            }

                            _result = (typeof Obj === 'undefined' ? 'undefined' : _typeof(Obj)) === "object" ? _extends({}, Obj) : Obj;

                            if ((typeof _result === 'undefined' ? 'undefined' : _typeof(_result)) === "object") {
                                //if (process.env.NODE_ENV !== 'production') {
                                console.log('hit cachekey .......' + key + '...');
                                //}
                                _result.__fromCache = true;
                            }
                            return _context7.abrupt('return', _result);

                        case 17:
                            //if(process.env.NODE_ENV !=='production') {
                            console.log('miss cachekey .......' + key + '...');
                            //}
                            _context7.next = 20;
                            return oldValue.apply(undefined, _args7);

                        case 20:
                            result = _context7.sent;

                            if (!(cacheKeyGene && key)) {
                                _context7.next = 24;
                                break;
                            }

                            _context7.next = 24;
                            return ____cache.set(key, result);

                        case 24:
                            return _context7.abrupt('return', result);

                        case 25:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));
        return descriptor;
    };
};

var clearCache = exports.clearCache = function clearCache(_ref9) {
    var cacheKeyGene = _ref9.cacheKeyGene;

    return function (target, name, descriptor) {
        var oldValue = descriptor.value;
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            var key,
                _args8 = arguments;
            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            key = '';

                            if (!(typeof cacheKeyGene === "function")) {
                                _context8.next = 11;
                                break;
                            }

                            key = cacheKeyGene(_args8);

                            if (!(key !== "")) {
                                _context8.next = 8;
                                break;
                            }

                            _context8.next = 6;
                            return ____cache.delete(key);

                        case 6:
                            _context8.next = 9;
                            break;

                        case 8:
                            //返回的key为空字符串，说明key无法提前确定，需要交给方法内部来调用清空
                            _args8[0].__cacheManage = function () {
                                return ____cache;
                            };

                        case 9:
                            _context8.next = 12;
                            break;

                        case 11:
                            //修饰器的报错，级别更高，直接抛出终止程序
                            setTimeout(function () {
                                throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u8C03\u7528cacheAble\u4FEE\u9970\u5668\u65F6\u672A\u6307\u5B9A\u6709\u6548\u7684cacheKeyGene\u53C2\u6570';
                            });

                        case 12:
                            _context8.next = 14;
                            return oldValue.apply(undefined, _args8);

                        case 14:
                            return _context8.abrupt('return', _context8.sent);

                        case 15:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));
        return descriptor;
    };
};

/**
 * 实际用在API入口处判断，很少用在类的方法级别
 *
 * @returns {Function}
 */
var ipwhitelist = exports.ipwhitelist = function ipwhitelist() {
    return function (target, name, descriptor) {
        if (!descriptor) {
            throw 'ipwhitelist不支持修饰类';
        }
        var oldValue = descriptor.value;
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
            var _ref12,
                req,
                _args9 = arguments;

            return _regenerator2.default.wrap(function _callee9$(_context9) {
                while (1) {
                    switch (_context9.prev = _context9.next) {
                        case 0:
                            _ref12 = _args9.length > 0 ? _typeof(_args9[0]) === "object" ? _args9[0] : {} : {}, req = _ref12.req;

                            if (!req) {
                                //修饰器的报错，级别更高，直接抛出终止程序
                                setTimeout(function () {
                                    throw '\u9759\u6001\u7C7B\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E2D\u8981\u6C42\u9650\u5B9AIP\u767D\u540D\u5355\uFF0C\u4F46\u662F\u6CA1\u6709req\u8BF7\u6C42\u53C2\u6570\u4F20\u5165\uFF0C\u65E0\u6CD5\u5B9E\u65BDIP\u9650\u5236';
                                });
                            }
                            if (whiteIPs_canInvokeAppentData.indexOf((0, _util.getClientIp)(req)) === -1) {
                                //修饰器的报错，级别更高，直接抛出终止程序
                                setTimeout(function () {
                                    throw 'IP\u6CA1\u6709\u8BBF\u95EE\u6743\u9650';
                                });
                            }
                            _context9.next = 5;
                            return oldValue.apply(undefined, _args9);

                        case 5:
                            return _context9.abrupt('return', _context9.sent);

                        case 6:
                        case 'end':
                            return _context9.stop();
                    }
                }
            }, _callee9, this);
        }));
        return descriptor;
    };
};

var crashAfterMe = exports.crashAfterMe = function crashAfterMe(hintMsg) {
    return function (target, name, descriptor) {
        if (!descriptor) {
            throw 'crashAfterMe只支持修饰类方法本身，不支持修饰类';
        }
        if (process.env.NODE_ENV !== 'production') {
            var oldValue = descriptor.value;
            descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
                var ret,
                    _args10 = arguments;
                return _regenerator2.default.wrap(function _callee10$(_context10) {
                    while (1) {
                        switch (_context10.prev = _context10.next) {
                            case 0:
                                _context10.next = 2;
                                return oldValue.apply(undefined, _args10);

                            case 2:
                                ret = _context10.sent;

                                setTimeout(function () {
                                    throw (hintMsg || '调试用的中断') + ' by crashAfterMe decorator\uFF01 \u975Eproduction\u73AF\u5883\uFF08' + process.env.NODE_ENV + '\uFF09';
                                }, 5);
                                return _context10.abrupt('return', ret);

                            case 5:
                            case 'end':
                                return _context10.stop();
                        }
                    }
                }, _callee10, this);
            }));
        }
        return descriptor;
    };
};
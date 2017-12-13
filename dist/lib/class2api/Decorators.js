'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.crashAfterMe = exports.ipwhitelist = exports.clearCache = exports.cacheAble = exports.modelSetting = undefined;

var _iterator = require('babel-runtime/core-js/symbol/iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

var _extends = _assign2.default || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _redisClient = require('./redisClient');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _promise2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _promise2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var config = (0, _redisClient.getting_redisConfig)();
var _config$cache_prefx = config.cache_prefx,
    redis_cache_key_prefx = _config$cache_prefx === undefined ? "redis_cache_key_prefx_" : _config$cache_prefx,
    _config$defaultExpire = config.defaultExpireSecond,
    defaultExpireSecond = _config$defaultExpire === undefined ? 10 * 60 : _config$defaultExpire;
var modelSetting = exports.modelSetting = function modelSetting(props) {
    (0, _keys2.default)(props).map(function (key, value) {
        if (key.indexOf("__") !== 0) {
            throw '动态添加的静态属性名不符合约定格式（__****）';
        }
    });
    var _props = _extends({}, props);
    return function (target) {
        target.__modelSetting = function () {
            return _props;
        };
    };
};

var ____cache = {
    get: function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(akey) {
            var avalue;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            akey = redis_cache_key_prefx + akey;
                            _context.next = 3;
                            return (0, _redisClient.getRedisClient)().getAsync(akey);

                        case 3:
                            avalue = _context.sent;

                            if (!avalue) {
                                _context.next = 15;
                                break;
                            }

                            _context.prev = 5;
                            return _context.abrupt('return', JSON.parse(avalue));

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context['catch'](5);

                            console.log('redis\u7F13\u5B58[' + akey + ']\u5220\u9664\u5931\u8D25\uFF1A' + _context.t0);
                            //解析错误，则删除key
                            _context.next = 14;
                            return (0, _redisClient.getRedisClient)().delAsync(akey);

                        case 14:
                            return _context.abrupt('return', null);

                        case 15:
                            return _context.abrupt('return', avalue);

                        case 16:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[5, 9]]);
        }));

        return function get(_x) {
            return _ref.apply(this, arguments);
        };
    }(),
    set: function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(akey, avalue, expireTimeSeconds) {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            console.log('set cachekey .......' + akey + '...');
                            akey = redis_cache_key_prefx + akey;
                            (0, _util.delayRun)(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _context2.next = 2;
                                                return (0, _redisClient.getRedisClient)().setAsync(akey, (0, _stringify2.default)(avalue), 'EX', expireTimeSeconds || defaultExpireSecond);

                                            case 2:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, undefined);
                            })), 0, function (err) {
                                console.log('redis\u7F13\u5B58[' + akey + ']\u5EFA\u7ACB\u5931\u8D25\uFF1A' + err);
                            });

                        case 3:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        }));

        return function set(_x2, _x3, _x4) {
            return _ref2.apply(this, arguments);
        };
    }(),
    delete: function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(akey) {
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            akey = redis_cache_key_prefx + akey;
                            (0, _util.delayRun)(_asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.next = 2;
                                                return (0, _redisClient.getRedisClient)().delAsync(akey);

                                            case 2:
                                                console.log('delete cachekey .......' + akey + '...');

                                            case 3:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, undefined);
                            })), 0, function (err) {
                                console.log('redis\u7F13\u5B58[' + akey + ']\u5220\u9664\u5931\u8D25\uFF1A' + err);
                            });

                        case 2:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined);
        }));

        return function _delete(_x5) {
            return _ref4.apply(this, arguments);
        };
    }()

    /**
     * 在被修饰的方法运行前后执行，首先判断是否存在相同入参的调用缓存，如果没有则在运行结束后，将要运行结果缓存。缓存的key由默认参数属性cacheKeyGene的返回值决定。
     * 默认缓存时间60秒
     *
     * @param cacheKeyGene
     * @returns {Function}
     */
};var cacheAble = exports.cacheAble = function cacheAble(_ref6) {
    var cacheKeyGene = _ref6.cacheKeyGene;

    return function (target, name, descriptor) {
        //修饰器的报错，级别更高，直接抛出终止程序
        if (!cacheKeyGene) {
            setTimeout(function () {
                throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u8C03\u7528cacheAble\u4FEE\u9970\u5668\u65F6\u672A\u6307\u5B9A\u6709\u6548\u7684cacheKeyGene\u53C2\u6570';
            });
        }
        var oldValue = descriptor.value;
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
            var __nocache,
                key,
                _arguments,
                firstParam,
                Obj,
                _result,
                result,
                _args6 = arguments;

            return _regenerator2.default.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            if (!(process.env.NO_API_CACHE === '1')) {
                                _context6.next = 5;
                                break;
                            }

                            console.log('[' + target.name + '.' + name + '] force skip cache by process.env.NO_API_CACHE ...');
                            _context6.next = 4;
                            return oldValue.apply(undefined, _args6);

                        case 4:
                            return _context6.abrupt('return', _context6.sent);

                        case 5:
                            __nocache = _args6[0].__nocache;

                            if (!__nocache) {
                                _context6.next = 11;
                                break;
                            }

                            console.log('[' + target.name + '.' + name + '] force skip cache ........ ' + target.name + '.' + name);
                            _context6.next = 10;
                            return oldValue.apply(undefined, _args6);

                        case 10:
                            return _context6.abrupt('return', _context6.sent);

                        case 11:
                            key = '';

                            if (!cacheKeyGene) {
                                _context6.next = 23;
                                break;
                            }

                            _arguments = Array.prototype.slice.call(_args6), firstParam = _arguments[0];

                            key = cacheKeyGene(firstParam);
                            //返回空字符串时，忽略

                            if (!key) {
                                _context6.next = 23;
                                break;
                            }

                            _context6.next = 18;
                            return ____cache.get(key);

                        case 18:
                            Obj = _context6.sent;

                            if (!Obj) {
                                _context6.next = 23;
                                break;
                            }

                            _result = (typeof Obj === 'undefined' ? 'undefined' : _typeof(Obj)) === "object" ? _extends({}, Obj) : Obj;

                            if ((typeof _result === 'undefined' ? 'undefined' : _typeof(_result)) === "object") {
                                //if (process.env.NODE_ENV !== 'production') {
                                console.log('[' + target.name + '.' + name + '] hit cachekey .......' + key + '...');
                                //}
                                _result.__fromCache = true;
                            }
                            return _context6.abrupt('return', _result);

                        case 23:
                            //if(process.env.NODE_ENV !=='production') {
                            console.log('[' + target.name + '.' + name + '] miss cachekey .......' + key + '...');
                            //}
                            _context6.next = 26;
                            return oldValue.apply(undefined, _args6);

                        case 26:
                            result = _context6.sent;

                            if (!(cacheKeyGene && key)) {
                                _context6.next = 30;
                                break;
                            }

                            _context6.next = 30;
                            return ____cache.set(key, result);

                        case 30:
                            return _context6.abrupt('return', result);

                        case 31:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));
        return descriptor;
    };
};

/**
 * 在被修饰方法运行完毕后执行，用来清除一些相关的缓存
 *
 * @param cacheKeyGene
 * @returns {Function}
 */
var clearCache = exports.clearCache = function clearCache(_ref8) {
    var cacheKeyGene = _ref8.cacheKeyGene;

    return function (target, name, descriptor) {
        var oldValue = descriptor.value;
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
            var key,
                _arguments2,
                firstParam,
                _args7 = arguments;

            return _regenerator2.default.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            if (!(process.env.NO_API_CACHE === '1')) {
                                _context7.next = 5;
                                break;
                            }

                            console.log('force skip cache by process.env.NO_API_CACHE ...');
                            _context7.next = 4;
                            return oldValue.apply(undefined, _args7);

                        case 4:
                            return _context7.abrupt('return', _context7.sent);

                        case 5:
                            key = '';

                            if (!(typeof cacheKeyGene === "function")) {
                                _context7.next = 17;
                                break;
                            }

                            _arguments2 = Array.prototype.slice.call(_args7), firstParam = _arguments2[0];

                            key = cacheKeyGene(firstParam);

                            if (!(key !== "")) {
                                _context7.next = 14;
                                break;
                            }

                            _context7.next = 12;
                            return ____cache.delete(key);

                        case 12:
                            _context7.next = 15;
                            break;

                        case 14:
                            //返回的key为空字符串，说明key无法提前确定，需要交给方法内部来调用清空
                            _args7[0].__cacheManage = function () {
                                return ____cache;
                            };

                        case 15:
                            _context7.next = 18;
                            break;

                        case 17:
                            //修饰器的报错，级别更高，直接抛出终止程序
                            setTimeout(function () {
                                throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u8C03\u7528cacheAble\u4FEE\u9970\u5668\u65F6\u672A\u6307\u5B9A\u6709\u6548\u7684cacheKeyGene\u53C2\u6570';
                            });

                        case 18:
                            _context7.next = 20;
                            return oldValue.apply(undefined, _args7);

                        case 20:
                            return _context7.abrupt('return', _context7.sent);

                        case 21:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
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
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
            var _ref11,
                req,
                _args8 = arguments;

            return _regenerator2.default.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _ref11 = _args8.length > 0 ? _typeof(_args8[0]) === "object" ? _args8[0] : {} : {}, req = _ref11.req;

                            if (!req) {
                                //修饰器的报错，级别更高，直接抛出终止程序
                                setTimeout(function () {
                                    throw '\u9759\u6001\u7C7B\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E2D\u8981\u6C42\u9650\u5B9AIP\u767D\u540D\u5355\uFF0C\u4F46\u662F\u6CA1\u6709req\u8BF7\u6C42\u53C2\u6570\u4F20\u5165\uFF0C\u65E0\u6CD5\u5B9E\u65BDIP\u9650\u5236';
                                });
                            }
                            if (whiteIPs.indexOf((0, _util.getClientIp)(req)) === -1) {
                                //修饰器的报错，级别更高，直接抛出终止程序
                                setTimeout(function () {
                                    throw 'IP\u6CA1\u6709\u8BBF\u95EE\u6743\u9650';
                                });
                            }
                            _context8.next = 5;
                            return oldValue.apply(undefined, _args8);

                        case 5:
                            return _context8.abrupt('return', _context8.sent);

                        case 6:
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
 * 修饰器,运行完类方法就认为跑出异常中断程序，调试用，生产环境下自动失效
 *
 * @param hintMsg
 * @returns {Function}
 */
var crashAfterMe = exports.crashAfterMe = function crashAfterMe(hintMsg) {
    return function (target, name, descriptor) {
        if (!descriptor) {
            throw 'crashAfterMe只支持修饰类方法本身，不支持修饰类';
        }
        if (process.env.NODE_ENV !== 'production') {
            var oldValue = descriptor.value;
            descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                var ret,
                    _args9 = arguments;
                return _regenerator2.default.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                _context9.next = 2;
                                return oldValue.apply(undefined, _args9);

                            case 2:
                                ret = _context9.sent;

                                setTimeout(function () {
                                    throw (hintMsg || '调试用的中断') + ' by crashAfterMe decorator\uFF01 \u975Eproduction\u73AF\u5883\uFF08' + process.env.NODE_ENV + '\uFF09';
                                }, 5);
                                return _context9.abrupt('return', ret);

                            case 5:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this);
            }));
        }
        return descriptor;
    };
};
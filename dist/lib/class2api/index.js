"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setting_CustomRuleValidator = exports.accessRule = exports.crashAfterMe = exports.clearCache = exports.cacheAble = exports.modelSetting = exports.GKErrorWrap = exports.getRedisClient = exports.setting_redisConfig = exports.getGankaoWXAuthToken = exports.GKSUCCESS = exports.createServerInRouter = exports.createServer = undefined;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _from = require("babel-runtime/core-js/array/from");

var _from2 = _interopRequireDefault(_from);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = _assign2.default || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _helmet = require("helmet");

var _helmet2 = _interopRequireDefault(_helmet);

var _hpp = require("hpp");

var _hpp2 = _interopRequireDefault(_hpp);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require("compression");

var _compression2 = _interopRequireDefault(_compression);

var _logger = require("./logger.js");

var _logger2 = _interopRequireDefault(_logger);

var _log4js = require("log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _ModelProxy = require("./ModelProxy");

var ModelProxy = _interopRequireWildcard(_ModelProxy);

var _Decorators = require("./Decorators");

var _redisClient = require("./redisClient");

var _GKErrorWrap = require("./GKErrorWrap");

var _index = require("../rulehelper/index");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return (0, _from2.default)(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _promise2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _promise2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

console.dir("Nice to meet U, I will help You to map Class to API interface ....");
//import session from "express-session";

//import connectRedis from "connect-redis";


var logger = (0, _logger2.default)();
var _server = void 0;
var _router = void 0;

var _create_server = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(model, options) {
        var _options, config, custom, modelClasses, beforeCall, afterCall, method404, _ref2, _ref2$cros, cros, _ref2$cros_headers, cros_headers, _ref2$cros_origin, cros_origin, _ref2$frontpage_defau, frontpage_default, _ref2$apiroot, apiroot, redis, _modelClasses, allow_Header;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:

                        //当options为class时，做转化封装
                        if (typeof options === "function" && options instanceof Object) {
                            options = { modelClasses: [options] };
                        }

                        _options = options, config = _options.config, custom = _options.custom, modelClasses = _options.modelClasses, beforeCall = _options.beforeCall, afterCall = _options.afterCall, method404 = _options.method404;
                        // if (model==='server' && typeof config !== "function") {
                        //     throw  `server模式下，配置参数中必需传入config[Function]属性`
                        // }

                        _ref2 = typeof config === "function" ? config() : config || {}, _ref2$cros = _ref2.cros, cros = _ref2$cros === undefined ? true : _ref2$cros, _ref2$cros_headers = _ref2.cros_headers, cros_headers = _ref2$cros_headers === undefined ? [] : _ref2$cros_headers, _ref2$cros_origin = _ref2.cros_origin, cros_origin = _ref2$cros_origin === undefined ? [] : _ref2$cros_origin, _ref2$frontpage_defau = _ref2.frontpage_default, frontpage_default = _ref2$frontpage_defau === undefined ? '' : _ref2$frontpage_defau, _ref2$apiroot = _ref2.apiroot, apiroot = _ref2$apiroot === undefined ? '/' : _ref2$apiroot, redis = _ref2.redis;

                        if (!redis) {
                            _context.next = 8;
                            break;
                        }

                        _context.next = 6;
                        return (0, _redisClient.setting_redisConfig)(redis);

                    case 6:
                        _context.next = 8;
                        return (0, _redisClient.getRedisClient)();

                    case 8:
                        _modelClasses = typeof modelClasses === "function" ? modelClasses() : modelClasses || [];

                        if (_modelClasses instanceof Array) {
                            _context.next = 11;
                            break;
                        }

                        throw "\u65E0\u6CD5\u8BC6\u522B\u6307\u5B9A\u7684\u7C7B\u6E05\u5355\uFF0C\u56E0\u4E3AmodelClasses\u914D\u7F6E\u9879\u683C\u5F0F\u6709\u8BEF\uFF0C\u671F\u671B\u662FArray\u5217\u8868";

                    case 11:
                        _context.next = 13;
                        return _create_router({
                            apiroot: apiroot,
                            modelClasses: _modelClasses,
                            beforeCall: beforeCall,
                            afterCall: afterCall,
                            method404: method404,
                            frontpage_default: frontpage_default
                        });

                    case 13:
                        _router = _context.sent;

                        if (!(model === 'router')) {
                            _context.next = 17;
                            break;
                        }

                        // API相关路由,在main内部映射到各个功能Model
                        console.log("\u4EE5\u8DEF\u7531\u7ED1\u5B9A\u6A21\u5F0F\u5F00\u542Fclass2api\uFF0Ccros\u8DE8\u57DF\u8BBE\u7F6E\u3001session\u3001\u7B49\u914D\u7F6E\u90FD\u5C06\u5FFD\u7565\uFF0C\u7531\u5916\u90E8\u7684express\u5B9E\u4F8B\u63A7\u5236\uFF01");
                        return _context.abrupt("return", _router);

                    case 17:

                        // Security
                        _server = (0, _express2.default)();
                        _server.disable("x-powered-by");
                        _server.use(_bodyParser2.default.json()); // for parsing application/json
                        _server.use(_bodyParser2.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
                        _server.use(_bodyParser2.default.json({ limit: "5000kb" }));
                        _server.use((0, _hpp2.default)());
                        _server.use(_helmet2.default.xssFilter());
                        _server.use(_helmet2.default.frameguard("deny"));
                        _server.use(_helmet2.default.ieNoOpen());
                        _server.use(_helmet2.default.noSniff());
                        _server.use((0, _cookieParser2.default)());
                        _server.use((0, _compression2.default)());
                        _server.use(_log4js2.default.connectLogger(logger, { level: _log4js2.default.levels.INFO, format: ':method :url' }));

                        //session 禁用
                        //
                        //启用Session，可选Redis存储。PM2集群模式时，必须用分布式存储
                        // let sessionOpt = {
                        //     secret: sessionSecret,
                        //     key: sessionKey,
                        //     resave: false,
                        //     saveUninitialized: true,
                        //     cookie: {maxAge: 8000 * 1000}
                        // }
                        // if (sessionUseRedis) {
                        //     if(!redis) {
                        //         throw  `开启sessionUseRedis时，必需定义redis配置`
                        //     }
                        //     //REDIS_SESSION
                        //     const RedisStore = connectRedis(session);
                        //     sessionOpt.store = new RedisStore({
                        //         host: redis.host,
                        //         port: redis.port,
                        //         pass: redis.password || ''
                        //     })
                        //     console.log('Session存储方式：Redis ....')
                        // } else {
                        //     console.log('Session存储方式：进程内存 ....')
                        // }
                        // _server.use(session(sessionOpt));
                        // if (staticPath) {
                        //     _server.use(express.static(staticPath));
                        // }

                        if (cros) {
                            //设置跨域访问
                            cros_origin = cros_origin.map(function (item) {
                                return item.toLowerCase();
                            });
                            cros_headers = cros_headers.map(function (item) {
                                return item.toLowerCase();
                            });
                            allow_Header = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'jwtoken', 'token', 'frontpage', 'withCredentials', 'credentials'].map(function (item) {
                                return item.toLowerCase();
                            });

                            _server.use(function (req, res, next) {
                                res.header("Access-Control-Allow-Origin", cros_origin.length === 0 ? "*" : cros_origin.join(','));
                                res.header("Access-Control-Allow-Credentials", "true");
                                res.header("Access-Control-Allow-Methods", "HEAD,OPTIONS,POST");
                                res.header("Access-Control-Allow-Headers", " " + [].concat(_toConsumableArray(allow_Header), _toConsumableArray(cros_headers)).join(", "));
                                if ('OPTIONS' === req.method) {
                                    res.sendStatus(200);
                                } else {
                                    next();
                                }
                            });
                        }

                        if (!(typeof custom === "function")) {
                            _context.next = 35;
                            break;
                        }

                        _context.next = 34;
                        return custom(_server);

                    case 34:
                        _server = _context.sent;

                    case 35:

                        _server.use(apiroot, _router);

                        // catch 404 and forward to error handler
                        _server.use(function (req, res, next) {
                            res.status = 404;
                            res.json({ err: 'API Not Defined!', result: null });
                        });

                        return _context.abrupt("return", _server);

                    case 38:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function _create_server(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var _create_router = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref4) {
        var apiroot = _ref4.apiroot,
            _modelClasses = _ref4.modelClasses,
            beforeCall = _ref4.beforeCall,
            afterCall = _ref4.afterCall,
            method404 = _ref4.method404,
            frontpage_default = _ref4.frontpage_default;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return ModelProxy.CreateListenRouter({
                            apiroot: apiroot,
                            modelClasses: _modelClasses,
                            beforeCall: beforeCall,
                            afterCall: afterCall,
                            method404: method404,
                            frontpage_default: frontpage_default
                        });

                    case 2:
                        return _context2.abrupt("return", _context2.sent);

                    case 3:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function _create_router(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

/**
 * 以Server（内置Express）的方式运行API微服务
 *
 * @param options
 * @returns {Promise.<*>}
 */
var createServer = exports.createServer = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(options) {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (_server) {
                            _context3.next = 4;
                            break;
                        }

                        _context3.next = 3;
                        return _create_server('server', options);

                    case 3:
                        _server = _context3.sent;

                    case 4:
                        return _context3.abrupt("return", _server);

                    case 5:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function createServer(_x4) {
        return _ref5.apply(this, arguments);
    };
}();

/**
 * 以Express-Router的方式运行API微服务，通常用于在独立的Express站点中增加一个子路由来实现API服务入口
 *
 * @param options
 * @returns {Promise.<*>}
 */
var createServerInRouter = exports.createServerInRouter = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(options) {
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        if (_router) {
                            _context4.next = 4;
                            break;
                        }

                        _context4.next = 3;
                        return _create_server('router', options);

                    case 3:
                        _router = _context4.sent;

                    case 4:
                        return _context4.abrupt("return", _router);

                    case 5:
                    case "end":
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function createServerInRouter(_x5) {
        return _ref6.apply(this, arguments);
    };
}();

/**
 * 快速封装一个{success: true}结构的对象，代表当前API的业务操作成功。可附带扩展属性
 * @param ps
 * @returns {{success: boolean}}
 * @constructor
 */
var GKSUCCESS = exports.GKSUCCESS = function GKSUCCESS(ps) {
    if (ps) {
        return _extends({ success: true }, ps instanceof Object ? ps : { msg: ps });
    } else {
        return { success: true };
    }
};

exports.getGankaoWXAuthToken = _redisClient.getGankaoWXAuthToken;
exports.setting_redisConfig = _redisClient.setting_redisConfig;
exports.getRedisClient = _redisClient.getRedisClient;
exports.GKErrorWrap = _GKErrorWrap.GKErrorWrap;
exports.modelSetting = _Decorators.modelSetting;
exports.cacheAble = _Decorators.cacheAble;
exports.clearCache = _Decorators.clearCache;
exports.crashAfterMe = _Decorators.crashAfterMe;
exports.accessRule = _Decorators.accessRule;
exports.setting_CustomRuleValidator = _index.setting_CustomRuleValidator;
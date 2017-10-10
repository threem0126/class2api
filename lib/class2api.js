"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.definedStaticField = exports.crashAfterMe = exports.clearCache = exports.cacheAble = exports.modelSetting = exports.GKErrors = exports.GKErrorWrap = exports.getRedisClient = exports.getting_redisConfig = exports.setting_redisConfig = exports.getGankaoWXAuthToken = exports.createServer = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

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

var _connectRedis = require("connect-redis");

var _connectRedis2 = _interopRequireDefault(_connectRedis);

var _logger = require("./logger.js");

var _logger2 = _interopRequireDefault(_logger);

var _lodash = require("lodash");

var _log4js = require("log4js");

var _log4js2 = _interopRequireDefault(_log4js);

var _ModelProxy = require("./ModelProxy");

var ModelProxy = _interopRequireWildcard(_ModelProxy);

var _redisClient = require("./redisClient");

var _GKError = require("./GKError");

var _Decorators = require("./Decorators");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

console.dir("Nice to meet U, I will help You to map Class to API interface ....");


var logger = (0, _logger2.default)();
var _server = void 0;

var _create_server = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(options) {
        var config, custom, modelClasses, beforeCall, afterCall, method404, _config, _config$cros, cros, _config$cros_headers, cros_headers, _config$cros_origin, cros_origin, _config$frontpage_def, frontpage_default, _config$apiroot, apiroot, _config$sessionKey, sessionKey, _config$sessionSecret, sessionSecret, _config$sessionUseRed, sessionUseRedis, _config$staticPath, staticPath, redis, sessionOpt, RedisStore, allow_Header, _ref2, cus_express_fn, _modelClasses;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        config = options.config, custom = options.custom, modelClasses = options.modelClasses, beforeCall = options.beforeCall, afterCall = options.afterCall, method404 = options.method404;

                        if (!(typeof config !== "function")) {
                            _context.next = 3;
                            break;
                        }

                        throw "\u914D\u7F6E\u53C2\u6570\u4E2D\u672A\u4F20\u5165config[Function]\u5C5E\u6027";

                    case 3:
                        _config = config(), _config$cros = _config.cros, cros = _config$cros === undefined ? true : _config$cros, _config$cros_headers = _config.cros_headers, cros_headers = _config$cros_headers === undefined ? [] : _config$cros_headers, _config$cros_origin = _config.cros_origin, cros_origin = _config$cros_origin === undefined ? [] : _config$cros_origin, _config$frontpage_def = _config.frontpage_default, frontpage_default = _config$frontpage_def === undefined ? '' : _config$frontpage_def, _config$apiroot = _config.apiroot, apiroot = _config$apiroot === undefined ? '/' : _config$apiroot, _config$sessionKey = _config.sessionKey, sessionKey = _config$sessionKey === undefined ? 'class2api' : _config$sessionKey, _config$sessionSecret = _config.sessionSecret, sessionSecret = _config$sessionSecret === undefined ? 'class2api' : _config$sessionSecret, _config$sessionUseRed = _config.sessionUseRedis, sessionUseRedis = _config$sessionUseRed === undefined ? false : _config$sessionUseRed, _config$staticPath = _config.staticPath, staticPath = _config$staticPath === undefined ? '' : _config$staticPath, redis = _config.redis;


                        _server = (0, _express2.default)();
                        // Security
                        _server.disable("x-powered-by");
                        _server.use(_bodyParser2.default.urlencoded({ extended: false }));
                        _server.use(_bodyParser2.default.json({ limit: "5000kb" }));
                        _server.use((0, _hpp2.default)());
                        _server.use(_helmet2.default.xssFilter());
                        _server.use(_helmet2.default.frameguard("deny"));
                        _server.use(_helmet2.default.ieNoOpen());
                        _server.use(_helmet2.default.noSniff());
                        _server.use((0, _cookieParser2.default)());
                        _server.use((0, _compression2.default)());
                        _server.use(_log4js2.default.connectLogger(logger, { level: _log4js2.default.levels.INFO, format: ':method :url' }));

                        //启用Session，可选Redis存储。PM2集群模式时，必须用分布式存储
                        sessionOpt = {
                            secret: sessionSecret,
                            key: sessionKey,
                            resave: false,
                            saveUninitialized: true,
                            cookie: { maxAge: 8000 * 1000 }
                        };

                        if (sessionUseRedis) {
                            //REDIS_SESSION
                            RedisStore = (0, _connectRedis2.default)(_expressSession2.default);

                            sessionOpt.store = new RedisStore({
                                host: redis.host,
                                port: redis.port,
                                pass: redis.password || ''
                            });
                            console.log('Session存储方式：Redis ....');
                        } else {
                            console.log('Session存储方式：进程内存 ....');
                        }
                        _server.use((0, _expressSession2.default)(sessionOpt));
                        //_server.use(morgan("combined"));
                        if (staticPath) {
                            _server.use(_express2.default.static(staticPath));
                        }
                        if (cros) {
                            //设置跨域访问
                            cros_origin = cros_origin.map(function (item) {
                                return item.toLowerCase();
                            });
                            cros_headers = cros_headers.map(function (item) {
                                return item.toLowerCase();
                            });
                            allow_Header = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'token'].map(function (item) {
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

                        _context.next = 23;
                        return custom();

                    case 23:
                        _ref2 = _context.sent;
                        cus_express_fn = _ref2.express;

                        if (!cus_express_fn) {
                            _context.next = 29;
                            break;
                        }

                        _context.next = 28;
                        return cus_express_fn(_server);

                    case 28:
                        _server = _context.sent;

                    case 29:
                        _modelClasses = modelClasses();

                        // API相关路由,在main内部映射到各个功能Model

                        _context.t0 = _server;
                        _context.t1 = apiroot;
                        _context.next = 34;
                        return ModelProxy.CreateListenRouter({ apiroot: apiroot, modelClasses: _modelClasses, beforeCall: beforeCall, afterCall: afterCall, method404: method404, frontpage_default: frontpage_default });

                    case 34:
                        _context.t2 = _context.sent;

                        _context.t0.use.call(_context.t0, _context.t1, _context.t2);

                        // catch 404 and forward to error handler
                        _server.use(function (req, res, next) {
                            res.status = 404;
                            res.json({ err: 'API Not Defined!', result: null });
                        });

                        if (!redis) {
                            _context.next = 42;
                            break;
                        }

                        _context.next = 40;
                        return (0, _redisClient.setting_redisConfig)(redis);

                    case 40:
                        _context.next = 42;
                        return (0, _redisClient.getRedisClient)();

                    case 42:
                        return _context.abrupt("return", _server);

                    case 43:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function _create_server(_x) {
        return _ref.apply(this, arguments);
    };
}();

var createServer = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(options) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (_server) {
                            _context2.next = 4;
                            break;
                        }

                        _context2.next = 3;
                        return _create_server(options);

                    case 3:
                        _server = _context2.sent;

                    case 4:
                        return _context2.abrupt("return", _server);

                    case 5:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function createServer(_x2) {
        return _ref3.apply(this, arguments);
    };
}();

var GKErrors = {
    _NO_RESULT: (0, _GKError.GKErrorWrap)(-3, "\u65E0\u5339\u914D\u7ED3\u679C"),
    _SERVER_ERROR: (0, _GKError.GKErrorWrap)(-2, "\u670D\u52A1\u53D1\u751F\u5F02\u5E38"), //最常用的
    _NOT_PARAMS: (0, _GKError.GKErrorWrap)(-1, "\u7F3A\u5C11\u53C2\u6570"),
    _PARAMS_VALUE_EXPECT: (0, _GKError.GKErrorWrap)(1001, "\u53C2\u6570\u4E0D\u7B26\u5408\u9884\u671F"),
    _NOT_SERVICE: (0, _GKError.GKErrorWrap)(1002, "\u529F\u80FD\u5373\u5C06\u5B9E\u73B0"),
    _NOT_ACCESS_PERMISSION: (0, _GKError.GKErrorWrap)(1004, "\u65E0\u8BBF\u95EE\u6743\u9650"),
    _TOKEN_LOGIN_INVALID: (0, _GKError.GKErrorWrap)(1006, "\u8BF7\u5148\u767B\u5F55")
};

exports.createServer = createServer;
exports.getGankaoWXAuthToken = _redisClient.getGankaoWXAuthToken;
exports.setting_redisConfig = _redisClient.setting_redisConfig;
exports.getting_redisConfig = _redisClient.getting_redisConfig;
exports.getRedisClient = _redisClient.getRedisClient;
exports.GKErrorWrap = _GKError.GKErrorWrap;
exports.GKErrors = GKErrors;
exports.modelSetting = _Decorators.modelSetting;
exports.cacheAble = _Decorators.cacheAble;
exports.clearCache = _Decorators.clearCache;
exports.crashAfterMe = _Decorators.crashAfterMe;
exports.definedStaticField = _Decorators.definedStaticField;
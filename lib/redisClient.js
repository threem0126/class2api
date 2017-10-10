'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__setGankaoWXAuthToken = exports.getRedisClient = exports.getting_redisConfig = exports.setting_redisConfig = exports.getGankaoWXAuthToken = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _redisClient = void 0;
var _redisConfig = void 0;

var getGankaoWXAuthToken = exports.getGankaoWXAuthToken = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(gkwxauthtoken) {
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!_redisClient) {
                            setTimeout(function () {
                                throw '_redisClient对象尚未初始化，请先引用 redisClient.js ';
                            });
                        }
                        _context.next = 3;
                        return _redisClient.getAsyncOrig(gkwxauthtoken);

                    case 3:
                        return _context.abrupt('return', _context.sent);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getGankaoWXAuthToken(_x) {
        return _ref.apply(this, arguments);
    };
}();

var setting_redisConfig = exports.setting_redisConfig = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(redisConfig) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _redisConfig = redisConfig;

                    case 1:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function setting_redisConfig(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var getting_redisConfig = exports.getting_redisConfig = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        return _context3.abrupt('return', _redisConfig);

                    case 1:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function getting_redisConfig() {
        return _ref3.apply(this, arguments);
    };
}();

var getRedisClient = exports.getRedisClient = function getRedisClient() {
    if (!_redisConfig) {
        throw 'redis\u914D\u7F6E\u4FE1\u606F\u5C1A\u672A\u8BBE\u7F6E\uFF08\u8BF7\u8C03\u7528setting_redisConfig\uFF09';
    }
    if (_redisClient) {
        return _redisClient;
    }

    var _redisConfig2 = _redisConfig,
        redis_cache_key_prefx = _redisConfig2.cache_prefx;

    _redisClient = _redis2.default.createClient({
        host: _redisConfig.host,
        port: _redisConfig.port
    });

    console.log('\u94FE\u63A5Redis\u670D\u52A1\u5668 on ' + _redisConfig.host + ':' + _redisConfig.port + ' ... ...');
    _redisClient.on("error", function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(err) {
            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            console.error("Error " + err);

                        case 1:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined);
        }));

        return function (_x3) {
            return _ref4.apply(this, arguments);
        };
    }());

    var onAuthDone = function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
            var key, avalue, deleted;
            return _regenerator2.default.wrap(function _callee5$(_context5) {
                while (1) {
                    switch (_context5.prev = _context5.next) {
                        case 0:
                            console.log('\u94FE\u63A5Redis\u670D\u52A1\u5668 on ' + _redisConfig.host + ':' + _redisConfig.port + ' ... ...\u6210\u529F!');
                            //  this key will expires after 10 seconds
                            key = '__test_redis';
                            // 测试

                            _context5.next = 4;
                            return _redisClient.setAsync(key, JSON.stringify({ hello: "world" }), 'EX', 10);

                        case 4:
                            console.log('\u6D4B\u8BD5\uFF0C\u521B\u5EFA redis key:' + key);
                            _context5.next = 7;
                            return _redisClient.getAsync(key);

                        case 7:
                            avalue = _context5.sent;

                            console.log('\u6D4B\u8BD5\uFF0C\u8BFB\u53D6 redis key:' + key + ',value:' + avalue);
                            _context5.next = 11;
                            return _redisClient.delAsync(key);

                        case 11:
                            deleted = _context5.sent;

                            console.log('\u6D4B\u8BD5\uFF0C\u5220\u9664\u4E86redis key:' + key + ',' + deleted);

                        case 13:
                        case 'end':
                            return _context5.stop();
                    }
                }
            }, _callee5, undefined);
        }));

        return function onAuthDone() {
            return _ref5.apply(this, arguments);
        };
    }();

    _redisClient.on("connect", function () {
        var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee11(err) {
            var _redisConfig3, password;

            return _regenerator2.default.wrap(function _callee11$(_context11) {
                while (1) {
                    switch (_context11.prev = _context11.next) {
                        case 0:
                            _bluebird2.default.promisifyAll(_redisClient);

                            console.log('\u94FE\u63A5Redis\u670D\u52A1\u5668 on ' + _redisConfig.host + ':' + _redisConfig.port + ' ... ...connecting ...');
                            //
                            _redisConfig3 = _redisConfig, password = _redisConfig3.password;

                            if (!password) {
                                _context11.next = 7;
                                break;
                            }

                            _redisClient.auth(password, function () {
                                var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(err, result) {
                                    return _regenerator2.default.wrap(function _callee6$(_context6) {
                                        while (1) {
                                            switch (_context6.prev = _context6.next) {
                                                case 0:
                                                    _context6.next = 2;
                                                    return onAuthDone();

                                                case 2:
                                                case 'end':
                                                    return _context6.stop();
                                            }
                                        }
                                    }, _callee6, undefined);
                                }));

                                return function (_x5, _x6) {
                                    return _ref7.apply(this, arguments);
                                };
                            }());
                            _context11.next = 9;
                            break;

                        case 7:
                            _context11.next = 9;
                            return onAuthDone();

                        case 9:
                            try {

                                _redisClient.getAsyncOrig = _redisClient.getAsync;
                                _redisClient.getAsync = function () {
                                    var _ref8 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
                                        var _redisClient2;

                                        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
                                            params[_key] = arguments[_key];
                                        }

                                        return _regenerator2.default.wrap(function _callee7$(_context7) {
                                            while (1) {
                                                switch (_context7.prev = _context7.next) {
                                                    case 0:
                                                        params[0] = redis_cache_key_prefx + params[0];
                                                        _context7.next = 3;
                                                        return (_redisClient2 = _redisClient).getAsyncOrig.apply(_redisClient2, params);

                                                    case 3:
                                                        return _context7.abrupt('return', _context7.sent);

                                                    case 4:
                                                    case 'end':
                                                        return _context7.stop();
                                                }
                                            }
                                        }, _callee7, undefined);
                                    }));

                                    return function () {
                                        return _ref8.apply(this, arguments);
                                    };
                                }();
                                //
                                _redisClient.setAsyncOrig = _redisClient.setAsync;
                                _redisClient.setAsync = function () {
                                    var _ref9 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
                                        var _redisClient3;

                                        for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                                            params[_key2] = arguments[_key2];
                                        }

                                        return _regenerator2.default.wrap(function _callee8$(_context8) {
                                            while (1) {
                                                switch (_context8.prev = _context8.next) {
                                                    case 0:
                                                        params[0] = redis_cache_key_prefx + params[0];
                                                        _context8.next = 3;
                                                        return (_redisClient3 = _redisClient).setAsyncOrig.apply(_redisClient3, params);

                                                    case 3:
                                                        return _context8.abrupt('return', _context8.sent);

                                                    case 4:
                                                    case 'end':
                                                        return _context8.stop();
                                                }
                                            }
                                        }, _callee8, undefined);
                                    }));

                                    return function () {
                                        return _ref9.apply(this, arguments);
                                    };
                                }();
                                //
                                _redisClient.delAsyncOrig = _redisClient.delAsync;
                                _redisClient.delAsync = function () {
                                    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
                                        var _redisClient4;

                                        for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                                            params[_key3] = arguments[_key3];
                                        }

                                        return _regenerator2.default.wrap(function _callee9$(_context9) {
                                            while (1) {
                                                switch (_context9.prev = _context9.next) {
                                                    case 0:
                                                        params[0] = redis_cache_key_prefx + params[0];
                                                        _context9.next = 3;
                                                        return (_redisClient4 = _redisClient).delAsyncOrig.apply(_redisClient4, params);

                                                    case 3:
                                                        return _context9.abrupt('return', _context9.sent);

                                                    case 4:
                                                    case 'end':
                                                        return _context9.stop();
                                                }
                                            }
                                        }, _callee9, undefined);
                                    }));

                                    return function () {
                                        return _ref10.apply(this, arguments);
                                    };
                                }();
                                //
                                _redisClient.expireAsyncOrig = _redisClient.expireAsync;
                                _redisClient.expireAsync = function () {
                                    var _ref11 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
                                        var _redisClient5;

                                        for (var _len4 = arguments.length, params = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                                            params[_key4] = arguments[_key4];
                                        }

                                        return _regenerator2.default.wrap(function _callee10$(_context10) {
                                            while (1) {
                                                switch (_context10.prev = _context10.next) {
                                                    case 0:
                                                        params[0] = redis_cache_key_prefx + params[0];
                                                        _context10.next = 3;
                                                        return (_redisClient5 = _redisClient).expireAsyncOrig.apply(_redisClient5, params);

                                                    case 3:
                                                        return _context10.abrupt('return', _context10.sent);

                                                    case 4:
                                                    case 'end':
                                                        return _context10.stop();
                                                }
                                            }
                                        }, _callee10, undefined);
                                    }));

                                    return function () {
                                        return _ref11.apply(this, arguments);
                                    };
                                }();
                            } catch (err) {
                                console.error('_redisClient\u5F02\u6B65Promise\u5316\u9047\u5230\u9519\u8BEF\uFF1A' + err);
                            }

                        case 10:
                        case 'end':
                            return _context11.stop();
                    }
                }
            }, _callee11, undefined);
        }));

        return function (_x4) {
            return _ref6.apply(this, arguments);
        };
    }());
    return _redisClient;
};

/***
 * 微信授权网关的保留方法，其他应用只可读取，严禁调用更新
 */
var __setGankaoWXAuthToken = exports.__setGankaoWXAuthToken = function () {
    var _ref12 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee12(gkwxauthtoken, wxuserinfo) {
        return _regenerator2.default.wrap(function _callee12$(_context12) {
            while (1) {
                switch (_context12.prev = _context12.next) {
                    case 0:
                        _context12.next = 2;
                        return _redisClient.setAsyncOrig(gkwxauthtoken, wxuserinfo);

                    case 2:
                    case 'end':
                        return _context12.stop();
                }
            }
        }, _callee12, undefined);
    }));

    return function __setGankaoWXAuthToken(_x7, _x8) {
        return _ref12.apply(this, arguments);
    };
}();
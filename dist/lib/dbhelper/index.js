'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DBUtils = exports.DBModelLoader = exports.TableSetting = undefined;

var _iterator = require('babel-runtime/core-js/symbol/iterator');

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _dbutils = require('./dbutils');

var DBUtils = _interopRequireWildcard(_dbutils);

var _util = require('./../class2api/util');

var _tablesetting = require('./tablesetting');

var TableSetting = _interopRequireWildcard(_tablesetting);

var _GKErrors_Inner = require('../class2api/GKErrors_Inner');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _promise2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _promise2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _dbList = {};

var _inner_DBModelLoader = function _inner_DBModelLoader(option) {
    //内部初始化
    var sequelize = void 0; //内部初始化的sequelize实例子，注意，禁止暴露给外部，以避免安全问题
    var _config_option = option;
    var fn = void 0;
    var col = void 0;
    var literal = void 0;
    var where = void 0;

    //依赖外部数据的初始化
    var _model_objects = {};
    var _ass = {};

    //region 初始化sequelize对象
    var _INIT = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
            var database, user, password, host, port, hasScope;
            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            database = _config_option.database, user = _config_option.user, password = _config_option.password, host = _config_option.host, port = _config_option.port;

                            sequelize = new _sequelize2.default(database, user, password, {
                                host: host,
                                port: port,
                                timezone: "+08:00",
                                pool: {
                                    max: 5,
                                    min: 0,
                                    idle: 10000
                                },
                                dialect: 'mysql',
                                benchmark: process.env.SQL_PRINT === '1',
                                logging: process.env.SQL_PRINT === '1' ? function () {
                                    var _console;

                                    return (_console = console).log.apply(_console, arguments);
                                } : null
                            });

                            hasScope = false;
                            //先初始化非Scope的Model

                            (0, _keys2.default)(_model_objects).forEach(function (modelName) {
                                var fun = _model_objects[modelName];
                                if (!fun.scopeBaseModelName) {
                                    _model_objects[modelName] = fun.call();
                                } else {
                                    hasScope = true;
                                }
                            });

                            if (hasScope) {
                                //再初始化Scope类型的Model
                                (0, _keys2.default)(_model_objects).forEach(function (modelName) {
                                    var fun = _model_objects[modelName];
                                    if (fun.scopeBaseModelName) {
                                        _model_objects[modelName] = fun.call(null, _model_objects[fun.scopeBaseModelName]);
                                    }
                                });
                            }

                            //补充初始化model的关联关系
                            (0, _keys2.default)(_model_objects).forEach(function (modelName) {
                                if ('associate' in _model_objects[modelName]) {
                                    _model_objects[modelName].associate(_model_objects, _ass);
                                }
                            });
                            fn = _sequelize2.default.fn;
                            col = _sequelize2.default.col;
                            literal = _sequelize2.default.literal;
                            where = _sequelize2.default.where;
                            //
                            _model_objects.__resetDB = ResetDB;
                            _model_objects.__createTransaction = createTransaction;
                            _model_objects.__excuteSQL = excuteSQL;
                            _model_objects.__fn = fn;
                            _model_objects.__col = col;
                            _model_objects.__literal = literal;
                            _model_objects.__where = where;

                        case 17:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function _INIT() {
            return _ref.apply(this, arguments);
        };
    }();

    var createTransaction = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
            return _regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return sequelize.transaction();

                        case 2:
                            return _context2.abrupt('return', _context2.sent);

                        case 3:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, undefined);
        }));

        return function createTransaction() {
            return _ref2.apply(this, arguments);
        };
    }();

    var excuteSQL = function () {
        var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(sql, options) {
            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            _context3.next = 2;
                            return sequelize.query(sql, options || {});

                        case 2:
                            return _context3.abrupt('return', _context3.sent);

                        case 3:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, undefined);
        }));

        return function excuteSQL(_x, _x2) {
            return _ref3.apply(this, arguments);
        };
    }();

    var ResetDB = function () {
        var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
            var _config_option$reset_, key1, key2;

            return _regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.prev = 0;
                            _config_option$reset_ = _config_option.reset_key, key1 = _config_option$reset_.key1, key2 = _config_option$reset_.key2;

                            if (!(process.env.DB_RESET_1 === key1 && process.env.DB_RESET_2 === key2)) {
                                _context4.next = 14;
                                break;
                            }

                            if (!(process.env.NODE_ENV !== 'production')) {
                                _context4.next = 11;
                                break;
                            }

                            console.info("DB Inited ... ...");
                            _context4.next = 7;
                            return sequelize.sync({ force: process.env.FORCE === "1" });

                        case 7:
                            console.info("DB Inited Done! ");
                            return _context4.abrupt('return', true);

                        case 11:
                            console.error("危险！在production环境执行 Reset操作是被禁止的！");

                        case 12:
                            _context4.next = 15;
                            break;

                        case 14:
                            console.info("ResetDB 调用失败，重置key无法与process.env.DB_RESET_1、process.env.DB_RESET_2匹配通过！嘿！注意这可是危险操作！");

                        case 15:
                            return _context4.abrupt('return', false);

                        case 18:
                            _context4.prev = 18;
                            _context4.t0 = _context4['catch'](0);

                            console.error('error in ResetDB:');
                            console.error(_context4.t0);
                            throw _context4.t0;

                        case 23:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, undefined, [[0, 18]]);
        }));

        return function ResetDB() {
            return _ref4.apply(this, arguments);
        };
    }();
    //endregion


    //region 功能代码

    return {
        define: function define(sequelizeModelFactory) {
            var _sequelizeModelFactory = sequelizeModelFactory;
            return function () {
                return _sequelizeModelFactory(sequelize, _sequelize2.default);
            };
        },
        defineScope: function defineScope(sequelizeModelScopeFactory, baseModelName) {
            var _sequelizeModelScopeFactory = sequelizeModelScopeFactory;
            var fun = function fun(baseModel) {
                return _sequelizeModelScopeFactory(baseModel);
            };
            fun.scopeBaseModelName = baseModelName;
            return fun;
        },
        INIT: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(_ref6) {
                var model = _ref6.model,
                    ass = _ref6.ass;
                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                if (model) {
                                    _context5.next = 2;
                                    break;
                                }

                                throw '\u672A\u63D0\u4F9Bmodel\u53C2\u6570';

                            case 2:
                                if (ass) {
                                    _context5.next = 4;
                                    break;
                                }

                                throw '\u672A\u63D0\u4F9Bass\u53C2\u6570';

                            case 4:

                                _model_objects = model;
                                _ass = ass;
                                _context5.next = 8;
                                return _INIT(option);

                            case 8:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, undefined);
            }));

            return function INIT(_x3) {
                return _ref5.apply(this, arguments);
            };
        }(),
        excuteSQL: excuteSQL
    };
};

//内部带放重复创建的功能，相同的mysql配置，确保只创建一份sequelize对象
var DBModelLoader = function DBModelLoader(option) {
    if (!option || (typeof option === 'undefined' ? 'undefined' : _typeof(option)) !== "object") {
        throw _GKErrors_Inner.GKErrors._SERVER_ERROR('DBModelLoader\u8C03\u7528\u7F3A\u5C11\u53C2\u6570\u6216\u53C2\u6570\u4E0D\u662F{key/value}\u5BF9\u8C61');
    }
    var database = option.database,
        host = option.host,
        port = option.port;

    var hashKey = (0, _util.hashcode)((0, _stringify2.default)({ database: database, host: host, port: port }));
    if (!_dbList[hashKey]) {
        var loader = _inner_DBModelLoader(option);
        _dbList[hashKey] = loader;
    }
    return _dbList[hashKey];
};

exports.TableSetting = TableSetting;
exports.DBModelLoader = DBModelLoader;
exports.DBUtils = DBUtils;
//endregion
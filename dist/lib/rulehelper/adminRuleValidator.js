'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _defineProperty = require('babel-runtime/core-js/object/define-property');

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require('babel-runtime/core-js/object/get-own-property-descriptor');

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; (0, _defineProperty2.default)(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _desc, _value, _class;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Decorators = require('./../class2api/Decorators');

var _GKErrors_Inner = require('../class2api/GKErrors_Inner');

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _util = require('./../class2api/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _promise2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _promise2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

var class2api_config = void 0;
try {
    var _require = require(_path2.default.join(process.cwd(), 'class2api.config.js')),
        config = _require.config;

    class2api_config = config;
} catch (err) {
    //..
}

var _ref = class2api_config || {},
    sysName = _ref.sysName,
    admin_rule_center = _ref.admin_rule_center;

var RuleValidator = (_dec = (0, _Decorators.cacheAble)({
    cacheKeyGene: function cacheKeyGene(_ref2) {
        var jwtoken = _ref2.jwtoken;

        return jwtoken;
    }
}), _dec2 = (0, _Decorators.cacheAble)({
    cacheKeyGene: function cacheKeyGene(_ref3) {
        var _ref3$jwtoken = _ref3.jwtoken,
            jwtoken = _ref3$jwtoken === undefined ? '' : _ref3$jwtoken,
            _ref3$categoryName = _ref3.categoryName,
            categoryName = _ref3$categoryName === undefined ? '' : _ref3$categoryName,
            _ref3$ruleName = _ref3.ruleName,
            ruleName = _ref3$ruleName === undefined ? '' : _ref3$ruleName;

        //以jwtoken、功能组名称、权限名称来组合索引，混存上一次的判断结果
        return jwtoken ? '_ruleValidator_inner-' + (0, _util.hashcode)(jwtoken) + '-' + (0, _util.hashcode)(categoryName) + '-' + (0, _util.hashcode)(ruleName) : '';
    }
}), (_class = function () {
    function RuleValidator() {
        _classCallCheck(this, RuleValidator);

        throw '静态业务功能类无法实例化';
    }

    /**
     * 从jstoken值解析后台管理用户的账号
     *
     * @param jstoken
     * @returns {Promise.<*>}
     */


    _createClass(RuleValidator, null, [{
        key: 'parseAdminAccountFromJWToken',
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref5) {
                var jwtoken = _ref5.jwtoken;

                var res, _ref6, err, result, _gankao, _gankao2;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (jwtoken) {
                                    _context.next = 2;
                                    break;
                                }

                                throw _GKErrors_Inner.GKErrors._TOKEN_LOGIN_INVALID('\u6807\u8BB0\u8EAB\u4EFD\u9A8C\u8BC1\u7684jwtoken\u672A\u63D0\u4F9B');

                            case 2:
                                _context.prev = 2;
                                _context.next = 5;
                                return (0, _isomorphicFetch2.default)(admin_rule_center.auth, {
                                    method: 'post',
                                    rejectUnauthorized: false,
                                    headers: {
                                        'Accept': 'application/json, text/plain, */*',
                                        'Content-Type': 'application/json',
                                        'jwtoken': jwtoken
                                    },
                                    withCredentials: 'true',
                                    json: true,
                                    body: (0, _stringify2.default)({ nothing: 1 })
                                });

                            case 5:
                                res = _context.sent;
                                _context.next = 8;
                                return res.json();

                            case 8:
                                _ref6 = _context.sent;
                                err = _ref6.err;
                                result = _ref6.result;

                                if (!err) {
                                    _context.next = 18;
                                    break;
                                }

                                _gankao = err._gankao;

                                if (!(_gankao === '1')) {
                                    _context.next = 17;
                                    break;
                                }

                                throw err;

                            case 17:
                                throw _GKErrors_Inner.GKErrors._TOKEN_LOGIN_INVALID('jwtoken\u65E0\u6CD5\u8BC6\u522B\uFF1A' + (0, _stringify2.default)(err));

                            case 18:
                                return _context.abrupt('return', result);

                            case 21:
                                _context.prev = 21;
                                _context.t0 = _context['catch'](2);

                                //权限认证出错
                                _gankao2 = _context.t0._gankao;

                                console.error(_context.t0);

                                if (!(_gankao2 === '1')) {
                                    _context.next = 29;
                                    break;
                                }

                                throw _context.t0;

                            case 29:
                                if (!(process.env.NODE_ENV !== "production")) {
                                    _context.next = 33;
                                    break;
                                }

                                setTimeout(function () {
                                    throw _context.t0;
                                });
                                _context.next = 34;
                                break;

                            case 33:
                                throw _GKErrors_Inner.GKErrors._SERVER_ERROR('\u9A8C\u8BC1\u8EAB\u4EFD\u65F6\u9047\u5230\u5F02\u5E38' + (0, _stringify2.default)(_context.t0));

                            case 34:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[2, 21]]);
            }));

            function parseAdminAccountFromJWToken(_x) {
                return _ref4.apply(this, arguments);
            }

            return parseAdminAccountFromJWToken;
        }()
    }, {
        key: '_ruleValidator_inner',
        value: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref8) {
                var sysName = _ref8.sysName,
                    jwtoken = _ref8.jwtoken,
                    categoryName = _ref8.categoryName,
                    categoryDesc = _ref8.categoryDesc,
                    ruleName = _ref8.ruleName,
                    ruleDesc = _ref8.ruleDesc,
                    codePath = _ref8.codePath;
                var res, text, jsonResult;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.prev = 0;

                                if (process.env.NODE_ENV !== "production") {
                                    console.log('\u6743\u9650,\u5411\u4E2D\u5FC3\u8BF7\u6C42\u6388\u6743\u8BA4\u8BC1(' + admin_rule_center.validator + '\uFF09...');
                                }
                                _context2.next = 4;
                                return (0, _isomorphicFetch2.default)(admin_rule_center.validator, {
                                    method: 'post',
                                    rejectUnauthorized: false,
                                    headers: {
                                        'Accept': 'application/json, text/plain, */*',
                                        'Content-Type': 'application/json',
                                        'jwtoken': jwtoken
                                    },
                                    withCredentials: 'true',
                                    json: true,
                                    body: (0, _stringify2.default)({ sysName: sysName, categoryName: categoryName, categoryDesc: categoryDesc, ruleName: ruleName, ruleDesc: ruleDesc, codePath: codePath })
                                });

                            case 4:
                                res = _context2.sent;
                                _context2.next = 7;
                                return res.text();

                            case 7:
                                text = _context2.sent;

                                if (process.env.NODE_ENV !== "production") {
                                    console.log('\u6743\u9650\uFF0C\u6388\u6743\u7ED3\u679C\u8FD4\u56DE\uFF1A');
                                    console.log(text);
                                }
                                _context2.prev = 9;
                                jsonResult = JSON.parse(text);
                                return _context2.abrupt('return', jsonResult);

                            case 14:
                                _context2.prev = 14;
                                _context2.t0 = _context2['catch'](9);

                                console.error('\u6743\u9650\uFF0C\u6388\u6743\u7ED3\u679C\u4E3A\u975Ejson\u683C\u5F0F\u7684\u5B57\u7B26\u4E32\uFF0C\u5C01\u88C5\u4E3A{err,result}\u63A5\u53E3...');
                                console.error({ err: null, result: text });
                                return _context2.abrupt('return', { err: null, result: text });

                            case 19:
                                _context2.next = 31;
                                break;

                            case 21:
                                _context2.prev = 21;
                                _context2.t1 = _context2['catch'](0);

                                if (!(process.env.NODE_ENV !== "production")) {
                                    _context2.next = 28;
                                    break;
                                }

                                console.error('调用权限认证接口时遇到程序错误，开发环境，将终止程序 ...');
                                throw _context2.t1;

                            case 28:
                                console.error('调用权限认证接口时遇到程序错误，非开发环境，转换为GKErrors._RULE_VALIDATE_ERROR错误继续向下传递 ...');
                                console.error(_context2.t1);

                            case 30:
                                throw _GKErrors_Inner.GKErrors._RULE_VALIDATE_ERROR(_context2.t1);

                            case 31:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[0, 21], [9, 14]]);
            }));

            function _ruleValidator_inner(_x2) {
                return _ref7.apply(this, arguments);
            }

            return _ruleValidator_inner;
        }()
    }]);

    return RuleValidator;
}(), (_applyDecoratedDescriptor(_class, 'parseAdminAccountFromJWToken', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class, 'parseAdminAccountFromJWToken'), _class), _applyDecoratedDescriptor(_class, '_ruleValidator_inner', [_dec2], (0, _getOwnPropertyDescriptor2.default)(_class, '_ruleValidator_inner'), _class)), _class));
exports.default = RuleValidator;
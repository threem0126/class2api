'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseAdminAccountFromJWToken = exports.accessRule = exports.setting_CustomRuleValidator = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _GKErrors_Inner = require('../class2api/GKErrors_Inner');

var _adminRuleValidator = require('./adminRuleValidator');

var _adminRuleValidator2 = _interopRequireDefault(_adminRuleValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var class2api_config = void 0;
try {
    var _require = require(_path2.default.join(process.cwd(), 'class2api.config.js')),
        config = _require.config;

    class2api_config = config;
} catch (err) {
    //..
};

var _ref = class2api_config || {},
    _ref$name = _ref.name,
    sysName = _ref$name === undefined ? '-' : _ref$name,
    admin_rule_center = _ref.admin_rule_center;

var _ruleValidator_custom = void 0;

/**
 * 权证验证起
 * @param jwtoken
 * @param ruleCategory
 * @param ruleName
 * @param ruleDesc
 * @param codePath
 * @returns {Promise.<*>}
 */
var ruleValidator = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref3) {
        var jwtoken = _ref3.jwtoken,
            categoryName = _ref3.categoryName,
            categoryDesc = _ref3.categoryDesc,
            ruleName = _ref3.ruleName,
            ruleDesc = _ref3.ruleDesc,
            codePath = _ref3.codePath,
            apiInvokeParams = _ref3.apiInvokeParams;
        var params;
        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        params = { jwtoken: jwtoken, categoryName: categoryName, categoryDesc: categoryDesc, ruleName: ruleName, ruleDesc: ruleDesc, codePath: codePath, apiInvokeParams: apiInvokeParams };

                        if (!_ruleValidator_custom) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 4;
                        return _ruleValidator_custom({ jwtoken: jwtoken, categoryName: categoryName, categoryDesc: categoryDesc, ruleName: ruleName, ruleDesc: ruleDesc, codePath: codePath });

                    case 4:
                        return _context.abrupt('return', _context.sent);

                    case 7:
                        _context.next = 9;
                        return _adminRuleValidator2.default._ruleValidator_inner(_extends({}, params, { sysName: sysName }));

                    case 9:
                        return _context.abrupt('return', _context.sent);

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function ruleValidator(_x) {
        return _ref2.apply(this, arguments);
    };
}();

/**
 * accessRule访问权限修饰器中认证函数的全局配置入口
 *
 * @param ruleValidator
 */
var setting_CustomRuleValidator = exports.setting_CustomRuleValidator = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(ruleValidator) {
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        if (!(typeof ruleValidator !== "function")) {
                            _context2.next = 2;
                            break;
                        }

                        throw _GKErrors_Inner.GKErrors._PARAMS_VALUE_EXPECT('\u63D0\u4F9B\u7ED9setting_CustomRuleValidator\u7684\u53C2\u6570\u9700\u8981\u662FFunction\uFF0C\u800C\u4E0D\u662F' + (typeof ruleValidator === 'undefined' ? 'undefined' : _typeof(ruleValidator)));

                    case 2:
                        _ruleValidator_custom = ruleValidator;

                    case 3:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function setting_CustomRuleValidator(_x2) {
        return _ref4.apply(this, arguments);
    };
}();

/**
 * 修饰器,提供访问权限的校验控制
 *
 * @param ruleName
 * @param ruleDesc
 * @returns {Function}
 */
var accessRule = function accessRule(_ref5) {
    var ruleName = _ref5.ruleName,
        _ref5$ruleDesc = _ref5.ruleDesc,
        ruleDesc = _ref5$ruleDesc === undefined ? '' : _ref5$ruleDesc;

    return function (target, name, descriptor) {
        if (!ruleName) {
            //修饰器的报错，级别更高，直接抛出终止程序
            setTimeout(function () {
                throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u6743\u9650\u63A7\u5236\u5668\u7684ruleName\u53C2\u6570\u672A\u5B9A\u4E49';
            });
        }
        var oldValue = descriptor.value;
        descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
            var jwtoken,
                _ref7,
                categoryName,
                categoryDesc,
                apiInvokeParams,
                _ref8,
                req_noused,
                res_noused,
                ___frontpageURL_noused,
                _apiInvokeParams,
                headers,
                cookies,
                frontReq,
                _ref9,
                err,
                result,
                canAccess,
                resean,
                _args3 = arguments;

            return _regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) {
                    switch (_context3.prev = _context3.next) {
                        case 0:
                            if (!target.__modelSetting || typeof target.__modelSetting !== "function" || !target.__modelSetting().__ruleCategory) {
                                //修饰器的报错，级别更高，直接抛出终止程序
                                setTimeout(function () {
                                    throw '\u7C7B ' + target.name + ' \u7684modelSetting\u4FEE\u9970\u5668\u4E2D\u6CA1\u6709\u6307\u5B9A__ruleCategory\u5C5E\u6027\uFF08\u6743\u9650\u7EC4\u4FE1\u606F\uFF09';
                                });
                            }
                            if (_args3.length === 0 || _typeof(_args3[0]) !== "object") {
                                //修饰器的报错，级别更高，直接用setTimeout抛出异常，以终止程序运行
                                setTimeout(function () {
                                    throw '\u5728\u7C7B\u9759\u6001\u65B9\u6CD5 ' + target.name + '.' + name + ' \u4E0A\u7F3A\u5C11\u8EAB\u4EFD\u53C2\u6570\uFF0C\u65E0\u6CD5\u9A8C\u8BC1\u6743\u9650';
                                });
                            }
                            jwtoken = void 0;
                            _context3.prev = 3;

                            jwtoken = _args3[0]['req'].headers['jwtoken'];

                            if (jwtoken) {
                                _context3.next = 7;
                                break;
                            }

                            throw _GKErrors_Inner.GKErrors._NOT_ACCESS_PERMISSION('\u8EAB\u4EFD\u672A\u660E\uFF0C\u60A8\u6CA1\u6709\u8BBF\u95EE' + target.name + '.' + name + '\u5BF9\u5E94API\u63A5\u53E3\u7684\u6743\u9650');

                        case 7:
                            _context3.next = 12;
                            break;

                        case 9:
                            _context3.prev = 9;
                            _context3.t0 = _context3['catch'](3);
                            throw _GKErrors_Inner.GKErrors._NOT_ACCESS_PERMISSION('\u8EAB\u4EFD\u65E0\u6CD5\u8BC6\u522B\uFF0C\u5728API\u5BF9\u5E94\u7684\u9759\u6001\u65B9\u6CD5\u4E0A\u672A\u8BFB\u53D6\u5230req\u8BF7\u6C42\u5BF9\u8C61\u7684headers[\'jwtoken\']');

                        case 12:
                            _ref7 = target.__modelSetting ? target.__modelSetting().__ruleCategory : { name: '无名', desc: '-' }, categoryName = _ref7.name, categoryDesc = _ref7.desc;
                            apiInvokeParams = '';
                            _ref8 = _args3[0] || {}, req_noused = _ref8.req, res_noused = _ref8.res, ___frontpageURL_noused = _ref8.___frontpageURL, _apiInvokeParams = _objectWithoutProperties(_ref8, ['req', 'res', '___frontpageURL']);
                            headers = req_noused.headers, cookies = req_noused.cookies;
                            frontReq = {};


                            try {
                                frontReq = {
                                    ___ip: req_noused.headers['x-forwarded-for'] || req_noused.connection.remoteAddress || req_noused.socket.remoteAddress || req_noused.connection.socket.remoteAddress,
                                    headers: headers,
                                    cookies: cookies
                                };
                                apiInvokeParams = JSON.stringify(_apiInvokeParams);
                            } catch (err) {
                                apiInvokeParams = 'call params stringify error';
                            }
                            if (apiInvokeParams.length > 505) {
                                apiInvokeParams = apiInvokeParams.substr(0, 500) + '[...]';
                            }
                            _context3.next = 21;
                            return ruleValidator({
                                jwtoken: jwtoken,
                                categoryName: categoryName,
                                categoryDesc: categoryDesc,
                                ruleName: '' + ruleName,
                                ruleDesc: ruleDesc,
                                codePath: target.name + '.' + name,
                                apiInvokeParams: apiInvokeParams,
                                frontReq: frontReq
                            });

                        case 21:
                            _ref9 = _context3.sent;
                            err = _ref9.err;
                            result = _ref9.result;
                            canAccess = result.canAccess, resean = result.resean;

                            if (canAccess) {
                                _context3.next = 27;
                                break;
                            }

                            throw _GKErrors_Inner.GKErrors._NOT_ACCESS_PERMISSION({
                                resean: '\u8BBF\u95EE\u88AB\u62D2\u7EDD\uFF08\u529F\u80FD\uFF1A[' + categoryName + '/' + ruleName + ']\uFF0C\u4EE3\u7801:[' + target.name + '.' + name + ']\uFF0C\u539F\u56E0\uFF1A' + (resean || '-') + '\uFF09'
                            });

                        case 27:
                            _context3.next = 29;
                            return oldValue.apply(undefined, _args3);

                        case 29:
                            return _context3.abrupt('return', _context3.sent);

                        case 30:
                        case 'end':
                            return _context3.stop();
                    }
                }
            }, _callee3, this, [[3, 9]]);
        }));
        return descriptor;
    };
};

/**
 * 从jstoken值解析后台管理用户的账号
 *
 * @param jstoken
 * @returns {Promise.<*>}
 */
exports.accessRule = accessRule;
var parseAdminAccountFromJWToken = exports.parseAdminAccountFromJWToken = function () {
    var _ref10 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(_ref11) {
        var jwtoken = _ref11.jwtoken;
        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.next = 2;
                        return _adminRuleValidator2.default.parseAdminAccountFromJWToken({ jwtoken: jwtoken });

                    case 2:
                        return _context4.abrupt('return', _context4.sent);

                    case 3:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function parseAdminAccountFromJWToken(_x3) {
        return _ref10.apply(this, arguments);
    };
}();
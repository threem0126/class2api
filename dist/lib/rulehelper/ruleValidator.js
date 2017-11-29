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

var _dec, _desc, _value, _class;

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
var _class2api_config = class2api_config,
    sysName = _class2api_config.sysName,
    rule_center = _class2api_config.rule_center;
var RuleValidator = (_dec = (0, _Decorators.cacheAble)({
    cacheKeyGene: function cacheKeyGene(args) {
        var _args$ = args[0],
            jwtoken = _args$.jwtoken,
            ruleCategory = _args$.ruleCategory,
            ruleName = _args$.ruleName;
        //以jwtoken、功能组名称、权限名称来组合索引，混存上一次的判断结果

        return jwtoken ? '_ruleValidator_inner-' + (0, _util.hashcode)(jwtoken) + '-' + (0, _util.hashcode)(ruleCategory) + '-' + (0, _util.hashcode)(ruleName) : '';
    }
}), (_class = function () {
    function RuleValidator() {
        _classCallCheck(this, RuleValidator);

        throw '静态业务功能类无法实例化';
    }

    _createClass(RuleValidator, null, [{
        key: '_ruleValidator_inner',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
                var sysName = _ref2.sysName,
                    jwtoken = _ref2.jwtoken,
                    ruleCategory = _ref2.ruleCategory,
                    ruleName = _ref2.ruleName,
                    ruleDescript = _ref2.ruleDescript,
                    codePath = _ref2.codePath;
                var res, jsonResult;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return (0, _isomorphicFetch2.default)(rule_center.validator, {
                                    method: 'post',
                                    rejectUnauthorized: false,
                                    headers: {
                                        'Accept': 'application/json, text/plain, */*',
                                        'Content-Type': 'application/json',
                                        jwtoken: jwtoken
                                    },
                                    withCredentials: 'true',
                                    json: true,
                                    body: (0, _stringify2.default)({ sysName: sysName, ruleCategory: ruleCategory, ruleName: ruleName, ruleDescript: ruleDescript, codePath: codePath })
                                });

                            case 3:
                                res = _context.sent;
                                _context.next = 6;
                                return res.json();

                            case 6:
                                jsonResult = _context.sent;
                                return _context.abrupt('return', jsonResult);

                            case 10:
                                _context.prev = 10;
                                _context.t0 = _context['catch'](0);

                                //权限认证出错
                                console.error(_context.t0);
                                throw _GKErrors_Inner.GKErrors._RULE_VALIDATE_ERROR(_context.t0);

                            case 14:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 10]]);
            }));

            function _ruleValidator_inner(_x) {
                return _ref.apply(this, arguments);
            }

            return _ruleValidator_inner;
        }()
    }]);

    return RuleValidator;
}(), (_applyDecoratedDescriptor(_class, '_ruleValidator_inner', [_dec], (0, _getOwnPropertyDescriptor2.default)(_class, '_ruleValidator_inner'), _class)), _class));
exports.default = RuleValidator;
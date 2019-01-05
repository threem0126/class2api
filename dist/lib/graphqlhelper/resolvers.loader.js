'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapClass2Resolvers = exports.isSubscription = exports.isQuery = exports.isMutation = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var rootType = {
    Mutation: {},
    Query: {}
};

var __beforeCall = void 0,
    __afterCall = void 0;

var isMutation = exports.isMutation = function isMutation(target, name, descriptor) {
    //babel7适应性改造
    name = name || target.key;
    descriptor = descriptor || target.descriptor;
    //
    if (rootType.Mutation[name]) throw target.name + '\u7C7B\u4E2D\u7684' + name + '\u65B9\u6CD5\u540D\u79F0\u5DF2\u88AB\u5176\u4ED6\u7C7B\u65B9\u6CD5\u62A2\u6CE8\uFF0C\u5BFC\u81F4\u547D\u540D\u51B2\u7A81\uFF0C\u8BF7\u4FEE\u6539';
    //
    if (!descriptor) throw 'isMutation\u4E0D\u652F\u6301\u4FEE\u9970\u7C7B(' + target + ' ' + name + ')\uFF0C\u6216\u9519\u8BEF\u7528\u6CD5\uFF1A\'@isMutation()\'';
    var oldValue = descriptor.value;
    descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var _ref2,
            _ref3,
            _,
            params,
            ctx,
            ___,
            _ref4,
            request,
            modelSetting,
            result,
            _args = arguments;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('===========>===========> API invoke ' + name);
                        _ref2 = _args || {}, _ref3 = _slicedToArray(_ref2, 4), _ = _ref3[0], params = _ref3[1], ctx = _ref3[2], ___ = _ref3[3];
                        _ref4 = ctx || {}, request = _ref4.request;

                        if (!(__beforeCall && typeof __beforeCall === 'function')) {
                            _context.next = 8;
                            break;
                        }

                        //如果有要对传入参数做验证，则在fn_beforeCall中处理
                        modelSetting = target.__modelSetting ? target.__modelSetting() : {};
                        //返回最新的ctx

                        _context.next = 7;
                        return __beforeCall({ apiname: name, request: request, params: params, ctx: ctx, modelSetting: modelSetting });

                    case 7:
                        ctx = _context.sent;

                    case 8:
                        _context.next = 10;
                        return oldValue.apply(undefined, Array.prototype.slice.call(_args).concat([ctx]));

                    case 10:
                        result = _context.sent;

                        if (!(__afterCall && typeof __afterCall === 'function')) {
                            _context.next = 15;
                            break;
                        }

                        _context.next = 14;
                        return __afterCall({ apiname: name, request: request, result: result });

                    case 14:
                        result = _context.sent;

                    case 15:
                        return _context.abrupt('return', result);

                    case 16:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
    //
    rootType.Mutation[name] = descriptor.value;
    return descriptor;
};

var isQuery = exports.isQuery = function isQuery(target, name, descriptor) {
    //babel7适应性改造
    name = name || target.key;
    descriptor = descriptor || target.descriptor;
    if (rootType.Query[name]) throw target.name + '\u7C7B\u4E2D\u7684' + name + '\u65B9\u6CD5\u540D\u79F0\u5DF2\u88AB\u5176\u4ED6\u7C7B\u65B9\u6CD5\u62A2\u6CE8\uFF0C\u5BFC\u81F4\u547D\u540D\u51B2\u7A81\uFF0C\u8BF7\u4FEE\u6539';
    //
    if (!descriptor) throw 'isQuery不支持修饰类';
    var oldValue = descriptor.value;
    descriptor.value = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var _ref6,
            _ref7,
            _,
            params,
            ctx,
            ___,
            _ref8,
            request,
            modelSetting,
            result,
            _args2 = arguments;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        console.log('===========>===========> API invoke ' + name);
                        _ref6 = _args2 || {}, _ref7 = _slicedToArray(_ref6, 4), _ = _ref7[0], params = _ref7[1], ctx = _ref7[2], ___ = _ref7[3];
                        _ref8 = ctx || {}, request = _ref8.request;

                        if (!(__beforeCall && typeof __beforeCall === 'function')) {
                            _context2.next = 8;
                            break;
                        }

                        //如果有要对传入参数做验证，则在fn_beforeCall中处理
                        modelSetting = target.__modelSetting ? target.__modelSetting() : {};
                        //返回最新的ctx

                        _context2.next = 7;
                        return __beforeCall({ apiname: name, request: request, params: params, ctx: ctx, modelSetting: modelSetting });

                    case 7:
                        ctx = _context2.sent;

                    case 8:
                        _context2.next = 10;
                        return oldValue.apply(undefined, Array.prototype.slice.call(_args2).concat([ctx]));

                    case 10:
                        result = _context2.sent;

                        if (!(__afterCall && typeof __afterCall === 'function')) {
                            _context2.next = 15;
                            break;
                        }

                        _context2.next = 14;
                        return __afterCall({ apiname: name, request: request, result: result });

                    case 14:
                        result = _context2.sent;

                    case 15:
                        return _context2.abrupt('return', result);

                    case 16:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
    //
    rootType.Query[name] = descriptor.value;
    return descriptor;
};

var isSubscription = exports.isSubscription = function isSubscription(target, name, descriptor) {
    throw new Error('isSubscription的修饰器尚未实现');
};

var mapClass2Resolvers = function mapClass2Resolvers(_ref9) {
    var ClassList = _ref9.ClassList,
        beforeCall = _ref9.beforeCall,
        afterCall = _ref9.afterCall,
        _ref9$otherRootType = _ref9.otherRootType,
        otherRootType = _ref9$otherRootType === undefined ? {} : _ref9$otherRootType;

    //检查是否所有的静态业务API方法，都标记了GraphQL操作类型
    var methods = (0, _lodash.keys)(_extends({}, rootType.Mutation, rootType.Query));
    var noDecorators = 0;
    ClassList.forEach(function (classA) {
        Object.getOwnPropertyNames(classA).forEach(function (prop) {
            //排除类的基本属性
            if ((0, _lodash.indexOf)(['name', 'length', 'prototype', '__modelSetting'], prop) === -1) {
                if ((0, _lodash.indexOf)(methods, prop) === -1) {
                    console.error(' !.....\u53D1\u73B0\u672A\u4FEE\u9970\u64CD\u4F5C\u7C7B\u578B\u6807\u8BB0\u7684\u4E1A\u52A1\u65B9\u6CD5\uFF1A  ' + (classA.name + "." + prop));
                    noDecorators++;
                }
            }
        });
    });
    if (noDecorators > 0) throw new Error('在API业务类中 发现有未标记GraphQL操作类型的业务方法，请检查！ 如属于内部业务方法而无需暴露到接口的，请转移到private文件夹内！或定义到业务业务类外部！');

    if (__beforeCall) throw new Error('__beforeCall已被初始化，每个进程全局只能构建一次mapClass2Resolvers映射');
    __beforeCall = beforeCall;

    if (__afterCall) throw new Error('__afterCall已被初始化，每个进程全局只能构建一次mapClass2Resolvers映射');
    __afterCall = afterCall;

    //从otherRootType中萃取出可能已存在的Query和Mutation，被覆盖

    var _otherRootType$Query = otherRootType.Query,
        Query = _otherRootType$Query === undefined ? {} : _otherRootType$Query,
        _otherRootType$Mutati = otherRootType.Mutation,
        Mutation = _otherRootType$Mutati === undefined ? {} : _otherRootType$Mutati,
        otherRoot = _objectWithoutProperties(otherRootType, ['Query', 'Mutation']);

    return _extends({}, otherRoot, {
        Query: _extends({}, Query, rootType.Query),
        Mutation: _extends({}, Mutation, rootType.Mutation)
    });
};
exports.mapClass2Resolvers = mapClass2Resolvers;
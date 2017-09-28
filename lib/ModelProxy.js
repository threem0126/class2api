'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CreateListenRouter = exports.EndPointMap_forServerRender = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _lodash = require('lodash');

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

//import RateLimit from 'express-rate-limit'

var router = new _express.Router();
var _config_endpoint = {};
var isDeveloping = process.env.NODE_ENV === 'development';

var router_listen_created = false;

// let apiLimiter = new RateLimit({
//     windowMs: 15*60*1000, // 15 minutes
//     max: 1000,
//     statusCode:200,
//     delayMs: 0, // disabled,
//     handler:function (req, res, next) {
//         res.json({err: '请求过于频繁，请稍后重试', result:''})
//     }
// });
// {req,res,result}
var _bindRouter = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(BusinessModel, fn_beforeCall, fn_afterCall, frontpage_default) {
        var resWrap, result, _BusinessModel, _frontpage_default, router;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        if (!fn_beforeCall) {
                            _context4.next = 3;
                            break;
                        }

                        if (!(typeof fn_beforeCall !== 'function')) {
                            _context4.next = 3;
                            break;
                        }

                        throw 'fn_beforeCall必须是function类型的参数';

                    case 3:
                        if (!fn_afterCall) {
                            _context4.next = 6;
                            break;
                        }

                        if (!(typeof fn_afterCall !== 'function')) {
                            _context4.next = 6;
                            break;
                        }

                        throw '可选参数fn_afterCall必须是function类型的参数';

                    case 6:
                        resWrap = function () {
                            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref3) {
                                var req = _ref3.req,
                                    res = _ref3.res,
                                    result = _ref3.result;
                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                if (!fn_afterCall) {
                                                    _context.next = 6;
                                                    break;
                                                }

                                                _context.next = 3;
                                                return fn_afterCall({ req: req, res: res, result: result });

                                            case 3:
                                                _context.t0 = _context.sent;
                                                _context.next = 7;
                                                break;

                                            case 6:
                                                _context.t0 = result;

                                            case 7:
                                                return _context.abrupt('return', _context.t0);

                                            case 8:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, undefined);
                            }));

                            return function resWrap(_x5) {
                                return _ref2.apply(this, arguments);
                            };
                        }();

                        result = void 0;
                        _BusinessModel = BusinessModel;
                        _frontpage_default = frontpage_default;
                        router = _express2.default.Router();

                        router.get('*', function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                res.json({ err: 'get请求方式未实现, 仅限Post方式', result: null });

                                            case 1:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, this);
                            }));

                            return function (_x6, _x7, _x8) {
                                return _ref4.apply(this, arguments);
                            };
                        }());
                        router.all('*', function () {
                            var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, next) {
                                var pathItems, methodName, _req$body$queryObj, queryObj, params, paramsMerged, modelSetting, apipath, retData;

                                return _regenerator2.default.wrap(function _callee3$(_context3) {
                                    while (1) {
                                        switch (_context3.prev = _context3.next) {
                                            case 0:
                                                _context3.prev = 0;
                                                pathItems = req.path.split("/");
                                                methodName = pathItems[1] ? pathItems[1] : null;

                                                if (_BusinessModel[methodName]) {
                                                    _context3.next = 5;
                                                    break;
                                                }

                                                throw 'api\u8BF7\u6C42\u7684\u5730\u5740(' + req.originalUrl + ')\u4E2D\u5BF9\u5E94\u7684\u7C7B\u4E0D\u5B58\u5728' + methodName + '\u65B9\u6CD5,\u8BF7\u786E\u8BA4\u6620\u5C04\u7684\u7C7B\u662F\u5426\u6B63\u786E!';

                                            case 5:
                                                if (req.body) {
                                                    _context3.next = 7;
                                                    break;
                                                }

                                                throw 'api\u8BF7\u6C42\u4E2D\u7684body\u4E3A\u7A7A\uFF0C\u6CA1\u6709\u63D0\u4EA4\u5185\u5BB9\u4F20\u5165!';

                                            case 7:
                                                _req$body$queryObj = req.body.queryObj, queryObj = _req$body$queryObj === undefined ? req.body : _req$body$queryObj;
                                                params = queryObj;
                                                paramsMerged = null;


                                                params.___frontpageURL = _url2.default.parse(req.headers['frontpage'] || _frontpage_default || '');

                                                if (!(fn_beforeCall && typeof fn_beforeCall === 'function')) {
                                                    _context3.next = 17;
                                                    break;
                                                }

                                                //如果有要对传入参数做验证，则在fn_beforeCall中处理
                                                modelSetting = _BusinessModel.__modelSetting ? _BusinessModel.__modelSetting() : {};
                                                apipath = _BusinessModel.name + '.' + req.path;
                                                _context3.next = 16;
                                                return fn_beforeCall({ apipath: apipath, req: req, params: params, modelSetting: modelSetting });

                                            case 16:
                                                paramsMerged = _context3.sent;

                                            case 17:
                                                _context3.next = 19;
                                                return _BusinessModel[methodName](_extends({}, paramsMerged || params, {
                                                    req: req
                                                }));

                                            case 19:
                                                result = _context3.sent;

                                                if (!(typeof result === "function")) {
                                                    _context3.next = 27;
                                                    break;
                                                }

                                                _context3.t0 = res;
                                                _context3.next = 24;
                                                return resWrap({ req: req, res: res, result: result() });

                                            case 24:
                                                _context3.t1 = _context3.sent;

                                                _context3.t0.json.call(_context3.t0, _context3.t1);

                                                return _context3.abrupt('return');

                                            case 27:
                                                if (!((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === "object" && (0, _lodash.keys)(result).length === 0)) {
                                                    _context3.next = 29;
                                                    break;
                                                }

                                                throw '\u975E\u7B80\u5355\u6570\u636E\u7C7B\u578B\u7684\u63A5\u53E3\u8FD4\u56DE\u503C\u5FC5\u987B\u5305\u542Bkey\uFF0Fvalue\u7ED3\u6784\uFF0C\u63A5\u53E3' + req.originalUrl + '\u7C7B\u7684' + methodName + '\u65B9\u6CD5\u8FD4\u56DE\u7684\u6570\u636E\u7ED3\u6784\u4E0D\u5177\u6709key/value\u7ED3\u6784\uFF0C\u4E0D\u7B26\u5408\u89C4\u8303!';

                                            case 29:
                                                retData = { err: null, result: result };

                                                if (process.env.NODE_ENV !== "production") {
                                                    console.log('api call result from(' + req.originalUrl + '):' + JSON.stringifyline(retData));
                                                }
                                                _context3.t2 = res;
                                                _context3.next = 34;
                                                return resWrap({ req: req, res: res, result: retData });

                                            case 34:
                                                _context3.t3 = _context3.sent;

                                                _context3.t2.json.call(_context3.t2, _context3.t3);

                                                _context3.next = 46;
                                                break;

                                            case 38:
                                                _context3.prev = 38;
                                                _context3.t4 = _context3['catch'](0);

                                                if (process.env.NODE_ENV !== "production") {
                                                    //region 让错误直接抛出，并终止程序。不需要时可以整体注释掉
                                                    console.dir('\u8FD9\u91CC\uFF1A\u9664\u4E86\u7A0B\u5E8F\u903B\u8F91\u7EA7\u522B\u7684Exception\u9519\u8BEF\uFF0C\u5728\u975E\u6B63\u5F0F\u73AF\u5883\u4F1A\u7EC8\u6B62\u7A0B\u5E8F\uFF0C\u4FBF\u4E8E\u8C03\u8BD5\u6392\u67E5\u3002\u4E0D\u9700\u8981\u65F6\u53EF\u4EE5\u627E\u5230\u6211\u7684\u4F4D\u7F6E\u5E76\u6CE8\u91CA\u6389');
                                                    if (!_context3.t4._gankao) {
                                                        //通过timeout排除错误，会导致程序终止
                                                        setTimeout(function () {
                                                            throw _context3.t4;
                                                        });
                                                    } else {
                                                        //程序逻辑级别的Exception，输出到控制台即可
                                                    }
                                                    console.error(_context3.t4);
                                                    //endregion
                                                } else {
                                                    console.error(_context3.t4);
                                                }
                                                _context3.t5 = res;
                                                _context3.next = 44;
                                                return resWrap({ req: req, res: res, result: { err: _context3.t4, result: null } });

                                            case 44:
                                                _context3.t6 = _context3.sent;

                                                _context3.t5.json.call(_context3.t5, _context3.t6);

                                            case 46:
                                            case 'end':
                                                return _context3.stop();
                                        }
                                    }
                                }, _callee3, this, [[0, 38]]);
                            }));

                            return function (_x9, _x10, _x11) {
                                return _ref5.apply(this, arguments);
                            };
                        }());
                        return _context4.abrupt('return', router);

                    case 14:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function _bindRouter(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * 原EndPointMap类的默认方法，移植过来了。在服务器端渲染React组件路由时调用
 * @param api_endpint
 * @param methodName
 * @param params
 * @returns {Promise.<*>}
 * @constructor
 */
var EndPointMap_forServerRender = exports.EndPointMap_forServerRender = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(api_endpint, methodName, params) {
        var result, error;
        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        _context5.prev = 0;

                        if (!(_config_endpoint[api_endpint] && _config_endpoint[api_endpint][methodName] && typeof _config_endpoint[api_endpint][methodName] === "function")) {
                            _context5.next = 8;
                            break;
                        }

                        _context5.next = 4;
                        return _config_endpoint[api_endpint][methodName](params);

                    case 4:
                        result = _context5.sent;
                        return _context5.abrupt('return', result);

                    case 8:
                        error = '\u6307\u5B9A\u7684\u65B9\u6CD5' + methodName + '\u6216\u5165\u53E3\u6A21\u5757' + api_endpint + '\u672A\u5B9A\u4E49';
                        throw error;

                    case 10:
                        _context5.next = 15;
                        break;

                    case 12:
                        _context5.prev = 12;
                        _context5.t0 = _context5['catch'](0);

                        if (isDeveloping) {
                            setTimeout(function () {
                                throw _context5.t0;
                            });
                        }

                    case 15:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[0, 12]]);
    }));

    return function EndPointMap_forServerRender(_x12, _x13, _x14) {
        return _ref6.apply(this, arguments);
    };
}();

var CreateListenRouter = exports.CreateListenRouter = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7(options) {
        var apiroot, modelClasses, beforeCall, afterCall, method404, frontpage_default, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, classObj, model, as, aPath;

        return _regenerator2.default.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        if (!router_listen_created) {
                            _context7.next = 2;
                            break;
                        }

                        return _context7.abrupt('return', router);

                    case 2:
                        apiroot = options.apiroot, modelClasses = options.modelClasses, beforeCall = options.beforeCall, afterCall = options.afterCall, method404 = options.method404, frontpage_default = options.frontpage_default;

                        //router.use(apiLimiter);

                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context7.prev = 6;
                        _iterator = modelClasses[Symbol.iterator]();

                    case 8:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context7.next = 36;
                            break;
                        }

                        classObj = _step.value;

                        if (!(typeof classObj === "function")) {
                            _context7.next = 20;
                            break;
                        }

                        _context7.t0 = router;
                        _context7.t1 = '/' + classObj.name.toLowerCase();
                        _context7.next = 15;
                        return _bindRouter(classObj, beforeCall, afterCall);

                    case 15:
                        _context7.t2 = _context7.sent;

                        _context7.t0.use.call(_context7.t0, _context7.t1, _context7.t2);

                        console.log('\u5C06' + classObj.name + '\u7C7B\u6620\u5C04\u5230 ' + apiroot + classObj.name.toLowerCase() + ' ... OK!');
                        _context7.next = 33;
                        break;

                    case 20:
                        model = classObj.model, as = classObj.as;

                        if (!(model && as)) {
                            _context7.next = 32;
                            break;
                        }

                        aPath = (as || model.name).toLowerCase();
                        _context7.t3 = router;
                        _context7.t4 = '/' + aPath;
                        _context7.next = 27;
                        return _bindRouter(model, beforeCall, afterCall, frontpage_default);

                    case 27:
                        _context7.t5 = _context7.sent;

                        _context7.t3.use.call(_context7.t3, _context7.t4, _context7.t5);

                        console.log('\u5C06' + model.name + '\u7C7B\u6620\u5C04\u5230 ' + apiroot + aPath + ' ... OK!');
                        _context7.next = 33;
                        break;

                    case 32:
                        throw 'modelClasses\u53C2\u6570\u4E2D' + classObj + '\u7684\u5BF9\u8C61\u4E0D\u662F\u6709\u6548\u7684Class\u7C7B\u6216{model,as}\u7ED3\u6784\u5B9A\u4E49';

                    case 33:
                        _iteratorNormalCompletion = true;
                        _context7.next = 8;
                        break;

                    case 36:
                        _context7.next = 42;
                        break;

                    case 38:
                        _context7.prev = 38;
                        _context7.t6 = _context7['catch'](6);
                        _didIteratorError = true;
                        _iteratorError = _context7.t6;

                    case 42:
                        _context7.prev = 42;
                        _context7.prev = 43;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 45:
                        _context7.prev = 45;

                        if (!_didIteratorError) {
                            _context7.next = 48;
                            break;
                        }

                        throw _iteratorError;

                    case 48:
                        return _context7.finish(45);

                    case 49:
                        return _context7.finish(42);

                    case 50:

                        //拦截未匹配到的其他方法
                        router.all('*', function () {
                            var _ref8 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6(req, res, next) {
                                return _regenerator2.default.wrap(function _callee6$(_context6) {
                                    while (1) {
                                        switch (_context6.prev = _context6.next) {
                                            case 0:
                                                _context6.prev = 0;

                                                if (!(typeof method404 === 'function')) {
                                                    _context6.next = 6;
                                                    break;
                                                }

                                                _context6.next = 4;
                                                return method404(req, res);

                                            case 4:
                                                _context6.next = 7;
                                                break;

                                            case 6:
                                                next();

                                            case 7:
                                                _context6.next = 13;
                                                break;

                                            case 9:
                                                _context6.prev = 9;
                                                _context6.t0 = _context6['catch'](0);

                                                res.status = 404;
                                                res.json({ err: '404\u5904\u7406\u9519\u8BEF(' + JSON.stringify(_context6.t0) + ')', result: null });

                                            case 13:
                                            case 'end':
                                                return _context6.stop();
                                        }
                                    }
                                }, _callee6, undefined, [[0, 9]]);
                            }));

                            return function (_x16, _x17, _x18) {
                                return _ref8.apply(this, arguments);
                            };
                        }());
                        router_listen_created = true;

                        return _context7.abrupt('return', router);

                    case 53:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined, [[6, 38, 42, 50], [43,, 45, 49]]);
    }));

    return function CreateListenRouter(_x15) {
        return _ref7.apply(this, arguments);
    };
}();
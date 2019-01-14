'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CreateListenRouter = undefined;

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
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(BusinessModel, fn_beforeCall, fn_afterCall, frontpage_default) {
        var resWrap, result, _BusinessModel, _frontpage_default, router;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        if (!fn_beforeCall) {
                            _context3.next = 3;
                            break;
                        }

                        if (!(typeof fn_beforeCall !== 'function')) {
                            _context3.next = 3;
                            break;
                        }

                        throw 'fn_beforeCall必须是function类型的参数';

                    case 3:
                        if (!fn_afterCall) {
                            _context3.next = 6;
                            break;
                        }

                        if (!(typeof fn_afterCall !== 'function')) {
                            _context3.next = 6;
                            break;
                        }

                        throw '可选参数fn_afterCall必须是function类型的参数';

                    case 6:
                        resWrap = function () {
                            var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref3) {
                                var req = _ref3.req,
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
                                                return fn_afterCall({ req: req, result: result });

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
                        //开放get请求方式（注意：此时无法head传值）
                        // router.get('*', async function (req, res, next) {
                        //     res.json({err: 'get请求方式未实现, 仅限Post方式', result: null});
                        // });

                        router.all('*', function () {
                            var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
                                var pathItems, methodName, source, _source$queryObj, queryObj, params, paramsMerged, modelSetting, apipath, _result, __redirected, msg, retData;

                                return _regenerator2.default.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                _context2.prev = 0;
                                                pathItems = req.path.split("/");
                                                methodName = pathItems[1] ? pathItems[1] : null;

                                                if (_BusinessModel[methodName]) {
                                                    _context2.next = 5;
                                                    break;
                                                }

                                                throw 'api\u8BF7\u6C42\u7684\u5730\u5740(' + req.originalUrl + ')\u4E2D\u5BF9\u5E94\u7684\u7C7B\u4E0D\u5B58\u5728' + methodName + '\u65B9\u6CD5,\u8BF7\u786E\u8BA4\u6620\u5C04\u7684\u7C7B\u662F\u5426\u6B63\u786E!';

                                            case 5:
                                                if (!(!req.body && !res.query)) {
                                                    _context2.next = 7;
                                                    break;
                                                }

                                                throw 'api\u8BF7\u6C42\u4E2D\u7684body\u548Cquery\u90FD\u4E3A\u7A7A\uFF0C\u6CA1\u6709\u63D0\u4EA4\u5185\u5BB9\u4F20\u5165!';

                                            case 7:
                                                //queryObj是对早期传值方式的兼容（早期会将所有参数包裹在queryObj属性里）
                                                source = req.method === 'POST' ? req.body : req.query;
                                                _source$queryObj = source.queryObj, queryObj = _source$queryObj === undefined ? source : _source$queryObj;
                                                params = queryObj;
                                                paramsMerged = null;


                                                params.___frontpageURL = _url2.default.parse(req.headers['frontpage'] || _frontpage_default || '');

                                                if (!(fn_beforeCall && typeof fn_beforeCall === 'function')) {
                                                    _context2.next = 18;
                                                    break;
                                                }

                                                //如果有要对传入参数做验证，则在fn_beforeCall中处理
                                                modelSetting = _BusinessModel.__modelSetting ? _BusinessModel.__modelSetting() : {};
                                                apipath = _BusinessModel.name + '.' + req.path;
                                                _context2.next = 17;
                                                return fn_beforeCall({ apipath: apipath, req: req, res: res, params: params, modelSetting: modelSetting });

                                            case 17:
                                                paramsMerged = _context2.sent;

                                            case 18:
                                                if (!(req.method === 'GET')) {
                                                    _context2.next = 24;
                                                    break;
                                                }

                                                _context2.next = 21;
                                                return _BusinessModel[methodName](_extends({}, paramsMerged || params, { req: req, res: res }));

                                            case 21:
                                                result = _context2.sent;
                                                _context2.next = 27;
                                                break;

                                            case 24:
                                                _context2.next = 26;
                                                return _BusinessModel[methodName](_extends({}, paramsMerged || params, { req: req }));

                                            case 26:
                                                result = _context2.sent;

                                            case 27:
                                                if (!(typeof result === "function")) {
                                                    _context2.next = 34;
                                                    break;
                                                }

                                                _context2.t0 = res;
                                                _context2.next = 31;
                                                return resWrap({ req: req, res: res, result: result() });

                                            case 31:
                                                _context2.t1 = _context2.sent;

                                                _context2.t0.json.call(_context2.t0, _context2.t1);

                                                return _context2.abrupt('return');

                                            case 34:
                                                if (!((typeof result === 'undefined' ? 'undefined' : _typeof(result)) !== "object" || (0, _lodash.keys)(result).length === 0)) {
                                                    _context2.next = 36;
                                                    break;
                                                }

                                                throw '\u63A5\u53E3\u8FD4\u56DE\u503C\u5FC5\u987B\u5305\u542Bkey\uFF0Fvalue\u7ED3\u6784\uFF08\u56E0\u6B64\u4E5F\u4E0D\u80FD\u4E3Anull\u503C\uFF09\uFF0C\u63A5\u53E3' + req.originalUrl + '\u7C7B\u7684' + methodName + '\u65B9\u6CD5\u8FD4\u56DE\u7684\u6570\u636E\u7ED3\u6784\u4E0D\u5177\u6709key/value\u7ED3\u6784\uFF0C\u8BF7\u9002\u914D\u8C03\u6574\u4EE5\u7B26\u5408\u89C4\u8303!';

                                            case 36:
                                                _result = result, __redirected = _result.__redirected;

                                                if (!__redirected) {
                                                    _context2.next = 39;
                                                    break;
                                                }

                                                return _context2.abrupt('return');

                                            case 39:
                                                if (result) {
                                                    _context2.next = 44;
                                                    break;
                                                }

                                                msg = '\u63A5\u53E3\u8FD4\u56DE\u503C\u5FC5\u987B\u5305\u542Bkey\uFF0Fvalue\u7ED3\u6784\uFF08\u56E0\u6B64\u4E5F\u4E0D\u80FD\u4E3Anull\u503C\uFF09\uFF0C\u63A5\u53E3' + req.originalUrl + '\u7C7B\u7684' + methodName + '\u65B9\u6CD5\u8FD4\u56DE\u7684\u6570\u636E\u7ED3\u6784\u4E0D\u5177\u6709key/value\u7ED3\u6784\uFF0C\u8BF7\u9002\u914D\u8C03\u6574\u4EE5\u7B26\u5408\u89C4\u8303!';

                                                console.error(msg);

                                                if (!(process.env.NODE_ENV !== "production")) {
                                                    _context2.next = 44;
                                                    break;
                                                }

                                                throw msg;

                                            case 44:
                                                retData = { err: null, result: result };
                                                _context2.t2 = res;
                                                _context2.next = 48;
                                                return resWrap({ req: req, res: res, result: retData });

                                            case 48:
                                                _context2.t3 = _context2.sent;

                                                _context2.t2.json.call(_context2.t2, _context2.t3);

                                                if (process.env.NODE_ENV !== "production" && process.env.PRINT_API_RESULT === "1") {
                                                    console.log('api call result from(' + req.originalUrl + '):' + JSON.stringifyline(retData));
                                                }
                                                _context2.next = 69;
                                                break;

                                            case 53:
                                                _context2.prev = 53;
                                                _context2.t4 = _context2['catch'](0);

                                                if (process.env.NODE_ENV !== "production") {
                                                    //region 让错误直接抛出，并终止程序。不需要时可以整体注释掉
                                                    console.dir('\u8FD9\u91CC\uFF1A\u9664\u4E86\u7A0B\u5E8F\u903B\u8F91\u7EA7\u522B\u7684Exception\u9519\u8BEF\uFF0C\u5728\u975E\u6B63\u5F0F\u73AF\u5883\u4F1A\u7EC8\u6B62\u7A0B\u5E8F\uFF0C\u4FBF\u4E8E\u8C03\u8BD5\u6392\u67E5\u3002\u4E0D\u9700\u8981\u65F6\u53EF\u4EE5\u627E\u5230\u6211\u7684\u4F4D\u7F6E\u5E76\u6CE8\u91CA\u6389');
                                                    if (!_context2.t4._gankao || process.env.StopOnAnyException == '1') {
                                                        //通过timeout排除错误，会导致程序终止
                                                        setTimeout(function () {
                                                            throw _context2.t4;
                                                        });
                                                    } else {
                                                        //程序逻辑级别的Exception，输出到控制台即可
                                                    }
                                                    console.error(_context2.t4);
                                                    if (process.env.NODE_ENV !== "production") {
                                                        console.error(_context2.t4.stack);
                                                    }
                                                    //endregion
                                                } else {
                                                    console.error(_context2.t4);
                                                }

                                                if (!(process.env.NODE_ENV !== "production")) {
                                                    _context2.next = 64;
                                                    break;
                                                }

                                                _context2.t5 = res;
                                                _context2.next = 60;
                                                return resWrap({
                                                    req: req,
                                                    res: res,
                                                    result: { err: { message: _context2.t4.message, stack: _context2.t4.stack }, result: null }
                                                });

                                            case 60:
                                                _context2.t6 = _context2.sent;

                                                _context2.t5.json.call(_context2.t5, _context2.t6);

                                                _context2.next = 69;
                                                break;

                                            case 64:
                                                _context2.t7 = res;
                                                _context2.next = 67;
                                                return resWrap({ req: req, res: res, result: { err: { message: _context2.t4.message }, result: null } });

                                            case 67:
                                                _context2.t8 = _context2.sent;

                                                _context2.t7.json.call(_context2.t7, _context2.t8);

                                            case 69:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, this, [[0, 53]]);
                            }));

                            return function (_x6, _x7, _x8) {
                                return _ref4.apply(this, arguments);
                            };
                        }());
                        return _context3.abrupt('return', router);

                    case 13:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function _bindRouter(_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
    };
}();

// /**
//  * 原EndPointMap类的默认方法，移植过来了。在服务器端渲染React组件路由时调用
//  * @param api_endpint
//  * @param methodName
//  * @param params
//  * @returns {Promise.<*>}
//  * @constructor
//  */
// export const EndPointMap_forServerRender = async (api_endpint, methodName,  params)=> {
//     try{
//         if (_config_endpoint[api_endpint] && _config_endpoint[api_endpint][methodName] && typeof _config_endpoint[api_endpint][methodName] === "function") {
//             let result = await _config_endpoint[api_endpint][methodName](params);
//             return result;
//         } else {
//             const error = `指定的方法${methodName}或入口模块${api_endpint}未定义`;
//             throw error;
//         }
//     }catch(err){
//         if (isDeveloping) {
//             setTimeout(()=> {
//                 throw err
//             });
//         }
//     }
// }

var CreateListenRouter = exports.CreateListenRouter = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(options) {
        var apiroot, modelClasses, beforeCall, afterCall, method404, frontpage_default, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, classObj, model, as, aPath;

        return _regenerator2.default.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        if (!router_listen_created) {
                            _context5.next = 2;
                            break;
                        }

                        return _context5.abrupt('return', router);

                    case 2:
                        apiroot = options.apiroot, modelClasses = options.modelClasses, beforeCall = options.beforeCall, afterCall = options.afterCall, method404 = options.method404, frontpage_default = options.frontpage_default;

                        //router.use(apiLimiter);

                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context5.prev = 6;
                        _iterator = modelClasses[Symbol.iterator]();

                    case 8:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context5.next = 36;
                            break;
                        }

                        classObj = _step.value;

                        if (!(typeof classObj === "function")) {
                            _context5.next = 20;
                            break;
                        }

                        _context5.t0 = router;
                        _context5.t1 = '/' + classObj.name.toLowerCase();
                        _context5.next = 15;
                        return _bindRouter(classObj, beforeCall, afterCall);

                    case 15:
                        _context5.t2 = _context5.sent;

                        _context5.t0.use.call(_context5.t0, _context5.t1, _context5.t2);

                        console.log('mapped class \'' + classObj.name + '\' to \'' + apiroot + classObj.name.toLowerCase() + '/*\' ... OK!');
                        _context5.next = 33;
                        break;

                    case 20:
                        model = classObj.model, as = classObj.as;

                        if (!(model && as)) {
                            _context5.next = 32;
                            break;
                        }

                        aPath = (as || model.name).toLowerCase();
                        _context5.t3 = router;
                        _context5.t4 = '/' + aPath;
                        _context5.next = 27;
                        return _bindRouter(model, beforeCall, afterCall, frontpage_default);

                    case 27:
                        _context5.t5 = _context5.sent;

                        _context5.t3.use.call(_context5.t3, _context5.t4, _context5.t5);

                        console.log('mapped class \'' + model.name + '\' to \'' + apiroot + aPath + '/*\' ... OK!');
                        _context5.next = 33;
                        break;

                    case 32:
                        throw 'modelClasses\u53C2\u6570\u4E2D' + classObj + '\u7684\u5BF9\u8C61\u4E0D\u662F\u6709\u6548\u7684Class\u7C7B\u6216{model,as}\u7ED3\u6784\u5B9A\u4E49';

                    case 33:
                        _iteratorNormalCompletion = true;
                        _context5.next = 8;
                        break;

                    case 36:
                        _context5.next = 42;
                        break;

                    case 38:
                        _context5.prev = 38;
                        _context5.t6 = _context5['catch'](6);
                        _didIteratorError = true;
                        _iteratorError = _context5.t6;

                    case 42:
                        _context5.prev = 42;
                        _context5.prev = 43;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 45:
                        _context5.prev = 45;

                        if (!_didIteratorError) {
                            _context5.next = 48;
                            break;
                        }

                        throw _iteratorError;

                    case 48:
                        return _context5.finish(45);

                    case 49:
                        return _context5.finish(42);

                    case 50:

                        //拦截未匹配到的其他方法
                        router.all('*', function () {
                            var _ref6 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4(req, res, next) {
                                var retObj;
                                return _regenerator2.default.wrap(function _callee4$(_context4) {
                                    while (1) {
                                        switch (_context4.prev = _context4.next) {
                                            case 0:
                                                _context4.prev = 0;

                                                if (!(typeof method404 === 'function')) {
                                                    _context4.next = 6;
                                                    break;
                                                }

                                                _context4.next = 4;
                                                return method404(req, res);

                                            case 4:
                                                _context4.next = 7;
                                                break;

                                            case 6:
                                                if (process.env.NODE_ENV === "production") {
                                                    res.status = 404;
                                                    res.json({ err: 'API Not Defined!', result: null });
                                                } else {
                                                    retObj = { err: 'API\u65B9\u6CD5\u672A\u5B9A\u4E49(' + req.path + ', \u8BF7\u786E\u8BA4\u7C7B\u662F\u5426\u5B58\u5728\u6216\u7C7B\u7684\u540D\u79F0\u662F\u5426\u6709\u53D8\u66F4\uFF01)', result: null };

                                                    console.error(JSON.stringify(retObj));
                                                    res.json(retObj);
                                                }

                                            case 7:
                                                _context4.next = 13;
                                                break;

                                            case 9:
                                                _context4.prev = 9;
                                                _context4.t0 = _context4['catch'](0);

                                                res.status = 404;
                                                res.json({ err: '404\u5904\u7406\u9519\u8BEF(' + JSON.stringify(_context4.t0) + ')', result: null });

                                            case 13:
                                            case 'end':
                                                return _context4.stop();
                                        }
                                    }
                                }, _callee4, undefined, [[0, 9]]);
                            }));

                            return function (_x10, _x11, _x12) {
                                return _ref6.apply(this, arguments);
                            };
                        }());

                        router_listen_created = true;
                        return _context5.abrupt('return', router);

                    case 53:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined, [[6, 38, 42, 50], [43,, 45, 49]]);
    }));

    return function CreateListenRouter(_x9) {
        return _ref5.apply(this, arguments);
    };
}();
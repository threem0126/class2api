'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.save2Doc = exports.WebInvokeHepler = exports.ApiDesc = exports.setApiRoot = undefined;

var _isIterable2 = require('babel-runtime/core-js/is-iterable');

var _isIterable3 = _interopRequireDefault(_isIterable2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = (0, _getIterator3.default)(arr), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if ((0, _isIterable3.default)(Object(arr))) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = _assign2.default || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new _bluebird2.default(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return _bluebird2.default.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

_bluebird2.default.promisifyAll(_request2.default);

JSON.stringifyline = function (Obj) {
    return (0, _stringify2.default)(Obj, null, 2);
};

var remote_api = void 0;
var docapi = [];

var setApiRoot = exports.setApiRoot = function setApiRoot(apiRoot) {
    remote_api = apiRoot;
};
var ApiDesc = exports.ApiDesc = function ApiDesc(desc) {
    return desc;
};
var WebInvokeHepler = exports.WebInvokeHepler = function WebInvokeHepler(user, method) {
    if (!user) throw 'WebInvokeHepler\u65B9\u6CD5\u7F3A\u5C11\u53C2\u6570user';
    if (!method) method = 'post';
    var _user$token = user.token,
        token = _user$token === undefined ? '' : _user$token,
        _user$jwtoken = user.jwtoken,
        jwtoken = _user$jwtoken === undefined ? '' : _user$jwtoken,
        _user$otherheaders = user.otherheaders,
        otherheaders = _user$otherheaders === undefined ? {} : _user$otherheaders;

    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(apiPath, postParams, apiDesc) {
            var options, funPromise, _ref2, body;

            return _regenerator2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            options = {
                                uri: remote_api + apiPath,
                                rejectUnauthorized: false,
                                headers: _extends({}, otherheaders, {
                                    token: token, jwtoken: jwtoken // 这里提供身份验证的token，注意命名为：jwtoken
                                }),
                                body: postParams,
                                json: true
                            };
                            funPromise = method === 'post' ? _request2.default.postAsync(options) : _request2.default.getAsync(_extends({
                                uri: options.uri
                            }, postParams, options.headers));
                            _context.next = 4;
                            return funPromise;

                        case 4:
                            _ref2 = _context.sent;
                            body = _ref2.body;

                            if (apiDesc) {
                                docapi.push([apiDesc, options.uri, postParams, body]);
                            }
                            if (method === 'get') {
                                try {
                                    body = JSON.parse(body);
                                } catch (err) {
                                    console.error('error in class2api ...JSON.parse(body) :');
                                    console.error(err);
                                }
                            }
                            return _context.abrupt('return', body);

                        case 9:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2, _x3) {
            return _ref.apply(this, arguments);
        };
    }();
};

var save2Doc = exports.save2Doc = function save2Doc(_ref3) {
    var _ref3$save2File = _ref3.save2File,
        save2File = _ref3$save2File === undefined ? "api.MD" : _ref3$save2File;

    console.log('\u751F\u6210API\u63A5\u53E3\u8BF7\u6C42\u7684\u5FEB\u7167 ... ...');
    var str = [];
    docapi.forEach(function (item) {
        var lines = [];

        var _item = _slicedToArray(item, 4),
            apiDesc = _item[0],
            uri = _item[1],
            postParams = _item[2],
            body = _item[3];

        lines.push('# ' + apiDesc + ' #');
        lines.push('- \u63A5\u53E3\uFF1A' + uri);
        lines.push('- post\u53C2\u6570\uFF1A');
        lines.push('```json');
        lines.push(JSON.stringifyline(postParams));
        lines.push('```');
        lines.push('- \u8BF7\u6C42\u7ED3\u679C\uFF1A');
        lines.push('```json');
        lines.push(JSON.stringifyline(body));
        lines.push('```');
        str.push(lines.join("\r"));
    });
    _fs2.default.writeFileSync(save2File, str.join("\n\r"));
    console.log('API\u63A5\u53E3\u8BF7\u6C42\u7684\u5FEB\u7167 \u751F\u6210\u6210\u529F\uFF01');
};
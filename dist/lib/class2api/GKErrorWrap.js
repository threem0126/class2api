"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GKErrorWrap = undefined;

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _extends = _assign2.default || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!JSON.stringifyline) {
    JSON.stringifyline = function (Obj) {
        return (0, _stringify2.default)(Obj, null, 2);
    };
}

var errCodes = {};

/*
 错误信息生成器，高阶函数
 */
var GKErrorWrap = exports.GKErrorWrap = function GKErrorWrap(errCode, errMessage) {
    if (errCodes[errCode]) throw "\u9519\u8BEF\u7801\u88AB\u91CD\u590D\u5B9A\u4E49(" + errCode + "," + errCodes[errCode] + ")";
    errCodes[errCode] = errMessage;
    return function (more) {
        var moreStr = '';
        if (more) {
            moreStr = typeof more === "string" ? more : JSON.stringifyline(_extends({}, more));
        }
        return {
            _gankao: 1,
            code: errCode,
            message: errMessage + "\uFF08" + moreStr + "\uFF09",
            more: moreStr
        };
    };
};
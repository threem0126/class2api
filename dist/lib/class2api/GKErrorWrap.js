"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

if (!JSON.stringifyline) {
    JSON.stringifyline = function (Obj) {
        return JSON.stringify(Obj, null, 2);
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
        var ret = new Error();
        ret._gankao = 1;
        ret.code = errCode;
        ret.message = errMessage + "\uFF08" + moreStr + "\uFF09";
        ret.more = moreStr;
        return ret;
    };
};
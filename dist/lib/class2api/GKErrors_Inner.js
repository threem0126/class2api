'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GKErrors = undefined;

var _GKErrorWrap = require('./GKErrorWrap');

/**
 * 内置的错误类型，统一为负数，且以'_'开头
 * @type {{_TOKEN_LOGIN_INVALID, _NOT_ACCESS_PERMISSION, _NOT_SERVICE, _PARAMS_VALUE_EXPECT, _NO_RESULT, _SERVER_ERROR, _NOT_PARAMS}}
 */
var GKErrors = exports.GKErrors = {
    _TOKEN_PARSE_FAIL: (0, _GKErrorWrap.GKErrorWrap)(-9, 'token\u89E3\u6790\u5931\u8D25'),
    _RULE_VALIDATE_ERROR: (0, _GKErrorWrap.GKErrorWrap)(-8, '\u6743\u9650\u8BA4\u8BC1\u8FC7\u7A0B\u4E2D\u53D1\u751F\u5F02\u5E38'),
    _TOKEN_LOGIN_INVALID: (0, _GKErrorWrap.GKErrorWrap)(-7, '\u8BF7\u5148\u767B\u5F55'),
    _NOT_ACCESS_PERMISSION: (0, _GKErrorWrap.GKErrorWrap)(-6, '\u65E0\u8BBF\u95EE\u6743\u9650'),
    _NOT_SERVICE: (0, _GKErrorWrap.GKErrorWrap)(-5, '\u529F\u80FD\u5373\u5C06\u5B9E\u73B0'),
    _PARAMS_VALUE_EXPECT: (0, _GKErrorWrap.GKErrorWrap)(-4, '\u53C2\u6570\u4E0D\u7B26\u5408\u9884\u671F'),
    _NO_RESULT: (0, _GKErrorWrap.GKErrorWrap)(-3, '\u65E0\u5339\u914D\u7ED3\u679C'),
    _SERVER_ERROR: (0, _GKErrorWrap.GKErrorWrap)(-2, '\u670D\u52A1\u53D1\u751F\u5F02\u5E38'),
    _NOT_PARAMS: (0, _GKErrorWrap.GKErrorWrap)(-1, '\u7F3A\u5C11\u53C2\u6570')
};
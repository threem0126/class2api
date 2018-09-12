import {GKErrorWrap} from './GKErrorWrap'

/**
 * 内置的错误类型，统一为负数，且以'_'开头
 * @type {{_TOKEN_LOGIN_INVALID, _NOT_ACCESS_PERMISSION, _NOT_SERVICE, _PARAMS_VALUE_EXPECT, _NO_RESULT, _SERVER_ERROR, _NOT_PARAMS}}
 */
export const GKErrors = {
    _TOKEN_PARSE_FAIL: GKErrorWrap(-9, `token解析失败`),
    _RULE_VALIDATE_ERROR: GKErrorWrap(-8, `权限认证过程中发生异常`),
    _TOKEN_LOGIN_INVALID: GKErrorWrap(-7, `请先登录`),
    _NOT_ACCESS_PERMISSION: GKErrorWrap(-6, `无访问权限`),
    _NOT_SERVICE: GKErrorWrap(-5, `功能即将实现`),
    _PARAMS_VALUE_EXPECT: GKErrorWrap(-4, `参数不符合预期`),
    _NO_RESULT: GKErrorWrap(-3, `无匹配结果`),
    _SERVER_ERROR: GKErrorWrap(-2, `温馨提示：`),
    _NOT_PARAMS: GKErrorWrap(-1, `缺少参数`)
}

/**
 * 后台管理的权限验证服务，在客户调用端class2api.config.js中配置API地址，供调用方class2api中权限相关的修饰器函数内部来请求
 * 后台管理权限验证的框架参考： https://lcpublic.s3.cn-north-1.amazonaws.com.cn/acf201ab-16da-44fb-aea1-017bb1285b07?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAOYYVHPTPAKZAWURQ%2F20180416%2Fcn-north-1%2Fs3%2Faws4_request&X-Amz-Date=20180416T072806Z&X-Amz-Expires=3600&X-Amz-Signature=d50e9a048aeafd8c9d4f9fc8660c3dbec65819610b21fc130ff046115075c886&X-Amz-SignedHeaders=host
 */
import {GKSUCCESS} from "/class2api";

class GKRuleManager {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    /**
     * 验证身份，根据req中的jwtoken的header，解析出后台人员身份
     * @param req   请求request信息，通常身份信息在header中传递
     * @returns {Promise.<{uID: number, name: string, age: number, roles: Array}>}
     */
    static async auth({req}) {
        //let jwtoken = req.headers['jwtoken'] || ''
        //TODO: ...解析jwtoken
        return {uID: 123, name: "huangyong", age: 23, roles: []}
    }

    /**
     * 验证请求中的身份人员是否有对请求中的资源的访问权限
     * @param sysName   调用方的系统名称
     * @param jwtoken   身份tokon（注意，不是业务前端的身份token）
     * @param categoryName  权限点所属权限组的名称
     * @param categoryDesc  权限点所属权限组的描述
     * @param ruleName      权限点名称
     * @param ruleDesc      权限点描述
     * @param codePath      权限点对应类静态方法的路径
     * @returns {Promise.<*>}   是否允许访问的对象结果
     */
    static async validate({sysName, jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath}) {
        //...
        console.log(`validate: ...`)
        console.log({sysName, jwtoken, categoryName,categoryDesc, ruleName, ruleDesc, codePath})

        //TODO:这里替换为具体的权限表判断逻辑

        if (ruleName === '编辑文章') {
            return {canAccess: false, resean: '未授权'}
        } else {
            return {canAccess: true}
        }
    }

    /**
     * 接受各后台模块系统上传来的权限配置表信息，保存到权限中心的数据表中
     *
     * @returns {Promise.<void>}
     */
    static async register() {
        //TODO:待实现
        return GKSUCCESS();
    }
}

export default GKRuleManager
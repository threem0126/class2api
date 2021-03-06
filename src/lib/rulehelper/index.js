import {GKErrors} from "../class2api/GKErrors_Inner";
import RuleValidator from './adminRuleValidator';
import getConfig from './loadConfig.js'
import md5 from 'md5'
import fetch from "isomorphic-fetch";
import {keys} from 'lodash';

let {name:sysName, admin_rule_center} = getConfig();
let _ruleValidator_custom;
/**
 * 权证验证起
 * @param jwtoken
 * @param ruleCategory
 * @param ruleName
 * @param ruleDesc
 * @param codePath
 * @returns {Promise.<*>}
 */
const ruleValidator = async ({jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath, apiInvokeParams,frontReq})=> {
    let params = {jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath, apiInvokeParams, frontReq}
    if (_ruleValidator_custom) {
        //调用外部的自定义验证函数
        return await _ruleValidator_custom({
            sysName,
            jwtoken,
            categoryName,
            categoryDesc,
            ruleName,
            ruleDesc,
            codePath,
            frontReq
        })
    } else {
        //使用内置的权限验证函数，向class2api.config中配置的权限中心发起请求
        return await RuleValidator._ruleValidator_inner({...params, sysName})
    }
}

/**
 * accessRule访问权限修饰器中认证函数的全局配置入口
 *
 * @param ruleValidator
 */
export const setting_CustomRuleValidator = async (ruleValidator)=>{
    if (typeof ruleValidator !== "function") {
        throw GKErrors._PARAMS_VALUE_EXPECT(`提供给setting_CustomRuleValidator的参数需要是Function，而不是${typeof ruleValidator}`)
    }
    _ruleValidator_custom = ruleValidator
}

/**
 * 修饰器,提供访问权限的校验控制
 *
 * @returns {Function}
 */
export const accessRule = (options) => {
    let {categoryName, ruleName, ruleDesc = ''} = options
    return function (target, name, descriptor) {

        //兼容babel 7的变化
        name = name || target.key
        descriptor = descriptor || target.descriptor

        // console.log( `accessRule:`  )
        // console.log( console.dir(target)  )
        // console.log( console.dir(name)  )
        // console.log( console.dir(descriptor)  )
        if (!ruleName) {
            //修饰器的报错，级别更高，直接抛出终止程序
            setTimeout(() => {
                throw new Error(`在类静态方法 ${target.name}.${name} 上权限控制器的ruleName参数未定义`)
            })
        }
        // console.log(`类静态方法 ${target.name}.${name}       上定义了权限点 =>      ${categoryName}.${ruleName} (${ruleDesc})`)

        let oldValue = descriptor.value;
        descriptor.value = async function () {
            if (!(target.__modelSetting)) {
                //修饰器的报错，级别更高，直接抛出终止程序
                setImmediate(() => {
                    throw new Error(`需要方法级权限管控的后台业务类${target.name}，还没有添加modelSetting修饰器`)
                })
                throw new Error(`error in class2api`)
            }
            if (typeof target.__modelSetting !== "function") {
                //修饰器的报错，级别更高，直接抛出终止程序
                setImmediate(() => {
                    throw new Error(`后台业务类${target.name}所添加的modelSetting修饰器不正确，请参考class2api文档`)
                })
                throw new Error(`error in class2api`)
            }
            if (! (target.__modelSetting().__ruleCategory) ) {
                //修饰器的报错，级别更高，直接抛出终止程序
                setImmediate(() => {
                    throw new Error(`类 ${target.name} 的modelSetting修饰器中没有指定__ruleCategory属性（权限组信息）`)
                })
                throw new Error(`error in class2api`)
            }
            //优先取PRODUCTION_TYPE，其次取NODE_ENV
            let Prod = process.env.PRODUCTION_TYPE || process.env.NODE_ENV
            if( Prod !=="production" ) {
                let hint = `非正式环境(PRODUCTION_TYPE=${process.env.PRODUCTION_TYPE}, NODE_ENV=${process.env.NODE_ENV}, nextJS项目识别PRODUCTION_TYPE，API项目识别NODE_ENV)，便于调试，授权放行...`
                console.error(hint)
                //直接放行调用
                return await oldValue(...arguments);
            }
            let jwtoken;
            let expressReq;
            let apiModel = 'api'; //传统class2api，还是prisma-graphQL接口API
            //取值位置1：传统API方法的入参
            //取值位置2：graphQL版API方法的入参
            //两个位置同时取
            let [apiParams0_Or_graphQLparent = {}, graphQlparams, ctx = {}, info_nouse] = arguments
            let {req} = apiParams0_Or_graphQLparent
            expressReq = req
            if (!expressReq) {
                let {request} = ctx
                expressReq = request
                if (expressReq)
                    apiModel = 'graphQL'
            }
            if (!expressReq)
                throw GKErrors._NOT_ACCESS_PERMISSION(`身份无法识别，在API对应的静态方法(${target.name}.${name})的入参中未读取到请求头对象的cookie.jwtoken或headers['jwtoken']，请咨询class2api的维护人员`)

            jwtoken = expressReq.cookies.jwtoken || expressReq.headers['jwtoken'] || ""
            if (!jwtoken)
                throw GKErrors._NOT_ACCESS_PERMISSION(`身份未明，您没有访问${target.name}.${name}对应API接口的权限`)

            //采集请求的日志信息
            let apiInvokeParams = ''
            let {headers, cookies} = expressReq
            let frontReq = {
                ___ip: expressReq.headers['x-forwarded-for'] || (expressReq.connection && expressReq.connection.remoteAddress) || (expressReq.socket && expressReq.socket.remoteAddress) || (expressReq.connection.socket && expressReq.connection.socket.remoteAddress) || '',
                headers,
                cookies
            }
            if (apiModel === "api") {
                //剔除传统API请求参数中多余的（由框架注入的杂质信息），剩余属性为调用的真实入参
                let {req: req_noused, res: res_noused, __cacheManage, ___frontpageURL: ___frontpageURL_noused, ..._apiInvokeParams} = apiParams0_Or_graphQLparent
                try {
                    apiInvokeParams = JSON.stringify(_apiInvokeParams)
                } catch (err) {
                    apiInvokeParams = 'call params stringify error'
                }
            } else {
                try {
                    apiInvokeParams = JSON.stringify(graphQlparams)
                } catch (err) {
                    apiInvokeParams = 'call params stringify error（graphQL）'
                }
            }
            //长度过长，截取前505位
            if (apiInvokeParams.length > 505) {
                apiInvokeParams = apiInvokeParams.substr(0, 500) + '[...]'
            }

            let {name: categoryName, desc: categoryDesc} = target.__modelSetting ?
                target.__modelSetting().__ruleCategory : {name: '无名', desc: '-'}
            let {err, result} = await ruleValidator({
                jwtoken,
                categoryName,
                categoryDesc,
                ruleName: `${ruleName}`,
                ruleDesc,
                codePath: `${target.name}.${name}`,
                apiInvokeParams,
                frontReq,
            });
            let {canAccess, resean} = result
            if (!canAccess) {
                throw  GKErrors._NOT_ACCESS_PERMISSION({
                    resean: `访问被拒绝（功能：[${categoryName}/${ruleName}]，代码:[${target.name}.${name}]，原因：${resean || '-'}）`
                })
            }
            //...验证权限认证
            return await oldValue(...arguments);
        };
        return descriptor;
    }
}

/**
 * 从jstoken值解析后台管理用户的账号
 *
 * @param jstoken
 * @returns {Promise.<*>}
 */
export const parseAdminAccountFromJWToken = async ({jwtoken,req})=> {
    return await RuleValidator.parseAdminAccountFromJWToken({jwtoken,req})
}

/**
 * 将易于书写结构中的rules value值转换为对象结构
 * @param adminrules
 * @returns {Promise<void>}
 */
export const withConvertAdminrules2MachineVersion = (adminrules)=> {
    if(typeof window ==="object"){
        throw new Error(`大前端环境，请使用 nexweb组件中的withConvertAdminrules2MachineVersion函数`)
    }
    keys(adminrules).forEach(CategoryKey => {
        let RuleItem = adminrules[CategoryKey];
        const sysName = RuleItem.__sysName
        keys(RuleItem).forEach(
            key2 => RuleItem[key2] = {categoryName: CategoryKey, ruleName: key2, ruleDesc: RuleItem[key2], sysName}
        )
        RuleItem.__ruleCategory = {name: CategoryKey, desc: ''}
        delete RuleItem.__sysName
    });
    return adminrules
}

export const uploadupdateCertList = async ({ruleCategory,ruleNameList, salt})=> {
    if (!ruleNameList) throw GKErrors._NOT_PARAMS(`ruleNameList`)
    if (!ruleCategory) throw GKErrors._NOT_PARAMS(`ruleCategory`)
    //验证签名
    let timestamp = new Date().getTime()
    const rawString = JSON.stringify({
        ruleNameList, ruleCategory, from: name, timestamp
    })
    const sign = md5(`${salt}-${rawString}-${process.env.NODE_ENV}`)
    try {
        let res = await fetch(admin_rule_center.register, {
            method: 'post',
            rejectUnauthorized: false,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            withCredentials: 'true',
            json: true,
            body: JSON.stringify({ruleNameList, ruleCategory, from: name, timestamp, sign})
        });
        let {err, result} = await res.json();
        return {err, result}
    } catch (e) {
        console.error(`权限点注册遇到错误`)
        console.error(e.stack)
    }
}
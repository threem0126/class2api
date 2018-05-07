import path from 'path';
import {GKErrors} from "../class2api/GKErrors_Inner";
import RuleValidator from './adminRuleValidator'

let class2api_config ;
try{
    let {config} = require(path.join(process.cwd(), 'class2api.config.js'));
    class2api_config = config
}catch(err){
    //..
};
let {name:sysName='-', admin_rule_center} = class2api_config||{}
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
const ruleValidator = async ({jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath, apiInvokeParams})=> {
    let params = {jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath,apiInvokeParams,frontReq}
    if (_ruleValidator_custom) {
        //调用外部的自定义验证函数
        return await _ruleValidator_custom({jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath,frontReq})
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
 * @param ruleName
 * @param ruleDesc
 * @returns {Function}
 */
export const accessRule = ({ruleName, ruleDesc=''}) => {
    return function (target, name, descriptor) {
        if (!ruleName) {
            //修饰器的报错，级别更高，直接抛出终止程序
            setTimeout(() => {
                throw `在类静态方法 ${target.name}.${name} 上权限控制器的ruleName参数未定义`
            })
        }
        let oldValue = descriptor.value;
        descriptor.value = async function () {
            if (!target.__modelSetting || typeof target.__modelSetting !== "function" || !(target.__modelSetting().__ruleCategory)) {
                //修饰器的报错，级别更高，直接抛出终止程序
                setTimeout(() => {
                    throw `类 ${target.name} 的modelSetting修饰器中没有指定__ruleCategory属性（权限组信息）`
                })
            }
            if (arguments.length === 0 || typeof arguments[0] !== "object") {
                //修饰器的报错，级别更高，直接用setTimeout抛出异常，以终止程序运行
                setTimeout(() => {
                    throw `在类静态方法 ${target.name}.${name} 上缺少身份参数，无法验证权限`
                })
            }
            let jwtoken
            try {
                jwtoken = arguments[0]['req'].headers['jwtoken']
                if (!jwtoken)
                    throw GKErrors._NOT_ACCESS_PERMISSION(`身份未明，您没有访问${target.name}.${name}对应API接口的权限`)
            } catch (err) {
                throw GKErrors._NOT_ACCESS_PERMISSION(`身份无法识别，在API对应的静态方法上未读取到req请求对象的headers['jwtoken']`)
            }
            let {name: categoryName, desc: categoryDesc} = target.__modelSetting ?
                target.__modelSetting().__ruleCategory : {name: '无名', desc: '-'}
            let apiInvokeParams = ''
            let {req:req_noused, res:res_noused, ___frontpageURL:___frontpageURL_noused,..._apiInvokeParams} = arguments[0] || {}

            let {headers, cookies} = req_noused
            let frontReq = {}

            try{
                frontReq = {
                    ___ip: req_noused.headers['x-forwarded-for'] || req_noused.connection.remoteAddress || req_noused.socket.remoteAddress || req_noused.connection.socket.remoteAddress,
                    headers,
                    cookies
                }
                apiInvokeParams = JSON.stringify(_apiInvokeParams)
            }catch (err) {
                apiInvokeParams = 'call params stringify error'
            }
            if(apiInvokeParams.length>505) {
                apiInvokeParams = apiInvokeParams.substr(0, 500) + '[...]'
            }
            let {err, result} = await ruleValidator({
                jwtoken,
                categoryName,
                categoryDesc,
                ruleName: `${ruleName}`,
                ruleDesc,
                codePath: `${target.name}.${name}`,
                apiInvokeParams,
                frontReq
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
export const parseAdminAccountFromJWToken = async ({jwtoken})=> {
    return await RuleValidator.parseAdminAccountFromJWToken({jwtoken})
}






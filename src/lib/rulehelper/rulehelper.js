import path from 'path';
import Hashcode from 'hashcode'
import {GKErrors} from "../class2api/GKErrors";
import {cacheAble} from '../class2api/Decorators'
import fetch from 'isomorphic-fetch';

let class2api_config ;
try{
    let {config} = require(path.join(process.cwd(), 'class2api.config.js'));
    class2api_config = config
}catch(err){}
let {name:sysName,rule_center} = class2api_config
let _ruleValidator_custom;

class RuleHepler {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @cacheAble({
        cacheKeyGene: (args) => {
            let {jwtoken} = args[0]
            return jwtoken ? `_ruleValidator_inner-${Hashcode.value(jwtoken)}` : '';
        }
    })
    static async _ruleValidator_inner({jwtoken, ruleCategory, ruleName, ruleDescript, codePath}) {
        try {
            let res = await fetch(rule_center.validator, {
                method: 'post',
                rejectUnauthorized: false,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    jwtoken
                },
                withCredentials: 'true',
                json: true,
                body: JSON.stringify({sysName, jwtoken, ruleCategory, ruleName, ruleDescript, codePath})
            });
            let jsonResult = await res.json();
            return jsonResult
        } catch (e) {
            //权限认证出错
            throw GKErrors._RULE_VALIDATE_ERROR(e)
        }
    }

    /**
     * 权证验证起
     * @param jwtoken
     * @param ruleCategory
     * @param ruleName
     * @param ruleDescript
     * @param codePath
     * @returns {Promise.<*>}
     */
    static async ruleValidator({jwtoken, ruleCategory, ruleName, ruleDescript, codePath}) {
        let params = {jwtoken, ruleCategory, ruleName, ruleDescript, codePath}
        if (_ruleValidator_custom) {
            //调用外部的自定义验证函数
            return await _ruleValidator_custom({jwtoken, ruleCategory, ruleName, ruleDescript, codePath})
        } else {
            //使用内置的权限验证函数，向class2api.config中配置的权限中心发起请求
            return await Inner._ruleValidator_inner({...params, sysName})
        }
    }
}

export default RuleHepler

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





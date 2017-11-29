import path from 'path';
import {cacheAble} from './../class2api/Decorators'
import {GKErrors} from '../class2api/GKErrors_Inner'
import fetch from 'isomorphic-fetch';
import {hashcode} from './../class2api/util';

let class2api_config ;
try{
    let {config} = require(path.join(process.cwd(), 'class2api.config.js'));
    class2api_config = config
}catch(err){
    //..
}
let {sysName, rule_center} = class2api_config;

class RuleValidator {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @cacheAble({
        cacheKeyGene: (args) => {
            let {jwtoken, ruleCategory, ruleName} = args[0];
            //以jwtoken、功能组名称、权限名称来组合索引，混存上一次的判断结果
            return jwtoken ? `_ruleValidator_inner-${hashcode(jwtoken)}-${hashcode(ruleCategory)}-${hashcode(ruleName)}` : '';
        }
    })
    static async _ruleValidator_inner({sysName, jwtoken, ruleCategory, ruleName, ruleDescript, codePath}) {
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
                body: JSON.stringify({sysName, ruleCategory, ruleName, ruleDescript, codePath})
            });
            let jsonResult = await res.json();
            return jsonResult
        } catch (e) {
            //权限认证出错
            console.error(e)
            throw GKErrors._RULE_VALIDATE_ERROR(e)
        }
    }
}

export default RuleValidator
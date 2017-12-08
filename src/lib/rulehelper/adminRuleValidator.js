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
let {sysName, admin_rule_center} = class2api_config||{};

class RuleValidator {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    /**
     * 从jstoken值解析后台管理用户的账号
     *
     * @param jstoken
     * @returns {Promise.<*>}
     */
    @cacheAble({
        cacheKeyGene: (args) => {
            let {jwtoken} = args[0];
            return jwtoken;
        }
    })
    static async parseAdminAccountFromJWToken ({jwtoken}) {
        if (!jwtoken)
            throw GKErrors._TOKEN_LOGIN_INVALID(`标记身份验证的jwtoken未提供`)
        try {
            let res = await fetch(admin_rule_center.auth, {
                method: 'post',
                rejectUnauthorized: false,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'jwtoken':jwtoken
                },
                withCredentials: 'true',
                json: true,
                body:JSON.stringify({nothing:1})
            });
            let {err, result} = await res.json();
            if (err)
                throw GKErrors._SERVER_ERROR(`验证身份时遇到错误${ err }`)
            return result
        } catch (e) {
            //权限认证出错
            console.error(e)
            if(process.env.NODE_ENV==="development") {
                setTimeout(() => {
                    throw e
                })
            }
            throw GKErrors._SERVER_ERROR(`验证身份时遇到异常${e}`)
        }
    }

    @cacheAble({
        cacheKeyGene: (args) => {
            let {jwtoken='', categoryName='', ruleName=''} = args[0];
            //以jwtoken、功能组名称、权限名称来组合索引，混存上一次的判断结果
            return jwtoken ? `_ruleValidator_inner-${hashcode(jwtoken)}-${hashcode(categoryName)}-${hashcode(ruleName)}` : '';
        }
    })
    static async _ruleValidator_inner({sysName, jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath}) {
        try {
            let res = await fetch(admin_rule_center.validator, {
                method: 'post',
                rejectUnauthorized: false,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'jwtoken':jwtoken
                },
                withCredentials: 'true',
                json: true,
                body: JSON.stringify({sysName, categoryName, categoryDesc, ruleName, ruleDesc, codePath})
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
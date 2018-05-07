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
        cacheKeyGene: ({jwtoken}) => {
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
                    'jwtoken': jwtoken
                },
                withCredentials: 'true',
                json: true,
                body: JSON.stringify({nothing: 1})
            });
            let {err, result} = await res.json();
            if (err) {
                let {_gankao} = err
                if (_gankao === '1') {
                    throw err
                } else {
                    throw GKErrors._TOKEN_LOGIN_INVALID(`jwtoken无法识别：${ JSON.stringify(err) }`)
                }
            }
            return result
        } catch (e) {
            //权限认证出错
            let {_gankao} = e
            console.error(e)
            if (_gankao === '1') {
                throw e
            } else {
                //非业务级报错，且在非正式部署环境，则终止程序
                if (process.env.NODE_ENV !== "production") {
                    setTimeout(() => {
                        throw e
                    })
                } else {
                    throw GKErrors._SERVER_ERROR(`验证身份时遇到异常${ JSON.stringify(e) }`)
                }
            }
        }
    }

    @cacheAble({
        cacheKeyGene: ({jwtoken='', categoryName='', ruleName=''}) => {
            //以jwtoken、功能组名称、权限名称来组合索引，混存上一次的判断结果
            return jwtoken ? `_ruleValidator_inner-${hashcode(jwtoken)}-${hashcode(categoryName)}-${hashcode(ruleName)}` : '';
        }
    })
    static async _ruleValidator_inner({sysName, jwtoken, categoryName, categoryDesc, ruleName, ruleDesc, codePath,apiInvokeParams={},frontReq}) {
        try {
            if(process.env.NODE_ENV!=="production"){
                console.log(`权限,向中心请求授权认证(${admin_rule_center.validator}）...`)
            }
            let res = await fetch(admin_rule_center.validator, {
                method: 'post',
                rejectUnauthorized: false,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'jwtoken': jwtoken
                },
                withCredentials: 'true',
                json: true,
                body: JSON.stringify({sysName, categoryName, categoryDesc, ruleName, ruleDesc, codePath, apiInvokeParams,frontReq})
            });
            let text = await res.text()
            if(process.env.NODE_ENV!=="production"){
                console.log(`权限，授权结果返回：`)
                console.log(text)
            }
            try {
                let jsonResult = JSON.parse(text)
                return jsonResult //内部含err,result
            } catch (e) {
                console.error(`权限，授权结果为非json格式的字符串，封装为{err,result}接口...`)
                console.error({err: null, result: text})
                return {err: null, result: text}
            }
        } catch (e) {
            if(process.env.NODE_ENV!=="production"){
                console.error('调用权限认证接口时遇到程序错误，开发环境，将终止程序 ...')
                throw e
            }else{
                console.error('调用权限认证接口时遇到程序错误，非开发环境，转换为GKErrors._RULE_VALIDATE_ERROR错误继续向下传递 ...')
                console.error(e)
            }
            throw GKErrors._RULE_VALIDATE_ERROR(e)
        }
    }
}

export default RuleValidator
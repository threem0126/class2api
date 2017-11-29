import {getRedisClient, cacheAble, clearCache, modelSetting,accessRule,setting_RuleValidator} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import {DBUtils,GKSUCCESS,excuteSQL} from 'class2api/dbhelper'
import {checkPhoneFormat,delayRun} from 'class2api/util'
//项目自身
import {DataModel,ass,SQLFunctions} from './../tableloader'
import * as types from './../constants';
import Base from '../model_private/Base';
import Auth from '../model_private/Auth';
import {gkRuleValidator} from './../model_private/RuleValidator'

setting_RuleValidator(gkRuleValidator)

@modelSetting({
    __needAuth:async ({uid})=> {
        return await Auth.varifyPermession({uid})
    }
})
class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    static async hello({name}) {
        if (!name)
            throw GKErrors._NOT_PARAMS(`name参数未定义!`)
        if (name === "huangyong")
            throw types.ERROR_PERSONINFO_NOT_READY('人员信息未配置！')
        return await Base.TestInside({name})
    }

    static async hello2(){
        throw GKErrors._SERVER_ERROR(`错误描述`)
    }

    static async hello3() {
        let user = await DataModel.DemoUser.findOne()
        return {user}
    }

    @accessRule({ruleName:'编辑文章',ruleDescript:'对文章进行编辑'})
    static async editArticle({aID}){
        return "result from editArticle"
    }

}

export default GKModelA
import {getRedisClient, cacheAble, clearCache, modelSetting} from 'class2api'
import {GKSUCCESS,excuteSQL,DBUtils} from 'class2api/dbhelper'
import {checkPhoneFormat,delayRun} from 'class2api/'
import {GKErrors} from 'class2api/gkerrors'

import Base from './../model_private/Base'
import * as types from './../constants';

@modelSetting({
    /**
     * 访问权限验证器，做权限拦截
     * @param uid
     * @returns {Promise.<boolean>}
     * @private
     */
    __needAuth:async ({uid})=> {
        //TODO: 验证用户的权限
        return true
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
            throw types.ERROR_USER_NOT_EXIST('人员信息未配置！')
        return await Base.TestInside({name})
    }

    static async hello2(){
        throw GKErrors._SERVER_ERROR(`错误描述`)
    }

    static async hello3() {
        let user = await DataModel.DemoUser.findOne()
        return {user}
    }

}

export default GKModelA
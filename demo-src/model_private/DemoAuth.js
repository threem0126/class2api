import {GKSUCCESS, modelSetting, cacheAble, clearCache} from 'class2api'

export default class {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @cacheAble({
        cacheKeyGene: (args) => {
            let {req} = args[0]
            return req.header('token') || ''
        }
    })
    static async parseUserInfoFromRequest({req}) {
        return {uID: 12345678, userInfo: {}};
    }
}



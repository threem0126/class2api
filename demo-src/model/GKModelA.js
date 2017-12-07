import {GKSUCCESS, modelSetting, cacheAble, clearCache} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import DemoAuth from "../model_private/DemoAuth";


@modelSetting({
    __Auth:async ({req})=>{
        //非后台的用户验证，解析header中的token信息
        return await DemoAuth.parseUserInfoFromRequest({req})
    }
})
class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    /**
     * getArticle
     *
     * @param name
     * @returns {Promise.<{message: string}>}
     */
    @cacheAble({
        cacheKeyGene: (args) => {
            let {name} = args[0]
            return `getArticle-${name}`
        }
    })
    static async getArticle({uID, name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        return {message: `getArticle.${name}，from user. ${uID}`}
    }
}

export default GKModelA
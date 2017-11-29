import {GKSUCCESS, modelSetting, cacheAble, clearCache} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'

class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }


    /**
     * 测试hello
     *
     * @param name
     * @returns {Promise.<{message: string}>}
     */
    static async hello({name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        return {message: `hello.${name}`}
    }

    static async editArticle({aID}) {
        //...
        return GKSUCCESS()
    }

    static async deleteArticle({aID}) {
        //...
        return GKSUCCESS()
    }

}

export default GKModelA
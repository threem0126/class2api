import {GKSUCCESS} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import Base from './../model_private/Base'

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
    static async getArticle({uID, name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        return {message: `getArticle.${name}, user.uID = ${uID}, ${Base.TestInside({name})}`}
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
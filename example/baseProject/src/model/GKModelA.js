import {GKSUCCESS} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import Base from './../model_private/Base'

class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    static async hello({name}) {
        return {message: `this is a message from Api: got name [${name}]`}
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

    static async customResponseResultStruck() {
        //TODO:.....

        //class2api内部会判断，如果API方法返回的是Function，则框架会把函数的运行执行结果返回给客户端，以实现自定义特殊的response结构
        return () => {
            return {data: {name: 'huangyong'}, errorCode: 123}
        }
    }

}

export default GKModelA
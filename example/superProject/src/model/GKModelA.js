import {GKSUCCESS, modelSetting, cacheAble, clearCache} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import {DataModel} from "./../tableloader";
import Auth from "./../model_private/Auth";


@modelSetting({
    __Auth:async ({req})=>{
        //非后台的用户验证，解析header中的token信息
        return await Auth.parseUserInfoFromRequest({req})
    }
})
class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @cacheAble({
        cacheKeyGene: (args) => {
            let {name} = args[0]
            return `hello-${name}`
        }
    })
    /**
     * 测试hello
     *
     * @param name
     * @returns {Promise.<{message: string}>}
     */
    static async getArticle({uID, name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        let user = await DataModel.DemoUser.findOne()
        if (user) {
            return {message: `hello.${name}: there are nobody!`}
        } else {
            return {message: `hello.${name}:there has one girl,name:${user.name} ${user.age} years old!`}
        }
    }

}

export default GKModelA
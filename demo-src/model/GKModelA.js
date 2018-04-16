import {GKSUCCESS, modelSetting, cacheAble, clearCache} from '/class2api'
import {GKErrors} from '/class2api/gkerrors'
import DemoAuth from "../model_private/DemoAuth";
import {DataModel,DataModel_MainDB} from "./../tableloader";

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
        cacheKeyGene: ({name}) => {
            return `getArticle-${name}`
        }
    })
    static async getArticle({uID, name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))

        let [user0] = await DataModel.__excuteSQL(`select * from demousers limit 1`)
        console.log(`user0 = ${ JSON.stringify( user0 ) }`)

        let user1 = await DataModel.DemoUser.findOne()
        console.log(`user1 = ${ JSON.stringify( user1.get()) }`)

        let user2 = await DataModel_MainDB.DemoUser.findOne()
        console.log(`user2 = ${ JSON.stringify( user2.get()) }`)

        let t = await DataModel.__createTransaction()
        await user2.update({age:Math.random()*50}, {transaction: t})
        t.commit()

        let [user3] = await DataModel_MainDB.__excuteSQL(`select * from demousers limit 1`)
        console.log(`user0 = ${ JSON.stringify( user3 ) }`)



        return {message: `getArticle.${name}，from user. ${uID}`}
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
import {modelSetting, cacheAble, clearCache} from './../src/lib/class2api/Decorators'
import {GKErrors} from './../src/lib/class2api/GKErrors'



@modelSetting({
    __needAuth:async ({uid})=>{
        return await accessProvider('class1')({uid})
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
     * 测试洒苏打粉
     * @param name
     * @returns {Promise.<{message: string}>}
     */
    static async hello({name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        return {message: `hello.${name}`}
    }
}

export default GKModelA
import {modelSetting, cacheAble, clearCache} from './../src/lib/class2api/Decorators'
import {GKErrors} from './../src/lib/class2api/GKErrors'

@modelSetting({
    __needAuth:async ({uid})=>{
        return await accessProvider('class1')({uid})
    },
})
class ModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @cacheAble({
        cacheKeyGene: (args) => {
            let {name} = args[0]
            return `hello-${name}`
        }
    })
    static async hello({name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        return {message: `hello.${name}`}
    }
}

export default ModelA
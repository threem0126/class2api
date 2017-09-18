import {modelSetting, cacheAble, clearCache} from './lib/Decorators'

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
        return {message:`hello.${name}`}
    }
}

export default ModelA
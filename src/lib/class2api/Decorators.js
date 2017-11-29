import {getRedisClient,getting_redisConfig} from './redisClient';
import {delayRun, getClientIp} from './util'

let config = getting_redisConfig();
let {cache_prefx:redis_cache_key_prefx="redis_cache_key_prefx_",defaultExpireSecond=10*60} = config

export const modelSetting = (props) => {
    Object.keys(props).map((key,value)=>{
        if(key.indexOf("__")!==0) {
            throw '动态添加的静态属性名不符合约定格式（__****）'
        }
    });
    let _props = {...props}
    return function (target) {
        target.__modelSetting = ()=>{
            return _props
        }
    }
}

let ____cache = {
    get: async (akey) => {
        akey = redis_cache_key_prefx + akey
        let avalue = await getRedisClient().getAsync(akey)
        if (avalue) {
            try {
                return JSON.parse(avalue)
            } catch (err) {
                console.log(`redis缓存[${akey}]删除失败：${err}`)
                //解析错误，则删除key
                await getRedisClient().delAsync(akey)
                return null
            }
        }
        return avalue
    },
    set: async (akey, avalue, expireTimeSeconds) => {
        console.log(`set cachekey .......${akey}...`)
        akey = redis_cache_key_prefx + akey
        delayRun(async () => {
            await getRedisClient().setAsync(akey, JSON.stringify(avalue), 'EX', expireTimeSeconds || defaultExpireSecond)
       }, 0, (err) => {
            console.log(`redis缓存[${akey}]建立失败：${err}`)
        })
    },
    delete: async (akey) => {
        akey = redis_cache_key_prefx + akey
        delayRun(async () => {
            await getRedisClient().delAsync(akey)
            console.log(`delete cachekey .......${akey}...`)
        }, 0, (err) => {
            console.log(`redis缓存[${akey}]删除失败：${err}`)
        })
    }
}

/**
 * 在被修饰的方法运行前后执行，首先判断是否存在相同入参的调用缓存，如果没有则在运行结束后，将要运行结果缓存。缓存的key由默认参数属性cacheKeyGene的返回值决定。
 * 默认缓存时间60秒
 *
 * @param cacheKeyGene
 * @returns {Function}
 */
export const cacheAble = ({cacheKeyGene}) => {
    return function (target, name, descriptor) {
        //修饰器的报错，级别更高，直接抛出终止程序
        if(!cacheKeyGene) {
            setTimeout(() => {
                throw `在类静态方法 ${target.name}.${name} 上调用cacheAble修饰器时未指定有效的cacheKeyGene参数`
            })
        }
        let oldValue = descriptor.value;
        descriptor.value = async function () {
            let {__nocache} = arguments[0]
            if(__nocache){
                console.log(`force skip cache ........ ${target.name}.${name}`)
                return await oldValue(...arguments);
            }

            let key = ''
            if (cacheKeyGene) {
                key = cacheKeyGene(arguments)
                //返回空字符串时，忽略
                if(key) {
                    let Obj = await ____cache.get(key)
                    if (Obj) {
                        let result = (typeof Obj === "object") ? {...Obj} : Obj
                        if (typeof result === "object") {
                            //if (process.env.NODE_ENV !== 'production') {
                                console.log(`hit cachekey .......${key}...`)
                            //}
                            result.__fromCache = true
                        }
                        return result
                    }
                }
            }
            //if(process.env.NODE_ENV !=='production') {
                console.log(`miss cachekey .......${key}...`)
            //}
            let result = await oldValue(...arguments);
            if (cacheKeyGene && key) {
                await ____cache.set(key, result)
            }
            return result
        };
        return descriptor;
    }
}

/**
 * 在被修饰方法运行完毕后执行，用来清除一些相关的缓存
 *
 * @param cacheKeyGene
 * @returns {Function}
 */
export const clearCache = ({cacheKeyGene}) => {
    return function (target, name, descriptor) {
        let oldValue = descriptor.value;
        descriptor.value = async function () {
            let key = ''
            if (typeof cacheKeyGene === "function") {
                key = cacheKeyGene(arguments)
                if (key !== "") {
                    await ____cache.delete(key)
                } else {
                    //返回的key为空字符串，说明key无法提前确定，需要交给方法内部来调用清空
                    arguments[0].__cacheManage = () => {
                        return ____cache
                    }
                }
            } else {
                //修饰器的报错，级别更高，直接抛出终止程序
                setTimeout(() => {
                    throw `在类静态方法 ${target.name}.${name} 上调用cacheAble修饰器时未指定有效的cacheKeyGene参数`
                })
            }
            return await oldValue(...arguments);
        }
        return descriptor;
    }
}

/**
 * 实际用在API入口处判断，很少用在类的方法级别
 *
 * @returns {Function}
 */
export const ipwhitelist = () => {
    return function (target, name, descriptor) {
        if(!descriptor){
            throw 'ipwhitelist不支持修饰类'
        }
        let oldValue = descriptor.value;
        descriptor.value = async function () {
            let {req} = arguments.length > 0 ? (typeof arguments[0] === "object" ? arguments[0] : {}) : {}
            if (!req) {
                //修饰器的报错，级别更高，直接抛出终止程序
                setTimeout(()=>{
                    throw `静态类方法 ${target.name}.${name} 中要求限定IP白名单，但是没有req请求参数传入，无法实施IP限制`
                })
            }
            if (whiteIPs.indexOf(getClientIp(req))===-1) {
                //修饰器的报错，级别更高，直接抛出终止程序
                setTimeout(()=>{
                    throw `IP没有访问权限`
                })
            }
            return await oldValue(...arguments);
        };
        return descriptor;
    }
}

/**
 * 修饰器,运行完类方法就认为跑出异常中断程序，调试用，生产环境下自动失效
 *
 * @param hintMsg
 * @returns {Function}
 */
export const crashAfterMe = (hintMsg)=> {
    return function (target, name, descriptor) {
        if (!descriptor) {
            throw 'crashAfterMe只支持修饰类方法本身，不支持修饰类'
        }
        if (process.env.NODE_ENV !== 'production') {
            let oldValue = descriptor.value;
            descriptor.value = async function () {
                let ret = await oldValue(...arguments);
                setTimeout(() => {
                    throw `${hintMsg || '调试用的中断'} by crashAfterMe decorator！ 非production环境（${process.env.NODE_ENV}）`
                }, 5)
                return ret
            };
        }
        return descriptor;
    }
}


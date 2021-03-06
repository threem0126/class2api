import {getRedisClient,getting_redisConfig} from './redisClient';
import {delayRun, getClientIp} from './util'

let config = getting_redisConfig();
let {cache_prefx:redis_cache_key_prefx="redis_cache_key_prefx_",defaultExpireSecond=10*60} = config;


export const modelSetting = function(SettingOptions) {
    Object.keys(SettingOptions).map((key, value) => {
        if (key.indexOf("__") !== 0) {
            throw new Error('动态添加的静态属性名不符合约定格式（__****）')
        }
    });
    let _props = {...SettingOptions}
    return function decorator(target) {
        target.__modelSetting = function () {
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
        PrintCacheLog(`set cachekey .......${akey}...`)
        akey = redis_cache_key_prefx + akey
        delayRun(async () => {
            await getRedisClient().setAsync(akey, JSON.stringify(avalue), 'EX', expireTimeSeconds || defaultExpireSecond)
       }, 0, (err) => {
            PrintCacheLog(`redis缓存[${akey}]建立失败：${err}`)
        })
    },
    delete: async (akey) => {
        akey = redis_cache_key_prefx + akey
        delayRun(async () => {
            await getRedisClient().delAsync(akey)
            PrintCacheLog(`delete cachekey .......${akey}...`)
        }, 0, (err) => {
            PrintCacheLog(`redis缓存[${akey}]删除失败：${err}`)
        })
    }
}

const PrintCacheLog = (msg)=> {
    if (process.env.PRINT_API_CACHE === '1') {
        console.log(msg)
    }
}

/**
 * 在被修饰的方法运行前后执行，首先判断是否存在相同入参的调用缓存，如果没有则在运行结束后，将要运行结果缓存。缓存的key由默认参数属性cacheKeyGene的返回值决定。
 * 默认缓存时间60秒
 * @param isGraphQL
 * @param cacheKeyGene
 * @param getExpireTimeSeconds
 * @returns {Function}
 */
export const cacheAble = function({isGraphQL=false, cacheKeyGene,getExpireTimeSeconds}) {
    let _cacheKeyGene = cacheKeyGene
    return function (target, name, descriptor) {
        //兼容babel 7的变化
        name = name || target.key
        descriptor = descriptor || target.descriptor
        //修饰器的报错，级别更高，直接抛出终止程序
        if (!_cacheKeyGene) {
            setTimeout(() => {
                throw new Error(`在类静态方法 ${target.name}.${name} 上调用cacheAble修饰器时未指定有效的cacheKeyGene参数`)
            })
        }
        let oldValue = descriptor.value;
        descriptor.value = async function () {
            if (process.env.NO_API_CACHE === '1') {
                PrintCacheLog(`[${target.name}.${name}] force skip cache by process.env.NO_API_CACHE ...`)
                return await oldValue(...arguments);
            }
            if(isGraphQL && arguments.length<3){
                console.error(`在类静态方法 ${target.name}.${name} 上调用cacheAble修饰时指定了isGraphQL=true,但被修饰的方法看起来签名不像标准的prisma规范：（parent, params, ctx, info）,暂时跳过缓存，继续执行....`)
                return await oldValue(...arguments);
            }
            if(!isGraphQL && arguments.length>2){
                console.error(`在类静态方法 ${target.name}.${name} 上调用cacheAble修饰时指定了isGraphQL=false,但被修饰的方法看起来签名却像标准的prisma规范（parent, params, ctx, info），请确认是否为graphQL/prisma的API方法,暂时跳过缓存，继续执行....`)
                return await oldValue(...arguments);
            }
            //注意，如果是graphQLServer，根据入参签名需取第三个参数：（parent, params, ctx, info）
            let {__nocache} = ((isGraphQL)?arguments[2]:arguments[0]) || {}
            if (__nocache) {
                PrintCacheLog(`[${target.name}.${name}] force skip cache ........ ${target.name}.${name}`)
                return await oldValue(...arguments);
            }
            if(!____cache) {
                console.error(`内置redis对象尚未初始化，请先调用setting_redisConfig(redis)、getRedisClient()！暂时跳过缓存，继续执行....`)
                return await oldValue(...arguments);
            }

            let key = ''
            if (_cacheKeyGene) {
                key = await _cacheKeyGene.apply(this, arguments)
                if (typeof key !== "string") {
                    //if (process.env.NODE_ENV !== 'production') {
                    setTimeout(() => {
                        throw new Error(`[${target.name}.${name}] 缓存修饰器的cacheKeyGene函数必需返回字符串结果，目前是 ${key}...`)
                    })
                    //}
                }
                //返回空字符串时，忽略
                if (key) {
                    let result = await ____cache.get(key)
                    if (process.env.NODE_ENV !== 'production') {
                        PrintCacheLog(`query cachekey [${key}]:${result}...`)
                    }
                    if (result) {
                        let aSkip = false
                        if (typeof result === "string") {
                            try {
                                result = JSON.parse(result)
                            } catch (e) {
                                if (process.env.NODE_ENV !== 'production') {
                                    console.error(`parse error the data from redis: ${result}`)
                                }
                                aSkip = true;
                            }
                        }
                        if (!aSkip) {
                            if (process.env.NODE_ENV !== 'production') {
                                PrintCacheLog(`[${target.name}.${name}] hit cachekey .......${key}...`)
                            }
                            if (typeof result === "object") {
                                if (isGraphQL && arguments[2]) {
                                    if (!arguments[2]._hitCaches)
                                        arguments[2]._hitCaches = {}
                                    arguments[2]._hitCaches[name] = true
                                } else {
                                    result.__fromCache = true
                                }
                            }
                            return result
                        }
                    }
                }
            }
            //if(process.env.NODE_ENV !=='production') {
            PrintCacheLog(`[${target.name}.${name}] miss cachekey .......${key}...`)
            //}
            let result = await oldValue(...arguments);
            if (_cacheKeyGene && key) {
                let expireTimeSeconds = null
                if (getExpireTimeSeconds && typeof getExpireTimeSeconds === "function")
                    expireTimeSeconds = getExpireTimeSeconds()
                if (result !== null)
                    await ____cache.set(key, JSON.stringify(result), expireTimeSeconds)
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
export const clearCache = function({cacheKeyGene}){
    // console.log( `clearCache:`   )
    // console.log( `cacheKeyGene:`+ cacheKeyGene   )
    return function (target, name, descriptor) {
        // console.log( `clearCache function:`+ target   )
        //兼容babel 7的变化
        name = name || target.key
        descriptor = descriptor || target.descriptor
        let oldValue = descriptor.value;
        descriptor.value = async function () {
            if (process.env.NO_API_CACHE === '1') {
                PrintCacheLog(`force skip cache by process.env.NO_API_CACHE ...`)
                return await oldValue(...arguments);
            }
            let key = ''
            if (typeof cacheKeyGene === "function") {
                key = cacheKeyGene(...arguments)
                if (typeof key !== "string") {
                    //if (process.env.NODE_ENV !== 'production') {
                    PrintCacheLog(`[${target.name}.${name}] 缓存修饰器的cacheKeyGene函数必需返回字符串结果，目前是 ${key}...`)
                    //}
                } else if (key === "") {
                    //返回的key为空字符串，说明key无法提前确定，需要交给方法内部来调用清空
                    arguments[0].__cacheManage = () => {
                        return ____cache
                    }
                } else {
                    await ____cache.delete(key)
                }
            } else {
                //修饰器的报错，级别更高，直接抛出终止程序
                setTimeout(() => {
                    throw new Error(`在类静态方法 ${target.name}.${name} 上调用cacheAble修饰器时未指定有效的cacheKeyGene参数`)
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
        // console.log( `cacheAble:`+ target   )
        if(!descriptor){
            throw new Error('ipwhitelist不支持修饰类')
        }
        //兼容babel 7的变化
        name = name || target.key
        descriptor = descriptor || target.descriptor

        let oldValue = descriptor.value;
        descriptor.value = async function () {
            let {req} = arguments.length > 0 ? (typeof arguments[0] === "object" ? arguments[0] : {}) : {}
            if (!req) {
                //修饰器的报错，级别更高，直接抛出终止程序
                setTimeout(()=>{
                    throw new Error(`静态类方法 ${target.name}.${name} 中要求限定IP白名单，但是没有req请求参数传入，无法实施IP限制`)
                })
            }
            if (whiteIPs.indexOf(getClientIp(req))===-1) {
                //修饰器的报错，级别更高，直接抛出终止程序
                setTimeout(()=>{
                    throw new Error(`IP没有访问权限`)
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
        // console.log(`crashAfterMe:` + target)
        if (!descriptor) {
            throw new Error('crashAfterMe只支持修饰类方法本身，不支持修饰类')
        }
        //兼容babel 7的变化
        name = name || target.key
        descriptor = descriptor || target.descriptor
        if (process.env.NODE_ENV !== 'production') {
            let oldValue = descriptor.value;
            descriptor.value = async function () {
                let ret = await oldValue(...arguments);
                setTimeout(() => {
                    throw new Error(`${hintMsg || '调试用的中断'} by  crashAfterMe decorator！ 非production环境（${process.env.NODE_ENV}）`)
                }, 5)
                return ret
            };
        }
        return descriptor;
    }
}

export const getCacheManage =()=> {
    return ____cache;
}

/**
 * 缓存包装函数
 * @param cacheKey
 * @param cacheDuration
 * @param callback
 * @returns
 * @constructor
 */
export const GKCache_remember = async (cacheKey, cacheDuration, callback)=> {
    let result = await ____cache.get(cacheKey);
    if (result)
        return result;
    let newResult = await callback();
    if (newResult == null)
        return newResult;
    try {
        if (typeof newResult == "object") {
            newResult = JSON.stringify(newResult)
        }
        await ____cache.set(cacheKey, newResult, Math.max(2, ~~cacheDuration))
    } catch (e) {
    }
    return newResult
}

export const GKCache_remove = async (cacheKey)=> {
    await ____cache.delete(cacheKey)
}
import redis from 'redis';
import moment from 'moment'
import Promise from 'bluebird';
import {GKErrors} from "./GKErrors_Inner";

let _redisClient;
let _redisConfig;
let _redisClient_inited = false;


export const setting_redisConfig = (redisConfig)=> {
    (() => {
        if(!_redisConfig){
            _redisConfig = redisConfig
            console.log(`class2api 内置redis配置config初始化成功！`)
        }
        let _ = getRedisClient()
    })();
}

export const getting_redisConfig = async ()=>{
    return _redisConfig
}

const _init_redisClient = ()=> {
    return new Promise((resolve, reject) => {
        const {cache_prefx: redis_cache_key_prefx} = _redisConfig;
        if(!redis_cache_key_prefx)
            throw GKErrors._SERVER_ERROR(`class2api的getRedisClient初始化时报错，未设定redis_cache_key_prefx值`);

        _redisClient = redis.createClient({
            host: _redisConfig.host,
            port: _redisConfig.port
        })

        console.log(`链接Redis服务器 on ${_redisConfig.host}:${_redisConfig.port} ... ...`);
        _redisClient.on("error", async (err) => {
            reject("Error " + err)
        });

        let onAuthDone = async () => {
            _redisClient_inited = true
            console.log(`链接Redis服务器 on ${_redisConfig.host}:${_redisConfig.port} ... ...成功!`);
            //  this key will expires after 10 seconds
            const key = '__test_redis'
            // 测试
            await _redisClient.setAsync(key, JSON.stringify({hello: "world"}), 'EX', 10);
            console.log(`测试，创建 redis key:${key}`)
            let avalue = await _redisClient.getAsync(key);
            console.log(`测试，读取 redis key:${key},value:${avalue}`)
            let deleted = await _redisClient.delAsync(key)
            console.log(`测试，删除了redis key:${key},${deleted}`)
            //
            console.log(`测试，自增数字：${await _redisClient.incrAsync(`incr_test_1`)}`)
            console.log(`测试，自增数字：${await _redisClient.incrAsync(`incr_test_1`)}`)
            console.log(`测试，自增数字：${await _redisClient.incrAsync(`incr_test_1`)}`)

            //添加列表（列表不存在，则自动新建）
            await _redisClient.rpushAsync(key, JSON.stringify({send: moment().format(), time: 1}))
            //设置一定时间后过期失效
            await _redisClient.expireAsync(key, 3)
            //读取列表值
            console.log(`测试，存储并读取列表类型，redis key:${key},value:`+ await _redisClient.lrangeAsync("test", 0, -1))
            await _redisClient.delAsync('test')
            //
            resolve(_redisClient)
        }
        Promise.promisifyAll(_redisClient);
        try {
            Object.keys(_redisClient).forEach(function (modelName) {
                if(modelName.indexOf("Async")!==-1 && typeof _redisClient[modelName] ==="function" && _redisClient[modelName].length>0) {
                    _redisClient[`${modelName}Orig`] = _redisClient[modelName];
                    _redisClient[modelName] = async (...params) => {
                        let _OrigModelName = `${modelName}Orig`
                        if (typeof params[0] === "string") {
                            params[0] = redis_cache_key_prefx + params[0];
                        }
                        return await _redisClient[_OrigModelName](...params)
                    }
                    let modelNameWithOutSpace = modelName.replace("Async", '') + 'WithOutSpaceAsync';
                    _redisClient[modelNameWithOutSpace] = async (...params) => {
                        let _OrigModelName = `${modelName}Orig`
                        return await _redisClient[_OrigModelName](...params)
                    }
                }
            });
        } catch (err) {
            console.error(`_redisClient异步Promise化遇到错误：${err}`)
            reject(err)
        }

        _redisClient.on("connect", async (err) => {
            let {password} = _redisConfig
            console.log(`链接Redis服务器 on ${_redisConfig.host}:${_redisConfig.port} with password ${ password?"*****":"none" } ... ...connecting ...`);
            //
            if (password) {
                _redisClient.auth(password, async (err, result) => {
                    if(err){
                        console.error(`_redisClient.auth with password 时异常：${err}`)
                        reject(err);
                    }
                    else
                        await onAuthDone()
                })
            } else {
                await onAuthDone()
            }
        });
    });
}

export const getRedisClient = ()=> {
    if (_redisClient)
        return _redisClient;

    if (!_redisConfig) {
        throw  new Error(`redis配置信息尚未设置（请调用setting_redisConfig）`)
    }

    (async () => {
        await _init_redisClient()
    })();

    return _redisClient

}

/***
 * 微信授权网关的保留方法，其他应用只可读取，严禁调用更新
 */
export const __setGankaoWXAuthToken = async (gkwxauthtoken, wxuserinfo)=> {
    await _redisClient.setAsyncOrig(gkwxauthtoken, wxuserinfo)
}
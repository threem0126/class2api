import redis from 'redis';
import Promise from 'bluebird';
import {GKErrors} from "./GKErrors_Inner";

let _redisClient;
let _redisConfig;
let _redisClient_inited = false;

/**
 *
 * @param gkwxauthtoken
 * @returns {Promise.<*>}
 */
export const getGankaoWXAuthToken = async (gkwxauthtoken)=> {
    if (!_redisClient) {
        setTimeout(function () {
            throw '_redisClient对象尚未初始化，请先引用 redisClient.js '
        })
    }
    return await _redisClient.getAsyncOrig(gkwxauthtoken)
}

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
            resolve(_redisClient)
        }
        Promise.promisifyAll(_redisClient);
        try {
            _redisClient.getAsyncOrig = _redisClient.getAsync;
            _redisClient.getAsync = async (...params) => {
                params[0] = redis_cache_key_prefx + params[0];
                return await _redisClient.getAsyncOrig(...params)
            }
            //
            _redisClient.setAsyncOrig = _redisClient.setAsync;
            _redisClient.setAsync = async (...params) => {
                params[0] = redis_cache_key_prefx + params[0];
                return await _redisClient.setAsyncOrig(...params)
            }
            //
            _redisClient.delAsyncOrig = _redisClient.delAsync;
            _redisClient.delAsync = async (...params) => {
                params[0] = redis_cache_key_prefx + params[0];
                return await _redisClient.delAsyncOrig(...params)
            }
            //
            _redisClient.expireAsyncOrig = _redisClient.expireAsync;
            _redisClient.expireAsync = async (...params) => {
                params[0] = redis_cache_key_prefx + params[0];
                return await _redisClient.expireAsyncOrig(...params)
            }
            // Object.keys(_redisClient).forEach(function (modelName) {
            //     if(modelName.indexOf("Async")!==-1 && typeof _redisClient[`${modelName}Orig`] ==="function" && _redisClient[`${modelName}Orig`].length>0) {
            //         console.log(`${modelName} ------------------- ${typeof _redisClient[modelName]}`);
            //         _redisClient[`${modelName}Orig`] = _redisClient[modelName];
            //         _redisClient[modelName] = async (...params) => {
            //             let _newModelName = `${modelName}Orig`
            //             if (typeof params[0] === "string") {
            //                 params[0] = redis_cache_key_prefx + params[0];
            //             }
            //             return await _redisClient[_newModelName](...params)
            //         }
            //     }
            // });
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
        throw  `redis配置信息尚未设置（请调用setting_redisConfig）`
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
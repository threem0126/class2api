import redis from 'redis';
import Promise from 'bluebird';

let _redisClient;
let _redisConfig;

export const getGankaoWXAuthToken = async (gkwxauthtoken)=> {
    if(!_redisClient){
        setTimeout(function(){
            throw '_redisClient对象尚未初始化，请先引用 redisClient.js '
        })
    }
    return await _redisClient.getAsyncOrig(gkwxauthtoken)
}

export const setting_redisConfig = (redisConfig)=> {
    (() => {
        _redisConfig = redisConfig
        console.log(`setting_redisConfig done!`)
    })();
}

export const getting_redisConfig = async ()=>{
    return _redisConfig
}

export const getRedisClient = ()=> {
    if(!_redisConfig){
        throw  `redis配置信息尚未设置（请调用setting_redisConfig）`
    }
    if(_redisClient){
        return _redisClient
    }

    const {cache_prefx:redis_cache_key_prefx} = _redisConfig;
    _redisClient = redis.createClient({
        host: _redisConfig.host,
        port: _redisConfig.port
    })

    console.log(`链接Redis服务器 on ${_redisConfig.host}:${_redisConfig.port} ... ...`);
    _redisClient.on("error", async (err)=> {
        console.error("Error " + err);
    });

    let onAuthDone =async ()=> {
        console.log(`链接Redis服务器 on ${_redisConfig.host}:${_redisConfig.port} ... ...成功!`);
        //  this key will expires after 10 seconds
        const key = '__test_redis'
        // 测试
        await _redisClient.setAsync( key, JSON.stringify({hello: "world"}), 'EX', 10);
        console.log(`测试，创建 redis key:${key}`)
        let avalue = await _redisClient.getAsync(key);
        console.log(`测试，读取 redis key:${key},value:${avalue}`)
        let deleted = await _redisClient.delAsync(key)
        console.log(`测试，删除了redis key:${key},${deleted}`)
    }
    Promise.promisifyAll(_redisClient);

    try{
        _redisClient.getAsyncOrig = _redisClient.getAsync;
        _redisClient.getAsync=async (...params)=>{
            params[0] = redis_cache_key_prefx+params[0];
            return await _redisClient.getAsyncOrig(...params)
        }
        //
        _redisClient.setAsyncOrig = _redisClient.setAsync;
        _redisClient.setAsync=async (...params)=> {
            params[0] = redis_cache_key_prefx + params[0];
            return await _redisClient.setAsyncOrig(...params)
        }
        //
        _redisClient.delAsyncOrig = _redisClient.delAsync;
        _redisClient.delAsync=async (...params)=> {
            params[0] = redis_cache_key_prefx + params[0];
            return await _redisClient.delAsyncOrig(...params)
        }
        //
        _redisClient.expireAsyncOrig = _redisClient.expireAsync;
        _redisClient.expireAsync=async (...params)=> {
            params[0] = redis_cache_key_prefx + params[0];
            return await _redisClient.expireAsyncOrig(...params)
        }
    }catch(err) {
        console.error(`_redisClient异步Promise化遇到错误：${err}`)
    }

    _redisClient.on("connect",async (err)=> {

        console.log(`链接Redis服务器 on ${_redisConfig.host}:${_redisConfig.port} ... ...connecting ...`);
        //
        let {password} = _redisConfig
        if(password){
            _redisClient.auth(password, async (err,result)=>{
                await onAuthDone()
            })
        }else {
            await onAuthDone()
        }
    });
    return _redisClient
}

/***
 * 微信授权网关的保留方法，其他应用只可读取，严禁调用更新
 */
export const __setGankaoWXAuthToken = async (gkwxauthtoken, wxuserinfo)=> {
    await _redisClient.setAsyncOrig(gkwxauthtoken, wxuserinfo)
}
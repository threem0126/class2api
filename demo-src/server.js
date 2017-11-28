import _config from "./config.js" ;
import GKModelA from './model/GKModelA'
import {createServer,setting_redisConfig} from './../src/lib/class2api'
import {GKErrors} from './../src/lib/class2api/GKErrors'

let node_env = process.env.NODE_ENV || "development"
let port = 3002;
let {redis} = _config
setting_redisConfig(redis)

//创建微服务对象
createServer({
    config(){
        let {redis} = _config
        return {
            redis,
            apiroot: '/',
            cros:true
        }
    },

    // 将哪些类映射到API，可以定义路径别名
    modelClasses(){
        return [GKModelA, {model:GKModelA, as:'a2'}]
    },

    //在API方法执行前
    async beforeCall({req, params, modelSetting}){
        let {__needAuth} = modelSetting
        console.log(`beforeCall... [${ req.originalUrl }]:${( typeof __needAuth )}`)
        console.log('params:....' + JSON.stringify(params))
        //TODO: 这里可以对params进行装饰，比如根据header中的token信息来验证身份，最终注入用户uid信息
        if (!req.headers['jwtoken']) {
            throw GKErrors._SERVER_ERROR('访问者的身份无法识别')
        }
        return params
    },

    //在API方法执行完成之后拦截
    afterCall({req,res,result}){
        // let {err, result} = result
        console.log(`afterCall... [${ req.originalUrl }] ${ JSON.stringify(result) }`)
        return result
    },

    custom(){
        return {
            express(expressInstence){
                return expressInstence
            }
        }
    }
}).then((server)=>{
    //开始监听指定的端口
    server.listen(port, "0.0.0.0", function onStart(err) {
        if (err) {
            console.log(err);
        }
        console.info("==> 🌎 Listening on port %s." +
            "Open up http://0.0.0.0:%s/ in your browser.", port, port);
    });
}).catch((error)=>{
    setTimeout(function(){
        throw  error
    })
})



import _config from "./config.js" ;
import {createServer,setting_redisConfig} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import ClassA from './ClassA'
import GKModelA from './model/GKModelA'
import GKRuleManager from './model/GKRuleManager'
import GKAdmin_ModelA from './model_admin/GKAdmin_ModelA'

let node_env = process.env.NODE_ENV || "development"
let port = 3002;
let {redis} = _config
setting_redisConfig(redis)

//创建微服务对象
createServer({
    config:{
        redis,
        apiroot: '/',
        cros:true
    },

    // 将哪些类映射到API，可以定义路径别名
    modelClasses:[{model:ClassA,as:"a"}, GKModelA, {model:GKModelA, as:'a2'}, GKRuleManager, {model:GKAdmin_ModelA,as:"admin"}],

    //在API方法执行前
    async beforeCall({req, params, modelSetting}){
        let {__Auth} = modelSetting
        if(process.env.NODE_ENV === "development") {
            console.log(`beforeCall [${ req.originalUrl }]:....${( typeof __Auth )}`)
            console.log('params:....' + JSON.stringify(params))
            console.log('req.header:token....' + JSON.stringify(req.header('token')))
            console.log('req.header:jwtoken....' + JSON.stringify(req.header('jwtoken')))
            console.log('req.cookies:....' + JSON.stringify(req.cookies))
        }
        //根据类的__Auth配置来进行身份验证,具体的验证逻辑由类的修饰器配置决定，这里不进行类静态方法的权限认证
        if (__Auth) {
            let userInfo = await __Auth({req})
            params.uID = userInfo.uID
        }
        return params
    },

    //在API方法执行完成之后拦截
    afterCall({req,result}){
        // let {err, result} = result
        console.log(`afterCall... [${ req.originalUrl }] ${ JSON.stringify(result) }`)
        return result
    },

    custom:(expressInstence)=> {
        return expressInstence
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

import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import _config from "./config.js" ;
import GKModelA from './model/GKModelA'
import GKRuleManager from './model/GKRuleManager'
import GKAdmin_ModelA from './model_admin/GKAdmin_ModelA'
import {createServerInRouter,setting_redisConfig} from 'class2api'

// Security
let _server = express();
_server.disable("x-powered-by");
_server.use(bodyParser.urlencoded({extended: false}));
_server.use(bodyParser.json({limit: "5000kb"}));
_server.use(cookieParser());
_server.use(compression());

let port = 3002;
let {redis} = _config
setting_redisConfig(redis);

//创建微服务对象（路径route对象）
(async ()=>{
    _server.use(await createServerInRouter({
        config: {
            redis
        },
        //将哪些类映射到API，可以定义路径别名
        modelClasses:[GKModelA, {model:GKModelA, as:'a2'}, GKRuleManager, {model:GKAdmin_ModelA,as:"admin"}],
        //在API方法执行前拦截
        async beforeCall({req, params, modelSetting}){  let {__Auth} = modelSetting
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
        //在API方法执行后拦截
        async afterCall({req,res,result}){
            // let {err, result} = result
            console.log(`afterCall... [${ req.originalUrl }] ${ JSON.stringify(result) }`)
            return result
        }
    }));
})();

//开始监听指定的端口
_server.listen(port, "0.0.0.0", function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info("==> 🌎 Listening on port %s." +
        "Open up http://0.0.0.0:%s/ in your browser.", port, port);
});


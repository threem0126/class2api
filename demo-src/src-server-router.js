import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import _config from "./../config.js" ;
import ModelA from './ModelA'
import {createServerInRouter,GKErrors,setting_redisConfig} from './../src/class2api'

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
        config(){
            return {
                redis,
                apiroot: '/',
            }
        },
        //将哪些类映射到API，可以定义路径别名
        modelClasses(){
            return [ModelA, {model:ModelA, as:'a2'}]
        },
        //在API方法执行前拦截
        async beforeCall({req, params, modelSetting}){
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


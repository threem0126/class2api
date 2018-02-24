import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ClassA from './ClassA'
import {createServerInRouter} from 'class2api'

//Security
let _server = express();
_server.disable("x-powered-by");

//基本的Express配置
_server.use(bodyParser.urlencoded({extended: false}));
_server.use(bodyParser.json({limit: "5000kb"}));
_server.use(cookieParser());
_server.use(compression());

//创建微服务对象（路径route对象）
(async ()=>{
    _server.use(await createServerInRouter(ClassA));
})();

let port = 3002;
//开始监听指定的端口
_server.listen(port, "0.0.0.0", function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info("==> 🌎 Listening on port %s." +
        "Open up http://0.0.0.0:%s/ in your browser.", port, port);
});


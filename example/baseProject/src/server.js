import {createServer} from 'class2api'
import GKModelA from './model/GKModelA'
import path from 'path'
import express from 'express'

let node_env = process.env.NODE_ENV || "development"
let port = process.env.PORT || 3002;

//在API方法执行前
const beforeCall = async ({req, params, modelSetting})=> {
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
}

//在API方法执行后
const afterCall = async ({req,result})=> {
    // let {err, result} = result
    let {__user} = req
    if (__user) {
        result.__user = __user
    }
    console.log(`afterCall... [${ req.originalUrl }] result: ${ JSON.stringify(result) }`)
    return result
}


//创建微服务对象
createServer({
    config: {
        apiroot: '/',
        cros: true,
    },
    // 将哪些类映射到API，可以定义路径别名
    modelClasses:[GKModelA, {model:GKModelA, as:'a2'}],
    beforeCall,
    afterCall,
    custom:(expressInstence)=> {
        //定义静态资源路径，所有的静态类型文件都会转向这个位置
        let staticPath = path.join(__dirname, "./../static")
        console.log(`staticPath：${staticPath}`)
        expressInstence.use(express.static(staticPath))
        return expressInstence
    }
}).then((server)=>{

    //开始监听指定的端口
    server.listen(port, "0.0.0.0", function onStart(err) {
        if (err) {
            console.log(err);
        }
        console.info("==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.", port, port);
    });

}).catch((error)=>{
    setTimeout(()=>{throw  error})
})



import GKModelA from './model/GKModelA'
import * as types from './constants'
import {createServer,GKErrors} from 'class2api'

let node_env = process.env.NODE_ENV || "development"
let port = process.env.PORT || 3002;

//创建微服务对象
createServer({
    config: {
        apiroot: '/',
        cros: true,
    },
    // 将哪些类映射到API，可以定义路径别名
    modelClasses: [GKModelA, {model: GKModelA, as: 'a2'}],
    beforeCall,
    afterCall

}).then((server)=>{

    //开始监听指定的端口
    server.listen(port, "0.0.0.0", function onStart(err) {
        if (err) {
            console.log(err);
        }
        console.info("==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.", port, port);
    });

}).catch((error)=>{
    setTimeout(function(){
        throw  error
    })
})

//在API方法执行前
const beforeCall = async ({req, params, modelSetting})=> {
    let {__needAuth} = modelSetting
    console.log(`beforeCall... [${ req.originalUrl }]，params:....` + JSON.stringify(params))
    if (!req.headers['token'])
        throw GKErrors._SERVER_ERROR('访问者的身份无法识别')
    //let token = req.headers['token']
    let uid = 0;
    //TODO: 这里可以对params进行装饰，比如根据header中的token信息来验证身份，最终注入用户uid信息
    //...
    if (uid === 123) {
        //模拟一个身份信息不符的信息
        throw types.ERROR_USER_NOT_EXIST({uid: 123})
    }
    if (__needAuth && !__needAuth({uid})) {
        throw GKErrors._NOT_ACCESS_PERMISSION({uid: 123})
    }
    params.uid = 123456
    return params
}

//在API方法执行后
const afterCall = async ({req,res,result})=> {
    // let {err, result} = result
    let {__user} = req
    if (__user) {
        result.__user = __user
    }
    console.log(`afterCall... [${ req.originalUrl }] result: ${ JSON.stringify(result) }`)
    return result
}


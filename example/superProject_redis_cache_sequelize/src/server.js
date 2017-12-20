import _config from "./config.js" ;
import * as types from './constants'
import {createServer,setting_redisConfig} from 'class2api'
import {GKErrors} from 'class2api/gkerrors'
import GKModelA from './model/GKModelA';
import GKRuleManager from './model/GKRuleManager'
import GKAdmin_ModelA from './model_admin/GKAdmin_ModelA'

console.log(`global.config_path = ${global.config_path}`)
let {redis} = _config
setting_redisConfig(redis)

const beforeCall = async ({req, params, modelSetting})=> {
    let {__Auth} = modelSetting
    console.log(`beforeCall [${ req.originalUrl }]:....${( typeof __Auth )}`)
    console.log('params:....' + JSON.stringify(params))
    console.log('req.header:token....' + req.header('token'))
    console.log('req.header:jwtoken....' + req.header('jwtoken'))
    console.log('req.cookies:....' + JSON.stringify(req.cookies))

    //根据类的__Auth配置来进行身份验证,具体的验证逻辑由类的修饰器配置决定，这里不进行类静态方法的权限认证
    if (__Auth) {
        let userInfo;
        userInfo = await __Auth({req})
        params.uID = userInfo.uID
    }
    return params
}

const afterCall = async ({req,result})=> {
    let {__user} = req
    if (__user) {
        result.__user = __user
    }
    return result
}

//创建微服务对象
createServer({
    modelClasses:[GKModelA, {model:GKModelA, as:'a2'}, GKRuleManager, {model:GKAdmin_ModelA,as:"admin"}],
    beforeCall,
    afterCall,
    config:{
        redis,
        frontpage_default:_config.frontPage.site,
        cros:true,
        cros_headers:[]
    },
}).then((server)=>{
    //region 开始监听指定的端口
    let port = process.env.PORT || _config.PORT ||  8010;
    server.listen(port, "0.0.0.0",(err)=> {
        if (err)
            throw err
        console.info("==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.", port, port);
    });
    //endregion
}).catch((error)=> {
    setTimeout(function () {
        throw  error
    })
})

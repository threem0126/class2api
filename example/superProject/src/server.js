import _config from "./config.js" ;
import * as types from './constants'
import {createServer,GKErrors,setting_redisConfig, getRedisClient} from 'class2api'
import GKModelA from './model/GKModelA';
import Auth from './model_private/Auth';

console.log(`global.config_path = ${global.config_path}`)
let {redis} = _config
setting_redisConfig(redis)

//创建微服务对象
createServer({
    modelClasses:[GKModelA,{model:GKModelA,as:"a2"}],
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

const beforeCall = async ({req, params, modelSetting})=> {
    console.log(params.__frontpageURL)
    let {__needAuth} = modelSetting
    console.log(`beforeCall [${ req.originalUrl }]:....${( typeof __needAuth )}`)
    console.log('params:....' + JSON.stringify(params))

    console.log('req.header:....' + req.header('token'))
    console.log('req.cookies:....' + JSON.stringify(req.cookies))
    let token = req.header('token') || req.cookies.student||''
    console.log('token:....' + token)
    let {user_id, userInfo} = await Auth.parseUserInfoFromCookieToken({
        cookieToken:token
    });
    //判断当前redis中登录的用户，与cookie中的不一致。需要绕开redis缓存机制去重新获取信息
    let [user_id_incookie, _sigm, _] = token.split(',')
    if (user_id_incookie !== user_id) {
        let {user_id: user_id2, userInfo: userInfo2} = await Auth.parseUserInfoFromCookieToken({
            cookieToken: req.cookies.student || '',
            __nocache: true
        });
        user_id = user_id2
        userInfo = userInfo2
    }
    console.log('user_id:....' + token)

    //进入了需要身份验证的模块
    if (__needAuth) {
        if (user_id === 0)
            throw types.ERROR_NEED_LOGIN()
        let {schoolOwner} = await Auth.loadCurrentAdmin({uid: user_id})
        let {canAccess, resean} = await __needAuth({uid: user_id, schoolOwner})
        if (!canAccess) {
            throw types.ERROR_NO_PERMISSION({resean})
        }
        //通过权限认证，注入到params的用户信息中
        userInfo = {...userInfo, schoolOwner}
    }
    params.uid = user_id
    params.user = userInfo

    //region 用户信息摘要

    // {
    //     "user": {
    //     "id": "1096741",
    //         "nick_name": "",
    //         "mobile": "13918925582",
    //         "real_name": "",
    //         "user_type": "学生",
    //         "logo": "http://www.gankao.com/assets/site/2013/image/memberimg001.png",
    //         "userTypeId": 1
    // },
    //     "loginMode": [],
    //     "grades": [
    //     {
    //         "id": "1",
    //         "name": "一年级"
    //     },
    //      owner:{
    //      }
    // ]

    //endregion

    req.__user = userInfo
    return params
}

const afterCall = async ({req,res,result})=> {
    let {__user} = req
    if (__user) {
        result.__user = __user
    }
    return result
}
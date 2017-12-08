import {createServer} from 'class2api'
import ClassA from './ClassA'

//创建微服务对象
createServer({
    modelClasses: [{model: ClassA, as: 'a'}],
    beforeCall:async ({req, params, modelSetting})=>{
        return params
    }
}).then((server)=>{
    //开始监听指定的端口
    let port = 3002;
    server.listen(port, "0.0.0.0", function onStart(err){
        if (err) {
            console.log(err);
        }
        console.info("==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.", port, port);
    });
}).catch((error)=>{
    setTimeout(function(){throw error})
})
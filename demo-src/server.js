import {createServer} from '../bin/class2api'
import ClassA from './ClassA'

let port = 3002;

//创建微服务对象
createServer(ClassA).then((server)=>{
    server.listen(3002, "0.0.0.0", (err)=>{
        if (err) {console.error(err)}
        console.info("==> API Started, test for $ curl -d 'name=huangyong' 'http://127.0.0.1:%s/ClassA/hello'.", port);
    });
})

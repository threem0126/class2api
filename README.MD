#概要#
- class2api帮助你把Javascript Class类的静态方法自动向外映射为API接口的微型框架，借助class2api，你可以在1分钟之内直接开始着手于业务逻辑代码的编写，而将路由、方法缓存、网络通讯等事务交给我们处理
- class2api暴露的API接口仅以post方式提供请求服务（注意：不支持get等其他方式！）
- 作为微服务，使用内置Express时，class2api不开启sessin。注：当使用createServerInRouter挂载到现有的Express应用下时，可以使用宿主Express应用的session机制


#上手向导#

- 快速安装依赖组建
```
$ npm i 
或
$ npm i --registry=https://registry.npm.taobao.org 
```

- 基于源码版本运行Demo应用(Server版本)
```
$ npm run start:src 
```

- 基于源码版本运行Demo应用(ExpressRouter路由版本)
```
$ npm run start:srcrouter
```

- 运行单元测试（先运行Demo应用）
```
$ mocha test/test.run
```

#快速创建应用的代码#

## 创建一个业务类ClassA.js
```javascript
    class ClassA {
        static async hello({name}) {
            return {message: `this is a message from Api: got name [${name}]`}
        }
    } 
    export default ClassA
```

## 创建微微服务
```javascript
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
```


# 导出功能函数：

## class2api空间
- createServer(opts)
创建服务器(使用内建的独立Express实例) ,opts为参数项，具体如下：
```javascript
    createServer({
        config:{
           apiroot:'/',//挂载微服务的根路径，如：apiroot设置为'apiv1"，则业务类ClassA的method1方法对应的访问入口为: http://yourdomain/apiv1/classa/method1
           redis,//内置API方法缓存所使用的redis实例配置参数，使用clearCache、cacheAble修饰器时必须
           cros:true,//是否允许跨域访问
           cros_headers:[],//允许跨域访问时的headers白名单
           cros_origin:[],//允许跨域访问时的授权源配置，默认为*。当传入有效的cros_origin参数时，以cros_origin中指定的为准
           frontpage_default: '' //放在API方法内部获取前端的域名，与从前端请求传过来header中的frontpage合并，优先获取客户端的，其实采用此默认值。最后封装为标准url对象并绑定到API方法回调的params对象的___frontpageURL属性上
        }, 
        custom:(expressInstence)=>{
            //TODO:对expressInstence实例进行自定义扩展，注：不建议增加session机制
            return expressInstence
        },
        modelClasses, //映射的业务类列表，如:[ClassA, {model:XXX,as:'abc'}]，建议以mode-as的方式修改业务类暴露的访问路径，以隐藏实际的类命名（建议）
        beforeCall, //API接口请求之前的拦截事件，可以修改、监听post信息，以及身份的验证判断
        afterCall, //API接口请求完成后的拦截事件，可以修改、监听返回结果，典型场景就是记录请求的日志
        method404//自定义的express的路由中间件，在404场景时，可输出自己定制的返回值
    })
```

- createServerInRouter(opts)
创建服务器(使用外部的Express，只返回router供绑定路由)，opts参数与createServer函数基本相同，除了自动忽略custom参数

- setting_redisConfig
设置内置redis的连接参数，因为考虑到import声明自动提前的问题，为确保其他自定义业务类内部初始化时依赖redis实例的场景。建议的，最佳方法是定义个独立的init.js，并在server.js顶部第一行引用
```javascript
//init.js
import {setting_redisConfig} from 'class2api'
setting_redisConfig({
                        host: "127.0.0.1",
                        port: 6379,
                        cache_prefx:'dev_class2api_',//必须的参数，且针对每个应用不同配置，以避免各应用之间发生key碰撞与覆盖
                        defaultExpireSecond:10*60   //可缺省，class2api内部的默认混存时长为1分钟，可自定义
                    })
```

- getRedisClient
获得redis访问实例

- GKErrorWrap 
错误包装器，当预设错误类型不够用时，可自定义。注：class2api内置的常设错误的code为负数领域，外部自定义的错误，请务必使用正数

- modelSetting 
修饰器，类模块的元信息配置类
```javascript
    @modelSetting({
        __Auth:async ({req})=>{
            //后台的用户验证，解析header中的jwtoken信息，调用class2api/rulehelper的解析，注意与非后台常规用户验证的区别
            let jwtoken = req.header('jwtoken') || ''
            return await parseAdminAccountFromJWToken({jwtoken})
        },
        //后台权限认证的组信息
        __ruleCategory: {
            name: '文章系统',
            desc: '文章系统'
        }
    })
    class GKModelA {
        constructor() {
            throw '静态业务功能类无法实例化'
        }
    }
```

- cacheAble    
修饰器,启用类方法调用缓存的修饰器

- clearCache   
修饰器,清空类方法调用缓存的修时器

- accessRule   
修饰器,提供访问权限的校验控制,可独立配置认证函数
- setting_RuleValidator  accessRule访问权限修饰器中认证函数的全局配置入口
- crashAfterMe  修饰器,运行完类方法就认为跑出异常中断程序，调试用，生产环境下自动失效

class2api/gkerrors
- GKErrors  常用预设的错误（code为负数）

class2api/dbhelper
- TableSetting  sequelizeModel定义model时的扩展配置
- ResetDB   重置数据库
- DBModelLoader 加载Model定义文件
- DBUtils   数据库的辅助工具方法
- fn        sequezeli的聚合函数引用
- col       sequezeli的列引用函数
- literal   sql语句字面量包装函数，确保sequelize不解析此SQL字符串
- where     sequezeli的where引用函数
- createTransaction 创建一个sequezeli事务
- excuteSQL 执行指定的SQL语句，一般适用于无法用sequelize表达式的复杂查询

class2api/testhelper
- setApiRoot    微服务API的domain
- WebInvokeHepler(usertoken)(apiPath, postParams, apiDesc)      向api发起一个post-API请求， postParams是post的JSON内容，apiDesc是API方法描述的函数封装（只是提高可读性，没有实际功能意义）
- ApiDesc       API方法描述的函数封装，只是提高在真实入参列表中的可读性，没有实际功能意义
- save2Doc      保存本次mocha用例中所有提供了ApiDesc参数的API请求的入参与返回结果


$ npm publish --registry=http://registry.npmjs.org  --  




# 概要
- class2api帮助你把Javascript Class类的静态方法自动向外映射为API接口的微型框架，借助class2api，你可以在1分钟之内直接开始着手于业务逻辑代码的编写，而将路由、方法缓存、网络通讯等事务交给我们处理
- class2api暴露的API接口仅以post方式提供请求服务（注意：不支持get等其他方式！）
- 作为微服务，使用内置Express时，class2api不开启sessin。注：当使用createServerInRouter挂载到现有的Express应用下时，可以使用宿主Express应用的session机制


# 快速运行Demo向导

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

# 快速创建应用的代码

## 创建一个业务类ClassA.js
```javascript
    //ClassA.js
    class ClassA {
        static async hello({name}) {
            return {message: `this is a message from Api: got name [${name}]`}
        }
    } 
    export default ClassA
```

## 极速创建微服务
```javascript
    //server.js
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

# 业务类的约定与最佳实践：
- 类名需为命名类，不能匿名
- 业务静态类，不能拥有实例方法（也没有需求场景），所以请参考官方代码，在构造器中throw异常，以确保业务静态类不会被实例化
- 类静态方法实现各业务逻辑
- 类静态方法只有一个形参，并以ES6对象解构的方式书写，调用代码可以获得命名参数形式的可读性益处
- 类静态方法的参数（首个参数）中，框架还注入了几个属性，req：当前的请求信息对象，express的标准request，供方法内部读取；uID：用户的唯一编码，当modelSetting修饰器中指定的身份验证函数（__Auth）运行通过时出现；__nocache：调用方传入的特殊指令，当__nocache有值时，cacheAble修饰器内部会在本次请求中忽略cacheAble缓存策略，继续运行方法。
- 为了增加API返回数据值的可扩展能力，类静态方法的返回值必须用对象形式，不能使用字符串、整数、浮点、布尔等简单值类型。
- 某些场景，只需要API返回操作是否成功的信息，可以使用内置的GKSUCCESS(props)函数，它封装一个简单结构{success: true,...props}，其中props参数是附加信息，当props是对象是，自动扩展到结构里，当props是非对象时，以msg属性扩展到结构里
```javascript
    import {GKSUCCESS} from 'class2api'
    class ClassA {
        constructor() {
            throw '静态业务功能类无法实例化'
        }
        static async hello({name}) {
            return {message: `this is a message from Api: got name [${name}]`}
        }
        static async deleteArticle({name}) {
            return GKSUCCESS()
        }
    }
    export default ClassA
```

# 导出功能函数

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
获得redis访问实例，以进行直接读取操作
```javascript
    let cache = getRedisClient()
    cache.set('keyABC','this is message!', (err,data)=>{})
    await cache.setAsync('keyABC','this is message!')
```

- GKErrorWrap
错误包装器，以快速以下结构的错误信息：
```javascript
return {
           _gankao: 1,//固定标志位，以区别普通的error对象
           code: errCode,//错误码，内置错误类型为负数，通过GKErrorWrap自定义的code请务必为正数
           message: `...`,//错误信息
           more: ''//详细的错误信息
       }
``` 

- modelSetting(props)
类修饰器，将传入的props对象赋值到 Class.__modelSetting 上，目前class2api内部约定的porps属性有：
__Auth:Function，与业务类相关的身份验证函数，内部进行身份判断，并返回带有uID的用户信息对象
__ruleCategory:{name,desc}，
```javascript
    @modelSetting({
        __Auth:async ({req})=>{
            //后台的用户验证，解析header中的jwtoken信息，调用class2api/rulehelper的解析，注意与非后台常规用户验证的区别
            let jwtoken = req.header('jwtoken') || ''
            return await parseAdminAccountFromJWToken({jwtoken})
        }
    })
    class GKModelA {
        constructor() {
            throw '静态业务功能类无法实例化'
        }
    }
```

- cacheAble({cacheKeyGene:()=>{}})     
类静态方法修饰器,对修饰的API方法的调用结果进行缓存，缓存的key由cacheKeyGene函数运行时动态返回指定
```javascript
    class GKModelA {
    
        @cacheAble({
            cacheKeyGene: (args) => {
                let {name} = args[0]
                return `getArticle-${name}`
            }
        })
        static async getArticle({uID, name}) { 
            return {message: `getArticle.${name}，from user. ${uID}`}
        }
    }
```

- clearCache({cacheKeyGene:()=>{}}) 
类静态方法修饰器, 实现在API请求完成之后清空指定key的缓存，删除的key由cacheKeyGene函数运行时动态返回指定；如果需要清除多个key，可以用反转控制的方式，交给类静态方法内部来处理，当cacheKeyGene函数返回''空字符串，会开启反转控制模式，修饰器内部会在类静态方法的第一个调用参数（按约定，类静态方法使用第一个复合对象获取所有的参数）中增加__cacheManage属性，__cacheManage是一个轻量cache访问器，提供get(akey)、set(akey, avalue, expireTimeSeconds)、delete(akey)三个方法。
```javascript

    //常规的控制方式
    class GKModelA {
        @clearCache({
            cacheKeyGene: (args) => {
                let {aID} = args[0]
                return `article-${aID}`
            }
        })
        static async deleteArticle({aID}) {
            //...
            return GKSUCCESS()
        }
    }
    
    //需要清除多个关联key时，可使用反转控制机制
    class GKModelA {
        @clearCache({
            cacheKeyGene: (args) => { 
                return ''
            }
        })
        static async deleteArticle({aID, __cacheManage}) {
            //...
            if(__cacheManage){
                await __cacheManage.delete(`article-${aID}`) //删除文章缓存
                await __cacheManage.delete(`articleCategory-1`) //删除文章类别的缓存
            }
            return GKSUCCESS()
        }
    }
    
```

- accessRule   
修饰器,提供访问权限的校验
运行原理：修饰器内部会拦截惊雷
```javascript
    class GKModelA {
        constructor() {
            throw '静态业务功能类无法实例化'
        }
     
        @accessRule({ruleName: '删除文章', ruleDescript: '对文章进行删除'})
        static async deleteArticle({aID}) {
            //...
            return GKSUCCESS()
        }
    }
```
- crashAfterMe(hintMsg)  修饰器,运行完类方法就认为跑出异常中断程序，调试用，生产环境下自动失效


## class2api/gkerrors
- GKErrors  常用预设的错误（code值为负数）
```javascript
    import {GKErrors} from 'class2api/gkerrors'
    //内置的错误信息有：
    GKErrors._TOKEN_PARSE_FAIL      //token解析失败 
    GKErrors._RULE_VALIDATE_ERROR   //权限认证过程中发生异常
    GKErrors._TOKEN_LOGIN_INVALID   //请先登录
    GKErrors._NOT_ACCESS_PERMISSION //无访问权限
    GKErrors._NOT_SERVICE       //功能即将实现
    GKErrors._PARAMS_VALUE_EXPECT//参数不符合预期
    GKErrors._NO_RESULT         //无匹配结果
    GKErrors._SERVER_ERROR      //服务发生异常
    GKErrors._NOT_PARAMS        //缺少参数
```

##class2api/dbhelper
sequelize模型创建与管理的助手函数空间，可参考项目中的tableloader.js示例文件

- TableSetting  
sequelizeModel定义model时的几个扩展设置，包括：
1、TableSetting.tabelOption，model的几个默认设置，paranoid默认为true，时间相关字段名定义为created_at、updated_at、deleted_at，字符集collate为utf8_general_ci
2、TableSetting.extendDateTimeVirtualFields设置，为时间字段扩展可读性的时间格式化虚字段

- ResetDB   
重置数据库，即执行sequelize.sync({force: (process.env.FORCE=="1")})，内部有启动环境变量的校验，只有当传入的启动环境变量与config中mysql.reset_key的{key1,key2}相符时才执行。默认为软重置，可以通过传入FORCE=1的启动环境变量来强制重置

- DBModelLoader 
加载Model定义文件, 参考示例项目中的tableloader.js文件，代码段：
```javascript
    import {DBModelLoader} from 'class2api/dbhelper'
    import _config from './config'
    import DemoUser from './tables/DemoUser'
    
    //模型定义，在aloader.init内部会动态加载指定的定位文件，替换为真实的object的value值
    export const DataModel = {
        DemoUser: DBModelLoader.define(DemoUser),
    }
    //绑定模型关系时，可能需要定义的别名
    export const ass = {
        subComment: "subComment",
        replyToUser: "replyToUser"
    }
    (async()=>{
        await DBModelLoader.INIT(_config.mysql, {model:DataModel, ass})
    })();
```
  
- DBUtils   
数据库的辅助工具方法：
DBUtils.dumpModelFuns(sequelizeModelClass)  打印指定模型类上的sequelize扩展的，操作自身数据实例的、以及操作关联对象的各类函数方法

- fn:Function        
sequezeli的聚合函数引用

- col:Function       
sequezeli的列函数的引用

- literal:Function   
sql语句字面量包装函数，确保sequelize不解析此SQL字符串

- where:Function     
sequezeli的where函数的引用

- createTransaction:Function
创建一个sequezeli事务

- excuteSQL(sql,[replaceparam1,replaceparam2,...]) 
执行指定的SQL语句，一般适用于无法用sequelize表达式的复杂查询

## class2api/testhelper
测试辅助函数库，为了接近真实环境，以及确保接口调用的全流程，class2api的单元测试原则上都以http调用的方式执行，而避免用类调用。
注：当需要测试业务功能类本身时，还是可以在业务类层面直接调用，以避开微服务框架以及http通讯的干扰

- setApiRoot    微服务API的domain
- WebInvokeHepler(usertoken)(apiPath, postParams, apiDesc)      向api发起一个post-API请求， postParams是post的JSON内容，apiDesc是API方法描述的函数封装（只是提高可读性，没有实际功能意义）
- ApiDesc       API方法描述的函数封装，只是提高在真实入参列表中的可读性，没有实际功能意义
- save2Doc      保存本次mocha用例中所有提供了ApiDesc参数的API请求的入参与返回结果
```javascript
    //最小化案例 
    import {ApiDesc, WebInvokeHepler, setApiRoot, save2Doc} from 'class2api/testhelper'
    
    let _run = {
        accounts: {
            user1: {
                token: 'token-111'
            }
        }
    };
    //通过setApiRoot，除了本地开发环境，还可以调用测试环境、正式环境的接口，这会带来极大的线上排查与校验的便利性
    const remote_api = process.env.ONLINE==='1'? `https://comment_api_test.gankao.com`
        :(process.env.ONLINE==='2'? `https://comment_api.gankao.com`
            :`http://127.0.0.1:3002`);
    //配置远程请求endpoint
    setApiRoot(remote_api);
    
    describe('评论系统', function () {
     
        after(function () {
            save2Doc({save2File:'api.MD'})
        }); 
    
        it('/a/hello', async () => {
            let response = await WebInvokeHepler(_run.accounts.user1)('/a/hello',
                {name: "haungyong"},
                ApiDesc(`hello测试方法`)
            )
            let {err, result} = response
            let {message} = result
            message.lastIndexOf('haungyong').should.be.above(-1)
        }) 
    
    })
    
    

```


$ npm publish --registry=http://registry.npmjs.org  --  




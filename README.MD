# 概要
- class2api帮助你把Javascript Class类的静态方法自动向外映射为API接口的微型框架，借助class2api，你可以在1分钟之内直接开始着手于业务逻辑代码的编写，而将路由、方法缓存、网络通讯等事务交给我们处理
- class2api暴露的API接口仅以post方式提供请求服务（注意：不支持get等其他方式！）
- 作为微服务，使用内置Express时，class2api不开启sessin。（注：当使用createServerInRouter挂载到现有的Express应用下时，可以使用宿主Express实例的session机制）

# 推荐Class2api的理由：
- 目前还没有一套开源的流行的、将业务类映射为API输出的框架
- 基于Express（添加了很薄的一层路径映射），内核稳定、插件生态丰富
- 省去了繁琐的项目环境配置，ES6、Babel等
- 让团队专注于业务类的逻辑实现
- Sequelize代码模版
- 内置缓存服务，支持缓存API方法输出的结果，并可反向控制
- 后续将扩展支持其他更高性能webServer框架

# 快速创建应用的代码，提供三种脚手架

## base：
``` 
$ class2api.js init 
```

根据提示输入
``` 
$ class2api.js i
选择哪种脚手架模版？（base/normal/super）: base
给创建的新项目取个名字: teasdf 

 远程提取模版文件 ...

 √ 创建成功!

 开始体验:

 cd teasdf && npm install && npm start
 
```

最终：
``` 
$ curl -d 'name=huangyong' 'http://127.0.0.1:3002/a/hello'
```
 

# 业务静态类的编写约定与最佳实践：
- 类名需为命名类，不能匿名
- 业务静态类，不能拥有实例方法（通常其实也没有需求和场景），所以请参考官方代码，在构造器中throw异常，以确保业务静态类不会被实例化
- 类静态方法实现各业务逻辑，一个方法对应一个业务逻辑
- 类静态方法只有一个形参，并以ES6对象解构的方式书写，调用代码可以获得命名参数形式的可读性益处
- 类静态方法的参数（首个参数）中，框架还注入了几个属性：**req**：当前的请求信息对象，express的标准request，供方法内部读取；**uID**：用户的唯一编码，当modelSetting修饰器中指定的身份验证函数（__Auth）运行通过时出现；**__nocache**：调用方传入的特殊指令，当__nocache有值时，cacheAble修饰器内部会在本次请求中忽略cacheAble缓存策略，继续运行方法。
- 为了增加API返回数据值的可扩展能力，类静态方法的返回值必须用对象形式，不能使用字符串、整数、浮点、布尔等简单值类型。
- 某些场景，只需要API返回操作是否成功的信息，可以使用内置的GKSUCCESS([props])函数，它封装一个简单结构{success: true,...props}，其中props参数是附加信息，当props是对象时，自动扩展到结构里，当props是非对象时，以msg属性扩展到结构里
```javascript
    import {GKSUCCESS} from 'class2api.js'
    class ClassA {
        constructor() {
            throw '静态业务功能类无法实例化'
        }
        static async hello({name}) {
            return {message: `this is a message from Api: got name [${name}]`}
        }
        static async deleteArticle({name}) {
            //TODO:...删除文章的操作
            return GKSUCCESS()
        }
    }
    export default ClassA
```

# 接口返回值的默认结构、反向定制
class2api对所有请求的返回数据结构，统一为：
```javascript
{  
    err,
    result
}
```
其中err代表内部异常或错误，凡是GKErrors和GKErrorWrap result抛出的错误都会捕捉err ，而result保存的是业务类静态方法的执行返回结果，且约定为必须为对象结构，不能是数字、字符串、布尔值等简单数据类型

*特殊情况：如果你的系统有特殊原因，需要接口返回自定义的数据结构，可以使用以下方式来控制反转：
```javascript
    class ClassB {
        constructor() {
            throw '静态业务功能类无法实例化'
        }
        static async customResponseResultStruck() {
            //TODO:.....
    
            //class2api内部约定，如API方法返回的是Function，则框架会调用函数并把其运行结果返回给客户端，以实现自定义特殊的response结构
            return () => {
                return {data: {name: 'huangyong'}, errorCode: 123}
            }
        }
    }
```

# 启动环境变量控制  
- $ process.env.NO_API_CACHE=1  强制关闭静态类的API调用缓存，使cacheAble、clearCache失效
- $ process.env.SQL_PRINT=1     开启sequelize的SQL执行日志的打印
- $ process.env.PRINT_API_RESULT=1     开启API方法执行的结果日志打印

# api路径嵌套，以及跨域授权配置
```javascript
    //创建微服务对象
    createServer({
        config:{
            apiroot: '/api_v2',//如需要时，可以指定API服务的起始路径，特别是在映射路径的方式中
            cros:true,
            cros_headers:['customHeader'], 
            cros_origin:['http://web.domain.com'], 
        },
        //... 
    }) 
```
cros_origin:[*****]

# 组件提供的功能函数
！！！！！前方高能，文档导航结构尚需优化，建议分段阅读！！！！！

## 空间列表
- class2api.js             主空间，提供微服务创建、缓存修饰器、redis配置/访问等基础套件
- class2api.js/dbhelper    sequelize模型创建与管理的助手函数空间，可简化model的声明与引用
- class2api.js/rulehelper  管理后台专用的身份检验、权限校验
- class2api.js/testhelper  测试相关的辅助套件，快速执行基于http接口调用的单元测试，以及收集单元测试的请求与结果json快照，并在mocha的after拦截中保存到指定文件，以作为文档参考
- class2api.js/gkerrors    常用的预设错误类型

## class2api.js    主空间
- createServer(opts)
创建服务器(使用内建的独立Express实例) ,opts为参数项，具体如下：
```javascript
    createServer({
        config:{
           apiroot:'/', //[可选]，挂载微服务的根路径，如：apiroot设置为'apiv1"，则业务类ClassA的method1方法对应的访问入口为: http://yourdomain/apiv1/classa/method1
           redis,       //[可选]，内置API方法缓存所使用的redis实例配置参数，使用clearCache、cacheAble修饰器时必须
           cros:true,   //[可选]，是否允许跨域访问
           cros_headers:[], //[可选]，允许跨域访问时的headers白名单
           cros_origin:[],  //[可选]，允许跨域访问时的授权源配置，默认为*。当传入有效的cros_origin参数时，以cros_origin中指定的为准
           frontpage_default: ''    //[可选]，放在API方法内部获取前端的域名，与从前端请求传过来header中的frontpage合并，优先获取客户端的，其实采用此默认值。最后封装为标准url对象并绑定到API方法回调的params对象的___frontpageURL属性上
        }, 
        modelClasses,   //必需，映射的业务类列表，如:[ClassA, {model:XXX,as:'abc'}]，建议以mode-as的方式修改业务类暴露的访问路径，以隐藏实际的类命名（建议）
        beforeCall,     //[可选]，API接口请求之前的拦截事件，可以修改、监听post信息，以及身份的验证判断
        afterCall,  //[可选]，API接口请求完成后的拦截事件，可以修改、监听返回结果，典型场景就是记录请求的日志
        custom:(expressInstence)=>{ 
            return expressInstence
        },          //[可选]，对expressInstence实例进行自定义扩展，注：微服务通常是无状态的，所以不建议增加session机制
        method404       //[可选]，自定义的express的路由中间件，在404场景时，可输出自己定制的返回值
    })
```

- createServerInRouter(opts)
创建服务器(使用外部的Express，只返回router供绑定路由)，opts参数与createServer函数基本相同，除了自动忽略custom参数。可参考项目中的demo-src/server-router.js源码

- setting_redisConfig
设置内置redis的连接参数，因为考虑到import声明自动提前的问题，为确保其他自定义业务类内部初始化时依赖redis实例的场景。建议的，最佳方法是定义个独立的init.js，并在server.js顶部第一行引用
```javascript
//init.js
import {setting_redisConfig} from 'class2api.js'
setting_redisConfig({
    host: "127.0.0.1",
    port: 6379,
    cache_prefx:'dev_class2api_',//必须的参数，且针对每个应用不同配置，以避免各应用之间发生key碰撞与覆盖
    defaultExpireSecond:10*60   //可缺省，class2api内部的默认混存时长为1分钟，可自定义
})
```

- getRedisClient
获得redis访问实例，以进行直接读取操作。注：读写时，在redis中实际存取的key会携带redis配置中cache_prefx属性定义的前缀
```javascript
    let cache = getRedisClient()
    cache.set('keyABC','this is message!', (err,data)=>{})
    await cache.setAsync('keyABC','this is message!')
```

- GKErrorWrap
错误包装器，以快速创建以下约定结构的错误信息：
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
**__Auth**:Function，与业务类相关的身份验证函数，内部进行身份判断，并返回带有uID的用户信息对象
**__ruleCategory**:{name//权限组名称,desc//权限组的备注描述}，
```javascript
    import {parseAdminAccountFromJWToken} from "class2api.js/rulehelper";
    @modelSetting({
        __Auth:async ({req})=>{
            //后台的用户验证，解析header中的jwtoken信息，调用class2api/rulehelper的解析，注意与非后台常规用户验证的区别
            let jwtoken = req.header('jwtoken') || ''
            return await parseAdminAccountFromJWToken({jwtoken})
        },
        __ruleCategory:{
            name:"文章管理",
            desc:"对文章进行新建、编辑、删除等操作"
        }
    })
    class ArticleManager {
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
            cacheKeyGene: ({name}) => {
                return `getArticle-${name}`
            }
        })
        static async getArticle({uID, name}) { 
            return {message: `getArticle.${name}，from user. ${uID}`}
        }
    }
```
*Q：如何判断某次API请求的结果是命中了缓存？*
A：命中了缓存的调用，在其请求的返回结果中，带有__fromCache=1属性，如：
```javascript
{
    err:null,
    result:{
        name:'huangyong',
        __fromCache:1 //额外的输出标记
    }
}
```

*Q：如果需要在某次调用接口时强制禁用（绕过）API缓存机制？*
A：传入__nocache=1参数，组件内部即会判断并绕过缓存，示例如：
```javascript
        let options = {
            uri: remote_api,  
            body: {
                fID:123,
                __nocache:1
            },
            json: true, 
        }
        let {body} = await request.postAsync(options)
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

- crashAfterMe(hintMsg)  修饰器,运行完类方法就人为抛出异常中断程序，调试用，生产环境下自动失效

## class2api.js/gkerrors   常用预设的错误（code值为负数）
- GKErrors  预设错误有：
```javascript
    import {GKErrors} from 'class2api.js/gkerrors' 
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

## class2api.js/dbhelper
sequelize模型创建与管理的助手函数空间，可参考项目中的tableloader.js示例文件

- TableSetting  
sequelizeModel定义model时的几个扩展设置，包括：
1、TableSetting.tabelOption设置，含model的几个默认设置，paranoid默认为true，时间相关字段名定义为created_at、updated_at、deleted_at，字符集collate为utf8_general_ci
2、TableSetting.extendDateTimeVirtualFields(DataTypes, [customfields])设置，为时间字段扩展出可读性强的时间格式化后的虚字段，名称约定为'*****_display'，设置内默认为created_at、updated_at扩展，第二个[customfields]参数追加需要扩展格式化的自定义时间字段
```javascript
    //DemoUser.js
    import {TableSetting} from 'class2api.js/dbhelper';
    
    export default (sequelize, DataTypes)=> {
        const User = sequelize.define('demouser', {
            name: {type: DataTypes.STRING, allowNull: false, defaultValue: '', comment: `用户的姓名`},
            birthday: {type: DataTypes.DATE},
            ...TableSetting.extendDateTimeVirtualFields(DataTypes, ['birthday'])
        }, {
            ...TableSetting.tabelOption,
            classMethods: {
                associate: function (DataModel, ass) {
                    //User.belongsTo(DataModel.Student)
                }
            },
            comment: '学生信息'
        });
        return User;
    }
```
- ResetDB   
重置数据库，即执行sequelize.sync({force: (process.env.FORCE=="1")})，内部有启动环境变量的校验，只有当传入的启动环境变量与config中mysql.reset_key的{key1,key2}相符时才执行。默认为软重置，可以通过传入FORCE=1的启动环境变量来强制重置

- DBModelLoader 
加载Model定义文件, 参考示例项目中的tableloader.js文件，代码段：
```javascript
    import {DBModelLoader} from 'class2api.js/dbhelper'
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
DBUtils.dumpModelFuns(sequelizeModelClass)  打印指定模型类上的sequelize扩展的操作自身数据实例的、以及操作关联对象的各类函数方法

- fn:Function        
sequezeli的聚合函数引用

- col:Function       
sequezeli的列函数引用

- literal:Function   
sql语句字面量包装函数，确保sequelize不解析此SQL字符串

- where:Function     
sequezeli的where函数的引用

- createTransaction:Function
创建一个sequezeli事务

- excuteSQL(sql,[replaceparam1,replaceparam2,...]) 
执行指定的SQL语句，一般适用于无法用sequelize表达式的复杂查询或更新操作

## class2api.js/rulehelper
适用于后台管理系统的身份检验、权限校验的辅助函数库

- accessRule({ruleName, ruleDesc})
类静态方法修饰器,提供后台级的权限校验，同时为当前修饰的类静态方法标记了权限名称、描述信息。
运行原理：修饰器内部会拦截类静态方法的调用，并先向权限中心进行身份验证，以判断是否有权限继续运行对应的方法。
权限中心为远程服务，在class2api.config.js配置中定义相关信息：
```javascript
exports.config = { 
    name: 'courseService', 
    admin_rule_center: { 
        auth:"http://127.0.0.1:3002/gkrulemanager/auth", //管理用户的身份验证接口
        validator: "http://127.0.0.1:3002/gkrulemanager/validate",  //管理用户对指定权限的验证接口
        register: "http://127.0.0.1:3002/gkrulemanager/register" //权限配置表的上传注册接口，在IDE环境下使用
    }
}
```
修饰器向权限中心的权限校验接口(config.admin_rule_center.validator)提交以下参数信息：
1、jwtoken：jsonwebtoken版的管理员身份签名，从req参数中提取，并在header中发送，权限中心会识别解密jwtoken，从而分辨身份并校验权限
2、categoryName：权限组名称，从modelSetting修饰器的配置信息中获得
3、categoryDesc：权限组的描述信息，从modelSetting修饰器的配置信息中获得
4、ruleName：权限名称，从accessRule修饰器函数的参数中获得
5、ruleDesc：权限的描述信息，从accessRule修饰器函数的参数中获得
6、codePath：代码路径，格式如:ClassA.methodA，在框架内部获得
7、sysName：调用方系统名称，在class2api.config.js中配置
```javascript
    class GKModelA {
        constructor() {
            throw '静态业务功能类无法实例化'
        }
     
        @accessRule({ruleName: '删除文章', ruleDesc: '对文章进行删除'})
        static async deleteArticle({aID}) {
            //...
            return GKSUCCESS()
        }
    }
```

- parseAdminAccountFromJWToken({jwtoken})
class2api内置的管理员身份校验函数，函数内将jwtoken参数会以header的方式发送给class2api.config.js中指定的config.admin_rule_center.auth接口，auth接口端返回详细的用户信息（按约定，用户信息中含有标识唯一的uID属性）

## class2api.js/testhelper
测试辅助函数库，为了接近真实环境，以及确保接口调用的全流程，class2api的单元测试原则上都以http调用的方式执行，而避免用类调用。
注：当需要测试业务功能类本身时，还是可以在业务类层面直接调用，以避开微服务框架以及http通讯的干扰

- setApiRoot    设定微服务API的domain，在WebInvokeHepler内部需要使用
- WebInvokeHepler(usertoken)(apiPath, postParams, [apiDesc])      
向api发起一个post-API请求， postParams是post的JSON内容，apiDesc是API方法描述的函数封装（只是提高可读性，没有实际功能意义），声明了apiDesc的调用的请求的post与res结果数据，将被内部缓存，供save2Doc使用保存输出
- ApiDesc       API方法描述的函数封装，只是提高在真实入参列表中的可读性，没有实际功能意义
- save2Doc      保存本次mocha用例中所有提供了ApiDesc参数的API请求的post入参与res返回结果
```javascript
    //testhelper的最小化案例 
    import {ApiDesc, WebInvokeHepler, setApiRoot, save2Doc} from 'class2api.js/testhelper'
    
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




#概要#
- class2api帮助你把Javascript Class类的静态方法自动向外映射为API接口的微型框架，借助class2api，你可以在1分钟之内直接开始着手于业务逻辑代码的编写，而将路由、方法缓存、网络通讯等事务交给我们处理
- class2api以暴露的API接口必须以post方式请求，不支持get方式

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

- 基础Curl测试调用（先运行Demo应用）
```
$ mocha test/test.run
```

#快速创建应用的代码#
- 节选代码，来自 example/baseProject 范例项目
```javascript
    import {createServer} from 'class2api'
    import {GKErrors} from 'class2api/gkerrors'

    //创建微服务对象
    createServer({
        config: {
            apiroot: '/',
            cros: true,
        }, 
        //将哪些类映射到API，默认取类名称的小写字符，也可以定义路径的别名
        modelClasses: [ClassA, {model: ClassB, as: 'b'}], 
        beforeCall:async ({req, params, modelSetting})=>{ 
            let {__Auth} = modelSetting
            //Api处理之前，在这里进行权限身份验证、请求参数预处理等操作
            //根据类的__Auth配置来进行身份验证,具体的验证逻辑由类的修饰器配置决定，这里不进行类静态方法的权限认证
            if (__Auth) {
                let userInfo = await __Auth({req})
                params.uID = userInfo.uID
            }
            //返回的params会传递给API对应的实际静态方法
            return params 
        },
        afterCall:async({req,res,result})=>{
            //Api处理结束，在返回result给客户端之前，可以做附加处理，比如记录日志或输出额外的附加信息给调用方
            // ....
            return result
        }
        
    }).then((server)=>{
    
        //开始监听指定的端口
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

class2api/
- createServer, 创建服务器(使用内建的独立Express实例)
- createServerInRouter, 创建服务器(使用外部的Express，只返回router供绑定路由)
- getGankaoWXAuthToken,*从redis中读取赶考token的简单封装，方便使用方不用重新创建redis实例。将来可以剥离
- setting_redisConfig，设置内置redis的连接参数
- getRedisClient,获得redis访问实例
- GKErrorWrap   错误包装器，当预设错误类型不够用时，可自定义。code定义需为正数（负数是内置常设错误的保留code段）
- modelSetting  修饰器，类模块的元信息配置类
- cacheAble     修饰器,启用类方法调用缓存的修饰器
- clearCache    修饰器,清空类方法调用缓存的修时器
- accessRule    修饰器,提供访问权限的校验控制,可独立配置认证函数
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




## 概要
- class2api帮把Javascript Class类的静态方法自动向外映射为API接口，创建独立的应用
- 也可以整合到现有的Express应用中，挂载到指定到路由下 
---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [从脚手架快速创建项目](#%E4%BB%8E%E8%84%9A%E6%89%8B%E6%9E%B6%E5%BF%AB%E9%80%9F%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE)
- [class2api的由来：](#class2api%E7%9A%84%E7%94%B1%E6%9D%A5)
- [业务静态类的编写约定：](#%E4%B8%9A%E5%8A%A1%E9%9D%99%E6%80%81%E7%B1%BB%E7%9A%84%E7%BC%96%E5%86%99%E7%BA%A6%E5%AE%9A)
- [如何使用](#%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8)
  - [创建全新独立的接口应用](#%E5%88%9B%E5%BB%BA%E5%85%A8%E6%96%B0%E7%8B%AC%E7%AB%8B%E7%9A%84%E6%8E%A5%E5%8F%A3%E5%BA%94%E7%94%A8)
  - [在现有Express应用中扩展API路由](#%E5%9C%A8%E7%8E%B0%E6%9C%89express%E5%BA%94%E7%94%A8%E4%B8%AD%E6%89%A9%E5%B1%95api%E8%B7%AF%E7%94%B1)
  - [接口返回值的默认结构](#%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E5%80%BC%E7%9A%84%E9%BB%98%E8%AE%A4%E7%BB%93%E6%9E%84)
  - [接口返回值的结构自定义](#%E6%8E%A5%E5%8F%A3%E8%BF%94%E5%9B%9E%E5%80%BC%E7%9A%84%E7%BB%93%E6%9E%84%E8%87%AA%E5%AE%9A%E4%B9%89)
  - [自定义Appi路径](#%E8%87%AA%E5%AE%9A%E4%B9%89appi%E8%B7%AF%E5%BE%84)
  - [跨域配置](#%E8%B7%A8%E5%9F%9F%E9%85%8D%E7%BD%AE)
  - [访问内置的Redis缓存实例](#%E8%AE%BF%E9%97%AE%E5%86%85%E7%BD%AE%E7%9A%84redis%E7%BC%93%E5%AD%98%E5%AE%9E%E4%BE%8B)
  - [自定义错误常量对象](#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%94%99%E8%AF%AF%E5%B8%B8%E9%87%8F%E5%AF%B9%E8%B1%A1)
  - [业务类的修饰器扩展](#%E4%B8%9A%E5%8A%A1%E7%B1%BB%E7%9A%84%E4%BF%AE%E9%A5%B0%E5%99%A8%E6%89%A9%E5%B1%95)
  - [API方法缓存机制](#api%E6%96%B9%E6%B3%95%E7%BC%93%E5%AD%98%E6%9C%BA%E5%88%B6)
    - [启用缓存](#%E5%90%AF%E7%94%A8%E7%BC%93%E5%AD%98)
    - [清除缓存](#%E6%B8%85%E9%99%A4%E7%BC%93%E5%AD%98)
  - [执行中断设置（开发调试用）](#%E6%89%A7%E8%A1%8C%E4%B8%AD%E6%96%AD%E8%AE%BE%E7%BD%AE%E5%BC%80%E5%8F%91%E8%B0%83%E8%AF%95%E7%94%A8)
  - [常用内置的预设错误（code值统一为负数）](#%E5%B8%B8%E7%94%A8%E5%86%85%E7%BD%AE%E7%9A%84%E9%A2%84%E8%AE%BE%E9%94%99%E8%AF%AFcode%E5%80%BC%E7%BB%9F%E4%B8%80%E4%B8%BA%E8%B4%9F%E6%95%B0)
  - [sequelize辅助方法](#sequelize%E8%BE%85%E5%8A%A9%E6%96%B9%E6%B3%95)
    - [sequelize表Model定义](#sequelize%E8%A1%A8model%E5%AE%9A%E4%B9%89)
    - [重置初始化DB](#%E9%87%8D%E7%BD%AE%E5%88%9D%E5%A7%8B%E5%8C%96db)
    - [sequelize模型Model加载器](#sequelize%E6%A8%A1%E5%9E%8Bmodel%E5%8A%A0%E8%BD%BD%E5%99%A8)
    - [打印sequelize实例的方法列表](#%E6%89%93%E5%8D%B0sequelize%E5%AE%9E%E4%BE%8B%E7%9A%84%E6%96%B9%E6%B3%95%E5%88%97%E8%A1%A8)
    - [sequelize内置函数的引用](#sequelize%E5%86%85%E7%BD%AE%E5%87%BD%E6%95%B0%E7%9A%84%E5%BC%95%E7%94%A8)
    - [执行自定义SQL语句](#%E6%89%A7%E8%A1%8C%E8%87%AA%E5%AE%9A%E4%B9%89sql%E8%AF%AD%E5%8F%A5)
  - [权限访问控制相关](#%E6%9D%83%E9%99%90%E8%AE%BF%E9%97%AE%E6%8E%A7%E5%88%B6%E7%9B%B8%E5%85%B3)
    - [对API方法施加控制点](#%E5%AF%B9api%E6%96%B9%E6%B3%95%E6%96%BD%E5%8A%A0%E6%8E%A7%E5%88%B6%E7%82%B9)
    - [后台管理jwtoken的身份查询](#%E5%90%8E%E5%8F%B0%E7%AE%A1%E7%90%86jwtoken%E7%9A%84%E8%BA%AB%E4%BB%BD%E6%9F%A5%E8%AF%A2)
  - [测试辅助工具](#%E6%B5%8B%E8%AF%95%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7)
  - [启动环境变量](#%E5%90%AF%E5%8A%A8%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)
- [下一步TODO：](#%E4%B8%8B%E4%B8%80%E6%AD%A5todo)
    - [权限控制点信息的自动采集与上传](#%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6%E7%82%B9%E4%BF%A1%E6%81%AF%E7%9A%84%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86%E4%B8%8E%E4%B8%8A%E4%BC%A0)
    - [业务类的方法注释，文档自动化](#%E4%B8%9A%E5%8A%A1%E7%B1%BB%E7%9A%84%E6%96%B9%E6%B3%95%E6%B3%A8%E9%87%8A%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%8C%96)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## 从脚手架快速创建项目
```javascript
    //先全局安装class2api
    $ npm i class2api -g 
    
    //从脚手架初始化新项目
    $ class2api init 
```

根据提示输入
``` 
$ class2api init
 脚手架模版类型：
 - base   ——精简型，不带before/after拦截器
 - normal ——普通型，带before/after拦截器、API缓存机制
 - super  ——增强型，带before/after拦截器、API缓存机制、数据库访问
 - admin  ——管理后台权限认证型，super的基础上附带管理身份权限校验
选择以上哪种模版？（base/normal/super/admin）: super
给创建的新项目取个名字(superDemo27366): class2api_scaffold_super

 远程提取模版文件 ...

 请配置数据库链接:
    数据库IP(127.0.0.1): 
    数据库端口(3306): 
    数据库访问用户(root): 
    数据库密码(默认为空): 
    创建新数据库的名称/存在则忽略(class2api_demo): class2api_oooooo
    数据库编码(utf8_general_ci): 

 √ 数据库配置成功!

 √ 项目创建成功!

 开始体验:

 $ cd class2api_scaffold_super && npm install && npm start 
```

最终：
``` 
$ curl -d 'name=huangyong' 'http://127.0.0.1:3002/a/hello'
```
     
## class2api的由来：
- 目前还没有一套开源的流行的、将业务类映射为API输出的框架
- 让团队专注于业务类的逻辑实现
- 基于Express（添加了很薄的一层路径映射），内核稳定、插件生态丰富
- 省去了繁琐的项目环境配置，ES6、Babel等
- Sequelize的Model定义与加载器
- 内置缓存服务，支持缓存API方法输出的结果，并可反向控制
- 平滑扩展，后续将扩展支持其他更高性能webServer框架

## 业务静态类的编写约定：
- 类名需为命名类，不能匿名
- 业务静态类，不能拥有实例方法（通常其实也没有需求和场景），所以请参考官方代码，在构造器中throw异常，以确保业务静态类不会被实例化
- 类静态方法实现各业务逻辑，一个方法对应一个业务逻辑
- 类静态方法只有一个形参，并以ES6对象解构的方式书写，调用代码可以获得命名参数形式的可读性益处
- 类静态方法的参数（首个参数）中，框架还注入了几个属性：**req**：当前的请求信息对象，express的标准request，供方法内部读取；**uID**：用户的唯一编码，当modelSetting修饰器中指定的身份验证函数（__Auth）运行通过时出现；**__nocache**：调用方传入的特殊指令，当__nocache有值时，cacheAble修饰器内部会在本次请求中忽略cacheAble缓存策略，继续运行方法。
- 为了增加API返回数据值的可扩展能力，类静态方法的返回值必须用对象形式，不能使用字符串、整数、浮点、布尔等简单值类型。
- 某些场景，只需要API返回操作是否成功的信息，可以使用内置的GKSUCCESS([props])函数，它封装一个简单结构{success: true,...props}，其中props参数是附加信息，当props是对象时，自动扩展到结构里，当props是非对象时，以msg属性扩展到结构里

<p><details>
  <summary><b>Examples</b></summary>
  <ul><li>
  <pre>
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
                //TODO:...删除文章的操作
                return GKSUCCESS()
            }
        }
        export default ClassA
    ```
  </pre>
  </li></ul>
</details></p> 

## 如何使用  

### 创建全新独立的接口应用
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

### 在现有Express应用中扩展API路由
- createServerInRouter(opts)
创建服务器(使用外部的Express，只返回router供绑定路由)，opts参数与createServer函数基本相同，除了自动忽略custom参数。可参考项目中的demo-src/server-router.js源码


### 接口返回值的默认结构
class2api对所有请求的返回数据结构，统一为：
```javascript
{  
    err,
    result
}
```
其中err代表内部异常或错误，凡是GKErrors和GKErrorWrap result抛出的错误都会捕捉err ，而result保存的是业务类静态方法的执行返回结果，且约定为必须为对象结构，不能是数字、字符串、布尔值等简单数据类型

### 接口返回值的结构自定义
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

### 自定义Appi路径
```javascript
    //创建微服务对象
    createServer({
        config:{
            apiroot: '/api_v2',//如需要时，可以指定API服务的起始路径，特别是在映射路径的方式中 
        },
        //... 
    }) 
``` 

### 跨域配置
```javascript
    //创建微服务对象
    createServer({
        config:{ 
            cros:true,
            cros_headers:['customHeader'], 
            cros_origin:['http://web.domain.com'], 
        },
        //... 
    }) 
``` 

### 访问内置的Redis缓存实例
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
获得redis访问实例，以进行直接读取操作。注：读写时，在redis中实际存取的key会携带redis配置中cache_prefx属性定义的前缀
```javascript
    let cache = getRedisClient()
    cache.set('keyABC','this is message!', (err,data)=>{})
    await cache.setAsync('keyABC','this is message!')
```

### 自定义错误常量对象
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

### 业务类的修饰器扩展
- modelSetting(props)
类修饰器，将传入的props对象赋值到 Class.__modelSetting 上，并传入beforeCall事件函数中，供beforeCall函数内部访问调用
目前class2api内部约定的porps属性有：
    - **__Auth**:Function，与业务类相关的身份验证函数，内部进行身份判断，并返回带有uID的用户信息对象。通常在beforeCall中执行调用完成身份验证
    - **__ruleCategory**:{name//权限组名称,desc//权限组的备注描述}

```javascript
    import {parseAdminAccountFromJWToken} from "class2api/rulehelper";
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

### API方法缓存机制

#### 启用缓存
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

#### 清除缓存
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

### 执行中断设置（开发调试用）
- crashAfterMe(hintMsg)  修饰器,运行完类方法就人为抛出异常中断程序，调试用，生产环境下自动失效

### 常用内置的预设错误（code值统一为负数）
- 位于 class2api/gkerrors 下
- 预设错误有：
```javascript
    import {GKErrors} from 'class2api/gkerrors' 
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

### sequelize辅助方法

#### sequelize表Model定义
- 位于class2api/dbhelper下
- 模型创建与管理的助手函数空间，可参考项目中的tableloader.js示例文件
- TableSetting  
sequelizeModel定义model时的几个扩展设置，包括：
1、TableSetting.tabelOption设置，含model的几个默认设置，paranoid默认为true，时间相关字段名定义为created_at、updated_at、deleted_at，字符集collate为utf8_general_ci
2、TableSetting.extendDateTimeVirtualFields(DataTypes, [customfields])设置，为时间字段扩展出可读性强的时间格式化后的虚字段，名称约定为'*****_display'，设置内默认为created_at、updated_at扩展，第二个[customfields]参数追加需要扩展格式化的自定义时间字段
```javascript
    //DemoUser.js
    import {TableSetting} from 'class2api/dbhelper';
    
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

#### 重置初始化DB
- ResetDB   
重置数据库，即执行sequelize.sync({force: (process.env.FORCE=="1")})，内部有启动环境变量的校验，只有当传入的启动环境变量与config中mysql.reset_key的{key1,key2}相符时才执行。默认为软重置，可以通过传入FORCE=1的启动环境变量来强制重置

#### sequelize模型Model加载器
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

#### 打印sequelize实例的方法列表
- DBUtils   
数据库的辅助工具方法：
DBUtils.dumpModelFuns(sequelizeModelClass)  打印指定模型类上的sequelize扩展的操作自身数据实例的、以及操作关联对象的各类函数方法

#### sequelize内置函数的引用
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

#### 执行自定义SQL语句
- excuteSQL(sql,[replaceparam1,replaceparam2,...]) 
执行指定的SQL语句，一般适用于无法用sequelize表达式的复杂查询或更新操作

### 权限访问控制相关
在 class2api/rulehelper 下，适用于后台管理系统的身份检验、权限校验的辅助函数库

#### 对API方法施加控制点
- accessRule({ruleName, ruleDesc})
类静态方法修饰器,提供后台级的权限校验，同时为当前修饰的类静态方法标记了权限名称、描述信息。
运行原理：修饰器内部会拦截类静态方法的调用，并先向class2api.config.js中指定的远程权限认证微服务发送请求进行身份验证，根据请求返回结果来判断是否有权限继续运行对应的方法。
class2api.config.js配置中定义相关信息：
```javascript
exports.config = { 
    name: 'courseService', 
    admin_rule_center: { 
        auth:"http://127.0.0.1:3002/gkrulemanager/auth", //管理用户的身份验证接口
        validator: "http://127.0.0.1:3002/gkrulemanager/validate",  //管理用户对指定权限的验证接口
        register: "http://127.0.0.1:3002/gkrulemanager/register" //权限配置表的上传注册接口（待完善），在IDE环境下使用
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

#### 后台管理jwtoken的身份查询
- parseAdminAccountFromJWToken({jwtoken})
class2api内置的管理员身份校验函数，函数内将jwtoken参数会以header的方式发送给class2api.config.js中指定的config.admin_rule_center.auth接口，auth接口端返回详细的用户信息（按约定，用户信息中含有标识唯一的uID属性）

### 测试辅助工具
在class2api/testhelper中，测试辅助函数库，为了接近真实环境，以及确保接口调用的全流程，class2api的单元测试原则上都以http调用的方式执行，而避免用类调用。
注：当需要测试业务功能类本身时，还是可以在业务类层面直接调用，以避开微服务框架以及http通讯的干扰

- setApiRoot    设定微服务API的domain，在WebInvokeHepler内部需要使用
- WebInvokeHepler(usertoken)(apiPath, postParams, [apiDesc])      
向api发起一个post-API请求， postParams是post的JSON内容，apiDesc是API方法描述的函数封装（只是提高可读性，没有实际功能意义），声明了apiDesc的调用的请求的post与res结果数据，将被内部缓存，供save2Doc使用保存输出
- ApiDesc       API方法描述的函数封装，只是提高在真实入参列表中的可读性，没有实际功能意义
- save2Doc      保存本次mocha用例中所有提供了ApiDesc参数的API请求的post入参与res返回结果
```javascript
    //testhelper的最小化案例 
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
    
    describe('接口服务', function () {
     
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
### 启动环境变量  
- $ process.env.NO_API_CACHE=1  强制关闭静态类的API调用缓存，使cacheAble、clearCache失效
- $ process.env.SQL_PRINT=1     开启sequelize的SQL执行日志的打印
- $ process.env.PRINT_API_RESULT=1     开启API方法执行的结果日志打印


## 下一步TODO：

#### 权限控制点信息的自动采集与上传
#### 业务类的方法注释，文档自动化



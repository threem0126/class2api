# class2api
- 将JS类转化为APi服务

# npm i

# npm run start:src  --基于源码版本运行
# npm run start:srcrouter  --路由版本，基于源码版本运行

# mocha test/test.run

# npm run build
# npm publish

$ npm i --registry=https://registry.npm.taobao.org
$ npm i --registry https://registry.npmjs.org

# 导出功能函数：
class2api/
- createServer, 创建服务器(使用内建的独立Express实例)
- createServerInRouter, 创建服务器(使用外部的Express，只返回router供绑定路由)
- getGankaoWXAuthToken, 从redis中读取赶考token的简单封装，方便使用方不用重新创建redis实例。将来可以剥离
- setting_redisConfig，设置内置redis的连接参数
- getting_redisConfig, 读取内置redis的连接参数
- getRedisClient,获得redis访问实例
- GKErrorWrap,错误包装器，当预设错误类型不够用时，可自定义
- modelSetting,类模块的元信息配置类
- cacheAble 启用类方法调用缓存的修饰器
- clearCache    清空类方法调用缓存的修时器
- crashAfterMe  运行完类方法就认为跑出异常中断程序，调试用，生产环境下自动失效
- definedStaticField    类提供扩展静态属性的修饰器（试验阶段）

class2api/dbhelper
- GKErrors,常用预设的错误  
- ModelSetting  sequelizeModel定义时的扩展配置
- ResetDB   重置数据库
- DBModelLoader 加载Model定义文件
- DBUtils   数据库的辅助工具方法
- fn        sequezeli的聚合函数引用
- col       sequezeli的列引用函数
- literal   sql语句字面量包装函数，确保sequelize不解析此SQL字符串
- where     sequezeli的where引用函数
- createTransaction sequezeli的事务
- excuteSQL 执行指定的SQL语句，一般适用于无法用sequelize表达式的复杂查询



import {DBModelLoader} from 'class2api/dbhelper'
import _config from './config'
import DemoUser from './tables/DemoUser'
import Older_Scope from './tables/Older.scope'

//根据config生成数据库加载器，可以创建多个
//模型定义，在aloader.init内部会动态加载指定的定位文件，替换为真实的object的value值
const myDBModelLoader = DBModelLoader(_config.mysql)
//从加载器中结构出与目标库相关的常用函数
export const DataModel = {
    DemoUser: myDBModelLoader.define(DemoUser),
    Older: myDBModelLoader.defineScope(Older_Scope, 'DemoUser'),
}


//定义第二套数据库模型
const myDBModelLoader_MainDB = DBModelLoader(_config.mysql)
export const DataModel_MainDB = {
    DemoUser: myDBModelLoader_MainDB.define(DemoUser),
}


//绑定模型关系时，可能需要定义的别名
export const ass = {
    subComment: "subComment",
    replyToUser: "replyToUser"
}

//集中定义SQL语句，一般不用，只建议替代某些复杂的sequelize查询
export const SQLFunctions = {
    queryDemoData: async ({mobile}) => {
        let [user] = await myDBModelLoader.excuteSQL(`select * from users where mobile = ? and status=0 limit 1 `, [mobile])
        return user
    }
};

(async()=>{
    await myDBModelLoader.INIT({model:DataModel, ass})
    await myDBModelLoader_MainDB.INIT({model:DataModel_MainDB, ass})
})();





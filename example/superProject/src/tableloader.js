import {DBModelLoader,excuteSQL} from 'class2api/dbhelper'
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

//集中定义SQL语句，一般不用，只建议替代某些复杂的sequelize查询
export const SQLFunctions = {
    queryDemoData: async ({mobile}) => {
        let [user] = await excuteSQL(`select * from users where mobile = ? and status=0 limit 1 `, [mobile])
        return user
    }
};

(async()=>{
    await DBModelLoader.INIT(_config.mysql, {model:DataModel, ass})
})();





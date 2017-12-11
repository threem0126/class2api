import {DataModel} from './../src/tableloader'

(async ()=>{
    try{
        //重建所有表
        const hasReseted = await DataModel.__resetDB();
        if(!hasReseted)
            throw '数据库未被重置'
        //...

        //你可以自己再做一些基础数据的初始化插入操作
        console.info("提醒：你可以自己再做一些基础数据的初始化插入操作！");
        let user = await DataModel.DemoUser.create({name:"liuyun",age:23})
        console.log(user.get())

    }catch(err) {

    }
})();

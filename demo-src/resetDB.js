import {DataModel,DataModel_MainDB} from './tableloader'

// DB_RESET_1=123234537569 DB_RESET_2=wrq5hfoiuy12344376 node demo-src/resetDB.run

(async ()=>{
    try{
        //重建库1
        const hasReseted = await DataModel.__resetDB();
        if(!hasReseted)
            throw '数据库未被重置'
        //...

        //你可以自己再做一些基础数据的初始化插入操作
        console.info("提醒：你可以自己再做一些基础数据的初始化插入操作！");
        let user = await DataModel.DemoUser.create({name:"liuyun1",age:23})
        console.log(user.get())

        //
        //重建库2
        const hasReseted2 = await DataModel_MainDB.__resetDB();
        if(!hasReseted2)
            throw '数据库未被重置'
        //...

        //你可以自己再做一些基础数据的初始化插入操作
        console.info("提醒：你可以自己再做一些基础数据的初始化插入操作！");
        let user2 = await DataModel_MainDB.DemoUser.create({name:"liuyun2",age:18})
        console.log(user2.get())

    }catch(err) {

    }
})();

/*
 */

export const config = {
    appName:'class2api_demo',
    mysql: {
        host: "127.0.0.1",
        port: process.env.SQLPORT || "3306",
        user: "root",
        password: "",
        timezone:'+00:00',
        charset: "utf8_general_ci",
        database: "gankao_demo123",
        reset_key:{
            key1:'123234537569',
            key2:'wrq5hfoiuy12344376'
        }
    },
    mysql2: {
        host: "127.0.0.1",
        port: process.env.SQLPORT || "3306",
        user: "root",
        password: "",
        charset: "utf8_general_ci",
        database: "gankao_demo456",
        reset_key:{
            key1:'123234537569',
            key2:'wrq5hfoiuy12344376'
        }
    },
    redis: {
        host: "127.0.0.1",
        port: 6379,
        cache_prefx:'dev_class2api_',
        defaultExpireSecond:10*60
    }
}
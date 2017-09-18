/*
 */

export const config = {
    appName:'class2api_demo',
    mysql: {
        host: "127.0.0.1",
        port: process.env.SQLPORT || "3306",
        user: "root",
        password: "",
        charset: "utf8_general_ci",
        database: "class2api_demo"
    },
    redis: {
        host: "127.0.0.1",
        port: 6379,
        cache_prefx:'dev_class2api_',
        defaultExpireSecond:10*60
    }
}
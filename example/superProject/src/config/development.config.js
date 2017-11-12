/*
 */

export const config = {
    appName: '_no_set_',
    PORT:3002,
    mysql: {
        host: "127.0.0.1",
        port: process.env.SQLPORT || "3306",
        user: "root",
        password: "",
        charset: "utf8_general_ci",
        database: "gankao_demo123",
        reset_key:{
            key1:'123234537569',
            key2:'wrq5hfoiuy12344376'
        }
    },
    mysql_gankao_mainDB: {
        host: "127.0.0.1",
        port: process.env.SQLPORT || "3306",
        user: "root",
        password: "",
        charset: "utf8_general_ci",
        database: "gankao"
    },
    gankao_mainsite_authApi: 'http://106.75.13.13/userApi/getUser',//正式
    frontPage: {
        site: 'http://local8009.gankao.com:8009'
    },
    sms_gate: {
        url: 'http://www.gankao.com/api/sendContentMsg',
        token: 'FC260EF3266FFDA340AE7F5597103CC7'
    },
    redis: {
        host: "127.0.0.1",
        port: 6379,
        cache_prefx: '_no_set_',
        defaultExpireSecond: 10 * 60
    },
    qiniu: {
        ACCESS_KEY: "mymKEe7WYROHknYurAgs9fOia3s1dIeKIDVPks9r",
        SECRET_KEY: "jMHF7ks0whr_oEw0_IZnrQdSXiRhExbyTLv8KAY7",
        SITE_URL: "http://img.gankao.com",
        SITE_bucket: "gankao",
        staticVersion: "v1",
    },
    whiteIPs: "192.168.10.21,192.168.10.21"
}
/*
 */

export const config = {
    appName:'microservice_zhuli',
    PORT:3002,
    mysql: {
        host: "10.9.133.67",
        port: process.env.SQLPORT || "3306",
        user: "root",
        password: "gankaonaifei",
        charset: "utf8_general_ci",
        database: "gankao_zhuli_test"
    },
    mysql_gankao_mainDB: {
        host: "10.9.21.58",
        port: process.env.SQLPORT || "3306",
        user: "gankaoReadonly",
        password: "safety123",
        charset: "utf8_general_ci",
        database: "gankao"
    },
    gankao_mainsite_authApi:'http://106.75.13.3/userApi/getUser',//测试
    frontPage:{
        site:'http://zhuli_test.gankao.com'
    },
    weixin_gate:{
        url:'http://weixin_gate_test.gankao.com'
    },
    sms_gate:{
        url:'http://www.gankao.com/api/sendContentMsg',
        token:'FC260EF3266FFDA340AE7F5597103CC7'
    },
    cardpay_gate:{
        api_prepay:'http://gktest2.gankao.com/api/cardPay/prePay',
        url_pay:'http://gktest2.gankao.com/cardPay/pay',
        api_querystatus:'http://gktest2.gankao.com/api/cardPay/searchPayStatus'
    },
    deadlineHours:44,
    redis: {
        host: "10.9.193.140",
        port: 6379,
        password:'gankao123poi',
        cache_prefx:'test_gk_zhuli_',
        defaultExpireSecond:10*60
    },
    qiniu: {
        ACCESS_KEY: "mymKEe7WYROHknYurAgs9fOia3s1dIeKIDVPks9r",
        SECRET_KEY: "jMHF7ks0whr_oEw0_IZnrQdSXiRhExbyTLv8KAY7",
        SITE_URL: "http://img.gankao.com",
        SITE_bucket: "gankao",
        staticVersion: "v1",
    },
    whiteIPs:"192.168.10.21,192.168.10.21",
    headimgurl_domain:'http://img.gankao.com/',
    defaultheadimgurl:'http://www.gankao.com/assets/site/2013/image/memberimg001.png',
    defaultheadimgurl_suffix:'.userlogo',
    pageSize:10
}
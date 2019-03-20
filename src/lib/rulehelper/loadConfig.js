import path from 'path'

/*
 获取package中的系统名
 */
const load_package_name = ()=> {
    let {name = ''} = require(path.join(process.cwd(), 'package.json'));
    let applicationName = name.split(".")[0]
    console.log(`后台权限管理模块从package.json中获取当前业务系统名（取name.split(".")[0]）：${applicationName}`)
    if (!applicationName)
        throw new Error(`业务系统名获取失败，权限管理认证将失效，请确认存在package.json且其中已配置name属性`)
    return applicationName
}
const env = (process.env.PRODUCTION_TYPE||process.env.NODE_ENV)
const validUrl = (env=== 'production') ? 'https://rulecenter.api.gankao.com' : 'https://rulecenter-test.api.gankao.com'

let class2api_config = {
    /**
     * 系统名称,默认读取package.json中的name
     */
    name: load_package_name(),
    /**
     * 权限认证中心
     */
    admin_rule_center: {
        /**
         * 用户身份验证接口
         */
        auth: validUrl + "/gkauth/authAdminAccount",
        /**
         * 权限验证接口
         */
        validator: validUrl + "/gkrulemanager/validate",
        /**
         * 权限配置表的注册接口
         */
        register: validUrl + "/gkrulemanager/updateCertList",
    }
}

try{
    let {config:customConfig} = require(path.join(process.cwd(), 'class2api.config.js'));
    class2api_config = {...class2api_config, ...customConfig}
    console.log(`后台权限管理模块：发现class2api.config.js配置，启用自定义的权限认证配置(${env})：${JSON.stringify(class2api_config)}`)
}catch(err) {
    console.log(`后台权限管理模块：未找到class2api.config.js配置，启用内置的权限认证配置(${env})：${JSON.stringify(class2api_config)}`)
}

export default ()=>{
    return {...class2api_config}
}
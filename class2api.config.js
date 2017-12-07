/**
 * class2api类内部需要的特殊配置，主要是对权限认证中心的接口配置。
 * 其他的redis等配置可以在运行时由组件外部传入
 */
import path from 'path'

/*
获取package中的系统名
 */
const load_package_name = ()=> {
    try {
        let {name} = require(path.join(process.cwd(), 'package.json'));
        return name
    } catch (err) {
        return ""
    }
}

exports.config = {
    /**
     * 系统名称,默认读取package.json中的name
     */
    name: '' || load_package_name(),
    /**
     * 权限认证中心
     */
    admin_rule_center: {
        /**
         * 验证身份，传入jwtoken，解析出后台人员身份
         */
        auth:"http://127.0.0.1:3002/gkrulemanager/auth",
        /**
         * 权限验证接口
         */
        validator: "http://127.0.0.1:3002/gkrulemanager/validate",
        /**
         * 权限配置表的上传注册接口，在IDE环境下使用
         */
        register: "http://127.0.0.1:3002/gkrulemanager/register"
    }
}
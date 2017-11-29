/*
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
    name: ''||load_package_name(),
    /**
     * 权限认证中心
     */
    rule_center:{
        /**
         * 权限验证接口
         */
        validator: "http://test.gkadmin.com/tool/validator",
        /**
         * 权限配置表的注册接口
         */
        register:"http://test.gkadmin.com/tool/register"
    }
}
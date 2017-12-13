import {GKSUCCESS, modelSetting, clearCache,createServer,setting_redisConfig} from 'class2api'
import {accessRule,parseAdminAccountFromJWToken} from "class2api/rulehelper";
import _config from "./../config.js" ;

let {redis} = _config
setting_redisConfig(redis)

@modelSetting({
    __Auth:async ({req})=>{
        //后台的用户验证，解析header中的jwtoken信息，调用class2api/rulehelper的解析，注意与非后台常规用户验证的区别
        let jwtoken = req.header('jwtoken') || ''
        return await parseAdminAccountFromJWToken({jwtoken})
    },
    //后台权限认证的组信息
    __ruleCategory: {
        name: '文章系统',
        desc: '文章系统'
    }
})
class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @clearCache({
        cacheKeyGene: ({aID}) => {
            return `article-${aID}`
        }
    })
    @accessRule({ruleName: '编辑文章', ruleDesc: '对文章进行编辑'})
    static async editArticle({aID}) {
        //...
        return GKSUCCESS()
    }

    @clearCache({
        cacheKeyGene: ({aID}) => {
            return `article-${aID}`
        }
    })
    @accessRule({ruleName: '删除文章', ruleDesc: '对文章进行删除'})
    static async deleteArticle({aID}) {
        //...
        return GKSUCCESS()
    }

}

export default GKModelA
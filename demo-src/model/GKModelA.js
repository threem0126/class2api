import {modelSetting, cacheAble, clearCache, accessRule, setting_RuleValidator} from '../../src/lib/class2api/Decorators'
import {GKErrors} from '../../src/lib/class2api/GKErrors'
import {GKSUCCESS} from "../../src/lib/class2api/index";
import {gkRuleValidator} from '../model_private/RuleValidator'

setting_RuleValidator(gkRuleValidator);


@modelSetting({
    __needAuth:async ({uid})=>{
        return await accessProvider('class1')({uid})
    },
    __ruleCategory: {
        Name: '文章系统',
        Descript: '文章系统'
    }
})
class GKModelA {
    constructor() {
        throw '静态业务功能类无法实例化'
    }

    @cacheAble({
        cacheKeyGene: (args) => {
            let {name} = args[0]
            return `hello-${name}`
        }
    })
    /**
     * 测试hello
     *
     * @param name
     * @returns {Promise.<{message: string}>}
     */
    static async hello({name}) {
        console.log(GKErrors._SERVER_ERROR('错误1'))
        return {message: `hello.${name}`}
    }

    @accessRule({ruleName: '编辑文章', ruleDescript: '对文章进行编辑'})
    static async editArticle({aID}) {
        //...
        return GKSUCCESS()
    }

    @accessRule({ruleName: '删除文章', ruleDescript: '对文章进行删除'})
    static async deleteArticle({aID}) {
        //...
        return GKSUCCESS()
    }

}

export default GKModelA
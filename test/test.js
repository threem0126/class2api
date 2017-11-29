import should from 'should';
import {ApiDesc, WebInvokeHepler, setApiRoot, save2Doc} from './../src/lib/testhelper'
import {GKErrors} from '../src/lib/class2api/GKErrors_Inner'

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

let _run = {
    accounts: {
        user1: {
            token: 'dfdfddf'
        }
    }
}
const remote_api = process.env.ONLINE==='1'? `https://comment_api_test.gankao.com`
    :(process.env.ONLINE==='2'? `https://comment_api.gankao.com`
        :`http://127.0.0.1:3002`)
setApiRoot(remote_api)

describe('评论系统', function () {

    //region after 在本区块的所有测试用例之后执行
    after(function () {
        save2Doc({save2File:'api.MD'})
    });
    //endregion

    it('/gkmodela/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/gkmodela/hello',
            {name: "haungyong"},
            ApiDesc(`方法Hello`)
        )
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

    it('/gkmodela/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/gkmodela/hello', {name:"haungyong"})
        console.log(response)
        let {err, result: {__fromCache}} = response
        __fromCache.should.be.eql(true)
    })

    it('/a2/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/a2/hello',
            {name: Math.random()},
            ApiDesc(`以别名方式请求`))
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

    it('/a2/editArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/a2/editArticle',
            {aID: Math.random()},
            ApiDesc(`编辑文章`))
        console.log(response)
        let {err, result} = response
        err.code.should.eql(GKErrors._NOT_ACCESS_PERMISSION().code)
    })

    it('/a2/deleteArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/a2/deleteArticle',
            {aID: Math.random()},
            ApiDesc(`删除文章`))
        console.log(response)
        let {err,result:{success}} = response
        success.should.eql(true)
    })

})



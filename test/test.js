import should from 'should';
import {GKErrors} from '../src/lib/class2api/gkerrors'
import {ApiDesc, WebInvokeHepler, setApiRoot, save2Doc} from './../src/lib/testhelper'

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

let _run = {
    accounts: {
        user1: {
            token: 'token-111'
        },
        admin: {
            jwtoken: 'jwtoken-333'
        }
    }
}
const remote_api = process.env.ONLINE==='1'? `https://comment_api_test.gankao.com`
    :(process.env.ONLINE==='2'? `https://comment_api.gankao.com`
        :`http://127.0.0.1:3002`);
//配置远程请求endpoint
setApiRoot(remote_api)

describe('评论系统', function () {

    //region after 在本区块的所有测试用例之后执行
    after(function () {
        save2Doc({save2File:'api.MD'})
    });
    //endregion

    it('/a/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1, "get")(
            '/a/hello',
            {name: "haungyong"},
            ApiDesc(`hello测试方法`)
        )
        console.log(response)
        let {err, result} = response
        let {message} = result
        console.log(message)
        message.lastIndexOf('haungyong').should.be.above(-1)
    })

    it('/a/hello 以get方式请求', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/a/hello',
            {name: "haungyong"},
            ApiDesc(`hello测试方法`)
        )
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('haungyong').should.be.above(-1)
    })

    it('/gkmodela/getArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/gkmodela/getArticle',
            {name: "haungyong"},
            ApiDesc(`方法getArticle`)
        )
        //console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('getArticle').should.be.above(-1)
    })

    it('/gkmodela/getArticle With Cache', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/gkmodela/getArticle', {name:"haungyong"})
        //console.log(response)
        let {err, result: {__fromCache}} = response
        __fromCache.should.be.eql(true)
    })

    it('/gkmodela/getArticle With force skip Cache ', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/gkmodela/getArticle', {name:"haungyong",__nocache:1})
        //console.log(response)
        let {err, result: {__fromCache=false}} = response
        __fromCache.should.be.eql(false)
    })

    it('/a/getArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/a2/getArticle',
            {name: Math.random()},
            ApiDesc(`以别名方式请求`))
        //console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('getArticle').should.be.above(-1)
    })

    it('/a/customResponseResultStruck', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)(
            '/a2/customResponseResultStruck',
            {},
            ApiDesc(`以别名方式请求`))
        //console.log(response)
        let {data, errorCode} = response
        errorCode.should.be.eql(123)
    })

    //

    it('/admin/editArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.admin)(
            '/admin/editArticle',
            {aID: Math.random()},
            ApiDesc(`编辑文章`))
        //console.log(response)
        let {err, result} = response
        err.code.should.eql(GKErrors._NOT_ACCESS_PERMISSION().code)
    })

    it('/admin/deleteArticle', async () => {
        let response = await WebInvokeHepler(_run.accounts.admin)(
            '/admin/deleteArticle',
            {aID: Math.random()},
            ApiDesc(`删除文章`))
        //console.log(response)
        let {err,result:{success}} = response
        success.should.eql(true)
    })

})



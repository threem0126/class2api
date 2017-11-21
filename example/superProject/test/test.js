import should from 'should';
import fs from 'fs'
import request from 'request'
import Promise from 'bluebird'
import {ApiDesc, WebInvokeHepler, setApiRoot, save2Doc} from 'class2api/testhelper'

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

Promise.promisifyAll(request)

let _run = {
    accounts:{
        u1: {
            username: "13918925582",
            password: '123456',
            token:'dfdfddf'
        }
    }
}

let docapi = []

let apiDescript=(desc)=>{
    return desc
}

const remote_api = process.env.ONLINE==='1'? `https://comment_api_test.gankao.com`
    :(process.env.ONLINE==='2'? `https://comment_api.gankao.com`:`http://127.0.0.1:3002`);
setApiRoot(remote_api)

describe('评论系统', function () {

    //region after 在本区块的所有测试用例之后执行
    after(function () {
        save2Doc({save2File:'api.MD'})
    });
    //endregion

    it('/gkmodela/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.u1)('/gkmodela/hello', {name:"haungyong"})
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

    it('/a2/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.u1)('/a2/hello', {name:Math.random()})
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

})



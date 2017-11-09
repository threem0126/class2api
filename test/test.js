import should from 'should';
import {filter} from 'lodash'
import {WebInvokeHepler, setApiRoot, save2Doc} from './../src/lib/testhelper'

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
let apiDesc=(desc)=>{
    return desc
}
const remote_api = process.env.ONLINE==='1'? `https://comment_api_test.gankao.com`
                            :(process.env.ONLINE==='2'? `https://comment_api.gankao.com`
                            :`http://127.0.0.1:3002`)
setApiRoot(remote_api)

describe('评论系统', function () {

    //region after 在本区块的所有测试用例之后执行
    after(function () {
        save2Doc('api.MD')
    });
    //endregion

    it('/modela/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/modela/hello', {name:"haungyong"})
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

    it('/modela/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/modela/hello', {name:"haungyong"})
        console.log(response)
        let {err, result: {__fromCache}} = response
        __fromCache.should.be.eql(true)
    })

    it('/a2/hello', async () => {
        let response = await WebInvokeHepler(_run.accounts.user1)('/a2/hello', {name:Math.random()})
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

})



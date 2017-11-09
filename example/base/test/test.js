import should from 'should';
import fs from 'fs'
import request from 'request'
import Promise from 'bluebird'
import {filter} from 'lodash'

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
    :(process.env.ONLINE==='2'? `https://comment_api.gankao.com`:`http://127.0.0.1:3002`)

const invokeHepler = (user) => {
    return async (apiPath, postParams, apiComment) => {
        let options = {
            uri: remote_api + apiPath,
            rejectUnauthorized: false,
            headers: {
                token: user.token
            },
            body: postParams,
            json: true,
        }
        let {body} = await request.postAsync(options)
        if(apiComment){
            docapi.push([apiComment, options.uri, postParams, body])
        }
        return body
    }
}

describe('评论系统', function () {

    //region after 在本区块的所有测试用例之后执行
    after(function () {
        if (process.env.API_DOC === '1') {
            console.log(`生成API接口请求的快照 ... ...`)
            let str = []
            docapi.forEach((item) => {
                let lines = []
                let [apiComment, uri, postParams, body] = item
                lines.push(`# ${apiComment} #`)
                lines.push(`- 接口：${uri}`)
                lines.push(`- post参数：`)
                lines.push('`' + JSON.stringifyline(postParams) + '`')
                lines.push(`- 请求结果：`)
                lines.push('`' + JSON.stringifyline(body) + '`')
                str.push(lines.join("\r"))
            })
            fs.writeFileSync("api2.MD", str.join("\n\r"))
            console.log(`API接口请求的快照 生成成功！`)
        } else {
            console.log(`忽略生成API接口请求的快照!`)
        }
    });
    //endregion

    it('/gkmodela/hello', async () => {
        let response = await invokeHepler(_run.accounts.u1)('/gkmodela/hello', {name:"haungyong"})
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

    it('/a2/hello', async () => {
        let response = await invokeHepler(_run.accounts.u1)('/a2/hello', {name:Math.random()})
        console.log(response)
        let {err, result} = response
        let {message} = result
        message.lastIndexOf('hello').should.be.above(-1)
    })

})



import request from 'request'
import Promise from 'bluebird'
import {filter} from 'lodash'
import fs from 'fs'

Promise.promisifyAll(request)

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

let remote_api
export const setApiRoot = (apiRoot)=> {
    remote_api = apiRoot
}

let docapi = []
export const WebInvokeHepler = (userToken) => {
    return async (apiPath, postParams, apiDesc) => {
        let options = {
            uri: remote_api + apiPath,
            rejectUnauthorized: false,
            headers: {
                token: userToken
            },
            body: postParams,
            json: true,
        }
        let {body} = await request.postAsync(options)
        if (apiDesc) {
            docapi.push([apiDesc, options.uri, postParams, body])
        }
        return body
    }
}

export const save2Doc = (save2File)=> {
    console.log(`生成API接口请求的快照 ... ...`)
    let str = []
    docapi.forEach((item) => {
        let lines = []
        let [apiDesc, uri, postParams, body] = item
        lines.push(`# ${apiDesc} #`)
        lines.push(`- 接口：${uri}`)
        lines.push(`- post参数：`)
        lines.push('`' + JSON.stringifyline(postParams) + '`')
        lines.push(`- 请求结果：`)
        lines.push('`' + JSON.stringifyline(body) + '`')
        str.push(lines.join("\r"))
    })
    fs.writeFileSync(save2File || "api.MD", str.join("\n\r"))
    console.log(`API接口请求的快照 生成成功！`)
}
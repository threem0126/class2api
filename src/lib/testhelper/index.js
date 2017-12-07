import request from 'request'
import Promise from 'bluebird'
import fs from 'fs'

Promise.promisifyAll(request)

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

let remote_api
let docapi = []

export const setApiRoot = (apiRoot)=> {
    remote_api = apiRoot
}
export const ApiDesc=(desc)=> {
    return desc
}
export const WebInvokeHepler = (user) => {
    if(!user)
        throw `WebInvokeHepler方法缺少参数user`
    let {token='', jwtoken=''} = user
    return async (apiPath, postParams, apiDesc) => {
        let options = {
            uri: remote_api + apiPath,
            rejectUnauthorized: false,
            headers: {
                token, jwtoken // 这里提供身份验证的token，注意命名为：jwtoken
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

export const save2Doc = ({save2File="api.MD"})=> {
    console.log(`生成API接口请求的快照 ... ...`)
    let str = []
    docapi.forEach((item) => {
        let lines = []
        let [apiDesc, uri, postParams, body] = item
        lines.push(`# ${apiDesc} #`)
        lines.push(`- 接口：${uri}`)
        lines.push(`- post参数：`)
        lines.push('```json')
        lines.push(JSON.stringifyline(postParams))
        lines.push('```')
        lines.push(`- 请求结果：`)
        lines.push('```json')
        lines.push(JSON.stringifyline(body))
        lines.push('```')
        str.push(lines.join("\r"))
    })
    fs.writeFileSync(save2File, str.join("\n\r"))
    console.log(`API接口请求的快照 生成成功！`)
}
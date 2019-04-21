import request from 'request'
import Promise from 'bluebird'
import fs from 'fs'
import {map, keys} from 'lodash'

Promise.promisifyAll(request)

JSON.stringifyline = function (Obj) {
    return JSON.stringify(Obj, null, 2)
}

let remote_api
let docapi = []

const joinParamsForGet = (props)=> {
    let ret = []
    map(keys(props), (k) => {
        ret.push(`${k}=${props[k]}`)
    })
    return ret.join("&")
}

export const setApiRoot = (apiRoot)=> {
    remote_api = apiRoot
}
export const ApiDesc=(desc)=> {
    return desc
}
export const WebInvokeHepler = (user,method) => {
    if (!user)
        throw new Error(`WebInvokeHepler方法缺少参数user`)
    if (!method)
        method = 'post'
    let {token = '', jwtoken = '', otherheaders = {}} = user
    return async (apiPath, postParams, apiDesc) => {
        let options = {
            url: remote_api + apiPath,
            rejectUnauthorized: false,
            headers: {
                ...otherheaders,
                token, jwtoken // 这里提供身份验证的token，注意命名为：jwtoken
            },
            body: postParams,
            json: true,
        }
        let funPromise = (method === 'post') ? request.postAsync(options) : request.getAsync(options.url+"?"+joinParamsForGet({
            ...postParams, ...(options.headers)
        }))
        let {body} = await funPromise
        if (apiDesc) {
            docapi.push([apiDesc, options.uri, postParams, body])
        }
        if (method !== 'post') {
            try {
                body = JSON.parse(body)
            } catch (err) {
                console.error(`error in class2api ...JSON.parse(body) :`)
                console.error(err)
            }
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
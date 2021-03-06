import md5 from 'md5'
import Promise from 'bluebird';
import fetch from 'node-fetch';
import path from "path";

/**
 * 获得对象的MD5签名，按排序的key-value拼接字符串计算，value中的对象做JSON.stringify处理
 * @param param
 * @param secret
 * @param whiteProps
 * @param onlyAppendKeyValue
 * @returns {string}
 */
export const getSignParamsInMD5 = ({param={},secret='',whiteProps=[],onlyAppendKeyValue=false})=> {
    let whiteList = ['pfx', 'partner_key', '_sign', 'sign', 'key', ...whiteProps]
    const querystring = Object.keys(param).filter(function (key) {
        return param[key] !== undefined && param[key] !== '' && whiteList.indexOf(key) < 0;
    }).sort().map((key) => key + '=' + JSON.stringify(param[key])).join("&") + (onlyAppendKeyValue ? "&key=" : '') + secret;
    return md5(querystring).toUpperCase();
}

/**
 * 早期API，请换用getSignParamsInMD5来调用
 * 对参数对象进行签名，签名结果以_sign结果混合在params中输出
 * @param param
 * @param secret
 * @returns {{_sign: string}}
 */
export const signParamsWithMD5 = ({param,secret})=> {
    let _sign = getSignParamsInMD5({param,secret});
    return {...(param||{}), _sign}
}

/**
 * 对收到的参数对象进行md5签名验证，参数中需要求包含_sign属性
 * @param paramsSigned
 * @param secret
 * @returns {{err: null, success: boolean}|{err: string, success: boolean}}
 */
export const varifyParamsWithMD5 = ({paramSigned,secret})=> {
    if(!paramSigned._sign)
        return {success:false, err:'NO_SIGN'}
    if(!secret)
        return {success:false, err:'NO_SECRET'}
    let _signAgian = getSignParamsInMD5({param:paramSigned,secret});
    if(_signAgian !== paramSigned._sign)
        return {success:false, err:'SIGN_WRONG',_needSign:paramSigned._sign,_reSign:_signAgian}
    return {success:true, err:null}
}

/**
 * 从express的request中获取请求方的IP地址
 * @param req
 * @returns {*}
 */
export const getClientIp = (req) => {
    try {
        return req.headers['x-real-ip'] ||
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    } catch (err) {
        return "-not-get-ip"
    }
}

/**
 * 等待指定毫秒时间后再继续执行
 * @param ms
 * @returns {Promise}
 */
export const sleep = (ms)=>{
    return new Promise((resolve, reject) => {
        setTimeout(_ => resolve(ms), ms);
    });
}

/**
 * 主动制造一个奔溃，让程序马上停止下来，内部时setTime机制，所以不受外围的try-catch的限制
 * @param title
 */
export const crash = (title)=>{
    setTimeout(()=>{
        throw new Error(title||'主动crash')
    },20)
}

/**
 * 延迟指定时间执行函数，并捕获错误
 * @param fun
 * @param ms
 * @param errerhandle
 */
export const delayRun = (fun, ms, errerhandle)=> {
    setTimeout(async () => {
        try {
            await fun();
        } catch (err) {
            if (errerhandle)
                errerhandle(err);
            else {
                console.error("error in delayRun:");
                console.error(err);
            }
        }
    }, ms||0);
}

/**
 * 获取给定字符串的hashcode值
 * @param str
 * @returns {number}
 */
export const hashcode = (str) => {
    let hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

/*
获取package中的系统名
*/
export const  load_package_name = ()=> {
    let {name = ''} = require(path.join(process.cwd(), 'package.json'));
    let applicationName = name.split(".")[0]
    if (!applicationName)
        throw new Error(`业务系统名获取失败，权限管理认证将失效，请确认存在package.json且其中已配置name属性`)
    return applicationName
}

// let res_promise = parallelCallWithPromise({url:'.....'});
// let value = await result;

export const parallelInvokeWithPromise = ({url, params={}, timeout = 3000})=> {
    return new Promise(async (resolve, reject) => {
        try {
            let options = {
                method: "post",
                rejectUnauthorized: false,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                json: true,
                body: JSON.stringify(params),
                timeout
            }
            let res = await fetch(url, options);
            let body = await res.json()
            let {err, result} = body
            if (err) {
                reject({err: err.message, result: null})
            } else {
                resolve({err: null, result})
            }
        } catch (err) {
            console.error(err.stack)
            reject({err: err.message, result: null})
        }
    })
};



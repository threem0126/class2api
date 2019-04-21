import md5 from 'md5'

/**
 * 获得对象的MD5签名，按排序的key-value拼接字符串计算，value中的对象做JSON.stringify处理
 * @param param
 * @param secret
 * @returns {string}
 */
export const getSignParamsInMD5 = ({param,secret})=> {
    const querystring = Object.keys(param).filter(function (key) {
        return param[key] !== undefined && param[key] !== '' && ['pfx', 'partner_key', 'sign', 'key'].indexOf(key) < 0;
    }).sort().map((key) => key + '=' + JSON.stringify(param[key])).join("&") + "&key=" + secret;
    return md5(querystring).toUpperCase();
}

/**
 * 从express的request中获取请求方的IP地址
 * @param req
 * @returns {*}
 */
export const getClientIp = (req) => {
    try {
        return req.headers['x-forwarded-for'] ||
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
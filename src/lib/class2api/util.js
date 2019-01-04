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
 * 产生指定长度的随机乱码字符串
 * @param len
 * @returns {string}
 */
export const getNonceStr = (len = 16) => {
    let seed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let str = ""
    while (len--) {
        str += seed.split("")[Math.floor(Math.random() * seed.length)]
    }
    return str
}

/**
 * 验证
 * @param phone
 * @returns {boolean}
 */
export const checkPhoneFormat = (phone)=> {
    return (/^1[1234567890]\d{9}$/.test(phone))
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
        throw title||'主动crash'
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
    var hash = 0, i, chr, len;
    if (str.length === 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

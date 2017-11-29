
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
    return (/^1[34578]\d{9}$/.test(phone))
}

export const sleep = (ms)=>{
    return new Promise((resolve, reject) => {
        setTimeout(_ => resolve(ms), ms);
    });
}

export const crash = (title)=>{
    setTimeout(()=>{
        throw title||'主动crash'
    },20)
}

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




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

export const delayRun = (fun, ms, errerhandle)=> {
    setTimeout(async ()=> {
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
    }, ms);
}

export const makeToken = (id) => {
    let key = "gankaouser888"
    return `user_id_${id}_${MD5(id + key)}`
}


export const getNonceStr = (len = 16) => {
    let seed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let str = ""
    while (len--) {
        str += seed.split("")[Math.floor(Math.random() * seed.length)]
    }
    return str
}
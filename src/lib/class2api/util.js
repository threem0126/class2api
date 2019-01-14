
//浏览器信息
const getBrowserInfo = (userAgent) => {
    const agent = userAgent.toLowerCase()
    //ie
    if (agent.indexOf("compatible") > -1 && agent.indexOf("msie" > -1)) {
        const reIE = new RegExp("msie (\\d+\\.\\d+);")
        reIE.test(agent)
        const fIEVersion = parseFloat(RegExp["$1"])
        if (fIEVersion == 7) {
            return "IE/7"
        } else if (fIEVersion == 8) {
            return "IE/8"
        } else if (fIEVersion == 9) {
            return "IE/9"
        } else if (fIEVersion == 10) {
            return "IE/10"
        }
    } //isIE end
    if (agent.indexOf('trident') > -1 && agent.indexOf("rv:11.0") > -1) {
        return "IE/11";
    }
    //firefox
    if (agent.indexOf("firefox") > 0) {
        return agent.match(/firefox\/[\d.]+/gi)
    }
    //Safari
    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        return agent.match(/safari\/[\d.]+/gi)
    }
    //Chrome
    if (agent.indexOf("chrome") > 0) {
        return agent.match(/chrome\/[\d.]+/gi)
    }
}

//用户浏览器的设备信息
const getDeviceInfo = (userAgent) => {
    let UA = userAgent||window.navigator.userAgent;
    try {
        const browser = getBrowserInfo(userAgent)
        const browserName = (browser + "").replace(/[0-9./]/ig, "")
        const browserVersion = parseInt((browser + "").replace(/[^0-9.]/ig, ""))

        let platform = '其他'
        if (/ipad/i.test(userAgent)) {
            if (/gankao/i.test(userAgent)) platform = 'ipad app'
            else platform = 'ipad'
        } else if (/iphone os/i.test(userAgent)) {
            if (/gankao/i.test(userAgent)) platform = 'iphone app'
            else platform = 'iphone'
        } else if (/android/i.test(userAgent)) {
            if (/gankao/i.test(userAgent)) platform = 'android app'
            else platform = 'android'
        } else if (/mac os/i.test(userAgent)) {
            platform = 'mac'
        } else if (/windows nt 5.1/i.test(userAgent)) {
            platform = 'win XP'
        } else if (/windows nt 6.0/i.test(userAgent)) {
            platform = 'win Vista'
        } else if (/windows nt 6.1/i.test(userAgent)) {
            platform = 'win 7'
        } else if (/windows nt 6.2/i.test(userAgent)) {
            platform = 'win 8'
        } else if (/windows nt 6.3/i.test(userAgent)) {
            platform = 'win 8.1'
        } else if (/windows nt 10/i.test(userAgent)) {
            platform = 'win 10'
        } else {
            platform = '其他'
        }

        return {
            browserName,
            browserVersion,
            platform
        }
    } catch (e) {
        return {
            browserName: '未知',
            browserVersion: '未知',
            platform: '未知'
        }
    }
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

/**
 * 将手机号中间的4位打掩码
 * @param mobile
 * @returns {string}
 */
export const maskMobile = (mobile)=> {
    return mobile.substr(0, 3) + '****' + mobile.substr(7, 4)
}

/**
 * 获取剩余时间的时间段表达法
 * @param leftMiSecond
 * @returns {string}
 */
export const formatRemainTime = (leftMiSecond) => {
    let days = parseInt(leftMiSecond / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
    let hours = parseInt(leftMiSecond / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
    let minutes = parseInt(leftMiSecond / 1000 / 60 % 60, 10);//计算剩余的分钟
    let seconds = parseInt(leftMiSecond / 1000 % 60, 10);//计算剩余的秒数
    days = checkTime(days);
    hours = checkTime(hours);
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    return (days > 0 ? (days + "天") : '') + (hours > 0 ? (hours + "小时") : "") + (minutes > 0 ? (minutes + "分") : '') + seconds + "秒"
}

/**
 * 获取顶层窗口
 * @returns {Window}
 */
export const topWindow = ()=> {
    try {
        //试探是否有跨域错误
        let link = window.top.document.location.href
        return window.top
    } catch (err) {
        if (err.message.indexOf("cross-origin frame") !== -1) {
            console.warn(`本代码在iframe内部页面中运行，在获取window.top时报错，涉及跨域,相关信息依然从window获取。如是顶层frame页面是gankao二级域名，请确保将document.domain设置为 gankao.com`)
        }
        return window
    }
}

/**
 * 获取当前网页的地理位置，内部兼容微信环境
 * @returns {Promise}
 */
export const getLocatinGeo = () => {
    return new Promise((resolve, reject) => {
        if (typeof window !== "object") {
            reject("非客户端环境，无法获取经纬度")
            return
        }
        if (false && window.wx) {
            window.wx.getLocation({
                type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                success: (res) => {
                    const lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                    const lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                    resolve({lng, lat})
                },
                fail: (res) => {
                    resolve({lng: 0, lat: 0})
                }
            });
        } else if (navigator.geolocation && navigator.geolocation.getCurrentPosition) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = parseFloat(position.coords.latitude); // 纬度，浮点数，范围为90 ~ -90
                    const lng = parseFloat(position.coords.longitude); // 经度，浮点数，范围为180 ~ -180。
                    resolve({lng, lat})
                },
                (error) => {
                    let errMsg = "";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errMsg = "用户拒绝对获取地理位置的请求。";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errMsg = "位置信息是不可用的。";
                            break;
                        case error.TIMEOUT:
                            errMsg = "请求用户地理位置超时。";
                            break;
                        case error.UNKNOWN_ERROR:
                            errMsg = "未知错误。";
                            break;
                        default:
                            errMsg = "未知错误。";
                    }
                    reject(errMsg)
                }
            );
        } else {
            reject('没有获得经纬度信息的接口')
        }
    });
}


/**
 * 读取cookie
 * @param name
 * @returns {*}
 */
export const getCookie = (name) => {
    if (typeof document !== "object") {
        return null;
    }
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

/**
 * 设置cookie
 * @param name
 * @param value
 */
export const setCookie = (name, value) => {
    if (typeof document !== "object") {
        return
    }
    let Days = 30;
    let exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

 /**
 * 比较A、B两个版本号的大小; 比如 (1.2.3, 1.3.3)
 * @param versionA
 * @param versionB
 * @returns {boolean}
 */
export const isVersionALargeThanVersionB = (versionA, versionB) => {
    let curs = (versionA || '').split(".").map(m => parseInt(m));
    let tragets = (versionB || '').split(".").map(m => parseInt(m));
    let retValue = false;
    for (let i = 0; i < curs.length; i++) {
        let curItem = curs[i];
        let targetItem = tragets[i];
        // console.error(`${curItem} / ${targetItem}`)
        if (curItem > targetItem) {
            //直接出结果，当前版本更大
            retValue = true
            break;
        } else if (curItem < targetItem) {
            //直接出结果，当前版本更小
            retValue = false
            break;
        } else {
            //本轮势均力敌，进入下一回合
        }
    }
    return retValue
};

let _isWxMiniDetected = false;
let _isWxMini =false;
let _runTime_result ;

const isWxMini = ()=> {
    return new Promise((resolve, reject) => {
        try {
            if (_isWxMiniDetected)
                return _isWxMini;
            else {
                if(window.top.wx ){
                    //部分浏览器内，getEnv不会触发回调，假设正常回调不会超过300毫秒，超过300毫秒的，视为非小程序环境
                    let _isWxMini_timer = setTimeout(()=>{
                        resolve(false);
                    },300)
                    // 检测是否为小程序环境
                    window.top.wx.miniProgram.getEnv( function(res){
                        clearTimeout(_isWxMini_timer);
                        _isWxMiniDetected = true;
                        // true or false
                        _isWxMini = res.miniprogram;
                        resolve(_isWxMini);
                    });
                }else{
                    resolve(false);
                }
            }
        } catch (err) {
            if(err.message.indexOf("cross-origin frame")!==-1) {
                console.warn(`本代码在iframe内部页面中运行，判断isWxMini时，在获取window.top.wx时报错，涉及跨域。如是顶层frame页面是gankao二级域名，请确保将document.domain设置为 gankao.com`)
            }
            resolve(false);
        }
    });
}


/**
 * 判断当前浏览器的运行环境，内置赶考APp、小程序、世纪守护等判断
 * @returns {isServer, inapp, inxiaozhuliapp, inWeixin, isQQ, isAndroid, isOnPc, iOS, isSJSH, isMiniProgram, isWeizhan, _deviceInfo}
 */
export const runTime = () => {
    let ret = {}
    if (typeof window === "object") {
        if (_runTime_result)
            return _runTime_result;
        let UA = window.navigator.userAgent;
        ret.isServer = false
        ret.inapp = (UA.indexOf("gankao") !== -1);
        ret.inxiaozhuliapp = (UA.indexOf("gkagent") !== -1);
        ret.inWeixin = (UA.indexOf("MicroMessenger") !== -1);
        ret.isQQ = UA.indexOf("QQ") !== -1;
        ret.isAndroid = (UA.toLowerCase().indexOf("android") !== -1);
        ret.iOS = (UA.indexOf("iPad") !== -1 || UA.indexOf("iPhone") !== -1);
        ret.isOnPc = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent));
        //ret.isSJSH = (getCookie('PARTNER_APP_ID') ==='sjsh');
        ret.isSJSH = (UA.toLowerCase().indexOf("sjsh") !== -1);
        if (!ret.inWeixin) {
            ret.isMiniProgram = false;
        } else {
            //部分安卓机型会显示miniprogram
            ret.isMiniProgram = (UA.toLowerCase().indexOf("miniprogram") > -1);
            if (!ret.isMiniProgram) {
                ret.isMiniProgram = (window.__wxjs_environment === 'miniprogram')
                if (!ret.isMiniProgram) {
                    (async () => {
                        ret.isMiniProgram = await isWxMini();
                    })();
                }
            }
        }
        try {
            ret.isWeizhan = ((window.top.document.location.href || '').toLowerCase().indexOf("weizhan.") > -1);
        } catch (e) {
            if (e.message.indexOf("cross-origin frame") !== -1) {
                console.warn(`获取window.top.document.location.href时报错，涉及跨域。如是顶层frame页面是gankao二级域名，请确保将document.domain设置为 gankao.com`)
            }
            ret.isWeizhan = false;
        }
        ret._deviceInfo = getDeviceInfo(UA)
        _runTime_result = ret
    } else {
        ret.isServer = true
    }
    return ret
}
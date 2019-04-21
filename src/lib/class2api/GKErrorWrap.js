
if(!JSON.stringifyline) {
    JSON.stringifyline = function (Obj) {
        return JSON.stringify(Obj, null, 2)
    }
}

let errCodes = {}

/*
 错误信息生成器，高阶函数
 */
export const GKErrorWrap = (errCode, errMessage)=> {
    if (errCodes[errCode])
        throw new Error(`错误码被重复定义(${errCode},${errCodes[errCode]})`)
    errCodes[errCode] = errMessage
    return (more) => {
        let moreStr = ''
        if (more) {
            moreStr = ((typeof more === "string") ? more : JSON.stringifyline({...more}))
        }
        let ret = new Error()
        ret._gankao = 1;
        ret.code = errCode;
        if (!moreStr) {
            ret.message = errMessage;
        } else if (!errMessage) {
            ret.message = moreStr;
        } else {
            ret.message = `${errMessage} (${moreStr})`;
        }
        ret.more = moreStr;
        return ret
    }
}
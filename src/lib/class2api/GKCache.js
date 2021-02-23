import {getCacheManage} from "./Decorators";
import {load_package_name} from "./util";

let _appName;

export const rememberCache = async (keyname, second, callback)=> {
    if(typeof window ==="object")
        throw new Error('rememberCache函数仅限于Server端运行！无法在浏览器端中')
    _appName = _appName || load_package_name();
    let key = `gkcache_${_appName}-${keyname}`;
    let __cachem = getCacheManage();
    let avalue = __cachem.get(key);
    if (avalue)
        return avalue;
    avalue = callback()
    setImmediate(() => {
        __cachem.set(key, second, avalue);
    })
    return avalue;
}


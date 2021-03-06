import express from 'express';
import {keys} from 'lodash';
import url from 'url'
import { Router } from 'express';

const router = new Router();
const _config_endpoint = {};
const isDeveloping =  process.env.NODE_ENV === 'development';

let router_listen_created = false

// let apiLimiter = new RateLimit({
//     windowMs: 15*60*1000, // 15 minutes
//     max: 1000,
//     statusCode:200,
//     delayMs: 0, // disabled,
//     handler:function (req, res, next) {
//         res.json({err: '请求过于频繁，请稍后重试', result:''})
//     }
// });
// {req,res,result}
const _bindRouter = async (BusinessModel, fn_beforeCall, fn_afterCall, frontpage_default )=> {
    if (fn_beforeCall) {
        if (typeof fn_beforeCall !== 'function') {
            throw new Error('fn_beforeCall必须是function类型的参数');
        }
    }
    if (fn_afterCall) {
        if (typeof fn_afterCall !== 'function') {
            throw new Error('可选参数fn_afterCall必须是function类型的参数');
        }
    }
    let resWrap = async ({req, result}) => {
        return fn_afterCall ? await fn_afterCall({req, result}) : result
    }
    let result;
    let _BusinessModel = BusinessModel;
    let _frontpage_default = frontpage_default;
    let router = express.Router();
    //开放get请求方式（注意：此时无法head传值）
    // router.get('*', async function (req, res, next) {
    //     res.json({err: 'get请求方式未实现, 仅限Post方式', result: null});
    // });
    router.all('*', async function (req, res, next) {
        try {
            let pathItems = req.path.split("/");
            let methodName = pathItems[1] ? pathItems[1] : null;
            if (!_BusinessModel[methodName]) {
                throw new Error(`api请求的地址(${req.originalUrl})中对应的类(${_BusinessModel.name})不存在${methodName}方法,请确认映射的类是否正确!`);
            }
            if (!req.body && !res.query) {
                throw new Error(`api请求中的body和query都为空，没有提交内容传入!`);
            }
            //queryObj是对早期传值方式的兼容（早期会将所有参数包裹在queryObj属性里）
            let source = req.method === 'POST' ? req.body : req.query
            let {queryObj = source} = source;
            let params = queryObj;
            let paramsMerged = null;

            params.___frontpageURL = url.parse(req.headers['frontpage'] || _frontpage_default || '');

            if (fn_beforeCall && typeof fn_beforeCall === 'function') {//如果有要对传入参数做验证，则在fn_beforeCall中处理
                let modelSetting = _BusinessModel.__modelSetting ? _BusinessModel.__modelSetting() : {};
                let apipath = `${_BusinessModel.name}.${req.path}`
                paramsMerged = await fn_beforeCall({apipath, req, res, params, modelSetting});
                if(paramsMerged && typeof paramsMerged === 'function') {
                    res.json(await paramsMerged())
                    return
                }
            }
            //合并入req对象
            result = await _BusinessModel[methodName]({...(paramsMerged || params), req, res});

            //反转控制，如果返回的结果时函数，则取值后直接作为返回结构，这里主要是为了兼容一些特殊的返回数据结构
            if (typeof result === "function") {
                let inner_result = result();
                if (typeof inner_result === "object") {
                    res.json(await resWrap({req, res, result: inner_result}))
                } else {
                    res.end((inner_result || '').toString())
                }
                return
            }

            //如果是对象（非简单数据类型），则必须包含key／value结构
            if (typeof result !== "object" || keys(result).length === 0) {
                throw new Error(`接口返回值必须包含key／value结构（因此也不能为null值），接口${req.originalUrl}类的${methodName}方法返回的数据结构不具有key/value结构，请适配调整以符合规范!`);
            }
            //API方法内部做了重定向，或者自操作res输出
            let {__redirected, __customResp} = result
            if (__redirected || __customResp)
                return

            if(!result) {
                let msg = `接口返回值必须包含key／value结构（因此也不能为null值），接口${req.originalUrl}类的${methodName}方法返回的数据结构不具有key/value结构，请适配调整以符合规范!`
                console.error(msg)
                if (process.env.NODE_ENV !== "production") {
                    throw new Error(msg);
                }
            }

            let retData = {err: null, result: result}
            res.json(await resWrap({req, res, result: retData}));
            if (process.env.NODE_ENV !== "production" && process.env.PRINT_API_RESULT === "1") {
                console.log(`api call result from(${req.originalUrl}):${JSON.stringifyline(retData)}`);
            }
        } catch (err) {
            if (process.env.NODE_ENV !== "production") {
                //region 让错误直接抛出，并终止程序。不需要时可以整体注释掉
                // console.dir(`这里：除了程序逻辑级别的Exception错误，在非正式环境会终止程序，便于调试排查。不需要时可以找到我的位置并注释掉`);
                // if (!err._gankao || process.env.StopOnAnyException == '1') {
                //     //通过timeout排除错误，会导致程序终止
                //     setTimeout(() => {
                //         throw err;
                //     });
                // } else {
                //     //程序逻辑级别的Exception，输出到控制台即可
                // }
                console.error(err);
                if (process.env.NODE_ENV !== "production") {
                    console.error(err.stack);
                }
                //endregion
            } else {
                console.error(err);
            }
            if (process.env.NODE_ENV !== "production") {
                //非生产环境下，多输出详细的错误栈
                res.json(await resWrap({
                    req,
                    res,
                    result: {err: {...err, message: err.message, stack: err.stack}, result: null}
                }));
            } else {
                res.json(await resWrap({req, res, result: {err:{...err,message: err.message}, result: null}}));
            }
        }
    });
    return router
};

// /**
//  * 原EndPointMap类的默认方法，移植过来了。在服务器端渲染React组件路由时调用
//  * @param api_endpint
//  * @param methodName
//  * @param params
//  * @returns {Promise.<*>}
//  * @constructor
//  */
// export const EndPointMap_forServerRender = async (api_endpint, methodName,  params)=> {
//     try{
//         if (_config_endpoint[api_endpint] && _config_endpoint[api_endpint][methodName] && typeof _config_endpoint[api_endpint][methodName] === "function") {
//             let result = await _config_endpoint[api_endpint][methodName](params);
//             return result;
//         } else {
//             const error = `指定的方法${methodName}或入口模块${api_endpint}未定义`;
//             throw error;
//         }
//     }catch(err){
//         if (isDeveloping) {
//             setTimeout(()=> {
//                 throw err
//             });
//         }
//     }
// }

export const CreateListenRouter = async (options)=> {

    if (router_listen_created)
        return router

    let {apiroot, modelClasses, beforeCall, afterCall, method404, frontpage_default} = options

    //router.use(apiLimiter);
    for (let classObj of modelClasses) {
        if (typeof classObj === "function") {
            router.use(`/${classObj.name.toLowerCase()}`, await _bindRouter(classObj, beforeCall, afterCall));
            console.log(`mapped class '${classObj.name}' to '${apiroot}${classObj.name.toLowerCase()}/*' ... OK!`)
        } else {
            let {model, as} = classObj
            if (model && as) {
                let aPath = (as || model.name).toLowerCase()
                router.use(`/${aPath}`, await _bindRouter(model, beforeCall, afterCall, frontpage_default));
                console.log(`mapped class '${model.name}' to '${apiroot}${aPath}/*' ... OK!`)
            } else {
                throw new Error(`modelClasses参数中${classObj}的对象不是有效的Class类或{model,as}结构定义`)
            }
        }
    }

    //API的存活探针
    router.all('/helloworld',  (req, res, next) => {
        console.log('hello ... ');
        res.end('hello');
    });

    //拦截未匹配到的其他方法
    router.all('*', async (req, res, next) => {
        try {
            if (typeof method404 === 'function') {
                await method404(req, res)
            } else {
                if (process.env.NODE_ENV === "production") {
                    res.status = 404;
                    res.json({err: 'API Not Defined!', result: null})
                } else {
                    let retObj = {err: `API方法未定义(${ req.path }, 请确认类是否存在或类的名称是否有变更！)`, result: null}
                    console.error(JSON.stringify(retObj))
                    res.json(retObj);
                }
            }
        } catch (err) {
            res.status = 404;
            res.json({err: `404处理错误(${JSON.stringify(err)})`, result: null});
        }
    });

    router_listen_created = true;
    return router
}

console.dir("Nice to meet U, I will help You to map Class to API interface ....");
import express from "express";
import cookieParser from "cookie-parser";
import url from 'url'
import {filter} from 'lodash'
import bodyParser from "body-parser";
import compression from "compression";
import {MultiProccessTaskThrottle} from './taskThrottle'
import loggerCreator from "./logger.js";
import log4js from 'log4js';
import * as ModelProxy  from './ModelProxy';
import {modelSetting, cacheAble, clearCache, crashAfterMe, getCacheManage}  from './Decorators';
import {setting_redisConfig, getting_redisConfig, getRedisClient} from './redisClient';
import {GKErrorWrap} from './GKErrorWrap'
import {setting_CustomRuleValidator} from '../rulehelper/index'

const logger = loggerCreator();
let allow_Header = ['cros_origin_hint','Origin', 'refererClientProvide', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'jwtoken', 'gkauthorization', 'token', 'frontpage', 'withCredentials', 'credentials'].map(item => item.toLowerCase())
let _server;
let _router;

let defaultTrustDomains = [
    '.gankao.com',
    '.gygaokao.com',
    '.gankao100.com',
    '.gankaodashi.com'
]

const _create_server = async (model, options)=> {

    //当options为class时，做转化封装
    if(typeof options ==="function" &&  options instanceof Object){
        options = {modelClasses:[options]}
    }

    let {config, custom, modelClasses, beforeCall, afterCall, method404} = options
    // if (model==='server' && typeof config !== "function") {
    //     throw  `server模式下，配置参数中必需传入config[Function]属性`
    // }

    let {
        cros = true,
        cros_headers = [],
        cros_origin = [],
        frontpage_default = '', //与从前端请求传过来header中的frontpage合并，优先获取客户端的，其实采用此默认值。最后封装为标准url对象并绑定到API方法回调的params对象的___frontpageURL属性上
        apiroot = '/',
        redis
    } = (typeof config === "function") ? config() : (config || {})

    if (redis) {
        await setting_redisConfig(redis)
        await getRedisClient()
    }
    let _modelClasses = (typeof modelClasses === "function") ? modelClasses() : (modelClasses || [])
    if (!(_modelClasses instanceof Array)) {
        throw new Error(`无法识别指定的类清单，因为modelClasses配置项格式有误，期望是Array列表`)
    }
    _router = await _create_router({
        apiroot,
        modelClasses: _modelClasses,
        beforeCall,
        afterCall,
        method404,
        frontpage_default
    })

    //利用外部的express实例，只返回路由对象
    if (model === 'router') {
        // API相关路由,在main内部映射到各个功能Model
        console.log(`以路由绑定模式开启class2api，cros跨域设置、session、等配置都将忽略，由外部的express实例控制！`)
        return _router
    }

    // Security
    _server = express();
    _server.disable("x-powered-by");
    _server.use(bodyParser.json()); // for parsing application/json
    _server.use(bodyParser.urlencoded({extended: true}));// for parsing application/x-www-form-urlencoded
    _server.use(bodyParser.json({limit: "5000kb"}));
    // _server.use(hpp());
    // _server.use(helmet.xssFilter());
    // _server.use(helmet.frameguard("deny"));
    // _server.use(helmet.ieNoOpen());
    // _server.use(helmet.noSniff());
    _server.use(cookieParser());
    _server.use(compression());
    _server.use(log4js.connectLogger(logger, {level: log4js.levels.INFO, format: ':method :url'}));

    //session 禁用
    //
    //启用Session，可选Redis存储。PM2集群模式时，必须用分布式存储
    // let sessionOpt = {
    //     secret: sessionSecret,
    //     key: sessionKey,
    //     resave: false,
    //     saveUninitialized: true,
    //     cookie: {maxAge: 8000 * 1000}
    // }
    // if (sessionUseRedis) {
    //     if(!redis) {
    //         throw  `开启sessionUseRedis时，必需定义redis配置`
    //     }
    //     //REDIS_SESSION
    //     const RedisStore = connectRedis(session);
    //     sessionOpt.store = new RedisStore({
    //         host: redis.host,
    //         port: redis.port,
    //         pass: redis.password || ''
    //     })
    //     console.log('Session存储方式：Redis ....')
    // } else {
    //     console.log('Session存储方式：进程内存 ....')
    // }
    // _server.use(session(sessionOpt));
    // if (staticPath) {
    //     _server.use(express.static(staticPath));
    // }

    if (cros) {
        //设置跨域访问
        cros_origin = cros_origin.map(item => item.toLowerCase())
        cros_headers = cros_headers.map(item => item.toLowerCase())
        //注意下方还有一个独立Export的工具函数responsiveCrosOriginForGankaoDomain，维护时需同步修改
        _server.use(responsiveCrosOriginForGankaoDomainMiddleWare_HOC(cros_origin));
    }

    if (typeof custom === "function") {
        _server = await custom(_server)
    }

    _server.use(apiroot, _router)

    // catch 404 and forward to error handler
    _server.use(function (req, res, next) {
        res.status = 404;
        res.json({err: 'API Not Defined!', result: null})
    });

    return _server
}

const _create_router = async ({apiroot, modelClasses: _modelClasses, beforeCall, afterCall, method404, frontpage_default})=> {
    return await ModelProxy.CreateListenRouter({
        apiroot,
        modelClasses: _modelClasses,
        beforeCall,
        afterCall,
        method404,
        frontpage_default
    })
}

/**
 * 以Server（内置Express）的方式运行API微服务
 *
 * @param options
 * @returns {Promise.<*>}
 */
export const createServer = async (options)=> {
    if (!_server)
        _server  = await _create_server('server', options)
    return _server
}

const responsiveCrosOriginForGankaoDomainMiddleWare_HOC =(crosOriginSetting)=> {
    let _cros_origin_setting = {...crosOriginSetting}
    return function (req, res, next) {
        return responsiveCrosOriginForGankaoDomainMiddleWare(req, res, next, _cros_origin_setting)
    }
}

/**
 * class2api内部对Options跨域预请求的动态响应，独立版本
 * @param req
 * @param res
 * @param next
 * @param _cros_origin_setting
 */
const responsiveCrosOriginForGankaoDomainMiddleWare = function (req, res, next, crosOriginSetting  ) {
    let Origins = '*';
    let {origin, trustDomains = []} = crosOriginSetting || {}
    if (origin) {
        Origins = origin;
    } else {
        //Access-Control-Allow-Origin值动态响应，不再笼统的输出"*"
        //仅限，针对赶考网下的域名做跨域授权，避免'*'带来的安全隐患
        //客户端，ApiProxy组件默认已配置跨域请求，用superagent和fetch的，需要单独配置withCredentials
        let referer = req.get('referer') || req.get('refererClientProvide') ||  ''
        if (referer) {
            let urlObj = url.parse(referer);
            //请求域名存在于defaultTrustDomains以及_cros_origin_setting.trustDomains白名单中
            if (filter([...defaultTrustDomains, ...trustDomains], item => urlObj.hostname.indexOf(item) !== -1).length > 0) {
                Origins = urlObj.protocol + '//' + urlObj.hostname + ((urlObj.port) ? `:${urlObj.port}` : '')
            }
            // 'http://local.gankao.com:3000'
            // {"protocol":"http:","slashes":true,"auth":null,"host":"local.gankao.com:3000","port":"3000","hostname":"local.gankao.com","hash":null,"search":null,"query":null,"pathname":"/","path":"/","href":"http://local.gankao.com:3000/"}
            // {"protocol":"https:","slashes":true,"auth":null,"host":"local.gankao.com:80","port":"80","hostname":"local.gankao.com","hash":null,"search":null,"query":null,"pathname":"/","path":"/","href":"https://local.gankao.com:80/"}
            // {"protocol":"https:","slashes":true,"auth":null,"host":"local.gankao.com","port":null,"hostname":"local.gankao.com","hash":null,"search":null,"query":null,"pathname":"/","path":"/","href":"https://local.gankao.com/"}
        }
        res.header("refererlog", 'from referer or refererClientProvide:' + referer);
    }
    res.header("Access-Control-Allow-Origin", Origins);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "HEAD,OPTIONS,POST");
    res.header("Access-Control-Allow-Headers", " " + allow_Header.join(", "));
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
}

/**
 * 以Express-Router的方式运行API微服务，通常用于在独立的Express站点中增加一个子路由来实现API服务入口
 *
 * @param options
 * @returns {Promise.<*>}
 */
export const createServerInRouter = async (options)=> {
    if (!_router)
        _router = await _create_server('router', options)
    return _router
}


/**
 * 快速封装一个{success: true}结构的对象，代表当前API的业务操作成功。可附带扩展属性
 * @param ps
 * @returns {{success: boolean}}
 * @constructor
 */
export const GKSUCCESS = (ps) => {
    if (ps) {
        return {success: true, ...( (ps instanceof Object) ? ps : {msg: ps})}
    } else {
        return {success: true}
    }
}

export {
    /**
     * 预设内置Redis对象的连接参数
     *      redis: {
     *         host: "127.0.0.1",
     *         port: 6379,
     *         cache_prefx: '_no_set_', //内置redis对所有存取的key都附加上的前缀，以避免多应用共享redis存储时发生key命名冲突
     *         password:'123',  //密码可选
     *         defaultExpireSecond: 10 * 60
     *     },
     */
        setting_redisConfig,
    /**
     * 获得内置的Redis运行实例
     */
        getRedisClient,
    /**
     * 自定义错误的封装函数，可以构造指定结构的错误对象
     */
        GKErrorWrap,
    /**
     * Class业务类的元信息配置对象，通过类修饰器的方式在每个类Class上设定
     * 预设的元信息有：
     *   __needAuth属性：可选，函数，提供权限认证，只有返回true时，框架才继续调用内部的方法。返回false时，接口返回GKErrors._NOT_ACCESS_PERMISSION的错误
     */
        modelSetting,
    /**
     * 类静态方法的修饰器，用来标记框架是否可以缓存该方法的运行结果。
     * 修饰器需要传入{cacheKeyGene:[Function]}对象，cacheKeyGene函数返回的字符串值作为缓存数据在redis中存储的key。
     */
        cacheAble,
    /**
     * 类静态方法的修饰器，用来标记本方法运行之后清除哪个key值的Redis缓存。
     * 修饰器需要传入{cacheKeyGene:[Function]}对象，cacheKeyGene函数返回的字符串值作为要删除的存储key。
     */
        clearCache,
    /**
     * 类静态方法的修饰器，用来标记在本方法执行后，立即抛出错误来终止程序运行，处于调试目的，仅在非production环境下有效。
     */
        crashAfterMe,

    getCacheManage,

    /**
     * 通过模块来全局配置权限验证函数
     */
        setting_CustomRuleValidator,

    /**
     * cluster多线程环境下的定时任务执行器，内部带有互斥的锁机制，确保同一时间不会并发处理
     * 内部依赖于redis来存储锁状态，需提前调用setting_redisConfig进行配置redis链接信息
     */
        MultiProccessTaskThrottle,

    /**
     * class2api内部对Options跨域预请求的动态响应，只要来自内部defaultTrustDomains所设定的默认信任主域的请求，都会自动输出为refer请求的域名
     */
        responsiveCrosOriginForGankaoDomainMiddleWare,

    /**
     * responsiveCrosOriginForGankaoDomainMiddleWare的高阶函数版本，可以接收扩充自定义的信任主域名
     */
        responsiveCrosOriginForGankaoDomainMiddleWare_HOC
}
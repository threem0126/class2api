console.dir("Nice to meet U, I will help You to map Class to API interface ....");
import express from "express";
//import session from "express-session";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import bodyParser from "body-parser";
import compression from "compression";
//import connectRedis from "connect-redis";
import loggerCreator from "./logger.js";
import log4js from 'log4js';
import * as ModelProxy  from './ModelProxy';
import {modelSetting, cacheAble, clearCache, crashAfterMe, accessRule}  from './Decorators';
import {getGankaoWXAuthToken, setting_redisConfig, getting_redisConfig, getRedisClient} from './redisClient';
import {GKErrorWrap} from './GKErrorWrap'
import {setting_CustomRuleValidator} from '../rulehelper/index'

const logger = loggerCreator();
let _server;
let _router;

const _create_server = async (model, options)=> {

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
        sessionKey = 'class2api',
        sessionSecret = 'class2api',
        sessionUseRedis = false,
        redis
    } = (typeof config === "function") ? config() : (config || {})

    if (redis) {
        await setting_redisConfig(redis)
        await getRedisClient()
    }
    let _modelClasses = (typeof modelClasses === "function") ? modelClasses() : (modelClasses || [])
    if (!(_modelClasses instanceof Array)) {
        throw `无法识别指定的类清单，因为modelClasses配置项格式有误，期望是Array列表`
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
    _server.use(hpp());
    _server.use(helmet.xssFilter());
    _server.use(helmet.frameguard("deny"));
    _server.use(helmet.ieNoOpen());
    _server.use(helmet.noSniff());
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
        let allow_Header = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'jwtoken', 'token', 'frontpage', 'withCredentials', 'credentials'].map(item => item.toLowerCase())
        _server.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", (cros_origin.length === 0) ? "*" : cros_origin.join(','));
            res.header("Access-Control-Allow-Credentials", "true");
            res.header("Access-Control-Allow-Methods", "HEAD,OPTIONS,POST");
            res.header("Access-Control-Allow-Headers", " " + [...allow_Header, ...cros_headers].join(", "));
            if ('OPTIONS' === req.method) {
                res.sendStatus(200);
            } else {
                next();
            }
        });
    }
    _server.use(apiroot, _router)

    if (typeof custom === "function") {
        let {express: cus_express_fn} = await custom()
        if (cus_express_fn) {
            _server = await cus_express_fn(_server)
        }
    }

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
     * 赶考网的临时辅助函数，用来获得存储在redis中的自定义token
     */
        getGankaoWXAuthToken,
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

    /**
     * 类静态修饰器，
     */
        accessRule,

    /**
     * 通过模块来全局配置权限验证函数
     */
        setting_CustomRuleValidator
}




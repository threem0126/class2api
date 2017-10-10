console.dir("Nice to meet U....");
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import bodyParser from "body-parser";
import compression from "compression";
import connectRedis from "connect-redis";
import loggerCreator from "./logger.js";
import {sortBy} from "lodash";
import log4js from 'log4js';
import * as ModelProxy  from './ModelProxy';
import {getGankaoWXAuthToken, setting_redisConfig, getting_redisConfig, getRedisClient} from './redisClient';
import {GKErrorWrap}   from './GKError';
import {modelSetting, cacheAble, clearCache, crashAfterMe, definedStaticField}  from './Decorators';

const logger = loggerCreator();
let _server;

const _create_server = async (options)=> {
    let {config, custom, modelClasses, beforeCall, afterCall, method404} = options
    let _config = config()
    let {
        cros = true,
        cros_headers=[],
        cros_origin=[],
        frontpage_default='', //与从前端请求传过来header中的frontpage合并，优先获取客户端的，其实采用此默认值。最后封装为标准url对象并绑定到API方法回调的params对象的___frontpageURL属性上
        apiroot = '/',
        sessionKey = 'class2api',
        sessionSecret = 'class2api',
        sessionUseRedis = false,
        staticPath = '',
        redis
    } = _config

    if (redis)
        setting_redisConfig(redis)

    _server = express();
    // Security
    _server.disable("x-powered-by");
    _server.use(bodyParser.urlencoded({extended: false}));
    _server.use(bodyParser.json({limit: "5000kb"}));
    _server.use(hpp());
    _server.use(helmet.xssFilter());
    _server.use(helmet.frameguard("deny"));
    _server.use(helmet.ieNoOpen());
    _server.use(helmet.noSniff());
    _server.use(cookieParser());
    _server.use(compression());
    _server.use(log4js.connectLogger(logger, {level: log4js.levels.INFO, format: ':method :url'}));

    //启用Session，可选Redis存储。PM2集群模式时，必须用分布式存储
    let sessionOpt = {
        secret: sessionSecret,
        key: sessionKey,
        resave: false,
        saveUninitialized: true,
        cookie: {maxAge: 8000 * 1000}
    }
    if (sessionUseRedis) {
        //REDIS_SESSION
        const RedisStore = connectRedis(session);
        sessionOpt.store = new RedisStore({
            host: _config.redis.host,
            port: _config.redis.port,
            pass: _config.redis.password || ''
        })
        console.log('Session存储方式：Redis ....')
    } else {
        console.log('Session存储方式：进程内存 ....')
    }
    _server.use(session(sessionOpt));
    //_server.use(morgan("combined"));
    if (staticPath) {
        _server.use(express.static(staticPath));
    }
    if (cros) {
        //设置跨域访问
        cros_origin = cros_origin.map(item => item.toLowerCase())
        cros_headers = cros_headers.map(item => item.toLowerCase())
        let allow_Header = ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'token'].map(item => item.toLowerCase())
        _server.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", (cros_origin.length===0)?"*":cros_origin.join(','));
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

    let {express: cus_express_fn} = await custom()
    if(cus_express_fn){
        _server = await cus_express_fn(_server)
    }

    let _modelClasses = modelClasses()

    // API相关路由,在main内部映射到各个功能Model
    _server.use(apiroot, await ModelProxy.CreateListenRouter({apiroot, modelClasses: _modelClasses, beforeCall, afterCall, method404, frontpage_default}))

    // catch 404 and forward to error handler
    _server.use(function (req, res, next) {
        res.status = 404;
        res.json({err: 'API Not Defined!', result: null})
    });

    return _server
}

const createServer = async (options)=> {
    if (!_server)
        _server  = await _create_server(options)
    return _server
}

const GKErrors = {
    _NO_RESULT:GKErrorWrap(-3,`无匹配结果`),
    _SERVER_ERROR:GKErrorWrap(-2,`服务发生异常`),//最常用的
    _NOT_PARAMS:GKErrorWrap(-1,`缺少参数`),
    _PARAMS_VALUE_EXPECT:GKErrorWrap(1001,`参数不符合预期`),
    _NOT_SERVICE:GKErrorWrap(1002,`功能即将实现`),
    _NOT_ACCESS_PERMISSION:GKErrorWrap(1004,`无访问权限`),
    _TOKEN_LOGIN_INVALID:GKErrorWrap(1006,`请先登录`)
}

export {
    createServer,
    getGankaoWXAuthToken,
    setting_redisConfig,
    getting_redisConfig,
    getRedisClient,
    GKErrorWrap,
    GKErrors,
    modelSetting,
    cacheAble,
    clearCache,
    crashAfterMe,
    definedStaticField
}




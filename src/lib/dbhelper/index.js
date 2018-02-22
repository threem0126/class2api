import Sequelize from 'sequelize';
import * as DBUtils from './dbutils';
import {hashcode} from './../class2api/util'
import * as TableSetting from './tablesetting'
import {GKErrors} from "../class2api/GKErrors_Inner";

let _dbList = {}

const _inner_DBModelLoader = (option)=> {
    //内部初始化
    let sequelize;//内部初始化的sequelize实例子，注意，禁止暴露给外部，以避免安全问题
    let _config_option = option
    let fn
    let col
    let literal
    let where

//依赖外部数据的初始化
    let _model_objects = {}
    let _ass ={}

//region 初始化sequelize对象
    const _INIT = async ()=> {
        let {database, user, password, host, port} = _config_option
        sequelize = new Sequelize(database, user, password, {
            host: host,
            port: port,
            timezone: "+08:00",
            pool: {
                max: 5,
                min: 0,
                idle: 10000
            },
            dialect: 'mysql',
            benchmark: (process.env.SQL_PRINT === '1'),
            logging: process.env.SQL_PRINT === '1' ?
                ((...params) => console.log(...params)) : null
        });

        let hasScope =false
        //先初始化非Scope的Model
        Object.keys(_model_objects).forEach(function (modelName) {
            let fun = _model_objects[modelName]
            if(!fun.scopeBaseModelName) {
                _model_objects[modelName] = fun.call()
            }else{
                hasScope = true
            }
        });

        if(hasScope) {
            //再初始化Scope类型的Model
            Object.keys(_model_objects).forEach(function (modelName) {
                let fun = _model_objects[modelName]
                if (fun.scopeBaseModelName) {
                    _model_objects[modelName] = fun.call(null, _model_objects[fun.scopeBaseModelName])
                }
            });
        }

        //补充初始化model的关联关系
        Object.keys(_model_objects).forEach(function (modelName) {
            if ('associate' in _model_objects[modelName]) {
                _model_objects[modelName].associate(_model_objects, _ass);
            }
        });
        fn = Sequelize.fn
        col = Sequelize.col
        literal = Sequelize.literal
        where = Sequelize.where
        //
        _model_objects.__resetDB = ResetDB
        _model_objects.__createTransaction = createTransaction
        _model_objects.__excuteSQL = excuteSQL
        _model_objects.__fn = fn
        _model_objects.__col = col
        _model_objects.__literal = literal
        _model_objects.__where = where
    }

    const createTransaction = async () => {
        return await sequelize.transaction()
    }

    const excuteSQL = async (sql, options) => {
        return await sequelize.query(sql, options || {});
    }

    const ResetDB = async () => {
        try {
            let {key1, key2} = _config_option.reset_key
            if (process.env.DB_RESET_1 === key1 && process.env.DB_RESET_2 === key2) {
                if (process.env.NODE_ENV !== 'production') {
                    console.info("DB Inited ... ...");
                    await sequelize.sync({force: (process.env.FORCE==="1")});
                    console.info("DB Inited Done! ");
                    return true
                } else {
                    console.error("危险！在production环境执行 Reset操作是被禁止的！");
                }
            } else {
                console.info("ResetDB 调用失败，重置key无法与process.env.DB_RESET_1、process.env.DB_RESET_2匹配通过！嘿！注意这可是危险操作！");
            }
            return false
        } catch (err) {
            console.error(`error in ResetDB:`)
            console.error(err)
            throw err
        }
    }
//endregion


//region 功能代码

    return {
        define: (sequelizeModelFactory) => {
            let _sequelizeModelFactory = sequelizeModelFactory
            return () => {
                return _sequelizeModelFactory(sequelize, Sequelize)
            }
        },
        defineScope: (sequelizeModelScopeFactory, baseModelName) => {
            let _sequelizeModelScopeFactory = sequelizeModelScopeFactory
            let fun = (baseModel) => {
                return _sequelizeModelScopeFactory(baseModel)
            }
            fun.scopeBaseModelName = baseModelName
            return fun
        },
        INIT: async ({model, ass}) => {
            if (!model)
                throw `DBModelLoader.INIT() 未提供model参数`
            if (!ass)
                throw `DBModelLoader.INIT() 未提供ass参数`

            _model_objects = model
            _ass = ass
            await _INIT(option)
        },
        excuteSQL
    }
}

//内部带放重复创建的功能，相同的mysql配置，确保只创建一份sequelize对象
const DBModelLoader = (option)=> {
    if(!option || typeof option !=="object"){
        throw GKErrors._SERVER_ERROR(`DBModelLoader调用缺少参数或参数不是{key/value}对象`)
    }
    let {database, host, port} = option
    let hashKey = hashcode(JSON.stringify({database, host, port}))
    if (!_dbList[hashKey]) {
        let loader = _inner_DBModelLoader(option)
        _dbList[hashKey] = loader
    }
    return _dbList[hashKey]
}

export {
    TableSetting,
    DBModelLoader,
    DBUtils
}
//endregion
import Sequelize from 'sequelize';
import * as DBUtils from './dbutils';
import * as TableSetting from './tablesetting'



const DBModelLoader = (option)=> {
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
            benchmark: (process.env.SQL_PRINT === '0'),
            logging: process.env.SQL_PRINT === '0' ?
                ((...params) => console.log(...params)) : null
        });

        Object.keys(_model_objects).forEach(function (modelName) {
            let fun = _model_objects[modelName]
            _model_objects[modelName] = fun.call()
        });

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

    const createTransaction = async () => {
        return await sequelize.transaction()
    }

    const excuteSQL = async (sql, options) => {
        return await sequelize.query(sql, options || {});
    }

    return {
        define: (sequelizeModelFactory) => {
            let _sequelizeModelFactory = sequelizeModelFactory
            return () => {
                return _sequelizeModelFactory(sequelize, Sequelize)
            }
        },
        INIT: async ({model, ass}) => {
            if (!model)
                throw `未提供model参数`
            if (!ass)
                throw `未提供ass参数`

            _model_objects = model
            _ass = ass
            await _INIT(option)
        },
        createTransaction,
        ResetDB,
        fn,
        col,
        literal,
        where,
        excuteSQL
    }
}

export {
    TableSetting,
    DBModelLoader,
    DBUtils
}
//endregion
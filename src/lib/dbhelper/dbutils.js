import {keys} from 'lodash'

/**
 * 预览模型的信息
 * @returns {{Print: Print, Report: Report}}
 * @constructor
 */
export const ModelPreview = ()=> {
    let Functions = {}
    return {
        Print: function (sequelizeObj, className) {
            console.dir(`========【${className}】========`)
            dumpModelFuns(sequelizeObj)
            console.dir('')
            console.dir(sequelizeObj.get({plain: true}))
            console.dir('')
            console.dir('')
            Functions[className] = dumpModelFunsJSON(sequelizeObj)
        },
        Report: function () {
            return Functions
        }
    }
}

/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 */
export const dumpModelFuns = (Obj,printAll)=> {
    console.dir('dump functions of model:' + Obj.name);
    let retObj = dumpModelFunsJSON(Obj, printAll)
    keys(retObj).map(item => {
        console.log(`-->  ` + item)
    })
}

/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 * @param printAll
 * @returns {{}}
 */
export const dumpModelFunsJSON = (Obj,printAll)=> {
    let retObj = {}
    for (let key in Obj) {
        if (typeof Obj[key] === "function") {
            if (printAll === true) {
                retObj[key] = 1
            } else {
                if (key === "getDataValue" || key === "setDataValue" || key === "get" || key === "set" || key === "setAttributes" || key === "_setInclude" || key === "setValidators") {
                    continue
                }
                if (key.indexOf("get") === 0 || key.indexOf("add") === 0 || key.indexOf("set") === 0 || key.indexOf("count") === 0 || key.indexOf("has") === 0 || key.indexOf("remove") === 0 || key.indexOf("create") === 0) {
                    retObj[key] = 1
                }
            }
        }
    }
    return retObj
}


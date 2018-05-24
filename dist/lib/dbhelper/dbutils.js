'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dumpModelFunsJSON = exports.dumpModelFuns = undefined;

var _lodash = require('lodash');

/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 */
var dumpModelFuns = exports.dumpModelFuns = function dumpModelFuns(Obj, printAll) {
    console.dir('dump functions of model:' + Obj.name);
    var retObj = dumpModelFunsJSON(Obj, printAll);
    (0, _lodash.keys)(retObj).map(function (item) {
        console.log('-->  ' + item);
    });
};

/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 * @param printAll
 * @returns {{}}
 */
var dumpModelFunsJSON = exports.dumpModelFunsJSON = function dumpModelFunsJSON(Obj, printAll) {
    var retObj = {};
    for (var key in Obj) {
        if (typeof Obj[key] === "function") {
            if (printAll === true) {
                retObj[key] = 1;
            } else {
                if (key === "getDataValue" || key === "setDataValue" || key === "get" || key === "set" || key === "setAttributes" || key === "_setInclude" || key === "setValidators") {
                    continue;
                }
                if (key.indexOf("get") === 0 || key.indexOf("add") === 0 || key.indexOf("set") === 0 || key.indexOf("count") === 0 || key.indexOf("has") === 0 || key.indexOf("remove") === 0 || key.indexOf("create") === 0) {
                    retObj[key] = 1;
                }
            }
        }
    }
    return retObj;
};
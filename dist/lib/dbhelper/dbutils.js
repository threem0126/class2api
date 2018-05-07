"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 */
var dumpModelFuns = exports.dumpModelFuns = function dumpModelFuns(Obj, printAll) {
    console.dir('dump functions of model:' + Obj.property.name);
    for (var key in Obj) {
        if (typeof Obj[key] === "function") {
            if (printAll === true) {
                console.dir("----->  " + key);
            } else {
                if (key === "getDataValue" || key === "setDataValue" || key === "get" || key === "set" || key === "setAttributes" || key === "_setInclude" || key === "setValidators") {
                    continue;
                }
                if (key.indexOf("get") === 0 || key.indexOf("add") === 0 || key.indexOf("set") === 0 || key.indexOf("count") === 0 || key.indexOf("has") === 0 || key.indexOf("remove") === 0 || key.indexOf("create") === 0) {
                    console.dir("----->  " + key);
                }
            }
        }
    }
};
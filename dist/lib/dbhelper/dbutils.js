"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 */
var dumpModelFuns = exports.dumpModelFuns = function dumpModelFuns(Obj) {
    console.dir('dump functions of model:');
    for (var key in Obj) {
        if (typeof Obj[key] === "function") {
            console.dir(key);
        }
    }
};
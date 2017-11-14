/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 */
export const dumpModelFuns = (Obj)=> {
    console.dir('dump functions of model:');
    for (let key in Obj) {
        if (typeof Obj[key] === "function") {
            console.dir(key);
        }
    }
}

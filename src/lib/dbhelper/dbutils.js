/**
 * 方便查看sequelize对象上对于关联对象的所有操作方法名称
 *
 * @param Obj
 */
export const dumpModelFuns = (Obj)=> {
    console.dir('dump functions of model:' + Obj.name);
    for (let key in Obj) {
        if (typeof Obj[key] === "function") {
            if (key.indexOf("get") !== -1 || key.indexOf("add") !== -1 || key.indexOf("set") !== -1 || key.indexOf("count") !== -1 || key.indexOf("has") !== -1 || key.indexOf("remove") !== -1 || key.indexOf("create") !== -1)
                console.dir(`----->  ${key}`);
        }
    }
}

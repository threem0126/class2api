import {keys, indexOf} from 'lodash'

let rootType = {
    Mutation:{},
    Query:{}
}

let __beforeCall, __afterCall

export const isMutation = function (target, name, descriptor){
    //babel7适应性改造
    name = name || target.key
    descriptor = descriptor || target.descriptor
    //
    if(rootType.Mutation[name])
        throw `${target.name}类中的${name}方法名称已被其他类方法抢注，导致命名冲突，请修改`
    //
    if(!descriptor)
        throw `isMutation不支持修饰类(${target} ${name})，或错误用法：'@isMutation()'`;
    let oldValue = descriptor.value;
    descriptor.value = async function () {
        console.log(`===========>===========> API invoke ${name}`)
        let [_, params, ctx, ___] = arguments||{}
        let {request} = ctx||{}
        if (__beforeCall && typeof __beforeCall === 'function') {//如果有要对传入参数做验证，则在fn_beforeCall中处理
            let modelSetting = target.__modelSetting ? target.__modelSetting() : {};
            //返回最新的ctx
            ctx = await __beforeCall({apiname:name, request, params, ctx, modelSetting});
        }
        //执行原API函数
        let result = await oldValue(...arguments,ctx);
        //执行后的拦截
        if (__afterCall && typeof __afterCall === 'function') {//如果有要对传入参数做验证，则在fn_beforeCall中处理
            result = await __afterCall({apiname:name, request, result});
        }
        return result
    };
    //
    rootType.Mutation[name] = descriptor.value
    return descriptor;
}

export const isQuery = function (target, name, descriptor){
    //babel7适应性改造
    name = name || target.key
    descriptor = descriptor || target.descriptor
    if(rootType.Query[name])
        throw `${target.name}类中的${name}方法名称已被其他类方法抢注，导致命名冲突，请修改`
    //
    if(!descriptor)
        throw 'isQuery不支持修饰类'
    let oldValue = descriptor.value;
    descriptor.value = async function () {
        console.log(`===========>===========> API invoke ${name}`)
        let [_, params, ctx, ___] = arguments||{}
        let {request} = ctx||{}
        if (__beforeCall && typeof __beforeCall === 'function') {//如果有要对传入参数做验证，则在fn_beforeCall中处理
            let modelSetting = target.__modelSetting ? target.__modelSetting() : {};
            //返回最新的ctx
            ctx = await __beforeCall({apiname:name, request, params, ctx, modelSetting});
        }
        //执行原API函数
        let result = await oldValue(...arguments,ctx);
        //执行后的拦截
        if (__afterCall && typeof __afterCall === 'function') {//如果有要对传入参数做验证，则在fn_beforeCall中处理
            result = await __afterCall({apiname:name, request, result});
        }
        return result
    };
    //
    rootType.Query[name] = descriptor.value
    return descriptor;
}

export const isSubscription = function (target, name, descriptor){
    throw new Error('isSubscription的修饰器尚未实现')
}

export const mapClass2Resolvers = ({ClassList, beforeCall, afterCall,otherRootType={}})=> {
    //检查是否所有的静态业务API方法，都标记了GraphQL操作类型
    let methods = keys({...rootType.Mutation, ...rootType.Query});
    let noDecorators = 0
    ClassList.forEach(classA => {
        Object.getOwnPropertyNames(classA).forEach(prop => {
            //排除类的基本属性
            if (indexOf(['name', 'length', 'prototype', '__modelSetting'], prop) === -1) {
                if (indexOf(methods, prop) === -1) {
                    console.error(` !.....发现未修饰操作类型标记的业务方法：  ${classA.name + "." + prop}`)
                    noDecorators++
                }
            }
        })
    });
    if (noDecorators > 0)
        throw new Error('在API业务类中 发现有未标记GraphQL操作类型的业务方法，请检查！ 如属于内部业务方法而无需暴露到接口的，请转移到private文件夹内！或定义到业务业务类外部！')

    if(__beforeCall)
        throw new Error('__beforeCall已被初始化，每个进程全局只能构建一次mapClass2Resolvers映射')
    __beforeCall = beforeCall;

    if(__afterCall)
        throw new Error('__afterCall已被初始化，每个进程全局只能构建一次mapClass2Resolvers映射')
    __afterCall = afterCall;

    //从otherRootType中萃取出可能已存在的Query和Mutation，被覆盖
    let {Query = {}, Mutation = {}, ...otherRoot} = otherRootType
    return {
        ...otherRoot,
        Query: {...Query, ...rootType.Query},
        Mutation: {...Mutation, ...rootType.Mutation},
    }
}

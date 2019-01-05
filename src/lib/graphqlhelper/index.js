import {isMutation, isQuery, isSubscription, mapClass2Resolvers} from './resolvers.loader'



export {
    /**
     * 标记业务静态方法到Mutation根类型下
     */
    isMutation,
    /**
     * 标记业务静态方法到Query根类型下
     */
    isQuery,
    /**
     * 标记业务警惕方法到Subscription根类型下
     */
    isSubscription,
    /**
     * 映射给定的类，将他们的静态方法合成到
     */
    mapClass2Resolvers
}
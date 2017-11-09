import {GKErrorWrap} from 'class2api'

//除了内置的GKErrors以外，封装的自定义扩展错误类型
//内置类型的errCode为负数
//扩展类型的errCode请从1开始编码

export const ERROR_USER_NOT_EXIST = GKErrorWrap(1, '请先补充个人信息')

//项目常量定义

export const EXAMPLE = 'this is a example!'

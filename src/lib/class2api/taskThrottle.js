import {getRedisClient} from './redisClient';
import {sleep} from './util'
import schedule from 'node-schedule'
import moment from 'moment';

let NODE_APP_INSTANCE = process.env.NODE_APP_INSTANCE||'-';

const __Do = ({name, func, durationSecond, onError}) => {
    //name： 定制任务在redis中标记的key的名称
    //func：schedule模块调用的函数
    //durationSecond：预计执行的周期，在这个周期内，确保只有一个进程在处理逻辑。类似一个锁的机制，注意，这个时长不能超过schedule定时周期，并建议比定时周期少10秒中
    //onError：发生错误时的回调函数
    if (typeof func !== "function")
        throw new Error(`指定的func参数不是有效的function类型，请检查`);

    return async () => {
        console.log(`[NODE_APP_INSTANCE=${NODE_APP_INSTANCE}] scheduleJob start >>>>>>>>${new Date()}`);
        let taskNameInCacheKey = name;
        try {
            // 信号量：
            //  1、空闲段（无人执行）：redis无存储（上个周期的存储已过期），此时执行者可进入执行状态
            //  2、有他人正在执行：{status:'doing',starttime:NOW}，超时50秒自动清空
            //  3、有他人已执行完成，但处于休息不应期时段：{status:'done',expiretime:datetime()}，超时N秒自动清空，N秒=50秒-doing期占用的时长
            //
            //  一个周期的时间抽：|========********----|
            //  图利：
            //      ========有人执行
            //      ********不应期
            //      ----空闲期

            let info_inside = await getRedisClient().getAsync(taskNameInCacheKey)
            if (info_inside)
                info_inside = JSON.parse(info_inside)
            if (!info_inside) {
                let __startTime = new Date().getTime()
                let signal = {status: 'doing', starttime: moment(), flowID: Math.random()};

                //假设执行期是50秒，考虑进程奔溃或异常清空导致无法更新不应期。
                console.log(await getRedisClient().setAsync(taskNameInCacheKey, JSON.stringify(signal), 'EX', durationSecond));

                //等待2秒中后复核是否抢占锁成功！
                await sleep(2000);
                let re_signal = await getRedisClient().getAsync(taskNameInCacheKey)
                if (re_signal)
                    re_signal = JSON.parse(re_signal)
                if (re_signal.flowID !== signal.flowID) {
                    console.log(`${taskNameInCacheKey}任务锁抢占失败，交由别人执行，中断，退出任务！`)
                    //中断，退出
                    return;
                }

                //执行任务
                console.log(`${taskNameInCacheKey}任务锁抢占成功，进入执行状态...`)
                await func();

                // 计算本周期内剩余的不应期时长，写入redis
                let __endTime = new Date().getTime()
                let refractory_period = Math.max(10, durationSecond - Math.floor((__endTime - __startTime) / 1000));
                console.log(`任务${taskNameInCacheKey}执行耗时：${(__endTime - __startTime)}毫秒，剩余不应期：${refractory_period}秒`)
                //更改信号量
                signal.status = 'done'
                signal.expiretime = signal.starttime.add(durationSecond, 'second')
                //
                await getRedisClient().setAsync(taskNameInCacheKey, JSON.stringify(signal), 'EX', refractory_period);
            } else {
                console.log(`${taskNameInCacheKey}任务，别人在执行，我跳过...`)
            }
        } catch (sendError) {
            if (typeof onError === "function") {
                await onError({name, func, durationSecond}, sendError);
            } else {
                console.error(sendError)
            }
        }
    }
}


/**
 * cluster多线程环境下的定时任务执行器，内部带有互斥的锁机制，确保同一时间不会并发处理，依赖于redis来存储锁状态
 * @param schedulePlan  任务的执行周期/频率，内部传递给schedule.scheduleJob, 默认是每1分钟的第一秒开始执行一次（1 *\/1 * * * *）
 * @param name  任务的名称，唯一，也会用作在redis中保存的锁信息的key名称
 * @param func  回调函数
 * @param durationSecond    整体不应期，默认是50秒，计划任务循环周期必须大于此时间值
 * @param onError   捕获错误的自定义函数
 * @returns {Function}
 * @constructor
 */
export const MultiProccessTaskThrottle = ({schedulePlan='1 */1 * * * *', name, func, durationSecond=50, onError})=> {
    let option = {name, func, durationSecond, onError}
    return schedule.scheduleJob(schedulePlan, __Do(option))
}


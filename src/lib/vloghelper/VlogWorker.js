import request from 'request'
import Promise from 'bluebird';
import {filter} from 'lodash';

Promise.promisifyAll(request);

let filelist = []

//每间隔1秒重新发送一次
const _timer = setInterval(async()=> {
    if (filelist.length > 0) {
        //统计超过3次重发的量，给予控制台输出提示
        let needResends = filter(filelist, item => item._resendTimes < 3);
        if (filelist.length > needResends.length) {
            console.error(`TransferVLog 内部重发次数超过3次的日志，被丢弃 ${filelist.length > needResends.length} 个.`);
        }
        for (let i = 0; i < (Math.min(20, filelist.length)); i++) {
            let item = filelist.shift()
            if (item) {
                if (item._resendTimes < 3) {
                    //这里其实是异步发送，for会一下子执行完
                    doSend(item).then()
                }
            }
        }
    }
},1000);

const doSend = async (data)=>{
    setImmediate(async () => {
        let {_apiUrl, isProduction = 1, sysName, sourceHeaders, userIdentifier, action, targetType, time, targetID, targetOwnerIdentifier, extraInfo, _resendTimes = 0} = data;
        try {
            //发送流水
            let req_options = {
                uri: _apiUrl,
                rejectUnauthorized: false,
                headers: {},
                body: JSON.stringify({
                    isProduction,
                    sysName,
                    userIdentifier,
                    action,
                    targetType,
                    targetID,
                    time,
                    targetOwnerIdentifier,
                    extraInfo,
                    sourceHeaders,
                }),
                json: true,
            }
            let {body} = await request.postAsync(req_options)
            let {err, result} = body
            if (err) {
                filelist.push({
                    _apiUrl,
                    isProduction,
                    sysName,
                    userIdentifier,
                    action,
                    targetType,
                    targetID,
                    time,
                    targetOwnerIdentifier,
                    extraInfo,
                    sourceHeaders,
                    _resendTimes: _resendTimes + 1
                });
            }
        } catch (ex) {
            console.error(`TransferVLog中错误：`)
            console.error(ex)
            filelist.push({
                _apiUrl,
                isProduction,
                sysName,
                userIdentifier,
                action,
                targetType,
                targetID,
                time,
                targetOwnerIdentifier,
                extraInfo,
                sourceHeaders,
                _resendTimes: _resendTimes + 1
            });
        }
    });
}

/**
 * 发送泛业务日志
 * @param isProduction  是否为生产环境
 * @param sysName
 * @param sourceHeaders
 * @param userID
 * @param action
 * @param targetType
 * @param time
 * @param targetID
 * @param targetOwnerUID
 * @param comment
 * @param _resendTimes
 * @returns {Promise<void>}
 */
process.on('message', data => {
    doSend(data).then()
});
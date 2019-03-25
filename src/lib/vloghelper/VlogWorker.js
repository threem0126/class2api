import request from 'superagent'
import Promise from 'bluebird';
import {filter} from 'lodash';
import {getSignParamsInMD5} from "../class2api/util";

Promise.promisifyAll(request);

let filelist = []
//每间隔1秒重新发送队列，队列中的数据被处理3次后依然未成功发送出去的，暂时被被丢弃
const _timer = setInterval(async()=> {
    if (filelist.length > 0) {
        if (filelist[0]._debugTrace) {
            //统计超过3次重发的量，给予控制台输出提示
            let needResends = filter(filelist, item => item._resendTimes < 3);
            if (filelist.length > needResends.length) {
                console.error(`TransferVLog 内部重发次数超过3次的日志，被丢弃 ${filelist.length - needResends.length} 个.`);
            }
        }
        for (let i = 0; i < (Math.min(20, filelist.length)); i++) {
            let item = filelist.shift()
            if (item) {
                if (item._resendTimes < 3) {
                    //doSend内部如果发送失败，则会自动又加入filelist队列
                    doSend(item).then()
                    //这里其实是异步发送，for会一下子执行完
                }else{
                    //超过3次的，不做发送，也就没机会再进入队列，直接被丢弃了
                }
            }
        }
    }
},1000);

const doSend = async (data)=> {
    setImmediate(async () => {
        let {_debugTrace, _apiUrl, _secret,_resendTimes, ...postData} = data;
        if(!postData.sign){
            postData.sign = getSignParamsInMD5({param:postData,secret:_secret})
        }
        try {
            //发送流水
            request
                .post(_apiUrl)
                .withCredentials()
                .set('Accept', 'application/json, text/plain, */*')
                .set('Content-Type', 'application/json')
                .send({postData})
                .retry(2)//superagent内部先发送两次
                .then((res) => {
                    if (res.status === 200) {
                        if (_debugTrace) {
                            console.log(JSON.stringify(postData))
                            try {
                                let {err, result} = res.body
                                if (err) {
                                    console.error(`res business error  ... ${err}..!`)
                                    console.error(res.body)
                                }else{
                                    console.log('send ok!')
                                }
                            }catch (err) {
                                console.error(`res parse error  ... ${err}..!`)
                                console.error(res.body)
                            }
                        }
                    } else {
                        //注意加入list的是data，而不是postData
                        console.error(`res net error  ... ${res.status}..!`+ postData)
                        data._resendTimes++;
                        filelist.push(data);
                    }
                }, (err) => {
                    if (_debugTrace) {
                        console.error(`res error  ... ${err}..!` + postData)
                    }
                    //注意加入list的是data，而不是postData
                    data._resendTimes++;
                    filelist.push(data);
                })
        } catch (ex) {
            if (_debugTrace) {
                console.error(`TransferVLog中错误：`)
                console.error(ex)
            }
            //注意加入list的是data，而不是postData
            data._resendTimes++;
            filelist.push(data);
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
let VlogWorker = __dirname + '/VlogWorker.js';
const {fork} = require('child_process');
import uuidv4 from 'uuid/v4';

let workerProcess;
let _apiUrl = '';
let _debugTrace = false;

const start = () => {
    workerProcess = fork(VlogWorker);
    workerProcess.on('close', () => {
        console.log(`子进程意外结束，恢复运行 ... `);
        console.dir(workerProcess);
        start();
    });
}

const vlog_setting = ({apiUrl,debugTrace=false})=> {
    _apiUrl = apiUrl
    _debugTrace = debugTrace
    start();
}

/**
 * 发送日志
 * @param isProduction  是否为生产环境
 * @param sysName       业务方系统简称（二级域名的第一个单词缩写）
 * @param sourceHeaders 源请求req头
 * @param userIdentifier    用户标识
 * @param action            动作名称
 * @param targetType        操作目标
 * @param [time]            可选，动作事件的发生时间，默认为当前时间
 * @param targetID          操作目标的标识符
 * @param targetOwnerIdentifier 操作目标归属方的标识符
 * @param extraInfo         附加信息对象
 * @returns {Promise<void>}
 */
const vlogSend = async ({isProduction=1, sysName, sourceHeaders, userIdentifier, action, targetType, time=new Date(), targetID,  targetOwnerIdentifier, extraInfo}) => {
    if (!_apiUrl) {
        throw new Error(`TransferVLog中的apiUrl尚未配置，请先调用vlog_setting设置`)
    }
    // if (_apiUrl.indexOf("gankao.com") !== -1) {
    //     throw new Error(`TransferVLog中的apiUrl请配置为云服务的IP，以减少DNS解析开销`)
    // }
    if (!sysName || typeof sysName !== "string") {
        throw new Error(`TransferVLog的日志发送send调用，缺少sysName参数 或参数不是字符串类型`)
    }
    if (!userIdentifier || typeof userIdentifier !== "string") {
        throw new Error(`TransferVLog的日志发送send调用，缺少 userIdentifier 参数 或参数不是字符串类型`)
    }
    if (!action || typeof action !== "string") {
        throw new Error(`TransferVLog的日志发送send调用，缺少 action 参数 或参数不是字符串类型`)
    }
    if (!targetType || typeof targetType !== "string") {
        throw new Error(`TransferVLog的日志发送send调用，缺少 targetType 参数 或参数不是字符串类型`)
    }
    if (!targetID || typeof targetID !== "string") {
        throw new Error(`TransferVLog的日志发送send调用，缺少 targetID 参数 或参数不是字符串类型`)
    }
    if (!time || typeof time !== "string") {
        throw new Error(`TransferVLog的日志发送send调用，缺少 time 参数 或参数不是字符串类型`)
    }
    if (!sourceHeaders || typeof sourceHeaders !== "object") {
        throw new Error(`TransferVLog的日志发送send调用，缺少 sourceHeaders 参数 或参数不是object类型`)
    }
    if (!extraInfo || typeof extraInfo !== "object") {
        throw new Error(`TransferVLog的日志发送send调用，缺少 sourceHeaders 参数 或参数不是object类型`)
    }
    if (_debugTrace) {
        console.log('vlogSend... ')
    }
    workerProcess.send({
        _debugTrace,
        _uuid: uuidv4(),
        _apiUrl,
        isProduction: (isProduction === 1 || isProduction === '1' || isProduction === true) ? 1 : 0,
        sysName,
        userIdentifier,
        action,
        targetType,
        targetID,
        time,
        targetOwnerIdentifier,
        extraInfo,
        sourceHeaders,
        _resendTimes: 0
    });
}

export  {
    vlog_setting,
    vlogSend
}

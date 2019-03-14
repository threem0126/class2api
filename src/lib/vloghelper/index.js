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

const vlogSend = async ({isProduction=1, sysName, sourceHeaders, userIdentifier, action, targetType, time=new Date(), targetID,  targetOwnerIdentifier, extraInfo, _resendTimes=0}) => {
    if(_debugTrace){
        console.log('vlogSend...')
    }
    // if (!_apiUrl) {
    //     throw new Error(`TransferVLog中的apiUrl尚未配置，请调用vlog_setting设置`)
    // }
    // if (_apiUrl.indexOf("gankao.com") !== -1) {
    //     throw new Error(`TransferVLog中的apiUrl请配置为云服务的IP，以减少DNS解析开销`)
    // }
    if (!sysName) {
        throw new Error(`TransferVLog的日志发送send调用，缺少sysName参数`)
    }
    if (!userIdentifier) {
        throw new Error(`TransferVLog的日志发送send调用，缺少 userIdentifier 参数`)
    }
    if (!action) {
        throw new Error(`TransferVLog的日志发送send调用，缺少 action 参数`)
    }
    if (!targetType) {
        throw new Error(`TransferVLog的日志发送send调用，缺少 targetType 参数`)
    }
    if (!targetID) {
        throw new Error(`TransferVLog的日志发送send调用，缺少 targetID 参数`)
    }
    if (!sourceHeaders) {
        throw new Error(`TransferVLog的日志发送send调用，缺少 sourceHeaders 参数`)
    }
    workerProcess.send({
        _debugTrace,
        _uuid:uuidv4(),
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
        _resendTimes
    });
}

export  {
    vlog_setting,
    vlogSend
}

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MultiProccessTaskThrottle = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _redisClient = require('./redisClient');

var _util = require('./util');

var _nodeSchedule = require('node-schedule');

var _nodeSchedule2 = _interopRequireDefault(_nodeSchedule);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var NODE_APP_INSTANCE = process.env.NODE_APP_INSTANCE || '-';

var __Do = function __Do(_ref) {
    var name = _ref.name,
        func = _ref.func,
        durationSecond = _ref.durationSecond,
        onError = _ref.onError;

    //name： 定制任务在redis中标记的key的名称
    //func：schedule模块调用的函数
    //durationSecond：预计执行的周期，在这个周期内，确保只有一个进程在处理逻辑。类似一个锁的机制，注意，这个时长不能超过schedule定时周期，并建议比定时周期少10秒中
    //onError：发生错误时的回调函数
    if (typeof func !== "function") throw new Error('\u6307\u5B9A\u7684func\u53C2\u6570\u4E0D\u662F\u6709\u6548\u7684function\u7C7B\u578B\uFF0C\u8BF7\u68C0\u67E5');

    return _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var taskNameInCacheKey, info_inside, __startTime, signal, re_signal, __endTime, refractory_period;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log('[NODE_APP_INSTANCE=' + NODE_APP_INSTANCE + '] scheduleJob start >>>>>>>>' + new Date());
                        taskNameInCacheKey = name;
                        _context.prev = 2;
                        _context.next = 5;
                        return (0, _redisClient.getRedisClient)().getAsync(taskNameInCacheKey);

                    case 5:
                        info_inside = _context.sent;

                        if (info_inside) info_inside = JSON.parse(info_inside);

                        if (info_inside) {
                            _context.next = 36;
                            break;
                        }

                        __startTime = new Date().getTime();
                        signal = { status: 'doing', starttime: (0, _moment2.default)(), flowID: Math.random() };

                        //假设执行期是50秒，考虑进程奔溃或异常清空导致无法更新不应期。

                        _context.t0 = console;
                        _context.next = 13;
                        return (0, _redisClient.getRedisClient)().setAsync(taskNameInCacheKey, JSON.stringify(signal), 'EX', durationSecond);

                    case 13:
                        _context.t1 = _context.sent;

                        _context.t0.log.call(_context.t0, _context.t1);

                        _context.next = 17;
                        return (0, _util.sleep)(2000);

                    case 17:
                        _context.next = 19;
                        return (0, _redisClient.getRedisClient)().getAsync(taskNameInCacheKey);

                    case 19:
                        re_signal = _context.sent;

                        if (re_signal) re_signal = JSON.parse(re_signal);

                        if (!(re_signal.flowID !== signal.flowID)) {
                            _context.next = 24;
                            break;
                        }

                        console.log(taskNameInCacheKey + '\u4EFB\u52A1\u9501\u62A2\u5360\u5931\u8D25\uFF0C\u4EA4\u7531\u522B\u4EBA\u6267\u884C\uFF0C\u4E2D\u65AD\uFF0C\u9000\u51FA\u4EFB\u52A1\uFF01');
                        //中断，退出
                        return _context.abrupt('return');

                    case 24:

                        //执行任务
                        console.log(taskNameInCacheKey + '\u4EFB\u52A1\u9501\u62A2\u5360\u6210\u529F\uFF0C\u8FDB\u5165\u6267\u884C\u72B6\u6001...');
                        _context.next = 27;
                        return func();

                    case 27:

                        // 计算本周期内剩余的不应期时长，写入redis
                        __endTime = new Date().getTime();
                        refractory_period = Math.max(10, durationSecond - Math.floor((__endTime - __startTime) / 1000));

                        console.log('\u4EFB\u52A1' + taskNameInCacheKey + '\u6267\u884C\u8017\u65F6\uFF1A' + (__endTime - __startTime) + '\u6BEB\u79D2\uFF0C\u5269\u4F59\u4E0D\u5E94\u671F\uFF1A' + refractory_period + '\u79D2');
                        //更改信号量
                        signal.status = 'done';
                        signal.expiretime = signal.starttime.add(durationSecond, 'second');
                        //
                        _context.next = 34;
                        return (0, _redisClient.getRedisClient)().setAsync(taskNameInCacheKey, JSON.stringify(signal), 'EX', refractory_period);

                    case 34:
                        _context.next = 37;
                        break;

                    case 36:
                        console.log(taskNameInCacheKey + '\u4EFB\u52A1\uFF0C\u522B\u4EBA\u5728\u6267\u884C\uFF0C\u6211\u8DF3\u8FC7...');

                    case 37:
                        _context.next = 47;
                        break;

                    case 39:
                        _context.prev = 39;
                        _context.t2 = _context['catch'](2);

                        if (!(typeof onError === "function")) {
                            _context.next = 46;
                            break;
                        }

                        _context.next = 44;
                        return onError({ name: name, func: func, durationSecond: durationSecond }, _context.t2);

                    case 44:
                        _context.next = 47;
                        break;

                    case 46:
                        console.error(_context.t2);

                    case 47:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[2, 39]]);
    }));
};

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
var MultiProccessTaskThrottle = exports.MultiProccessTaskThrottle = function MultiProccessTaskThrottle(_ref3) {
    var _ref3$schedulePlan = _ref3.schedulePlan,
        schedulePlan = _ref3$schedulePlan === undefined ? '1 */1 * * * *' : _ref3$schedulePlan,
        name = _ref3.name,
        func = _ref3.func,
        _ref3$durationSecond = _ref3.durationSecond,
        durationSecond = _ref3$durationSecond === undefined ? 50 : _ref3$durationSecond,
        onError = _ref3.onError;

    var option = { name: name, func: func, durationSecond: durationSecond, onError: onError };
    return _nodeSchedule2.default.scheduleJob(schedulePlan, __Do(option));
};
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    if (_cluster2.default.isMaster) {
        // Init master logger
        _log4js2.default.configure({
            appenders: [{
                // Adding only one, "clustered" appender.
                type: "clustered",

                // Add as many "normal" appenders as you like.
                // They will all be used once the "clustered" master appender receives a loggingEvent
                appenders: [{ type: 'console' }, {
                    "type": "dateFile",
                    "filename": "data/0-loggs/node.log",
                    "pattern": "-yyyy-MM-dd",
                    "alwaysIncludePattern": false
                }]
            }],
            replaceConsole: false
        });

        // Init logger like you used to
        return _log4js2.default.getLogger("master");
    } else {

        // Init worker loggers, adding only the clustered appender here.
        _log4js2.default.configure({
            appenders: [{ type: "clustered" }],
            replaceConsole: false
        });

        // Init logger like you used to
        return _log4js2.default.getLogger("worker_" + _cluster2.default.worker.id);
    }
};

var _log4js = require('log4js');

var _log4js2 = _interopRequireDefault(_log4js);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;
//LogFile.trace('This is a Log4js-Test');
//LogFile.debug('We Write Logs with log4js');
//LogFile.info('You can find logs-files in the log-dir');
//LogFile.warn('log-dir is a configuration-item in the log4js.json');
//LogFile.error('In This Test log-dir is : \'./logs/log_test/\'');

/**
 * 多进程的日志配置
 */
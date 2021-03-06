import log4js from 'log4js';
import cluster from 'cluster';

/**
 * 多进程的日志配置
 */
export default function() {
    if (cluster.isMaster) {
        // Init master logger
        log4js.configure({
            appenders: [
                {
                    // Adding only one, "clustered" appender.
                    type: "clustered",

                    // Add as many "normal" appenders as you like.
                    // They will all be used once the "clustered" master appender receives a loggingEvent
                    appenders: [
                        { type: 'console' },
                        // {
                        //     "type": "dateFile",
                        //     "filename": "data/0-loggs/node.log",
                        //     "pattern": "-yyyy-MM-dd",
                        //     "alwaysIncludePattern": false
                        // }
                    ]
                }
            ],
            replaceConsole: false
        });

        // Init logger like you used to
        return log4js.getLogger("master");

    } else {

        // Init worker loggers, adding only the clustered appender here.
        log4js.configure({
            appenders: [
                {type: "clustered"}
            ],
            replaceConsole: false
        });

        // Init logger like you used to
        return log4js.getLogger("worker_" + cluster.worker.id);
    }
};

import {vlog_setting, vlogSend} from '../dist/lib/vloghelper/index.js'
import moment from 'moment';

vlog_setting({
    apiUrl: "http://vlog.api.gankao.com/gktag/savevLog",
    sysName: 'zhuli',
    secret: '@kj&hy%z',
    debugTrace: true,
});

let tCount = 0;
const TestSend =()=> {
    setTimeout(() => {
        vlogSend({
            isProduction: "1",
            userIdentifier: Math.floor(Math.random() * 100000).toString(),
            action: '测试',
            targetType: '泛日志',
            time: moment().format('YYYY-MM-DD HH:MM:ss'),
            targetID: Math.floor(Math.random() * 100000).toString(),
            targetOwnerIdentifier: Math.floor(Math.random() * 100000).toString(),
            sourceHeaders: {a: '1' },
            extraInfo: {}
        }).then(() => {
            tCount++;
            console.log('tCount ----------------- '+ tCount)
            TestSend();
        });
    }, Math.random() * 10);
};

TestSend();
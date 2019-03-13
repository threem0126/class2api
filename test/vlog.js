import {vlog_setting, vlogSend} from '../src/lib/vloghelper/index.js'

vlog_setting({apiUrl:"http://vlog.api.gankao.com/gktag/savevLog"});

let tCount = 0;
const TestSend =()=> {
    setTimeout(() => {
        vlogSend({
            isProduction: 1,
            sysName: 'dashi',
            sourceHeaders: {a: '1'},
            userIdentifier: Math.floor(Math.random() * 100000),
            action: '关注',
            targetType: '公众号',
            time: new Date(),
            targetID: Math.floor(Math.random() * 100000),
            targetOwnerIdentifier: Math.floor(Math.random() * 100000),
            extraInfo: {}
        }).then(() => {
            tCount++;
            console.log('tCount ----------------- '+ tCount)
            TestSend();
        });
    }, Math.random() * 50);
};

TestSend();

import {parallelInvokeWithPromise,sleep} from '../dist/lib/class2api/util.js'

(async()=>{
    //异步发送请求
    let url = 'https://yunying.api.gankao.com/gkcommon/queryStudentBaseInfo'
    let parallel = parallelInvokeWithPromise({url, params: {gankaoUID: 921302}})

    console.log('主线业务开始')
    await sleep(5000);
    console.log('主线业务结束')

    //拿到返回
    let result = await parallel;

    console.log('拿到异步请求返回给前端')
    console.log(JSON.stringify(result))
    return {result}
})();




// vlog_setting({
//     apiUrl: "http://vlog.api.gankao.com/gktag/savevLog",
//     sysName: 'zhuli',
//     secret: '@kj&hy%z',
//     debugTrace: true,
// });
//
// let tCount = 0;
// const TestSend =()=> {
//     setTimeout(() => {
//         vlogSend({
//             isProduction: "1",
//             userIdentifier: Math.floor(Math.random() * 100000).toString(),
//             action: '测试',
//             targetType: '泛日志',
//             time: moment().format('YYYY-MM-DD HH:MM:ss'),
//             targetID: Math.floor(Math.random() * 100000).toString(),
//             targetOwnerIdentifier: Math.floor(Math.random() * 100000).toString(),
//             sourceHeaders: {a: '1' },
//             extraInfo: {}
//         }).then(() => {
//             tCount++;
//             console.log('tCount ----------------- '+ tCount)
//             TestSend();
//         });
//     }, Math.random() * 10);
// };
//
// TestSend();

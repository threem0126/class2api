if(!process.env.__ISCOMPILING__){
    console.dir("global.__ISCOMPILING__ = false, load babel-register ...");
    require('babel-register');
}

//
console.dir("running on  ..."+process.env.MODEL);

if(process.env.MODEL === "src"){
    require('./server');
}else if(process.env.MODEL === "srcrouter"){
    require('./server-router.js');
}else if(process.env.MODEL === "srclite"){
    require('./server-lite.js');
}else if(process.env.MODEL === "srclite2"){
    require('./server-lite2.js');
}else {
    throw '参数不匹配'
}
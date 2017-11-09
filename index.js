if(!process.env.__ISCOMPILING__){
    console.dir("global.__ISCOMPILING__ = false, load babel-register ...");
    require('babel-register');
}

//
console.dir("running on  ..."+process.env.MODEL);

if(process.env.MODEL === "src"){
    require('./demo-src/server');
}else if(process.env.MODEL === "srcrouter"){
    require('./demo-src/server-router.js');
}else {
    throw '参数不匹配'
}
if(!process.env.__ISCOMPILING__){
    console.dir("global.__ISCOMPILING__ = false, load babel-register ...");
    require('babel-register');
}

//
console.dir("running on  ..."+process.env.MODEL);

if(process.env.MODEL === "src"){
    require('./demo-src/src-server');
}else if(process.env.MODEL === "srcrouter"){
    require('./demo-src/src-server-router.js');
}else if(process.env.MODEL === "prod-router"){
    require('./demo-src/src-server-router.js');
}else {
    require('./demo-prod/prod-server');
}
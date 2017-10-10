if(!process.env.__ISCOMPILING__){
    console.dir("global.__ISCOMPILING__ = false, load babel-register ...");
    require('babel-register');
}
//
if(process.argv.MODEL === "src"){
    console.dir("running on src ...");
    require('./demo-prod/prod-server');
}else {
    console.dir("running on prod lib ...");
    require('./demo-src/src-server');
}
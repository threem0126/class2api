if(!process.env.__ISCOMPILING__){
    console.dir("global.__ISCOMPILING__ = false, load babel-register ...");
    require('babel-register');
}
//
if(process.env.SERVER_ID==='2'){
    require('./server2');
}else {
    require('./server');
}
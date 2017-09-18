if(!process.env.__ISCOMPILING__){
    console.dir("global.__ISCOMPILING__ = false, load babel-register ...");
    require('babel-register');
}
//

require('./test-server');
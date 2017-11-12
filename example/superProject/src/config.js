const env_name = process.env.NODE_ENV||"development";
console.warn("loading config for  ..... " + env_name);

if(typeof window ==="object"){
    throw "警告：服务器端config配置无法被引入在客户端脚本中";
}
if(typeof global.__config_loaded === "undefined") {
    global.config_path = "./config/" + env_name + ".config.js"
    global.__config_loaded = require(global.config_path);
}

export default global.__config_loaded.config;


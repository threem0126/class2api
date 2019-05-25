/* eslint-disable */
//用于在next.config.js环节对next配置结果做个性化增强

const path = require('path')
const join = require('path').join
const fs = require('fs')
const qiniu = require('qiniu')
const chunk = require('lodash').chunk;
const Promise = require('bluebird')
const request = require('request')
const webpack = require("webpack");
const child_process = require('child_process');

Promise.promisifyAll(request);

const isProdRunTime = (process.env.NODE_ENV === 'production');
const isProdBusiness = (process.env.PRODUCTION_TYPE === 'production');
const CDN = (process.env.CDN==="1");
const distDir = "next.build"+(isProdBusiness?"":".test");
const _buildID = (()=>{
    if(process.env.IS_BUILDING==='1')
        return `${isProdRunTime ? 'prod_' : ''}${child_process.execSync('git log -n 1 --format="%H"').toString().replace("\n", '')}`;
    if(!isProdRunTime) {
        console.log(`dev模式，使用当前时间戳来定义buildID`)
        return new Date().getTime();
    }else {
        try {
            return fs.readFileSync(path.resolve(__dirname ,'./' + distDir + "/BUILD_ID"))
        } catch (e) {
            console.log(`prod模式，无法读取BUILD_ID信息，文件${'./' + distDir + "/BUILD_ID"}尚未生成，请先运行 $ npm run build:test`);
            throw e
        }
    }
})();
const prodName = (()=>{
    let packageFile = path.join(process.cwd(), 'package.json');
    try{
        let {name = 'noname'} = require(packageFile);
        let [applicationName] = name.split(".")
        return applicationName
    } catch (e) {
        console.error(`找不到${packageFile}，无法获取应用程序简称`);
        throw e
    }
})();
const cdnPath = `${prodName}${(isProdBusiness?"":"-test")}/${_buildID}/`;
//当编译或CDN环境变量打开时，使用CDN托管
const assetPrefix = (isProdRunTime || CDN) ? `https://static.qiaoxuesi.com/${cdnPath}` : '';

console.log(`out from withGKNextConfig in next.config.js :`);
console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);
console.log(`process.env.PRODUCTION_TYPE = ${process.env.PRODUCTION_TYPE}`);
console.log("_buildID..."+_buildID);
console.log("assetPrefix..."+assetPrefix);

const getToken = async ()=> {
    let {body} = await request.postAsync({
        url: 'https://base.api.gankao.com/service/getQiniuToken',
        json: true,
        body: {
            app: 'buildtool',
            authSecret: 'cjpl6Fwnu00qf03s72j2z0piy',
            bucket: "static"
        }
    });
    let {err, result: {token}} = body;
    return token;
}

function findSync(startPath) {
    let result = [];

    function finder(apath) {
        let files = fs.readdirSync(apath);
        files.forEach((val, index) => {
            let fPath = join(apath, val);
            let stats = fs.statSync(fPath);
            if (stats.isDirectory()) finder(fPath);
            if (stats.isFile()) {
                if (fPath.indexOf(".js.map") ===-1) {
                    result.push({filefullpath:fPath, filename:val});
                }
            }
        });
    }

    finder(startPath);
    return result;
}

const upload2CDN = async ({prodName, isTest, cdnPath, StaticType='app', buildID})=> {
    let buildDir = isTest ? "next.build" : "next.build.test";
    let uploadDir = (StaticType === "app") ? `./${buildDir}/static/` : './static/';
    //
    let fileNames = findSync(uploadDir);
    console.log(`共有 ${fileNames.length} 个${StaticType === "app" ? 'Application级别编译的' : '站点素材级别'}静态文件需上传 ....`)
    //
    const uploadFile = ({filefullpath, filename}) => {
        return new Promise(async (resolve, reject) => {
            let config = new qiniu.conf.Config();
            // 空间对应的机房
            config.zone = qiniu.zone.Zone_z0;
            // 是否使用https域名
            config.useHttpsDomain = true;
            // 上传是否使用cdn加速
            config.useCdnDomain = true;
            // ;
            //常见上传器对象
            let formUploader = new qiniu.form_up.FormUploader(config);
            let putExtra = new qiniu.form_up.PutExtra();
            let key = cdnPath + (StaticType === "app" ?
                `${filefullpath.replace(buildDir, '_next')}` :
                `${filefullpath}`);
            formUploader.put(await getToken(), key, fs.readFileSync(filefullpath), putExtra, (respErr, respBody, respInfo) => {
                console.log(`=> https://static.qiaoxuesi.com/${key}`)
                if (respErr) {
                    console.log(`[Error]formUploader.done! respErr = ${JSON.stringify(respErr)} `)
                    console.log(`[Error]formUploader.done! respBody = ${JSON.stringify(respBody)} `)
                }
                resolve();
            });
        })
    }
    //
    let chunks = chunk(fileNames, 5)
    for (let chunkList of chunks) {
        await Promise.all(chunkList.map(Item => uploadFile(Item)))
    }
    console.log('' + fileNames.length + ' 个文件需上传完成！')
}

export const index = (nextConfig)=> {
    if (nextConfig.upload2QiniuCDN) {
        nextConfig.distDir = distDir;
        nextConfig.generateBuildId = async () => {
            console.log(`generateBuildId... ` + _buildID)
            return _buildID
        };
        nextConfig.assetPrefix = assetPrefix
    }
    nextConfig.cssModules = false,
        nextConfig.lessLoaderOptions = {
            javascriptEnabled: true,
        };
    console.log( nextConfig.upload2QiniuCDN?`已启用静态化资源CDN化，将上传静态资源至七牛`:`未启用静态化资源CDN化`);
    let oldWebpack = nextConfig.oldWebpack;
    nextConfig.webpack = function (config, options) {
        if (oldWebpack)
            config = oldWebpack(config, options);
        let {buildId, dev, isServer} = options
        //服务器端应用运行时的环境变量无法传入客户端环境变量，在build环节将环境变量注入到客户端脚本的编译中
        let defineOpts = {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.PRODUCTION_TYPE': JSON.stringify(process.env.PRODUCTION_TYPE),
        };
        if (nextConfig.upload2QiniuCDN) {
            defineOpts = {
                ...defineOpts,
                'process.env.assetPrefix': JSON.stringify(assetPrefix),
                'process.env._buildID': JSON.stringify(_buildID)

            }
        }
        config.plugins.push(
            new webpack.DefinePlugin(defineOpts)
        )
        if (!isServer) {
            if (nextConfig.upload2QiniuCDN) {
                config.plugins.push(
                    function () {
                        this.plugin("done", async function (stats) {
                            if (CDN) {
                                console.log('上传静态编译资源到CDN ...isServer=' + isServer)
                                await upload2CDN({
                                    prodName,
                                    cdnPath,
                                    isTest: isProdBusiness,
                                    StaticType: 'app',
                                    buildID: _buildID
                                });
                                await upload2CDN({
                                    prodName,
                                    cdnPath,
                                    isTest: isProdBusiness,
                                    StaticType: 'site',
                                    buildID: _buildID
                                });
                            }
                        });
                    });
            }
        }
        console.log( `编译${isServer?'Server端':'Client端'}脚本，已配置的babel插件：` + config.plugins.map(item=>item.constructor.name).join(","))
        return config
    }
    return nextConfig;
}


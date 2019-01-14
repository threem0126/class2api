'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../../templates.json')
const chalk = require('chalk')
const inquirer = require('inquirer')
const Promise = require('bluebird')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const updateConfig = (sqlOptions, configFile)=>{
    let configText = fs.readFileSync(configFile,'utf-8')
    configText = configText.replace(/{projectName}/igm, sqlOptions.projectName)
    configText = configText.replace(/{host}/igm, sqlOptions.host)
    configText = configText.replace(/{port}/igm, sqlOptions.port)
    configText = configText.replace(/{user}/igm, sqlOptions.user)
    configText = configText.replace(/{password}/igm, sqlOptions.password)
    configText = configText.replace(/{charset}/igm, sqlOptions.charset)
    configText = configText.replace(/{database}/igm, sqlOptions.database)
    //
    configText = configText.replace(/{cache_prefx}/igm, `${sqlOptions.projectName}_`)

    fs.writeFileSync(configFile, configText)
}

module.exports = () => {
    co(function* () {
        // 处理用户输入
        console.log(chalk.green(' 脚手架模版类型：'))
        console.log(chalk.green(' - base') + '   ——精简型，不带before/after拦截器')
        console.log(chalk.green(' - normal') + ' ——普通型，带before/after拦截器、API缓存机制')
        console.log(chalk.green(' - super') + '  ——增强型，带before/after拦截器、API缓存机制、数据库访问')
        console.log(chalk.green(' - admin') + '  ——管理后台权限认证型，super的基础上附带管理身份权限校验')

        let tplName = yield prompt('选择以上哪种模版？（base/normal/super/admin）: ')

        if (!config.tpl[tplName]) {
            console.log(chalk.red('\n × 所选的模版不存在!'))
            process.exit()
        }
        let gitUrl
        let branch
        let defaultProjName = `${tplName}Demo${Math.floor(Math.random() * 100000)}`
        let projectName = yield prompt(`给创建的新项目取个名字(${defaultProjName}): `)
        projectName = projectName || defaultProjName

        gitUrl = config.tpl[tplName].url
        branch = config.tpl[tplName].branch

        // git命令，远程拉取项目并自定义项目名
        let cmdStr = `git clone ${gitUrl} ${projectName} --progress && cd ${projectName} && git checkout ${branch}`

        console.log(chalk.white('\n 远程提取模版文件 ...'))
        exec(cmdStr, function (error, stdout, stderr) {
            co(function* () {
                if (error) {
                    console.log(error)
                    process.exit()
                }
                if (tplName === "super" || tplName === "admin") {
                    console.log(chalk.green('\n 请配置数据库链接:'))
                    let sql = {}
                    sql.host = yield prompt('数据库IP(127.0.0.1): ')
                    sql.host = sql.host || "127.0.0.1"
                    sql.port = yield prompt('数据库端口(3306): ')
                    sql.port = sql.port || "3306"
                    sql.user = yield prompt('数据库访问用户(root): ')
                    sql.user = sql.user || "root"
                    sql.password = yield prompt('数据库密码(默认为空): ')
                    sql.password = sql.password || ""
                    let database = yield prompt('创建新数据库的名称/存在则忽略(class2api_demo): ')
                    database = database || "class2api_demo"
                    sql.charset = yield prompt('数据库编码(utf8_general_ci): ')
                    sql.charset = sql.charset || "utf8_general_ci"
                    //
                    try {
                        const mysql = require('mysql')
                        let mysql_pool = mysql.createPool(sql);
                        Promise.promisifyAll(mysql_pool)
                        let {affectedRows} = yield mysql_pool.queryAsync(`CREATE DATABASE IF NOT EXISTS ${database}`);

                        let sqlFile = path.join(process.cwd(), projectName, 'toolscript', 'init.sql')
                        let tableSql = fs.readFileSync(sqlFile,'utf-8')
                        tableSql = tableSql.replace('{databaseName}', database)
                        yield mysql_pool.queryAsync(tableSql);
                        //
                        let options = _.merge(sql,{database, projectName})
                        updateConfig(options, path.join(process.cwd(), projectName, 'src','config', 'development.config.js'))
                        updateConfig(options, path.join(process.cwd(), projectName, 'src','config', 'test.config.js'))
                        updateConfig(options, path.join(process.cwd(), projectName, 'src','config', 'production.config.js'))
                        //
                        console.log(chalk.green('\n √ 数据库配置成功!'))
                    } catch (err) {
                        console.error(chalk.green('\n X 创建数据库遇到错误!'))
                        console.error(err)
                        process.exit()
                    }
                }
                console.log(chalk.green('\n √ 项目创建成功!'))
                console.log('\n 开始体验:')
                if (tplName === "super" || tplName === "admin") {
                    console.log(`\n $ cd ${projectName} && npm install && npm start \n`)
                }else{
                    console.log(`\n $ cd ${projectName} && npm install && npm start \n`)
                }
                process.exit()
            })
        })
    })
}
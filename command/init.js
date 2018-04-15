'use strict'
const exec = require('child_process').exec
const co = require('co')
const prompt = require('co-prompt')
const config = require('../templates')
const chalk = require('chalk')

module.exports = () => {
    co(function *() {
        // 处理用户输入
        let tplName = yield prompt('选择哪种脚手架模版？（base/normal/super）: ')
        let projectName = yield prompt('给创建的新项目取个名字: ')
        let gitUrl
        let branch

        if (!config.tpl[tplName]) {
            console.log(chalk.red('\n × 所选的模版不存在!'))
            process.exit()
        }
        gitUrl = config.tpl[tplName].url
        branch = config.tpl[tplName].branch

        // git命令，远程拉取项目并自定义项目名
        let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`

        console.log(chalk.white('\n 远程提取模版文件 ...'))

        exec(cmdStr, (error, stdout, stderr) => {
            if (error) {
                console.log(error)
                process.exit()
            }
            console.log(chalk.green('\n √ 创建成功!'))
            console.log('\n 开始体验:')
            console.log(`\n cd ${projectName} && npm install && npm start \n`)
            process.exit()
        })
    })
}
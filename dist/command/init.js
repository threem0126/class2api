'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var exec = require('child_process').exec;
var co = require('co');
var prompt = require('co-prompt');
var config = require('../../templates.json');
var chalk = require('chalk');
var inquirer = require('inquirer');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');

var updateConfig = function updateConfig(sqlOptions, configFile) {
    var configText = fs.readFileSync(configFile, 'utf-8');
    configText = configText.replace(/{projectName}/igm, sqlOptions.projectName);
    configText = configText.replace(/{host}/igm, sqlOptions.host);
    configText = configText.replace(/{port}/igm, sqlOptions.port);
    configText = configText.replace(/{user}/igm, sqlOptions.user);
    configText = configText.replace(/{password}/igm, sqlOptions.password);
    configText = configText.replace(/{charset}/igm, sqlOptions.charset);
    configText = configText.replace(/{database}/igm, sqlOptions.database);
    //
    configText = configText.replace(/{cache_prefx}/igm, sqlOptions.projectName + '_');

    fs.writeFileSync(configFile, configText);
};

module.exports = function () {
    co( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var tplName, gitUrl, branch, defaultProjName, projectName, cmdStr;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        // 处理用户输入
                        console.log(chalk.green(' 脚手架模版类型：'));
                        console.log(chalk.green(' - base') + '   ——精简型，不带before/after拦截器');
                        console.log(chalk.green(' - normal') + ' ——普通型，带before/after拦截器、API缓存机制');
                        console.log(chalk.green(' - super') + '  ——增强型，带before/after拦截器、API缓存机制、数据库访问');
                        console.log(chalk.green(' - admin') + '  ——管理后台权限认证型，super的基础上附带管理身份权限校验');

                        _context2.next = 7;
                        return prompt('选择以上哪种模版？（base/normal/super/admin）: ');

                    case 7:
                        tplName = _context2.sent;


                        if (!config.tpl[tplName]) {
                            console.log(chalk.red('\n × 所选的模版不存在!'));
                            process.exit();
                        }
                        gitUrl = void 0;
                        branch = void 0;
                        defaultProjName = tplName + 'Demo' + Math.floor(Math.random() * 100000);
                        _context2.next = 14;
                        return prompt('\u7ED9\u521B\u5EFA\u7684\u65B0\u9879\u76EE\u53D6\u4E2A\u540D\u5B57(' + defaultProjName + '): ');

                    case 14:
                        projectName = _context2.sent;

                        projectName = projectName || defaultProjName;

                        gitUrl = config.tpl[tplName].url;
                        branch = config.tpl[tplName].branch;

                        // git命令，远程拉取项目并自定义项目名
                        cmdStr = 'git clone ' + gitUrl + ' ' + projectName + ' --progress && cd ' + projectName + ' && git checkout ' + branch;


                        console.log(chalk.white('\n 远程提取模版文件 ...'));
                        exec(cmdStr, function (error, stdout, stderr) {
                            co( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                                var sql, database, mysql, mysql_pool, _ref, affectedRows, sqlFile, tableSql, options;

                                return _regenerator2.default.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                if (error) {
                                                    console.log(error);
                                                    process.exit();
                                                }

                                                if (!(tplName === "super" || tplName === "admin")) {
                                                    _context.next = 53;
                                                    break;
                                                }

                                                console.log(chalk.green('\n 请配置数据库链接:'));
                                                sql = {};
                                                _context.next = 6;
                                                return prompt('数据库IP(127.0.0.1): ');

                                            case 6:
                                                sql.host = _context.sent;

                                                sql.host = sql.host || "127.0.0.1";
                                                _context.next = 10;
                                                return prompt('数据库端口(3306): ');

                                            case 10:
                                                sql.port = _context.sent;

                                                sql.port = sql.port || "3306";
                                                _context.next = 14;
                                                return prompt('数据库访问用户(root): ');

                                            case 14:
                                                sql.user = _context.sent;

                                                sql.user = sql.user || "root";
                                                _context.next = 18;
                                                return prompt('数据库密码(默认为空): ');

                                            case 18:
                                                sql.password = _context.sent;

                                                sql.password = sql.password || "";
                                                _context.next = 22;
                                                return prompt('创建新数据库的名称/存在则忽略(class2api_demo): ');

                                            case 22:
                                                database = _context.sent;

                                                database = database || "class2api_demo";
                                                _context.next = 26;
                                                return prompt('数据库编码(utf8_general_ci): ');

                                            case 26:
                                                sql.charset = _context.sent;

                                                sql.charset = sql.charset || "utf8_general_ci";
                                                //
                                                _context.prev = 28;
                                                mysql = require('mysql');
                                                mysql_pool = mysql.createPool(_extends({}, sql));

                                                Promise.promisifyAll(mysql_pool);
                                                _context.next = 34;
                                                return mysql_pool.queryAsync('CREATE DATABASE IF NOT EXISTS ' + database);

                                            case 34:
                                                _ref = _context.sent;
                                                affectedRows = _ref.affectedRows;
                                                sqlFile = path.join(process.cwd(), projectName, 'toolscript', 'init.sql');
                                                tableSql = fs.readFileSync(sqlFile, 'utf-8');

                                                tableSql = tableSql.replace('{databaseName}', database);
                                                _context.next = 41;
                                                return mysql_pool.queryAsync(tableSql);

                                            case 41:
                                                //
                                                options = _extends({}, sql, { database: database, projectName: projectName });

                                                updateConfig(options, path.join(process.cwd(), projectName, 'src', 'config', 'development.config.js'));
                                                updateConfig(options, path.join(process.cwd(), projectName, 'src', 'config', 'test.config.js'));
                                                updateConfig(options, path.join(process.cwd(), projectName, 'src', 'config', 'production.config.js'));
                                                //
                                                console.log(chalk.green('\n √ 数据库配置成功!'));
                                                _context.next = 53;
                                                break;

                                            case 48:
                                                _context.prev = 48;
                                                _context.t0 = _context['catch'](28);

                                                console.error(chalk.green('\n X 创建数据库遇到错误!'));
                                                console.error(_context.t0);
                                                process.exit();

                                            case 53:
                                                console.log(chalk.green('\n √ 项目创建成功!'));
                                                console.log('\n 开始体验:');
                                                if (tplName === "super" || tplName === "admin") {
                                                    console.log('\n $ cd ' + projectName + ' && npm install && npm start \n');
                                                } else {
                                                    console.log('\n $ cd ' + projectName + ' && npm install && npm start \n');
                                                }
                                                process.exit();

                                            case 57:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, this, [[28, 48]]);
                            }));
                        });

                    case 21:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));
};
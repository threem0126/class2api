#!/usr/bin/env node --harmony

'use strict';

process.env.NODE_PATH = __dirname + '/../../node_modules/';

var program = require('commander');

program.version(require('../../package').version);

program.usage('<command>');

program.command('init').description('从脚手架创建一个新项目').alias('i').action(function () {
    require('../../command/init')();
});

program.parse(process.argv);

if (!program.args.length) {
    program.help();
}
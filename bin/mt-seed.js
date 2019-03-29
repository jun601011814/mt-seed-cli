#! /usr/bin/env node

const { resolve } = require('path');
const res = command => resolve(__dirname, '../commands/', command);
const program = require('commander');

program.version(require('../package').version);

program.usage('<command> [options]');

program
    .command('init')
    // .option('-f, --foo', 'enable some foo')
    .description('初始化项目')
    .alias('i')
    .action(() => {
        require(res('init'))
    });

if (!program.args.length) {
    program.outputHelp();
}

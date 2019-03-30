#! /usr/bin/env node

const { resolve } = require('path')
const res = command => resolve(__dirname, '../commands/', command)
const program = require('commander')
// 定义版本号
program.version(require('../package').version)

// 定义使用方法
program.usage('<command>')

program
  .command('init')
  .option('-f, --foo', 'enable some foo')
  .description('初始化项目')
  .alias('i')
  .action(() => {
    require(res('init'))
  })

// 必须执行以下语句转换命令行参数，否则不执行action函数
program.parse(process.argv)

if (!program.args.length) {
  program.outputHelp()
}

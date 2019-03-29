const { prompt } = require('inquirer');
const program = require('commander');
const chalk = require('chalk');
const download = require('download-git-repo');
const ora = require('ora');
const fs = require('fs');

const option = program.parse(process.argv).args[0];
const defaultName = typeof option === 'string' ? option : '';
const tpls = require(`../templates`);
const tplKeys = Object.keys(tpls) || [];
const question = [
    {
        type: 'input',
        name: 'name',
        message: '请输入项目名称',
        default: defaultName,
        filter (val) {
            return val.trim()
        },
        validate (val) {
            const validate = (val.trim().split(" ")).length === 1;
            return validate || '项目名称不能包含空格';
        },
        transformer (val) {
            return val;
        }
    },
    {
        type: 'list',
        name: 'template',
        message: '请选择项目模板',
        choices: tplKeys,
        default: tplKeys[0],
        validate (val) {
            return true;
        },
        transformer (val) {
            return val;
        }
    },
    {
        type: 'input',
        name: 'description',
        message: '项目描述',
        default: '',
        validate (val) {
            return true;
        },
        transformer (val) {
            return val;
        }
    },
    {
        type: 'input',
        name: 'author',
        message: '项目作者',
        default: 'author',
        validate (val) {
            return true;
        },
        transformer (val) {
            return val;
        }
    }
];

module.exports = prompt(question).then(({name, template, description, author}) => {
    const projectName = name;
    const gitPlace = tpls[template]['place'];
    const gitBranch = tpls[template]['branch'];
    const spinner = ora('正在初始化项目...');
    spinner.start();

    download(`${gitPlace}${gitBranch}`, `./${projectName}`, (err) => {
        if (err) {
            console.log(chalk.red(err));
            process.exit()
        }

        fs.readFile(`./${projectName}/package.json`, 'utf8', function (err, data) {
            if (err) {
                spinner.stop();
                console.error(err);
                return;
            }
            const packageJson = JSON.parse(data);
            packageJson.name = name;
            packageJson.description = description;
            packageJson.author = author;
            const updatePackageJson = JSON.stringify(packageJson, null, 2);

            fs.writeFile(`./${projectName}/package.json`, updatePackageJson, 'utf8', function (err) {
                if (err) {
                    spinner.stop();
                    console.error(err);
                    return;
                } else {
                    spinner.stop();
                    console.log(chalk.green('项目初始化成功'));
                    console.log(`
                        ${chalk.bgWhite.black('   Run Application  ')}
                        ${chalk.yellow(`cd ${name}`)}
                        ${chalk.yellow('npm install')}
                        ${chalk.yellow('npm start')}
                    `);
                }
            });
        });
    });
});

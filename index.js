#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const ora = require('ora');
// const { exec } = require('child_process');

const spinner = ora();
const root = process.cwd();
const args = argsParse(process.argv.slice(2));

spinner.start('检索当前目录');
const dirs = listFilter(listDir(root), args);
spinner.succeed(`检索完成，共找到 ${dirs.length} 个目录`);

for (let i = 0; i < dirs.length; i++) {
  spinner.start(`正在删除第 ${i+1} 个目录 ${dirs[i]} 的 node_modules`);
  const dirName = path.basename(dirs[i]);
  const nodeModules = dirName === 'node_modules' ? [dirs[i]] : findNodeModules(dirs[i]);
  nodeModules.forEach(nodeModule => {
    fs.rmdirSync(nodeModule, {recursive: true});
    // exec(`rm -rf ${nodeModule}`, (err, stdout, stderr) => {
    //   if(err) spinner.fail(`删除失败：${nodeModule}`);
    // });
  })
  spinner.succeed(`第 ${i+1} 个目录 ${dirs[i]} 的 node_modules 删除成功`);
}

function listDir(dir){
    const files = fs.readdirSync(dir);
    const dirs = [];
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if(stat.isDirectory()){
            dirs.push(path.resolve(filePath));
        }
    });
    return dirs;
}

function listFilter(dirs, args){
  const fromIndex = args.from !== undefined ? dirs.indexOf(path.resolve(root, args.from)) : 0;
  const toIndex = args.to !== undefined ? dirs.indexOf(path.resolve(root, args.to)) : dirs.length;
  return dirs.slice(fromIndex, toIndex+1);
}

function argsParse(args){
    const _args = {};
    args.forEach(arg => {
        const [key, value] = arg.split('=');
        _args[key.replace(/^--/,'')] = value;
    });
    return _args;
}

function findNodeModules(dir){
    const files = fs.readdirSync(dir);
    const dirs = [];
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if(stat.isDirectory()){
            if(file === 'node_modules'){
                dirs.push(path.resolve(filePath));
            }else{
              if(args.deep) dirs.push(...findNodeModules(filePath));
            }
        }
    });
    return dirs;
}

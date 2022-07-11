# clear-npms
删除当前目录、或制定目录区间内的 node_modules 文件夹。 

## 使用方法

Windows 运行命令清除:

```bash
$ npx clear-npms
```

MacOS 运行命令清除:

```bash
sudo npx clear-npms
```

指定清除的文件夹区间：

```bash
$ npx clear-npms --from=dir_0 --to=dir_1
```

遍历文件夹：
```bash
$ npx clear-npms --deep=true
```

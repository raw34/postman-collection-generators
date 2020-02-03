#!/bin/bash

# 作用，生成从上个tag到现在的changelog，并自动打新tag
# 前提，已有CHANGELOG.md

# 获取参数
message=""
version=0

while getopts ":m:v:" optname
do
    case "$optname" in
        "m")
            message=$OPTARG
            ;;
        "v")
            version=$OPTARG
            ;;
    esac
done

if [[ $version == 0 ]]; then
    exit "Option v is required!"
fi

# 自动获取新版本号

# 拉主分支最新代码
git checkout master && git pull origin master &&

# 更新package版本号
sed -i "" "s/\"version\": \".*\",/\"version\": \"$version\",/" package.json
sed -i "" "s/\"version\": \"v/\"version\": \"/" package.json

# 生成changelog
git changelog -n -t $version && cat CHANGELOG.md &&

# 提交改动
git add package.json CHANGELOG.md &&
git commit -m "docs: update changelog" &&

# 打tag
git tag $version -m "$message"


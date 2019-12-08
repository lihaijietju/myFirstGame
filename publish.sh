#!/bin/sh

git pull origin master
echo "拉取代码成功"

npm install

echo "npm install成功"


rm -rf ./dist
cd node
rm -rf ./dist
cd ..

echo "删除dist目录成功"

npm run build
echo "build成功"

mv ./dist ./node

pm2 restart ./node/app.js

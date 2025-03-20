#!/bin/bash
echo "正在部署..."
git pull origin main
npm install --production
docker build -t super-ttt .
docker stop ttt-game || true
docker rm ttt-game || true
docker run -d \
  --name ttt-game \
  -p 3000:3000 \
  -e DEPLOY_PASSWORD=${DEPLOY_PASSWORD} \
  super-ttt
echo "部署完成！"
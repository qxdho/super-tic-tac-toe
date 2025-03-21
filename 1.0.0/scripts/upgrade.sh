#!/bin/bash
# 升级脚本（升级前执行）
# 用途：备份数据、迁移配置等

echo "正在备份旧版本数据..."
cp -r ./data ./data_backup_$(date +%Y%m%d%H%M%S)
echo "备份完成！开始升级..."
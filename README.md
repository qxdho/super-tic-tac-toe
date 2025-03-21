# Super Tic-Tac-Toe  
[![GitHub license](https://img.shields.io/github/license/qxdho/super-tic-tac-toe)](https://github.com/qxdho/super-tic-tac-toe/blob/main/LICENSE)  
基于 WebSocket 的实时多人超级井字棋游戏，支持 1Panel 一键部署  
---

## **功能特性**
✅ 实时双人对战  
✅ 嵌套棋盘规则（9x9）  
✅ 智能落子限制  
✅ 胜利动画与全局判定  
✅ 1Panel 一键部署  
✅ 响应式界面（PC/移动端）

---

## **快速开始**
### **本地开发**
```bash
# 克隆仓库
git clone https://github.com/qxdho/super-tic-tac-toe.git
cd super-tic-tac-toe

# 安装依赖
npm install

# 启动开发服务器
npm start
```
访问 `http://localhost:3000` 开始游戏

---

### **通过 1Panel 部署**
#### **方法 1：使用自动化脚本**
```bash
#!/bin/sh

# 自动获取1Panel安装路径
install_dir=$(grep '^BASE_DIR=' /usr/bin/1pctl | cut -d'=' -f2 | sed 's/\/$//')

# 应用名称（与仓库名一致）
APP_NAME="super-tictactoe"

# 强制删除旧版本（如果存在）
rm -rf "$install_dir/1panel/resource/apps/local/$APP_NAME"

# 克隆仓库到正确位置（直接使用仓库中的版本目录）
git clone https://github.com/qxdho/super-tic-tac-toe.git \
  "$install_dir/1panel/resource/apps/local/$APP_NAME"

# 验证关键路径
if [ -f "$install_dir/1panel/resource/apps/local/$APP_NAME/1.0.0/docker-compose.yml" ]; then
    echo "部署成功！请执行："
    echo "1. 进入1Panel控制台"
    echo "2. 刷新应用商店"
    echo "3. 安装 '超级井字棋 1.0.0'"
else
    echo "部署失败：请检查仓库是否包含 1.0.0/docker-compose.yml"
    exit 1
fi
```

#### **方法 2：手动部署**
1. **进入1Panel应用目录**  
   ```bash
   cd /opt/1panel/resource/apps/local
   ```

2. **下载应用文件**  
   ```bash
   git clone https://github.com/qxdho/super-tic-tac-toe.git super-ttt
   ```

3. **刷新应用商店**  
   进入 **1Panel → 应用商店 → 本地应用 → 点击刷新**

---

## **游戏规则**
1. 每个小棋盘独立判断胜负  
2. 上一步落子位置决定下一步可选棋盘  
3. 全局棋盘由小棋盘胜负结果组成  
4. 率先在全局棋盘达成三连者获胜  

---

## **贡献指南**
1. Fork 本仓库  
2. 创建特性分支 (`git checkout -b feature/fooBar`)  
3. 提交更改 (`git commit -am 'Add some fooBar'`)  
4. 推送分支 (`git push origin feature/fooBar`)  
5. 提交 Pull Request  

---

## **许可证**
MIT License © 2025 [qxdho](https://github.com/qxdho)

---

### **注意事项**
1. **脚本使用说明**  
   - 需要 root 权限执行自动化脚本  
   - 确保服务器已安装 `git`  
   - 部署后需在 1Panel 中刷新应用列表

2. **端口要求**  
   需开放 `3000` 端口（可通过 `docker-compose.yml` 修改）

3. **兼容性**  
   已验证支持 1Panel v1.3+ 版本
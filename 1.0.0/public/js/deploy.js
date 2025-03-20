const deploySocket = io('/deploy');

// 认证处理
function authenticate() {
  const password = document.getElementById('deploy-password').value;
  deploySocket.emit('auth', password);
}

// 部署操作
function deploy() {
  deploySocket.emit('deploy');
}

// 重启服务
function restartService() {
  deploySocket.emit('restart');
}

// 停止服务
function stopService() {
  deploySocket.emit('stop');
}

// 检查服务状态
function checkStatus() {
  deploySocket.emit('status_check');
}

// 日志流处理
deploySocket.on('log', (message) => {
  const logBox = document.getElementById('deploy-log');
  logBox.textContent += message + '\n';
  logBox.scrollTop = logBox.scrollHeight;
});

// 状态更新
deploySocket.on('status', (status) => {
  document.getElementById('service-status').textContent = status;
});

// 认证结果
deploySocket.on('auth_result', (success) => {
  if (success) {
    document.querySelector('.auth-section').style.display = 'none';
    document.querySelector('.controls').style.display = 'block';
  } else {
    alert('认证失败！');
  }
});
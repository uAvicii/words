@echo off
echo 测试后端服务器...
echo.

cd server

echo [1] 检查 package.json...
if exist package.json (
    echo ✓ package.json 存在
) else (
    echo ✗ package.json 不存在
    pause
    exit /b 1
)

echo.
echo [2] 安装依赖...
call npm install

echo.
echo [3] 启动服务器...
echo 如果看到 "服务器运行在 http://localhost:3000"，说明启动成功
echo.
node server.js

pause


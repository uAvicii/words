@echo off
echo ========================================
echo 启动背单词应用（包含登录系统）
echo ========================================
echo.

echo [1/2] 启动后端服务器...
start "后端服务器" cmd /k "cd server && npm install && npm start"

timeout /t 3 /nobreak >nul

echo [2/2] 启动前端应用...
start "前端应用" cmd /k "npm run dev"

echo.
echo ========================================
echo 启动完成！
echo 后端: http://localhost:3000
echo 前端: http://localhost:5173
echo ========================================
echo.
echo 请在浏览器中访问 http://localhost:5173
echo 按任意键关闭此窗口...
pause >nul


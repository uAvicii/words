@echo off
echo 🚀 开始部署专属背单词应用到Vercel...

echo.
echo 📦 检查依赖...
if not exist node_modules (
    echo 安装依赖...
    npm install
)

echo.
echo 🔨 测试本地构建...
npm run build

if %errorlevel% neq 0 (
    echo ❌ 本地构建失败！请检查代码。
    pause
    exit /b 1
)

echo.
echo ✅ 本地构建成功！
echo.
echo 🚀 部署到Vercel...
echo 注意：如果这是首次部署，请确保已安装Vercel CLI: npm i -g vercel
echo.

vercel --prod

if %errorlevel% neq 0 (
    echo.
    echo ❌ 部署失败！
    echo 💡 解决方案：
    echo 1. 确保已安装Vercel CLI: npm i -g vercel
    echo 2. 确保已登录: vercel login
    echo 3. 检查网络连接
    echo 4. 查看Vercel Dashboard中的详细错误日志
    pause
    exit /b 1
)

echo.
echo ✅ 部署完成！
echo 🌐 你的专属背单词应用现在可以在线访问了！
echo 📱 支持移动端和桌面端
echo 💾 数据存储在本地，支持离线使用
pause

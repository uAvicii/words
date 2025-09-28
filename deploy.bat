@echo off
echo 🚀 开始部署专属背单词应用到Vercel...

echo.
echo 📦 检查依赖...
if not exist node_modules (
    echo 安装依赖...
    npm install
)

echo.
echo 🔨 构建项目...
npm run build

if %errorlevel% neq 0 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)

echo.
echo 🚀 部署到Vercel...
vercel --prod

if %errorlevel% neq 0 (
    echo ❌ 部署失败！
    pause
    exit /b 1
)

echo.
echo ✅ 部署完成！
echo 🌐 你的应用现在可以在线访问了！
pause

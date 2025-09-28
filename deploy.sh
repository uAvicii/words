#!/bin/bash
echo "🚀 开始部署专属背单词应用到Vercel..."

echo ""
echo "📦 检查依赖..."
if [ ! -d "node_modules" ]; then
    echo "安装依赖..."
    npm install
fi

echo ""
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败！"
    exit 1
fi

echo ""
echo "🚀 部署到Vercel..."
vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ 部署失败！"
    exit 1
fi

echo ""
echo "✅ 部署完成！"
echo "🌐 你的应用现在可以在线访问了！"

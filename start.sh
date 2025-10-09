#!/bin/bash

echo "========================================"
echo "启动背单词应用（包含登录系统）"
echo "========================================"
echo ""

echo "[1/2] 启动后端服务器..."
cd server && npm install && npm start &
SERVER_PID=$!

sleep 3

echo "[2/2] 启动前端应用..."
cd .. && npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "启动完成！"
echo "后端: http://localhost:3000"
echo "前端: http://localhost:5173"
echo "========================================"
echo ""
echo "请在浏览器中访问 http://localhost:5173"
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
wait


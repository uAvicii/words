# 🚀 部署到Vercel指南

## 方法一：通过Vercel CLI部署（推荐）

### 1. 安装Vercel CLI
```bash
npm i -g vercel
```

### 2. 登录Vercel账户
```bash
vercel login
```

### 3. 在项目根目录部署
```bash
# 首次部署
vercel

# 后续更新部署
vercel --prod
```

## 方法二：通过GitHub部署（自动化）

### 1. 推送代码到GitHub
```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 专属背单词应用"

# 添加远程仓库（替换为你的GitHub仓库地址）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 推送到GitHub
git push -u origin main
```

### 2. 在Vercel连接GitHub仓库
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择你的GitHub仓库
4. Vercel会自动检测到Vue项目并配置构建设置

## 方法三：通过Vercel Dashboard部署

### 1. 准备部署文件
确保项目根目录有 `vercel.json` 配置文件

### 2. 在Vercel Dashboard部署
1. 访问 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 选择 "Import Git Repository" 或 "Upload"
4. 上传项目文件夹
5. 点击 "Deploy"

## 🔧 部署配置说明

### vercel.json 配置
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 环境变量（如需要）
在Vercel Dashboard的Project Settings中添加：
- `NODE_ENV=production`
- 其他必要的环境变量

## 📱 部署后的优化

### 1. 自定义域名
1. 在Vercel Dashboard进入项目设置
2. 在 "Domains" 部分添加你的域名
3. 配置DNS记录

### 2. 性能优化
- Vercel会自动启用CDN
- 支持HTTP/2和Gzip压缩
- 自动HTTPS证书

### 3. 监控和分析
- 在Vercel Dashboard查看部署日志
- 使用Vercel Analytics监控性能
- 查看访问统计和错误日志

## 🚀 快速部署命令

### 一键部署脚本
创建 `deploy.sh` 文件：

```bash
#!/bin/bash
echo "🚀 开始部署到Vercel..."

# 构建项目
echo "📦 构建项目..."
npm run build

# 部署到Vercel
echo "🚀 部署到Vercel..."
vercel --prod

echo "✅ 部署完成！"
```

### Windows批处理文件
创建 `deploy.bat` 文件：

```batch
@echo off
echo 🚀 开始部署到Vercel...

echo 📦 构建项目...
npm run build

echo 🚀 部署到Vercel...
vercel --prod

echo ✅ 部署完成！
pause
```

## 🔍 部署后检查清单

### ✅ 功能检查
- [ ] 首页正常显示
- [ ] 导航栏工作正常
- [ ] 单词浏览功能正常
- [ ] 复习功能正常
- [ ] 设置页面正常
- [ ] 移动端适配正常

### ✅ 性能检查
- [ ] 页面加载速度
- [ ] 移动端响应速度
- [ ] 本地存储功能
- [ ] 离线使用能力

### ✅ SEO优化
- [ ] 页面标题正确
- [ ] 元描述设置
- [ ] 移动端viewport
- [ ] 主题色设置

## 🛠 常见问题解决

### 1. 构建失败
```bash
# 检查Node.js版本
node --version

# 清除缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### 2. 路由问题
确保 `vercel.json` 中的rewrites配置正确：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. 环境变量问题
在Vercel Dashboard的Environment Variables中添加必要的变量。

## 📊 部署后监控

### 1. Vercel Dashboard
- 查看部署状态
- 监控性能指标
- 查看错误日志

### 2. 用户反馈
- 收集用户使用反馈
- 监控页面访问量
- 分析用户行为

## 🎯 最佳实践

### 1. 自动化部署
- 连接GitHub仓库
- 设置自动部署
- 配置分支保护

### 2. 性能优化
- 启用Vercel Analytics
- 配置CDN缓存
- 优化图片和资源

### 3. 安全设置
- 启用HTTPS
- 配置安全头
- 设置访问控制

## 🚀 部署成功！

部署完成后，你将获得：
- 一个可访问的在线应用
- 自动HTTPS证书
- 全球CDN加速
- 实时部署日志
- 性能监控面板

你的专属背单词应用现在可以在任何设备上访问了！🎉

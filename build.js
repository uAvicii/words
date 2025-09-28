#!/usr/bin/env node

// 修复Vercel部署权限问题的构建脚本
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 修复权限问题...');

try {
  // 确保node_modules/.bin目录下的文件有执行权限
  const binDir = path.join(process.cwd(), 'node_modules', '.bin');

  if (fs.existsSync(binDir)) {
    const files = fs.readdirSync(binDir);
    files.forEach(file => {
      const filePath = path.join(binDir, file);
      try {
        fs.chmodSync(filePath, '755');
      } catch (err) {
        // 忽略权限设置错误
      }
    });
  }

  console.log('✅ 权限修复完成');
  console.log('🚀 开始构建...');

  // 执行vite构建
  execSync('node node_modules/vite/bin/vite.js build', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ 构建完成！');

} catch (error) {
  console.error('❌ 构建失败:', error.message);
  process.exit(1);
}

#!/bin/bash

# 前端启动脚本
# 用途：一键启动 Vue 开发服务器

echo "=========================================="
echo "  接口自动化测试平台 - 前端启动脚本"
echo "=========================================="

# 进入项目目录
cd "$(dirname "$0")"

# 检查 Node.js 环境
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js 14+"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"
echo "✓ npm 版本: $(npm --version)"

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo ""
    echo "⚠️  检测到 node_modules 不存在，正在安装依赖..."
    npm install --legacy-peer-deps
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败，请检查网络连接和 Node.js 环境"
        exit 1
    fi
    echo "✓ 依赖安装完成"
else
    echo "✓ 依赖已安装"
fi

# 启动开发服务器
echo ""
echo "=========================================="
echo "  正在启动 Vue 开发服务器..."
echo "  访问地址: http://localhost:8080"
echo "=========================================="
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run serve


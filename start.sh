#!/bin/bash

# Synapse 启动脚本
# 用于快速启动开发环境

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ ${NC}$1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 打印欢迎信息
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}    Synapse - AI洞察引擎演示平台${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""

# 检查Node.js
print_info "检查Node.js版本..."
if ! command -v node &> /dev/null; then
    print_error "未检测到Node.js，请先安装Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js版本过低（当前: v$(node -v)），需要 >= 18.0.0"
    exit 1
fi
print_success "Node.js版本: $(node -v)"

# 检查npm
print_info "检查npm版本..."
if ! command -v npm &> /dev/null; then
    print_error "未检测到npm，请先安装npm >= 9.0.0"
    exit 1
fi
print_success "npm版本: $(npm -v)"

# 进入项目目录
print_info "进入项目目录..."
cd synapse

# 检查是否需要安装依赖
if [ ! -d "node_modules" ]; then
    print_warning "未检测到node_modules目录，开始安装依赖..."
    npm install
    print_success "依赖安装完成"
else
    print_success "依赖已安装"
    
    # 可选：检查package-lock.json是否有更新
    if [ package.json -nt node_modules ]; then
        print_warning "package.json已更新，建议重新安装依赖"
        read -p "是否重新安装依赖？(y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install
            print_success "依赖更新完成"
        fi
    fi
fi

echo ""
print_info "启动开发服务器..."
echo -e "${GREEN}应用将在 http://localhost:5173 启动${NC}"
echo -e "${YELLOW}按 Ctrl+C 停止服务器${NC}"
echo ""

# 启动开发服务器
npm run dev

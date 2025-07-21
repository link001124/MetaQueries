#!/bin/bash

# Grafana Meta Queries 构建脚本
# 使用方法: ./build.sh

set -e

echo "🚀 开始构建 Grafana Meta Queries React 版本..."

# 检查 Node.js 版本
echo "📋 检查环境依赖..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 需要安装 Node.js >= 16"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ 错误: Node.js 版本过低，需要 >= 16，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js 版本检查通过: $(node -v)"

# 使用 React 版本的 package.json
echo "📦 配置 React 版本..."
if [ -f "package.json" ]; then
    echo "✅ package.json 已就位"
else
    echo "❌ 错误: 找不到 package.json"
    exit 1
fi

# 安装依赖
echo "📥 安装依赖..."
npm install

# 构建 React 版本
echo "🔨 构建 React 版本..."
if [ -d "src" ]; then
    # 安装依赖并构建
    npm install
    npm run build
    
    echo "✅ React 版本构建完成"
else
    echo "❌ 错误: 找不到 src 目录"
    exit 1
fi

# 创建部署包
echo "📦 创建部署包..."
PACKAGE_NAME="grafana-meta-queries-react-$(date +%Y%m%d-%H%M%S)"
mkdir -p "packages/$PACKAGE_NAME"

# 复制必要文件
cp -r dist/* "packages/$PACKAGE_NAME/"
cp README-React.md "packages/$PACKAGE_NAME/README.md"
cp MIGRATION-GUIDE.md "packages/$PACKAGE_NAME/"
cp LICENSE "packages/$PACKAGE_NAME/"

# 创建安装脚本
cat > "packages/$PACKAGE_NAME/install.sh" << 'EOF'
#!/bin/bash
# Grafana Meta Queries React 版本安装脚本

GRAFANA_PLUGINS_DIR=${GRAFANA_PLUGINS_DIR:-"/var/lib/grafana/plugins"}
PLUGIN_DIR="$GRAFANA_PLUGINS_DIR/grafana-meta-queries-react"

echo "安装 Grafana Meta Queries React 版本到: $PLUGIN_DIR"

# 创建插件目录
sudo mkdir -p "$PLUGIN_DIR"

# 复制文件
sudo cp -r ./* "$PLUGIN_DIR/"

# 设置权限
sudo chown -R grafana:grafana "$PLUGIN_DIR"
sudo chmod -R 755 "$PLUGIN_DIR"

echo "✅ 安装完成！"
echo "请重启 Grafana 服务以加载新插件:"
echo "  sudo systemctl restart grafana-server"
EOF

chmod +x "packages/$PACKAGE_NAME/install.sh"

# 创建压缩包
cd packages
tar -czf "$PACKAGE_NAME.tar.gz" "$PACKAGE_NAME"
cd ..

echo "✅ 部署包已创建: packages/$PACKAGE_NAME.tar.gz"

# 显示安装说明
echo ""
echo "🎉 构建完成!"
echo ""
echo "📦 部署包位置: packages/$PACKAGE_NAME.tar.gz"
echo ""
echo "🚀 安装步骤:"
echo "  1. 解压部署包:"
echo "     tar -xzf packages/$PACKAGE_NAME.tar.gz"
echo ""
echo "  2. 运行安装脚本:"
echo "     cd $PACKAGE_NAME && sudo ./install.sh"
echo ""
echo "  3. 重启 Grafana:"
echo "     sudo systemctl restart grafana-server"
echo ""
echo "📖 详细安装指南请查看: INSTALL-GUIDE.md"
echo ""
echo "⚠️  注意事项:"
echo "   - 需要 Grafana >= 8.0.0"
echo "   - 建议先在测试环境中验证"

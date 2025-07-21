# Grafana Meta Queries Plugin - React 版本部署指南

## 构建完成

✅ **成功构建了适用于 Grafana 的 React 版本 Meta Queries 插件！**

## 文件结构

dist/ 目录包含了所有 Grafana 所需的文件：

```
dist/
├── module.js              # 主插件文件 (6.12 KB)
├── module.js.LICENSE.txt  # 许可证信息
├── plugin.json           # 插件配置文件
├── README.md             # 插件文档
└── img/                  # 示例图片
    ├── arithmetic-ex1.png
    ├── arithmetic-ex2.png
    ├── DataSourceConfig.png
    ├── MetaQueryPanel.png
    ├── moving_average-ex1.png
    └── time_shift-ex1.png
```

## 部署方法

### 方法 1: 复制到 Grafana 插件目录

```bash
# 1. 找到 Grafana 插件目录
# 通常在以下位置之一：
# - /var/lib/grafana/plugins/
# - /usr/share/grafana/data/plugins/
# - /etc/grafana/plugins/
# - 或者在 grafana.ini 中 [paths] plugins 指定的目录

# 2. 复制插件文件
sudo cp -r dist/ /var/lib/grafana/plugins/goshposh-metaqueries-react-datasource/

# 3. 重启 Grafana 服务
sudo systemctl restart grafana-server
```

### 方法 2: 使用 Grafana CLI

```bash
# 如果你有访问权限，可以使用符号链接
grafana-cli --pluginsDir /var/lib/grafana/plugins plugins install file://$(pwd)/dist
```

### 方法 3: Docker 部署

```dockerfile
# 在 Dockerfile 中添加
COPY dist/ /var/lib/grafana/plugins/goshposh-metaqueries-react-datasource/

# 或者在 docker-compose.yml 中挂载
volumes:
  - ./dist:/var/lib/grafana/plugins/goshposh-metaqueries-react-datasource
```

## 验证安装

1. 重启 Grafana 后，登录到 Grafana 管理界面
2. 导航到 **Configuration** → **Data Sources**
3. 点击 **Add data source**
4. 在列表中寻找 **MetaQueries (React)**
5. 配置数据源并测试连接

## 功能特性

### 🚀 全新 React 界面
- 现代化的用户界面设计
- 实时验证和错误提示
- 更好的用户体验

### 📊 三种查询类型

1. **TimeShift**: 时间偏移比较
   - 支持秒、分钟、小时、天、周、月
   - 同比、环比分析

2. **MovingAverage**: 移动平均线
   - 可配置周期数
   - 平滑数据趋势

3. **Arithmetic**: 算术运算
   - 支持多个查询间的数学运算
   - 表达式解析 (如: A + B, A / B * 100)

### 🔧 增强功能
- 模板变量支持
- 多数据源集成
- 调试模式
- 完整的错误处理

## 使用示例

### TimeShift 查询
```
Type: TimeShift
Periods: 7
Unit: days
Query: A
Output Name: last_week_comparison
```

### MovingAverage 查询
```
Type: MovingAverage
Periods: 7
Query: A
Output Name: 7_day_avg
```

### Arithmetic 查询
```
Type: Arithmetic
Expression: A + B
Output Name: combined_metric
```

## 构建信息

- **构建时间**: $(date)
- **文件大小**: 2.2MB
- **技术栈**: React 18 + TypeScript 5
- **构建工具**: Webpack 5
- **目标**: Grafana 8.0.0+

## 故障排除

### 插件未显示
1. 确认文件权限正确 (grafana:grafana)
2. 检查 Grafana 日志: `sudo journalctl -u grafana-server -f`
3. 验证 plugin.json 格式

### 数据源连接失败
1. 启用调试模式
2. 查看浏览器控制台
3. 确认依赖的数据源可用

### 性能问题
1. 减少查询频率
2. 优化表达式复杂度
3. 使用缓存策略

## 支持

如有问题，请查看：
- GitHub Issues: https://github.com/link001124/MetaQueries/issues
- Grafana 文档: https://grafana.com/docs/grafana/latest/developers/plugins/

---

**🎉 React 版本迁移完成！现在你可以在 Grafana 中使用现代化的 Meta Queries 功能了。**

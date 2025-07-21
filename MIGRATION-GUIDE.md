# 迁移指南：从 AngularJS 到 React

这个文档详细说明了如何从原有的 AngularJS 版本迁移到新的 React 版本。

## 🔄 迁移步骤

### 第一步：备份现有插件

```bash
# 备份当前版本
cp -r /var/lib/grafana/plugins/grafana-meta-queries /var/lib/grafana/plugins/grafana-meta-queries-backup
```

### 第二步：安装新版本

1. **克隆或更新仓库**：
```bash
git pull origin master
```

2. **安装 React 版本依赖**：
```bash
# 使用新的 package.json
cp package-react.json package.json
npm install
```

3. **构建 React 版本**：
```bash
npm run build
```

4. **部署到 Grafana**：
```bash
# 使用 src-react 作为源代码目录
cp -r dist /var/lib/grafana/plugins/grafana-meta-queries-react
```

### 第三步：更新数据源配置

1. 在 Grafana 中创建新的数据源实例
2. 选择 "MetaQueries (React)" 作为数据源类型
3. 测试连接确保工作正常

### 第四步：迁移现有面板

1. **导出现有仪表板**：在 Grafana 中导出使用 Meta Queries 的仪表板
2. **编辑仪表板 JSON**：将数据源引用从旧版本更改为新版本
3. **重新导入仪表板**：导入修改后的仪表板

## 📊 界面对比

### AngularJS 版本 vs React 版本

| 功能 | AngularJS 版本 | React 版本 | 改进点 |
|------|---------------|------------|-------|
| 查询类型选择 | 下拉菜单 | 下拉菜单 + 描述 | 增加了功能描述 |
| 输入验证 | 基础验证 | 实时验证 + 错误提示 | 更好的用户体验 |
| 界面布局 | 固定布局 | 响应式布局 | 适配不同屏幕 |
| 错误显示 | 警告图标 | 警告面板 + 详细信息 | 更清晰的错误信息 |
| 字段提示 | 基础提示 | 工具提示 + 帮助文本 | 更详细的指导 |

### 查询编辑器功能对比

#### TimeShift 查询
**原版本**：
- 基础的周期和单位选择
- 简单的查询和指标输入

**React 版本**：
- 实时验证周期数值
- 清晰的单位选择
- 智能提示和帮助文本
- 动态显示查询描述

#### MovingAverage 查询
**原版本**：
- 周期输入
- 查询和指标字段

**React 版本**：
- 数值验证（最小值为1）
- 清晰的字段说明
- 实时错误提示

#### Arithmetic 查询
**原版本**：
- 表达式输入框

**React 版本**：
- 表达式验证
- 查询引用说明（A, B, C等）
- 表达式示例和帮助

## 🔧 配置差异

### plugin.json 变化

```json
// 原版本
{
  "dependencies": {
    "grafanaDependency": ">=4.0.0"
  }
}

// React 版本
{
  "dependencies": {
    "grafanaDependency": ">=8.0.0"
  }
}
```

### 构建系统变化

| 原版本 | React 版本 |
|--------|------------|
| Grunt | Grafana Toolkit |
| TypeScript 1.7 | TypeScript 5.0 |
| 手动模块管理 | ES6 模块 |

## ⚠️ 注意事项

### 兼容性

1. **Grafana 版本要求**：React 版本需要 Grafana >= 8.0.0
2. **查询格式兼容**：查询格式保持100%兼容，无需修改现有查询
3. **数据源配置**：配置参数保持一致

### 已知差异

1. **UI组件库**：从自定义CSS改为 @grafana/ui 组件
2. **验证行为**：React版本提供更实时的验证反馈
3. **错误显示**：错误信息显示方式有所改善

## 🧪 测试验证

### 功能测试清单

- [ ] TimeShift 查询正常工作
- [ ] MovingAverage 查询正常工作  
- [ ] Arithmetic 查询正常工作
- [ ] 输入验证按预期工作
- [ ] 错误信息正确显示
- [ ] 数据源测试连接成功
- [ ] 面板数据正确显示

### 测试步骤

1. **创建测试查询**：
```javascript
// TimeShift 示例
{
  "queryType": "TimeShift",
  "periods": 7,
  "timeshiftUnit": "days",
  "query": "A",
  "metric": "cpu_usage",
  "outputMetricName": "cpu_usage_7d_ago"
}

// MovingAverage 示例
{
  "queryType": "MovingAverage", 
  "periods": 7,
  "query": "A",
  "metric": "cpu_usage",
  "outputMetricName": "cpu_usage_7d_avg"
}

// Arithmetic 示例
{
  "queryType": "Arithmetic",
  "expression": "A - B",
  "outputMetricName": "cpu_diff"
}
```

2. **验证数据输出**：确保输出数据格式和数值与原版本一致

## 🔙 回滚方案

如果需要回滚到 AngularJS 版本：

1. **停止 Grafana**：
```bash
sudo systemctl stop grafana-server
```

2. **恢复原版本**：
```bash
rm -rf /var/lib/grafana/plugins/grafana-meta-queries-react
cp -r /var/lib/grafana/plugins/grafana-meta-queries-backup /var/lib/grafana/plugins/grafana-meta-queries
```

3. **重启 Grafana**：
```bash
sudo systemctl start grafana-server
```

## 📞 支持和问题反馈

如果在迁移过程中遇到问题，请：

1. 检查 Grafana 日志：`/var/log/grafana/grafana.log`
2. 验证插件是否正确加载
3. 确认依赖版本匹配要求
4. 在 GitHub 仓库提交 Issue

## 🎯 迁移后的优势

完成迁移后，你将获得：

- ✨ 现代化的用户界面
- 🚀 更好的性能和稳定性
- 🔍 增强的错误检测和验证
- 📱 响应式设计支持
- 🛠️ 更好的开发和维护体验
- 🔮 面向未来的技术栈

# MetaQueries Plugin for Grafana (React Version)

## 🚀 Modern React-Based Meta Query Engine

MetaQueries is an advanced data source plugin for Grafana that enables sophisticated meta-analytics capabilities. This React version offers a modern, intuitive interface with enhanced validation and improved performance.

## ✨ Key Features

### 🔄 Time Shift Queries
- **Compare current data with historical periods**
- Support for multiple time units (seconds, minutes, hours, days, weeks, months)
- Perfect for week-over-week, month-over-month comparisons
- Example: Compare today's CPU usage with 7 days ago

### 📊 Moving Average Calculations
- **Calculate rolling averages over specified periods**
- Configurable window sizes
- Ideal for trend analysis and noise reduction
- Example: 30-day moving average of sales data

### 🧮 Arithmetic Operations
- **Perform complex calculations between different metrics**
- JavaScript expression support with template variables
- Reference multiple queries (A, B, C, etc.)
- Example: Calculate percentage differences, ratios, custom formulas

## 🎨 React Version Improvements

### Enhanced User Interface
- ✅ **Modern Design**: Built with @grafana/ui components
- ✅ **Real-time Validation**: Instant feedback on input errors
- ✅ **Smart Tooltips**: Contextual help for every field
- ✅ **Responsive Layout**: Optimized for all screen sizes

### Developer Experience
- ✅ **TypeScript Support**: Full type safety
- ✅ **Modern Build Tools**: Grafana Toolkit integration
- ✅ **Hot Reload**: Fast development cycles
- ✅ **Better Testing**: Modern testing framework

## 📋 Requirements

- Grafana >= 8.0.0
- At least one other data source to query from

## 🛠️ Installation

### Quick Install

```bash
```bash
# Clone the repository
git clone https://github.com/link001124/MetaQueries.git
cd grafana-meta-queries
```

# Run the migration script
./migrate-to-react.sh

# Restart Grafana
sudo systemctl restart grafana-server
```

### Manual Installation

```bash
# Build the plugin
cp package-react.json package.json
npm install
npm run build

# Deploy to Grafana
sudo cp -r dist /var/lib/grafana/plugins/grafana-meta-queries-react
sudo chown -R grafana:grafana /var/lib/grafana/plugins/grafana-meta-queries-react
sudo systemctl restart grafana-server
```

## 🚀 Quick Start

1. **Create Data Source**: Go to Configuration > Data Sources > Add data source
2. **Select MetaQueries**: Choose "MetaQueries (React)" from the list
3. **Test Connection**: Click "Save & Test" to verify it's working
4. **Create Queries**: Start building meta queries in your dashboards

## 📖 Usage Examples

### Time Shift Example
```javascript
Query Type: TimeShift
Periods: 7
Unit: days
Query: A
Metric: cpu_usage
Output Name: cpu_usage_last_week
```

### Moving Average Example
```javascript
Query Type: MovingAverage
Periods: 30
Query: A
Metric: sales_revenue
Output Name: sales_30day_avg
```

### Arithmetic Example
```javascript
Query Type: Arithmetic
Expression: (A - B) / B * 100
Output Name: growth_percentage
```

## 🔧 Configuration

The MetaQueries data source requires no additional configuration. Simply add it as a data source and start creating meta queries.

## 📚 Documentation

- [Migration Guide](MIGRATION-GUIDE.md) - How to upgrade from AngularJS version
- [Installation Guide](INSTALL-GUIDE.md) - Detailed installation instructions
- [GitHub Repository](https://github.com/link001124/MetaQueries) - Source code and issues

## 🐛 Troubleshooting

### Common Issues

**Plugin not appearing in data source list:**
- Check Grafana logs: `tail -f /var/log/grafana/grafana.log`
- Verify plugin directory permissions
- Ensure Grafana version >= 8.0.0

**Queries not returning data:**
- Verify referenced data sources are working
- Check query references (A, B, C) are correct
- Review browser console for JavaScript errors

## 🤝 Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/link001124/MetaQueries) for:
- Bug reports
- Feature requests
- Pull requests
- Documentation improvements

## 📄 License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

## 🏆 Acknowledgments

- Original AngularJS version by Gaurav Shah
- React migration with modern Grafana APIs
- Community feedback and contributions

---

**Ready to supercharge your Grafana dashboards with advanced meta-analytics?** 🚀

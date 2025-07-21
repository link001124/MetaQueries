# Meta Queries Plugin for Grafana (React Version)

Meta Queries plugin is built as a data source plugin and can be used in conjunction with other data sources to show computed metrics like Moving Average, Time Shift, and Arithmetic operations.

This is the modern React rewrite of the original AngularJS version, providing enhanced UI, better performance, and improved developer experience while maintaining full compatibility with existing functionality.

## 🚀 React Version Features

- ✨ **Modern React Architecture**: Built with React 18 and TypeScript 5
- 🎯 **Enhanced UI**: Based on @grafana/ui component library for consistency
- ⚡ **Better Performance**: Utilizing React Hooks and modern optimization techniques  
- 🔍 **Real-time Validation**: Instant input validation and error feedback
- 📱 **Responsive Design**: Better mobile and small screen support
- 🛠️ **Developer Experience**: Improved TypeScript support and development tools

## Supported Operations

### Time Shift
- Compare current data with historical periods
- Support for multiple time units (seconds, minutes, hours, days, weeks, months)
- Perfect for week-over-week, month-over-month comparisons

### Moving Average
- Calculate rolling averages over specified periods
- Configurable window sizes for trend analysis
- Ideal for smoothing noisy data

### Arithmetic Operations
- Perform complex calculations between different metrics
- JavaScript expression support with template variables
- Reference multiple queries using syntax like A, B, C, etc.

## Installation

### Prerequisites
- Grafana >= 8.0.0
- Node.js >= 16 (for building from source)

### Method 1: Install Pre-built Plugin

1. Clone this repository into your grafana plugins directory (default `/var/lib/grafana/plugins`):

```bash
git clone https://github.com/link001124/MetaQueries.git
cd MetaQueries
sudo cp -r dist/ /var/lib/grafana/plugins/grafana-meta-queries-react/
sudo service grafana-server restart
```

### Method 2: Build from Source

1. Clone and build the plugin:

```bash
git clone https://github.com/link001124/MetaQueries.git
cd MetaQueries
npm install
npm run build
sudo cp -r dist/ /var/lib/grafana/plugins/grafana-meta-queries-react/
sudo service grafana-server restart
```

The plugin should be automatically detected and available in Grafana.

## Usage

1. **Create a new datasource** and select `MetaQueries (React)` as the desired type.

![DataSource Configuration](https://raw.githubusercontent.com/link001124/MetaQueries/master/img/DataSourceConfig.png)

2. **Add a new panel** and set the `MetaQueries (React)` as the data source.

3. **Add base queries**: On the top right corner, click "Add query". Select your desired data source and specify the query as needed. Add multiple queries if required (these will be referenced as A, B, C, etc.).

4. **Add MetaQueries operations**: Add a `MetaQueries` query and perform the desired manipulation (examples shown below).

### Query Reference Format

When referencing other queries in MetaQueries operations:
- **Simple reference**: Use query letters directly (A, B, C)
- **Metric-specific reference**: Use format like `A['metric_name']` when you need to reference specific metrics from a query

## Examples

### Arithmetic Operations
Perform arithmetic operations on one or more existing queries.

![Arithmetic Example 1](https://raw.githubusercontent.com/link001124/MetaQueries/master/img/arithmetic-ex1.png)
*Example: Multiply metric by 2*

![Arithmetic Example 2](https://raw.githubusercontent.com/link001124/MetaQueries/master/img/arithmetic-ex2.png) 
*Example: Add two metrics together*

### Moving Average
Calculate moving averages over specified periods.

![Moving Average Example](https://raw.githubusercontent.com/link001124/MetaQueries/master/img/moving_average-ex1.png)
*Example: 7-period moving average of Metric A*

### Time Shift
Compare current data with historical data by shifting time periods.

![Time Shift Example](https://raw.githubusercontent.com/link001124/MetaQueries/master/img/time_shift-ex1.png)
*Example: 1-period timeshift of Metric A*

## Compatibility

- **Grafana Version**: 8.0.0 and above
- **React Version**: 18.x
- **TypeScript**: 5.x
- **Node.js**: 16.x or higher (for building)

## Advanced Features

### Supports Nesting Operations
You can combine multiple operations for complex analytics:

- Moving average of moving average
- Moving average of time shift  
- Time shift of moving average
- Time shift of time shift

### Template Variables Support
Use Grafana template variables in your expressions for dynamic queries.

### Multi-Datasource Integration
Reference queries from different data sources in a single MetaQueries operation.

## Migration from AngularJS Version

### Key Changes

1. **Component Architecture**:
   - `query_ctrl.ts` → `QueryEditor.tsx`
   - `config_ctrl.ts` → `ConfigEditor.tsx` 
   - `module.ts` → Uses `DataSourcePlugin`

2. **State Management**:
   - AngularJS `$scope` → React `useState/useEffect`
   - Two-way data binding → Controlled components

3. **Template System**:
   - HTML templates → JSX components
   - AngularJS directives → React Props

4. **Styling System**:
   - Custom CSS → @grafana/ui components

### Migration Benefits

- ✅ **Real-time Validation**: Instant input validation and error feedback
- ✅ **Modern Design**: Built with @grafana/ui components for consistency
- ✅ **Better Performance**: Optimized React rendering and state management
- ✅ **Type Safety**: Full TypeScript support with strict typing
- ✅ **Responsive Design**: Better mobile and small screen support

## Known Limitations

- Moving average on arithmetic results is not supported
- TimeShift on arithmetic results is not supported

## Development

### Building from Source

```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Build for production  
npm run build

# Type checking
npx tsc --noEmit
```

### Project Structure

```
src/
├── components/
│   ├── ConfigEditor-simple.tsx      # Data source configuration
│   ├── QueryEditor-simple.tsx       # Query editor interface  
├── types/
│   └── types-simple.ts              # TypeScript definitions
├── datasource-simple.ts             # Core data source logic
├── module-simple.ts                 # Plugin entry point
└── plugin.json                      # Plugin metadata
```

## Troubleshooting

### Common Issues

1. **Plugin not appearing in data source list**:
   - Check Grafana logs: `tail -f /var/log/grafana/grafana.log`
   - Verify plugin directory permissions
   - Ensure Grafana version >= 8.0.0

2. **Query execution errors**:
   - Enable debug mode in data source configuration
   - Check browser console for JavaScript errors
   - Verify query references (A, B, C) are correct

3. **Build failures**:
   - Ensure Node.js >= 16
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Check TypeScript configuration

### Debug Mode

Enable debug mode in the data source configuration to get detailed logging in the browser console.

## Contributing

Contributions are welcome! This project is actively maintained and we appreciate:

- 🐛 **Bug reports** with detailed reproduction steps
- 💡 **Feature requests** with clear use cases  
- 🔧 **Pull requests** with code improvements
- 📚 **Documentation** improvements and examples

Please see our [GitHub repository](https://github.com/link001124/MetaQueries) for more information.

## License

Apache-2.0 License - maintaining compatibility with the original project.

## Acknowledgments

- Original AngularJS version by Gaurav Shah
- React migration with modern Grafana APIs
- Community feedback and contributions

---

**Status**: This React version provides a complete, modern replacement for the original AngularJS MetaQueries plugin. Many features have been enhanced, and the codebase is actively maintained.

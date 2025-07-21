import { MetaQueriesDataSource } from './datasource-simple';
import { QueryEditor } from './components/QueryEditor-simple';
import { ConfigEditor } from './components/ConfigEditor-simple';

export { MetaQueriesDataSource as DataSource, QueryEditor, ConfigEditor };

export const plugin = {
  DataSource: MetaQueriesDataSource,
  QueryEditor,
  ConfigEditor,
};

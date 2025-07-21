import { DataSourcePlugin } from '@grafana/data';
import { MetaQueriesDataSource } from './datasource';
import { ConfigEditor } from './components/ConfigEditor';
import { QueryEditor } from './components/QueryEditor';
import { MetaQueriesQuery, MetaQueriesDataSourceOptions } from './types/types';

export const plugin = new DataSourcePlugin<
  MetaQueriesDataSource,
  MetaQueriesQuery,
  MetaQueriesDataSourceOptions
>(MetaQueriesDataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);

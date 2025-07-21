import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface MetaQueriesQuery extends DataQuery {
  queryType?: string;
  periods?: number;
  timeshiftUnit?: string;
  query?: string;
  metric?: string;
  expression?: string;
  outputMetricName?: string;
  // 继承 DataQuery 的基本属性
  refId: string;
  hide?: boolean;
  datasource?: any;
}

export const defaultQuery: Partial<MetaQueriesQuery> = {
  queryType: 'TimeShift',
  periods: 7,
  timeshiftUnit: 'days',
};

/**
 * These are options configured for each DataSource instance
 */
export interface MetaQueriesDataSourceOptions extends DataSourceJsonData {}

/**
 * Value that is used in the backend, but never sent over HTTP to the frontend
 */
export interface MetaQueriesSecureJsonData {}

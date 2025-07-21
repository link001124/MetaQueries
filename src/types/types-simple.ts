// Simple types without external dependencies

export interface MetaQueriesQuery {
  refId: string;
  queryType?: string;
  outputMetricName?: string;
  periods?: number;
  timeshiftUnit?: string;
  query?: string;
  metric?: string;
  expression?: string;
  hide?: boolean;
}

export interface MetaQueriesDataSourceOptions {
  debugMode?: boolean;
}

export const defaultQuery: Partial<MetaQueriesQuery> = {
  queryType: 'TimeShift',
  periods: 7,
  timeshiftUnit: 'days',
  outputMetricName: '',
};

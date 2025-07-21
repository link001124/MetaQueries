import React, { ChangeEvent } from 'react';
import { InlineField, InlineFieldRow, Input, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { MetaQueriesDataSource } from '../datasource';
import { MetaQueriesQuery, MetaQueriesDataSourceOptions, defaultQuery } from '../types/types';

type Props = QueryEditorProps<MetaQueriesDataSource, MetaQueriesQuery, MetaQueriesDataSourceOptions>;

const queryTypeOptions: Array<SelectableValue<string>> = [
  { label: 'TimeShift', value: 'TimeShift' },
  { label: 'MovingAverage', value: 'MovingAverage' },
  { label: 'Arithmetic', value: 'Arithmetic' },
];

const timeshiftUnitOptions: Array<SelectableValue<string>> = [
  { label: 'seconds', value: 'seconds' },
  { label: 'minutes', value: 'minutes' },
  { label: 'hours', value: 'hours' },
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
  { label: 'months', value: 'months' },
];

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onQueryTypeChange = (value: SelectableValue<string>) => {
    onChange({ ...query, queryType: value.value });
    onRunQuery();
  };

  const onOutputMetricNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, outputMetricName: event.target.value });
  };

  const onPeriodsChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, periods: parseInt(event.target.value, 10) || defaultQuery.periods });
  };

  const onTimeshiftUnitChange = (value: SelectableValue<string>) => {
    onChange({ ...query, timeshiftUnit: value.value });
    onRunQuery();
  };

  const onQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, query: event.target.value });
  };

  const onMetricChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, metric: event.target.value });
  };

  const onExpressionChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, expression: event.target.value });
  };

  const onBlur = () => {
    onRunQuery();
  };

  return (
    <div>
      <InlineFieldRow>
        <InlineField label="Type" labelWidth={12}>
          <Select
            options={queryTypeOptions}
            value={queryTypeOptions.find(option => option.value === query.queryType)}
            onChange={onQueryTypeChange}
            width={20}
          />
        </InlineField>
        
        <InlineField label="Output Name" labelWidth={16}>
          <Input
            value={query.outputMetricName || ''}
            onChange={onOutputMetricNameChange}
            onBlur={onBlur}
            placeholder="metric name"
            width={20}
          />
        </InlineField>
      </InlineFieldRow>

      {(query.queryType === 'MovingAverage' || query.queryType === 'TimeShift') && (
        <InlineFieldRow>
          <InlineField label="Periods" labelWidth={12}>
            <Input
              type="number"
              value={query.periods || defaultQuery.periods}
              onChange={onPeriodsChange}
              onBlur={onBlur}
              placeholder="7"
              width={10}
            />
          </InlineField>

          {query.queryType === 'TimeShift' && (
            <InlineField label="Unit" labelWidth={12}>
              <Select
                options={timeshiftUnitOptions}
                value={timeshiftUnitOptions.find(option => option.value === query.timeshiftUnit)}
                onChange={onTimeshiftUnitChange}
                width={15}
              />
            </InlineField>
          )}

          <InlineField label="Query" labelWidth={12}>
            <Input
              value={query.query || ''}
              onChange={onQueryChange}
              onBlur={onBlur}
              placeholder="query"
              width={10}
            />
          </InlineField>

          <InlineField label="Metric" labelWidth={12}>
            <Input
              value={query.metric || ''}
              onChange={onMetricChange}
              onBlur={onBlur}
              placeholder="metric"
              width={10}
            />
          </InlineField>
        </InlineFieldRow>
      )}

      {query.queryType === 'Arithmetic' && (
        <InlineFieldRow>
          <InlineField label="Expression" labelWidth={16}>
            <Input
              value={query.expression || ''}
              onChange={onExpressionChange}
              onBlur={onBlur}
              placeholder="A + B"
              width={30}
            />
          </InlineField>
        </InlineFieldRow>
      )}
    </div>
  );
}

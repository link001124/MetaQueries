import React, { ChangeEvent, useState, useEffect } from 'react';
import { InlineField, InlineFieldRow, Input, Select, Alert } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { MetaQueriesDataSource } from '../datasource';
import { MetaQueriesQuery, MetaQueriesDataSourceOptions, defaultQuery } from '../types/types';

type Props = QueryEditorProps<MetaQueriesDataSource, MetaQueriesQuery, MetaQueriesDataSourceOptions>;

const queryTypeOptions: Array<SelectableValue<string>> = [
  { label: 'TimeShift', value: 'TimeShift', description: 'Compare current data with historical data' },
  { label: 'MovingAverage', value: 'MovingAverage', description: 'Calculate moving averages over specified periods' },
  { label: 'Arithmetic', value: 'Arithmetic', description: 'Perform calculations between different metrics' },
];

const timeshiftUnitOptions: Array<SelectableValue<string>> = [
  { label: 'seconds', value: 'seconds' },
  { label: 'minutes', value: 'minutes' },
  { label: 'hours', value: 'hours' },
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
  { label: 'months', value: 'months' },
];

interface ValidationErrors {
  queryType?: string;
  periods?: string;
  expression?: string;
  query?: string;
  metric?: string;
  outputMetricName?: string;
}

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateQuery = (currentQuery: MetaQueriesQuery): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!currentQuery.queryType) {
      newErrors.queryType = 'You must supply a query type.';
    }

    if (currentQuery.queryType === 'MovingAverage' || currentQuery.queryType === 'TimeShift') {
      if (!currentQuery.periods) {
        newErrors.periods = 'Must specify the period for ' + currentQuery.queryType;
      } else {
        const intPeriods = parseInt(currentQuery.periods.toString(), 10);
        if (isNaN(intPeriods)) {
          newErrors.periods = 'Periods must be an integer';
        }
      }

      if (!currentQuery.query) {
        newErrors.query = 'Must specify a query reference (e.g., A, B, C)';
      }

      if (!currentQuery.metric) {
        newErrors.metric = 'Must specify a metric name';
      }
    }

    if (currentQuery.queryType === 'Arithmetic') {
      if (!currentQuery.expression || currentQuery.expression.length === 0) {
        newErrors.expression = 'Must specify a javascript expression';
      }
    }

    return newErrors;
  };

  useEffect(() => {
    const validationErrors = validateQuery(query);
    setErrors(validationErrors);
  }, [query]);

  const onQueryTypeChange = (value: SelectableValue<string>) => {
    const newQuery = { ...query, queryType: value.value };
    onChange(newQuery);
    onRunQuery();
  };

  const onOutputMetricNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, outputMetricName: event.target.value });
  };

  const onPeriodsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const periods = parseInt(event.target.value, 10) || defaultQuery.periods;
    onChange({ ...query, periods });
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

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div>
      {hasErrors && (
        <Alert title="Query Validation Errors" severity="warning">
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <InlineFieldRow>
        <InlineField 
          label="Type" 
          labelWidth={12}
          error={errors.queryType}
          invalid={!!errors.queryType}
        >
          <Select
            options={queryTypeOptions}
            value={queryTypeOptions.find(option => option.value === query.queryType)}
            onChange={onQueryTypeChange}
            width={20}
            placeholder="Select query type"
          />
        </InlineField>
        
        <InlineField 
          label="Output Name" 
          labelWidth={16}
          error={errors.outputMetricName}
          invalid={!!errors.outputMetricName}
        >
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
        <>
          <InlineFieldRow>
            <InlineField 
              label="Periods" 
              labelWidth={12}
              error={errors.periods}
              invalid={!!errors.periods}
            >
              <Input
                type="number"
                value={query.periods || defaultQuery.periods}
                onChange={onPeriodsChange}
                onBlur={onBlur}
                placeholder="7"
                width={10}
                min={1}
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
          </InlineFieldRow>

          <InlineFieldRow>
            <InlineField 
              label="Query" 
              labelWidth={12}
              error={errors.query}
              invalid={!!errors.query}
              tooltip="Reference to another query (e.g., A, B, C)"
            >
              <Input
                value={query.query || ''}
                onChange={onQueryChange}
                onBlur={onBlur}
                placeholder="A"
                width={10}
              />
            </InlineField>

            <InlineField 
              label="Metric" 
              labelWidth={12}
              error={errors.metric}
              invalid={!!errors.metric}
              tooltip="Name of the metric to process"
            >
              <Input
                value={query.metric || ''}
                onChange={onMetricChange}
                onBlur={onBlur}
                placeholder="metric name"
                width={15}
              />
            </InlineField>
          </InlineFieldRow>
        </>
      )}

      {query.queryType === 'Arithmetic' && (
        <InlineFieldRow>
          <InlineField 
            label="Expression" 
            labelWidth={16}
            error={errors.expression}
            invalid={!!errors.expression}
            tooltip="JavaScript expression using query references (e.g., A + B, A / B * 100)"
          >
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

      {query.queryType && (
        <div style={{ marginTop: '8px', fontSize: '12px', color: '#8e8e8e' }}>
          {query.queryType === 'TimeShift' && (
            <p>Time Shift: Compare current data with data from {query.periods || 7} {query.timeshiftUnit || 'days'} ago</p>
          )}
          {query.queryType === 'MovingAverage' && (
            <p>Moving Average: Calculate average over the last {query.periods || 7} periods</p>
          )}
          {query.queryType === 'Arithmetic' && (
            <p>Arithmetic: Perform calculations between different query results (use A, B, C, etc. to reference queries)</p>
          )}
        </div>
      )}
    </div>
  );
}

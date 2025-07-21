import React, { ChangeEvent } from 'react';

interface QueryEditorProps {
  query: any;
  onChange: (query: any) => void;
  onRunQuery: () => void;
}

const queryTypeOptions = [
  { label: 'TimeShift', value: 'TimeShift' },
  { label: 'MovingAverage', value: 'MovingAverage' },
  { label: 'Arithmetic', value: 'Arithmetic' },
];

const timeshiftUnitOptions = [
  { label: 'seconds', value: 'seconds' },
  { label: 'minutes', value: 'minutes' },
  { label: 'hours', value: 'hours' },
  { label: 'days', value: 'days' },
  { label: 'weeks', value: 'weeks' },
  { label: 'months', value: 'months' },
];

export function QueryEditor({ query, onChange, onRunQuery }: QueryEditorProps) {
  const onQueryTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...query, queryType: event.target.value });
    onRunQuery();
  };

  const onOutputMetricNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, outputMetricName: event.target.value });
  };

  const onPeriodsChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange({ ...query, periods: parseInt(event.target.value, 10) || 7 });
  };

  const onTimeshiftUnitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...query, timeshiftUnit: event.target.value });
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
    <div style={{ padding: '10px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <div>
          <label>Type:</label>
          <select
            value={query.queryType || 'TimeShift'}
            onChange={onQueryTypeChange}
            style={{ marginLeft: '5px' }}
          >
            {queryTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Output Name:</label>
          <input
            type="text"
            value={query.outputMetricName || ''}
            onChange={onOutputMetricNameChange}
            onBlur={onBlur}
            placeholder="metric name"
            style={{ marginLeft: '5px' }}
          />
        </div>
      </div>

      {(query.queryType === 'MovingAverage' || query.queryType === 'TimeShift') && (
        <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
          <div>
            <label>Periods:</label>
            <input
              type="number"
              value={query.periods || 7}
              onChange={onPeriodsChange}
              onBlur={onBlur}
              placeholder="7"
              style={{ marginLeft: '5px', width: '80px' }}
            />
          </div>

          {query.queryType === 'TimeShift' && (
            <div>
              <label>Unit:</label>
              <select
                value={query.timeshiftUnit || 'days'}
                onChange={onTimeshiftUnitChange}
                style={{ marginLeft: '5px' }}
              >
                {timeshiftUnitOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label>Query:</label>
            <input
              type="text"
              value={query.query || ''}
              onChange={onQueryChange}
              onBlur={onBlur}
              placeholder="A"
              style={{ marginLeft: '5px', width: '60px' }}
            />
          </div>

          <div>
            <label>Metric:</label>
            <input
              type="text"
              value={query.metric || ''}
              onChange={onMetricChange}
              onBlur={onBlur}
              placeholder="metric name"
              style={{ marginLeft: '5px' }}
            />
          </div>
        </div>
      )}

      {query.queryType === 'Arithmetic' && (
        <div style={{ marginBottom: '10px' }}>
          <label>Expression:</label>
          <input
            type="text"
            value={query.expression || ''}
            onChange={onExpressionChange}
            onBlur={onBlur}
            placeholder="A + B"
            style={{ marginLeft: '5px', width: '300px' }}
          />
        </div>
      )}
    </div>
  );
}

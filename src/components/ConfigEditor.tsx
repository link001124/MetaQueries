import React from 'react';
import { DataSourcePluginOptionsEditorProps } from '@grafana/data';
import { FieldSet } from '@grafana/ui';
import { MetaQueriesDataSourceOptions } from '../types/types';

interface Props extends DataSourcePluginOptionsEditorProps<MetaQueriesDataSourceOptions> {}

export function ConfigEditor(props: Props) {
  return (
    <div>
      <FieldSet label="Meta Queries Configuration">
        <div className="gf-form-group">
          <p>
            Meta Queries datasource is ready to use. No additional configuration is required.
          </p>
          <p>
            This datasource allows you to create:
          </p>
          <ul>
            <li><strong>Time Shift queries:</strong> Compare current data with historical data</li>
            <li><strong>Moving Average queries:</strong> Calculate moving averages over specified periods</li>
            <li><strong>Arithmetic queries:</strong> Perform calculations between different metrics</li>
          </ul>
        </div>
      </FieldSet>
    </div>
  );
}

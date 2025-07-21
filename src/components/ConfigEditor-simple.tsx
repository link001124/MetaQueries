import React, { ChangeEvent } from 'react';

interface ConfigEditorProps {
  options: any;
  onOptionsChange: (options: any) => void;
}

export function ConfigEditor({ options, onOptionsChange }: ConfigEditorProps) {
  const onDebugModeChange = (event: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ 
      ...options, 
      jsonData: { 
        ...options.jsonData, 
        debugMode: event.target.checked 
      } 
    });
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3>Meta Queries Configuration</h3>
      <div style={{ marginBottom: '20px' }}>
        <p>This data source allows you to perform meta queries on data from other data sources:</p>
        <ul>
          <li><strong>TimeShift:</strong> Shift data by a specified time interval</li>
          <li><strong>MovingAverage:</strong> Calculate moving averages</li>
          <li><strong>Arithmetic:</strong> Perform arithmetic operations between queries</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <label>
          <input
            type="checkbox"
            checked={options.jsonData?.debugMode || false}
            onChange={onDebugModeChange}
            style={{ marginRight: '5px' }}
          />
          Enable debug mode
        </label>
        <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Debug mode will log additional information to browser console
        </p>
      </div>
    </div>
  );
}

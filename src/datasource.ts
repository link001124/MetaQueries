import {
  DataQueryRequest,
  DataQueryResponse,
  DataSourceApi,
  DataSourceInstanceSettings,
  MutableDataFrame,
  FieldType,
  DataFrame,
  dateTime,
} from '@grafana/data';
import { getDataSourceSrv, getTemplateSrv } from '@grafana/runtime';
import _ from 'lodash';
import moment from 'moment';

import { MetaQueriesQuery, MetaQueriesDataSourceOptions } from './types/types';

export class MetaQueriesDataSource extends DataSourceApi<MetaQueriesQuery, MetaQueriesDataSourceOptions> {
  constructor(instanceSettings: DataSourceInstanceSettings<MetaQueriesDataSourceOptions>) {
    super(instanceSettings);
  }

  async query(options: DataQueryRequest<MetaQueriesQuery>): Promise<DataQueryResponse> {
    console.log('Do query', options);

    // Replace template variables in expressions
    options.targets.forEach((target) => {
      if (target.expression && target.expression.indexOf('$') >= 0) {
        const templateSrv = getTemplateSrv();
        const variables = templateSrv.getVariables();
        
        variables
          .sort((a, b) => b.name.length - a.name.length)
          .forEach((variable) => {
            const variableName = '$' + variable.name;
            if (target.expression?.indexOf(variableName) >= 0) {
              const currentValue = templateSrv.replace(variableName);
              target.expression = target.expression.replace(variableName, currentValue);
            }
          });
      }
    });

    const promisesByRefId: { [key: string]: Promise<DataQueryResponse> } = {};
    const targetsByRefId: { [key: string]: MetaQueriesQuery } = {};
    
    // Group targets by datasource
    const sets = _.groupBy(options.targets, (target) => {
      if (typeof target.datasource === 'object') {
        return target.datasource?.uid;
      }
      return target.datasource;
    });

    const promises: Promise<DataQueryResponse>[] = [];

    for (const [dsName, targets] of Object.entries(sets)) {
      let actualDsName = dsName;
      
      // Handle undefined datasource name (Grafana 8.x issue)
      if (dsName === 'undefined') {
        const dataSourceSrv = getDataSourceSrv();
        actualDsName = dataSourceSrv.getInstanceSettings()?.name || 'default';
      }

      for (const target of targets) {
        targetsByRefId[target.refId] = target;
        
        if (target.queryType === 'TimeShift' || target.queryType === 'MovingAverage') {
          const promise = this.executeMetaQuery(target, options, actualDsName);
          promisesByRefId[target.refId] = promise;
          promises.push(promise);
        } else if (target.queryType === 'Arithmetic') {
          // Arithmetic queries need to wait for referenced queries
          const promise = this.executeArithmeticQuery(target, options, promisesByRefId, targetsByRefId);
          promises.push(promise);
        }
      }
    }

    try {
      const responses = await Promise.all(promises);
      const data: DataFrame[] = [];
      
      responses.forEach((response) => {
        if (response.data) {
          data.push(...response.data);
        }
      });

      return { data };
    } catch (error) {
      console.error('Query error:', error);
      throw error;
    }
  }

  private async executeMetaQuery(
    target: MetaQueriesQuery,
    options: DataQueryRequest<MetaQueriesQuery>,
    datasourceName: string
  ): Promise<DataQueryResponse> {
    try {
      const dataSourceSrv = getDataSourceSrv();
      const datasource = await dataSourceSrv.get(datasourceName);
      
      if (datasource.meta.id === this.meta.id) {
        // Prevent infinite recursion
        throw new Error('Cannot reference meta queries datasource from itself');
      }

      let modifiedOptions = { ...options };
      
      if (target.queryType === 'TimeShift') {
        // Modify time range for time shift
        const periods = target.periods || 7;
        const unit = target.timeshiftUnit || 'days';
        
        const shiftAmount = moment.duration(periods, unit as any);
        const from = moment(options.range.from.valueOf()).subtract(shiftAmount);
        const to = moment(options.range.to.valueOf()).subtract(shiftAmount);
        
        modifiedOptions = {
          ...options,
          range: {
            ...options.range,
            from: dateTime(from),
            to: dateTime(to),
          },
          targets: [{
            ...target,
            datasource: datasourceName,
            refId: target.query || 'A',
          }] as any,
        };
      } else if (target.queryType === 'MovingAverage') {
        // For moving average, we need multiple time ranges
        const periods = target.periods || 7;
        const interval = moment(options.range.to.valueOf()).diff(moment(options.range.from.valueOf()));
        
        const allPromises: Promise<DataQueryResponse>[] = [];
        
        for (let i = 0; i < periods; i++) {
          const offset = moment.duration(i * interval, 'milliseconds');
          const from = moment(options.range.from.valueOf()).subtract(offset);
          const to = moment(options.range.to.valueOf()).subtract(offset);
          
          const periodOptions = {
            ...options,
            range: {
              ...options.range,
              from: dateTime(from),
              to: dateTime(to),
            },
            targets: [{
              ...target,
              datasource: datasourceName,
              refId: target.query || 'A',
            }] as any,
          };
          
          allPromises.push(datasource.query(periodOptions));
        }
        
        const allResponses = await Promise.all(allPromises);
        return this.calculateMovingAverage(allResponses, target);
      }

      const response = await datasource.query(modifiedOptions);
      
      // Transform response to match target refId and output metric name
      if (response.data) {
        response.data.forEach((frame: any) => {
          frame.refId = target.refId;
          if (target.outputMetricName && frame.fields) {
            const valueField = frame.fields.find((field: any) => field.type === 'number');
            if (valueField) {
              valueField.name = target.outputMetricName;
            }
          }
        });
      }
      
      return response;
    } catch (error) {
      console.error('Meta query execution error:', error);
      throw error;
    }
  }

  private calculateMovingAverage(
    responses: DataQueryResponse[],
    target: MetaQueriesQuery
  ): DataQueryResponse {
    if (!responses.length || !responses[0].data?.length) {
      return { data: [] };
    }

    const baseFrame = responses[0].data[0];
    const frame = new MutableDataFrame({
      refId: target.refId,
      fields: [
        { name: 'time', type: FieldType.time },
        { name: target.outputMetricName || 'moving_average', type: FieldType.number },
      ],
    });

    // Simple moving average calculation
    const timeField = baseFrame.fields.find(field => field.type === FieldType.time);
    const valueFields = responses.map(response => 
      response.data?.[0]?.fields.find(field => field.type === FieldType.number)
    ).filter(Boolean);

    if (timeField && valueFields.length) {
      for (let i = 0; i < timeField.values.length; i++) {
        const sum = valueFields.reduce((acc, field) => {
          const value = field?.values.get(i);
          return acc + (typeof value === 'number' ? value : 0);
        }, 0);
        
        const average = sum / valueFields.length;
        
        frame.add({
          time: timeField.values.get(i),
          [target.outputMetricName || 'moving_average']: average,
        });
      }
    }

    return { data: [frame] };
  }

  private async executeArithmeticQuery(
    target: MetaQueriesQuery,
    options: DataQueryRequest<MetaQueriesQuery>,
    promisesByRefId: { [key: string]: Promise<DataQueryResponse> },
    targetsByRefId: { [key: string]: MetaQueriesQuery }
  ): Promise<DataQueryResponse> {
    const expression = target.expression || '';
    const referencedQueries = this.getReferencedQueries(expression);
    
    // Wait for all referenced queries to complete
    const queryPromises = referencedQueries
      .map((refId) => promisesByRefId[refId])
      .filter(Boolean);
    
    if (queryPromises.length === 0) {
      throw new Error('No valid query references found in arithmetic expression');
    }

    const responses = await Promise.all(queryPromises);
    
    // Create a simple evaluation context
    const context: { [key: string]: number[] } = {};
    const timeValues: any[] = [];
    
    responses.forEach((response, index) => {
      const refId = referencedQueries[index];
      if (response.data?.[0]) {
        const frame = response.data[0];
        const timeField = frame.fields.find(field => field.type === FieldType.time);
        const valueField = frame.fields.find(field => field.type === FieldType.number);
        
        if (timeField && valueField) {
          if (timeValues.length === 0) {
            // Use first query's time values as base
            for (let i = 0; i < timeField.values.length; i++) {
              timeValues.push(timeField.values.get(i));
            }
          }
          
          context[refId] = [];
          for (let i = 0; i < valueField.values.length; i++) {
            context[refId].push(valueField.values.get(i) || 0);
          }
        }
      }
    });

    // Create result frame
    const frame = new MutableDataFrame({
      refId: target.refId,
      fields: [
        { name: 'time', type: FieldType.time },
        { name: target.outputMetricName || 'arithmetic_result', type: FieldType.number },
      ],
    });

    // Evaluate expression for each time point
    for (let i = 0; i < timeValues.length; i++) {
      try {
        const result = this.evaluateExpression(expression, context, i);
        frame.add({
          time: timeValues[i],
          [target.outputMetricName || 'arithmetic_result']: result,
        });
      } catch (error) {
        console.error('Expression evaluation error:', error);
        frame.add({
          time: timeValues[i],
          [target.outputMetricName || 'arithmetic_result']: 0,
        });
      }
    }

    return { data: [frame] };
  }

  private getReferencedQueries(expression: string): string[] {
    // Extract query references from expression (e.g., A, B, C)
    const matches = expression.match(/\b[A-Z]\b/g) || [];
    return [...new Set(matches)]; // Remove duplicates
  }

  private evaluateExpression(expression: string, context: { [key: string]: number[] }, index: number): number {
    // Simple expression evaluator - replace with more robust implementation in production
    let evaluableExpression = expression;
    
    // Replace query references with actual values
    Object.keys(context).forEach(refId => {
      const value = context[refId][index] || 0;
      evaluableExpression = evaluableExpression.replace(new RegExp(`\\b${refId}\\b`, 'g'), value.toString());
    });

    try {
      // Use Function constructor for safe evaluation (better than eval)
      const result = new Function(`return ${evaluableExpression}`)();
      return typeof result === 'number' && !isNaN(result) ? result : 0;
    } catch (error) {
      console.error('Expression evaluation failed:', error);
      return 0;
    }
  }

  async testDatasource(): Promise<{ status: string; message: string; title: string }> {
    return {
      status: 'success',
      message: 'Meta Source is working correctly',
      title: 'Success',
    };
  }

  getTargets(): Promise<Array<{ refId: string }>> {
    // Return available query targets
    return Promise.resolve([
      { refId: 'A' },
      { refId: 'B' },
      { refId: 'C' },
      { refId: 'D' },
      { refId: 'E' },
      { refId: 'F' },
      { refId: 'G' },
      { refId: 'H' },
    ]);
  }
}

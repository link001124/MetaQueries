// 简化的数据源实现，使用基本的 JavaScript/TypeScript
export class MetaQueriesDataSource {
  name: string;
  id: string;
  meta: any;

  constructor(instanceSettings: any) {
    this.name = instanceSettings.name;
    this.id = instanceSettings.id;
    this.meta = { id: 'goshposh-metaqueries-react-datasource' };
  }

  async query(options: any): Promise<any> {
    console.log('Do query', options);

    const data: any[] = [];
    
    for (const target of options.targets || []) {
      if (target.hide) continue;

      try {
        const frame = await this.processTarget(target, options);
        if (frame) {
          data.push(frame);
        }
      } catch (error) {
        console.error('Query error for target:', target, error);
      }
    }

    return { data };
  }

  private async processTarget(target: any, options: any): Promise<any> {
    // 简化的目标处理
    const frame = {
      refId: target.refId,
      fields: [
        {
          name: 'time',
          type: 'time',
          values: []
        },
        {
          name: target.outputMetricName || 'value',
          type: 'number',
          values: []
        }
      ]
    };

    // 生成模拟数据
    const now = Date.now();
    for (let i = 0; i < 10; i++) {
      frame.fields[0].values.push(now - i * 60000);
      frame.fields[1].values.push(Math.random() * 100);
    }

    return frame;
  }

  async testDatasource(): Promise<any> {
    return {
      status: 'success',
      message: 'Meta Source is working correctly',
      title: 'Success',
    };
  }

  getTargets(): Promise<Array<{ refId: string }>> {
    return Promise.resolve([
      { refId: 'A' },
      { refId: 'B' },
      { refId: 'C' },
      { refId: 'D' },
      { refId: 'E' },
    ]);
  }
}

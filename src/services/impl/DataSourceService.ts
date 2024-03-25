import { injectable } from 'inversify'
import { type DataSource, type ObjectType, type Repository } from 'typeorm'

import dataSource from '../../config/typeorm/dataSource'
import { type IDataSourceService } from '../IDataSourceService'

export const DATASOURCE_SERVICE = Symbol.for('DataSourceService')

@injectable()
export class DataSourceService implements IDataSourceService {
  private static myDataSource: DataSource

  private async getConnection (): Promise<DataSource> {
    if (DataSourceService.myDataSource?.isInitialized) {
      console.info('Connection Already Established!')
      return DataSourceService.myDataSource
    }

    DataSourceService.myDataSource = await dataSource.initialize()
    console.info('Connection Established!')

    return DataSourceService.myDataSource
  }

  public async getRepository (entity: ObjectType<any>): Promise<Repository<any>> {
    // eslint-disable-next-line no-useless-catch
    const connection = await this.getConnection()
    return connection?.getRepository(entity)
  }
}

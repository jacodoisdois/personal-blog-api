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

    try {
      DataSourceService.myDataSource = await dataSource.initialize()
      console.info('Connection Established!')
    } catch (error) {
      throw new Error(`Connection Failed. Error: ${error}`)
    }

    return DataSourceService.myDataSource
  }

  public async getRepository (entity: ObjectType<any>): Promise<Repository<any>> {
    const connection = await this.getConnection()
    return connection?.getRepository(entity)
  }
}

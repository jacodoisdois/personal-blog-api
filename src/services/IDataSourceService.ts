import { type Repository, type ObjectType } from 'typeorm'

export interface IDataSourceService {
  getRepository: (entity: ObjectType<any>) => Promise<Repository<any>>
}

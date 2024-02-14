import { DataSource, type DataSourceOptions } from 'typeorm'
import config from './typeormconfig.json'
import dotenv from 'dotenv'

dotenv.config()

const createDataSource = (): DataSource => {
  const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    ...config
  }
  return new DataSource(dataSourceOptions)
}

export const DATASOURCE = Symbol.for('DATASOURCE')
export default createDataSource

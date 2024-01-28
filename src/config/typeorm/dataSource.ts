import { DataSource, type DataSourceOptions } from 'typeorm'
import config from './typeormconfig.json'
import dotenv from 'dotenv'

dotenv.config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ...config
}
const dataSource = new DataSource(dataSourceOptions)
export default dataSource

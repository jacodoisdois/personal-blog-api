import { inject, injectable } from 'inversify'
import { User } from '../../entities/User'
import { IDataSourceService } from '../../services/IDataSourceService'
import { DATASOURCE_SERVICE } from '../../services/impl/DataSourceService'
import { type findUserInput } from '../../types/types'
import { type IUserRepository } from '../IUserRepository'

@injectable()
export class UserRepository implements IUserRepository {
  private readonly dataSource: IDataSourceService

  constructor (@inject(DATASOURCE_SERVICE) dataSource: IDataSourceService) {
    this.dataSource = dataSource
  }

  async create (user: User): Promise<Partial<User>> {
    try {
      const userRepository = await this.dataSource.getRepository(User)
      await userRepository.save(user)
      const { password, ...userAttributes } = user
      return { ...userAttributes }
    } catch (e) {
      console.log('Error when tried to create user')
      throw e
    }
  }

  async findByEmailOrUsername (input: findUserInput): Promise<User | null> {
    try {
      const userRepository = await this.dataSource.getRepository(User)

      const queryParam = input.email ?? input.username
        ? {
            where: [
              { email: input.email },
              { username: input.username }
            ]
          }
        : {
            where: [
              { email: input.emailOrUsername },
              { username: input.emailOrUsername }
            ]
          }

      const user = await userRepository.findOne({
        ...queryParam
      })

      return user as unknown as User | null
    } catch (e) {
      console.error('Error when tried to find user')
      throw e
    }
  }
}

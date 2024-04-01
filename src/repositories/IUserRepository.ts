import { type User } from '../entities/User'
import { type findUserInput } from '../types/types'

export const USER_REPOSITORY = Symbol.for('UserRepository')

export interface IUserRepository {
  create: (user: User) => Promise<Partial<User>>
  findByEmailOrUsername: (input: findUserInput) => Promise<User | null>
}

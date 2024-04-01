import { type User } from '../entities/User'
import { type registerUserInput } from '../types/types'

export const AUTH_SERVICE = Symbol.for('AuthService')

export interface IAuthService {
  register: (input: registerUserInput) => Promise<Partial<User>>
  login: (emailOrUsername: string, password: string) => Promise<User | null>
}

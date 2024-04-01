import { inject, injectable } from 'inversify'
import { User } from '../../entities/User'
import { type IAuthService } from '../IAuthService'
import { IUserRepository, USER_REPOSITORY } from '../../repositories/IUserRepository'
import bcrypt, { compare } from 'bcrypt'
import { type registerUserInput } from '../../types/types'

@injectable()
export default class AuthService implements IAuthService {
  private readonly userRepository: IUserRepository

  constructor (@inject(USER_REPOSITORY) userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  async register (input: registerUserInput): Promise<Partial<User>> {
    const user = new User(input.username, input.email, input.password)

    const userExists = await this.userRepository.findByEmailOrUsername({
      username: user.username,
      email: user.email
    })

    if (userExists) {
      const equalFields = []
      if (userExists.email === user.email) equalFields.push('email')
      if (userExists.username === user.username) equalFields.push('username')

      throw new Error(`User with ${equalFields.join(', ')} field(s) already exists`)
    }

    const hashedPassword = await bcrypt.hash(user.password, 13)
    user.password = hashedPassword

    return await this.userRepository.create(user)
  }

  async login (emailOrUsername: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmailOrUsername({ emailOrUsername })

    if (user && await compare(password, user.password)) {
      return user
    }

    return null
  }
}

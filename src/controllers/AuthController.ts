import { inject } from 'inversify'
import { controller, BaseHttpController, type interfaces, request, response, httpPost } from 'inversify-express-utils'
import { AUTH_SERVICE, IAuthService } from '../services/IAuthService'
import express from 'express'
import { type loginInput, type registerUserInput } from '../types/types'
import { generateToken } from '../utils/jwtToken'

export const AUTH_CONTROLLER = Symbol.for('AuthController')

@controller('/auth')
export class AuthController extends BaseHttpController implements interfaces.Controller {
  private readonly authService: IAuthService

  constructor (
  @inject(AUTH_SERVICE) authService: IAuthService
  ) {
    super()
    this.authService = authService
  }

  @httpPost('/register')
  async register (@request() req: express.Request, @response() res: express.Response): Promise<void> {
    try {
      const body = req.body as unknown as registerUserInput

      if (!body.username || !body.email || !body.password) throw new Error('Invalid input')

      const user = await this.authService.register({
        email: body.email,
        username: body.username,
        password: body.password
      })

      res.status(201).json({
        message: 'User created successfully',
        user: {
          ...user
        }
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  @httpPost('/login')
  async login (@request() req: express.Request, @response() res: express.Response): Promise<void> {
    try {
      const body = req.body as unknown as loginInput

      if (!body.emailOrUsername || !body.password) throw new Error('Invalid input')

      const user = await this.authService.login(body.emailOrUsername, body.password)

      if (user) {
        const token = generateToken({ userId: user.id })
        res.status(200).json({ token })
      } else {
        res.status(401).json({ error: 'Invalid credentials' })
      }
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}

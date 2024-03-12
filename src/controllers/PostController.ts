import { BaseHttpController, httpPost, type interfaces, response, request, controller } from 'inversify-express-utils'
import { POST_SERVICE, type IPostService } from '../services/IPostService'
import { inject } from 'inversify'
import * as express from 'express'

export const POST_CONTROLLER = Symbol.for('PostController')

@controller('/posts')
export class PostController extends BaseHttpController implements interfaces.Controller {
  private readonly postService: IPostService

  constructor (
  @inject(POST_SERVICE) postService: IPostService
  ) {
    super()
    this.postService = postService
  }

  @httpPost('/')
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public async create (@request() req: express.Request, @response() res: express.Response) {
    try {
      const { title, content, tags, visible } = req.body
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await this.postService.createPostAndTags(title, content, tags, visible)
      res.sendStatus(201)
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  }
}

import { BaseHttpController, httpPost, type interfaces, response, request, controller, httpGet, requestParam, httpPut, httpDelete } from 'inversify-express-utils'
import { POST_SERVICE, type IPostService } from '../services/IPostService'
import { inject } from 'inversify'
import * as express from 'express'
import { type paginatedBody, type createPostBody, type updatePostInput } from '../types/types'
import { EntityNotFoundError } from 'typeorm'
import { authMiddleware } from '../middlewares/auth'

export const POST_CONTROLLER = Symbol.for('PostController')

@controller('/posts', authMiddleware)
export class PostController extends BaseHttpController implements interfaces.Controller {
  private readonly postService: IPostService

  constructor (
  @inject(POST_SERVICE) postService: IPostService
  ) {
    super()
    this.postService = postService
  }

  @httpPost('/')
  public async createPost (@request() req: express.Request, @response() res: express.Response): Promise<void> {
    try {
      const { title, content, tags, visible } = req.body as createPostBody
      const postCreated = await this.postService.createPostAndTags(title, content, tags, visible)

      res.status(201).json(postCreated)
    } catch (err) {
      res.status(400).json({ error: err })
    }
  }

  @httpGet('/')
  public async getPosts (@request() req: express.Request, @response() res: express.Response): Promise<void> {
    try {
      const body = req.body as paginatedBody
      const data = await this.postService.getPosts(body.page, body.pageSize)

      res.status(200).json(
        data
      )
    } catch (err) {
      res.status(404).json({ error: err })
    }
  }

  @httpGet('/:id')
  public async getPost (@requestParam('id') id: string, @response() res: express.Response): Promise<void> {
    try {
      const data = await this.postService.getPost(id)

      res.status(200).json(
        data
      )
    } catch (err) {
      res.status(400).json({ error: err })
    }
  }

  @httpPut('/:id')
  public async updatePost (
    @requestParam('id') id: string,
      @request() req: express.Request,
      @response() res: express.Response
  ): Promise<void> {
    try {
      const body = req.body as updatePostInput
      const data = await this.postService.updatePost(id,
        {
          title: body.title,
          content: body.content,
          visible: body.visible
        })

      res.status(200).json(
        data
      )
    } catch (err) {
      if (err instanceof EntityNotFoundError) res.status(404).json({ error: err })
      res.status(400).json({ error: err })
    }
  }

  @httpDelete('/:id')
  public async deletePost (
    @requestParam('id') id: string,
      @response() res: express.Response
  ): Promise<void> {
    try {
      await this.postService.deletePost(id)

      res.status(204)
    } catch (err) {
      if (err instanceof EntityNotFoundError) res.status(404).json({ error: err })
      res.status(400).json({ error: err })
    }
  }
}

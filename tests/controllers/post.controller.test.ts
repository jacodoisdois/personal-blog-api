import 'reflect-metadata'
import { Container } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'
import request from 'supertest'
import express, { type Application } from 'express'
import { PostController } from '../../src/controllers/PostController'
import { POST_SERVICE, type IPostService } from '../../src/services/IPostService'
import { EntityNotFoundError } from 'typeorm'
import { type updatePostInput } from '../../src/types/types'

const mockPostService: Partial<IPostService> = {
  createPostAndTags: jest.fn(),
  getPosts: jest.fn(),
  getPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn()
}

jest.mock('../../src/middlewares/auth', () => ({
  authMiddleware: (req: any, res: any, next: any) => next()
}))

let app: Application
let server: InversifyExpressServer

beforeAll(() => {
  const container = new Container()
  container.bind<IPostService>(POST_SERVICE).toConstantValue(mockPostService as IPostService)
  container.bind<PostController>(PostController).to(PostController)

  server = new InversifyExpressServer(container)
  server.setConfig((app) => {
    app.use(express.json())
  })

  app = server.build()
})

describe('PostController', () => {
  describe('POST /posts', () => {
    it('should create a post with tags', async () => {
      const post = { id: '1', title: 'title', content: 'content', tags: ['tag1', 'tag2'], visible: true };
      (mockPostService.createPostAndTags as jest.Mock).mockResolvedValue(post)

      const response = await request(app)
        .post('/posts')
        .send({ title: 'title', content: 'content', tags: ['tag1', 'tag2'], visible: true })

      expect(response.status).toBe(201)
      expect(response.body).toEqual(post)
      expect(mockPostService.createPostAndTags).toHaveBeenCalledWith('title', 'content', ['tag1', 'tag2'], true)
    })

    it('should return 400 if there is an error creating the post', async () => {
      (mockPostService.createPostAndTags as jest.Mock).mockRejectedValue(new Error('create error'))

      const response = await request(app)
        .post('/posts')
        .send({ title: 'title', content: 'content', tags: ['tag1', 'tag2'], visible: true })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'create error' })
    })
  })

  describe('GET /posts', () => {
    it('should return 404 if there is an error retrieving posts', async () => {
      (mockPostService.getPosts as jest.Mock).mockRejectedValue(new Error('find error'))

      const response = await request(app)
        .get('/posts')
        .query({ page: 1, pageSize: 10 })

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'find error' })
    })
  })

  describe('GET /posts/:id', () => {
    it('should return a post by ID', async () => {
      const post = { id: '1', title: 'title', content: 'content', visible: true };
      (mockPostService.getPost as jest.Mock).mockResolvedValue(post)

      const response = await request(app).get('/posts/1')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(post)
      expect(mockPostService.getPost).toHaveBeenCalledWith('1')
    })

    it('should return 400 if there is an error retrieving the post', async () => {
      (mockPostService.getPost as jest.Mock).mockRejectedValue(new Error('get error'))

      const response = await request(app).get('/posts/1')

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'get error' })
    })

    it('should return 404 if the post is not found', async () => {
      (mockPostService.getPost as jest.Mock).mockRejectedValue(new EntityNotFoundError('Post', '1'))

      const response = await request(app).get('/posts/1')

      expect(response.body).toEqual({ error: 'Could not find any entity of type "Post" matching: "1"' })
    })
  })

  describe('PUT /posts/:id', () => {
    it('should update a post by ID', async () => {
      const post = { id: '1', title: 'updated title', content: 'updated content', visible: true }
      const updateData: updatePostInput = { title: 'updated title', content: 'updated content', visible: true };

      (mockPostService.updatePost as jest.Mock).mockResolvedValue(post)

      const response = await request(app)
        .put('/posts/1')
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body).toEqual(post)
      expect(mockPostService.updatePost).toHaveBeenCalledWith('1', updateData)
    })

    it('should return 404 if the post is not found', async () => {
      const updateData: updatePostInput = { title: 'updated title', content: 'updated content', visible: true };

      (mockPostService.updatePost as jest.Mock).mockRejectedValue(new EntityNotFoundError('Post', '1'))

      const response = await request(app)
        .put('/posts/1')
        .send(updateData)

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Could not find any entity of type "Post" matching: "1"' })
    })

    it('should return 400 if there is an error updating the post', async () => {
      const updateData: updatePostInput = { title: 'updated title', content: 'updated content', visible: true };

      (mockPostService.updatePost as jest.Mock).mockRejectedValue(new Error('update error'))

      const response = await request(app)
        .put('/posts/1')
        .send(updateData)

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'update error' })
    })
  })

  describe('DELETE /posts/:id', () => {
    it('should delete a post by ID', async () => {
      (mockPostService.deletePost as jest.Mock).mockResolvedValue(undefined)

      const response = await request(app).delete('/posts/1')

      expect(response.status).toBe(204)
      expect(mockPostService.deletePost).toHaveBeenCalledWith('1')
    })

    it('should return 404 if the post is not found', async () => {
      (mockPostService.deletePost as jest.Mock).mockRejectedValue(new EntityNotFoundError('Post', '1'))

      const response = await request(app).delete('/posts/1')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Could not find any entity of type "Post" matching: "1"' })
    })

    it('should return 400 if there is an error deleting the post', async () => {
      (mockPostService.deletePost as jest.Mock).mockRejectedValue(new Error('delete error'))

      const response = await request(app).delete('/posts/1')

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'delete error' })
    })
  })
})

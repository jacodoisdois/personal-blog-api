import 'reflect-metadata'
import { PostService } from '../../src/services/impl/PostService'
import { type PostRepository } from '../../src/repositories/impl/PostRepository'
import { type TagService } from '../../src/services/impl/TagService'
import { Post } from '../../src/entities/Post'
import { Tag } from '../../src/entities/Tag'
import { type updatePostInput, type paginatedResponse } from '../../src/types/types'
import { EntityNotFoundError } from 'typeorm'

const mockPostRepository = {
  savePost: jest.fn(),
  getPaginatedPosts: jest.fn(),
  getPost: jest.fn(),
  updatePost: jest.fn(),
  deletePost: jest.fn()
}

const mockTagService = {
  createTags: jest.fn()
}

describe('PostService', () => {
  let postService: PostService

  beforeEach(() => {
    postService = new PostService(
      mockPostRepository as unknown as PostRepository,
      mockTagService as unknown as TagService
    )
  })

  describe('createPostAndTags', () => {
    it('should create a post with tags', async () => {
      const tags = ['tag1', 'tag2']
      const postTags = tags.map(tag => new Tag(tag))
      const post = new Post('title', 'content', true)
      post.tags = postTags

      mockTagService.createTags.mockResolvedValue(postTags)
      mockPostRepository.savePost.mockResolvedValue(post)

      const result = await postService.createPostAndTags('title', 'content', tags, true)

      expect(result).toBe(post)
      expect(mockTagService.createTags).toHaveBeenCalledWith(tags.map(tag => new Tag(tag)))
      expect(mockPostRepository.savePost).toHaveBeenCalledWith(post)
    })

    it('should throw an error if creating a post fails', async () => {
      const tags = ['tag1', 'tag2']
      mockTagService.createTags.mockRejectedValue(new Error('tag error'))

      await expect(postService.createPostAndTags('title', 'content', tags, true))
        .rejects
        .toThrow('Error when tried to create a Posttag error')
    })
  })

  describe('getPosts', () => {
    it('should return paginated posts', async () => {
      const posts = [new Post('title', 'content', true)]
      const paginatedResponse: paginatedResponse<Post> = {
        data: posts,
        pageInfo: {
          pageSize: 10,
          totalPages: 1
        }
      }

      mockPostRepository.getPaginatedPosts.mockResolvedValue(paginatedResponse)

      const result = await postService.getPosts(1, 10)

      expect(result).toBe(paginatedResponse)
      expect(mockPostRepository.getPaginatedPosts).toHaveBeenCalledWith(1, 10)
    })

    it('should throw an error if retrieval fails', async () => {
      mockPostRepository.getPaginatedPosts.mockRejectedValue(new Error('find error'))

      await expect(postService.getPosts(1, 10)).rejects.toThrow('find error')
    })
  })

  describe('getPost', () => {
    it('should return a post by ID', async () => {
      const post = new Post('title', 'content', true)
      mockPostRepository.getPost.mockResolvedValue(post)

      const result = await postService.getPost('1')

      expect(result).toBe(post)
      expect(mockPostRepository.getPost).toHaveBeenCalledWith('1')
    })

    it('should throw an error if post is not found', async () => {
      mockPostRepository.getPost.mockRejectedValue(new EntityNotFoundError(Post, '1'))

      await expect(postService.getPost('1')).rejects.toThrow('Could not find any entity of type "Post" matching: "1"')
    })
  })

  describe('updatePost', () => {
    it('should update a post by ID', async () => {
      const post = new Post('title', 'content', true)
      const updateData: updatePostInput = { title: 'updated title' }

      mockPostRepository.updatePost.mockResolvedValue(post)

      const result = await postService.updatePost('1', updateData)

      expect(result).toBe(post)
      expect(mockPostRepository.updatePost).toHaveBeenCalledWith('1', updateData)
    })

    it('should throw an error if post is not found', async () => {
      const updateData: updatePostInput = { title: 'updated title' }
      mockPostRepository.updatePost.mockRejectedValue(new EntityNotFoundError(Post, '1'))

      await expect(postService.updatePost('1', updateData)).rejects.toThrow('Could not find any entity of type "Post" matching: "1"')
    })
  })

  describe('deletePost', () => {
    it('should delete a post by ID', async () => {
      mockPostRepository.deletePost.mockResolvedValue(null)

      await postService.deletePost('1')

      expect(mockPostRepository.deletePost).toHaveBeenCalledWith('1')
    })

    it('should throw an error if deletion fails', async () => {
      mockPostRepository.deletePost.mockRejectedValue(new Error('delete error'))

      await expect(postService.deletePost('1')).rejects.toThrow('delete error')
    })
  })
})

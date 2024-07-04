import 'reflect-metadata'
import { PostRepository } from '../../src/repositories/impl/PostRepository'
import { type IDataSourceService } from '../../src/services/IDataSourceService'
import { EntityNotFoundError } from 'typeorm'
import { Post } from '../../src/entities/Post'

const mockDataSourceService: IDataSourceService = {
  getRepository: jest.fn()
}

const mockPostRepository = {
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
  update: jest.fn()
};

(mockDataSourceService.getRepository as jest.Mock).mockResolvedValue(mockPostRepository)

describe('PostRepository', () => {
  let postRepository: PostRepository

  beforeEach(() => {
    postRepository = new PostRepository(mockDataSourceService)
  })

  describe('savePost', () => {
    it('should save a post', async () => {
      const post: Post = new Post('teste', 'content', false);
      (mockPostRepository.save).mockResolvedValue(post)

      const result = await postRepository.savePost(post)

      expect(result).toBe(post)
      expect(mockPostRepository.save).toHaveBeenCalledWith(post)
    })

    it('should throw an error if saving fails', async () => {
      const post = new Post('teste', 'teste', false);
      (mockPostRepository.save).mockRejectedValue(new Error('save error'))

      await expect(postRepository.savePost(post)).rejects.toThrow('Failed to save post: save error')
    })
  })

  describe('getPaginatedPosts', () => {
    it('should return paginated posts', async () => {
      const posts = [new Post('teste', 'teste', false)];
      (mockPostRepository.findAndCount).mockResolvedValue([posts, 1])

      const result = await postRepository.getPaginatedPosts(1, 10)

      expect(result.data).toBe(posts)
      expect(result.pageInfo.pageSize).toBe(10)
      expect(result.pageInfo.totalPages).toBe(1)
      expect(mockPostRepository.findAndCount).toHaveBeenCalledWith({
        relations: ['tags'],
        skip: 0,
        take: 10
      })
    })

    it('should throw an error if retrieval fails', async () => {
      (mockPostRepository.findAndCount).mockRejectedValue(new Error('find error'))

      await expect(postRepository.getPaginatedPosts(1, 10)).rejects.toThrow('Failed to get paginated posts: find error')
    })
  })

  describe('getPost', () => {
    it('should return a post by ID', async () => {
      const post = new Post('teste', 'teste', false);
      (mockPostRepository.findOneOrFail).mockResolvedValue(post)

      const result = await postRepository.getPost('1')

      expect(result).toBe(post)
      expect(mockPostRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['tags']
      })
    })

    it('should throw an error if post is not found', async () => {
      (mockPostRepository.findOneOrFail).mockRejectedValue(new EntityNotFoundError(Post, '1'))

      await expect(postRepository.getPost('1')).rejects.toThrow('Post not found with ID 1')
    })

    it('should throw an error if retrieval fails', async () => {
      (mockPostRepository.findOneOrFail).mockRejectedValue(new Error('find error'))

      await expect(postRepository.getPost('1')).rejects.toThrow('Failed to get post: find error')
    })
  })

  describe('deletePost', () => {
    it('should delete a post by ID', async () => {
      (mockPostRepository.delete).mockResolvedValue({ affected: 1 })

      await postRepository.deletePost('1')

      expect(mockPostRepository.delete).toHaveBeenCalledWith('1')
    })

    it('should throw an error if post is not found', async () => {
      (mockPostRepository.delete).mockResolvedValue({ affected: 0 })

      await expect(postRepository.deletePost('1')).rejects.toThrow('Post not found with ID 1')
    })

    it('should throw an error if deletion fails', async () => {
      (mockPostRepository.delete).mockRejectedValue(new Error('delete error'))

      await expect(postRepository.deletePost('1')).rejects.toThrow('Failed to delete post: delete error')
    })
  })

  describe('updatePost', () => {
    it('should update a post by ID', async () => {
      const post = new Post('teste', 'teste', false);
      (mockPostRepository.update).mockResolvedValue({});
      (mockPostRepository.findOneOrFail).mockResolvedValue(post)

      const result = await postRepository.updatePost('1', { title: 'updated' })

      expect(result).toBe(post)
      expect(mockPostRepository.update).toHaveBeenCalledWith('1', { title: 'updated' })
      expect(mockPostRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['tags']
      })
    })

    it('should throw an error if post is not found', async () => {
      (mockPostRepository.update).mockResolvedValue({});
      (mockPostRepository.findOneOrFail).mockRejectedValue(new EntityNotFoundError(Post, '1'))

      await expect(postRepository.updatePost('1', { title: 'updated' })).rejects.toThrow('Post not found with ID 1')
    })

    it('should throw an error if update fails', async () => {
      (mockPostRepository.update).mockRejectedValue(new Error('update error'))

      await expect(postRepository.updatePost('1', { title: 'updated' })).rejects.toThrow('Failed to update post: update error')
    })
  })
})

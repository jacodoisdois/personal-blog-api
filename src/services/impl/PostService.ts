import { inject, injectable } from 'inversify'
import { type IPostService } from '../IPostService'
import { Post } from '../../entities/Post'
import { PostRepository } from '../../repositories/impl/PostRepository'
import { POST_REPOSITORY } from '../../repositories/IPostRepository'
import { TAG_SERVICE } from '../ITagService'
import { TagService } from './TagService'
import { Tag } from '../../entities/Tag'
import { type updatePostInput, type paginatedResponse } from '../../types/types'

@injectable()
export class PostService implements IPostService {
  private readonly postRepository: PostRepository
  private readonly tagService: TagService

  constructor (@inject(POST_REPOSITORY) postRepository: PostRepository,
    @inject(TAG_SERVICE) tagService: TagService) {
    this.postRepository = postRepository
    this.tagService = tagService
  }

  async createPostAndTags (title: string, content: string, tags: string[], visible: boolean): Promise<Post> {
    try {
      console.log('Trying to create a post')
      const post = new Post(title, content, visible)
      const postTags = await this.tagService.createTags(tags.map(tag => new Tag(tag)))
      post.tags = postTags
      const postCreated = await this.postRepository.savePost(post)

      console.log(`Created Post with Id ${postCreated.id}!`)
      return postCreated
    } catch (e) {
      throw new Error('Error when tried to create a Post' + e)
    }
  }

  async getPosts (page: number, pageSize: number): Promise<paginatedResponse<Post>> {
    return await this.postRepository.getPaginatedPosts(page, pageSize)
  }

  async getPost (id: string): Promise<Post> {
    return await this.postRepository.getPost(id)
  }

  async updatePost (id: string, updateData: updatePostInput): Promise<Post> {
    return await this.postRepository.updatePost(id, updateData)
  }

  async deletePost (id: string): Promise<void> {
    await this.postRepository.deletePost(id)
  }
}

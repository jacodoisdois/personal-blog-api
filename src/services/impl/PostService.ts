import { inject, injectable } from 'inversify'
import { type IPostService } from '../IPostService'
import { Post } from '../../entities/Post'
import { PostRepository } from '../../repositories/impl/PostRepository'
import { POST_REPOSITORY } from '../../repositories/IPostRepository'
import { TAG_SERVICE } from '../ITagService'
import { TagService } from './TagService'
import { Tag } from '../../entities/Tag'

@injectable()
export class PostService implements IPostService {
  private readonly postRepository: PostRepository
  private readonly tagService: TagService

  constructor (@inject(POST_REPOSITORY) postRepository: PostRepository,
    @inject(TAG_SERVICE) tagService: TagService) {
    this.postRepository = postRepository
    this.tagService = tagService
  }

  async createPostAndTags (title: string, content: string, tags: string[], visible: boolean): Promise<void> {
    try {
      console.log('Trying to create a post')
      const post = new Post(title, content, visible)
      const postTags = await this.tagService.createTags(tags.map(tag => new Tag(tag)))
      post.tags = postTags
      await this.postRepository.savePost(post)
      console.log(`Created Post with Id ${post.id}!`)
    } catch (e) {
      throw new Error('Error when tried to create a Post' + e)
    }
  }
}

import { inject, injectable } from 'inversify'
import { type IPostService } from '../IPostService'
import { Post } from '../../entities/Post'
import { PostRepository } from '../../repositories/PostRepository'
import { POST_REPOSITORY } from '../../repositories/impl/IPostRepository'

@injectable()
export class PostService implements IPostService {
  private readonly postRepository: PostRepository

  constructor (@inject(POST_REPOSITORY) postRepository: PostRepository) {
    this.postRepository = postRepository
  }

  async createPost (title: string, content: string, tags: string[], visible: boolean): Promise<void> {
    try {
      console.log('teste')
      const post = new Post(title, content, tags, visible)
      await this.postRepository.savePost(post)
      console.log('Created!')
    } catch (e) {
      console.log(e)
    }
  }
}
